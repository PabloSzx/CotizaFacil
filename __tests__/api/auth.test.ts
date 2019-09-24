import { print } from "graphql";
import { request } from "graphql-request";
import gql from "graphql-tag";

const GRAPHQL_URL = `http://localhost:9999/api/graphql`;

describe("Auth API", () => {
  it("current_user should return null if not authenticated", async () => {
    const { current_user } = await request<{
      current_user: { name: string } | null;
    }>(
      GRAPHQL_URL,
      print(gql`
        query {
          current_user {
            name
            email
          }
        }
      `)
    );

    expect(current_user).toBe(null);
  });
});
