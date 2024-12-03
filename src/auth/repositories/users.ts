import { compare, genSalt, hash } from "bcrypt";
import { db, Driver } from "../../db/client.ts";
import { users } from "../../db/models.ts";

export const createUser = async (
  email: string,
  password: string,
  driver: Driver = db,
) => {
  const salt = genSalt();
  await driver.insert(users).values({
    email,
    password: await hash(password, await salt),
  });
};

export const getUserById = (
  identifier: number,
  driver: Driver = db,
) =>
  driver.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, identifier),
  });

export const getUserByUsernameOrEmail = async (
  usernameOrEmail: string,
  password?: string,
  driver: Driver = db,
) => {
  const user = await driver.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, usernameOrEmail),
  });

  if (!user) return;

  if (password && !(await compare(password, user.password))) return;

  return user;
};

export const hasUsers = (driver = db) =>
  driver.$count(users).then((count) => {
    console.log(count);
    return count > 0;
  });
