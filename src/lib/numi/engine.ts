import { create, all, type MathJsInstance } from "mathjs";

export type LineResult = { kind: "empty" | "comment" | "value" | "error"; text: string; numeric?: number };

// Static rates relative to EUR — adjust here.
export const CURRENCY_RATES: Record<string, number> = { USD: 1.08, GBP: 0.85, CHF: 0.95, JPY: 165, CAD: 1.5 };

function buildMath(): MathJsInstance {
  const math = create(all!, {});
  math.createUnit("EUR", { aliases: ["eur", "euro", "euros"] });
  for (const [code, rate] of Object.entries(CURRENCY_RATES)) {
    math.createUnit(code, { definition: `${1 / rate} EUR`, aliases: [code.toLowerCase()] });
  }
  return math;
}
const math = buildMath();

const WORDS: [RegExp, string][] = [
  [/€/g, " EUR "], [/\$/g, " USD "], [/£/g, " GBP "],
  [/°\s*C\b/g, " degC"], [/°\s*F\b/g, " degF"],
  [/\b(\d+(?:[.,]\d+)?)\s*(K|M|G|T)o\b/g, "$1 $2B"], [/\bko\b/g, "kB"],
  [/\bsemaines?\b/gi, "weeks"], [/\bjours?\b/gi, "days"], [/\bheures?\b/gi, "hours"],
  [/\bmois\b/gi, "months"], [/\bans?\b/gi, "years"], [/\bmètres?\b/gi, "m"],
  [/\bdivisé par\b/gi, "/"], [/\bplus\b/gi, "+"], [/\bmoins\b/gi, "-"], [/\bfois\b/gi, "*"],
  [/\s(en|in|vers)\s/gi, " to "],
  [/(\d\s*|to\s+)min\b/g, "$1minute"],
];

function preprocess(src: string): string {
  let s = src.replace(/(\d),(\d)/g, "$1.$2");
  for (const [re, rep] of WORDS) s = s.replace(re, rep);
  // "USD 100" -> "100 USD"
  s = s.replace(/\b(EUR|USD|GBP)\s+(\d+(?:\.\d+)?)/g, "$2 $1");
  // Percentages
  s = s.replace(/(\d+(?:\.\d+)?)\s*%\s*(?:de|of|d')\s*/gi, "($1/100)*");
  s = s.replace(/([+-])\s*(\d+(?:\.\d+)?)\s*%/g, (_m, op, p) => `*(1${op}${p}/100)`);
  s = s.replace(/(\d+(?:\.\d+)?)\s*%/g, "($1/100)");
  // "3 h 20 min" -> "3 h + 20 min"
  s = s.replace(/(\d\s*[a-zA-Z]+)\s+(?=\d)/g, "$1 + ");
  s = s.trim();
  const i = s.lastIndexOf(" to ");
  if (i > 0 && !s.includes("=")) s = `(${s.slice(0, i)}) to ${s.slice(i + 4)}`;
  return s;
}

const DATE_RE = /^(aujourd'hui|today|demain|tomorrow|hier|yesterday)\s*(?:([+-])\s*(.+))?$/i;

function formatValue(v: unknown): { text: string; numeric?: number } {
  if (typeof v === "number") {
    return { text: v.toLocaleString("fr-FR", { maximumFractionDigits: 6 }), numeric: v };
  }
  if (math.isUnit(v)) {
    const u = v as any;
    const name = u.formatUnits();
    const num = u.toNumber(name);
    const unitLabel = name.replace(/\bEUR\b/, "€").replace(/\bUSD\b/, "$").replace(/\bGBP\b/, "£")
      .replace(/\bdegC\b/, "°C").replace(/\bdegF\b/, "°F").replace(/\bminute\b/, "min");
    return { text: `${num.toLocaleString("fr-FR", { maximumFractionDigits: 4 })} ${unitLabel}`, numeric: num };
  }
  if (math.isBigNumber(v) || math.isFraction(v)) return formatValue(Number(v));
  if (v && typeof v === "object" && "re" in (v as any)) return { text: math.format(v as any, { precision: 8 }) };
  return { text: String(v) };
}

export function evaluateDocument(text: string, now = new Date()): LineResult[] {
  const scope = new Map<string, unknown>();
  const out: LineResult[] = [];
  let block: number[] = [];
  let prev: unknown = undefined;

  for (const raw of text.split("\n")) {
    const line = raw.replace(/\/\/.*$/, "").trim();
    if (!line) { out.push({ kind: "empty", text: "" }); block = []; continue; }
    if (line.startsWith("#") || /^[^=\d]*:$/.test(line)) { out.push({ kind: "comment", text: "" }); continue; }

    const d = line.match(DATE_RE);
    if (d) {
      const base = new Date(now);
      const w = (d[1] ?? "").toLowerCase();
      if (w === "demain" || w === "tomorrow") base.setDate(base.getDate() + 1);
      if (w === "hier" || w === "yesterday") base.setDate(base.getDate() - 1);
      try {
        if (d[2]) {
          const delta = math.evaluate(preprocess(d[3] ?? "0")) as any;
          const days = math.isUnit(delta) ? delta.toNumber("days") : Number(delta);
          base.setTime(base.getTime() + (d[2] === "-" ? -1 : 1) * days * 86400000);
        }
        out.push({ kind: "value", text: base.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) });
      } catch { out.push({ kind: "error", text: "" }); }
      continue;
    }

    try {
      scope.set("prev", prev ?? 0);
      const blockVals = block.slice();
      const total = blockVals.reduce((a, b) => a + b, 0);
      scope.set("sum", total); scope.set("total", total);
      // Strip "Label: expr" prefixes
      const expr = preprocess(line.replace(/^[^=:\d(]+:\s*/, ""));
      const v = math.evaluate(expr, scope);
      if (v === undefined || typeof v === "function") { out.push({ kind: "error", text: "" }); continue; }
      const f = formatValue(v);
      out.push({ kind: "value", ...f });
      prev = v;
      if (f.numeric !== undefined) block.push(f.numeric);
    } catch {
      out.push({ kind: "error", text: "" });
    }
  }
  return out;
}

export function grandTotal(results: LineResult[]): number {
  return results.reduce((a, r) => a + (r.kind === "value" && r.numeric !== undefined ? r.numeric : 0), 0);
}
