import MarkdownItMagicLink from "markdown-it-magic-link";
import { defineConfig } from "vite";
import "@slidev/cli";

export default defineConfig({
  slidev: {
    markdown: {
      markdownItSetup(md) {
        md.use(MarkdownItMagicLink, {
          linksMap: {},
        });
      },
    },
  },
  server: {
    allowedHosts: ["conferval-semiexposed-imelda.ngrok-free.dev"],
  },
});
