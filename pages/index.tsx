import { NextPage } from "next";

import { useMutation } from "@apollo/react-hooks";
import { Box, Divider, Spinner, Stack } from "@chakra-ui/core";

import { ProductList } from "../src/Components/Product";
import { SearchProduct } from "../src/Components/SearchProduct";
import { StoreSelection } from "../src/Components/StoreSelection";
import { SEARCH_PRODUCT } from "../src/graphql/search";

const Index: NextPage = () => {
  const [searchProduct, { data, loading }] = useMutation(SEARCH_PRODUCT);

  return (
    <Stack>
      <Box>
        <Stack isInline justifyContent="space-around">
          <Box>
            <SearchProduct searchProduct={searchProduct} />
          </Box>
          <Box>
            <StoreSelection />
          </Box>
        </Stack>
      </Box>
      <Divider />
      <Divider />
      {loading && <Spinner />}
      {data && <ProductList data={data.searchProduct} />}
    </Stack>
  );
};

export default Index;
