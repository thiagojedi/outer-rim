import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: () => {
    return Response.json({
      "version": "0.0.1",
      "uri": "mastodon.social",
      "title": "Outer Ring",
      "short_description":
        "The original server operated by the Mastodon gGmbH non-profit",
      "description": "",
      "languages": ["pt-br"],
      "email": "test@mail.com",
      "stats": {
        "user_count": 0,
        "status_count": 0,
        "domain_count": 0,
      },
    });
  },
};
