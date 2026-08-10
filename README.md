# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read `project/Home.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `index.html` — site entry point; redirects to `project/Home.dc.html` so GitHub Pages serves the design
- `project/` — the `Website Design Feedback` project files (HTML prototypes, assets, components)

## Viewing the prototypes

Live: https://jackdau.github.io/yourgp-group-website/

Locally, serve over HTTP rather than opening the files directly — `support.js`
fetches React from a CDN and needs a real origin:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

## Repo notes

The previous production site (`index.html`, six page directories, `css/`, `js/`,
`CNAME`, and the SEO files) was replaced by this bundle. It is tagged `site-v1`
and remains recoverable:

```bash
git checkout site-v1 -- .        # restore all of it
git show site-v1:CNAME           # → ygp.au
```

`CNAME` must be restored to the repo root before ygp.au is pointed at GitHub
Pages, or the custom domain will not bind. While it is absent, the github.io
URL above serves the site directly.
