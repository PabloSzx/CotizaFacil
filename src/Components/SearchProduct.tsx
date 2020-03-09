import { FC, memo, useState } from "react";
import { Input } from "semantic-ui-react";

import { Button } from "@chakra-ui/core";

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
      <Input
        placeholder="martillo..."
        value={searchInput}
        onChange={({ target: { value } }) => setSearchInput(value)}
        disabled={loading}
      />
      <Button isLoading={loading} isDisabled={loading} type="submit">
        Buscar
      </Button>
    </form>
  );
});
