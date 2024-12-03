import { define } from "../../utils.ts";
import federation from "../../federation/index.ts";
import { page } from "fresh";
import { STATUS_CODE } from "@std/http";
import {
  getProfileFromUsername,
  listPostsFromUsername,
} from "../../modules/microblog/profile.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    const handle = ctx.params.handle;
    if (handle.search("@") > 1) {
      const context = federation.createContext(ctx.req, undefined);

      return Response.redirect(
        context.getActorUri(handle),
        STATUS_CODE.PermanentRedirect,
      );
    }

    const username = handle.replace("@", "");

    const profile = getProfileFromUsername(username);

    const posts = listPostsFromUsername(username);

    return page({ profile: await profile, posts: await posts });
  },
});

const ProfilePage = define.page<typeof handler>(
  ({ data: { profile, posts } }) => {
    return (
      <main className="container">
        <header className="hero">
          <div className="hero-body">
            <p className="title">{profile.display_name}</p>
            <p className="subtitle">@{profile.username}</p>
          </div>
        </header>

        <details>
          <summary>Raw Profile</summary>
          <pre><code>{JSON.stringify(profile, undefined, 2)}</code></pre>
        </details>

        {posts.map((post) => {
          return (
            <article key={post.id}>
              <details>
                <summary>Raw Post</summary>
                <pre><code>{JSON.stringify(post, undefined, 2)}</code></pre>
              </details>
            </article>
          );
        })}
      </main>
    );
  },
);

export default ProfilePage;
