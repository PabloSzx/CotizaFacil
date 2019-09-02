import ApolloClient from "apollo-boost";
import App from "next/app";
import { ApolloProvider } from "react-apollo";

import { withApollo } from "../src/client/utils";

class MyApp extends App<{ apollo: ApolloClient<any> }> {
  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
