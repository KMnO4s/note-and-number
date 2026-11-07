import { describe, expect, it } from "vitest";
import template from "../../ext.json";
// @ts-expect-error The build-time JavaScript script has no declaration file.
import { createPagesManifest } from "../../scripts/pages-manifest.mjs";

describe("GitHub Pages distribution", () => {
  it("uses the Pages repository URL for the editor and installation", () => {
    const manifest = createPagesManifest(template, "https://raphael.github.io/note-and-number");
    expect(manifest.url).toBe("https://raphael.github.io/note-and-number/");
    expect(manifest.latest_url).toBe("https://raphael.github.io/note-and-number/ext.json");
    expect(manifest.content_type).toBe("SN|Component");
    expect(manifest.area).toBe("editor-editor");
  });
  it("supports a custom Pages domain", () => {
    const manifest = createPagesManifest(template, "https://notes.example.org/");
    expect(manifest.url).toBe("https://notes.example.org/");
    expect(manifest.latest_url).toBe("https://notes.example.org/ext.json");
  });
  it("does not advertise a missing offline archive", () => {
    expect(createPagesManifest(template, "https://raphael.github.io/notes/").download_url).toBe("");
  });
});