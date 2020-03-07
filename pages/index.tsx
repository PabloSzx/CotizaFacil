import { NextPage } from "next";

import { Box, Divider, Input, Stack } from "@chakra-ui/core";

import mockData from "../mockData.json";
import { ProductRow } from "../src/Components/Product";
import { StoreSelection } from "../src/Components/StoreSelection";

const Index: NextPage = () => {
  return (
    <Stack>
      <Box>
        <Stack isInline justifyContent="space-around">
          <Box>
            <Input placeholder="martillo..." />
          </Box>
          <Box>
            <StoreSelection />
          </Box>
        </Stack>
      </Box>
      <Divider />
      <Divider />
      <Stack justifyContent="center">
        {mockData.products.map((productValue, key) => {
          return (
            <ProductRow
              key={key}
              product={productValue}
              marginLeft="10px"
              marginRight="10px"
              paddingLeft="10px"
              paddingRight="10px"
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default Index;
