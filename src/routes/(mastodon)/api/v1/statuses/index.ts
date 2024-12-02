import { define } from "../../../../../utils.ts";
import federation from "../../../../../federation/index.ts";
import { Note } from "@fedify/fedify";
import { newPost, setPostUri } from "../../../../../modules/microblog/post.ts";
import { getActorByUserId } from "../../../../../modules/microblog/repositories/actor.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    const { userId } = ctx.state.session;

    const [{ id: actorId, username: identifier }] = await getActorByUserId(
      userId!,
    );

    const body = await ctx.req.json();

    const [createdPost] = await newPost(body, actorId);

    const context = federation.createContext(ctx.url, undefined);

    const uri = context.getObjectUri(Note, {
      identifier,
      id: createdPost.id.toString(),
    });

    await setPostUri(createdPost.id, uri);

    const createdStatus: Mastodon.Status = {
      id: createdPost.id.toString(),
      created_at: createdPost.created.toISOString(),
      edited_at: null,
      in_reply_to_id: null,
      in_reply_to_account_id: null,
      sensitive: !!createdPost.sensitive,
      language: createdPost.language ?? "en",
      spoiler_text: "",
      visibility: createdPost.visibility ?? "public",
      uri: createdPost.uri,
      url: createdPost.url?.href ?? "",
      replies_count: 0,
      reblogs_count: 0,
      favourites_count: 0,
      content: createdPost.content,
      reblog: null,
      mentions: [],
      media_attachments: [],
      tags: [],
      card: null,
      poll: null,
      emojis: [],
      account: {
        "id": "111585233051545705",
        "username": "jedi",
        "acct": "jedi",
        "display_name": "Thiago, Cavalheiro Jedi",
        "locked": false,
        "bot": false,
        "discoverable": true,
        "group": false,
        "created_at": "2023-12-15T00:00:00.000Z",
        "note":
          "<p>Thiago, nicknamed &quot;Jedi&quot; by friends and colleagues. Lover of languages. Full snack dev. </p><p>Expect lots of jokes, dev rants, and minor updates from my day to day life.</p><p>Thiago, apelidado de &quot;Jedi&quot; pelos amigos e colegas. Amante de linguagens. Desenvolvedor full snack.</p><p>Espere um monte de piadas, reclamações do trabalho, e pequenas crônicas do meu dia a dia.</p><p>Posts in Português, English, and ocasionally Castellano. I do my best to mark the post language correctly, you may want to filter them out.</p><p>From :bandeira_rn: to the world</p>",
        "url": "https://bolha.us/@jedi",
        "avatar":
          "https://cdn.bolha.us/bolhaprod/accounts/avatars/111/585/233/051/545/705/original/f227e8c942b15e73.jpg",
        "avatar_static":
          "https://cdn.bolha.us/bolhaprod/accounts/avatars/111/585/233/051/545/705/original/f227e8c942b15e73.jpg",
        "header":
          "https://cdn.bolha.us/bolhaprod/accounts/headers/111/585/233/051/545/705/original/1fa0b76ba71057f2.gif",
        "header_static":
          "https://cdn.bolha.us/bolhaprod/accounts/headers/111/585/233/051/545/705/static/1fa0b76ba71057f2.png",
        "followers_count": 1099,
        "following_count": 731,
        "statuses_count": 1819,
        "last_status_at": "2024-11-14",
        "emojis": [],
        "fields": [],
      },
    };

    return Response.json(createdStatus);
  },
});
