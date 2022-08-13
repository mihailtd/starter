import { DefaultApolloClient } from "@vue/apollo-composable";
import ElementPlus from "element-plus";
import { createApp, h, provide } from "vue";
import App from "./App.vue";

import "element-plus/dist/index.css";
import "./index.pcss";
import { apolloClient } from "./plugins/apollo";
import { router } from "./router";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(router);
app.use(ElementPlus);
app.mount("#app");
