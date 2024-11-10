import { db } from "../../db/client.ts";
import { users } from "../../db/models.ts";

export const createUser = (username: string, password: string) => {
  db.insert(users).values({
    username,
    password, //TODO encrypt
  });
};
