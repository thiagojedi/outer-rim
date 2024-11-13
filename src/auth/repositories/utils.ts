import { applications, tokens } from "../../db/models.ts";

const parseDate = (date: string | null | undefined) =>
  date ? new Date(Date.parse(date)) : undefined;

export const toOathToken = <
  T extends Omit<typeof tokens.$inferSelect, "clientId" | "userId"> & {
    client?: typeof applications.$inferSelect;
  },
>(token: T) =>
  token && ({
    ...token,
    accessTokenExpiresAt: parseDate(token.accessTokenExpiresAt),
    refreshTokenExpiresAt: parseDate(token.refreshTokenExpiresAt),
    refreshToken: token.refreshToken ?? undefined,
    client: {
      ...token.client,
      id: token.client?.client_id,
      grants: ["authorization_code", "refresh_token"],
    },
  });
