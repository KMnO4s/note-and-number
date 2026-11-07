import { describe, it, expect } from "vitest";
import { evaluateDocument } from "./engine";
const one = (s: string) => evaluateDocument(s)[0];
const n = (s: string) => evaluateDocument(s).at(-1)!.numeric;

describe("numi engine", () => {
  it("arithmetic", () => expect(n("12 * (3 + 4)")).toBe(84));
  it("percent of", () => expect(n("20% de 150")).toBe(30));
  it("percent add/sub", () => { expect(n("150 + 20%")).toBeCloseTo(180); expect(n("150 - 10%")).toBeCloseTo(135); });
  it("variables", () => expect(n("loyer = 850 €\nloyer * 12")).toBe(10200));
  it("km to miles", () => expect(n("5 km en miles")).toBeCloseTo(3.107, 2));
  it("compound time", () => expect(n("3 h 20 min en min")).toBe(200));
  it("celsius", () => expect(n("100 °C en °F")).toBeCloseTo(212));
  it("sum of block", () => expect(n("10\n20\nsum")).toBe(30));
  it("prev", () => expect(n("10\nprev * 2")).toBe(20));
  it("comments", () => expect(one("# titre").kind).toBe("comment"));
  it("date", () => expect(evaluateDocument("aujourd'hui + 3 semaines", new Date(2026, 0, 1))[0].text).toContain("22"));
});
