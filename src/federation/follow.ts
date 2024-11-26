import {
  Accept,
  Follow,
  getActorHandle,
  InboxListenerSetters,
  Undo,
} from "@fedify/fedify";
import { createActor, getActorByIdentifier } from "./repositories/actor.ts";
import { createFollow, deleteFollow } from "./repositories/follow.ts";

export const setupFollows = (inbox: InboxListenerSetters<unknown>) => {
  inbox.on(Follow, async (ctx, follow) => {
    if (follow.objectId === null) {
      return;
    }

    const object = ctx.parseUri(follow.objectId);

    if (object === null || object?.type !== "actor") {
      return;
    }

    const follower = await follow.getActor();
    if (
      follower === null || follower?.id === null || follower?.inboxId === null
    ) {
      return;
    }

    const { id: followingId } = await getActorByIdentifier(object.identifier);

    const { id: followerId } = await createActor({
      uri: follower.id.href,
      handle: await getActorHandle(follower),
      name: follower.name?.toString(),
      inboxUrl: follower.inboxId,
      sharedInboxUrl: follower.endpoints?.sharedInbox,
      url: follower.url?.href ? new URL(follower.url.href) : null,
    });

    await createFollow({ followingId, followerId });

    const accept = new Accept({
      actor: follow.objectId,
      to: follow.actorId,
      object: follow,
    });
    await ctx.sendActivity(object, follower, accept);
  })
    .on(Undo, async (ctx, undo) => {
      const object = await undo.getObject();

      if (!(object instanceof Follow)) {
        return;
      }
      if (undo.actorId === null || object.objectId === null) {
        return;
      }
      const parsed = ctx.parseUri(object.objectId);
      if (parsed === null || parsed.type !== "actor") {
        return;
      }

      await deleteFollow(undo.actorId.href, parsed.identifier);
    });
};
