import { createStore } from "react-state-selector";

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

export const ProductSelectionStore = createStore(initialProductSelection, {
  devName: "ProductSelection",
  hooks: {
    useIsProductSelected: ({ productsChecked }, product: string) => {
      return !!productsChecked[product];
    },
    useIsStoreSelected: ({ storesSelected }, store: string) => {
      return !!storesSelected[store];
    }
  },
  actions: {
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
    }
  }
});
