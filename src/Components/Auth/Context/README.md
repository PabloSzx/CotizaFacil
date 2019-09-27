# Auth Context

Context component that makes use of [React Context API](https://reactjs.org/docs/context.html) and the GraphQL API.

This context component provides:

- **user**:
  - if authenticated an object containing:
    - **email**: _string_, _user's email_
    - **name**: _string_, _user's name_
    - **admin**: _boolean_, _whether the user is an admin or not_
  - if **not** authenticated: **null**.
- **login**: Auxiliar function that makes the GraphQL Mutation for the login, it requires the arguments:
  - **email**: _string_
  - **password**: _string_
- **logout**: Auxiliar function that makes the GraphQL Mutation for the logout.
- **signUp**: Auxiliar function that makes the GraphQL Mutation for the sign up, it requires the arguments:
  - **email**: _string_
  - **password**: _string_
  - **name**: _string_
- **loading**: **_Boolean_**, Notifies if there is a pending **API Request** on the fly, it could be from any of the above auxiliar requests, **plus** the initial **_current user_** request
