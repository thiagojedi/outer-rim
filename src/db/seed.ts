import { createClientApp } from "../auth/repositories/clients.ts";
import { createUser } from "../auth/repositories/users.ts";

await createClientApp({
  scopes: "read write follow push",
  client_name: "Moshidon",
  website: "",
  redirect_uris: [
    "moshidon-android-auth://callback",
    "http://localhost:8000/auth/callback/custom-mastodon",
  ],
});

await createUser("test", "password");
