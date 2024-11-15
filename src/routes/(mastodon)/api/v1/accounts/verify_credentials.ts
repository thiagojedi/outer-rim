import { define } from "../../../../../utils.ts";

export const handler = define.handlers({
  GET: () => {
    // Return account info
    // See https://docs.joinmastodon.org/methods/accounts/#verify_credentials
    return Response.json({
      "id": "111585233051545705",
      "username": "jedi",
      "acct": "jedi",
      "display_name": "Thiago, Cavalheiro Jedi",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2023-12-15T00:00:00.000Z",
      "note":
        "<p>Thiago, nicknamed &quot;Jedi&quot; by friends and colleagues. Lover of languages. Full snack dev. </p><p>Expect lots of jokes, dev rants, and minor updates from my day to day life.</p><p>Thiago, apelidado de &quot;Jedi&quot; pelos amigos e colegas. Amante de linguagens. Desenvolvedor full snack.</p><p>Espere um monte de piadas, reclamações do trabalho, e pequenas crônicas do meu dia a dia.</p><p>Posts in Português, English, and ocasionally Castellano. I do my best to mark the post language correctly, you may want to filter them out.</p><p>From :bandeira_rn: to the world</p>",
      "url": "https://bolha.us/@jedi",
      "uri": "https://bolha.us/users/jedi",
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
      "hide_collections": true,
      "noindex": false,
      "source": {
        "privacy": "public",
        "sensitive": false,
        "language": "pt",
        "note":
          'Thiago, nicknamed "Jedi" by friends and colleagues. Lover of languages. Full snack dev. \r\n\r\nExpect lots of jokes, dev rants, and minor updates from my day to day life.\r\n\r\nThiago, apelidado de "Jedi" pelos amigos e colegas. Amante de linguagens. Desenvolvedor full snack.\r\n\r\nEspere um monte de piadas, reclamações do trabalho, e pequenas crônicas do meu dia a dia.\r\n\r\nPosts in Português, English, and ocasionally Castellano. I do my best to mark the post language correctly, you may want to filter them out.\r\n\r\nFrom :bandeira_rn: to the world',
        "fields": [],
        "follow_requests_count": 0,
        "hide_collections": true,
        "discoverable": true,
        "indexable": true,
      },
      "emojis": [],
      "roles": [],
      "fields": [],
    });
  },
});
