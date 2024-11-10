import { Auth } from "@auth/core";
import { OAuth2Config, TokenEndpointHandler } from "@auth/core/providers";
import { Handler } from "$fresh/server.ts";

const options = {
  clientId: "9_mpl9d8ddXoJ1kyU_4p8T6cP72Gk3kEKbNgVXww1xg",
  clientSecret: "XEXipvK-78KGtBbrPCAvM4YOj0eQKwrwWM5f-XfDSuc",
  issuer: "http://localhost:8000",
};

const CustomProvider: OAuth2Config<
  { id: string; username: string; avatar_static: string }
> = {
  id: "custom_mastodon",
  name: "Custom Mastodon",
  type: "oauth",
  authorization: `${options.issuer}/oauth/authorize?scope=read`,
  token: {
    url: `${options.issuer}/oauth/token`,
    request: async (
      context: {
        checks: { code_verifier: string };
        client: { redirect_uris: string[] };
        provider: {
          token: Required<
            TokenEndpointHandler
          >;
          clientId: string;
          clientSecret: string;
        };
        params: Record<string, unknown>;
      },
    ) => {
      const client = context.client;
      const token = context.provider.token;

      const res = await fetch(token.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: context.params.code as string,
          grant_type: "authorization_code",
          code_verifier: context.checks
            .code_verifier,
          client_id: context.provider.clientId as string,
          client_secret: context.provider
            .clientSecret as string,
          redirect_uri: client.redirect_uris[0],
        }),
      });
      return {
        tokens: await res.json(),
      };
    },
  },
  userinfo: `${options.issuer}/api/v1/accounts/verify_credentials`,
  profile(profile) {
    return {
      id: profile.id,
      name: profile.username,
      image: profile.avatar_static,
      email: null,
    };
  },
  options,
};

export const handler: Handler = (req) => {
  return Auth(req, {
    trustHost: true,
    secret: "test_secret", // change this
    providers: [CustomProvider],
  });
};
