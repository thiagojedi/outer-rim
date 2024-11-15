import { define } from "../../../utils.ts";

export const handler = define.middleware((ctx) => {
  /*
    TODO: Create mocks for these endpoints for moshidon "compliance"
    - /api/v1/preferences
    - /api/v1/filters
    - /api/v1/announcements?with_dismissed=false
    - /api/v1/instance
    - /api/v1/followed_tags
    - /api/v1/lists
    - /api/v1/timelines/home?limit=40
     */
  return ctx.next();
});
