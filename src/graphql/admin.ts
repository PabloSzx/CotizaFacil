import gql, { DocumentNode } from "graphql-tag-ts";
import { IfImplements } from "../../typings/utils";
import {
  Query,
  User,
  Mutation,
  MutationUpdateUserArgs,
  MutationRemoveUserArgs,
} from "../../typings/graphql";

export type IUser = Pick<User, "email" | "admin" | "name">;

export const ALL_USERS: DocumentNode<{
  allUsers: IfImplements<IUser, Query["allUsers"][number]>[];
}> = gql`
  query {
    allUsers {
      email
      admin
      name
    }
  }
`;

export const UPDATE_USER: DocumentNode<
  {
    updateUser: IfImplements<IUser, Mutation["updateUser"]>;
  },
  MutationUpdateUserArgs
> = gql`
  mutation($user: UpdateUserInput!) {
    updateUser(user: $user) {
      email
      admin
      name
    }
  }
`;

export const REMOVE_USER: DocumentNode<
  Pick<Mutation, "removeUser">,
  MutationRemoveUserArgs
> = gql`
  mutation($email: String!) {
    removeUser(email: $email)
  }
`;
