import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { stripHtml } from "./text.ts";

describe("text.ts", () => {
  describe("stripHtml", () => {
    it("should strip html tags", () => {
      const html = "<h1>test</h1> <small><span>other test</span></small>";

      const clear = stripHtml(html);

      expect(clear).toBe("test other test");
    });

    it("should add new lines at the end of paragraph tags", () => {
      const html = "<p>this is a paragraph</p> <p>this is other paragraph</p>";

      const clear = stripHtml(html);

      expect(clear).toBe("this is a paragraph\r\n\r\n this is other paragraph");
    });

    it("shoudl add new lines for break tags", () => {
      const html = "this is a <br/> test";

      const clear = stripHtml(html);

      expect(clear).toBe("this is a \r\n test");
    });

    it("should handle real life scenario", () => {
      const html =
        "<p>Thiago, nicknamed &quot;Jedi&quot; by friends and colleagues. Lover of languages. Full snack dev. </p><p>Expect lots of jokes, dev rants, and minor updates from my day to day life.</p><p>Thiago, apelidado de &quot;Jedi&quot; pelos amigos e colegas. Amante de linguagens. Desenvolvedor full snack.</p><p>Espere um monte de piadas, reclamações do trabalho, e pequenas crônicas do meu dia a dia.</p><p>Posts in Português, English, and ocasionally Castellano. I do my best to mark the post language correctly, you may want to filter them out.</p><p>From :bandeira_rn: to the world</p>";

      const clear = stripHtml(html);

      expect(clear).toBe(
        'Thiago, nicknamed "Jedi" by friends and colleagues. Lover of languages. Full snack dev. \r\n\r\nExpect lots of jokes, dev rants, and minor updates from my day to day life.\r\n\r\nThiago, apelidado de "Jedi" pelos amigos e colegas. Amante de linguagens. Desenvolvedor full snack.\r\n\r\nEspere um monte de piadas, reclamações do trabalho, e pequenas crônicas do meu dia a dia.\r\n\r\nPosts in Português, English, and ocasionally Castellano. I do my best to mark the post language correctly, you may want to filter them out.\r\n\r\nFrom :bandeira_rn: to the world',
      );
    });
  });
});
