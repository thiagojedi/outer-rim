import { createUser } from "../auth/repositories/users.ts";

await createUser("user@example.com", "password");
