# Archived pages

These pages were withdrawn from ygp.au on 11 August 2026. They are kept here
rather than deleted.

| Folder | Was live at |
|---|---|
| `australian-gps/` | ygp.au/australian-gps/ |
| `uk-gps/` | ygp.au/uk-gps/ |

## Why this folder is named with an underscore

GitHub Pages builds this site with Jekyll, and Jekyll does not copy
directories whose name starts with `_` into the published site. That is what
keeps these pages off ygp.au while leaving them in the repo.

**Do not rename this folder to `archive/`** — that would republish both pages.
Equally, if a `.nojekyll` file is ever added to the repo root, Jekyll stops
running and everything here becomes public again.

Note the repository is public, so these files remain readable on github.com.
They are off the website, not off the internet.

## Restoring a page

The asset paths are one level short now that the pages sit a directory deeper.
`../css/style.css` and `../js/main.js` resolve correctly only from the repo
root, so a restore needs both a move and a path fix:

```bash
git mv _archive/australian-gps australian-gps
# then check the ../ paths in australian-gps/index.html still resolve
```

Also re-add the page to `sitemap.xml` and `llms.txt`, and put its links back in
the navigation. The nav lives in `project/*.dc.html` (the design source), not in
the generated pages — run `node build.mjs` after editing.

The pre-withdrawal state of the whole site is tagged `site-v1`.
