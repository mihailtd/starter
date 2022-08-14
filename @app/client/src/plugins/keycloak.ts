import Keycloak, { KeycloakConfig } from "keycloak-js";
import { ref } from "vue";

const config = {
  clientId: "starter-client",
  url: "https://keycloak.local.starter.com/",
  realm: "starter",
} as KeycloakConfig;

const $keycloak = new Keycloak(config);
const tokenParsed = ref();
let ready = ref(false);
let pendingPromise = ref<Promise<boolean> | null>(null);
let isAuthenticated = ref(false);
let token = ref<string | undefined>();
let authError = ref();

const initKeycloak = () => {
  if (pendingPromise.value) return pendingPromise.value;
  const promise = $keycloak
    ?.init({
      onLoad: "check-sso",
    })
    .finally(() => {
      pendingPromise.value = null;
    });
  pendingPromise.value = promise;
  return promise;
};

export async function initializeKeycloak(): Promise<void> {
  if (ready.value) {
    return;
  }
  try {
    const _isAuthenticated = await initKeycloak();
    ready.value = true;
    isAuthenticated.value = !!_isAuthenticated;
    token.value = $keycloak.token;

    tokenParsed.value = $keycloak.tokenParsed;

    $keycloak.onAuthRefreshSuccess = () => {
      token.value = $keycloak.token;
    };
    $keycloak.onTokenExpired = () => {};
    $keycloak.onAuthLogout = () => {
      isAuthenticated.value = false;
    };

    $keycloak.onAuthLogout = () => {
      console.log("logout");
    };

    console.log($keycloak.token);

    $keycloak.onAuthSuccess = () => {
      console.log("on auth sccess");
      isAuthenticated.value = true;

      setInterval(
        () =>
          $keycloak.updateToken(60).catch((err) => {
            console.log(err);
            $keycloak.clearToken();
          }),
        10000
      );
    };
  } catch (error) {
    isAuthenticated.value = false;
    authError.value = error;
    // updateToken().catch((err) => console.log(err));
    console.error(error);
  }
}

export async function updateToken() {
  if (!$keycloak) {
    throw new Error("Keycloak is not initialized.");
  }

  await $keycloak.updateToken(10);
  token.value = $keycloak.token;

  return $keycloak.token;
}

export const useKeycloak = () => {
  return {
    keycloak: $keycloak,
    tokenParsed,
    isAuthenticated,
    token,
    authError,
    ready,
  };
};
