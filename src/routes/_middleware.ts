import { define } from "../utils.ts";
import { integrateHandler } from "@fedify/fedify/x/fresh";
import { getLogger } from "@logtape/logtape";
import federation from "../federation/index.ts";

const log = getLogger(["outer-ring"]);

export const handler = define.middleware([
  ({ req, ...ctx }) => {
    log.warn`${req.method} ${req.url}`;
    return ctx.next();
  },
  // This is the entry point to the Fedify middleware from the Fresh framework:
  ({ req, ...ctx }) => integrateHandler(federation, () => undefined)(req, ctx),
]);
