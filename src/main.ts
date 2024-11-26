/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { STATUS_CODE } from "@std/http/status";
import { getLogger } from "@logtape/logtape";
import { sessionMiddleware } from "./auth/session.ts";
import { federationMiddleware } from "./federation/index.ts";

export const app = new App<State>();
app.use(staticFiles());

const log = getLogger(["outer-ring"]);
app.use(
  ({ req, ...ctx }) => {
    log.warn`${req.method} ${req.url}`;
    return ctx.next();
  },
);

app.use(
  ({ req, next }) => {
    if (req.method === "BREW") {
      return Response.json({
        "error": "I'm a teapot",
      }, { status: STATUS_CODE.Teapot });
    }
    return next();
  },
);

app.use(sessionMiddleware());

app.use(federationMiddleware());

await fsRoutes(app, {
  dir: "./src/",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
