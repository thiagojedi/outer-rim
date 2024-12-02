import { clearHtml } from "../../common/helpers/text.ts";
import { createPost, updatePostUri } from "./repositories/post.ts";

export const newPost = (
  post: {
    status: string;
    visibility: Visibility;
    sensitive: boolean;
    language: string;
  },
  actorId: number,
) =>
  createPost({
    actorId,
    content: clearHtml(post.status),
    visibility: post.visibility,
    sensitive: post.sensitive,
    language: post.language,
    uri: "temp",
  });

export const setPostUri = (postId: number, uri: URL) =>
  updatePostUri(postId, { uri: uri.href });
