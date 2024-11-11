import { Auth } from "@auth/core";
import { OAuth2Config, TokenEndpointHandler } from "@auth/core/providers";
import { define } from "../../utils.ts";

const options = {
  clientId: "qCwcuNuk5d3lYG3co5WuBddFYYOk-RXBg2bAlNaXH3w",
  clientSecret: "0zikjdnBMXvC4EyTxl651ReVMJ1xcsCfvlJsOlzR_xc",
  issuer: "http://localhost:8000",
};

const CustomProvider: OAuth2Config<
  { id: string; username: string; avatar_static: string }
> = {
  id: "custom_mastodon",
  name: "Custom Mastodon",
  type: "oauth",
  authorization:
    `${options.issuer}/oauth/authorize?scope=read%20write%20follow%20push`,
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

export const handler = define.handlers(({ req }) => {
  return Auth(req, {
    trustHost: true,
    secret: "test_secret", // change this
    providers: [CustomProvider],
  });
});
