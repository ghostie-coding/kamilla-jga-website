# CLAUDE.md

Guidance for working in this repository.

## What this is

A single-page, static website (German) for **Kamilla's JGA** (Junggesellinnenabschied / bachelorette party), July 2026 in **Antalya, Turkey**. No framework, no build step — just three hand-edited files served as-is.

## Structure

```
index.html          The entire site (one page, in-page sections via anchor links)
css/styles.css      Only what can't be a Tailwind utility (@font-face, scrollbar, reduced-motion)
js/main.js          All interactivity (flat script, no modules)
assets/fonts/       Telma (.otf, 5 weights) + Tanker (.woff2)
assets/img/         Squad photos, hero graphic, logo, decorative textures
netlify.toml        Static deploy config
```

There is **one HTML page**. "Pages" are sections of `index.html` reached by anchor links (`#squad`, `#zeitplan-locked`, `#memories`, `#spiele`).

## Tech stack & conventions

### Tailwind (CDN, no build)
- Loaded via `<script src="https://cdn.tailwindcss.com">` in `index.html`.
- Config is **inline** in a `<script>` in the `<head>` — there is no `tailwind.config.js`, no `package.json`, no PostCSS, no npm.
- **To add theme colors/fonts/animations, edit the inline `tailwind.config` object** in `index.html`.
- Styling is done almost entirely with **inline utility classes** in the HTML. Arbitrary values are used freely, e.g. `bg-[rgba(26,15,15,0.92)]`, `text-[clamp(4rem,10vw,9rem)]`, `shadow-[0_0_15px_#c0a8cc]`.
- The Play CDN JIT picks up classes **added dynamically at runtime** by `js/main.js`, so state classes toggled in JS work without any config.

### Theme tokens (from the inline config)
Colors: `brown #3d1008`, `brown-mid #6b2010`, `brown-light #b8adb0`, `cream #f7f0eb`, `cream-dark #ede3dc`, `lilac #c0a8cc`, `lilac-deep #7a5a8a`, `lilac-soft #f0e8f5`, `white #fdfbf9`, `black #1a0f0f`.

Fonts: `font-serif` = Cormorant Garamond (Google, headings/italic display), `font-sans` = Inter (body/UI), `font-telma*` (local .otf, schedule), `font-tanker` (local .woff2, times/tabs).

Animations (config `keyframes`+`animation`): `animate-fall` (petals), `animate-herobounce` (scroll cue), `animate-shake` (wrong input).

Visual style: dark brown/black backgrounds, lilac accents, cream serif headings; uppercase wide-tracked micro-labels (`tracking-[0.35em]`); rounded-pill buttons; mobile-first with `md:` breakpoints.

### CSS
`css/styles.css` is loaded **before** the Tailwind CDN script. Keep it minimal — only put things Tailwind can't express (`@font-face`, custom scrollbar, `prefers-reduced-motion`). No `:root` variables; theme lives in the Tailwind config.

### JavaScript
`js/main.js` loads at end of `<body>` with `defer`. It's a flat script — IIFEs for self-contained features, plus global functions called from inline `onclick=`/`onkeydown=` in the HTML. Organized by `// ── SECTION ──` comment blocks. No modules, no bundler, no third-party libs.

Feature blocks: **Puzzle gate**, surprise/boarding-pass overlay + petals, countdown, schedule unlock, nav scroll, day tabs, scroll fade-in (`IntersectionObserver`), password modal.

### Gating patterns (client-side only — not real auth)
State is kept in **`sessionStorage`** (survives reload, clears when the tab/browser closes):
- `puzzle-solved` = `'1'` — the ANTALYA word-search entry gate has been solved.
- `surprise-seen` = `'1'` — the boarding-pass intro overlay has been shown.
- `pw-unlocked` = `'1'` — the bridesquad password (`PW = 'TaKa'` in `main.js`) was entered.

Overlays are full-screen `fixed inset-0` divs toggled by adding/removing Tailwind visibility classes (`hidden`, `opacity-0 invisible` ↔ `opacity-100 visible`). Z-index order (front to back): **puzzle gate `z-[1000]`** → surprise overlay `z-[999]` → password modal `z-[300]`.

Entry flow on a fresh session: **solve the puzzle → boarding-pass surprise intro → site**.

## Running locally

Static site — serve the repo root over http (so fonts/CDN load cleanly):

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

For UI/gating verification, use the Playwright MCP browser tools against that URL.

## Deployment

Netlify, configured by `netlify.toml`:
```toml
[build]
  publish = "."
  command = ""
```
Publishes the repo root as-is; no build command. Pushing to the default branch triggers the deploy.

## Editing checklist
- New color/font/animation → add to the inline `tailwind.config` in `index.html`.
- New styling → prefer inline Tailwind utilities; only touch `css/styles.css` for things Tailwind can't do.
- New behavior → add a `// ── SECTION ──` block in `js/main.js`; if it's persistent per-session state, use `sessionStorage`.
- Keep asset paths **relative** (no leading `/`).
- Don't add a build step, framework, or npm tooling unless explicitly asked.
