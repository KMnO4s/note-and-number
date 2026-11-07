import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function createPagesManifest(template, pageUrl) {
  const url = new URL(pageUrl);
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("An HTTPS Pages URL is required.");
  url.search = "";
  url.hash = "";
  const root = `${url.href.replace(/\/+$/, "")}/`;
  return { ...template, url: root, latest_url: `${root}ext.json`, download_url: "" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const pageUrl = process.argv[2];
  const destination = process.argv[3] ?? "dist/client/ext.json";
  if (!pageUrl) throw new Error("Provide the GitHub Pages URL.");
  const template = JSON.parse(await readFile("ext.json", "utf8"));
  await mkdir(resolve(destination, ".."), { recursive: true });
  await writeFile(destination, `${JSON.stringify(createPagesManifest(template, pageUrl), null, 2)}\n`);
}