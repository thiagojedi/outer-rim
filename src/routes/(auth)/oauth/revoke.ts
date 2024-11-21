import { define } from "../../../utils.ts";
import { getByBearerToken, revoke } from "../../../auth/repositories/tokens.ts";
import { STATUS_CODE } from "@std/http";

export const handler = define.handlers(async (ctx) => {
  const formData = await ctx.req.formData();
  const token = formData.get("token") as string;
  const client_id = formData.get("client_id") as string;

  const existingToken = await getByBearerToken(token);

  if (client_id !== existingToken?.clientId) {
    return Response.json(
      {
        error: "unauthorized_client",
        error_description: "You are not authorized to revoke this token",
      },
      { status: STATUS_CODE.Forbidden },
    );
  }

  await revoke(token);

  return Response.json({});
});
