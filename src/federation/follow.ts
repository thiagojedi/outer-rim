import {
  Accept,
  Follow,
  getActorHandle,
  InboxListenerSetters,
  Undo,
} from "@fedify/fedify";
import { db } from "../db/client.ts";
import { actors, follows, users } from "../db/models.ts";
import { and, eq } from "drizzle-orm";

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

    const [{ id: followingId }] = await db.select({ id: actors.id }).from(
      actors,
    )
      .innerJoin(users, eq(users.id, actors.id))
      .where(eq(users.username, object.identifier));

    const [{ id: followerId }] = await db.insert(actors).values({
      uri: follower.id.href,
      handle: await getActorHandle(follower),
      name: follower.name?.toString(),
      inboxUrl: follower.inboxId,
      sharedInboxUrl: follower.endpoints?.sharedInbox,
      url: follower.url?.href ? new URL(follower.url.href) : null,
    }).returning();

    await db.insert(follows).values({ followingId, followerId });

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

      const actorBeingFollowed = db.$with("follower").as(
        db.select({ id: actors.id }).from(actors).innerJoin(
          users,
          eq(users.id, actors.userId),
        ).where(eq(users.username, parsed.identifier)),
      );
      const actorFollowing = db.$with("following").as(
        db.select({ id: actors.id }).from(actors).where(
          eq(actors.uri, undo.actorId.href),
        ),
      );

      await db.delete(follows).where(and(
        eq(follows.followerId, actorFollowing),
        eq(follows.followingId, actorBeingFollowed.id),
      ));
    });
};
