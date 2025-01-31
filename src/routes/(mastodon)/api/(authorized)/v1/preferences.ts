import { define } from "../../../../../utils.ts";

export const handler = define.handlers({
  GET: () =>
    Response.json({
      "posting:default:visibility": "public",
      "posting:default:sensitive": false,
      "posting:default:language": null,
      "reading:expand:media": "default",
      "reading:expand:spoilers": false,
    }),
});
