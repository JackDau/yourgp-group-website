# ygp.au — YourGP group site

Live at **https://ygp.au**, served by GitHub Pages from `main` / root. Push to `main`
and the change is live in about a minute.

## Read this before editing content

Two things will bite you if you skip them:

1. **Home, About and Clinics are generated.** Do not edit `index.html`,
   `about/index.html` or `clinics/index.html` — they are overwritten. Edit the design
   source in `project/` and run `node build.mjs`. See [Build](#build).
2. **Financial detail is gated.** Remuneration specifics stay off this site. See
   [Financial gating](#financial-gating-run-this-before-pushing) and run the grep.

## Structure

```
project/Home.dc.html      design source  ->  index.html
project/About.dc.html     design source  ->  about/index.html
project/Clinics.dc.html   design source  ->  clinics/index.html
build.mjs                 regenerates the three pages above

contact/index.html        hand-written, uses css/style.css
404.html                  hand-written, uses css/style.css
css/style.css             stylesheet for Contact + 404 only
js/main.js                mobile menu + accordions, for the above

llms.txt, llms-full.txt   content summaries for language models
sitemap.xml, robots.txt   keep in step when pages are added or withdrawn
_archive/                 withdrawn pages, not published — see _archive/README.md
```

The site is a hybrid. The three generated pages carry **inline styles** and no
stylesheet; Contact and 404 are the older hand-written pages still on
`css/style.css`. Brand values are duplicated between the two — keep them in step.

## Build

```bash
node build.mjs        # expect: "All placeholder links resolved."
```

`build.mjs` does four things the prototypes cannot do for themselves: rewrites asset
paths for page depth, resolves `href="#"` placeholders by anchor text via
`LINK_TARGETS`, rewrites inter-page links (`About.dc.html` → `about/`), and injects the
document head (title, description, canonical, OG tags).

If it reports unresolved links, an anchor has `href="#"` with text that no
`LINK_TARGETS` entry matches. Add the entry or give the anchor a real href.

Anchors survive the rewrite: `./About.dc.html#for-gps` becomes `about/#for-gps`.

## Financial gating — run this before pushing

Remuneration specifics stay **off** this site. They are sent in the information pack
after someone completes the Microsoft Form. Never publish here:

- the service fee split as a figure (GP share / base fee / payroll tax reserve)
- expected take-home or annual billings, in dollars or pounds
- the first-three-months minimum hourly rate
- the UK ramp-up guaranteed wage rate

### The hard gate — must return nothing

```bash
grep -rniE '61\.9|38\.1|460,?000|750,?000|430,?000|700,?000|\$180|\$150' \
  --include=*.html --include=*.txt --exclude-dir=_archive .
```

Any hit is a publication error. Fix it before pushing.

The `--include` filters scope the search to published files. They are not optional
tidiness: without them the grep matches the pattern printed in this README and reports
a false positive every time.

### The soft check — read the hits rather than counting them

```bash
grep -rniE 'service fee split|take.home|guarantee' \
  --include=*.html --include=*.txt --exclude-dir=_archive .
```

This one is **expected to return hits** and must be read in context. Naming the
earnings question and routing it to the information pack is deliberate — the About
page callout and both `llms` files do exactly that. What you are looking for is a hit
that states a *figure* or promises a *guarantee*, rather than pointing at the pack.

Do not merge these two greps. A gate that always returns hits stops being read.

### What is fine to publish

Predominantly private billing (~90%), the DNA rate (**1.25% across the group, 0.25% at
Garema Place**, against 5–7% at a typical bulk-billing clinic), utilisation better than
98%, patients-per-hour ranges, hours and leave, "no lock-in contracts, no set hours",
and visa sponsorship at the two DPA clinics.

## Brand

| Token | Value | Use |
|-------|-------|-----|
| `--deep` | `#082622` | Dark sections, headings |
| `--sage` | `#5A867D` | Borders, rules, surfaces — **not text** |
| `--mid` | `#456B63` | Links, buttons, any text on light |
| `--mint` | `#80B7A2` | Accents, stat numbers, text on dark |

**Use `#456B63`, not `#5A867D`, for text on light backgrounds.** Sage on white is
4.08:1, below the WCAG AA threshold of 4.5:1. Mid is 5.94:1. In `css/style.css` these
are CSS custom properties; in the generated pages they are inline hex values.

Section backgrounds alternate white / cream `oklch(97.5% 0.014 95)` / dark `#082622`.
Headings are Cormorant Garamond at `font-weight:600`; body is Lato.

The logo is CSS text (`.wordmark`), not an image — the PNG logos in the other repos are
clinic-specific ("YourGP@Crace") and too low-resolution for modern screens.

## Deployment and DNS

GitHub Pages from `main` / root. `CNAME` contains `ygp.au` — **do not delete it**.

**DNS lives at GoDaddy**, not Cloudflare like the other sites, and ygp.au carries live
Microsoft 365 email. Only ever touch the A/AAAA records. Leave every MX and
mail-related TXT record (SPF, DKIM, DMARC) alone.

Do not add a `.nojekyll` file to the repo root. Jekyll is what keeps `_archive/`
unpublished; disabling it republishes the withdrawn pages.

## Checks

```bash
# serve locally — support.js fetches React from a CDN and needs a real origin
python -m http.server 8765

# after pushing. Always use --resolve: the local resolver has served stale
# GoDaddy parking IPs and produced a false negative.
for p in "" about/ clinics/ contact/; do
  curl -s -o /dev/null -w "%{http_code} /$p\n" \
    --resolve "ygp.au:443:185.199.108.153" "https://ygp.au/$p"
done

# build_type must stay "legacy" — it has silently flipped to "workflow"
# and stopped deploying before.
gh api repos/JackDau/yourgp-group-website/pages --jq '.build_type, .cname'
```

## History

The previous hand-written version of the whole site is tagged `site-v1`, from before
the Claude Design bundle replaced it:

```bash
git show site-v1:README.md      # this file, as it stood then
git checkout site-v1 -- .       # restore everything
```

The Australian GPs and UK GPs recruitment pages were withdrawn on 11 August 2026 and
live in `_archive/`. Their content now has a group-level home at `/about/#for-gps`.
