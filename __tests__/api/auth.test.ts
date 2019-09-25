import gql from "graphql-tag";
import { generate } from "randomstring";

import { GRAPHQL_URL, GraphQLClient } from "../helpers";

const toCleanID = "clean_this";

describe("Auth API", () => {
  it("should logout", async () => {
    const LocalAPI = new GraphQLClient(GRAPHQL_URL);

    const { logout } = await LocalAPI.request<{ logout: boolean }>(gql`
      mutation {
        logout
      }
    `);

    expect(logout).toBe(false);
  });
  it("should sign_up, logout, login and get current_user", async () => {
    const LocalAPI = new GraphQLClient(GRAPHQL_URL);

    const { logout: logout0 } = await LocalAPI.request<{ logout: boolean }>(gql`
      mutation {
        logout
      }
    `);

    expect(logout0).toBeDefined();

    const { current_user: current_user1 } = await LocalAPI.request<{
      current_user: null;
    }>(
      gql`
        query {
          current_user {
            email
            name
            admin
          }
        }
      `
    );

    expect(current_user1).toBe(null);

    const generatedEmail = `${generate()}@${generate(6)}.com`;

    const { sign_up } = await LocalAPI.request<
      { sign_up: { email: string; name: string; admin: boolean } },
      { email: string; password: string; name: string }
    >(
      gql`
        mutation($email: String!, $password: String!, $name: String!) {
          sign_up(email: $email, password: $password, name: $name) {
            email
            name
            admin
          }
        }
      `,
      { email: generatedEmail, password: "password", name: toCleanID }
    );

    expect(sign_up.email).toBe(generatedEmail);
    expect(sign_up.name).toBe(toCleanID);
    expect(sign_up.admin).toBe(false);

    const { current_user: current_user2 } = await LocalAPI.request<{
      current_user: { email: string; name: string; admin: boolean };
    }>(
      gql`
        query {
          current_user {
            email
            name
            admin
          }
        }
      `
    );

    expect(current_user2.email).toBe(generatedEmail);
    expect(current_user2.name).toBe(toCleanID);
    expect(current_user2.admin).toBe(false);

    const { logout: logout1 } = await LocalAPI.request<{ logout: boolean }>(gql`
      mutation {
        logout
      }
    `);

    expect(logout1).toBe(true);

    const { current_user: current_user3 } = await LocalAPI.request<{
      current_user: null;
    }>(
      gql`
        query {
          current_user {
            email
            name
            admin
          }
        }
      `
    );

    expect(current_user3).toBe(null);

    const { login } = await LocalAPI.request<
      { login: { email: string; name: string; admin: boolean } },
      {
        email: string;
        password: string;
      }
    >(
      gql`
        mutation($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            email
            name
            admin
          }
        }
      `,
      {
        email: generatedEmail,
        password: "password",
      }
    );

    expect(login.email).toBe(generatedEmail);
    expect(login.name).toBe(toCleanID);
    expect(login.admin).toBe(false);

    const { current_user: current_user4 } = await LocalAPI.request<{
      current_user: { email: string; name: string; admin: boolean };
    }>(
      gql`
        query {
          current_user {
            email
            name
            admin
          }
        }
      `
    );

    expect(current_user4.email).toBe(generatedEmail);
    expect(current_user4.name).toBe(toCleanID);
    expect(current_user4.admin).toBe(false);

    const { logout: logout2 } = await LocalAPI.request<{ logout: boolean }>(gql`
      mutation {
        logout
      }
    `);

    expect(logout2).toBe(true);

    const { logout: logout3 } = await LocalAPI.request<{ logout: boolean }>(gql`
      mutation {
        logout
      }
    `);

    expect(logout3).toBe(false);
  }, 30000);
});
