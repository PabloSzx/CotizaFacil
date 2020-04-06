import { FC, memo, useCallback, useMemo } from "react";
import { Checkbox, Table } from "semantic-ui-react";
import { sortBy, uniq } from "lodash";
import { Image, Text, Flex, Stack, Box } from "@chakra-ui/core";
import reverse from "lodash/fp/reverse";
import { ProductSelectionStore } from "../Context/ProductSelection";
import { IProductQuery } from "../graphql/search";
import { SaveQuotation } from "./SaveQuotation";
import { useRememberState } from "use-remember-state";
import { priceStringToNumber } from "../../shared/utils";
import { usePagination } from "../utils/pagination";

const ProductTableRow: FC<{ product: IProductQuery }> = memo(
  ({
    product: {
      store: { name: storeName },
      image,
      name,
      price,
      url
    }
  }) => {
    const isChecked = ProductSelectionStore.hooks.useIsProductSelected(url);

    const { toggleProductSelected } = ProductSelectionStore.actions;

    const toggleIsChecked = useCallback(() => {
      toggleProductSelected(url);
    }, [url]);

    return (
      <Table.Row>
        <Table.Cell textAlign="center">
          <Checkbox checked={isChecked} onChange={toggleIsChecked} />
        </Table.Cell>
        <Table.Cell>
          <Image
            src={image}
            alt={name}
            maxWidth="80px"
            objectFit="contain"
            paddingTop="5px"
            paddingBottom="5px"
          />
        </Table.Cell>

        <Table.Cell>
          <Text>
            <a href={url} target="_blank" rel="noopener">
              {name}
            </a>
          </Text>
        </Table.Cell>
        <Table.Cell>
          <Text>{storeName}</Text>
        </Table.Cell>
        <Table.Cell>
          <Text>{price}</Text>
        </Table.Cell>
      </Table.Row>
    );
  }
);

type columnNames = "selected" | "name" | "store.name" | "price";

export const ProductTable: FC<{ data: readonly IProductQuery[] }> = memo(
  ({ data }) => {
    const anyProductSelected = ProductSelectionStore.hooks.useAnyProductSelected();

    const [columnSort, setColumnSort] = useRememberState<columnNames[]>(
      "CotizaFacilColumnSortProduct",
      []
    );

    const [directionSort, setDirectionSort] = useRememberState<
      "ascending" | "descending" | undefined
    >("CotizaFacilDirectionProductSort", undefined);

    const sortedDataList = useMemo(() => {
      const selectedProducts = ProductSelectionStore.produce().productsChecked;
      return sortBy(
        data,
        columnSort.map(column => {
          return (product: IProductQuery) => {
            switch (column) {
              case "selected": {
                return selectedProducts[product.url];
              }
              case "name": {
                return product.name;
              }
              case "price": {
                return priceStringToNumber(product.price);
              }
              case "store.name": {
                return product.store.name;
              }
            }
          };
        })
      );
    }, [data, columnSort]);

    const sortedDataListWithDirection = useMemo(() => {
      if (directionSort === "descending") {
        return reverse(sortedDataList);
      }
      return sortedDataList;
    }, [sortedDataList, directionSort]);

    const handleSort = (clickedColumn: columnNames) => () => {
      if (columnSort[0] !== clickedColumn) {
        setColumnSort(columnSortList =>
          uniq([clickedColumn, ...columnSortList])
        );
        setDirectionSort("ascending");
      } else {
        setDirectionSort(
          directionSort === "ascending" ? "descending" : "ascending"
        );
      }
    };

    const { selectedData, pagination } = usePagination({
      name: "CotizaFacilProductPagination",
      data: sortedDataListWithDirection,
      n: 15
    });

    return (
      <>
        <Stack align="center">
          <Box padding="20px">{pagination}</Box>
          <Flex justifyContent="center">
            <Table
              celled
              collapsing
              compact
              selectable
              striped
              stackable
              sortable
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    width={1}
                    sorted={
                      columnSort[0] === "selected" ? directionSort : undefined
                    }
                    onClick={handleSort("selected")}
                  >
                    Seleccionado
                  </Table.HeaderCell>
                  <Table.HeaderCell width={1}>Imagen</Table.HeaderCell>
                  <Table.HeaderCell
                    width={5}
                    sorted={
                      columnSort[0] === "name" ? directionSort : undefined
                    }
                    onClick={handleSort("name")}
                  >
                    Nombre
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    width={1}
                    sorted={
                      columnSort[0] === "store.name" ? directionSort : undefined
                    }
                    onClick={handleSort("store.name")}
                  >
                    Tienda
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    width={2}
                    sorted={
                      columnSort[0] === "price" ? directionSort : undefined
                    }
                    onClick={handleSort("price")}
                  >
                    Precio
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {selectedData.map(productValue => {
                  return (
                    <ProductTableRow
                      key={productValue.url}
                      product={productValue}
                    />
                  );
                })}
              </Table.Body>
            </Table>
          </Flex>
          <Box padding="20px">{pagination}</Box>
        </Stack>
        {anyProductSelected && (
          <SaveQuotation pos="fixed" bottom={5} right={5} />
        )}
      </>
    );
  }
);
