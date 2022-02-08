import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApp, h, provide } from "vue";
import App from "./App.vue";
import "./index.pcss";
import { apolloClient } from "./plugins/apollo";

apolloClient;
createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
}).mount("#app");
