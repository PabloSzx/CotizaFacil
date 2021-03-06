import { FC, memo, useState } from "react";
import { Button, Icon, Input } from "semantic-ui-react";
import { useRememberState } from "use-remember-state";
import NProgress from "nprogress";

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
  const [searchInput, setSearchInput] = useRememberState(
    "cotiza_facil_search_input",
    "",
    {
      SSR: true,
    }
  );
  const storesSelected = ProductSelectionStore.hooks.useStoresSelected();
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();
        setLoading(true);
        NProgress.start();
        setSearchInput((inputStr) => inputStr.trim());
        await searchProduct({
          variables: {
            storeNames: storesSelected,
            productName: searchInput.trim(),
          },
        });
        NProgress.done();
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
          disabled={loading || !searchInput}
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
