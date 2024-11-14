import { createDefine } from "fresh";

import "./logging.ts";
import { SessionState } from "./auth/session.ts";

export interface State extends SessionState {}

export const define = createDefine<State>();
