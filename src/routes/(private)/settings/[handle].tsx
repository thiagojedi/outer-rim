import { define } from "../../../utils.ts";
import { UserForm } from "../../../islands/UserForm.tsx";
import { page } from "fresh";
import { db } from "../../../db/client.ts";
import { actors, images, profiles } from "../../../db/models.ts";
import { eq } from "drizzle-orm";
import { formDataToObject } from "../../../common/helpers/object.ts";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.readAsDataURL(file);
  });

async function getProfileByHandle(handle: string) {
  const [{ profiles: profile }] = await db.select().from(actors)
    .innerJoin(profiles, eq(profiles.actorId, actors.id))
    .where(eq(actors.identifier, handle));
  return profile;
}

export const handler = define.handlers({
  GET: async ({ params }) => {
    const handle = params.handle!;
    const profile = await getProfileByHandle(handle);

    if (!profile) {
      throw new Deno.errors.NotFound();
    }

    const headerPromise = db.select().from(images)
      .where(eq(images.id, profile.headerId!));
    const avatarPromise = db.select().from(images)
      .where(eq(images.id, profile.avatarId!));

    const [header] = await headerPromise;
    const [avatar] = await avatarPromise;

    return page({
      handle,
      ...profile,
      name: profile.name || handle,
      header,
      avatar,
    });
  },
  POST: async ({ params, req }) => {
    const handle = params.handle;
    const { actorId } = await getProfileByHandle(handle);

    const formData = await req.formData();

    const header = formData.get("header") as File | null;
    // TODO: save on disk
    const headerUrl = header && await fileToDataUrl(header);
    const headerDescription = formData.get("header.description") as
      | string
      | null;

    const values = formDataToObject(formData);

    await db.transaction(async (t) => {
      const [profile] = await t.update(profiles)
        .set(values)
        .where(eq(profiles.actorId, actorId))
        .returning({
          avatarId: profiles.avatarId,
          headerId: profiles.headerId,
        });

      if (profile.headerId) {
        await t.update(images)
          .set({
            url: headerUrl ?? undefined,
            description: headerDescription ?? "",
          })
          .where(eq(images.id, profile.headerId));
      } else if (headerUrl) {
        const [{ id: headerId }] = await t.insert(images)
          .values({
            type: "image/jpg",
            url: headerUrl,
            description: headerDescription ?? "",
          })
          .returning({ id: images.id });
        await t.update(profiles).set({ headerId })
          .where(eq(profiles.actorId, actorId));
      }
    });

    return new Response();
  },
});

const UpdateUserPage = define.page<typeof handler>((ctx) => {
  return (
    <UserForm
      initialData={ctx.data}
      method="POST"
      action={`./${ctx.data.handle}`}
    />
  );
});

export default UpdateUserPage;
