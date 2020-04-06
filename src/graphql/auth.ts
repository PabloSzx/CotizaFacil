import gql, { DocumentNode } from "graphql-tag-ts";
import {
  User,
  Query,
  Mutation,
  MutationLoginArgs,
  MutationSign_UpArgs,
} from "../../typings/graphql";
import { IfImplements } from "../../typings/utils";

export type IAuthenticatedUser = Pick<User, "email" | "admin" | "name">;

export const CURRENT_USER: DocumentNode<{
  current_user?: IfImplements<IAuthenticatedUser, Query["current_user"]>;
}> = gql`
  query {
    current_user {
      email
      name
      admin
    }
  }
`;

export const LOGOUT: DocumentNode<Pick<Mutation, "logout">> = gql`
  mutation {
    logout
  }
`;

export const LOGIN: DocumentNode<
  {
    login: IfImplements<IAuthenticatedUser, Mutation["login"]>;
  },
  MutationLoginArgs
> = gql`
  mutation($input: LoginInput!) {
    login(input: $input) {
      email
      name
      admin
    }
  }
`;

export const SIGN_UP: DocumentNode<
  {
    sign_up?: IfImplements<IAuthenticatedUser, Mutation["sign_up"]>;
  },
  MutationSign_UpArgs
> = gql`
  mutation($input: SignUpInput!) {
    sign_up(input: $input) {
      email
      name
      admin
    }
  }
`;
