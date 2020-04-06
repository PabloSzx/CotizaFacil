import { format } from "date-fns-tz";
import { es } from "date-fns/locale";
import Router from "next/router";
import { FC, useCallback, useContext, useRef } from "react";
import { Button, ButtonProps, Icon, Table } from "semantic-ui-react";

import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
} from "@chakra-ui/core";

import { ProductSelectionStore } from "../Context/ProductSelection";
import { MY_QUOTATIONS, REMOVE_QUOTATION } from "../graphql/quotation";
import { AuthContext } from "../Context/Auth";
import { Confirm } from "./Confirm";
import { QuotationStore } from "./SaveQuotation";

export const MyQuotations: FC<ButtonProps> = (props) => {
  const { data, loading } = useQuery(MY_QUOTATIONS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  const dataRef = useRef<{ id?: number }>({});
  const [removeQuotation] = useMutation(REMOVE_QUOTATION, {
    update: (cache) => {
      if (data && dataRef?.current.id !== undefined) {
        cache.writeQuery({
          query: MY_QUOTATIONS,
          data: {
            ...data,
            myQuotations: data.myQuotations.filter(
              (quotation) => quotation.id !== dataRef.current.id
            ),
          },
        });
      }
    },
  });
  const disclosure = useDisclosure();
  const { user } = useContext(AuthContext);
  const onOpenMyQuotations = useCallback(() => {
    if (user) {
      disclosure.onOpen();
    } else {
      Router.push("/login");
    }
  }, [user, disclosure.onOpen]);

  return (
    <>
      <Button
        color="black"
        icon
        labelPosition="left"
        {...props}
        onClick={onOpenMyQuotations}
      >
        <Icon name="book" />
        Mis cotizaciones
      </Button>
      <Modal {...disclosure} size="fit-content" preserveScrollBarGap>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mis cotizaciones</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              {loading && (
                <Box alignSelf="center">
                  <Spinner size="lg" />
                </Box>
              )}
              <Box>
                <Table selectable celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Nombre</Table.HeaderCell>
                      <Table.HeaderCell>Fecha</Table.HeaderCell>
                      <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data?.myQuotations.map((quotation) => {
                      return (
                        <Table.Row key={quotation.id}>
                          <Table.Cell>{quotation.name}</Table.Cell>
                          <Table.Cell>
                            {format(
                              new Date(quotation.date),
                              "d 'de' MMMM 'del' yyyy HH:mm:ss (z)",
                              {
                                timeZone: "America/Santiago",
                                locale: es,
                              }
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              color="green"
                              icon
                              labelPosition="left"
                              onClick={() => {
                                QuotationStore.actions.setName(quotation.name);
                                ProductSelectionStore.actions.loadQuotationSelection(
                                  quotation.products
                                );
                                disclosure.onClose();
                                QuotationStore.actions.setIsModalOpen(true);
                              }}
                            >
                              <Icon name="arrow alternate circle up" />
                              Cargar
                            </Button>
                            <Confirm
                              header={`¿Estás seguro que deseas eliminar la cotización ${quotation.name}-${quotation.date}?`}
                              content="Será eliminada de forma permanente de tu cuenta"
                              confirmButton="Estoy seguro"
                              cancelButton="Cancelar"
                            >
                              <Button
                                negative
                                icon
                                labelPosition="left"
                                onClick={async () => {
                                  dataRef.current.id = quotation.id;
                                  await removeQuotation({
                                    variables: {
                                      quotation_id: quotation.id,
                                    },
                                    optimisticResponse: {
                                      removeQuotation: true,
                                    },
                                  });
                                }}
                              >
                                <Icon name="remove circle" />
                                Eliminar
                              </Button>
                            </Confirm>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
