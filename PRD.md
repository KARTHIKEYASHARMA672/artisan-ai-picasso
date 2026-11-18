# 🏺 ARTISAN AI — Picasso (The Hand Before the Painting)

> 📜 **PRD — Product Requirements Document** · Historical Artist Preservation & Teaching Platform
> 🏷️ **Status:** Live (hosted on Vercel) · **Build:** 2026-11-19 · **Class:** High-risk creative reconstruction (rights-sensitive)
> 🔗 **Canonical journal:** `L:\pr 32(picaso)\ARTISAN_AI_Research_Archive\ARTISAN_AI_Picasso_Master_Research_Dossier.pdf` (Part I = print-ready master synthesis)

---

## 📋 Page Properties

| Property | Value |
| :--- | :--- |
| **Product** | ARTISAN AI — Picasso ("The Hand Before the Painting") |
| **Release class** | v1.0 · research-verdict-grounded interactive reconstruction |
| **Primary user** | Students & self-taught painters (ages 12+), museum/teaching partners |
| **Primitive users (buyer)** | Atelier academies, museum education departments, cultural bodies |
| **Legal horizon** | works © Sucesión Pablo Picasso / VEGAP until **1 Jan 2044**; moral rights perpetual |
| **Gate** | Estate licence (BAT) required for any voiced persona in public use |
| **Success signal** | measured technique fidelity + retention + self-efficacy (Part I, Ch. 17) — never "transfer" claims |

---

## 📑 TOC

1. Product thesis & deal
2. Evidence base
3. Scope — v1 (shipped)
4. Out of scope — v1
5. User stories
6. Acceptance criteria
7. Non-functional requirements
8. Rights & ethics
9. Success metrics
10. Risks & mitigations

---

---

## 1. Product thesis

> **Picasso is the deepest documented body of one artist's process ever produced — Dora Maar's Guernica metamorphosis photographs, the 11 states of the Bull, the 58 Las Meninas canvases, the CEP's ~60,000 notices. The market has sold his images for a century but has never taught his hand. ARTISAN AI teaches his hand — legally, archivalistically, with every claim cited.**

**The deal we are offering users:** you see how he actually worked (verified, slow, reconstructed), you scrub through documented states, you ask the archive (not an oracle), you take the 12-question workshop readiness test, and you leave with the correct statement about copyright in 2044.

---

## 2. Evidence base

- **Research pipeline**: 35 parallel batch-2 research agents (A15–A30) after 30 batch-1 agents (A1–A14, B1–B3, C1–C5, D1–D2) — ≈120,000 words of cited markdown.
- **Verification**: 5 adversarial agents (V1–V5) reading all raw reports, cross-checking live sources, producing **≈90 blocked/corrected claims** (Part III of the dossier PDF).
- **Print correction rule**: Part I of the PDF is the canonical copy; Part II is verbatim raw (uncorrected); Part III is the correction ledger.
- **Code reuse of research**: every fact rendered in the app carries an inline source link; banned-quote firewall (see §8).

---

## 3. Scope — v1 (shipped)

| Module | Behaviour | Source anchor |
| :--- | :--- | :--- |
| **Hero / Plaquette** | Museum-plaque metaphor; rights banner; research stats | Part I, Ch. 3–4 |
| **Chronology** | Corrected timeline 1881–2026 (Sala 205.10; IB-952; 1979 dation) | Part I, Ch. 4 |
| **Regimes explorer** | 11 regimes with indicative palette chips, trigger, anchors, correction guards | Part I, Ch. 5 |
| **Atelier → Bull States** | 11-state illustrative SVG scrubber (mourlot-cadence), technique cards with VERIFIED/UNVERIFIED flags | Part I, Ch. 6, 13 |
| **Ask Pablo** | Offline RAG-lite over 16 documented-Q/A paths with citations | Part I, Ch. 8 |
| **Quote ledger** | Documented / attested / banned columns | Part I, Ch. 8 |
| **Evidence archive** | Filterable & searchable verified-claims ledger (life/works/science/law/news/quotes/process) | Part I, Ch. 18 |
| **Workshop readiness** | 12-question quiz with per-question corrections | Part I, Ch. 17 |
| **Plates** | Legally clear images only (public-domain Leonardo; original charts) | Part IV |

## 4. Out of scope — v1

- ❌ No voice clone (INA pension recording — no licence). Voice remains text.
- ❌ No Picasso images (© estate until 2044) — every plaque is caption + outbound link.
- ❌ No backend / accounts / paid tiers (offline-first static app).
- ❌ No claims about "understanding Spanish politics" — scoped to the creative record.
- ❌ No transfer of wellbeing/cognitive-transfer claims (Lacoe, Painter & Williams 2020 caution).

---

## 5. User stories

1. **Learner**: "As a student, I want to scrub the Bull's 11 states so I see reduction as a process, not magic."
2. **Educator**: "As a museum/educator, I want inline citations on every claim so I can teach from this without a compliance review."
3. **Curious visitor**: "As a curious adult, I want a named-quote ledger that shows me what he never said — so the AI doesn't feed me myths."
4. **Researcher**: "As a researcher, I want the correction ledger accessible — to see how 90 errors were caught before print."

---

## 6. Acceptance criteria — shipped ✅

- [x] Build passes (`tsc -b && vite build`) — type-safe, 0 warnings, 18 modules
- [x] Playwright Chromium headless suite: 0 console errors, 0 page errors, 0 failed requests
- [x] Hero/H1/metadata delivered; progressive bar; sticky nav; skip link
- [x] Ask Pablo answers with ≥1 citation; banned items never voiced
- [x] Archive search/filter live; links open in new tab with rel="noopener"
- [x] Quiz locks per-question; 0 un-sourced facts rendered
- [x] No future/neon/glass aesthetic (see DESIGN.md)
- [x] Copyright notices visible above the fold (ribbon) + footer

---

## 7. Non-functional requirements

- **Offline-first**: after first load, full function without network (assets inlined or bundled).
- **Performance**: main JS ≤ 90 kB gzip; images local; CSS ≤ 11 kB gzip.
- **A11y**: ≥ 4.5:1 text contrast; focus-visible rings; semantic headings; aria-labels on all interactives; keyboard-operable scrubber (range input).
- **Responsiveness**: breakpoints at 960 px; grid collapse order preserved.
- **Print**: nav/progress hidden; archive prints ≤ 6pt body.

---

## 8. Rights & ethics — the firewall

- **No reproduction** of any Picasso work, image, photograph or film still anywhere (© VEGAP/ estate — 2044).
- **No voice** — INA phonothèque requires negotiated licence; voice is not rendered.
- **Simulation tags** — every persona output carries "simulation, not the man".
- **Banned quotes** — the eight untenable aphorisms never appear in persona output; they appear only as educational misattributions (Ch. 8 of the dossier).
- **Misogyny openness** — the persona does not perform excuses; documented critique is part of the curriculum.
- **Primitivism honesty** — Fang/Kota/Iberian sources named; Trocadéro (spring 1907); no mask images without licence; the Sarr–Savoy arc is presented alongside.
- **Guernica immovability** — 25 Mar 2026 Informe + 7 Apr 2026 Ministry refusal; no loan politics, ever.
- **No unverified claims in UI** — anything marked UNVERIFIED in the research prints behind an "UNVERIFIED — DO NOT PRINT" flag or is absent entirely.

---

## 9. Success metrics

| Metric | Target (v1 → v2) | Method |
| :--- | :--- | :--- |
| Workshop readiness (≥10/12) | ≥ 60% of starters | Quiz + localStorage |
| Technique fidelity score (print exercise) | v2: human-rubric 3/5 | session telemetry |
| Retention (30-day delayed draw) | v2: > baseline control | delayed-task study |
| Self-efficacy (pre/post) | v2: +0.3–0.5 SD | validated scale |
| Licence conversion (estate ask) | v2: written BAT term-sheet | partnership track |
| Misinfo rate (invented fact/quote) | **0** | audit log = bug tracker |

---

## 10. Risks & mitigations

| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| Estate cease-and-desist (name/image) | High | v1: strictly nominative use; disclaimer above the fold; no reproduction; keep hosted URL unlisted until BAT; never train on estate audio/imagery |
| Fact drift during maintenance | Medium | CI grep — every numeric claim cross-checked against `data.ts` seed; errors → build failure (v2) |
| Voice misuse after licence (v2) | Medium | v2: publish the estate-approved prompt chain + voice transcripts audit |
| Misattribution reintroduction | Low | Quote ledger is build-time — rejected quotes fail `tsc` |
| Market misread ($179M ≠ endorsement) | Low | Charts labelled all figures with sources; caption: "verified via press release, not appraisal" |
