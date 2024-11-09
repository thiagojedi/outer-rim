import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { db } from "../../../../application/db/client.ts";
import {
  applications,
  redirectUris,
  scopes as scopesTable,
} from "../../../../application/db/models.ts";
import { z } from "zod";
import { generateRandomId } from "../../../../application/db/utils.ts";

const appPayloadSchema = z.object({
  client_name: z.string(),
  redirect_uris: z.string().array(),
  scopes: z.string(),
  website: z.string().url(),
});

export const handler: Handlers = {
  POST: async (req, _ctx) => {
    const { data: payload, success, error } = appPayloadSchema.safeParse(
      await req.json(),
    );

    if (!success) {
      return Response.json(error.issues, {
        status: STATUS_CODE.BadRequest,
      });
    }

    const transactionReturn = await db.transaction(async (tx) => {
      const {
        client_name: name,
        redirect_uris,
        scopes: appScopes,
        website,
      } = payload;

      const [newApp] = await tx.insert(applications).values({
        name,
        website,
        client_id: generateRandomId(), // TODO Generate ID
        client_secret: generateRandomId(), // TODO Generate secret
      }).returning();

      const scopes = appScopes.split(" ").map((scope) => ({
        applicationId: newApp.id,
        scope,
      }));
      await tx.insert(scopesTable).values(scopes);
      await tx.insert(redirectUris).values(
        redirect_uris.map((uri) => ({ applicationId: newApp.id, uri })),
      );

      return {
        ...newApp,
        scopes: scopes.map((scope) => scope.scope),
        redirect_uris,
        "updatedAt": undefined,
        "createdAt": undefined,
        "deletedAt": undefined,
      };
    });

    return Response.json(transactionReturn, { status: 200 });
  },
};
