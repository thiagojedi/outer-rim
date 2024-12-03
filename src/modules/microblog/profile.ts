import { getActorFromUsername } from "./repositories/actors.ts";
import {
  countFollowersByActor,
  countFollowingByActor,
} from "./repositories/follows.ts";
import { countActorsPosts, getPosts } from "./repositories/posts.ts";

export const getProfileFromUsername = async (
  username: string,
): Promise<Mastodon.Account> => {
  const user = await getActorFromUsername(username);

  const followingCount = countFollowingByActor(user.id);
  const followerCount = countFollowersByActor(user.id);
  const postCount = countActorsPosts(user.id);

  return {
    username,
    id: user.id.toString(),
    display_name: user.name ?? username,
    acct: username,
    created_at: user.created.toISOString(),
    locked: false,
    note: "",
    bot: false,
    group: false,
    avatar: "",
    avatar_static: "",
    header: "",
    header_static: "",
    discoverable: null,
    followers_count: await followerCount,
    following_count: await followingCount,
    statuses_count: await postCount,
    emojis: [],
    fields: [],
    last_status_at: "",
    url: "",
  };
};

export const listPostsFromUsername = async (username: string) => {
  const user = await getActorFromUsername(username);

  return getPosts(user.id);
};
