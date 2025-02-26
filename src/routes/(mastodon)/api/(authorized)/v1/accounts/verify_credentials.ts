import { define } from "../../../../../../utils.ts";
import { getActorProfileById } from "../../../../../../modules/federation/repositories/actor.ts";
import {
  countFollowers,
  countFollowing,
} from "../../../../../../modules/federation/repositories/follow.ts";
import {
  countPosts,
  getLastPostDate,
} from "../../../../../../modules/federation/repositories/post.ts";
import { formatDate } from "../../../../../../common/helpers/date.ts";
import { stripHtml } from "../../../../../../common/helpers/text.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const profileId = ctx.state.session.profileId;

    if (!profileId) {
      return Response.error();
    }

    const actor = await getActorProfileById(profileId);

    const followers = await countFollowers(profileId);
    const following = await countFollowing(profileId);

    const posts = await countPosts(profileId);
    const lastPostDate = await getLastPostDate(profileId);

    // Return account info
    // See https://docs.joinmastodon.org/methods/accounts/#verify_credentials
    const data: Mastodon.CredentialAccount = {
      "id": actor.actors.id,
      "username": actor.actors.identifier,
      "acct": actor.actors.identifier,
      "display_name": actor.profiles.name ?? "",
      "locked": false,
      "bot": actor.profiles.bot,
      "discoverable": true,
      "group": false,
      "created_at": actor.actors.created.toISOString(),
      "note": actor.profiles.htmlBio ?? "",
      "url": "https://bolha.us/@jedi",
      "avatar":
        "https://cdn.bolha.us/bolhaprod/accounts/avatars/111/585/233/051/545/705/original/f227e8c942b15e73.jpg",
      "avatar_static":
        "https://cdn.bolha.us/bolhaprod/accounts/avatars/111/585/233/051/545/705/original/f227e8c942b15e73.jpg",
      "header":
        "https://cdn.bolha.us/bolhaprod/accounts/headers/111/585/233/051/545/705/original/1fa0b76ba71057f2.gif",
      "header_static":
        "https://cdn.bolha.us/bolhaprod/accounts/headers/111/585/233/051/545/705/static/1fa0b76ba71057f2.png",
      "followers_count": followers,
      "following_count": following,
      "statuses_count": posts,
      "last_status_at": formatDate(lastPostDate),
      "source": {
        "privacy": "public",
        "sensitive": false,
        "language": "",
        "note": stripHtml(actor.profiles.htmlBio ?? ""),
        "fields": [],
      },
      "emojis": [],
      "fields": [],
    };

    return Response.json(data);
  },
});
