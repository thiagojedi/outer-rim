import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { z } from "zod";
import { createClientApp } from "../../../../auth/repositories/clients.ts";
import { getLogger } from "@logtape/logtape";

const appPayloadSchema = z.object({
  client_name: z.string(),
  redirect_uris: z.string().array(),
  scopes: z.string(),
  website: z.string().url(),
});

const logger = getLogger("fresh");

export const handler: Handlers = {
  POST: async (req, _ctx) => {
    const body = await req.json();

    if (typeof body.redirect_uris === "string") {
      body.redirect_uris = [body.redirect_uris];
    }

    const { data, success, error } = appPayloadSchema
      .safeParse(await body);

    logger.error`Error parsing: ${error}`;

    if (!success) {
      return Response.json(error.issues, {
        status: STATUS_CODE.BadRequest,
      });
    }

    const createdApp = await createClientApp(data);

    return Response.json(createdApp, { status: STATUS_CODE.OK });
  },
};
