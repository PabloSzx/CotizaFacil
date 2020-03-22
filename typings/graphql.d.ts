export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: string;
};

export type CreateStoreInput = {
  name: Scalars['String'];
  url: Scalars['String'];
  image: Scalars['String'];
};


export type EditStoreInput = {
  oldName: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
};

export type Mutation = {
   __typename?: 'Mutation';
  logout: Scalars['Boolean'];
  login: User;
  sign_up?: Maybe<User>;
  searchProduct: Array<Product>;
  createQuotation: Quotation;
  upsertStore: Store;
  editStore: Store;
  removeStore: Store;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationSign_UpArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationSearchProductArgs = {
  storeNames: Array<Scalars['String']>;
  productName: Scalars['String'];
};


export type MutationCreateQuotationArgs = {
  quotation: QuotationCreate;
};


export type MutationUpsertStoreArgs = {
  store: CreateStoreInput;
};


export type MutationEditStoreArgs = {
  store: EditStoreInput;
};


export type MutationRemoveStoreArgs = {
  storeName: Scalars['String'];
};

export type Product = {
   __typename?: 'Product';
  name: Scalars['String'];
  price: Scalars['String'];
  url: Scalars['String'];
  image: Scalars['String'];
  updated_date: Scalars['DateTime'];
  store: Store;
};

export type Query = {
   __typename?: 'Query';
  current_user?: Maybe<User>;
  allProducts: Array<Product>;
  myQuotations: Array<Quotation>;
  stores: Array<Store>;
};

export type Quotation = {
   __typename?: 'Quotation';
  id: Scalars['Float'];
  user: User;
  name: Scalars['String'];
  date: Scalars['DateTime'];
  products: Array<Product>;
};

export type QuotationCreate = {
  products: Array<Scalars['String']>;
  name: Scalars['String'];
};

export type Store = {
   __typename?: 'Store';
  name: Scalars['String'];
  url: Scalars['String'];
  image: Scalars['String'];
  active: Scalars['Boolean'];
};

export type User = {
   __typename?: 'User';
  email: Scalars['String'];
  name: Scalars['String'];
  admin: Scalars['Boolean'];
};
