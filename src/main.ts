import { App, fsRoutes, staticFiles } from "fresh";
import { getXForwardedRequest } from "@hongminhee/x-forwarded-fetch";
import { STATUS_CODE } from "@std/http/status";
import { getLogger } from "@logtape/logtape";

import { sessionMiddleware } from "./auth/session.ts";
import { federationMiddleware } from "./federation/mod.ts";
import { type State } from "./utils.ts";

export const app = new App<State>();

const log = getLogger(["outer-ring"]);

app.use(async (ctx) => {
  //@ts-expect-error: need to add this to allow proxy
  ctx.req = await getXForwardedRequest(ctx.req);
  return ctx.next();
});

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

app.use(staticFiles());

await fsRoutes(app, {
  dir: "./src/",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
