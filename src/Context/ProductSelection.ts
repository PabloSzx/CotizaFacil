import { size, some } from "lodash";
import { createSelector, createStore } from "react-state-selector";

import { Product, Store } from "../../typings/graphql";
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
  productsData: readonly (Pick<Product, "name" | "price" | "image" | "url"> & {
    store: Pick<Store, "name">;
  })[];
}

const initialProductSelection: IProductSelection = {
  productsChecked: {},
  storesSelected: {},
  productsInfo: {},
  productsData: [],
};

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
      (productsChecked) => {
        return Object.keys(productsChecked);
      }
    ),
    useStoresSelected: createSelector(
      ({ storesSelected }) => {
        return storesSelected;
      },
      (storesSelected) => {
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
    ),
    useProductsData: ({ productsData }) => {
      return productsData;
    },
  },
  actions: {
    setInitialSelectedStores: (stores: string[]) => (draft) => {
      if (size(draft.storesSelected) === 0) {
        for (const store of stores) {
          draft.storesSelected[store] = true;
        }
      }
    },
    toggleProductSelected: (product: string) => (draft) => {
      if (draft.productsChecked[product]) {
        delete draft.productsChecked[product];
      } else {
        draft.productsChecked[product] = true;
      }
    },
    toggleStoreSelected: (product: string) => (draft) => {
      if (draft.storesSelected[product]) {
        delete draft.storesSelected[product];
      } else {
        draft.storesSelected[product] = true;
      }
    },
    setProductsInfo: (products: IProductQuery[]) => (draft) => {
      draft.productsData = products;
      draft.productsInfo = {
        ...draft.productsInfo,
        ...products.reduce<Record<string, IProductQuery>>((acum, value) => {
          acum[value.url] = value;
          return acum;
        }, {}),
      };
    },
    loadQuotationSelection: (products: IProductQuery[]) => (draft) => {
      draft.productsInfo = {
        ...draft.productsInfo,
        ...products.reduce<Record<string, IProductQuery>>((acum, value) => {
          acum[value.url] = value;
          return acum;
        }, {}),
      };
      draft.productsChecked = products.reduce<Record<string, true>>(
        (acum, value) => {
          acum[value.url] = true;
          return acum;
        },
        {}
      );
    },
  },
  storagePersistence: {
    isActive: true,
    isSSR: true,
    persistenceKey: "ProductSelection",
    debounceWait: 1000,
  },
});
