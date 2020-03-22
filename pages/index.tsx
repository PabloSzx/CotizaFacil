import { NextPage } from "next";
import { useEffect } from "react";
import { useRememberState } from "use-remember-state";

import { useMutation } from "@apollo/react-hooks";
import { Box, Divider, Spinner, Stack } from "@chakra-ui/core";

import { ErrorGQLAlert } from "../src/Components/ErrorGQLAlert";
import { ProductList } from "../src/Components/Product";
import { SearchProduct } from "../src/Components/SearchProduct";
import { StoreSelection } from "../src/Components/StoreSelection";
import { ProductSelectionStore } from "../src/Context/ProductSelection";
import { SEARCH_PRODUCT } from "../src/graphql/search";

const Index: NextPage = () => {
  const [searchProduct, { data, loading, error }] = useMutation(SEARCH_PRODUCT);

  const [dataRemember, setDataRemember] = useRememberState(
    "searchProductCotizaFacilData",
    undefined as typeof data | undefined,
    {
      SSR: true
    }
  );

  useEffect(() => {
    if (data) {
      setDataRemember(data);
    }
  }, [data]);

  useEffect(() => {
    ProductSelectionStore.actions.setProductsInfo(
      dataRemember?.searchProduct ?? []
    );
  }, [dataRemember]);

  return (
    <Stack>
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
      {dataRemember && <ProductList data={dataRemember.searchProduct} />}
    </Stack>
  );
};

export default Index;
