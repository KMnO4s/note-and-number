import { createFileRoute } from "@tanstack/react-router";
import { NumiEditor } from "@/components/NumiEditor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Numi Notes — calculatrice pour Standard Notes" },
      { name: "description", content: "Éditeur Standard Notes qui calcule chaque ligne en temps réel : unités, pourcentages, devises, variables." },
      { property: "og:title", content: "Numi Notes — calculatrice pour Standard Notes" },
      { property: "og:description", content: "Calculs en langage naturel dans vos notes Standard Notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NumiEditor,
});
