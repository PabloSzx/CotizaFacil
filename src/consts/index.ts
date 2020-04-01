export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? "https://cotiza-facil.pablosz.tech"
    : "http://localhost:3000";

export const GRAPHQL_URL = `${DOMAIN}/api/graphql`;
