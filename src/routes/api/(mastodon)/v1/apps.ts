import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { z } from "zod";
import { createClientApp } from "../../../../auth/repositories/clients.ts";

const appPayloadSchema = z.object({
  client_name: z.string(),
  redirect_uris: z.string().array(),
  scopes: z.string(),
  website: z.string().url(),
});

export const handler: Handlers = {
  POST: async (req, _ctx) => {
    const { data, success, error } = appPayloadSchema
      .safeParse(await req.json());

    if (!success) {
      return Response.json(error.issues, {
        status: STATUS_CODE.BadRequest,
      });
    }

    const createdApp = await createClientApp(data);

    return Response.json(createdApp, { status: STATUS_CODE.OK });
  },
};
