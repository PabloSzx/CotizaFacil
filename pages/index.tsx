import { NextPage } from "next";
import { useEffect } from "react";

import { useMutation } from "@apollo/react-hooks";
import { Box, Divider, Spinner, Stack } from "@chakra-ui/core";

import { ErrorGQLAlert } from "../src/Components/ErrorGQLAlert";
import { ProductTable } from "../src/Components/Product";
import { SearchProduct } from "../src/Components/SearchProduct";
import { StoreSelection } from "../src/Components/StoreSelection";
import { ProductSelectionStore } from "../src/Context/ProductSelection";
import { SEARCH_PRODUCT } from "../src/graphql/search";

const Index: NextPage = () => {
  const [searchProduct, { data, loading, error, called }] = useMutation(
    SEARCH_PRODUCT
  );

  const productsData = ProductSelectionStore.hooks.useProductsData();

  useEffect(() => {
    if (called && !loading) {
      ProductSelectionStore.actions.setProductsInfo(data?.searchProduct ?? []);
    }
  }, [called, loading, data]);

  return (
    <Stack pt={10}>
      <Box>
        <Stack
          isInline
          justifyContent="space-around"
          shouldWrapChildren
          flexWrap="wrap"
          alignItems="center"
          spacing={0}
        >
          <Box m={1} className="48">
            <SearchProduct searchProduct={searchProduct} />
          </Box>
          <Box>
            <StoreSelection />
          </Box>
        </Stack>
      </Box>
      <Divider />
      <Divider />
      {loading && <Spinner size="xl" alignSelf="center" />}
      <ErrorGQLAlert error={error} alignSelf="center" />
      {productsData.length > 0 && <ProductTable data={productsData} />}
    </Stack>
  );
};

export default Index;
