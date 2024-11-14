import { GrantIdentifier, OAuthClient, OAuthUser } from "@jmondi/oauth2-server";
import { compare, genSalt, hash } from "bcrypt";
import { db } from "../../db/client.ts";
import { users } from "../../db/models.ts";

export const createUser = async (
  username: string,
  password: string,
  driver = db,
) => {
  const salt = genSalt();
  await driver.insert(users).values({
    username,
    password: await hash(password, await salt),
  });
};

export const getUserByCredentials = async (
  identifier: string,
  password?: string,
  _grantType?: GrantIdentifier,
  _client?: OAuthClient,
  driver = db,
): Promise<OAuthUser | undefined> => {
  const user = await driver.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, Number(identifier)),
  });

  if (!user) return;

  if (password && !(await compare(password, user.password))) return;

  return user;
};

export const getUserByUsername = async (
  username: string,
  password: string,
  driver = db,
) => {
  const user = await driver.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (!user) return;

  if (password && !(await compare(password, user.password))) return;

  return user;
};
