import { define } from "../../../utils.ts";
import { UserForm } from "../../../islands/UserForm.tsx";
import { page } from "fresh";
import { db } from "../../../db/client.ts";
import { actors, images, profiles } from "../../../db/models.ts";
import { eq } from "drizzle-orm";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.readAsDataURL(file);
  });

async function extracted(handle: string) {
  const [{ profiles: profile }] = await db.select({ profiles }).from(actors)
    .innerJoin(profiles, eq(profiles.actorId, actors.id))
    .where(eq(actors.identifier, handle));
  return profile;
}

export const handler = define.handlers({
  GET: async ({ params }) => {
    const handle = params.handle!;
    const actor = await extracted(handle);

    if (!actor) {
      throw new Deno.errors.NotFound();
    }

    const header = db.select({ header: images.url }).from(images)
      .innerJoin(profiles, eq(profiles.headerId, images.id));

    return page({
      handle,
      name: actor.name ?? handle,
      header: (await header)[0].header,
    });
  },
  POST: async ({ params, req }) => {
    const handle = params.handle;
    const { actorId } = await extracted(handle);

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;

    const header = formData.get("header") as File | null;
    // TODO: save on disk
    const headerUrl = header && await fileToDataUrl(header);
    const headerDescription = formData.get("headerDescription") as
      | string
      | null;

    const { profile } = await db.transaction(async (t) => {
      const [profile] = await t.update(profiles)
        .set({ name, htmlBio: bio })
        .where(eq(profiles.actorId, actorId))
        .returning({
          name: profiles.name,
          avatarId: profiles.avatarId,
          headerId: profiles.headerId,
        });

      if (profile.headerId) {
        await t.update(images)
          .set({ url: headerUrl ?? undefined, description: headerDescription })
          .where(eq(images.id, profile.headerId));
      } else if (headerUrl) {
        const [{ id: headerId }] = await t.insert(images)
          .values({
            type: "image/jpg",
            url: headerUrl,
            description: headerDescription,
          })
          .returning({ id: images.id });
        await t.update(profiles).set({ headerId })
          .where(eq(profiles.actorId, actorId));
      }

      return { profile };
    });

    return page({
      handle,
      name: profile.name ?? "",
      header: headerUrl ?? "",
    });
  },
});

const UpdateUserPage = define.page<typeof handler>((ctx) => {
  return <UserForm initialData={ctx.data} />;
});

export default UpdateUserPage;
