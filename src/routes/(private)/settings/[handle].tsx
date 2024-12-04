import { define } from "../../../utils.ts";
import { UserForm } from "../../../islands/UserForm.tsx";
import { page } from "fresh";
import { db } from "../../../db/client.ts";
import { actors } from "../../../db/models.ts";
import { eq } from "drizzle-orm";
import { updateActor } from "../../../federation/repositories/actor.ts";

async function extracted(handle: string) {
  const [actor] = await db.select({
    id: actors.id,
    name: actors.name,
  }).from(actors).where(eq(actors.handle, handle));
  return actor;
}

export const handler = define.handlers({
  GET: async ({ params, url }) => {
    const actor = await extracted(params.handle);

    if (!actor) {
      throw new Deno.errors.NotFound();
    }

    const handle = params.handle.replace(/@/g, "").replace(
      url.host,
      "",
    );

    return page({
      handle,
      name: actor.name ?? handle,
    });
  },
  POST: async ({ params, req, url }) => {
    const { id } = await extracted(params.handle);

    const formData = await req.formData();
    const name = formData.get("name") as string | null;

    const [newActor] = await updateActor(id, { name });

    const handle = params.handle.replace(/@/g, "").replace(
      url.host,
      "",
    );

    return page({
      handle,
      name: newActor.name || handle,
    });
  },
});

const UpdateUserPage = define.page<typeof handler>((ctx) => {
  return <UserForm initialData={ctx.data} />;
});

export default UpdateUserPage;
