import { Express } from "express";

const session = require("express-session");
const Keycloak = require("keycloak-connect");
const memoryStore = new session.MemoryStore();

export const keycloak = new Keycloak(
  { store: memoryStore },
  {
    clientId: "starter-client",
    bearerOnly: true,
    serverUrl: "http://keycloak-service",
    realm: "starter",
    realmPublicKey:
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmfO/nIXZ/aAAEdO40aZo4wWNMwb43QWoQ4wbZg6QiJSTLkqm9YU1tow72Qm37tbABAJZAcx6h+0NTlMNCJNuYcmfmvArMJf9ghsxZwgM6dValMP9JtdvssE6PhdkSO/QRsNEB3ngW4Jcr8jyk0riGHY+WSnyfvFog8W8KU3wR/R4qKVmbWfd1SDay3czhY4gbn8Gas17IjAg4AON9ofrQeUp6U6rLDKenc6eYgSaDAVZln5WA0KRaphWkxDG7c4S4dU0uxrZhecLHXPNzBNXw6CsktDySeJ6zjptPfczgZQmG++lTr7UDDvdolo9ktAElpMdYABb2uohtxCVFm/REwIDAQAB",
  }
);

export default (app: Express) => {
  app.use(
    session({
      secret: "some secret",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );
  app.use(keycloak.middleware());
};
