declare namespace Mastodon {
  type Account = {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    locked: boolean;
    bot: boolean;
    created_at: string;
    note: string;
    group: boolean;
    discoverable: null | boolean;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    last_status_at: string;
    emojis: Emoji[];
    fields: Field[];
  };

  type Field = {
    name: string;
    value: string;
    verified_at: null;
  };

  type Emoji = {
    shortcode: string;
    url: string;
    static_url: string;
  };
}
