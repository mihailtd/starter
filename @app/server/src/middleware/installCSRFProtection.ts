import { Express } from "express";

export default (app: Express) => {
  // const csrfProtection = csrf({
  //   // Store to the session rather than a Cookie
  //   cookie: {
  //     key: "csrf-token",
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "strict",
  //   },

  //   // Extract the CSRF Token from the `CSRF-Token` header.
  //   value(req) {
  //     const csrfToken = req.headers["csrf-token"];
  //     return typeof csrfToken === "string" ? csrfToken : "";
  //   },
  // });

  app.use((_req, _res, next) => {
    // TODO: implement proper CSRF protection
    return next();
    // if (
    //   req.method === "POST" &&
    //   req.path === "/graphql" &&
    //   (req.headers.referer === `${process.env.ROOT_URL}/graphiql` ||
    //     req.headers.origin === process.env.ROOT_URL)
    // ) {
    //   console.log("bypassed");
    //   // Bypass CSRF for GraphiQL
    //   next();
    // } else {
    //   console.log("protected");
    //   csrfProtection(req, res, next);
    // }
  });
};
