import { FC, useCallback } from "react";
import { Checkbox } from "semantic-ui-react";

import { Box, Image, Stack, StackProps, Text } from "@chakra-ui/core";

import { IProduct, ProductSelectionStore } from "../Context/ProductSelection";

export const ProductRow: FC<{ product: IProduct } & StackProps> = ({
  product: productInfo,
  ...stackProps
}) => {
  const isChecked = ProductSelectionStore.hooks.useIsProductSelected(
    productInfo.name
  );

  const { toggleProductSelected } = ProductSelectionStore.actions;

  const toggleIsChecked = useCallback(() => {
    toggleProductSelected(productInfo.name);
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
        alt="product_img"
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
