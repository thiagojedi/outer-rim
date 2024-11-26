import {
  createFederation,
  InProcessMessageQueue,
  MemoryKvStore,
} from "@fedify/fedify";
import { integrateHandler } from "@fedify/fedify/x/fresh";
import { FreshContext } from "fresh";
import { parse } from "@std/semver";

import { setupActor } from "./actor.ts";
import { setupFollows } from "./follow.ts";
import { setupNotes } from "./note.ts";

const federation = createFederation({
  kv: new MemoryKvStore(),
  queue: new InProcessMessageQueue(),
});

federation.setNodeInfoDispatcher("/nodeinfo/2.1", (_ctx) => {
  return {
    software: {
      name: "outer-ring",
      version: parse("0.0.1"),
      homepage: new URL("https://github.com/thiagojedi/outer-ring"),
    },
    protocols: ["activitypub"],
    usage: {
      users: { total: 0 },
      localPosts: 0,
      localComments: 0,
    },
  };
});

const inbox = federation.setInboxListeners(
  "/users/{identifier}/inbox",
  "/inbox",
);

setupActor(federation);

setupFollows(inbox);

setupNotes(federation);

export default federation;

export const federationMiddleware = () => ({ req, ...ctx }: FreshContext) =>
  integrateHandler(federation, () => undefined)(req, ctx);
