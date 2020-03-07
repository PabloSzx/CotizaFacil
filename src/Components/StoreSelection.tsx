import { FC, useCallback } from "react";
import { Checkbox } from "semantic-ui-react";

import { useQuery } from "@apollo/react-hooks";
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

import { ProductSelectionStore } from "../Context/ProductSelection";
import { ALL_STORES } from "../graphql/search";

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

  const { loading, data } = useQuery(ALL_STORES);
  return (
    <>
      <Button onClick={onOpen} isDisabled={loading} isLoading={loading}>
        Tiendas
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} preserveScrollBarGap>
        <ModalOverlay />
        <ModalContent>
          <Stack padding="20px">
            {data?.stores.map((store, key) => {
              return <StoreRow key={key} name={store.name} />;
            })}
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};
