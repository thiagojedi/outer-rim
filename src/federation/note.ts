import {
  Create,
  Federation,
  Note,
  PUBLIC_COLLECTION,
  RequestContext,
} from "@fedify/fedify";
import { getPost } from "./repositories/post.ts";

export const setupNotes = (federation: Federation<unknown>) => {
  federation.setObjectDispatcher(
    Note,
    "/users/{identifier}/posts/{id}",
    async (ctx, values) => {
      const post = await getPost(values.identifier, values.id);

      if (!post) {
        return null;
      }

      return new Note({
        id: ctx.getObjectUri(Note, values),
        url: ctx.getObjectUri(Note, values),
        attribution: ctx.getActorUri(values.identifier),
        cc: ctx.getFollowersUri(values.identifier),
        to: PUBLIC_COLLECTION,
        mediaType: "text/html",
        content: post.posts.content,
        published: Temporal.Instant.from(post.posts.created.toISOString()),
      });
    },
  );
};

export const sendNote = async (
  ctx: RequestContext<unknown>,
  username: string,
  post: { id: number },
): Promise<URL> => {
  const noteArgs = { identifier: username, id: post.id.toString() };
  const note = await ctx.getObject(Note, noteArgs);

  await ctx.sendActivity(
    {
      identifier: username,
    },
    "followers",
    new Create({
      id: new URL("#activity", note?.id ?? undefined),
      object: note,
      actors: note?.attachmentIds,
      tos: note?.toIds,
      ccs: note?.ccIds,
    }),
  );

  return ctx.getObjectUri(Note, noteArgs);
};
