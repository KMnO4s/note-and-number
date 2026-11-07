import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { evaluateDocument, grandTotal } from "@/lib/numi/engine";

const DEMO = `# Budget mensuel
loyer = 850 €
courses = 320 €
transport = 75 €
total

# Pourcentages
20% de 150
150 + 20%

# Conversions
5 km en miles
3 h 20 min en min
100 °C en °F
100 € en $

aujourd'hui + 3 semaines`;

const STORAGE_KEY = "numi-notes-demo";

function highlight(line: string): ReactNode {
  const t = line.trim();
  if (t.startsWith("#") || t.startsWith("//")) return <span className="text-syntax-comment">{line}</span>;
  const parts = line.split(/(\d+(?:[.,]\d+)?|[€$£%°]|[+\-*/^=()])/g);
  return parts.map((p, i) => {
    if (!p) return null;
    if (/^\d/.test(p)) return <span key={i} className="text-syntax-number">{p}</span>;
    if (/^[€$£%°]$/.test(p)) return <span key={i} className="text-syntax-unit">{p}</span>;
    if (/^[+\-*/^=()]$/.test(p)) return <span key={i} className="text-syntax-op">{p}</span>;
    return <span key={i}>{p}</span>;
  });
}

export function NumiEditor() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"loading" | "sn" | "demo">("loading");
  const [copied, setCopied] = useState<number | null>(null);
  const relayRef = useRef<any>(null);
  const noteRef = useRef<any>(null);
  const hlRef = useRef<HTMLPreElement>(null);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.parent === window) {
      setText(localStorage.getItem(STORAGE_KEY) ?? DEMO);
      setMode("demo");
      return;
    }
    let cancelled = false;
    import("@standardnotes/component-relay").then(({ default: ComponentRelay }) => {
      if (cancelled) return;
      const relay = new ComponentRelay({
        targetWindow: window,
        options: { coallesedSaving: true, coallesedSavingDelay: 400 },
        onReady: () => setMode("sn"),
      });
      relayRef.current = relay;
      relay.streamContextItem((note: any) => {
        noteRef.current = note;
        if (note.isMetadataUpdate) return;
        setText(note.content?.text ?? "");
      });
    });
    const t = setTimeout(() => setMode((m) => (m === "loading" ? "demo" : m)), 3000);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  const onChange = (value: string) => {
    setText(value);
    if (mode === "demo") { localStorage.setItem(STORAGE_KEY, value); return; }
    const relay = relayRef.current, note = noteRef.current;
    if (!relay || !note) return;
    relay.saveItemWithPresave(note, () => {
      note.content.text = value;
      note.content.preview_plain = value.split("\n").slice(0, 3).join(" ").slice(0, 120);
    });
  };

  const results = useMemo(() => evaluateDocument(text), [text]);
  const lines = text.split("\n");
  const total = grandTotal(results);

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (hlRef.current) { hlRef.current.scrollTop = scrollTop; hlRef.current.scrollLeft = scrollLeft; }
    if (resRef.current) resRef.current.scrollTop = scrollTop;
  };

  const copy = (i: number, v: string) => {
    navigator.clipboard?.writeText(v);
    setCopied(i);
    setTimeout(() => setCopied(null), 900);
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-[3]">
          <pre ref={hlRef} aria-hidden className="numi-text pointer-events-none absolute inset-0 m-0 overflow-hidden p-6">
            {lines.map((l, i) => <div key={i}>{l ? highlight(l) : "\u200b"}</div>)}
          </pre>
          <textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            onScroll={syncScroll}
            spellCheck={false}
            wrap="off"
            aria-label="Calculs"
            placeholder="Tapez un calcul… ex. 20% de 150"
            className="numi-text absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent p-6 text-transparent caret-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div ref={resRef} className="numi-text min-w-0 flex-[2] overflow-hidden border-l border-border bg-card p-6 text-right">
          {results.map((r, i) =>
            r.kind === "value" ? (
              <button key={i} onClick={() => copy(i, r.text)} title="Copier" className="block w-full truncate text-right font-semibold text-result hover:opacity-70">
                {copied === i ? "Copié ✓" : r.text}
              </button>
            ) : <div key={i}>{"\u200b"}</div>,
          )}
          <div className="h-[50vh]" />
        </div>
      </div>
      <footer className="flex items-center justify-between border-t border-border bg-card px-6 py-2 font-mono text-xs text-muted-foreground">
        <span>{mode === "sn" ? "Standard Notes · sauvegarde auto" : mode === "demo" ? "Mode démo · enregistré dans ce navigateur" : "Connexion…"}</span>
        <span>Total <b className="text-result">{total.toLocaleString("fr-FR", { maximumFractionDigits: 4 })}</b></span>
      </footer>
    </div>
  );
}
