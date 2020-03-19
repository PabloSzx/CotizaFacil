import "../public/style.css";
import "../public/nprogress.css";

import ApolloClient from "apollo-boost";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";

import { ApolloProvider } from "@apollo/react-hooks";
import { theme, ThemeProvider } from "@chakra-ui/core";

import { AuthProvider } from "../src/Components/Auth/Context";
import { Navigation } from "../src/Components/Navigation";
import { withApollo } from "../src/utils";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

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
