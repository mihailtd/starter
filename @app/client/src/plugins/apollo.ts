import { InMemoryCache } from "@apollo/client/cache";
import { ApolloClient, HttpLink } from "@apollo/client/core";

const defaultSettings = {
  assumeImmutableResults: true,
  connectToDevTools: true,
  queryDeduplication: true,
};

const link = new HttpLink({
  uri: "/graphql",
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
