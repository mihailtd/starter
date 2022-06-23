import Keycloak, { KeycloakConfig } from "keycloak-js";
import { ref } from "vue";

// types
interface KeycloakState<T = unknown> {
  isAuthenticated: boolean;
  hasFailed: boolean;
  isPending: boolean;
  token: string;
  decodedToken: T;
  username: string;
  roles: string[];
  resourceRoles: Record<string, string[]>;
}

// implementation
const config = {
  clientId: "starter-client",
  url: "https://keycloak.local.starter.com/",
  realm: "starter",
} as KeycloakConfig;
const $keycloak: Keycloak = new Keycloak(config);

let pending = ref(false);
let isAuthenticated = ref(false);
let token = ref<string | undefined>();
let authError = ref();

export async function initializeKeycloak(): Promise<void> {
  try {
    pending.value = true;
    const _isAuthenticated = await $keycloak.init({});
    isAuthenticated.value = !!_isAuthenticated;
    token.value = $keycloak.token;

    $keycloak.onAuthRefreshSuccess = () => {
      token.value = $keycloak.token;
    };
    $keycloak.onTokenExpired = () => updateToken();
  } catch (error) {
    isAuthenticated.value = false;
    authError.value = error;
    throw new Error("Could not read access token");
  } finally {
    pending.value = false;
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
    pending,
    isAuthenticated,
    token,
    authError,
  };
};
