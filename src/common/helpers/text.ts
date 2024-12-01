//@ts-types="@types/sanitize-html"
import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "span",
  "br",
  "a",
  "del",
  "pre",
  "code",
  "em",
  "strong",
  "b",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
];

const allowedAttributes = {
  "span": ["class"],
  "a": ["href", "rel", "class"],
  "ol": ["start", "reversed"],
  "li": ["value"],
};

/**
 * Removes html tags to prevent XSS attacks
 * @see {@link https://docs.joinmastodon.org/spec/activitypub/#sanitization}
 */
export const clearHtml = (rawHtml: string) => {
  const noHeaders = rawHtml
    .replace(/<h[123456].*?>/g, "<p><strong>")
    .replace(/<\\h[123456]>/g, "</strong></p>");

  return sanitizeHtml(noHeaders, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https"],
  });
};
