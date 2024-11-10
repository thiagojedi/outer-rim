import { Handlers } from "$fresh/server.ts";
import { oauthServer } from "../../application/auth/server.ts";
import {
  Request as OAuthRequest,
  Response as OAuthResponse,
} from "oauth2-server";

export const handler: Handlers = {
  POST: async (req, ctx) => {
    const query = Object.fromEntries(ctx.url.searchParams.entries());

    const response = new OAuthResponse();
    await oauthServer.authorize(
      new OAuthRequest({
        query,
        method: req.method,
        headers: req.headers,
        body: { user: { user: 1 } },
      }),
      response,
      {
        authenticateHandler: {
          handle: (req: OAuthRequest) => req.body.user,
        },
      },
    );

    return new Response(null, response);
  },
};

const LoginForm = () => {
  return (
    <>
      <form method="POST">
        <fieldset>
          <input type="text" name="user" />
          <input type="text" name="password" />
        </fieldset>
        <input type="submit" value="Login" />
      </form>
    </>
  );
};

export default LoginForm;
