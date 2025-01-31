import { define } from "../../../../../../utils.ts";
import { getTimeline } from "../../../../../../modules/microblog/timeline.ts";

export const handler = define.handlers({
  GET: async ({ url }) => {
    const query = url.searchParams;

    const local = query.get("local") as "true" | "false" ??
      "false";

    const maxId = query.get("max_id");
    const sinceId = query.get("since_id");
    const minId = query.get("min_id");

    const response = await getTimeline(
      local === "true" ? "local" : "global",
      {
        maxId,
        minId,
        sinceId,
      },
    );

    return Response.json(response);
  },
});
