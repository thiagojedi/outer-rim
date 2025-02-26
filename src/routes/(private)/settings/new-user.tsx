import { define } from "../../../utils.ts";
import { UserForm } from "../../../islands/UserForm.tsx";
import { upsertActor } from "../../../modules/federation/repositories/actor.ts";
import federation from "../../../modules/federation/mod.ts";
import { db } from "../../../db/client.ts";
import { profiles } from "../../../db/models.ts";
import { formDataToObject } from "../../../common/helpers/object.ts";

export const handler = define.handlers({
  POST: async ({ req, url }) => {
    const formData = await req.formData();

    const context = federation.createContext(req, undefined);

    const username = formData.get("handle") as string | null;

    if (!username) {
      return Response.error();
    }

    const body = formDataToObject(formData);

    await db.transaction(async (t) => {
      const { id: actorId } = await upsertActor({
        userId: 1,
        identifier: username,
        uri: context.getActorUri(username).href,
        handle: `@${username}@${url.host}`,
        inboxUrl: context.getInboxUri(username),
        sharedInboxUrl: context.getInboxUri(),
        url: context.getActorUri(username),
      }, t);

      await t.insert(profiles)
        .values({ actorId, htmlBio: body.bio, ...body });
    });

    return Response.json({ username });
  },
});

const NewUserPage = define.page(() => {
  return (
    <>
      <header>
        <h2 className="subtitle">Create a new user</h2>
        <p>All fields can be changed in the future, except the handle</p>
      </header>
      <br />
      <UserForm action="./new-user" method="POST" redirect />
    </>
  );
});

export default NewUserPage;
