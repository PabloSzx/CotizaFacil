export const GRAPHQL_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000/api/graphql"
    : "/api/graphql";
