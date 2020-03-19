import { FC, memo, useCallback } from "react";
import { Checkbox } from "semantic-ui-react";

import { Image, Stack, StackProps, Text } from "@chakra-ui/core";

import { IProduct, ProductSelectionStore } from "../Context/ProductSelection";
import { IProductQuery } from "../graphql/search";

export const ProductRow: FC<{ product: IProduct } & StackProps> = ({
  product: productInfo,
  ...stackProps
}) => {
  const isChecked = ProductSelectionStore.hooks.useIsProductSelected(
    productInfo.url
  );

  const { toggleProductSelected } = ProductSelectionStore.actions;

  const toggleIsChecked = useCallback(() => {
    toggleProductSelected(productInfo.url);
  }, [productInfo]);

  return (
    <Stack
      border="1px solid black"
      isInline
      alignItems="center"
      justifyContent="space-between"
      {...stackProps}
    >
      <Checkbox checked={isChecked} onChange={toggleIsChecked} />
      <Image
        src={productInfo.image}
        alt={productInfo.name}
        width="100%"
        height="100%"
        maxWidth="50px"
        objectFit="contain"
        paddingTop="5px"
        paddingBottom="5px"
      />
      <Text m="5px !important" width="40%">
        {productInfo.name}
      </Text>
      <Text m="5px !important" width="50px">
        {productInfo.store}
      </Text>
      <Text m="5px !important">{productInfo.price}</Text>
    </Stack>
  );
};

export const ProductList: FC<{ data: IProductQuery[] }> = memo(({ data }) => {
  return (
    <Stack justifyContent="center">
      {data.map(({ store: { name }, ...productValue }, key) => {
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
      })}
    </Stack>
  );
});
