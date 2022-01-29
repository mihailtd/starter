import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./plugins/apollo";

import App from "./App.vue";
import "./index.pcss";

apolloClient;
createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
}).mount("#app");
