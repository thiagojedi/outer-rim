import { define } from "../../../../../utils.ts";

export const handler = define.handlers({
  GET: () => {
    // Return account info
    // See https://docs.joinmastodon.org/methods/accounts/#verify_credentials
    return Response.json({});
  },
});
