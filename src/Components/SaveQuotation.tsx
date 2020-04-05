import { format } from "date-fns-tz";
import { es } from "date-fns/locale";
import { saveAs } from "file-saver";
import { Parser } from "json2csv";
import { reduce, toInteger } from "lodash";
import Router from "next/router";
import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createStore } from "react-state-selector";
import { Button, Icon, Input, Label, Table } from "semantic-ui-react";

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
} from "@chakra-ui/core";

import { priceStringToNumber } from "../../shared/utils";
import { ProductSelectionStore } from "../Context/ProductSelection";
import { CREATE_QUOTATION, MY_QUOTATIONS } from "../graphql/quotation";
import { AuthContext } from "./Auth/Context";
import { Confirm } from "./Confirm";

interface IDownloadQuotation {
  index: number;
  product: string;
  store: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  url: string;
}

const downloadParser = new Parser<IDownloadQuotation>({
  fields: [
    {
      value: "index",
      label: "#",
    },
    {
      value: "product",
      label: "Producto",
    },
    {
      value: "store",
      label: "Tienda",
    },
    {
      value: "quantity",
      label: "Cantidad",
    },
    {
      value: "unitPrice",
      label: "Precio Unitario",
    },
    {
      value: "totalPrice",
      label: "Precio Total",
    },
    {
      value: "url",
      label: "URL",
    },
  ],
});

export const QuotationStore = createStore(
  {
    totalPrice: 0,
    productsPrice: {} as Record<string, number>,
    productsQuantity: {} as Record<string, number>,
    newName: "",
    isModalOpen: false,
  },
  {
    hooks: {
      useTotalPrice: ({ totalPrice }) => totalPrice,
      useName: ({ newName }) => newName,
      useIsModalOpen: ({ isModalOpen }) => isModalOpen,
    },
    actions: {
      setProductPrice: (product: string, price: number) => (draft) => {
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
      },
      setName: (name: string) => (draft) => {
        draft.newName = name;
      },
      setIsModalOpen: (isOpen: boolean) => (draft) => {
        draft.isModalOpen = isOpen;
      },
    },
  }
);

const ProductRow: FC<{ product: string; index: number }> = memo(
  ({ product, index }) => {
    const info = ProductSelectionStore.hooks.useProductInfo(product);
    const [quantity, setQuantity] = useState(1);

    const onQuantityChange = useCallback(
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        let n = toInteger(value);

        if (n <= 0) {
          n = 1;
        } else if (n >= 10000) {
          n = 9999;
        }

        setQuantity(n);
      },
      [setQuantity]
    );

    useEffect(() => {
      QuotationStore.produce((draft) => {
        draft.productsQuantity[product] = quantity;
      });
    }, [quantity, product]);

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

    const onRemoveProduct = useCallback(() => {
      ProductSelectionStore.actions.toggleProductSelected(product);
    }, [product]);

    return info ? (
      <Table.Row>
        <Table.Cell textAlign="center" className="center">
          {index + 1}
        </Table.Cell>
        <Table.Cell>
          <a href={info.url} target="_blank" rel="noopener">
            {info.name}
          </a>
        </Table.Cell>
        <Table.Cell>{info.store.name}</Table.Cell>
        <Table.Cell>
          <input
            className="widthFitContent"
            type="number"
            value={quantity}
            onChange={onQuantityChange}
          />
        </Table.Cell>
        <Table.Cell>{price}</Table.Cell>
        <Table.Cell>{totalPrice}</Table.Cell>
        <Table.Cell>
          <Confirm
            header={`¿Estás seguro que deseas quitar el producto ${info.name} de tu cotización?`}
            content=""
            confirmButton="Estoy seguro"
            cancelButton="Cancelar"
          >
            <Icon
              circular
              name="close"
              onClick={onRemoveProduct}
              className="pointer"
            />
          </Confirm>
        </Table.Cell>
      </Table.Row>
    ) : null;
  }
);

export const SaveQuotation: FC<BoxProps> = memo((props) => {
  const isModalOpen = QuotationStore.hooks.useIsModalOpen();
  const productsSelected = ProductSelectionStore.hooks.useProductsKeysSelected();
  const [createQuotation, createQuotationOpts] = useMutation(CREATE_QUOTATION, {
    refetchQueries: [
      {
        query: MY_QUOTATIONS,
      },
    ],
  });
  const quotationName = QuotationStore.hooks.useName();

  const onQuotationNameChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      QuotationStore.actions.setName(value);
    },
    []
  );
  const onCreateQuotation = useCallback(async () => {
    try {
      if (quotationName) {
        await createQuotation({
          variables: {
            quotation: {
              products: productsSelected,
              name: quotationName.trim(),
            },
          },
        });
        QuotationStore.actions.setIsModalOpen(false);
      }
    } catch (err) {}
  }, [productsSelected, quotationName]);

  const { user } = useContext(AuthContext);

  const onOpenModal = useCallback(() => {
    if (user) {
      QuotationStore.actions.setIsModalOpen(true);
    } else {
      Router.push("/login");
    }
  }, [user]);

  const onCloseModal = useCallback(() => {
    QuotationStore.actions.setIsModalOpen(false);
  }, []);

  const totalPrice = QuotationStore.hooks.useTotalPrice();

  const onDownloadClick = useCallback(() => {
    const data = productsSelected.reduce<IDownloadQuotation[]>(
      (acum, productUrl, index) => {
        const info = ProductSelectionStore.produce().productsInfo[productUrl];

        if (info) {
          const { name, price, store } = info;
          acum.push({
            index,
            product: name,
            store: store.name,
            quantity:
              QuotationStore.produce().productsQuantity[productUrl] ?? 1,
            unitPrice: price,
            totalPrice: `$${
              QuotationStore.produce().productsPrice[
                productUrl
              ]?.toLocaleString("de-DE") ?? price.replace("$", "")
            }`,
            url: productUrl,
          });
        }
        return acum;
      },
      []
    );

    const dateNow = format(Date.now(), "d 'de' MMMM 'del' yyyy HH:mm:ss (z)", {
      timeZone: "America/Santiago",
      locale: es,
    });

    const csv = `"${quotationName.trim()}","${dateNow}"\n\n${downloadParser.parse(
      data
    )}\n\n,,,,"Precio Total Cotización: ","$${totalPrice.toLocaleString(
      "de-DE"
    )}"`;

    saveAs(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=UTF-8",
      }),
      `${quotationName.trim()}-${dateNow} | CotizaFacil.csv`,
      {
        autoBom: false,
      }
    );
  }, [totalPrice, productsSelected, quotationName]);
  return (
    <>
      <Box {...props}>
        <Button icon labelPosition="left" onClick={onOpenModal} primary>
          <Icon name="save" />
          Guardar cotización
        </Button>
      </Box>

      <Modal
        onClose={onCloseModal}
        isOpen={isModalOpen}
        size="80vw"
        preserveScrollBarGap
        blockScrollOnMount
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cotización</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Flex alignSelf="center" justifyContent="center" wrap="wrap">
                <Label size="big" className="quotationNameLabel">
                  Nombre nueva cotización
                </Label>
                <Input
                  placeholder="cotización"
                  value={quotationName}
                  onChange={onQuotationNameChange}
                  size="large"
                  className="quotationNameInput"
                />
              </Flex>
              <Box maxHeight="70vh" overflowY="auto">
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>Tienda</Table.HeaderCell>
                      <Table.HeaderCell>Cantidad</Table.HeaderCell>
                      <Table.HeaderCell>Precio Unitario</Table.HeaderCell>
                      <Table.HeaderCell>Precio Total</Table.HeaderCell>
                      <Table.HeaderCell>Remover</Table.HeaderCell>
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
              <Box alignSelf="flex-end">
                <Text fontSize="3xl">
                  Precio Total: ${totalPrice.toLocaleString("de-DE")}
                </Text>
              </Box>
              <Stack
                isInline
                shouldWrapChildren
                flexWrap="wrap"
                justifyContent="space-around"
                alignItems="center"
                alignContent="center"
              >
                <Button
                  color="blue"
                  icon
                  labelPosition="left"
                  disabled={!quotationName}
                  onClick={onDownloadClick}
                >
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
