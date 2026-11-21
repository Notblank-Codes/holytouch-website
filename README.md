# HolyTouch Roofing Ltd website

Website for HolyTouch Roofing (HolyTouch Aluminium Systems Enterprises), Ibadan and Lagos: aluminium roofing, re-roofing and repairs across Nigeria.

## How it is built
- Plain HTML, CSS and JavaScript. No packages to install.
- `node build.mjs` builds the finished site into `docs/`, which GitHub Pages serves.

## Where to change things
| What | File |
|---|---|
| Phone, WhatsApp, address, hours, site URL | `src/data/site.json` |
| Projects (portfolio) | `src/data/projects.json` |
| Page text | `src/pages/*.html` |
| Roof calculator figures and price list | `assets/js/estimator-settings.js` |
| Colours and layout | `assets/css/style.css` |
| Logos | `assets/img/logo/` (made by `brand/make_logos.py`) |

After changing anything, run `node build.mjs` and commit both the source and `docs/`.

## Roof calculator
`assets/js/estimator-core.js` holds the maths. Sloped roof area = plan area including overhangs ÷ cos(pitch). It gives
sheet counts, ridge, hip, gutter and verge lengths, plus an indicative timber count. All defaults
(slope, overhang, sheet cover width, timber spacing, waste) live in `estimator-settings.js` and are
marked DEFAULT until confirmed against HolyTouch's own calculations.
