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
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.2V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.2 1.6 3.6 3.8 3.8v3.1c-1.4.1-2.6-.3-3.8-1v6.3c0 4-3.4 6.4-6.8 5.6-4.4-1-5-7.4-.5-8.8.8-.3 1.7-.3 2.5-.2v3.2c-.4-.1-.8-.2-1.2-.1-1.7.3-1.9 2.8-.1 3.3 1.3.4 2.7-.5 2.7-2V3Z"/></svg>',
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

// ---------- Placeholder pictures (roof-sheet close-ups) ----------
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v + amt * 255))));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}
function roofSVG({ colour = "#9E3B2F", kind = "longspan", label = "Placeholder photo", id = "p" }) {
  const W = 800, H = 600;
  let pattern = "";
  if (kind === "stonecoated") {
    pattern = `<pattern id="${id}t" width="90" height="56" patternUnits="userSpaceOnUse">
      <rect width="90" height="56" fill="${colour}"/>
      <path d="M0 40 Q22.5 18 45 40 T90 40 V56 H0Z" fill="${shade(colour, -0.08)}"/>
      <path d="M0 40 Q22.5 18 45 40 T90 40" fill="none" stroke="${shade(colour, 0.12)}" stroke-width="3"/>
      <rect y="52" width="90" height="4" fill="${shade(colour, -0.2)}"/></pattern>`;
  } else {
    const step = kind === "steptile" ? `<rect y="58" width="44" height="6" fill="${shade(colour, -0.22)}"/><rect y="64" width="44" height="3" fill="${shade(colour, 0.12)}"/>` : "";
    pattern = `<pattern id="${id}t" width="44" height="${kind === "steptile" ? 70 : 200}" patternUnits="userSpaceOnUse">
      <rect width="44" height="200" fill="${colour}"/>
      <rect x="0" width="8" height="200" fill="${shade(colour, 0.16)}"/>
      <rect x="8" width="5" height="200" fill="${shade(colour, -0.18)}"/>
      <rect x="22" width="3" height="200" fill="${shade(colour, -0.06)}"/>${step}</pattern>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<defs>${pattern}
<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC3E2"/><stop offset="1" stop-color="#E4EEF6"/></linearGradient>
<linearGradient id="${id}light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
<filter id="${id}n"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .18 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#${id}sky)"/>
<g transform="translate(-160 150) skewX(-18) rotate(-9)">
  <rect width="1300" height="700" fill="url(#${id}t)"/>
  ${kind === "stonecoated" ? `<rect width="1300" height="700" fill="${colour}" filter="url(#${id}n)"/>` : ""}
  <rect x="0" y="-14" width="1300" height="18" fill="${shade(colour, -0.12)}"/>
  <rect x="0" y="-26" width="1300" height="14" fill="#C7CDD4"/>
</g>
<rect width="${W}" height="${H}" fill="url(#${id}light)"/>
<rect x="24" y="${H - 60}" rx="18" width="${label.length * 10.5 + 40}" height="36" fill="rgba(30,42,56,.72)"/>
<text x="44" y="${H - 36}" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="600" fill="#fff">${esc(label)}</text>
</svg>`;
}

// ---------- FAQ structured data ----------
function strip(h) { return h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
function faqLd(body) {
  const qs = [...body.matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)];
  return { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: qs.map((m) => ({ "@type": "Question", name: strip(m[1]), acceptedAnswer: { "@type": "Answer", text: strip(m[2]) } })) };
}

// ---------- Layout ----------
const NAV = [
  ["index.html", "Home"],
  ["services.html", "Services"],
  ["projects.html", "Projects"],
  ["roof-calculator.html", "Roof Calculator"],
  ["blog.html", "Roofing Tips"],
  ["about.html", "About"],
  ["faq.html", "FAQ"],
  ["contact.html", "Contact"],
];

function layout({ title, description, body, file, base, scripts = [], faq = false, extraLd = [], ogImage = "", ogType = "website", navFile = "" }) {
  const pageUrl = `${site.siteUrl}/${file === "index.html" ? "" : file}`;
  const fullTitle = file === "index.html" ? `${site.name} | Aluminium Roofing in Ibadan and Lagos` : `${title} | ${site.shortName}`;
  const nav = NAV.map(([href, label]) => `<a href="${base}${href}"${href === (navFile || file) ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const ld = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: site.name,
    url: site.siteUrl + "/",
    telephone: site.phoneIntl,
    logo: `${site.siteUrl}/assets/img/logo/mark-a.svg`,
    image: `${site.siteUrl}/assets/img/og-image.png`,
    address: { "@type": "PostalAddress", streetAddress: site.street, addressLocality: "Ibadan", addressRegion: "Oyo", addressCountry: "NG" },
    areaServed: [{ "@type": "City", name: "Ibadan" }, { "@type": "City", name: "Lagos" }, { "@type": "Country", name: "Nigeria" }],
    sameAs: Object.values(site.social).filter(Boolean),
    makesOffer: ["New roofing", "Roof installation only", "Re-roofing", "Roof leak repair", "Roof carpentry", "Gutters and flashing", "Fascia and ceiling cladding"].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
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
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${pageUrl}">
<meta name="theme-color" content="#1E2A38">
<link rel="icon" href="${base}assets/img/logo/mark-a.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/css/style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${faq ? `<script type="application/ld+json">${JSON.stringify(faqLd(body))}</script>` : ""}
${extraLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
<meta property="og:image" content="${ogImage || site.siteUrl + "/assets/img/og-image.png"}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="en_NG">
<meta name="twitter:card" content="summary_large_image">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${site.previewNotice ? '<div class="preview-bar">Preview version: photos and projects shown are placeholders until real job photos are added.</div>' : ""}
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="${base}index.html" aria-label="${esc(site.name)} home"><img src="${base}assets/img/logo/${site.logo}.svg" alt="${esc(site.name)}" width="230" height="44"></a>
  <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
  <nav id="nav" class="nav" aria-label="Main">${nav}</nav>
  <a class="btn btn-primary btn-sm header-cta" href="${base}contact.html">Request a quotation</a>
</div></header>
<main id="main">
${body}
</main>
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div><img src="${base}assets/img/logo/${site.logo}-dark.svg" alt="${esc(site.name)}" height="44" style="height:44px;width:auto;margin-bottom:14px">
      <p>${esc(site.tagline)}.</p></div>
    <div><h4>Contact</h4><ul>
      <li><a href="${telHref}">Call or WhatsApp ${site.phoneDisplay}</a></li>
      <li>${esc(site.addressPublic)}</li>
      <li>${esc(site.address2)}</li>
      <li>${esc(site.hours)}</li></ul></div>
    <div><h4>Locations</h4><ul>
      <li><a href="${base}roofing-ibadan.html">Roofing in Ibadan</a></li>
      <li><a href="${base}roofing-lagos.html">Roofing in Lagos</a></li></ul>
      <h4 style="margin-top:22px">Follow us</h4>
      <div class="social">${["facebook", "instagram", "tiktok"].map((k) => site.social[k]
        ? `<a href="${site.social[k]}" target="_blank" rel="noopener" aria-label="HolyTouch on ${k}">${ICONS[k]}</a>`
        : `<span title="Coming soon" aria-label="${k} (coming soon)">${ICONS[k]}</span>`).join("")}</div></div>
    <div><h4>Explore</h4><ul>
      <li><a href="${base}services.html">Services</a></li><li><a href="${base}projects.html">Projects</a></li>
      <li><a href="${base}roof-calculator.html">Roof calculator</a></li><li><a href="${base}materials.html">Materials guide</a></li>
      <li><a href="${base}faq.html">FAQ</a></li>
      <li><a href="${base}blog.html">Roofing tips</a></li></ul></div>
  </div>
  <div class="footer-bottom">© ${new Date().getFullYear()} ${esc(site.name)}</div>
</div></footer>
<a class="wa-float" href="${waHref("Hello HolyTouch, I would like a quotation for roofing.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ICONS.whatsapp}</a>
<nav class="mobile-bar" aria-label="Quick contact">
  <a class="call" href="${telHref}">${ICONS.phone} Call</a>
  <a class="wa" href="${waHref("Hello HolyTouch, I would like a quotation for roofing.")}" target="_blank" rel="noopener">${ICONS.whatsapp} WhatsApp</a>
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
projects.forEach((p, i) => {
  const kind = /stone/i.test(p.material) ? "stonecoated" : /step/i.test(p.material) ? "steptile" : "longspan";
  fs.writeFileSync(path.join(OUT, `assets/img/placeholders/${p.slug}.svg`), roofSVG({ colour: p.roofColour, kind, id: "p" + i }));
});
fs.writeFileSync(path.join(OUT, "assets/img/placeholders/hero.svg"), roofSVG({ colour: "#8E3428", kind: "longspan", label: "Placeholder photo", id: "h" }));
fs.writeFileSync(path.join(OUT, "assets/img/placeholders/about.svg"), roofSVG({ colour: "#2E5E8C", kind: "steptile", label: "Placeholder photo", id: "a" }));

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
    .replace(/\{\{waphone\}\}/g, site.whatsappDisplay)
    .replace(/\{\{base\}\}/g, base);
  fs.writeFileSync(path.join(OUT, f), layout({ ...meta, body, file: f, base }));
  if (f !== "404.html") urls.push(f === "index.html" ? "" : f);
}
for (const p of projects) {
  fs.writeFileSync(path.join(OUT, "projects", `${p.slug}.html`), projectPage(p));
  urls.push(`projects/${p.slug}.html`);
}
// ---------- Blog articles ----------
const artDir = path.join(ROOT, "src/articles");
const articles = fs.existsSync(artDir) ? fs.readdirSync(artDir).filter((x) => x.endsWith(".html")).map((f) => {
  let raw = fs.readFileSync(path.join(artDir, f), "utf8");
  const m = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
  const meta = JSON.parse(m[1]);
  raw = raw.replace(/^<!--[\s\S]*?-->\s*/, "");
  return { ...meta, slug: f.replace(/\.html$/, ""), raw };
}).sort((a, b) => (a.order || 99) - (b.order || 99)) : [];
fs.mkdirSync(path.join(OUT, "blog"), { recursive: true });
function imgUrl(img, w) {
  if (img.pexels) return `https://images.pexels.com/photos/${img.pexels}/pexels-photo-${img.pexels}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
  return img.src;
}
function articleCard(a, base) {
  const local = !a.image.pexels;
  return `<a class="project" href="${base}blog/${a.slug}.html">
  <div class="img"><img src="${local ? base + a.image.src : imgUrl(a.image, 640)}" alt="${esc(a.image.alt)}" loading="lazy" width="640" height="427" onerror="this.onerror=null;this.src='${base}assets/img/placeholders/hero.svg'"></div>
  <div class="body"><h3>${esc(a.h1)}</h3><p style="color:var(--muted);margin:6px 0 0;font-size:.95rem">${esc(a.description)}</p></div></a>`;
}
for (const a of articles) {
  const base = "../";
  const words = a.raw.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(3, Math.round(words / 200));
  const url = `${site.siteUrl}/blog/${a.slug}.html`;
  const heroSrc = a.image.pexels ? imgUrl(a.image, 1200) : base + a.image.src;
  const heroAbs = a.image.pexels ? imgUrl(a.image, 1200) : `${site.siteUrl}/${a.image.src}`;
  const body = a.raw
    .replace(/\{\{wa:([^}]*)\}\}/g, (_, t) => waHref(t))
    .replace(/\{\{icon:(\w+)\}\}/g, (_, n) => ICONS[n] || "")
    .replace(/\{\{tel\}\}/g, telHref).replace(/\{\{phone\}\}/g, site.phoneDisplay)
    .replace(/\{\{base\}\}/g, base);
  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 3).map((x) => articleCard(x, base)).join("\n");
  const page = `<article>
<section class="page-hero article-hero"><div class="container narrow">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${base}index.html">Home</a> › <a href="${base}blog.html">Roofing tips</a></nav>
  <h1>${esc(a.h1)}</h1>
  <p class="lead">${esc(a.description)}</p>
  <p class="byline">By HolyTouch Roofing · ${(() => { const [y, mo, d] = (a.updated || a.date).split("-").map(Number); return `${d} ${["January","February","March","April","May","June","July","August","September","October","November","December"][mo - 1]} ${y}`; })()} · ${mins} min read</p>
</div></section>
<div class="container narrow">
  <figure class="article-img"><img src="${heroSrc}" alt="${esc(a.image.alt)}" width="1200" height="800" onerror="this.onerror=null;this.src='${base}assets/img/placeholders/hero.svg'">
  ${a.image.credit ? `<figcaption>Photo: <a href="${a.image.creditUrl}" target="_blank" rel="noopener">${esc(a.image.credit)}</a> on Pexels</figcaption>` : ""}</figure>
  <div class="prose">
${body}
  </div>
  <aside class="article-cta">
    <div><h2>Need a roof done?</h2><p>Call or WhatsApp ${site.phoneDisplay}. Ibadan and Lagos, and we travel for jobs.</p></div>
    <div class="btn-row"><a class="btn btn-primary" href="${base}roof-calculator.html">Try the roof calculator</a>
    <a class="btn btn-wa" href="${waHref("Hello HolyTouch, I read your article and I would like a quotation.")}" target="_blank" rel="noopener">${ICONS.whatsapp} WhatsApp us</a></div>
  </aside>
</div>
</article>
<section class="section alt"><div class="container"><h2>More roofing tips</h2><div class="grid grid-3" style="margin-top:20px">${related}</div></div></section>`;
  const ld = [
    { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.h1, description: a.description, image: [heroAbs],
      datePublished: a.date, dateModified: a.updated || a.date, mainEntityOfPage: url, keywords: a.keywords.join(", "),
      author: { "@type": "Organization", name: site.name, url: site.siteUrl + "/" },
      publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.siteUrl}/assets/img/og-image.png` } } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.siteUrl + "/" },
      { "@type": "ListItem", position: 2, name: "Roofing tips", item: `${site.siteUrl}/blog.html` },
      { "@type": "ListItem", position: 3, name: a.h1, item: url } ] },
  ];
  fs.writeFileSync(path.join(OUT, "blog", `${a.slug}.html`),
    layout({ title: a.title, description: a.description, body: page, file: `blog/${a.slug}.html`, base, faq: /<details>/.test(body), extraLd: ld, ogImage: heroAbs, ogType: "article", navFile: "blog.html" }));
  urls.push(`blog/${a.slug}.html`);
}
// blog index
{
  const base = "";
  const body = `<section class="page-hero"><div class="container">
<span class="eyebrow">Roofing tips</span><h1>Roofing tips and prices in Nigeria</h1>
<p class="lead">Straight answers to the questions people ask us every day: what a roof costs, which sheet to buy, how much wood you need and how to stop a leak.</p>
</div></section>
<section class="section"><div class="container"><div class="grid grid-3">${articles.map((a) => articleCard(a, base)).join("\n")}</div></div></section>`;
  fs.writeFileSync(path.join(OUT, "blog.html"), layout({ title: "Roofing Tips and Prices in Nigeria", description: "Roofing costs, sheet prices, wood estimates, leak repairs and buying tips for Nigerian homeowners, from HolyTouch Roofing in Ibadan and Lagos.", body, file: "blog.html", base }));
  urls.push("blog.html");
}

fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.siteUrl}/${u}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
console.log(`Built ${urls.length} pages into docs/`);
