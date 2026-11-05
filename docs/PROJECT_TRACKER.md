# NEX Express Logistics — Project Tracker

> **Context:** The platform is **already built and working**: public website, tracking engine, Express/SQLite API,
> admin console, documents, quotes, package photos and payments. Claude is acting as a **senior professional developer** who
> maintains and improves this existing codebase. Nothing here is built from scratch; every task modifies the working system
> in place and must leave it working. See `CLAUDE.md §0`.
>
> **2026-11-03: NEX Express Logistics launch.** The site launches as **NEX Express Logistics** on **karimashippingenterprisesinc.com**, with the admin console
> at **`https://karimashippingenterprisesinc.com/admin/`** (a path on the same domain and app, not a subdomain). The task is archived, with the remaining
> prompts, in `PROMPTS.md`. It is a new site: new GitHub repo with fresh history, new Hostinger Node.js app, new empty
> database, new admin credentials.

**Working method:** treat this like a client engagement on a live system. Before each task, read the affected files; after each task, run `npm run build`, test the flow you touched, commit with a clear message, and log it below.

**Owner:** NEX Express Logistics · **Repo:** new NEX Express Logistics GitHub repo, fresh history (L.9) · **Target:** karimashippingenterprisesinc.com on Hostinger (new Node.js app)
**Status legend:** `[ ]` to do · `[~]` in progress · `[x]` done · `[!]` blocked (see Needs owner)

---

## Phase L — NEX Express Logistics launch (current phase; PROMPTS.md)
**Given by the owner (2026-11-05):** name and legal name **NEX Express Logistics** · tagline **NEX EL** · **karimashippingenterprisesinc.com**
· **info@nexexpresslogistics.com** (its own domain, not the website's) · admin **/admin/** · logo `images/NEX Express Logistics Logo.png` · tracking ID **`NEL` + 5 characters = 8**
(e.g. `NEL7K2M9`, piece labels `NEL7K2M9-01`) · references `NEL-TKT-`, `NEL-INV-`, `NEL-SL-` + 6 digits (quotes keep `QR-YYYY-#####`)
· live chat on with this site's own Smartsupp key · palette, fonts, layout and photos unchanged. Default DB file `nexexpresslogistics.db`.

- [x] L.1 Baseline and working branch: `npm test` 60/60 before any change.
- [x] L.2 Logo and icons: `scripts/optimize-images.mjs --brand` from the new artwork → `Public/brand/` (logo, logo-white, web logos, mark, favicons, app icons, OG image); cache-bust `?v=7`.
- [x] L.3 Name, domain, email: `src/config/brand.ts`, `index.html` meta/OG/Twitter/JSON-LD, `site.webmanifest`, legal text, documents, server health name and start log, package `nex-express-logistics`, default DB file, `.env.example`; CLAUDE.md, BRAND_GUIDE, CONTENT.
- [x] L.4 Tracking IDs and references `NEL`: `TRACKING_PREFIX`, `REFERENCE_PREFIX`, examples, comments, `scripts/*.test.ts`.
- [x] L.5 **Admin console at `/admin/`** (`ADMIN_PATH`), with tests and docs updated.
- [x] L.6 Docs: DEPLOYMENT, this tracker, `PROMPTS.md` task archive.
- [x] L.7 Sweep and production-mode run on a scratch database: see the launch section of the change log.
- [ ] L.8 New admin password + session secret (PROMPTS.md Prompt 1), new values never used by any other site.
- [ ] L.9 New GitHub repo with fresh history + Hostinger app, env vars, domain, SSL, smoke test (PROMPTS.md Prompt 2 = Phase 7 below).

---

## Phase 0 — Take over the existing system & record a baseline
- [ ] 0.1 Create a new GitHub repo for NEX Express Logistics and push the code without the old git history (DEPLOYMENT §2). *Done in L.9 / 7.0.*
- [x] 0.2 Copy `CLAUDE.md` to the repo root and all other docs into `/docs`.
- [x] 0.3 Run `npm install` and `npm run dev`; confirm the existing site, tracking, admin login, shipment creation, documents and quotes all work (this is the baseline that must never regress).
- [x] 0.3b Codebase walkthrough: read App.tsx, the main pages, server routes and db.ts; write a short "system notes" summary at the bottom of this tracker so future sessions start with context.
- [ ] 0.4 Take "before" screenshots of every page → `screens/before/`.
- [x] 0.5 Site images supplied and built into `Public/images/site/` (BRAND_GUIDE §8, CONTENT §12).
- [x] 0.6 Owner supplies logo files (full-colour, white/reversed, icon-only) → `Public/brand/`. *Derived from `images/nexexpresslogistics.png` (L.2); a transparent or vector original is still wanted (#60).*

## Phase 1 — Brand foundation (no visual redesign yet)
- [x] 1.1 Create `src/config/brand.ts` with every value from `CLAUDE.md §2`; replace hard-coded brand strings with imports.
- [x] 1.2 Extract the colour palette from the logo (BRAND_GUIDE §4), then write the tokens into `src/styles/tokens.css`.
- [x] 1.3 Brand token prefix `--ngf-*` and class prefix `ngf-` across `src/` (BRAND_GUIDE §4.1).
- [x] 1.4 Replace `logo.png`, footer logo, favicon, apple-touch-icon; add `site.webmanifest` and OG image.
- [x] 1.5 Update `index.html`: title, description, Open Graph/Twitter tags, theme-color, canonical (CONTENT.md §1).
- [x] 1.6 `package.json` name `nex-express-logistics`; default DB file `nexexpresslogistics.db` (server/db.ts, .env.example, DEPLOYMENT §4).
- [x] 1.7 Replace all emails with `info@nexexpresslogistics.com` (defaults in `server/db.ts` settings, Header, Contact, PublicQuoteResult, Admin Settings).
- [x] 1.8 Implement the new tracking-ID generator (`NEL` + 5 chars = 8 total) as ONE shared util; replace all generators. *The server assigns every ID; clients adopt it. Tests: `npm test`.*
- [x] 1.9 Update tracking input validation, placeholders and help text to the new 8-character format.
- [x] 1.10 Worldwide demo shipments for development *(all demo data removed for launch, 6.7)*.
- [x] 1.11 Replace the other ID prefixes: seals, support tickets, invoices, returns (BRAND_GUIDE §7). *`src/shared/references.ts`.*
- [x] 1.12 Brand sweep: no foreign brand names in source. *Re-run 2026-10-12 for the NEX Express Logistics launch: zero hits.*

## Phase 2 — Worldwide operations
- [x] 2.1 Replace the U.S. hub data with the global gateway network (CONTENT.md §9) in `HomeNetworkMap`, `FacilityNetworkMap`, `LocationsPage`.
- [x] 2.2 `geocodingService.ts`: add a `GLOBAL_GATEWAY_DATABASE` (city, country, ISO code, lat/lng, IANA time zone); keep Nominatim for free-text; stop assuming `state`/`zip`.
- [x] 2.3 `routingEngine.ts`: when OSRM cannot route (different continents/oceans), draw air/sea legs as great-circle arcs instead of failing.
- [x] 2.4 Rename `USJourneyMap` → `JourneyMap` (component + CSS + imports); remove "interstate/highway" wording.
- [x] 2.5 Time zones: replace `ET/CT/MT/PT` handling (server/routes/track.ts, shipments.ts) with IANA zones + UTC offset display.
- [x] 2.6 Address forms (Quote, Ship, Admin Create Shipment): country selector first, then fields that fit that country (postcode optional, "State/Region").
- [x] 2.7 Units: kg/cm by default with lb/in toggle; currency display configurable (default USD, allow NGN/GBP/EUR).
- [x] 2.8 Service modes: add Air Freight / Ocean Freight / Road labels to shipment types where the copy mentions them.

## Phase 3 — Copy (page by page, from CONTENT.md)
- [x] 3.1 Header + footer + mobile drawer (nav labels, footer columns, legal line, social links)
- [x] 3.2 Home — all 13 sections
- [x] 3.3 Services
- [x] 3.4 About
- [x] 3.5 Locations
- [x] 3.6 Quote + Public Quote Result *Quote reference keeps its `QR-` format (#35); "Estimated transit" hidden until quotes store one (#32).*
- [x] 3.7 Ship *Server-written first tracking event still needs work (#33).*
- [x] 3.8 Track + Track Result + loading screen + support modal *No public Documents panel yet (#28).*
- [x] 3.9 Help / FAQ
- [x] 3.10 Contact
- [x] 3.11 Legal (Privacy, Terms, Cookies, Shipping Terms, Accessibility) — **must be reviewed by a lawyer before launch** *Plain-language drafts in place (CONTENT §13.1); lawyer review still open (#11, #37).*
- [x] 3.12 Generated documents: waybill, BOL, invoice, receipt, label, insurance certificate (ShipmentDocuments, DocumentCenterView, CreateShipmentView) *No Proof of Delivery or Security Seal Record document type yet (#38).*
- [x] 3.13 Admin console strings (AdminLayout, AdminLogin, Settings defaults)
- [x] 3.14 Replace invented testimonials & client logos per CONTENT.md §2.10–2.11 (remove until real ones exist) *"Our commitments" + "Modes we connect" on Home.*

## Phase 4 — Images
- [x] 4.1 Optimise all site images (WebP + JPG fallback, max 2400px wide hero, ≤ 250 KB each where possible).
- [x] 4.2 Swap image paths in Home, Services, TrackResult; delete old image files from `Public/`.
- [ ] 4.3 Write alt text for every image (CONTENT.md §12).

## Phase 5 — 3D & motion (MOTION_3D_SPEC.md)
- [x] 5.0 Code-split first (MOTION_3D_SPEC §2): the admin console, Leaflet and the PDF libraries load only when needed. Measurements below.
- [ ] 5.1 Motion foundation: `useReveal`, `useTilt`, `useParallax` hooks + reduced-motion guard + (optional) Lenis smooth scroll.
- [ ] 5.2 Hero 3D globe with animated trade-route arcs (lazy-loaded; static fallback image).
- [ ] 5.3 Section reveals + staggered cards on all pages.
- [ ] 5.4 3D tilt on service/industry/value cards.
- [ ] 5.5 Parallax depth on image sections and page heroes.
- [ ] 5.6 Animated counters + "How it works" connecting path animation.
- [ ] 5.7 Track Result: tilted map, animated marker, 3D parcel "passport" card flip.
- [~] 5.8 Performance pass: Lighthouse mobile ≥ 85 Performance, ≥ 95 Accessibility; fix regressions. *2026-10-13 pass: see measurements below. Accessibility met everywhere except the Locations map markers (#61); mobile Performance on Home 84–88 on an idle machine, needs a re-check on the live domain (PageSpeed Insights).*

### Performance measurements (5.0, 2026-09-29)
Production build served by `node dist-server/server/index.js` on localhost (scratch DB). Lighthouse 12.8.2 CLI, default mobile preset (simulated mid-range phone, slow 4G, 4× CPU slowdown), median of 3 runs.

| Chunk | Before | After | Loaded when |
|---|---|---|---|
| Main JS (every public page) | 1,806 kB (489 kB gzip) | **712 kB (192 kB gzip)** | always (budget ≤ 250 kB gzip: **met**) |
| Admin console | (in main) | 344 kB (77 kB gzip) + login 1.5 kB | only on the admin page |
| Leaflet | (in main) | 150 kB (44 kB gzip) | when a map is within 200 px of the viewport |
| jspdf + html2canvas (+ their deps) | (in main) | 782 kB (242 kB gzip) | only when a document PDF is downloaded |
| CSS | 434.6 kB (71 kB gzip) | 434.6 kB (71 kB gzip), byte-identical | always (see #41) |

| Page | Performance | Accessibility | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| Home | 37 → **47** | 95 → 94 | 13.5 → **7.1 s** | 15.9 → **9.4 s** | 1,016 → **452 ms** | 0.028 → 0.028 |
| Track | 48 → **52** | 98 → 98 | 12.5 → **8.0 s** | 13.9 → **9.3 s** | 345 → **306 ms** | 0.009 → 0.010 |
| Services | 51 → **52** | 98 → 98 | 12.5 → **7.5 s** | 14.0 → **9.0 s** | 251 → 291 ms | 0.029 → 0.029 |

These figures predate HTTP compression (added later in `server/index.ts`, see Decisions). ~~Open accessibility items for 5.8: red eyebrow/"read more" text on the dark sections and the barcode spec captions~~ fixed 2026-10-13 (Accent 400 on Ink per BRAND_GUIDE, slate-600 captions).

### Performance measurements (5.8, 2026-10-13)
Same setup (production build, compression on, Lighthouse 12.8.2). Main JS **707 → 373 kB (191 → 108 kB gzip)**; main CSS byte-identical apart from the intended rules below. The local machine was under heavy load for later runs (Lighthouse CPU benchmark 760–940 vs 1,159 idle), which inflates TBT; desktop figures are the reliable ones.

| Page | Desktop P / A / BP / SEO | Mobile P / A / BP / SEO |
|---|---|---|
| Home | 98–100 / 100 / 100 / 100 | 61 → **84–88** (idle machine; 70–74 under load) / 94 → **100** / 100 / 100 |
| Track, Services, Ship, About, Contact, Help, Legal, Quote | 97–99 / 100 / 100 / 100 | not measured |
| Locations | 96 / 96 / 100 / 100 (map marker target size, #61) | not measured |

## Phase 6 — QA & SEO
- [x] 6.1 Brand sweep = zero. *Re-run 2026-10-12 for the NEX Express Logistics launch over source, docs, `dist/` and `dist-server/`.*
- [x] 6.2 Functional test: create shipment in admin → track it publicly → documents download → quote flow → contact form. *Re-run end to end for the launch (L.7).*
- [!] 6.3 Cross-browser: Chrome, Safari (iOS), Firefox, Samsung Internet; low-end Android test. *Needs the owner's devices (#43). Desktop Chrome checked at 375, 768 and 1440.*
- [x] 6.4 SEO: per-page titles/descriptions, `robots.txt`, `sitemap.xml`, OG image, structured data (Organization). *`server/seo.ts`: one public robots.txt/sitemap on `https://karimashippingenterprisesinc.com` that never lists the admin path, plus `X-Robots-Tag: noindex, nofollow` on `/admin/`. Hash routing limits indexing to `/` (#44).* **Before announcing the launch:** the OG image URL is absolute (`https://karimashippingenterprisesinc.com/brand/og-image.jpg`) and only works once the domain serves the site; check it with DEPLOYMENT §7.
- [x] 6.5 Accessibility: keyboard nav, focus states, alt text, contrast, reduced motion. *axe-core (WCAG 2.1 AA) on 11 public pages at 375 and 1440: 0 violations. Not audited: the admin console and later form steps (#45).*
- [ ] 6.6 Take "after" screenshots → `screens/after/`.
- [x] 6.7 **Remove ALL demo data before launch (launch blocker).** No mock shipments, demo seed, fake timeline or demo map dot in the code; `SEED_DEMO_DATA` no longer does anything; the production database starts empty. `grep -rn "DEMO DATA" src server` returns nothing.

## Phase 7 — Deploy NEX Express Logistics (DEPLOYMENT.md, PROMPTS.md Prompt 2)
- [x] 7.0 New, empty GitHub repo for NEX Express Logistics; push a **fresh-history** commit (orphan branch → `main`). `git remote -v` must show only the NEX Express Logistics repo.
- [ ] 7.1 **New** Hostinger Node.js app connected to the NEX Express Logistics repo (`main`); Node 22.x (≥ 22.5); install `npm install` (postinstall builds), start `npm start`.
- [ ] 7.2 Env vars: `NODE_ENV=production`, new `ADMIN_PASSWORD_HASH` + `SESSION_SECRET` (L.8), `DB_PATH=/home/<user>/nexexpresslogistics-data/nexexpresslogistics.db`, `UPLOADS_DIR=/home/<user>/nexexpresslogistics-data/uploads` (outside the deploy folder), `SEED_DEMO_DATA` unset.
- [ ] 7.3 Domain: `karimashippingenterprisesinc.com` on the app, `www.` redirecting to the root (one host keeps the admin session working); SSL on both, force HTTPS. **No admin subdomain**: the admin is `https://karimashippingenterprisesinc.com/admin/`.
- [ ] 7.4 Email: info@nexexpresslogistics.com mailbox + SPF/DKIM/DMARC.
- [ ] 7.5 Post-deploy smoke test (DEPLOYMENT §7): logo/name/tab icon, OG preview, `/admin/` login with the new password, `/#/admin` shows Home and `/admins` the 404 page, robots.txt doesn't list the admin path, `/api/diag/storage` shows `nexexpresslogistics-data`, create → track a NEL shipment, data survives a redeploy, compression + `/assets` cache headers. Then set up the daily backup of `nexexpresslogistics.db` **and** the `UPLOADS_DIR` folder.

---

## Blocked / Needs owner
Only open items are listed. Numbers are kept stable because code and docs refer to them.

| # | Item | Needed for |
|---|---|---|
| W5 | **New GitHub repo URL.** Done: https://github.com/ojkali/nexExpress.git, branch `main`. | L.9 |
| 2 | **Phone number(s) + WhatsApp number.** `PHONE` and `WHATSAPP` in `brand.ts` are empty, so the UI hides them. Never invent them (PROMPTS.md Prompt O). | 1.1, 3.1, 3.10 |
| 3 | **Head-office address** (and any regional offices). `HQ_ADDRESS` is empty and hidden. | 1.1, 3.10, 6.4 |
| 4 | Confirm the global gateway list (CONTENT.md §9), live on Home, Locations and Contact from `src/data/gateways.ts`. Includes the Tokyo (NRT), Seoul (ICN), Chicago (ORD) and Miami (MIA) gateways and their lanes NRT–LAX, ICN–FRA, ORD–LHR, ORD–PVG, MIA–GRU. | 2.1 |
| 5 | Year founded / real stats (shipments, countries, years), or approve keeping the stat blocks removed. Home shows only 24/7, "1 tracking ID", "5 continents" and modes. | 3.2, 3.4 |
| 6 | Real customer testimonials + permission (Option B, CONTENT §2.10). Home shows "Our commitments". | 3.14 |
| 7 | Real partner/carrier logos you're authorised to show. Home shows "Modes we connect". | 3.14 |
| 8 | Certifications/licences you actually hold (e.g. IATA, customs broker licence, ISO). | 3.2, 3.4 |
| 9 | **Social media links.** `SOCIAL` in `brand.ts` is empty, so no social icons show. | 3.1 |
| 11 | **Lawyer review of legal pages** (all five tabs, CONTENT §13.1). Drafts are live on `#/legal`; see #37 for the open facts. | 3.11 |
| 12 | After a control action these stay browser-only: `statusMessage`, the audit log and the hold "frozen" flag (no columns). Decide whether to persist them. | 1.8 |
| 14 | No email notification is sent when a contact message, callback, support ticket or payment proof arrives (needs an SMTP/email provider). Covers #21 and #30. | 2.1, 3.10 |
| 15 | Sea legs are great-circle arcs, which cross land on some lanes (e.g. Shanghai → Rotterdam over Siberia). Decide whether to add real sea lanes (e.g. the MIT-licensed `searoute` data). | 2.3 |
| 17 | **Exchange rates are entered by hand** in Settings → Tariff. Decide who updates them and how often, or connect a rate feed. | 2.7 |
| 18 | The automatic estimates (Quote page tariff corridor, admin default base rates) are placeholder USD formulas; they need real pricing. The public quote page invents a breakdown line when a quote is published with only a total. | 2.7, 3.x |
| 19 | Still imperial by nature: NMFC freight classes, "48×40 in" pallet names, IATA kennel sizes in inches, dimensional-weight divisor 139. Confirm whether to add metric equivalents. | 2.7 |
| 20 | Footer: **Careers** hidden until a careers page exists; no newsletter (needs a mailing-list provider and copy). The admin "regulatory line" shows on About and Contact when set, not in the header. Confirm. | 3.1, 3.11 |
| 22 | Most Home photo sources are ~347 px squares, upscaled on wide screens. Larger originals sharpen them with no code change. | 3.2, 4.2 |
| 24 | **[confirm] items on Services/About:** Priority Express max 70 kg per piece and 120 × 80 × 80 cm; vehicle types; Secure Vault max 30 kg per piece; Weekend Delivery "on selected lanes" (which?); comparison-table Transit speed / Modes values (CONTENT §3.2); same-day collection cut-off; Services eyebrows and About "WHAT WE'VE BUILT" header. | 3.3, 3.4 |
| 25 | About timeline cards show no years until real dates are supplied (`MILESTONES` in `AboutPage.tsx`). | 3.4 |
| 27 | The admin pre-filled customer message per status (TrackingEventsView) is not in CONTENT. | 3.8, 3.13 |
| 28 | **Track Result: no Documents panel yet.** Needs a decision on which documents the public may download. | 3.8, 3.12 |
| 31 | **Quote, Quote Result, Ship, Help and Contact labels** recorded in CONTENT §7.4/§8.4 (e.g. `Drop-off at a NEX Express Logistics gateway`, `Book shipment`, `Print labels`): confirm or replace. | 3.6, 3.7, 3.9, 3.10 |
| 32 | **Quote Result:** no transit time stored, so "Estimated transit" is hidden; the publish form sets one total, so the breakdown shows one Transport line; "Download PDF" opens the print dialog; no rate email is sent (#14). | 3.6 |
| 33 | **Ship booking:** the server's first tracking event for every new shipment reads "Consignment Registered & Barcode Issued … Linear Code 128 barcode assigned"; the Ship page sends a fixed ETA "2-3 Business Days, by 5:00 PM" and facility "{city} Regional Gateway". Confirm the three collection windows and whether NEX Express Logistics accepts drop-off at a gateway. | 3.7, 3.12 |
| 34 | **Help [confirm] answers:** same-day cut-off, damage reports "within 7 days" (CONTENT §8.2). Help, Contact and Quote heroes use Unsplash photos. | 3.9, 3.10, 4.2 |
| 35 | **Contact / Quote reference:** "Average response under 30 minutes" is confirmed for callbacks only; confirm for messages. Quotes keep `QR-YYYY-#####` (the quote link and tracking search depend on `QR`); decide whether quotes get a `NEL-` reference format. | 3.6, 3.10 |
| 37 | **Legal facts for the owner and the lawyer:** {{JURISDICTION}} (governing law names "the country in which NEX Express Logistics is registered" until known; TODO in `src/data/legalDocs.ts`); dimensional-weight divisor 5000 and 7-day claims window [confirm]; data-retention periods; liability limits; prohibited/restricted items; "we do not sell personal data"; the Cookie Policy lists the real cookie (`ngf.sid`, staff only), the storage keys and third-party services (Esri tiles, Nominatim, OSRM; fonts and photos are self-hosted since 2026-10-13). | 3.11 |
| 38 | **Documents:** no Proof of Delivery or Security Seal Record type yet; Shipping Label, Shipment Receipt and Certificate of Cargo Insurance titles to confirm (CONTENT §11); a shipment created without dimensions stores 12 × 12 × 12 in, which prints on its documents; the PDF is an image (text not selectable). | 3.12 |
| 39 | **Admin Settings** still shows the U.S. "USDOT & Carrier Authority Number" field with an FMCSA hint. Rename it once you say which registration NEX Express Logistics shows. `defaultFuelSurchargeRate` 8.5% is in no doc: confirm or clear. | 3.13 |
| 41 | Public pages depend on some admin stylesheet rules, so the admin CSS stays in the main bundle. Follow-up (no visual change, needs its own parity check): move the shared rules to public styles and drop ~29 kB gzip of admin CSS for visitors. No owner decision needed. | 5.8 |
| 42 | Quote conversion writes the converted shipment's first event with a `350.00` tariff fallback and the "Linear Code 128" wording (same as #33). | 6.2 |
| 43 | **Manual device checks** on your phone (iPhone Safari, Android Chrome / Samsung Internet): tracking, Ship booking, country and phone pickers, mobile menu, maps, PDF/print, Contact and Callback. | 6.3 |
| 44 | **Search engines can index only the home page** (hash URLs). Indexable page URLs need path-based routing. Decide before or after launch. | 6.4 |
| 45 | **Accessibility not yet covered:** the admin console, later Quote/Ship form steps and modal states; modals close with Escape but don't trap focus. | 6.5, 5.x |
| 46 | Track Result "Get Delivery Alerts" form says "Subscribed Successfully!" but saves nothing. Nothing opens it (dead code): delete it or connect it to email/SMS (#14). | 6.2 |
| 47 | **Found in QA, not fixed:** (a) the dangerous-goods **Emergency Response Contact** field is not saved; (b) the admin "Book Consignment" quick form is U.S.-shaped (required "State", NY/LA placeholders, lbs only); (c) the pet presets pre-fill a fictional "(212) 555-0199"; (e) `POST /api/quotes` accepts a client-chosen quote `id`, and `POST /api/documents/generate` (public, rate-limited) returns 500 for a bad body and accepts an unknown `docType`. | 6.2 |
| 50 | At 375 px the footer tagline may wrap onto two lines (no overflow). | 3.1 |
| 52 | At 375 px the Quote result page (`#/quote/<id>`) scrolls sideways by about 40 px (`.quote-main-col` / `.pending-rate-waiting-card`). | 6.2 |
| 55 | **Launch inputs still needed:** (b) the Hostinger plan/app and access to the karimashippingenterprisesinc.com DNS; (c) the info@nexexpresslogistics.com mailbox (7.4); (d) phone / WhatsApp / HQ address / social links (#2, #3, #9); (e) lawyer review under the NEX Express Logistics name and jurisdiction (#11, #37); (f) confirm the payment/proof copy in CONTENT §6.8 and the 404 page copy in CONTENT §1.1a. | L, 7 |
| 57 | The Document Center preview closes on a backdrop click but not with Escape. The ETA engine gives an Express Tokyo → São Paulo shipment next-day delivery: confirm the transit rules. | 3.12 |
| 59 | **Code clean-up after launch (owner to decide):** (a) the unused `ADMIN_PROXY_TARGET` proxy mode in `server/index.ts`, `server/db.ts` and `server/seo.ts` (DEPLOYMENT §4: leave it unset); (b) remove `/api/diag/storage` once persistence is confirmed on Hostinger; (c) `QuoteRequestsView.tsx` still gives quote ID `QR-2026-00124` a "SAMPLE" row style (styling only, no data). | 7, after launch |
| 60 | **Logo source is a raster.** The artwork is transparent, but its tagline line is about 2 px tall at header size and the 16 px favicon is busy. A vector original would give a crisper favicon. | L.2 |
| 61 | **Locations map markers fail Lighthouse "target size"** at the world view: neighbouring gateway markers (e.g. London/Rotterdam/Frankfurt) overlap, so each visible tap area is under 24×24 px. The gateway cards below the map offer the same action. Fix needs a design choice (bigger initial zoom, clustering, or larger markers). | 5.8 |

## Decisions log
| Date | Decision |
|---|---|
| 2026-11-03 | **NEX Express Logistics launch (owner):** new name, legal name, domain, email, logo, `NEL` prefix and admin address; tagline "NEX EL"; palette, fonts, layout, photos and features unchanged. |
| 2026-11-05 | **Rebrand (owner):** name, logo, domain and tagline only. Follow-up the same day: email info@nexexpresslogistics.com, ID prefix `NEL` (5 random characters, total stays 8), legal name NEX Express Logistics, this site's own Smartsupp key. The Home headline "Fast • Safe • Reliable" and all other copy stay as they were. |
| 2026-11-03 | **Admin console is at `/admin/` (owner's choice):** `https://karimashippingenterprisesinc.com/admin/` on the same host and app. `isAdminPath()` matches the path exactly; `/admin` gets a 301; `#/admin` works only on localhost. The server serves `index.html` there with `X-Robots-Tag: noindex, nofollow`; robots.txt does **not** list the path. It is a commonly probed address, so it relies on a strong password and the login rate limit. |
| 2026-11-03 | Unknown paths (incl. `/admins`, `/admin/x`, `/admin-x`) get status 404 and the "Page not found" page (CONTENT §1.1a). |
| 2026-11-03 | **Live chat (owner):** Smartsupp with this site's own account key (`SMARTSUPP_KEY`), public site only; named in the privacy policy. |
| 2026-10-12 | Admin login shows the white logo (transparent PNG) on the dark photo above the card; Settings shows the admin console address read-only (owner). |
| 2026-10-12 | Internal code names `--ngf-*`, `ngf-`, `ngf_*` and the cookie `ngf.sid` are **kept** (invisible to users; the cookie lives in `server/middleware/auth.ts`). |
| 2026-10-11 | Production responses are compressed (`compression`); `/assets/*` is cached for a year (`immutable`), `index.html` is `no-cache`, other static files for 1 hour. `@types/qrcode` is a runtime dependency because Hostinger installs with `NODE_ENV=production`. |
| 2026-10-11 | Package images, payment requests and proof of payment: design and decisions D-1…D-9 in `docs/update.md`. |
| 2026-09-30 | No demo data ships: mock shipments, seed, fake timeline and demo map dot removed (6.7). |
| 2026-09-29 | Code-split before motion (MOTION_3D_SPEC §2): admin console `React.lazy`; Leaflet loads when a map nears the viewport; jspdf/html2canvas load when a PDF is generated. Admin CSS stays in the main bundle so the cascade is unchanged (#41). |
| 2026-09-29 | Shipment status names (CONTENT §6.3) live in `src/shared/shipmentStatus.ts`, shared by public pages, admin and server. Stored codes are not renamed: BOOKED = Booked, RECEIVED = Collected, PROCESSING = At origin gateway, DEPARTED_FACILITY = Departed, IN_TRANSIT = In transit, DESTINATION_PROCESSING = Arrived at destination gateway, CUSTOMS_CLEARANCE = Customs clearance, OUT_FOR_DELIVERY, DELIVERED, ON_HOLD, DELAYED, RETURNED = Returning to sender. With PII masking on, the public API masks the signer's name. |
| 2026-09-28 | Returns are real shipments: each return gets its own shipment row and server-assigned tracking ID, linked both ways (`return_leg_json`, `return_of_tracking`). One return per shipment. |
| 2026-09-28 | Transport mode stored per shipment when known; older rows infer it. Air/sea legs are great-circle arcs (#15). |
| 2026-09-28 | Event times: the instant + the IANA zone of the event's location are stored; display is local time there + UTC offset. |
| 2026-09-28 | One canonical unit per quantity in the DB: pounds and inches (columns like `weight_lbs` are not renamed), USD for money. Forms and displays convert at the edges (kg/cm default, lb/in toggle; display currency from Settings at an admin-entered rate). |
| 2026-09-28 | Admin UI shows "Administrator"; new records store it; older "Super Admin" values are shown via `displayOperator`. |
| 2026-09-27 | The server assigns every tracking ID: `POST /api/shipments` and quote conversion ignore any `trackingNumber` in the body. If the server fails, nothing is added locally and an error is shown. |
| 2026-09-27 | Public `/api/track` only accepts IDs in the current format (`TRACKING_PREFIX` + 5 characters; 400 for anything else). |
| 2026-09-26 | Piece labels use one format for every piece type: base ID + `-NN` (e.g. `NEL7K2M9-01`). A search for a piece label resolves to its parent. |
| 2026-09-26 | Keep the four service lines (Priority Express, Scheduled Linehaul/Freight, Vehicle Transport, Secure Vault). |
| 2026-09-26 | Palette from the logo: Primary = graphite, Accent = brand red (500 = `#D3070B`), Ink 950 = `#141414`; Tailwind blues stay as the semantic info colour; in transit = info (blue), delivered = success (green). |
| 2026-09-26 | All pages carry the brand, including admin and generated documents. |
| 2026-09-26 | Admin runs on the same app, domain and API as the public site. The separate `ADMIN_PROXY_TARGET` mode is not used (#59). |
| 2026-09-26 | Owner's source images are in `images/` at the project root and processed into `Public/` by `scripts/optimize-images.mjs`; licence records in `images/*/SOURCES.md`. Every card photo is a 1:1 square. Branded or unverified photos were replaced with free stock; each hero slot has its own photo. |
| 2026-09-26 | Logo: transparent, white and icon versions are derived by `scripts/optimize-images.mjs --brand` until vector files are supplied (source `images/NEX Express Logistics Logo.png`). |
| 2026-09-26 | Public contact values resolve as: admin Settings (DB) → `src/config/brand.ts` → empty. Empty phone / address / social / licence values hide their element (`src/utils/useCompanyContact.ts`). |
| 2026-09-26 | `DB_PATH`, `UPLOADS_DIR` and `/api/diag/storage` (admin-only) let production keep data outside the deploy folder (DEPLOYMENT §4). |

## Change log
| Date | Task | Note |
|---|---|---|
| 2026-11-05 | Rebrand to NEX Express Logistics | Name, tagline, domain, email and default DB file swept; logos, icons and OG image rebuilt with `optimize-images.mjs --brand` (`GLOBE`, `PARCEL`, `ORBIT`, `MARK` re-measured; web logo 359×104). Then the owner's follow-up: email, `NEL` IDs and references (examples and tests updated), Smartsupp key; pushed with fresh history to the new repo. |
| 2026-11-03 | Owner decisions | Email, legal name and `NEL` prefix confirmed. Live chat off, then back on the same day with this site's own Smartsupp key; privacy policy names it (`legalDocs.ts`, CONTENT §13). |
| 2026-11-03 | **NEX Express Logistics launch** | See below. |
| 2026-10-13 | Live chat | Smartsupp widget (owner's key, `SMARTSUPP_KEY` in `brand.ts`) loaded by `src/services/liveChat.ts` after the page `load` event, on browser idle; never on `/admin/`. Privacy policy "Other services" names Smartsupp (CONTENT §13 + `legalDocs.ts`). No CSP is set, so nothing to allow-list. |
| 2026-10-13 | Clean-up | Removed unused components (ShipmentDocuments, ShipmentPassport, ShipmentTimeline: nothing imported them) and 16 unused photos (all `contact-team-*`; the 640/2400 sizes of `ship-hero` and `quote-result-hero`, whose CSS uses 1024/1600); `siteImages.ts` and `optimize-images.mjs` (new `widths` option) match. |
| 2026-10-13 | 5.8 Lighthouse pass | Lazy-loaded public pages (CSS kept in the main bundle in the original order via `src/pages/pageStyles.ts`, verified byte-identical); self-hosted fonts (`src/assets/fonts`, OFL) instead of Google Fonts; Unsplash heroes on Quote/Contact/Help/Legal self-hosted (`images/unsplash/SOURCES.md`); Home hero preloaded; 346×104 WebP header/footer logos; 30-day cache for `/brand` and `/images`; `laserSweep`/`laserPulse` animate `transform` instead of `left`; contrast (Accent 400 on Ink, slate-600 captions) and heading-order fixes on Home, footer, Quote, Contact, Help, About, Ship, Locations; Locations contact buttons' accessible name includes the visible text; privacy text no longer lists Google Fonts/Unsplash (CONTENT §13). Removed unused imports/handlers and `react-leaflet`. Build 0 TS errors, `npm test` 60/60. |

### 2026-11-03 NEX Express Logistics launch
- **Logo:** built from the supplied transparent 2172×724 PNG. `loadTransparentLogo` now levels the alpha haze instead of keying a background; `GLOBE`, `PARCEL` and `MARK` re-measured; web logos added to the script (433×104). Checked on white and `#181818`.
- **Sweep:** name, domain, email, `NEL` IDs and references, DB file, package name, admin path across code, tests and docs. The previous `SMARTSUPP_KEY` was removed.
- **Build and tests:** `npm run build` 0 TypeScript errors; `npm test` 60/60.
- **Production-mode run** (`NODE_ENV=production`, scratch `DB_PATH`/`UPLOADS_DIR`, temporary password in the process env only; `.env` and `data/` untouched):
  - `/admin/` 200 with `X-Robots-Tag`; `/admin` and `/Admin/` 301 → `/admin/`; `/admins`, `/admin-x`, `/admin/x`, the previous admin path → 404. On a non-localhost hostname `/#/admin` stays on Home and `/admin/` opens the login.
  - Wrong password 401, right password 200, dashboard loads. `/api/health`, `robots.txt` and `sitemap.xml` use the new name and domain and don't list the admin path.
  - Shipment created → `NELWZBLZ` tracks publicly (also lower case, with a space, and as piece label `-01`); an old-prefix ID gets 400.
  - Shipping Label generated in Document Center and its PDF captured and read: new logo, name, domain and `NEL` ID.
  - Headless Chrome at 1440, 768 and 375 over Home, About, Services, Track, Contact, Help, Legal, Locations, Quote, Ship, Track Result, admin login and dashboard: no old-brand strings in the HTML, no horizontal overflow, no uncaught exceptions logged. Header, drawer, footer, sidebar, login and label logos checked by eye.
- **Not re-run in the browser:** quote → publish → public quote page, Contact/Messages, payment proof upload and approve, and document types other than the Shipping Label. They changed only through brand strings; the unit tests cover references and payment validation.
- **Incident:** this tracker was found overwritten with NUL bytes after an interrupted session. Rebuilt from the last commit with the same rename rules, then rewritten here. No other file was affected.

---

## System notes (codebase walkthrough)

**Shape.** One Node process. `server/index.ts` (Express 5) serves `/api/*` and the built SPA from `dist/`. Dev: Vite on :3000 proxies `/api` to Express on :5000. Build: `tsc` (src) → `vite build` → `tsc -p tsconfig.server.json` → `dist-server/`.

**Routing.** No router library. `src/App.tsx` keeps `currentPage` in state and syncs it with `location.hash` (`#/services`, `#/track/:id`, `#/quote/:id`). `getInitialPage()` resolves the first paint synchronously; a `hashchange` effect handles the rest. `KNOWN_PAGES` is the allow-list. Admin: `isAdminPath()` (path `/admin/`, exact match) → always `admin`. On localhost, `#/admin` also opens admin; anywhere else `#/admin` falls back to Home. Any other path than `/` is unknown → `not-found` (NotFoundPage); the server answers those with status 404. The admin console code is a lazy-loaded chunk.

**Frontend ↔ API.** `src/services/api.ts` holds relative `fetch('/api/...')` calls. `AdminDataProvider` (`src/context/AdminDataContext.tsx`) wraps the whole app but loads admin lists only with an admin session. Public tracking: quote IDs (`QR…`) first, then `GET /api/track/:id` (PII-masked). The public site reads company contact info from `GET /api/settings`. `simulationEngine` broadcasts across tabs through the localStorage key `ngf_live_shipment_stream`.

**Server progress.** `server/progress.ts` advances progress and the map position on every read. It imports `src/services/{routingEngine,planningEngine,geocodingService}.ts`, so those files are **shared with Node** and must stay DOM-free.

**Tracking IDs.** Allocated only by `server/trackingIds.ts` via `src/shared/trackingId.ts` (`crypto.randomInt`); clients adopt the server's ID. Piece labels are `WPxxxxxx-NN`; `/api/track` normalises input (case, spaces, dashes) and resolves piece labels to their parent.

**Admin auth.** A single shared password, checked with `bcrypt.compare` against `ADMIN_PASSWORD_HASH` (rate-limited to 20 per 15 min). It sets `req.session.isAdmin`. Session store is in memory: cookie `ngf.sid`, httpOnly, sameSite=lax, secure in production, 12 h, trust proxy 1. **Every restart or redeploy logs everyone out.** `requireAdminAuth` is a plain session check; CSRF protection relies on SameSite=lax.

**DB.** `node:sqlite` (Node ≥ 22.5) at `DB_PATH`, or `<cwd>/data/nexexpresslogistics.db` if unset. WAL mode, foreign keys on. The schema is created in `initDatabase()` with try/catch `ALTER` migrations (incl. `deleted_at_ts` for soft delete). Shipment delete is soft (trash); `/permanent` hard-deletes from the trash. Uploaded photos and proofs live in `UPLOADS_DIR` (`images/`, `proofs/`).

**Fragile / worth knowing**
- `/api/diag/storage` is admin-only and returns the server's data paths. Remove it after the Hostinger persistence check (#59).
- **`GET /api/settings` is public** and returns the whole settings object, including `signatureStampUrl`, `signatoryName`, `defaultFuelSurchargeRate` and `hubSortStatus` once set. Consider returning only the public fields.
- The session cookie name (`SESSION_COOKIE`), the logout `clearCookie` and the `ngf_live_shipment_stream` key must change together. Renaming them logs everyone out once.
- Some `'New York'` and `'August 24, 2026'` fallback defaults remain in the server insert path (`server/routes/shipments.ts`) for bodies that omit them.
- Schema columns (`*_state`, `*_zip`, `*_lbs`) are U.S.-shaped. They stay (rule 10); the worldwide work maps onto them.
- `CreateShipmentView.tsx` (≈4,000 lines) and `DocumentCenterView.tsx` (≈2,000 lines): edit surgically.
