import {
  createFederation,
  InProcessMessageQueue,
  MemoryKvStore,
} from "@fedify/fedify";
import { parse } from "@std/semver";

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

export default federation;
