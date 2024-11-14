import { createDefine } from "fresh";

import "./logging.ts";

// deno-lint-ignore no-empty-interface
export interface State {}

export const define = createDefine<State>();
