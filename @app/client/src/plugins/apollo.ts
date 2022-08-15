import { InMemoryCache } from "@apollo/client/cache";
import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
} from "@apollo/client/core";
import { useKeycloak } from "./keycloak";

const defaultSettings = {
  assumeImmutableResults: true,
  connectToDevTools: true,
  queryDeduplication: true,
};

const link = new HttpLink({
  uri: "/graphql",
});

const cache = new InMemoryCache();

const { token } = useKeycloak();

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: token.value ? `Bearer ${token.value}` : "",
    },
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  ...defaultSettings,
  defaultOptions: {
    query: {
      fetchPolicy: "cache-first",
    },
  },
  cache,
  link: concat(authMiddleware, link),
});
