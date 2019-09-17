# Entities

Entities used for either or both **GraphQL API** and **PostgreSQL Database**.

---

## Session

Database exclusive entity, used for the authentication session.

It defines:

- **id**:
  - Primary column, it is the encrypted key, which is saved in the client side cookie.
- **expiresAt**:
  - Column used to know when the session is expected to be expired.
- **data**:
  - Data column, needed for the correct functionality of the session management.

## User

GraphQL and Database entity, used for the authentication system.

It defines:

- **email**
  - Primary column, email used as **username** for the authentication.
- **password**
  - Column used to save the user password, it should be [**SHA-3**](https://cryptojs.gitbook.io/docs/#hashing) encrypted.
- **name**
  - Column used to save the user formal name.
- **admin**
  - Column used for the system to distinguish **admin users**.
