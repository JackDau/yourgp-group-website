# ygp.au — YourGP group site

Static site, no build step. Edit the HTML directly, push to `main`, live in about a minute.

## What this site is

The group site for YourGP: who we are, our practices, and GP recruitment for both
Australian-qualified GPs and UK GPs considering a move. Patient bookings, fees and
doctor profiles live on the individual practice sites, not here.

## Structure

```
index.html          Home — balanced group story, two audience paths
about/              Values, four pillars, six-question clarity framework
clinics/            Four practices + YourSkin CBR + Canberra Vasectomy
australian-gps/     Recruitment: Australian-qualified GPs
uk-gps/             Recruitment: UK GPs relocating
contact/            Enquiry routing
css/style.css       Single stylesheet, CSS custom properties
js/main.js          Mobile menu + accordions only
```

Header and footer markup is repeated on each page rather than templated — same as
every other site in this workspace, and it keeps pages editable in one place.

## Financial detail is gated — read before editing content

Remuneration specifics stay **off** this site. They are sent in the information pack
after someone completes the Microsoft Form. Never publish here:

- the service fee split (GP share / base fee / payroll tax reserve)
- expected take-home or annual billings, in dollars or pounds
- the first-three-months minimum hourly rate
- the UK ramp-up guaranteed wage rate

What is fine to publish, matching the Crace careers page: the 1.5% DNA rate, that we
are predominantly private billing (~90%), "no lock-in contracts, no set hours", and
visa sponsorship.

Run this before pushing any content change:

```bash
grep -rniE '61\.9|38\.1|430,?000|700,?000|\$180|\$150|220,000|240,000' --include=*.html --include=*.txt .
```

It must return nothing.

## Brand

Tokens live at the top of `css/style.css` and match the clinic sites and the print packs.

| Token | Value | Use |
|-------|-------|-----|
| `--deep` | `#082622` | Dark sections, headings |
| `--sage` | `#5A867D` | Borders, rules, surfaces |
| `--mid` | `#456B63` | Links, buttons, any text on light |
| `--mint` | `#80B7A2` | Accents, stat numbers, primary CTA |

**Use `--mid`, not `--sage`, for text on light backgrounds.** Sage on white is 4.08:1,
below the WCAG AA threshold of 4.5:1. Mid is 5.94:1.

The logo is CSS text (`.wordmark`), not an image — the PNG logos in the other repos are
clinic-specific ("YourGP@Crace") and too low-resolution for modern screens.

## Deployment

GitHub Pages from `main` / root. `CNAME` contains `ygp.au` — do not delete it.

**DNS lives at GoDaddy**, not Cloudflare like the other sites, and ygp.au carries live
Microsoft 365 email. Only ever touch the A/AAAA records. Leave every MX and mail-related
TXT record (SPF, DKIM, DMARC) alone.

## Checks

```bash
# serve locally
python -m http.server 8765

# internal link check + gating audit
grep -rn "logo-top.png\|logo-footer.png" --include=*.html .   # should be empty
```
