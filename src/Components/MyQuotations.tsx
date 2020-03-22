import { format } from "date-fns-tz";
import { es } from "date-fns/locale";
import { FC } from "react";
import { Button, ButtonProps, Icon, Table } from "semantic-ui-react";

import { useQuery } from "@apollo/react-hooks";
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
import { MY_QUOTATIONS } from "../graphql/quotation";
import { QuotationStore } from "./SaveQuotation";

export const MyQuotations: FC<ButtonProps> = props => {
  const { data, loading } = useQuery(MY_QUOTATIONS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true
  });
  const disclosure = useDisclosure();

  return (
    <>
      <Button
        color="black"
        icon
        labelPosition="left"
        {...props}
        onClick={disclosure.onOpen}
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
                    {data?.myQuotations.map(quotation => {
                      return (
                        <Table.Row key={quotation.id}>
                          <Table.Cell>{quotation.name}</Table.Cell>
                          <Table.Cell>
                            {format(
                              new Date(quotation.date),
                              "d 'de' MMMM 'del' yyyy HH:mm:ss (z)",
                              {
                                timeZone: "America/Santiago",
                                locale: es
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
                            <Button negative icon labelPosition="left">
                              <Icon name="remove circle" />
                              Eliminar
                            </Button>
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
