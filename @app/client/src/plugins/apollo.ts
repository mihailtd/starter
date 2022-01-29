import { InMemoryCache, NormalizedCacheObject } from "@apollo/client/cache";
import { ApolloClient, ApolloLink, HttpLink } from "@apollo/client/core";

const defaultSettings = {
  assumeImmutableResults: true,
  connectToDevTools: true,
  queryDeduplication: true,
};

const link = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API_URL,
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  ...defaultSettings,
  defaultOptions: {
    query: {
      fetchPolicy: "cache-first",
    },
  },
  cache,
  link,
});
