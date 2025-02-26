import { page } from "fresh";
import { eq, isNotNull } from "drizzle-orm";
import { db } from "../db/client.ts";
import { actors, images, profiles } from "../db/models.ts";
import { define } from "../utils.ts";
import { Card } from "../common/components/Card.tsx";
import { formatDate } from "../common/helpers/date.ts";

export const handler = define.handlers({
  GET: async () => {
    const users = await db
      .select({
        id: actors.id,
        handle: actors.identifier,
        name: profiles.name,
        bio: profiles.htmlBio,
        avatar: images.url,
      })
      .from(actors)
      .innerJoin(profiles, eq(profiles.actorId, actors.id))
      .leftJoin(images, eq(images.id, profiles.avatarId))
      .where(isNotNull(actors.identifier));

    return page({ profiles: users });
  },
});

export default define.page<typeof handler>(({ data: { profiles } }) => (
  <>
    <header className="section has-text-centered">
      <div className="container">
        <h1 className="title">Welcome to the Outer Rim</h1>
      </div>
    </header>
    <main>
      {profiles && (
        <section className="section">
          <div className="container">
            <h1 className="title">Profiles</h1>
            <ul>
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <Card
                    title={<a href={`/@${profile.handle}`}>{profile.name}</a>}
                    subtitle={`@${profile.handle}`}
                    avatar={profile.avatar ?? undefined}
                    content={<div className="content">{profile.bio}</div>}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container">
          <h1 className="title">About</h1>
          <p>
            This is a single user microblog server, connected to others social
            services through the ActivityPub protocol. In other words, it is
            part of the FediVerse.
          </p>
        </div>
      </section>
    </main>
    <footer className="footer">
      <div className="content has-text-centered">
        <div className="columns">
          <div className="column">Made with 🥥🥤 in Brazil</div>
          <div className="column">
            <a href="https://github.com/thiagojedi/outer-rim">Source</a>
          </div>
          <div className="column">{formatDate(new Date(), "yyyy")}</div>
        </div>
      </div>
    </footer>
  </>
));
