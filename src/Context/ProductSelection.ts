import { some } from "lodash";
import { createSelector, createStore } from "react-state-selector";

import { IProductQuery } from "../graphql/search";

export type IProduct = {
  name: string;
  price: string;
  store: string;
  image: string;
  url: string;
};

export interface IProductSelection {
  productsChecked: Record<string, true>;
  storesSelected: Record<string, true>;
  productsInfo: Record<string, IProductQuery>;
}

const initialProductSelection: IProductSelection = {
  productsChecked: {},
  storesSelected: {},
  productsInfo: {}
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
    useAnyProductSelected: ({ productsChecked }) => {
      return some(productsChecked);
    },
    useProductsKeysSelected: createSelector(
      ({ productsChecked }) => productsChecked,
      productsChecked => {
        return Object.keys(productsChecked);
      }
    ),
    useStoresSelected: createSelector(
      ({ storesSelected }) => {
        return storesSelected;
      },
      storesSelected => {
        return Object.keys(storesSelected);
      }
    ),
    useProductInfo: createSelector(
      ({ productsInfo }: IProductSelection, _productKey: string) => {
        return productsInfo;
      },
      (_, productKey) => productKey,
      (productInfo, productKey) => {
        return productInfo[productKey];
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
    },
    setProductsInfo: (products: IProductQuery[]) => draft => {
      draft.productsInfo = {
        ...draft.productsInfo,
        ...products.reduce<Record<string, IProductQuery>>((acum, value) => {
          acum[value.url] = value;
          return acum;
        }, {})
      };
    },
    loadQuotationSelection: (products: IProductQuery[]) => draft => {
      draft.productsInfo = {
        ...draft.productsInfo,
        ...products.reduce<Record<string, IProductQuery>>((acum, value) => {
          acum[value.url] = value;
          return acum;
        }, {})
      };
      draft.productsChecked = products.reduce<Record<string, true>>(
        (acum, value) => {
          acum[value.url] = true;
          return acum;
        },
        {}
      );
    }
  }
});
