import { getPosts } from "./repositories/posts.ts";

type TimelineOptions = Partial<{
  /**
   * All results returned will be lesser than this ID.
   * In effect, sets an upper bound on results.
   */
  maxId: null | string;
  /**
   * All results returned will be greater than this ID.
   * In effect, sets a lower bound on results.
   */
  minId: null | string;
  /**
   * Returns results immediately newer than this ID.
   * In effect, sets a cursor at this ID and paginates forward.
   */
  sinceId: null | string;
  limit?: number;
}>;

export const getTimeline = async (
  _type: "home" | "local" | "global",
  { limit, ...options }: TimelineOptions,
): Promise<Mastodon.Status[]> => {
  const posts = await getPosts(options, limit);

  return posts.map(({ posts: post, actors: actor, profiles: profile }) => {
    const status: Mastodon.Status = {
      id: post.id,
      created_at: post.created.toISOString(),
      in_reply_to_id: null,
      in_reply_to_account_id: null,
      sensitive: false,
      spoiler_text: "",
      visibility: "public",
      language: "",
      uri: "",
      url: null,
      replies_count: 0,
      reblogs_count: 0,
      favourites_count: 0,
      favourited: false,
      reblogged: false,
      muted: false,
      bookmarked: false,
      content: post.content,
      reblog: null,
      media_attachments: [],
      mentions: [],
      tags: [],
      emojis: [],
      card: null,
      poll: null,

      account: {
        id: actor.id,
        username: actor.identifier,
        acct: actor.identifier,
        display_name: profile.name ?? "",
        locked: false,
        bot: profile.bot,
        discoverable: true,
        group: false,
        created_at: actor.created.toISOString(),
        note: profile.htmlBio ?? "",
        url: "https://bolha.us/@jedi",
        avatar:
          "https://cdn.bolha.us/bolhaprod/accounts/avatars/111/585/233/051/545/705/original/f227e8c942b15e73.jpg",
        avatar_static:
          "https://cdn.bolha.us/bolhaprod/accounts/avatars/111/585/233/051/545/705/original/f227e8c942b15e73.jpg",
        header:
          "https://cdn.bolha.us/bolhaprod/accounts/headers/111/585/233/051/545/705/original/1fa0b76ba71057f2.gif",
        header_static:
          "https://cdn.bolha.us/bolhaprod/accounts/headers/111/585/233/051/545/705/static/1fa0b76ba71057f2.png",
        followers_count: 0,
        following_count: 0,
        statuses_count: 0,
        last_status_at: "",
        emojis: [],
        fields: [],
      },
    };

    return status;
  });
};
