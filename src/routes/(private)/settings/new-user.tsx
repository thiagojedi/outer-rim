import { define } from "../../../utils.ts";
import { UserForm } from "../../../islands/UserForm.tsx";
import { page } from "fresh";
import { createActor } from "../../../federation/repositories/actor.ts";
import federation from "../../../federation/mod.ts";
import { db } from "../../../db/client.ts";
import { profiles } from "../../../db/models.ts";

export const handler = define.handlers({
  POST: async ({ redirect, req, url }) => {
    const formData = await req.formData();

    const context = federation.createContext(req, undefined);

    const username = formData.get("handle") as string | null;

    if (!username) {
      return page({ error: "handle" });
    }

    const name = formData.get("name") as string;

    await db.transaction(async (t) => {
      const { id: actorId } = await createActor({
        userId: 1,
        identifier: username,
        uri: context.getActorUri(username).href,
        handle: `@${username}@${url.host}`,
        inboxUrl: context.getInboxUri(username),
        sharedInboxUrl: context.getInboxUri(),
        url: context.getActorUri(username),
      }, t);

      await t.insert(profiles)
        .values({ actorId, name });
    });

    return redirect(`/settings/${username}`);
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
      <UserForm />
    </>
  );
});

export default NewUserPage;
