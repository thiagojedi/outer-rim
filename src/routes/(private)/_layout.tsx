import { eq, isNotNull } from "drizzle-orm";

import { define } from "../../utils.ts";
import { Menu } from "../../common/components/Menu.tsx";
import { db } from "../../db/client.ts";
import { actors, profiles } from "../../db/models.ts";

const Layout = define.page(async ({ Component, ...ctx }) => {
  const users = await db.select({
    handle: actors.identifier,
    name: profiles.name,
  }).from(actors)
    .innerJoin(profiles, eq(profiles.actorId, actors.id))
    .where(isNotNull(actors.identifier));

  const menu = [
    {
      label: "General",
      children: [{ label: "Preferences", path: "/settings" }],
    },
    {
      label: "Profiles",
      children: [
        ...users.map((user) => ({
          label: user.name || user.handle!,
          path: `/settings/${user.handle}`,
        })),
        { label: "+ Add new", path: "/settings/new-user" },
      ],
    },
  ];

  return (
    <>
      <header className="container hero has-text-centered">
        <div className="hero-body">
          <h1 className="title">Outer Ring</h1>
        </div>
      </header>
      <main className="container columns">
        <Menu className="column is-one-fifth" menu={menu} url={ctx.url} />

        <section className="column">
          <Component />
        </section>
      </main>
    </>
  );
});

export default Layout;
