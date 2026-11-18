import { useEffect, useMemo, useState } from "react";
import { PERIODS, TIMELINE, TECHNIQUES, QUOTES, LEDGER, QUIZ, PUBLISHERS } from "./data";
import { QNA } from "./qna";

/* ---------- progress bar ---------- */
function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setP(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="progress-wrap" aria-hidden="true">
      <div className="progress-bar" style={{ width: `${p}%` }} />
    </div>
  );
}

/* ---------- Bull States — illustrative reconstruction (never the plate) ---------- */
const BULL_STATES: { path: string; caption: string }[] = [
  { path: "M120 210 Q105 190 118 160 Q132 132 158 128 Q190 124 220 132 Q268 142 292 168 L296 212 Q300 244 268 256 L172 258 Q138 254 126 232 Z", caption: "State I — the meat: muscle, belly, ribs (Mourlot, Dec 15)" },
  { path: "M122 206 Q112 184 122 162 Q134 138 160 136 Q190 132 218 140 Q262 148 286 170 L289 208 Q292 236 264 246 L174 248 Q142 246 130 226 Z", caption: "State II — volume broken, legs thickened" },
  { path: "M126 200 Q118 178 130 162 Q142 144 164 146 Q192 144 216 150 Q252 156 274 176 L277 208 Q280 230 256 238 L176 240 Q148 238 136 220 Z", caption: "State III — mass drops, head rises" },
  { path: "M128 194 Q124 174 138 160 Q150 150 168 152 Q192 152 214 156 Q246 162 264 180 L266 204 Q268 222 246 228 L178 230 Q152 228 140 210 Z", caption: "State IV — shoulder simplified" },
  { path: "M132 188 Q130 172 146 162 Q158 156 174 158 Q194 158 212 162 Q238 168 252 182 L253 202 Q254 216 234 220 L182 222 Q156 221 146 204 Z", caption: "State V — ribs vanish; the belly floats" },
  { path: "M136 184 Q136 170 152 163 Q163 160 178 162 Q196 162 210 166 Q230 172 242 184 L243 200 Q243 211 226 214 L184 215 Q160 214 150 199 Z", caption: "State VI — the animal becomes profile+mass" },
  { path: "M142 180 Q146 170 158 165 Q170 162 184 164 Q199 164 209 168 Q224 174 232 184 L232 198 Q231 207 216 209 L188 210 Q168 208 156 197 Z", caption: "State VII — limbs exit; a torso remains" },
  { path: "M150 176 Q156 168 168 165 Q180 163 192 166 Q203 168 210 174 L210 192 L182 193 Q166 192 156 186 Z", caption: "State VIII — spine emerges" },
  { path: "M158 172 L176 164 L198 168 L206 178 L200 190 L160 188 Z", caption: "State IX — almost a sign" },
  { path: "M164 172 L182 166 L198 172 L188 184 Z", caption: "State X — three lines and a point" },
  { path: "M170 170 L184 168 L196 173 L184 180 L172 177 Z", caption: "State XI — glyph (ed. 50 + 18 AP · Bloch B.389)" },
];

function BullLab() {
  const [state, setState] = useState(0);
  const s = BULL_STATES[state];
  return (
    <div className="bull-frame" aria-label="Bull series interactive scrubber — illustrative reconstruction">
      <svg viewBox="0 0 400 300" role="img" aria-label="Bull state reconstruction">
        <path d="M40 60 L360 60 M40 250 L360 250" stroke="#00000022" strokeWidth="1" />
        <text x="40" y="40" fontSize="11" fill="#5a4a3d" fontFamily="Georgia">FRAME {state + 1}/11 — ILLUSTRATIVE RECONSTRUCTION (NEVER THE PLATE)</text>
        <path d={s.path} fill="none" stroke="#1c1712" strokeWidth={state < 8 ? 2.4 : 1.6} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="42" cy="252" r="3.4" fill="#1c1712" opacity="0.4" />
      </svg>
      <input
        className="scrub"
        type="range" min={0} max={10} step={1} value={state}
        onChange={(e) => setState(Number(e.target.value))}
        aria-label="Bull state scrubber"
      />
      <div className="bull-meta"><span>{s.caption}</span><span>{state + 1} / 11</span></div>
      <p className="small" style={{ color: "#9c8d78", margin: "10px 2px 0" }}>
        Technique anchor: Mourlot Atelier, 15 Dec 1945 – 17 Jan 1946 · Arches paper · reduction on ONE stone ·
        edition 50 + 18 AP · Bloch B.389 / M.17 · MoMA holds State XI. <a href="https://www.moma.org" style={{ color: "#ffd9a0" }}>View MoMA</a>
      </p>
    </div>
  );
}

/* ---------- Ask Pablo — offline RAG-lite over documented sources ---------- */
function retrieve(q: string, list: typeof QNA) {
  const toks = q.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const scored = list.map(item => {
    let score = 0;
    for (const t of toks) {
      if (t.length < 3) continue;
      for (const k of item.keys) {
        if (k.includes(t) || t.includes(k)) score += 2;
      }
      if (item.answer.toLowerCase().includes(t)) score += 1;
    }
    if (item.question.toLowerCase().includes(q.toLowerCase().trim())) score += 4;
    return { item, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].item : null;
}

function AskPablo() {
  const [log, setLog] = useState<{ who: "user" | "pablo"; text: string; sources?: { label: string; url: string }[] }[]>([
    { who: "pablo", text: "Sit down. Ask me anything about the work — materials, light, masks, war, money, women, speed. I will not invent a word the record does not carry.", sources: [{ label: "Simulation notice — ARTISAN AI", url: PUBLISHERS.picassoFr }] },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const ask = (q: string) => {
    const clean = q.trim();
    if (!clean || busy) return;
    setBusy(true);
    setLog(l => [...l, { who: "user", text: clean }]);
    setInput("");
    window.setTimeout(() => {
      const hit = retrieve(clean, QNA);
      setLog(l => hit
        ? [...l, { who: "pablo", text: hit.answer, sources: hit.sources }]
        : [...l, { who: "pablo", text: "I won't invent. The record carries: Blue Period · death of Casagemas · Demoiselles · Bull · Las Meninas · Guernica · copyright until 2044. Pick one of these, or see the Archive tab.", sources: [{ label: "Verified fallback — A8 quote ledger", url: PUBLISHERS.picassoFr }] }]);
      setBusy(false);
    }, 420);
  };

  const suggestions = [
    "Why is the Blue Period blue?",
    "Why does Demoiselles cause a scandal?",
    "Why is Guernica greyscale?",
    "What is the Bull series teaching me?",
    "Why are women central to your work — honestly?",
    "Aren't you infringing if you speak as Picasso?",
  ];

  return (
    <div className="grid-2" style={{ alignItems: "start" }}>
      <div>
        <div className="chatlog" aria-live="polite">
          {log.map((m, i) => (
            <div key={i} className={`msg ${m.who}`}>
              {m.text}
              {m.sources && m.sources.length > 0 && (
                <span className="src">
                  Sources:{" "}
                  {m.sources.map((s, j) => (
                    <span key={j}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                      {j < m.sources!.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </span>
              )}
            </div>
          ))}
        </div>
        <form className="ask-input" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pigments, the war, the Bull, the law…"
            aria-label="Ask the reconstruction"
          />
          <button className="cta-btn" type="submit" disabled={busy}>Ask</button>
        </form>
        <div className="suggest" style={{ marginTop: 10 }}>
          {suggestions.map((s) => <button key={s} onClick={() => ask(s)}>{s}</button>)}
        </div>
      </div>
      <aside className="plaque" aria-label="Persona ground rules">
        <h3>How Pablo speaks <span className="tiny">PICASSO, NOT THE MAN</span></h3>
        <ul>
          <li><span className="yr">1</span><span><b>Grounded only in documents.</b> de Zayas (1923), Zervos (1935), Brassaï, Gilot, the letters, museum technical files.</span></li>
          <li><span className="yr">2</span><span><b>Refuses to improvise unverified lines</b> — "I don't know" is a valid answer here.</span></li>
          <li><span className="yr">3</span><span><b>Banned aphorisms</b> are taught as misattributions, never voiced: All children are artists · Art washes away… · Great artists steal · Computers are useless · Women are machines for suffering.</span></li>
          <li><span className="yr">4</span><span><b>The misogyny file is open</b> — Marie-Thérèse met at 17; institutionalisation pressure on Dora Maar; Marina Picasso’s account. The AI neither performs nor excuses it.</span></li>
          <li><span className="yr">5</span><span><b>Rights are stated.</b> EU works are © Sucesión Picasso until 2044; moral rights perpetual; persona voice is silent until licensed by the estate.</span></li>
        </ul>
        <div className="mini-stats">
          <div className="stat"><b>70'</b><span>approx. cited sources</span></div>
          <div className="stat"><b>0</b><span>invented quotes</span></div>
          <div className="stat"><b>2044</b><span>EU term ends</span></div>
        </div>
      </aside>
    </div>
  );
}

/* ---------- Quiz ---------- */
function Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null));
  const score = answers.filter((a, i) => a === QUIZ[i].correct).length;
  const done = answers.every(a => a !== null);
  return (
    <div>
      {QUIZ.map((q, qi) => (
        <div className="quiz-q" key={qi}>
          <p><b>{qi + 1}. {q.q}</b></p>
          {q.options.map((o, oi) => {
            const show = answers[qi] !== null;
            const isCorrect = oi === q.correct;
            const isChosen = oi === answers[qi];
            const cls = show ? (isCorrect ? "correct" : isChosen ? "wrong" : "") : "";
            return (
              <button key={oi} className={`quiz-opt ${cls}`} disabled={show}
                onClick={() => setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; })}>
                {o}
              </button>
            );
          })}
          {answers[qi] !== null && <p className="quiz-why">Why: {q.why}</p>}
        </div>
      ))}
      <div className="card" style={{ textAlign: "center" }}>
        {done ? (
          <>
            <h3 style={{ color: "var(--wine)", marginTop: 0 }}>Score: {score} / {QUIZ.length}</h3>
            <p>{score >= 10 ? "Master apprentice of Guernica." : score >= 7 ? "Strong workshop discipline." : "The paint is thick — review the Archive tab, then retry."}</p>
            <button className="cta-btn" onClick={() => setAnswers(Array(QUIZ.length).fill(null))}>Try again</button>
          </>
        ) : (
          <p style={{ margin: 0 }}>Answer all {QUIZ.length} to receive your workshop readiness — right now: {score} correct.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Archive ledger ---------- */
const AREA_LABEL: Record<string, string> = { life: "Life", works: "Works", science: "Science & pigments", law: "Law & rights", news: "News 2023–26", quotes: "Quotes", hand: "Process & hands" };

function ArchiveLedger() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string>("all");
  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim();
    return LEDGER.filter(r =>
      (area === "all" || r.area === area) &&
      (!qq || r.claim.toLowerCase().includes(qq) || r.source.toLowerCase().includes(qq))
    );
  }, [q, area]);
  return (
    <div>
      <input className="ledger-search" placeholder="Search verified claims, sources, works…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search archive" />
      <div className="filters-row" style={{ marginBottom: 10 }}>
        {["all", "life", "works", "science", "law", "news", "quotes", "hand"].map(a => (
          <button key={a} className="chip" style={area === a ? { background: "var(--wine)", color: "var(--cream)" } : {}} onClick={() => setArea(a)}>
            {a === "all" ? "All" : AREA_LABEL[a]}
          </button>
        ))}
      </div>
      <div className="ledger-row head"><div>Domain</div><div>Source</div><div>Claim</div><div>Link</div></div>
      {filtered.map((r, i) => (
        <div className="ledger-row" key={i}>
          <div><span className={`badge ${r.area}`}>{AREA_LABEL[r.area] ?? r.area}</span></div>
          <div>{r.source}</div>
          <div>{r.claim}</div>
          <div><a href={r.url} target="_blank" rel="noopener noreferrer" className="quiz-why">{r.url.replace(/^https?:\/\//, "").slice(0, 54)}</a></div>
        </div>
      ))}
      <p className="muted small" style={{ marginTop: 8 }}>{filtered.length} verified entries · every claim audited against the V1–V5 correction ledger (reports embedded in the dossier PDF, Part III).</p>
    </div>
  );
}

/* ---------- Timeline ---------- */
function Timeline() {
  return (
    <div className="timeline">
      {TIMELINE.map((t, i) => (
        <div className="t-item" key={i}>
          <div className="yr">{t.year}</div>
          <div><b>{t.title}</b></div>
          <div className="quiz-why" style={{ marginTop: 2 }}>{t.note}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Period explorer ---------- */
function Periods() {
  const [open, setOpen] = useState<string | null>("blue");
  return (
    <div className="grid-3">
      {PERIODS.map(p => (
        <article className="card" key={p.id} style={{ cursor: "pointer" }} onClick={() => setOpen(open === p.id ? null : p.id)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ margin: 0, fontSize: 19, color: "var(--wine)" }}>{p.name}</h3>
            <span className="chip">{p.years}</span>
          </div>
          <div className="palette-row" aria-label="Regime palette">
            {p.palette.map(c => (
              <div key={c.hex} className="swatch" style={{ background: c.hex }} title={`${c.label} (${c.hex})`}>
                <span>{c.hex}</span>
              </div>
            ))}
          </div>
          <p className="quiz-why" style={{ marginTop: 4 }}><b>Trigger:</b> {p.trigger}</p>
          {open === p.id && (
            <>
              <ul style={{ margin: "6px 0 6px 16px", padding: 0 }}>
                {p.technique.map(t => <li key={t} style={{ fontSize: 13.5 }}>{t}</li>)}
              </ul>
              <p style={{ fontSize: 13.5, marginBottom: 0 }}><b>Anchor works:</b> {p.anchors.join(" · ")}</p>
              {p.avoid && <p className="quiz-why" style={{ color: "#a33d2e" }}><b>Correction guard:</b> {p.avoid}</p>}
            </>
          )}
        </article>
      ))}
    </div>
  );
}

/* ---------- Techniques ---------- */
const statusClass = (s: string) => (s === "verified" ? "chip verified" : s === "platinum-flag" ? "chip warn" : "chip");
const statusLabel = (s: string) => (s === "verified" ? "VERIFIED" : s === "platinum-flag" ? "UNVERIFIED — DO NOT PRINT" : "ILLUSTRATIVE");

function Techniques() {
  return (
    <div className="grid-2">
      {TECHNIQUES.map(t => (
        <div className="card" key={t.name}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <strong style={{ color: "var(--wine)" }}>{t.name}</strong>
            <span className={statusClass(t.status)}>{statusLabel(t.status)}</span>
          </div>
          <p style={{ margin: "8px 0" }}>{t.what}</p>
          <p className="quiz-why" style={{ marginBottom: 0 }}>{t.era} · {t.source} — <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer">source</a></p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Banned quotes ---------- */
function BannedQuotes() {
  const rejected = QUOTES.filter(q => q.status === "rejected");
  const documented = QUOTES.filter(q => q.status === "documented");
  const attested = QUOTES.filter(q => q.status === "attested");
  return (
    <div className="grid-2">
      <div className="card" style={{ borderTop: "4px solid var(--sage)" }}>
        <h3 style={{ color: "var(--sage)", marginTop: 0 }}>Documented — usable</h3>
        {documented.map(q => (
          <p key={q.text} style={{ borderTop: "1px dashed var(--line)", paddingTop: 8, margin: 0, marginBottom: 10 }}>
            “{q.text}”<br /><span className="quiz-why">{q.source}</span>
          </p>
        ))}
      </div>
      <div className="card" style={{ borderTop: "4px solid #a33d2e" }}>
        <h3 style={{ color: "#a33d2e", marginTop: 0 }}>Banned — never voiced</h3>
        {rejected.map(q => (
          <p key={q.text} style={{ borderTop: "1px dashed var(--line)", paddingTop: 8, margin: 0, marginBottom: 10 }}>
            “{q.text}”<br /><span className="quiz-why" style={{ color: "#a33d2e" }}>{q.source}</span>
          </p>
        ))}
        <p className="quiz-why">Attested (use with caveat): {attested.map(q => `“${q.text}”`).join(" · ")}</p>
      </div>
    </div>
  );
}

/* ---------- Main app ---------- */
export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="ribbon"><b>ARTISAN AI — A simulation, not the man.</b> Works © Sucesión Pablo Picasso / VEGAP until 2044 · Links to licence-sceptic archive only</div>
      <nav className="nav" aria-label="Primary">
        <a className="brand" href="#top" aria-label="ARTISAN AI home">
          <div className="seal">P</div>
          <div><div className="wordmark-small">ARTISAN AI</div><div className="wordmark-big">Picasso</div></div>
        </a>
        <a className="nav-link" href="#timeline">Chronology</a>
        <a className="nav-link" href="#periods">Periods</a>
        <a className="nav-link" href="#lab">Atelier</a>
        <a className="nav-link" href="#ask">Ask Pablo</a>
        <a className="nav-link" href="#archive">Archive</a>
        <a className="nav-link" href="#quiz">Quiz</a>
        <button className="cta-btn" onClick={() => document.getElementById("ask")?.scrollIntoView({ behavior: "smooth" })}>Ask Pablo</button>
      </nav>

      <main id="main">
        {/* HERO */}
        <header className="hero" id="top">
          <div>
            <div className="eyebrow">ARTISAN AI · THE HAND BEFORE THE PAINTING</div>
            <h1>Learn painting from<br />the hand <span className="dash">itself.</span></h1>
            <p className="lead">An evidence-grounded reconstruction of Pablo Picasso — 92 years of work, 40+ research threads, every claim tied to a primary source. Watch how he painted. Ask how he thought. Never invent a word he did not say.</p>
            <div className="quote">
              “To ‘find’ is the thing.”
              <small>— Marius de Zayas, <i>The Arts</i> 3:315–329 (Nov 1923). The one interview that survives the archive verbatim.</small>
            </div>
            <div className="btn-row">
              <a className="btn" href="#lab">Enter the Atelier ↓</a>
              <a className="btn ghost" href="#archive">Read the evidence →</a>
            </div>
            <div className="mini-stats" aria-label="Research at a glance">
              <div className="stat"><b>40+</b><span>research threads</span></div>
              <div className="stat"><b>1,200+</b><span>verified URLs</span></div>
              <div className="stat"><b>2044</b><span>the legal horizon</span></div>
            </div>
          </div>
          <aside className="plaque" aria-label="On the wall today">
            <h3>On the wall today <span className="tiny">IMAGE BLOCKED — LINK-ONLY</span></h3>
            <ul>
              <li><span className="yr">1901</span><span><b>The Blue Room</b> — bearded-man portrait beneath (Heritage Science 2017). Phillips Collection. — © estate, link only</span></li>
              <li><span className="yr">1903</span><span><b>La Vie</b> — over <i>Last Moments</i>, rotated 90°. Cleveland Museum of Art.</span></li>
              <li><span className="yr">1907</span><span><b>Demoiselles d’Avignon</b> — acc. 333.1939, Bliss Bequest (by exchange). MoMA.</span></li>
              <li><span className="yr">1937</span><span><b>Guernica</b> — 349.3×776.6 cm. Reina Sofía, Sala 205.10. Unloanable.</span></li>
              <li><span className="yr">1945</span><span><b>Le Taureau</b> — 11 states, one plate. MoMA / institutions.</span></li>
              <li><span className="yr">1957</span><span><b>Las Meninas</b> — 58 canvases. Museu Picasso Barcelona.</span></li>
            </ul>
          </aside>
        </header>

        {/* TIMELINE */}
        <section className="block" id="timeline" aria-labelledby="t-title">
          <div className="kicker">CHRONOLOGY — VERIFIED &amp; CORRECTED</div>
          <h2 className="section-title" id="t-title">The timeline the record can defend</h2>
          <p className="section-sub">Every date checked against the V1 verification pass. Hover an entry for its correction.</p>
          <Timeline />
        </section>

        {/* PERIODS */}
        <section className="block" id="periods" aria-labelledby="p-title">
          <div className="kicker">EPISODES OF REGIME, NOT STEPS OF STYLE</div>
          <h2 className="section-title" id="p-title">Choose a regime</h2>
          <p className="section-sub">Click a regime — palette chips are indicative (Hex ≈), never measured spectra. Regimes overlap: 1917 ran Neoclassical, Synthetic and pointillist simultaneously.</p>
          <Periods />
        </section>

        {/* ATELIER */}
        <section className="block" id="lab" aria-labelledby="lab-title">
          <div className="kicker">THE ATELIER — RECONSTRUCTED PROCESS</div>
          <h2 className="section-title" id="lab-title">The Bull States — watch reduction in motion</h2>
          <p className="section-sub">Scrub the 11 states. This is the single most-studied reduction in 20th-century graphic work. Illustrative SVG reconstruction — never the plate.</p>
          <BullLab />
          <h3 style={{ marginTop: 34, color: "var(--wine)" }}>Technique cards — print-safe claims only</h3>
          <Techniques />
        </section>

        {/* ASK PABLO */}
        <section className="block" id="ask" aria-labelledby="ask-title">
          <div className="kicker">THE RECONSTRUCTION — CITATION-LINKED</div>
          <h2 className="section-title" id="ask-title">Ask Pablo (never the man)</h2>
          <p className="section-sub">Offline retrieval over documented sources — 16 answer paths vetted against V1–V5. No answer ships without a citation. The misogyny file stays open.</p>
          <AskPablo />
        </section>

        {/* IMAGE PLATES */}
        <section className="block" id="plates" aria-labelledby="plates-title">
          <div className="kicker">PLATES — LEGALLY CLEAR</div>
          <h2 className="section-title" id="plates-title">What this room is allowed to show</h2>
          <div className="grid-3">
            <figure className="card" style={{ margin: 0 }}>
              <img src="/assets/mona-lisa.jpg" alt="Mona Lisa — public domain, C2RMF retouched master" style={{ width: "100%", borderRadius: 6 }} />
              <figcaption className="quiz-why" style={{ padding: "8px 4px" }}><b>Leonardo da Vinci, Mona Lisa</b> (1503–06) — Public domain (Leonardo d. 1519). C2RMF retouched master (Commons, 2026-11-19). 1–2 µm glazes — the sweetest proof that nothing in paint is ever simple.</figcaption>
            </figure>
            <figure className="card" style={{ margin: 0 }}>
              <img src="/assets/chart-attendance.png" alt="2024 attendance chart — Louvre 8.7M, Van Gogh Museum 1.84M" style={{ width: "100%" }} />
              <figcaption className="quiz-why" style={{ padding: "8px 4px" }}><b>The audience, 2024</b> — Louvre 8.7M · Van Gogh Museum ~1.84M · Museu Picasso Barcelona ~1.13M.</figcaption>
            </figure>
            <figure className="card" style={{ margin: 0 }}>
              <img src="/assets/chart-auctions.png" alt="Top Picasso auction lots — record $179.365M in 2015" style={{ width: "100%" }} />
              <figcaption className="quiz-why" style={{ padding: "8px 4px" }}><b>The market, verified</b> — $179.365M (2015) · $139.4M (2023) · volume-led rebound 2025. Picasso: #1 by lots.</figcaption>
            </figure>
          </div>
        </section>

        {/* BANNED QUOTES */}
        <section className="block" id="quotes" aria-labelledby="quotes-title">
          <div className="kicker">THE QUOTE LEDGER</div>
          <h2 className="section-title" id="quotes-title">What he said. What he never said.</h2>
          <p className="section-sub">Every line below is traceable. The banned column is not decoration — it is the firewall that keeps the persona honest.</p>
          <BannedQuotes />
        </section>

        {/* ARCHIVE */}
        <section className="block" id="archive" aria-labelledby="archive-title">
          <div className="kicker">THE EVIDENCE ARCHIVE</div>
          <h2 className="section-title" id="archive-title">Search the audited record</h2>
          <ArchiveLedger />
        </section>

        {/* QUIZ */}
        <section className="block" id="quiz" aria-labelledby="quiz-title">
          <div className="kicker">WORKSHOP READINESS</div>
          <h2 className="section-title" id="quiz-title">Twelve questions the paint demands</h2>
          <p className="section-sub">Every answer carries its correction. Score 10+ and you may step into the apprentice lane.</p>
          <Quiz />
        </section>
      </main>

      <ProgressBar />
      <footer className="footer">
        <div className="foot-grid">
          <div>
            <div className="seal-lg">P</div>
            <p><b style={{ color: "#ffd9a0" }}>ARTISAN AI — Picasso</b><br />A historical artist preservation &amp; teaching platform. Every fact traceable; every image licensed-or-linked; every voice tagged as simulation.</p>
            <p style={{ marginTop: 10 }}>Built by Karthikeya Sharma · <a href={PUBLISHERS.picassoFr}>Picasso Administration</a> · <a href={PUBLISHERS.reina}>Museo Reina Sofía</a> · <a href={PUBLISHERS.moma}>MoMA</a></p>
          </div>
          <div>
            <p><b style={{ color: "#ffd9a0", letterSpacing: "0.15em", fontSize: 11, textTransform: "uppercase" }}>Rights</b></p>
            <p>© Sucesión Pablo Picasso / VEGAP until 1 Jan 2044. Moral rights perpetual (FR/ES). No reproduction without licence. “Simulation, not the man” — all persona output requires estate BAT before commercial use.</p>
            <p><b style={{ color: "#ffd9a0", letterSpacing: "0.15em", fontSize: 11, textTransform: "uppercase" }}>Method</b></p>
            <p>40+ parallel research agents · 5 adversarial verifiers · corrections applied where flagged. Dossier PDF: <i>ARTISAN_AI_Picasso_Master_Research_Dossier.pdf</i> (Part I print-ready).</p>
          </div>
          <div>
            <p><b style={{ color: "#ffd9a0", letterSpacing: "0.15em", fontSize: 11, textTransform: "uppercase" }}>Path</b></p>
            <p><a href="#lab">Atelier</a> · <a href="#ask">Ask Pablo</a> · <a href="#archive">Evidence</a> · <a href="#quiz">Workshop readiness</a></p>
            <p><b style={{ color: "#ffd9a0", letterSpacing: "0.15em", fontSize: 11, textTransform: "uppercase" }}>Next</b></p>
            <p>Phase 3 — licensed persona voice · dual-view brush capture rig · IIIF archive manifests · school pilots with museum partners.</p>
          </div>
        </div>
        <p style={{ borderTop: "1px solid #54443c", paddingTop: 14, marginTop: 18 }}>ARTISAN AI · Picasso — The Hand Before the Painting · L:\pr 32(picaso)\Picasso App · 2026</p>
      </footer>
    </>
  );
}
