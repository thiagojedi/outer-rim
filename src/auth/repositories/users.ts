import { GrantIdentifier, OAuthClient, OAuthUser } from "@jmondi/oauth2-server";
import { db } from "../../db/client.ts";
import { users } from "../../db/models.ts";

export const createUser = (username: string, password: string) => {
  db.insert(users).values({
    username,
    password, //TODO encrypt
  });
};

export const getUserByCredentials = (
  identifier: string,
  password?: string,
  _grantType?: GrantIdentifier,
  _client?: OAuthClient,
): Promise<OAuthUser | undefined> =>
  db.query.users.findFirst({
    where: (users, { eq, and }) =>
      and(
        eq(users.id, Number(identifier)),
        password ? eq(users.password, password) : undefined,
      ),
  });
