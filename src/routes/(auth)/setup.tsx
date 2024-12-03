import { define } from "../../utils.ts";
import { createUser, hasUsers } from "../../auth/repositories/users.ts";
import { page } from "fresh";
import federation from "../../federation/index.ts";
import { db } from "../../db/client.ts";
import { createActor } from "../../federation/repositories/actor.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    if (await hasUsers()) {
      return ctx.redirect("/login");
    }

    return page();
  },

  POST: async (ctx) => {
    const formData = await ctx.req.formData();

    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const context = federation.createContext(ctx.req, undefined);
      db.transaction(async (tx) => {
        await createUser(email, password, username, tx);
        await createActor({
          userId: 1,
          uri: context.getActorUri(username).href,
          name: username,
          handle: `@${username}@${ctx.req.url}`,
          inboxUrl: context.getInboxUri(username),
          sharedInboxUrl: context.getInboxUri(),
          url: new URL(`/@${username}`, ctx.url),
        }, tx);
      });

      return ctx.redirect("/login");
    } catch {
      return page({ error: true });
    }
  },
});

const SetupPage = define.page<typeof handler>(({ data }) => {
  const error = data?.error;

  return (
    <main className="container is-max-tablet">
      {error && <p>Error</p>}
      <header className="section has-text-centered">
        <h1 className="title">
          Welcome to the Outer Ring
        </h1>
        <p>
          Before you can start exploring the FediVerse, we need to create your
          user
        </p>
      </header>
      <form method="POST">
        <div className="field">
          <label htmlFor="username" className="label">Handle</label>
          <div className="control has-icons-left">
            <input
              name="username"
              className={`input + ${error ? "is-danger" : ""}`}
              type="text"
              placeholder="username"
            />
            <span className="icon is-small is-left">
              <i className="fas fa-at"></i>
            </span>
          </div>
          <p className="help">Your username so people will search you</p>
        </div>

        <div className="field">
          <label htmlFor="email" className="label">E-mail</label>
          <div className="control has-icons-left">
            <input
              name="email"
              className={`input + ${error ? "is-danger" : ""}`}
              type="text"
              placeholder="user@example.com"
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          </div>
          <p className="help">Setup your e-mail to receive notifications</p>
        </div>

        <div className="field">
          <label htmlFor="password" className="label">Password</label>
          <div className="control has-icons-left">
            <input
              name="password"
              className={`input + ${error ? "is-danger" : ""}`}
              type="password"
            />
            <span className="icon is-small is-left">
              <i className="fas fa-key"></i>
            </span>
          </div>
        </div>

        <div className="field is-grouped is-grouped-centered">
          <div className="control">
            <input type="submit" className="button is-primary" value="Create" />
          </div>

          <div className="control">
            <input type="reset" className="button" />
          </div>
        </div>
      </form>
    </main>
  );
});

export default SetupPage;
