# Deployment: GitHub → Hostinger (NEX Express Logistics)

> **Context:** The NEX Express Logistics platform is **already built and working**: public website, tracking engine, Express/SQLite API,
> admin console, documents, quotes, package photos and payments. Claude is acting as a **senior professional developer** who
> maintains and improves this existing codebase. Nothing here is built from scratch; every task modifies the working system
> in place and must leave it working. See `CLAUDE.md §0`.

> ⛔ **This is a new site.** NEX Express Logistics gets a **new GitHub repo** (fresh history), a **new Hostinger Node.js app**, a
> **new, empty database** and **new admin credentials**. Don't connect it to, push to or reuse any other repo, app, domain
> or database.

The app is **one Node.js process** on **one domain**: Express serves the API (`/api/*`), the built React site (`dist/`) and
the admin console at **`https://nexexpresslogistics.com/admin/`**. It stores data in a **SQLite file** plus an
**uploads folder**. That shapes everything below.

---

## 1. Hosting requirements

| Need | Why |
|---|---|
| A Hostinger plan that runs **Node.js web apps** (Business / Cloud web hosting, or a VPS) | Plain static hosting cannot run the Express server, tracking API or admin |
| **Node.js ≥ 22.5** (choose 22.x LTS or newer) | `server/db.ts` uses the built-in `node:sqlite`; `package.json` declares `"engines": { "node": ">=22.5" }` |
| **Persistent storage** outside the deploy folder | The database and uploaded files must survive every redeploy |
| HTTPS (free SSL in hPanel) | The admin session cookie is `secure` in production |

Hostinger's hPanel screens change from time to time. If a label below doesn't match, look for the equivalent setting.

## 2. Repository setup (new repo, fresh history)

1. Create a **new, empty private GitHub repo** for NEX Express Logistics.
2. Check `.gitignore` still excludes `node_modules/`, `dist/`, `dist-server/`, `/data/` and `.env`.
3. Push one fresh-history commit (none of the earlier history):
   ```bash
   git checkout --orphan nexexpresslogistics-main
   git add -A
   git commit -m "NEX Express Logistics: initial release"
   git branch -M main
   git remote add origin <NEW-EMPTY-REPO-URL>
   git remote -v        # must show ONLY the new NEX Express Logistics repo
   git push -u origin main
   ```

## 3. Hostinger app configuration (new Node.js app)

| Setting | Value |
|---|---|
| Source | GitHub → the new NEX Express Logistics repo, branch `main` |
| Node version | 22.x (≥ 22.5) or newer LTS |
| Install command | `npm install` (the `postinstall` script already runs `npm run build`) |
| Build command | Leave empty if the panel allows; otherwise `npm run build`. Don't build twice |
| Start command | `npm start` → `node dist-server/server/index.js` |
| Port | Use the port the platform provides (`PORT` env var). The server reads `process.env.PORT` |

## 4. Environment variables (set in hPanel, never commit)

Create the persistent folder first, **outside** the app/deploy directory, e.g. `/home/<hostinger-user>/nexexpresslogistics-data/`.

```ini
NODE_ENV=production
PORT=<only if hPanel requires it>
ADMIN_PASSWORD_HASH=<bcrypt hash: see below; new for NEX Express Logistics, never reused>
SESSION_SECRET=<64 hex chars: see below; new for NEX Express Logistics, never reused>
DB_PATH=/home/<hostinger-user>/nexexpresslogistics-data/nexexpresslogistics.db
UPLOADS_DIR=/home/<hostinger-user>/nexexpresslogistics-data/uploads
```

Leave these **unset**:
- `SEED_DEMO_DATA`: no longer read; the app ships no demo data (tracker 6.7).
- `ADMIN_PROXY_TARGET`: an admin-only proxy mode that NEX Express Logistics doesn't use (the admin is a path on this app).
  Setting it would turn this app into an API proxy with no database.

Generate the secrets locally (run them yourself; never paste the password anywhere else):
```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR-STRONG-PASSWORD', 12))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Database file:** when `DB_PATH` is unset the default is `data/nexexpresslogistics.db` (relative to the working directory), which is
fine locally but **inside the deploy folder** on Hostinger, so a redeploy can delete it. The site starts with a fresh,
empty database; the schema and default settings are created on first start. Table and column names are unchanged.

**Uploads folder:** `UPLOADS_DIR` holds package photos (`images/`, shown on the track page) and payment-proof
screenshots (`proofs/`, private, admin-only). Both subfolders are created on start. When unset it defaults to an
`uploads` folder next to the database. Like `DB_PATH`, it **must** point outside the deploy directory.

The startup log (hPanel → app logs) prints the database path and the uploads path in use.

**Check persistence before launch:** `GET /api/diag/storage` is a temporary, admin-only endpoint. Log in at
`/admin/` first, then open `https://nexexpresslogistics.com/api/diag/storage` in the same browser: `dataDir` must be
the `nexexpresslogistics-data` folder. Redeploy and open it again; if `markerFirstSeen` stays the same, storage persists. **After
confirming, remove this endpoint.**

## 5. Domain, DNS and the admin path

| Host | Points to | Purpose |
|---|---|---|
| `nexexpresslogistics.com` | The NEX Express Logistics Node app | Public site **and** admin console (`/admin/`) |
| `www.nexexpresslogistics.com` | Redirect (301) → `https://nexexpresslogistics.com` | One host only |

- **Admin console: `https://nexexpresslogistics.com/admin/`** on the same host and Node app. There is **no admin
  subdomain** (no `private.` host, no second app). `isAdminPath()` in `src/App.tsx` matches the pathname exactly against
  `ADMIN_PATH` from `src/config/brand.ts` (case and trailing slash ignored; `/admin/x` and `/admins` don't
  match). The server answers `/admin` with a 301 to `/admin/` and serves `index.html` there with
  `Cache-Control: no-cache` and `X-Robots-Tag: noindex, nofollow`.
- Keep **one** host: `www.` must redirect to the apex, or the host-only admin session cookie splits in two and the
  canonical/OG URLs (which use `https://nexexpresslogistics.com`) stop matching.
- On the live site `/#/admin` falls back to Home; `/admins`, `/admin/x` and any other unknown path get status 404 and the
  "Page not found" page. `/admin/` is a commonly probed address, so use a long, unique admin password. It is never listed in `robots.txt` or `sitemap.xml` (listing it would advertise it).
- If the domain is registered elsewhere, point its DNS at Hostinger (A/CNAME records from hPanel).
- Turn on SSL for both hostnames, and force HTTPS.

## 6. Email (info@nexexpresslogistics.com)

- Create the mailbox (Hostinger Email or Google Workspace).
- DNS: **MX** records from the provider · **SPF** `v=spf1 include:<provider> ~all` · **DKIM** (from the provider) ·
  **DMARC** `v=DMARC1; p=quarantine; rua=mailto:info@nexexpresslogistics.com`.
- Send a test to Gmail and check "Show original" → SPF/DKIM/DMARC = PASS.

## 7. Launch checklist (smoke test on the live domain)

- [ ] **No demo data (tracker 6.7).** The production database starts empty; `grep -rn "DEMO DATA" src server` returns
  nothing. Tracking any made-up ID (e.g. `NEL7K2M9`) on the live site says "not found".
- [ ] Home loads over HTTPS with the **NEX Express Logistics logo, name and tab icon**, and no console errors.
- [ ] `https://www.nexexpresslogistics.com/` redirects to `https://nexexpresslogistics.com/`; `http://` redirects to `https://`.
- [ ] `/api/health` returns `ok` with `"service": "NEX Express Logistics API"`.
- [ ] **`https://nexexpresslogistics.com/admin/`** shows the admin login, and the new password works; logout/login works.
- [ ] `https://nexexpresslogistics.com/admin` (no slash) redirects 301 to `/admin/`.
- [ ] `/#/admin` shows **Home**; `/admins` and `/admin/x` show the **404 page**. None of them opens the admin.
- [ ] Response headers on `/admin/` include `X-Robots-Tag: noindex, nofollow`.
- [ ] `robots.txt` and `sitemap.xml` use `https://nexexpresslogistics.com` and **don't mention `admin`**.
- [ ] Logged in, `/api/diag/storage` shows `dataDir` inside `nexexpresslogistics-data`; the startup log shows `UPLOADS_DIR` there too.
- [ ] Create a shipment in admin → it gets an **8-character ID: `NEL` + 5 characters** (e.g. `NEL7K2M9`) → the public
  Track page finds it, also typed in lower case with spaces and as a piece label (`…-01`).
- [ ] Download the waybill, BOL and invoice PDFs: NEX Express Logistics logo, name, `info@nexexpresslogistics.com`, `nexexpresslogistics.com` and
  `NEL-INV-` references only.
- [ ] Quote request → appears in admin → publish → the public quote link opens.
- [ ] Contact and callback forms submit, show a `NEL-TKT-` reference and appear in the admin Messages inbox.
- [ ] Package photo upload shows on the track page; payment request → proof upload → approve works.
- [ ] Redeploy once, then confirm the shipment and its photo still exist (persistence).
- [ ] Response headers: `Content-Encoding: gzip` (or `br`) on the JS bundle; `/assets/*` has
  `Cache-Control: public, max-age=31536000, immutable`; `index.html` has `no-cache`.
- [ ] **OG image is live:** `https://nexexpresslogistics.com/brand/og-image.jpg` returns 200 (`image/jpeg`). Paste the home
  link in WhatsApp, then run it through the Facebook Sharing Debugger and LinkedIn Post Inspector ("Scrape again").
- [ ] View source of the live HTML and JS bundle: only NEX Express Logistics names, domain and email appear.
- [ ] Lighthouse mobile on Home meets the MOTION_3D_SPEC §2 targets.

## 8. After launch

- **Backups:** copy `nexexpresslogistics.db` **and the `UPLOADS_DIR` folder** (both in `nexexpresslogistics-data/`) daily to off-server
  storage (a Hostinger cron job + download, or a VPS cron to cloud storage). The database stores only file names; the
  photos and proofs live in the folder, so one without the other is not a full backup. Copy the database while the app is
  idle, or, where the `sqlite3` tool is installed, use `sqlite3 nexexpresslogistics.db ".backup nexexpresslogistics-backup.db"`. Test a restore once.
- **Updates:** push to `main` → Hostinger redeploys. Use a `staging` branch for bigger changes.
- **Monitoring:** a free uptime monitor on `https://nexexpresslogistics.com/api/health` (5-minute interval) with email
  alerts to info@nexexpresslogistics.com.
- **Security:** rotate `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` if anyone leaves; keep dependencies updated
  (`npm audit` monthly). Remove `/api/diag/storage` once persistence is confirmed.
