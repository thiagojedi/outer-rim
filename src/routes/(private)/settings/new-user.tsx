import { define } from "../../../utils.ts";
import { UserForm } from "../../../islands/UserForm.tsx";
import { page } from "fresh";
import { createActor } from "../../../federation/repositories/actor.ts";
import federation from "../../../federation/mod.ts";

export const handler = define.handlers({
  POST: async ({ redirect, req, url }) => {
    const formData = await req.formData();

    const context = federation.createContext(req, undefined);

    const username = formData.get("handle") as string | null;

    if (!username) {
      return page({ error: "handle" });
    }

    const name = formData.get("name") as string | null;

    await createActor({
      userId: 1,
      uri: context.getActorUri(username).href,
      name: name ?? username,
      handle: `@${username}@${url.host}`,
      inboxUrl: context.getInboxUri(username),
      sharedInboxUrl: context.getInboxUri(),
      url: context.getActorUri(username),
    });

    return redirect("/settings");
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
      <UserForm method="POST" />
    </>
  );
});

export default NewUserPage;
