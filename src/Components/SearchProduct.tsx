import { FC, memo, useState } from "react";
import { Button, Icon, Input } from "semantic-ui-react";

import { Stack } from "@chakra-ui/core";

import { ProductSelectionStore } from "../Context/ProductSelection";

export const SearchProduct: FC<{
  searchProduct: (opts: {
    variables: {
      productName: string;
      storeNames: string[];
    };
  }) => Promise<unknown>;
}> = memo(({ searchProduct }) => {
  const [searchInput, setSearchInput] = useState("");
  const storesSelected = ProductSelectionStore.hooks.useStoresSelected();
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async ev => {
        ev.preventDefault();
        setLoading(true);
        await searchProduct({
          variables: {
            storeNames: storesSelected,
            productName: searchInput
          }
        });
        setLoading(false);
      }}
    >
      <Stack alignItems="center" shouldWrapChildren isInline>
        <Input
          placeholder="martillo..."
          value={searchInput}
          onChange={({ target: { value } }) => setSearchInput(value)}
          disabled={loading}
        />
        <Button
          loading={loading}
          disabled={loading}
          type="submit"
          icon
          labelPosition="left"
          color="green"
        >
          <Icon name="search" />
          Buscar
        </Button>
      </Stack>
    </form>
  );
});
