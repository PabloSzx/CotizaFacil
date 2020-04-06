import gql, { DocumentNode } from "graphql-tag-ts";
import { IfImplements } from "../../typings/utils";
import { Query, User } from "../../typings/graphql";

export const ALL_USERS: DocumentNode<{
  allUsers: IfImplements<
    Pick<User, "email" | "admin" | "name">,
    Query["allUsers"][number]
  >[];
}> = gql`
  query {
    allUsers {
      email
      admin
      name
    }
  }
`;
