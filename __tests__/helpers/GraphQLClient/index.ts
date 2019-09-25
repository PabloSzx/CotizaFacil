import "cross-fetch/polyfill";

import { DocumentNode, print } from "graphql";
import nodeFetch from "node-fetch";
import tough from "tough-cookie";

import { ClientError, GraphQLError, Headers as HttpHeaders, Options, Variables } from "./types";

export { ClientError } from "./types";

export class GraphQLClient {
  private url: string;
  private options: Options;
  private fetch: typeof fetch;

  constructor(url: string, options?: Options) {
    this.url = url;
    this.options = options || {};
    this.fetch = require("fetch-cookie/node-fetch")(
      nodeFetch,
      new tough.CookieJar()
    );
  }

  async rawRequest<T extends any>(
    query: string,
    variables?: Variables
  ): Promise<{
    data?: T;
    extensions?: any;
    headers: Headers;
    status: number;
    errors?: GraphQLError[];
  }> {
    const { headers, ...others } = this.options;

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    });

    const response = await this.fetch(this.url, {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, headers),
      body,
      ...others,
    });

    const result = await getResult(response);

    if (response.ok && !result.errors && result.data) {
      const { headers, status } = response;
      return { ...result, headers, status };
    } else {
      const errorResult =
        typeof result === "string" ? { error: result } : result;
      throw new ClientError(
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables }
      );
    }
  }

  async requestData<T extends any>(
    query: string,
    variables?: Variables
  ): Promise<T> {
    const { headers, ...others } = this.options;

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    });

    const response = await this.fetch(this.url, {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, headers),
      body,
      ...others,
    });

    const result = await getResult(response);

    if (response.ok && !result.errors && result.data) {
      return result.data;
    } else {
      const errorResult =
        typeof result === "string" ? { error: result } : result;
      throw new ClientError(
        { ...errorResult, status: response.status },
        { query, variables }
      );
    }
  }

  setHeaders(headers: HttpHeaders): GraphQLClient {
    this.options.headers = headers;

    return this;
  }

  setHeader(key: string, value: string): GraphQLClient {
    const { headers } = this.options;

    if (headers) {
      headers[key] = value;
    } else {
      this.options.headers = { [key]: value };
    }
    return this;
  }

  request = async <DATA = any, VARIABLES extends Record<string, any> = any>(
    tag: DocumentNode,
    variables?: VARIABLES
  ) => await this.requestData<DATA>(print(tag), variables);
}

async function getResult(response: Response): Promise<any> {
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.startsWith("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
}
