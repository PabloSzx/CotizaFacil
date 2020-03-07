import { NextPage } from "next";
import { useState } from "react";
import { Input } from "semantic-ui-react";

import { useMutation } from "@apollo/react-hooks";
import { Box, Button, Divider, Spinner, Stack } from "@chakra-ui/core";

import { ProductRow } from "../src/Components/Product";
import { StoreSelection } from "../src/Components/StoreSelection";
import { ProductSelectionStore } from "../src/Context/ProductSelection";
import { SEARCH_PRODUCT } from "../src/graphql/search";

const Index: NextPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const storesSelected = ProductSelectionStore.hooks.useStoresSelected();

  const [searchProduct, { data, loading }] = useMutation(SEARCH_PRODUCT, {
    variables: {
      productName: searchInput,
      storeNames: storesSelected
    }
  });

  return (
    <Stack>
      <Box>
        <Stack isInline justifyContent="space-around">
          <Box>
            <Input
              placeholder="martillo..."
              value={searchInput}
              onChange={({ target: { value } }) => setSearchInput(value)}
            />
            <Button
              onClick={() => {
                searchProduct();
              }}
            >
              Buscar
            </Button>
          </Box>
          <Box>
            <StoreSelection />
          </Box>
        </Stack>
      </Box>
      <Divider />
      <Divider />
      {loading && <Spinner />}
      {data && (
        <Stack justifyContent="center">
          {data.searchProduct.map(
            ({ store: { name }, ...productValue }, key) => {
              return (
                <ProductRow
                  key={key}
                  product={{ ...productValue, store: name }}
                  marginLeft="10px"
                  marginRight="10px"
                  paddingLeft="10px"
                  paddingRight="10px"
                />
              );
            }
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default Index;
