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

export const getTimeline = (
  _type: "home" | "local" | "global",
  _options: TimelineOptions,
): Promise<Mastodon.Status[]> => {
  return Promise.resolve([]);
};
