import { page } from "fresh";
import { isNotNull } from "drizzle-orm";
import { authServer } from "../../../auth/server.ts";
import { define } from "../../../utils.ts";
import { db } from "../../../db/client.ts";
import { actors } from "../../../db/models.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.session.auth) {
      return ctx.redirect(
        "/login?" +
          new URLSearchParams({ redirect: ctx.url.toString() }),
      );
    }

    const users = await db.select({
      handle: actors.identifier,
      id: actors.id,
    }).from(actors)
      .where(isNotNull(actors.identifier));

    return page({ users });
  },
  POST: authServer.authorize,
});

export default define.page<typeof handler>(({ data: { users } }) => {
  return (
    <main className="container is-max-tablet">
      <div className="content">
        <p>Please select the profile</p>
      </div>
      <form method="POST">
        <div className="field">
          <label htmlFor="profile" className="label">Profile</label>
          <div className="control ">
            <div className="select">
              <select required name="profile" id="profile">
                <option value="">Select a profile</option>
                {users.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.handle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <input
              type="submit"
              className="button is-primary"
              value="Select"
            />
          </div>
        </div>
      </form>
    </main>
  );
});
