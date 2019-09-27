export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://cotiza-facil.pszx.tech"
    : "http://localhost:8000";

export const GRAPHQL_URL = `${DOMAIN}/api/graphql`;
