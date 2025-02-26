import {
  Endpoints,
  exportJwk,
  Federation,
  generateCryptoKeyPair,
  importJwk,
  Person,
} from "@fedify/fedify";
import { getActorByIdentifier } from "./repositories/actor.ts";
import { createKey, getKeysForUser } from "./repositories/key.ts";
import { countFollowers, countFollowing } from "./repositories/follow.ts";

export const setupActor = (federation: Federation<unknown>) => {
  federation
    .setActorDispatcher("/@{identifier}", async (ctx, identifier) => {
      const user = await getActorByIdentifier(identifier);

      if (!user) return null;

      const keys = await ctx.getActorKeyPairs(identifier);

      return new Person({
        id: ctx.getActorUri(identifier),
        preferredUsername: identifier,
        // Display name
        name: user.name,
        published: user.created.toTemporalInstant(),
        inbox: ctx.getInboxUri(identifier),
        endpoints: new Endpoints({
          sharedInbox: ctx.getInboxUri(),
        }),
        url: user.url,
        publicKey: keys[0].cryptographicKey,
        assertionMethods: keys.map((key) => key.multikey),
        // Custom fields
        attachments: [],
        manuallyApprovesFollowers: false,
        suspended: false,
        memorial: false,
        // Bio
        // summary: '',
        // Avatar
        // icon: new Image({
        //   url: new URL(""),
        //   mediaType: "image/jpeg"
        // })
        // Header
        // image: new Image({
        //   url: new URL(""),
        //   mediaType: "image/jpeg"
        // })
      });
    })
    .setKeyPairsDispatcher(async (_, identifier) => {
      const user = await getActorByIdentifier(identifier);

      if (!user) {
        return [];
      }

      const rows = await getKeysForUser(user.id);
      const keysMap = Object.fromEntries(rows.map((row) => [row.type, row]));

      return (await Promise.allSettled(
        (["RSASSA-PKCS1-v1_5", "Ed25519"] as const).map(
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

  federation
    .setFollowersDispatcher(
      "/users/{identifier}/followers",
      () => ({ items: [] }),
    )
    .setCounter(async (_ctx, identifier) => {
      const { id } = await getActorByIdentifier(identifier);

      return countFollowers(id);
    });

  federation
    .setFollowingDispatcher(
      "/users/{identifier}/following",
      () => ({ items: [] }),
    )
    .setCounter(async (_ctx, identifier) => {
      const { id } = await getActorByIdentifier(identifier);

      return countFollowing(id);
    });
};
