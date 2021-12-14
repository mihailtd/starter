import express, { Express } from "express";
import { Server } from "http";
import { Middleware } from "postgraphile";

import * as middleware from "./middleware";
import { sanitizeEnv } from "./utils";

// Server may not always be supplied, e.g. where mounting on a sub-route
export function getHttpServer(app: Express): Server | void {
  return app.get("httpServer");
}

export function getWebsocketMiddlewares(
  app: Express
): Middleware<express.Request, express.Response>[] {
  return app.get("websocketMiddlewares");
}

export async function makeApp({
  httpServer,
}: {
  httpServer?: Server;
} = {}): Promise<Express> {
  sanitizeEnv();

  const isTest = process.env.NODE_ENV === "test";
  const isDev = process.env.NODE_ENV === "development";

  /*
   * Our Express server
   */
  const app = express();

  /*
   * In production, we may need to enable the 'trust proxy' setting so that the
   * server knows it's running in SSL mode, and so the logs can log the true
   * IP address of the client rather than the IP address of our proxy.
   */
  if (process.env.TRUST_PROXY) {
    /*
      We recommend you set TRUST_PROXY to the following:

        loopback,linklocal,uniquelocal

      followed by any other IPs you need to trust. For example for CloudFlare
      you can get the list of IPs from https://www.cloudflare.com/ips-v4; we
      have a script that does this for you (`yarn server cloudflare:import`)
      and a special `TRUST_PROXY=cloudflare` setting you can use to use them.
    */
    app.set(
      "trust proxy",
      process.env.TRUST_PROXY === "1"
        ? true
        : process.env.TRUST_PROXY === "cloudflare"
        ? ["loopback", "linklocal", "uniquelocal"]
        : process.env.TRUST_PROXY.split(",")
    );
  }

  /*
   * Getting access to the HTTP server directly means that we can do things
   * with websockets if we need to (e.g. GraphQL subscriptions).
   */
  app.set("httpServer", httpServer);

  /*
   * When we're using websockets, we may want them to have access to
   * sessions/etc for authentication.
   */
  const websocketMiddlewares: Middleware<express.Request, express.Response>[] =
    [];
  app.set("websocketMiddlewares", websocketMiddlewares);

  /*
   * Middleware is installed from the /server/middleware directory. These
   * helpers may augment the express app with new settings and/or install
   * express middleware. These helpers may be asynchronous, but they should
   * operate very rapidly to enable quick as possible server startup.
   */
  middleware.installDatabasePools(app);
  middleware.installHelmet(app);
  middleware.installSameOrigin(app);
  middleware.installCSRFProtection(app);
  middleware.installLogging(app);
  if (process.env.FORCE_SSL) {
    middleware.installForceSSL(app);
  }
  // These are our assets: images/etc; served out of the /@app/server/public folder (if present)
  middleware.installSharedStatic(app);
  // if (isTest || isDev) {
  //   middleware.installCypressServerCommand(app);
  // }
  middleware.installPostGraphile(app);

  /*
   * Error handling middleware
   */
  middleware.installErrorHandler(app);

  return app;
}
