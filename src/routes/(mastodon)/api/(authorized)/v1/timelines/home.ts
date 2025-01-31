import { define } from "../../../../../../utils.ts";
import { getTimeline } from "../../../../../../modules/microblog/timeline.ts";

export const handler = define.handlers({
  GET: async ({ url }) => {
    const query = url.searchParams;

    const maxId = query.get("max_id");
    const sinceId = query.get("since_id");
    const minId = query.get("min_id");

    const response = await getTimeline("home", { maxId, sinceId, minId });

    return Response.json(response);
  },
});
