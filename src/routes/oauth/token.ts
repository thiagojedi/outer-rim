import { Handler } from "$fresh/server.ts";
import { oauthServer } from "../../application/auth/server.ts";
import {
  Request as OAuthRequest,
  Response as OAuthResponse,
} from "npm:oauth2-server";

export const handler: Handler = async (req, ctx) => {
  const query = Object.fromEntries(ctx.url.searchParams.entries());
  const request = new OAuthRequest({
    query,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    body: Object.fromEntries((await req.formData()).entries()),
  });
  const response = new OAuthResponse();

  await oauthServer.token(request, response);

  const { headers, status, body } = response;

  return Response.json(body, {
    headers,
    status,
  });
};
