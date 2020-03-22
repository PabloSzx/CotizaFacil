import { reduce, toInteger } from "lodash";
import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createStore } from "react-state-selector";
import { Button, ButtonProps, Icon, Input, Table } from "semantic-ui-react";
import { useRememberState } from "use-remember-state";

import { useMutation } from "@apollo/react-hooks";
import {
  Box,
  BoxProps,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/core";

import { priceStringToNumber } from "../../shared/utils";
import { ProductSelectionStore } from "../Context/ProductSelection";
import { CREATE_QUOTATION, MY_QUOTATIONS } from "../graphql/quotation";

const QuotationStore = createStore(
  {
    totalPrice: 0,
    productsPrice: {} as Record<string, number>
  },
  {
    hooks: {
      useTotalPrice: ({ totalPrice }) => totalPrice
    },
    actions: {
      setProductPrice: (product: string, price: number) => draft => {
        if (price === 0) {
          delete draft.productsPrice[product];
        } else {
          draft.productsPrice[product] = price;
        }
        draft.totalPrice = reduce(
          draft.productsPrice,
          (acum, value) => {
            acum += value;
            return acum;
          },
          0
        );
      }
    }
  }
);

const ProductRow: FC<{ product: string; index: number }> = memo(
  ({ product, index }) => {
    const info = ProductSelectionStore.hooks.useProductInfo(product);
    const [quantity, setQuantity] = useState(1);

    const onQuantityChange = useCallback(
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        const n = toInteger(value);
        if (n > 0 && n < 10000) {
          setQuantity(n);
        }

        if (n <= 0) {
          setQuantity(1);
        }

        if (n >= 10000) {
          setQuantity(9999);
        }
      },
      [setQuantity]
    );

    const price = useMemo(() => {
      return `$${priceStringToNumber(info?.price).toLocaleString("de-DE")}`;
    }, [info?.price]);

    const totalPrice = useMemo(() => {
      return `$${(priceStringToNumber(info?.price) * quantity).toLocaleString(
        "de-DE"
      )}`;
    }, [info?.price, quantity]);

    useEffect(() => {
      QuotationStore.actions.setProductPrice(
        product,
        priceStringToNumber(totalPrice)
      );
      return () => {
        QuotationStore.actions.setProductPrice(product, 0);
      };
    }, [totalPrice, product]);

    const removeProduct = useCallback(() => {
      ProductSelectionStore.actions.toggleProductSelected(product);
    }, [product]);

    return info ? (
      <Table.Row>
        <Table.HeaderCell textAlign="center" className="center">
          {index + 1}
        </Table.HeaderCell>
        <Table.HeaderCell>
          <a href={info.url} target="_blank" rel="noopener">
            {info.name}
          </a>
        </Table.HeaderCell>
        <Table.HeaderCell>{info.store.name}</Table.HeaderCell>
        <Table.HeaderCell>
          <input
            className="widthFitContent"
            type="number"
            value={quantity}
            onChange={onQuantityChange}
          />
        </Table.HeaderCell>
        <Table.HeaderCell>{price}</Table.HeaderCell>
        <Table.HeaderCell>{totalPrice}</Table.HeaderCell>
        <Table.HeaderCell>
          <Icon
            circular
            name="close"
            onClick={removeProduct}
            className="pointer"
          />
        </Table.HeaderCell>
      </Table.Row>
    ) : null;
  }
);

export const SaveQuotation: FC<BoxProps> = memo(props => {
  const disclosure = useDisclosure(false);
  const productsSelected = ProductSelectionStore.hooks.useProductsKeysSelected();
  const [createQuotation, createQuotationOpts] = useMutation(CREATE_QUOTATION, {
    refetchQueries: [
      {
        query: MY_QUOTATIONS
      }
    ]
  });
  const [quotationName, setQuotationName] = useRememberState(
    "createQuotationName",
    ""
  );
  const onQuotationNameChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setQuotationName(value);
    },
    [setQuotationName]
  );
  const onCreateQuotation = useCallback(async () => {
    try {
      if (quotationName) {
        await createQuotation({
          variables: {
            quotation: {
              products: productsSelected,
              name: quotationName
            }
          }
        });
        disclosure.onClose();
      }
    } catch (err) {}
  }, [productsSelected, quotationName]);

  const totalPrice = QuotationStore.hooks.useTotalPrice();

  return (
    <>
      <Box {...props}>
        <Button icon labelPosition="left" onClick={disclosure.onOpen} primary>
          <Icon name="save" />
          Guardar cotización
        </Button>
      </Box>

      <Modal {...disclosure} size="80vw">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cotización</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Box>
                <Input
                  label="Nombre cotización"
                  placeholder="New Quotation Name"
                  value={quotationName}
                  onChange={onQuotationNameChange}
                />
              </Box>
              <Box>
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>Tienda</Table.HeaderCell>
                      <Table.HeaderCell>Cantidad</Table.HeaderCell>
                      <Table.HeaderCell>Precio Unitario</Table.HeaderCell>
                      <Table.HeaderCell>Precio Total</Table.HeaderCell>
                      <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {productsSelected.map((product, index) => {
                      return (
                        <ProductRow
                          key={product}
                          product={product}
                          index={index}
                        />
                      );
                    })}
                  </Table.Body>
                </Table>
              </Box>
              <Box>
                <Text>${totalPrice.toLocaleString("de-DE")}</Text>
              </Box>
              <Stack isInline shouldWrapChildren justifyContent="space-around">
                <Button color="blue" icon labelPosition="left">
                  <Icon name="download" />
                  Descargar cotización
                </Button>
                <Button
                  color="green"
                  icon
                  labelPosition="left"
                  disabled={!quotationName || createQuotationOpts.loading}
                  onClick={onCreateQuotation}
                  loading={createQuotationOpts.loading}
                >
                  <Icon name="add circle" />
                  Agregar a mis cotizaciones
                </Button>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
