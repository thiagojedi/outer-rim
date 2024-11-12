import { STATUS_CODE } from "@std/http";

import { z } from "zod";
import { createClientApp } from "../../../../auth/repositories/clients.ts";
import { define } from "../../../../utils.ts";

const appPayloadSchema = z.object({
  client_name: z.string(),
  redirect_uris: z.string().array(),
  scopes: z.string(),
  website: z.string().url(),
});

export const handler = define.handlers({
  POST: async ({ req }) => {
    const body = await req.json();

    if (typeof body.redirect_uris === "string") {
      body.redirect_uris = [body.redirect_uris];
    }

    const { data, success, error } = appPayloadSchema
      .safeParse(await body);

    if (!success) {
      return Response.json(error.issues, {
        status: STATUS_CODE.BadRequest,
      });
    }

    const createdApp = await createClientApp(data);

    return Response.json(createdApp, { status: STATUS_CODE.OK });
  },
});
