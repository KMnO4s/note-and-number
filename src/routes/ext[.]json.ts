import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ext.json")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const body = {
          identifier: "dev.lovable.numi-notes",
          name: "Numi Notes",
          content_type: "SN|Component",
          area: "editor-editor",
          version: "1.0.0",
          description: "Calculatrice textuelle façon Numi.",
          url: `${origin}/`,
          download_url: "",
          latest_url: `${origin}/ext.json`,
        };
        return new Response(JSON.stringify(body, null, 2), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      },
    },
  },
});
