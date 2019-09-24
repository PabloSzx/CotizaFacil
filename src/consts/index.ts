export const WRONG_INFO = "wrong_info";
export const ADMIN = "admin";
export const USER_ALREADY_EXISTS = "user_already_exists";
export const GRAPHQL_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:8000/api/graphql"
    : "/api/graphql";
