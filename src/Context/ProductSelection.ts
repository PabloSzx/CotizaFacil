import { createSelector, createStore } from "react-state-selector";

export type IProduct = {
  name: string;
  price: string;
  store: string;
  image: string;
};

export interface IProductSelection {
  productsChecked: Record<string, true>;
  storesSelected: Record<string, true>;
}
const initialProductSelection: IProductSelection = {
  productsChecked: {},
  storesSelected: {}
};

const rememberStoresSelectedKey = "CotizaFacilStoresSelected";

export const ProductSelectionStore = createStore(initialProductSelection, {
  devName: "ProductSelection",
  hooks: {
    useIsProductSelected: ({ productsChecked }, product: string) => {
      return !!productsChecked[product];
    },
    useIsStoreSelected: ({ storesSelected }, store: string) => {
      return !!storesSelected[store];
    },
    useStoresSelected: createSelector(
      ({ storesSelected }) => {
        return storesSelected;
      },
      storesSelected => {
        return Object.keys(storesSelected);
      }
    )
  },
  actions: {
    setInitialSelectedStores: (stores: string[]) => draft => {
      try {
        const localStoresSelected = localStorage.getItem(
          rememberStoresSelectedKey
        );
        if (localStoresSelected) {
          draft.storesSelected = JSON.parse(localStoresSelected);
        } else {
          throw undefined;
        }
      } catch (err) {
        for (const store of stores) {
          draft.storesSelected[store] = true;
        }
      }
    },
    toggleProductSelected: (product: string) => draft => {
      if (draft.productsChecked[product]) {
        delete draft.productsChecked[product];
      } else {
        draft.productsChecked[product] = true;
      }
    },
    toggleStoreSelected: (product: string) => draft => {
      if (draft.storesSelected[product]) {
        delete draft.storesSelected[product];
      } else {
        draft.storesSelected[product] = true;
      }
      try {
        localStorage.setItem(
          rememberStoresSelectedKey,
          JSON.stringify(draft.storesSelected)
        );
      } catch (err) {}
    }
  }
});
