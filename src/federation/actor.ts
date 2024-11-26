import {
  Endpoints,
  exportJwk,
  Federation,
  generateCryptoKeyPair,
  importJwk,
  Person,
} from "@fedify/fedify";
import { db } from "../db/client.ts";
import { actors, keys, users } from "../db/models.ts";
import { eq } from "drizzle-orm";

export const setupActor = (federation: Federation<unknown>) => {
  federation.setActorDispatcher(
    "/users/{identifier}",
    async (ctx, identifier) => {
      const [user] = await db.select({ name: actors.name }).from(users)
        .innerJoin(actors, eq(actors.userId, users.id))
        .where(eq(users.username, identifier));

      if (!user) return null;

      const keys = await ctx.getActorKeyPairs(identifier);

      return new Person({
        id: ctx.getActorUri(identifier),
        preferredUsername: identifier,
        name: user.name,
        inbox: ctx.getInboxUri(identifier),
        endpoints: new Endpoints({
          sharedInbox: ctx.getInboxUri(),
        }),
        url: ctx.getActorUri(identifier),
        publicKey: keys[0].cryptographicKey,
        assertionMethods: keys.map((key) => key.multikey),
      });
    },
  )
    .setKeyPairsDispatcher(async (_, identifier) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, identifier),
      });

      if (!user) {
        return [];
      }

      const rows = await db.query.keys.findMany({
        where: (keys, { eq }) => eq(keys.userId, user.id),
      });
      const keysMap = Object.fromEntries(rows.map((row) => [row.type, row]));

      const promises = (["RSASSA-PKCS1-v1_5", "Ed25519"] as const).map(
        async (keyType) => {
          if (keysMap[keyType]) {
            return ({
              privateKey: await importJwk(
                JSON.parse(keysMap[keyType].private_key),
                "private",
              ),
              publicKey: await importJwk(
                JSON.parse(keysMap[keyType].public_key),
                "public",
              ),
            });
          } else {
            const { privateKey, publicKey } = await generateCryptoKeyPair(
              keyType,
            );

            await db.insert(keys).values({
              userId: user.id,
              type: keyType,
              privateKey: JSON.stringify(await exportJwk(privateKey)),
              publicKey: JSON.stringify(await exportJwk(publicKey)),
            });

            return ({ privateKey, publicKey });
          }
        },
      );

      return Promise.all(promises);
    });
};
