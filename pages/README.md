# Pages Folder

React Components that defines the routes to be used in the web application, with the exception of **two special components**:

- \_app
  - Web application common logic, like:
    - [**Apollo Provider**](https://www.apollographql.com/docs/react/api/react-apollo/#apolloprovider), the GraphQL API client instance to be used across the web application.
    - **Auth context**, since the web application requires authentication across all the pages, here it resides the [**React Context Provider**](https://reactjs.org/docs/context.html#contextprovider), high up on the component tree.
- \_document
  - Web application common static data, like:
    - CSS Stylesheets
    - [styled-components style tags](https://www.styled-components.com/docs/advanced#server-side-rendering) for server side rendering

Other than the above components, this folder defines the routes based on **folder**/**file** names, where the only exception for the routes are for dynamic routes (_not relevant for now_) and the **index** file, which is equivalent to "**/**" pathname.
