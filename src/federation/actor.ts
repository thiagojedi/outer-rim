import {
  Endpoints,
  exportJwk,
  Federation,
  generateCryptoKeyPair,
  importJwk,
  Person,
} from "@fedify/fedify";
import { getActorByIdentifier } from "./repositories/actor.ts";
import { getUserByUsernameOrEmail } from "../auth/repositories/users.ts";
import { createKey, getKeysForUser } from "./repositories/key.ts";

export const setupActor = (federation: Federation<unknown>) => {
  federation.setActorDispatcher(
    "/users/{identifier}",
    async (ctx, identifier) => {
      const user = await getActorByIdentifier(identifier);

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
  ).setKeyPairsDispatcher(async (_, identifier) => {
    const user = await getUserByUsernameOrEmail(identifier);

    if (!user) {
      return [];
    }

    const rows = await getKeysForUser(user.id);
    const keysMap = Object.fromEntries(rows.map((row) => [row.type, row]));

    return (await Promise.allSettled(
      (["Ed25519", "RSASSA-PKCS1-v1_5"] as const).map(
        async (keyType) => {
          if (keysMap[keyType]) {
            return {
              privateKey: await importJwk(
                JSON.parse(keysMap[keyType].privateKey),
                "private",
              ),
              publicKey: await importJwk(
                JSON.parse(keysMap[keyType].publicKey),
                "public",
              ),
            } as CryptoKeyPair;
          } else {
            const { privateKey, publicKey } = await generateCryptoKeyPair(
              keyType,
            );

            await createKey({
              userId: user.id,
              type: keyType,
              privateKey: JSON.stringify(await exportJwk(privateKey)),
              publicKey: JSON.stringify(await exportJwk(publicKey)),
            });

            return { privateKey, publicKey } as CryptoKeyPair;
          }
        },
      ),
    )).filter((r) => r.status === "fulfilled").map((r) => r.value);
  });
};
