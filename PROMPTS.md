# NEX Express Logistics: Launch Task Archive and Prompt Pack

**The job (owner's request, 2026-11-05):** launch this working logistics platform as a new site,
**NEX Express Logistics**, on **karimashippingenterprisesinc.com** (Hostinger Node.js app). Only the site name, logo, tagline, domain,
email, ID prefix and live chat key change. **These stay the same:** colour palette, fonts, layout, every photo, every page, every feature and the admin path.

> **Fresh site, fresh identity.** This site gets a **new GitHub repo**, a **new Hostinger Node.js app**, a **new empty
> database** and **new admin credentials**. The previous brand's name, domain, email, repo and app are not mentioned in
> code, docs or metadata, and nothing from this site is pushed to the previous repo or app.

---

## The request, as given

> Transfer the content of the current site to the new domain, karimashippingenterprisesinc.com. The site name will be
> NEX Express Logistics, with NEX EL as the tagline. The new logo is `images/NEX Express Logistics Logo.png`.
> No code changes, just change the logo and name.

**Owner's follow-up decisions (same day):** email info@nexexpresslogistics.com; tracking prefix `NEL`; legal name NEX Express Logistics;
Home headline stays "Fast • Safe • Reliable"; this site's own Smartsupp key supplied; new repo https://github.com/ojkali/nexExpress.git.

## Project values

| Key | Value | Source |
|---|---|---|
| Name / legal name / short name | **NEX Express Logistics** | Owner |
| Tagline | **NEX EL** | Owner |
| Domain | **karimashippingenterprisesinc.com** (`www.` redirects to the root) | Owner |
| Email | **info@nexexpresslogistics.com** (a different domain from the website) | Owner |
| Admin console | **https://karimashippingenterprisesinc.com/admin/** · locally `http://localhost:3000/admin/` and `http://localhost:3000/#/admin` | Owner |
| Admin console name | **NEX Express Logistics Operations Console** (from `COMPANY_SHORT`) | Derived |
| Tracking ID | **`NEL` + 5 characters = 8 total**, e.g. `NEL7K2M9`; piece labels `NEL7K2M9-01` | Owner |
| Reference prefixes | `NEL-TKT-######`, `NEL-INV-######`, `NEL-SL-######`; quotes keep `QR-YYYY-#####` | Owner |
| Logo source | `images/NEX Express Logistics Logo.png`: 2172×724, transparent PNG | Owner |
| Palette, fonts, photos | **Unchanged** | Owner |
| DB file (default) | `nexexpresslogistics.db` (production uses `DB_PATH`). Fresh, empty. Table and column names unchanged. | Derived |
| Internal code names **kept** | CSS `--ngf-*`, classes `ngf-*`, storage keys `ngf_*`, session cookie `ngf.sid`. Users never see them. | Existing convention |
| Live chat | **On**, with this site's own key (`SMARTSUPP_KEY`); named in the privacy policy | Owner |
| Phone / WhatsApp / HQ address / social | **Not supplied. Empty in `brand.ts`, so the UI hides them.** Never invent them. | Needs owner |

---

## Status

Local work is on branch `wpe-main`. Details are in the change log of `docs/PROJECT_TRACKER.md`.

- [x] Logo, reversed logo, web logos, mark, favicons, app icons and OG image rebuilt from the new artwork.
- [x] Name, domain, email, IDs, references, DB file, metadata, documents, tests and docs swept.
- [x] Admin console moved to `/admin/`.
- [x] Production-mode check on a scratch database.
- [x] Owner confirmed the email, legal name and `NEL` prefix and supplied the Smartsupp key.
- [x] New GitHub repo created and pushed with fresh history: https://github.com/ojkali/nexExpress.git
- [ ] Prompt 1: new admin password and session secret.
- [ ] Prompt 2: Hostinger deploy (step 1, the GitHub repo, is done).

---

### Prompt 1: New admin password and session secret (mostly me)
```
Set a new admin password and session secret for NEX Express Logistics. Configuration only; don't edit auth logic, and never ask me for the password.

1. Give me the two commands to run MYSELF in the project folder:
   - node -e "console.log(require('bcryptjs').hashSync('MY-NEW-PASSWORD', 12))"
   - node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
2. Tell me exactly what to put in my local .env (ADMIN_PASSWORD_HASH, SESSION_SECRET), whether the `$` characters in the hash need quoting, and remind me the same values go into Hostinger in Prompt 2. They must be NEW values, not ones used by any previous site.
3. After I say "done", restart and have me confirm: the old password is rejected, the new one works at http://localhost:3000/admin/, and logout/login works.
STOP.
```

### Prompt 2: New GitHub repo and deploy to karimashippingenterprisesinc.com on Hostinger (mostly me in hPanel)
```
Prepare the deploy per docs/DEPLOYMENT.md. Don't deploy anything yourself; give me exact steps. This is a NEW site with a NEW repo, app and database.

1. GitHub, fresh history: check .gitignore excludes node_modules, dist, dist-server, data, .env, then give me the commands: `git checkout --orphan wpe-main`, `git add -A`, commit "NEX Express Logistics: initial release", `git branch -M main`, `git remote remove origin`, `git remote add origin <MY NEW EMPTY REPO URL>`, `git push -u origin main`. Ask me for the repo URL; don't guess it. Before pushing, confirm `git remote -v` shows ONLY the new repo and the new main has exactly one commit.
2. hPanel → new Node.js web app: connect the new repo, branch main, Node 22.x (≥ 22.5), install `npm install` (postinstall builds; don't build twice), start `npm start` (entry dist-server/server/index.js).
3. Environment variables: NODE_ENV=production, PORT only if hPanel requires it, ADMIN_PASSWORD_HASH and SESSION_SECRET (from Prompt 1), DB_PATH=/home/<user>/nexexpresslogistics-data/nexexpresslogistics.db and UPLOADS_DIR=/home/<user>/nexexpresslogistics-data/uploads (a folder OUTSIDE the deploy directory; create it first), SEED_DEMO_DATA unset. The database starts empty.
4. Domain: karimashippingenterprisesinc.com on this app, www redirecting to the root (one host, so the admin session cookie works), SSL on both, force HTTPS; DNS records if the domain is registered elsewhere.
5. Smoke test on the live domain (DEPLOYMENT §7): new logo, name and tab icon; the share preview uses karimashippingenterprisesinc.com and the OG image loads; https://karimashippingenterprisesinc.com/admin/ shows the login and works with the new password; /admin redirects to /admin/; /#/admin shows Home; /admins shows the 404 page; robots.txt and sitemap.xml use karimashippingenterprisesinc.com and don't mention the admin path; log in, then open /api/diag/storage and confirm the data folder; create → track a NEL shipment; redeploy once and confirm the shipment is still there; response headers show compression and the /assets cache rule.
6. Email: create the info@nexexpresslogistics.com mailbox and add SPF/DKIM/DMARC.
STOP and wait for my results, then tick the launch tasks in the tracker and commit "docs: NEX Express Logistics live".
```

---

## Utility prompts

### Prompt R: Resume in a new chat
```
Resume the NEX Express Logistics launch. Read CLAUDE.md, PROMPTS.md and docs/PROJECT_TRACKER.md, run `git status`, `git branch` and `git log --oneline -10`, then tell me which prompt we're on and what's next. Don't change anything until I confirm.
```

### Prompt F: Fix something that broke
```
Something broke: [what you see, which page/URL, steps, any error message].
Find the root cause (check the latest commits first) and explain it before fixing. Apply the smallest fix that doesn't change design or unrelated behaviour. Confirm `npm run build` and `npm test` pass and that admin login at /admin/ → create → track (NEL ID) still works, then commit "fix: …".
```

### Prompt O: Owner contact details arrived
```
Here are NEX Express Logistics's contact details: [phone / WhatsApp / HQ address / social links].
Add them to src/config/brand.ts (and the JSON-LD in index.html), confirm the UI that was hidden now shows them correctly on the Header, Footer, Contact and documents, update the values table in PROMPTS.md and the tracker, build, and commit "content: add NEX Express Logistics contact details".
```
