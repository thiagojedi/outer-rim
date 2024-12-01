import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { clearHtml } from "./text.ts";

describe("clearHtml()", () => {
  it("should clear text", () => {
    assertEquals(clearHtml("<frame><p>testing</p></frame>"), "<p>testing</p>");
  });

  it("should convert headings", () => {
    assertEquals(
      clearHtml("<h1>Heading</h1>"),
      "<p><strong>Heading</strong></p>",
    );
  });

  it("should handle broken text", () => {
    assertEquals(clearHtml("<p>1 <= 2</p>"), "<p>1 &lt;= 2</p>");
  });
});
