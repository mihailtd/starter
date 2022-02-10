/* eslint-disable @typescript-eslint/no-var-requires */
const history = require("connect-history-api-fallback");
const compression = require("compression");
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const app = express();

app.use(compression());
app.use(history());
app.use(
  "/",
  serveStatic(path.join(__dirname, "/dist"), {
    cacheControl: "max-age=36000000",
  })
);
app.use(history());

const port = process.env.PORT || 3000;
app.listen(port);
