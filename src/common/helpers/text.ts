import { unescape } from "@std/html/entities";

export const stripHtml = (html: string) =>
  unescape(
    html
      .replaceAll("</p>", "\r\n\r\n")
      .replaceAll("<br/>", "\r\n")
      .replace(/(\r\n)+$/, "")
      .replace(/<[^>]*>/g, ""),
  );
