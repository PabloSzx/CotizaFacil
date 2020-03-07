import { FC, useCallback } from "react";
import { Checkbox } from "semantic-ui-react";

import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/core";

import mockData from "../../mockData.json";
import { ProductSelectionStore } from "../Context/ProductSelection";

const StoreRow: FC<{ name: string }> = ({ name }) => {
  const isChecked = ProductSelectionStore.hooks.useIsStoreSelected(name);
  const toggleCheckbox = useCallback(() => {
    ProductSelectionStore.actions.toggleStoreSelected(name);
  }, [name]);
  return (
    <Flex padding="10px" alignItems="center">
      <Checkbox checked={isChecked} onChange={toggleCheckbox} />
      <Text paddingLeft="10px">{name}</Text>
    </Flex>
  );
};

export const StoreSelection: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(false);

  return (
    <>
      <Button onClick={onOpen}>Tiendas</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Stack padding="20px">
            {mockData.stores.map((store, key) => {
              return <StoreRow key={key} name={store} />;
            })}
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};
