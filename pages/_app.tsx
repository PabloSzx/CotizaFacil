import ApolloClient from "apollo-boost";
import App from "next/app";
import Head from "next/head";
import { ApolloProvider } from "react-apollo";

import { theme, ThemeProvider } from "@chakra-ui/core";

import { AuthProvider } from "../src/Components/Auth/Context";
import { Navigation } from "../src/Components/Navigation";
import { withApollo } from "../src/utils";

class MyApp extends App<{ apollo: ApolloClient<any> }> {
  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Head>
          <title>Cotiza Fácil</title>
        </Head>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Navigation />

            <Component {...pageProps} />
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
