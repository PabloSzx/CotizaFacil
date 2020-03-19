import { NextPage } from "next";

import { useMutation } from "@apollo/react-hooks";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Divider,
  Spinner,
  Stack,
} from "@chakra-ui/core";

import { ProductList } from "../src/Components/Product";
import { SearchProduct } from "../src/Components/SearchProduct";
import { StoreSelection } from "../src/Components/StoreSelection";
import { SEARCH_PRODUCT } from "../src/graphql/search";

const Index: NextPage = () => {
  const [searchProduct, { data, loading, error }] = useMutation(SEARCH_PRODUCT);

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
      {loading && <Spinner size="xl" alignSelf="center" />}
      {error && (
        <Alert status="error" alignSelf="center">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>
            {error.graphQLErrors.map(value => value.message).join("|")}
          </AlertDescription>
        </Alert>
      )}
      {data && <ProductList data={data.searchProduct} />}
    </Stack>
  );
};

export default Index;
