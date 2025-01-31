import { eq } from "drizzle-orm";
import { getActorFromUsername } from "./repositories/actors.ts";
import {
  countFollowersByActor,
  countFollowingByActor,
} from "./repositories/follows.ts";
import { countActorsPosts, getPostsFromActor } from "./repositories/posts.ts";
import { db } from "../../db/client.ts";
import { profiles } from "../../db/models.ts";

export const getProfileFromUsername = async (
  username: string,
): Promise<Mastodon.Account> => {
  const user = await getActorFromUsername(username);

  const [profile] = await db.select().from(profiles).where(
    eq(profiles.actorId, user.id),
  );

  const followingCount = countFollowingByActor(user.id);
  const followerCount = countFollowersByActor(user.id);
  const postCount = countActorsPosts(user.id);

  return {
    username,
    id: user.id.toString(),
    display_name: profile.name ?? username,
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

  return getPostsFromActor(user.id);
};
