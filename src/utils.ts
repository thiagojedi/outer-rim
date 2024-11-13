import { createDefine } from "fresh";

import { Token } from "./auth/server.ts";

import "./logging.ts";

export interface State {
  token: Token;
}

export const define = createDefine<State>();
