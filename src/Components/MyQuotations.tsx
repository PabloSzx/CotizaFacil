import { FC } from "react";
import { Button, ButtonProps, Icon } from "semantic-ui-react";

import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/core";

import { MY_QUOTATIONS } from "../graphql/quotation";

export const MyQuotations: FC<ButtonProps> = props => {
  const { data } = useQuery(MY_QUOTATIONS, {
    fetchPolicy: "cache-and-network"
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
      <Modal {...disclosure} size="fit-content">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mis cotizaciones</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {JSON.stringify(data)}
            <Stack>
              {data?.myQuotations.map(product => {
                return JSON.stringify(product, null, 2);
              })}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
