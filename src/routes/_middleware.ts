import { Handler } from "$fresh/server.ts";
import { integrateHandler } from "@fedify/fedify/x/fresh";
import federation from "../federation/index.ts";
import { getLogger } from "@logtape/logtape";

const log = getLogger(["outer-ring"]);

export const handler: Handler[] = [
  (_req, ctx) => {
    log.warn`${_req}`;
    return ctx.next();
  },
  // This is the entry point to the Fedify middleware from the Fresh framework:
  integrateHandler(federation, () => undefined),
];
