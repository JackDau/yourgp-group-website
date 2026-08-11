/**
 * Generates the published pages from the Claude Design prototypes.
 *
 *   project/Home.dc.html     ->  index.html
 *   project/About.dc.html    ->  about/index.html
 *   project/Clinics.dc.html  ->  clinics/index.html
 *
 * The prototypes stay untouched as the design source. Re-run this after any
 * Claude Design sync:  node build.mjs
 *
 * Three things need fixing on the way through:
 *   1. Asset paths — the prototypes load ./support.js and images/ relative to
 *      project/, which is wrong once the page sits at a different depth.
 *   2. Placeholder links — every href="#" is resolved by its anchor text.
 *   3. Document head — the prototypes carry no <title>, description or lang,
 *      because inside Claude Design they never needed one.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const PAGES = [
  {
    src: 'project/Home.dc.html',
    out: 'index.html',
    up: '',                       // path prefix back to the repo root
    self: 'home',
    title: 'YourGP — GP-Led Practices in Canberra',
    desc: 'YourGP is a group of four GP-led general practices in Canberra: Crace, Denman Prospect, Lyneham and Garema Place. Care, excellence, kaizen.',
    canonical: 'https://ygp.au/',
  },
  {
    src: 'project/About.dc.html',
    out: 'about/index.html',
    up: '../',
    self: 'about',
    title: 'About YourGP — How We Work',
    desc: 'How YourGP is built: our values, the four sequential pillars we measure ourselves against, and the six questions every part of the practice answers the same way.',
    canonical: 'https://ygp.au/about/',
  },
  {
    src: 'project/Clinics.dc.html',
    out: 'clinics/index.html',
    up: '../',
    self: 'clinics',
    title: 'Our Practices — YourGP Canberra',
    desc: 'YourGP practices in Canberra: Crace, Denman Prospect, Lyneham and Garema Place, plus YourSkin CBR and Canberra Vasectomy. Addresses, phone numbers and booking links.',
    canonical: 'https://ygp.au/clinics/',
  },
];

// Anchor text -> destination. Everything else stays as-is.
// The Australian GPs and UK GPs pages are archived under _archive/ and are no
// longer published, so nothing may point at them.
const LINK_TARGETS = [
  [/^contact$/i, 'contact/'],
  [/^join us as a gp$/i, 'about/'],
];

function buildHead(page) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.desc}">
<link rel="canonical" href="${page.canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="YourGP">
<meta property="og:url" content="${page.canonical}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.desc}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${page.title}">
<meta name="twitter:description" content="${page.desc}">
<link rel="icon" href="${page.up}favicon.ico">
<script src="${page.up}project/support.js"></script>`;
}

let unresolved = 0;

for (const page of PAGES) {
  let html = readFileSync(page.src, 'utf8');

  // 1. Head — replace the prototype's minimal head wholesale, and set the language.
  html = html.replace(/<head>[\s\S]*?<\/head>/, `<head>\n${buildHead(page)}\n</head>`);
  html = html.replace(/<html>/, '<html lang="en-AU">');

  // 2. Assets. project/ is the design source; pages elsewhere must reach into it.
  html = html.replace(/src="images\//g, `src="${page.up}project/images/`);

  // 3. Internal navigation between the three design pages.
  const home = page.self === 'home' ? './' : page.up;
  const about = page.self === 'about' ? './' : `${page.up}about/`;
  const clinics = page.self === 'clinics' ? './' : `${page.up}clinics/`;
  html = html.replace(/(?:\.\/)?Home\.dc\.html/g, home);
  html = html.replace(/(?:\.\/)?About\.dc\.html/g, about);
  html = html.replace(/(?:\.\/)?Clinics\.dc\.html/g, clinics);

  // 4. Placeholder links, resolved by anchor text.
  html = html.replace(/<a href="#"([^>]*)>([\s\S]*?)<\/a>/g, (whole, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const hit = LINK_TARGETS.find(([re]) => re.test(text));
    if (!hit) {
      console.warn(`  ! unresolved href="#" with text "${text}" in ${page.out}`);
      unresolved++;
      return whole;
    }
    return `<a href="${page.up}${hit[1]}"${attrs}>${inner}</a>`;
  });

  const dir = page.out.includes('/') ? page.out.slice(0, page.out.lastIndexOf('/')) : null;
  if (dir) mkdirSync(dir, { recursive: true });
  writeFileSync(page.out, html);

  const left = (html.match(/href="#"/g) || []).length;
  console.log(`${page.src}  ->  ${page.out}   (${left} placeholder links remaining)`);
}

console.log(unresolved ? `\n${unresolved} link(s) could not be resolved.` : '\nAll placeholder links resolved.');
