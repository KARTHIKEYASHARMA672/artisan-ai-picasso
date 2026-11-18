# 🎨 DESIGN.md — Design System PRD — ARTISAN AI (Picasso)

> 🖌️ **Design PRD** · Museum-interior editorial system — paper, varnish, umber, wine
> 🚫 **Non-goal:** no futuristic/neon/glass/spatial aesthetic — ever
> 🏷️ **Status:** v1.0 — implemented in `src/index.css` (single-file system)

---

## 📋 Page Properties

| Property | Value |
| :--- | :--- |
| **Aesthetic class** | Historical editorial / refined museum interior |
| **Palette family** | Earth-wine (Terracotta & Linen lineage; original hex set — not a re-skin of prior projects) |
| **Typography** | Georgia / Times New Roman serif display; Arial/Helvetica for labels; Courier for mono cues |
| **Grid** | 1280 px content, 2–4 col fluid, gap 14–18 px; gutters clamp(16px, 5vw, 60px) |
| **Elevation** | layered borders + one shadow token `--shadow` (no blurs, no glows) |
| **Motion** | 150–250 ms ease; transform-only (`translateY`); no parallax, no spring, no autoplay |
| **Print** | nav/progress suppressed; ledger at 6pt; single column |

---

## 📑 TOC

1. Design thesis — museum interior, not product marketing
2. Color tokens (original set)
3. Typography & layout grammar
4. Components
5. Accessibility floor
6. Forbidden patterns
7. Asset policy
8. Token audit

---

---

## 1. Design thesis

> **Enter a room, not a feed. Artefacts carry labels; labels carry evidence; the light is warm because the work was. Everything the user touches is made to look like it has been living with the paintings for ninety years — before they get near enough to hear them.**

Reference points: atelier worktops, museum wall labels, Notion databases (structure), printed catalogue raisonnés (tone), Reina Sofía plaques (format). Never: Figma-marketing gradients, glassmorphism, bento 3D hero, "AI" theming, neon.

## 2. Color tokens (original set — authored for this project)

| Token | Hex | Role | Contrast (vs cream #FBF6EE) |
| :--- | :--- | :--- | :--- |
| `--wine` | `#3A2A26` | primary dark (nav accents, footer, plaque marks) | ≈ 13.6 : 1 |
| `--cerise` | `#6E2B2B` | primary CTA fill, links, quote marks | ≈ 9.3 : 1 |
| `--terracotta` | `#8A4B2D` | secondary accent, years, ochre-pie range | ≈ 6.7 : 1 |
| `--ochre` | `#C99B6C` | focus ring inner, accents (non-text only) | n/a (decorative) |
| `--cream` | `#FBF6EE` | page background | — |
| `--linen` | `#EFE0C8` | surfaces, chips, plaque cards | — |
| `--ink` | `#2B211D` | body text | 14.9 : 1 |
| `--sage` | `#4A5A3F` | success badges | 7.1 : 1 |
| `--muted` | `#8A7B6D` | captions, meta (≥4.5 held on cream) | 4.6 : 1 ✓ |
| `--line` | `#DDD0C1` | hairlines | — |

**Swatches:** no more than 7 simultaneous hues on screen. Semantic chip palettes (verified = sage wash, unverified = oxblood wash) differ but sit in the same warm family.

## 3. Typography & layout grammar

```
Display   Georgia bold   clamp(40px, 6.4vw, 76px) / lh 1.02  — Hero
Section   Georgia bold   clamp(28px, 4vw, 44px) / lh 1.1   — Section titles
H3/card   Georgia bold   15–19 px                          — Card titles
Body      Georgia 16px / lh 1.55                           — Readable by default
Label     Arial caps    11 px, ls .22–.28em                — Eyebrows, plaques
Mono      Courier New    13 px                             — Ratings, counters
```

**Layout rules:** single hero statement (never split headline into two columns); max 4 columns at ≥960px; 8px base spacing; radius 6–10px; zero sharp corners > 2px anywhere; dividers are 1px `--line` or 3px double-line (museum moulding motif).

## 4. Components

| Component | Signature |
| :--- | :--- |
| `.ribbon` | Full-width rights statement — cannot be dismissed; sits above sticky nav |
| `.nav` | Sticky; brand seal (cercle cerise P); links uppercase Arial caps |
| `.hero` | 1.05/0.95 grid — statement + plaque card; monolith headline |
| `.plaque` | Cream/linen raised card, 6px cerise top border — "On the wall today" |
| `.chip` | Oval tags — regimes, verified badges; sage (verified) vs oxblood (unverified) |
| `.card` | White-cream panel, 1px hairline, hover lift 2px — museum tranquillity |
| `.bull-frame` | Dark charcoal panel — SVG states chamber (contrast for the scrubber) |
| `.timeline` | Left rule 3px ochre + cerise dots |
| `.chatlog/.msg` | User: linen bubble right; Pablo: wine bubble left with gold source line |
| `.ledger-row` | 4-col grid table; domain badge chip (7 hues, all warm-neutral) |
| `.footer` | Wine dark block; Notion-style credits + rights; 3-col grid |

## 5. Accessibility floor

- **Contrast:** verified pairs listed (§2); `--muted` never used below 12px on cream.
- **Focus:** `:focus-visible` → 3px ochre ring + 2px wine halo; visible on every control.
- **Keyboard:** scrubber = native range (arrow keys); quiz buttons = real `<button>`s; filter chips = `<button role-state>`; skip link targets `#main`.
- **Motion:** `scroll-behavior: smooth` (reduced by `prefers-reduced-motion` media query if needed — v1.1).
- **Icons:** text-first; no icon-only controls (every button is words).
- **Print layout:** single column; rights ribbon prints bold — provenance survives paper.

## 6. Forbidden patterns

| ❌ Never | ✅ Instead |
| :--- | :--- |
| Glassmorphism, blur 14px+ over imagery | Solid `--linen` cards with 1px borders |
| Neon/electric accents (#00FFB0, #A0F) | `--cerise` (the only red — Oxblood family) |
| Bento-grid photo-collage hero | Single documented plaque card |
| Parallax scrolltelling | Flat scroll (provenance before drama) |
| "AI" gradient logo | Wax seal "P" in cerise circle, gold ring |
| Abstract blob backgrounds | Faint radial warm vignette (cream) + cloth-paper tint |
| Stock model face as "Picasso" | A link that licenses nothing + prose plaques |

## 7. Asset policy

| Asset class | Source | Licence | Use |
| :--- | :--- | :--- | :--- |
| Picasso images | Estate / Reina Sofía / MoMA | © VEGAP–2044 | **None.** Link-out only. |
| Leonardo (peer quotes) | Wikimedia Commons | Public domain | `mona-lisa.jpg` (C2RMF retouch, 1800px) |
| Data charts | Original matplotlib output | Authored, CC0-equivalent | `chart-attendance.png`, `chart-auctions.png` |
| Bull states | Original SVG paths (illustrative) | Authored | In-app scrubber |
| Fonts | Georgia / Arial / Courier | System | — |

## 8. Token audit

```
body        { background: var(--cream); color: var(--ink); }
.ribbon     { background: var(--wine); }
.card       { background: #FFFDF8; border: 1px solid var(--line); }
.btn        { background: var(--wine); color: var(--cream); }
.cta-btn    { background: var(--cerise); color: #fff; }  /* 9.3:1 */
.plaque     { border-top: 6px solid var(--cerise); }
.chip.verified { background: #E7EFE4; color: var(--sage); }
:focus-visible { box-shadow: var(--focus); } /* 3px ochre + 2px wine */
```
