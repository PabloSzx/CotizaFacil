import ApolloClient from "apollo-boost";
import App from "next/app";
import Head from "next/head";
import { ApolloProvider } from "react-apollo";

import { AuthProvider } from "../src/client/Components/Auth/Context";
import { withApollo } from "../src/client/utils";

class MyApp extends App<{ apollo: ApolloClient<any> }> {
  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Head>
          <title>Cotiza Fácil</title>
        </Head>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
