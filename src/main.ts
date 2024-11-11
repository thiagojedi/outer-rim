/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "./utils.ts";

export const app = new App<State>();
app.use(staticFiles());

await fsRoutes(app, {
  dir: "./src/",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
