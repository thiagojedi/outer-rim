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
    noindex?: null | boolean;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    last_status_at: null | string;
    emojis: Emoji[];
    fields: Field[];
  };

  type Privacy = "public" | "unlisted" | "private" | "direct";

  type CredentialAccount = Account & {
    source: {
      note: string;
      fields: Field[];
      privacy: Privacy;
      sensitive: boolean;
      language: string;
    };
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
