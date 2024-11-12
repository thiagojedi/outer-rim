import { define } from "../utils.ts";
import { integrateHandler } from "@fedify/fedify/x/fresh";
import federation from "../federation/index.ts";

export const handler = define.middleware([
  // This is the entry point to the Fedify middleware from the Fresh framework:
  ({ req, ...ctx }) => integrateHandler(federation, () => undefined)(req, ctx),
]);
