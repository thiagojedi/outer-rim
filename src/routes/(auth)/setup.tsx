import { define } from "../../utils.ts";
import { createUser, hasUsers } from "../../auth/repositories/users.ts";
import { page } from "fresh";

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
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("password_confirm") as string;

    if (password !== confirmPassword) {
      return page({ error: "Passwords are not equal" });
    }

    try {
      await createUser(email, password);

      return ctx.redirect("/login");
    } catch (e) {
      return page({ error: e });
    }
  },
});

const SetupPage = define.page<typeof handler>(({ data }) => {
  const error = data?.error;

  return (
    <main className="container is-max-tablet">
      {error && (
        <section className="notification is-danger is-light">
          {error}
        </section>
      )}
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
          <label htmlFor="email" className="label">E-mail</label>
          <div className="control has-icons-left">
            <input
              name="email"
              className="input"
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
            <input name="password" className="input" type="password" />
            <span className="icon is-small is-left">
              <i className="fas fa-key"></i>
            </span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="password_confirm" className="label">
            Confirm Password
          </label>
          <div className="control has-icons-left">
            <input name="password_confirm" className="input" type="password" />
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
