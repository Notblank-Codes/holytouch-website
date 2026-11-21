// HolyTouch Roofing site builder. Uses only Node's built-in modules: `node build.mjs`
// Reads src/pages/*.html and src/data/*.json, writes the finished site to docs/.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, "docs");
const site = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/site.json"), "utf8"));
const projects = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/projects.json"), "utf8"));

const waHref = (text) => `https://wa.me/${site.whatsappIntl}${text ? "?text=" + encodeURIComponent(text) : ""}`;
const telHref = `tel:${site.phoneIntl}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- Icons ----------
const ICONS = {
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>',
  roof: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12 12 4l10 8"/><path d="M5 10v10h14V10"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.7 6.3 9.6a7 7 0 1 0 11.4 0Z"/></svg>',
  truss: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 18 12 6l10 12Z"/><path d="M12 6v12M7 18l5-6 5 6"/></svg>',
  gutter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M17 14v7"/></svg>',
  ceiling: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 14h18M9 4v16M15 4v16"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
};

// ---------- Placeholder pictures ----------
function houseSVG({ roof = "#9E3B2F", style = "gable", label = "Placeholder photo", sky = ["#BFD9EE", "#EAF3FA"], wall = "#EFE7D8", wide = false }) {
  const W = 800, H = 600;
  const x0 = wide ? 90 : 170, x1 = wide ? 710 : 630, wallTop = 330, ground = 500;
  const mid = (x0 + x1) / 2, peak = wide ? 230 : 190, eave = 40;
  let roofShape, ribs = "";
  if (style === "hip") {
    roofShape = `<polygon points="${x0 - eave},${wallTop} ${mid - 120},${peak} ${mid + 120},${peak} ${x1 + eave},${wallTop}" fill="${roof}"/>`;
  } else {
    roofShape = `<polygon points="${x0 - eave},${wallTop} ${mid},${peak} ${x1 + eave},${wallTop}" fill="${roof}"/>`;
  }
  for (let x = x0 - eave + 14; x < x1 + eave; x += 16) {
    ribs += `<line x1="${x}" y1="${wallTop}" x2="${x}" y2="${peak}" stroke="rgba(0,0,0,.13)" stroke-width="3"/>`;
  }
  const clip = `<clipPath id="r"><polygon points="${style === "hip" ? `${x0 - eave},${wallTop} ${mid - 120},${peak} ${mid + 120},${peak} ${x1 + eave},${wallTop}` : `${x0 - eave},${wallTop} ${mid},${peak} ${x1 + eave},${wallTop}`}"/></clipPath>`;
  const win = (x) => `<rect x="${x}" y="370" width="70" height="60" rx="3" fill="#7FA6C4" stroke="#fff" stroke-width="6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>${clip}</defs>
<rect width="${W}" height="${H}" fill="url(#s)"/>
<circle cx="660" cy="110" r="46" fill="#FFE3A3"/>
<rect y="${ground}" width="${W}" height="${H - ground}" fill="#9DB07A"/>
<rect x="${x0}" y="${wallTop}" width="${x1 - x0}" height="${ground - wallTop}" fill="${wall}"/>
${win(x0 + 40)}${win(x1 - 110)}
<rect x="${mid - 38}" y="390" width="76" height="110" rx="3" fill="#6B4A33"/>
${roofShape}<g clip-path="url(#r)">${ribs}</g>
<rect x="${x0 - eave}" y="${wallTop - 4}" width="${x1 - x0 + 2 * eave}" height="10" fill="#C7CDD4"/>
<rect x="24" y="24" rx="18" width="${label.length * 11 + 40}" height="36" fill="rgba(30,42,56,.78)"/>
<text x="44" y="48" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" fill="#fff">${esc(label)}</text>
</svg>`;
}

// ---------- Layout ----------
const NAV = [
  ["index.html", "Home"],
  ["services.html", "Services"],
  ["projects.html", "Projects"],
  ["roof-calculator.html", "Roof Calculator"],
  ["materials.html", "Materials"],
  ["about.html", "About"],
  ["faq.html", "FAQ"],
  ["contact.html", "Contact"],
];

function layout({ title, description, body, file, base, scripts = [] }) {
  const pageUrl = `${site.siteUrl}/${file === "index.html" ? "" : file}`;
  const fullTitle = file === "index.html" ? `${site.name} | Aluminium Roofing in Ibadan, Nigeria` : `${title} | ${site.shortName}`;
  const nav = NAV.map(([href, label]) => `<a href="${base}${href}"${href === file ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const ld = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: site.name,
    url: site.siteUrl + "/",
    telephone: site.phoneIntl,
    logo: `${site.siteUrl}/assets/img/logo/mark-a.svg`,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.state, addressCountry: "NG" },
    areaServed: { "@type": "Country", name: "Nigeria" },
    openingHours: "Mo-Sa 08:00-18:00",
  };
  return `<!doctype html>
<html lang="en-NG" data-wa="${site.whatsappIntl}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${pageUrl}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${pageUrl}">
<meta name="theme-color" content="#1E2A38">
<link rel="icon" href="${base}assets/img/logo/mark-a.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/css/style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${site.previewNotice ? '<div class="preview-bar">Preview version: photos and projects shown are placeholders until real job photos are added.</div>' : ""}
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="${base}index.html" aria-label="${esc(site.name)} home"><img src="${base}assets/img/logo/${site.logo}.svg" alt="${esc(site.name)}" width="230" height="44"></a>
  <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
  <nav id="nav" class="nav" aria-label="Main">${nav}</nav>
  <a class="btn btn-primary btn-sm header-cta" href="${base}contact.html">Get a free quote</a>
</div></header>
<main id="main">
${body}
</main>
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div><img src="${base}assets/img/logo/${site.logo}-dark.svg" alt="${esc(site.name)}" height="44" style="height:44px;width:auto;margin-bottom:14px">
      <p>${esc(site.tagline)}.</p></div>
    <div><h4>Contact</h4><ul>
      <li><a href="${telHref}">Call ${site.phoneDisplay}</a></li>
      <li><a href="${waHref("Hello HolyTouch Roofing, I would like a quote.")}" target="_blank" rel="noopener">WhatsApp ${site.phoneDisplay}</a></li>
      <li>${esc(site.addressPublic)}</li>
      <li>${esc(site.hours)}</li></ul></div>
    <div><h4>Explore</h4><ul>
      <li><a href="${base}services.html">Services</a></li><li><a href="${base}projects.html">Projects</a></li>
      <li><a href="${base}roof-calculator.html">Roof calculator</a></li><li><a href="${base}materials.html">Materials guide</a></li>
      <li><a href="${base}faq.html">FAQ</a></li></ul></div>
  </div>
  <div class="footer-bottom">© ${new Date().getFullYear()} ${esc(site.name)}. Serving ${esc(site.serviceArea)}.</div>
</div></footer>
<a class="wa-float" href="${waHref("Hello HolyTouch Roofing, I would like a quote.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ICONS.whatsapp}</a>
<nav class="mobile-bar" aria-label="Quick contact">
  <a class="call" href="${telHref}">${ICONS.phone} Call</a>
  <a class="wa" href="${waHref("Hello HolyTouch Roofing, I would like a quote.")}" target="_blank" rel="noopener">${ICONS.whatsapp} WhatsApp</a>
</nav>
<script src="${base}assets/js/main.js"></script>
${scripts.map((s) => `<script src="${base}assets/js/${s}"></script>`).join("\n")}
</body>
</html>`;
}

// ---------- Project cards ----------
function tagsFor(p) {
  return [p.type, p.sector].join("|");
}
function projectCard(p, base) {
  return `<a class="project" href="${base}projects/${p.slug}.html" data-tags="${esc(tagsFor(p))}">
  <div class="img"><img src="${base}assets/img/placeholders/${p.slug}.svg" alt="${esc(p.title)} (placeholder picture)" loading="lazy" width="800" height="600"></div>
  <div class="body"><h3>${esc(p.title)}</h3>
  <div class="meta">${p.placeholder ? '<span class="tag example">Example</span>' : ""}<span class="tag">${esc(p.location)}</span><span class="tag">${esc(p.type)}</span><span class="tag">${p.sizeM2} m²</span></div></div></a>`;
}
function projectPage(p) {
  const base = "../";
  const body = `<section class="section"><div class="container" style="max-width:900px">
  <a href="${base}projects.html">← All projects</a>
  <h1 style="margin-top:14px">${esc(p.title)}</h1>
  ${p.placeholder ? '<p class="callout">This is an example project with a placeholder picture. Real HolyTouch jobs with photos will replace it soon.</p>' : ""}
  <div class="hero-img" style="margin-top:20px"><img src="${base}assets/img/placeholders/${p.slug}.svg" alt="${esc(p.title)} (placeholder picture)" width="800" height="600"></div>
  <dl class="spec">
    <div><dt>Location</dt><dd>${esc(p.location)}</dd></div>
    <div><dt>Job</dt><dd>${esc(p.type)}</dd></div>
    <div><dt>Roof size</dt><dd>${p.sizeM2} m²</dd></div>
    <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
    <div><dt>Colour</dt><dd>${esc(p.colour)}</dd></div>
    <div><dt>Duration</dt><dd>${esc(p.duration)}</dd></div>
  </dl>
  <p class="lead">${esc(p.story)}</p>
  <div class="btn-row" style="margin-top:24px">
    <a class="btn btn-wa" href="${waHref(`Hello HolyTouch Roofing, I saw the "${p.title}" project on your website and would like something similar.`)}" target="_blank" rel="noopener">${ICONS.whatsapp} I want a roof like this</a>
    <a class="btn btn-ghost" href="${base}roof-calculator.html">Estimate my roof</a>
  </div></div></section>`;
  return layout({ title: p.title, description: `${p.title} in ${p.location}: ${p.material}, ${p.sizeM2} m². ${p.story}`, body, file: `projects/${p.slug}.html`, base });
}

// ---------- Build ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "projects"), { recursive: true });
fs.cpSync(path.join(ROOT, "assets"), path.join(OUT, "assets"), { recursive: true });
fs.mkdirSync(path.join(OUT, "assets/img/placeholders"), { recursive: true });

// placeholder pictures
const styles = ["gable", "hip", "hip", "gable", "gable", "gable"];
projects.forEach((p, i) => {
  fs.writeFileSync(path.join(OUT, `assets/img/placeholders/${p.slug}.svg`),
    houseSVG({ roof: p.roofColour, style: styles[i % styles.length], wide: p.sector === "Commercial" }));
});
fs.writeFileSync(path.join(OUT, "assets/img/placeholders/hero.svg"), houseSVG({ roof: "#9E3B2F", style: "hip", label: "Placeholder photo: your best roof here" }));
fs.writeFileSync(path.join(OUT, "assets/img/placeholders/about.svg"), houseSVG({ roof: "#2E5E8C", style: "gable", label: "Placeholder photo: team at work", wall: "#E8E2D6" }));

const pagesDir = path.join(ROOT, "src/pages");
const urls = [];
for (const f of fs.readdirSync(pagesDir).filter((x) => x.endsWith(".html"))) {
  let raw = fs.readFileSync(path.join(pagesDir, f), "utf8");
  const m = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
  const meta = m ? JSON.parse(m[1]) : {};
  raw = raw.replace(/^<!--[\s\S]*?-->\s*/, "");
  const base = "";
  const filt = (n) => projects.slice(0, n).map((p) => projectCard(p, base)).join("\n");
  const body = raw
    .replace(/\{\{projects:(\d+)\}\}/g, (_, n) => filt(Number(n)))
    .replace(/\{\{projects\}\}/g, () => filt(projects.length))
    .replace(/\{\{icon:(\w+)\}\}/g, (_, n) => ICONS[n] || "")
    .replace(/\{\{wa:([^}]*)\}\}/g, (_, t) => waHref(t))
    .replace(/\{\{tel\}\}/g, telHref)
    .replace(/\{\{phone\}\}/g, site.phoneDisplay)
    .replace(/\{\{base\}\}/g, base);
  fs.writeFileSync(path.join(OUT, f), layout({ ...meta, body, file: f, base }));
  if (f !== "404.html") urls.push(f === "index.html" ? "" : f);
}
for (const p of projects) {
  fs.writeFileSync(path.join(OUT, "projects", `${p.slug}.html`), projectPage(p));
  urls.push(`projects/${p.slug}.html`);
}
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.siteUrl}/${u}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
console.log(`Built ${urls.length} pages into docs/`);
