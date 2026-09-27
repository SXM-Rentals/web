<!-- SXM Rentals — Created by Giordano Bertin-Maurice
     Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
     WHAT THIS FILE DOES: The starting point for anybody opening this folder for
     the first time. How to run it, what is in it, what is deliberately not
     finished, and the three product rules that must not be broken. -->

# SXM Rentals — Web

The customer website and the rental business dashboard for SXM Rentals, covering
both sides of Sint Maarten / Saint-Martin.

It runs on the SXM Rentals API (`sxm-rentals-backend`), at
**https://www.sxmrentals.app**. Every screen reads real accounts, cars, bookings,
messages and payouts; there is no sample data left. The doorway to the backend
is `lib/api-client.ts`, one file wide on purpose, and what the backend cannot do
yet is written up in `docs/backend-asks.md`.

---

## Running it

```bash
npm install
cp .env.example .env.local   # then fill it in — every setting is explained there
npm run dev -- -p 3001       # http://localhost:3001
```

Port 3001 because the backend, run locally, takes 3000, and 3001 is one of the
addresses its example settings (`CORS_ORIGINS`) accept requests from. Point `API_URL` in
`.env.local` at it (`http://localhost:3000`) to work without touching the live
database, or at `https://sxm-rentals-api.onrender.com` to read the live one.

| Command | What it does |
|---|---|
| `npm run dev` | The site, with changes picked up as you save |
| `npm run build` | The production build. Fails on a type error, by design |
| `npm start` | Serves what `build` produced |
| `npm run typecheck` | Types only, no build |
| `npm test` | The test suite, once |
| `npm run test:watch` | The test suite, re-running as files change |
| `npm run test:coverage` | The suite plus a coverage report in `coverage/` |

Node 20 or newer. Vercel deploys the site from GitHub, so **a push is a deploy**.

---

## The three product rules

These are not style preferences. Breaking one is a product bug, and each has a
test standing over it in `tests/rules/`.

**1. A security deposit is never revenue.** It is held on a card and given back.
It is never added into what the customer is charged, never commissioned, and
never part of what a business is paid. `components/booking/PriceBreakdown.tsx`
computes the total from the price lines alone and shows the deposit below it, in
its own box, saying plainly that it is not included.

**2. A rental business never sees a customer's phone number or email.** This is
enforced in the shapes themselves — `ProviderBooking` and `BusinessChatThread` in
`types/index.ts` have no field to put one in, so no page on the business side can
display one. They get a display name and whether the person has been verified,
which is what is actually needed to hand over a car. **Do not add contact fields
to those types.**

**3. Every figure shown to a business is their own share.** Gross, commission and
net appear together, always, because a business that cannot see the deduction
cannot check it.

---

## How the folders are arranged

```
app/                  every page, and the frames around them
  (site)/             the customer side — homepage, search, cars, account
  (auth)/             signing in and the identity checks. No chrome
  provider/           the rental business dashboard. Its own sidebar
    profile/          what CUSTOMERS see about the business
    settings/         how the DASHBOARD behaves for whoever is looking at it
  sitemap.ts          /sitemap.xml, generated from the data
  robots.ts           /robots.txt
  opengraph-image.jpg the picture shown when a link is shared (twitter-image.jpg for X)
components/
  ui/                 the shared building blocks. One barrel: components/ui
  layout/             top bar, sidebars, footer, the floating share button
  vehicle/  booking/  business/   the parts specific to each area
  seo/                the machine-readable page descriptions
lib/
  api-client.ts       the one doorway to the backend
  content/            fixed text — the policy documents, the island's towns
  i18n/copy/          the four languages, one file per subject
  theme/              light and dark
  seo.ts              addresses, canonical links, structured descriptions
  format.ts           money, dates, Title Case
types/index.ts        every data shape. Shared with the phone app
tests/                see below
```

Folder names in brackets group pages under a shared frame **without appearing in
any address** — the homepage is `/`, not `/site`.

---

## Styling

CSS custom properties plus CSS Modules. No Tailwind, no component library.

`app/globals.css` is the rulebook: every colour, spacing step, radius and text
size lives there as a variable, in a light set and a dark set. A component's
`.module.css` reads those variables and never writes a raw colour.

**The one trap to know about.** Two single-class selectors setting the same
property have identical specificity, so whichever stylesheet loaded last silently
wins. `.photo { width: 100% }` in one file and `.rentalPhoto { width: 150px }` in
another do not fight — one just loses, invisibly, and the page looks broken with
nothing obviously wrong in either file. If something is the wrong size and the
CSS looks right, this is why. It has caused three bugs so far.

**The font is Hammersmith One**, loaded through `next/font` and self-hosted at
build time — no request ever goes to Google. It ships a single weight, so bold
text is thickened by the browser rather than being a real bold face. To go back
to the system font, change one line: `--font-heading-stack` in `app/globals.css`.

---

## The four languages

English, Dutch, French and Spanish — the island's two official languages plus the
one most widely spoken alongside them, and English on top.

**Where the words live:** `lib/i18n/copy/`, one file per subject — the
navigation, a car's page, the booking flow, the provider dashboard. Each phrase
carries **all four languages together**:

```ts
'vehicle.deposit': {
  en: 'Security Deposit',
  nl: 'Borgsom',
  fr: 'Caution',
  es: 'Fianza',
},
```

That shape is the point. The four languages used to live in four parallel files,
where a phrase could exist in English and simply not in Dutch and nothing
anywhere would say so — half the Dutch was missing for months that way. Side by
side, a gap is visible, and the type in `copy/types.ts` requires all four, so the
build stops rather than the gap going unnoticed.

**Around 960 phrases, ~3,800 translations.** The navigation, the homepage,
search, a car's page, the booking flow, the account area, the sign-in and
identity pages and the provider dashboard all change language.

### Three things to know before editing

**Phrases are stored in the case they should appear in.** Do not run
`titleCase()` over a translated phrase — its rules are English, and applying them
to French turns "Détail du prix" into "Détail Du Prix". Anything drawn from the
dictionary is passed with `raw` so the automatic casing is switched off.

**A page built on the server cannot call `t()`.** Reading the chosen language
means reading the browser's stored setting, and there is no browser on the
server. Those pages use `<T k="…" />` (see `components/i18n/T.tsx`) or pass a key
to `PageHeader` via `titleKey` / `subtitleKey`. The page stays server-rendered,
keeps its metadata, and still produces complete HTML for a crawler.

**The nineteen policy documents are deliberately English.** A translated
agreement is a second agreement, and if the two ever disagree there is no way to
know which one a customer accepted. That is legal exposure, not untidiness. The
page says so in the reader's own language. Translating them is a lawyer's job,
done alongside the final drafts. The reasoning is written out at the top of
`lib/i18n/copy/legal.ts`.

### What is still English

- **Listings** — a car's description, a review, a business's own blurb. That is
  content, written by whoever owns it, not interface text.
- **Roughly 270 phrases** in the longer forms and less-visited corners: the
  vehicle form a business fills in, parts of the fleet import and API pages, and
  a handful of module-level config arrays. `npm test` will not catch these;
  switching to Dutch and reading the page will.
- **The translations want a native speaker** before launch — especially the
  deposit, cancellation and identity wording, where an awkward translation stops
  being awkward and starts misstating what somebody is agreeing to.

### What this does not give you

Search results in Dutch. The language is chosen in the browser, so a crawler
always sees the English — which is correct, because that matches each page's
canonical address. Ranking in Dutch needs a separate address per language
(`/nl/`, `/fr/`) with `hreflang` tags, which is a larger piece of work and has
not been done.

## Being found

Most of the reason this website exists alongside the phone app is that an app
cannot appear in a search result.

- `lib/seo.ts` — where the site lives, canonical addresses, and the structured
  descriptions that put a price and a star rating into a search result
- `app/sitemap.ts` — generated from the same data the pages are built from, so it
  cannot drift. The account area, the booking flow and the sign-in pages are
  deliberately left out
- `app/robots.ts` — asks search engines to skip the same pages. **This is not a
  security measure**; the sign-in check on each page is what protects it
- `app/opengraph-image.jpg` and `app/twitter-image.jpg` — the picture shown when
  a link is shared, with its description beside each in a `.alt.txt` file.
  1200×630 and kept small (about 60 KB), because WhatsApp can leave out a preview
  image that is too large. To change it, replace both files with the same
  picture at that size; Next.js writes the page tags from them

**`NEXT_PUBLIC_SITE_URL` is set in Vercel to `https://www.sxmrentals.app`.**
Every canonical address, the sitemap and every shared link are built from it.
Change it there if the address ever changes.

---

## The tests

Vitest, with a stand-in browser so a component can be rendered and clicked in the
terminal in about a second.

```
tests/rules/          the three product rules above
tests/lib/            money, dates, the languages, the SEO plumbing, and each
                      area's screens against a stand-in backend
tests/components/     the share button, and the navigation in four languages
tests/fixtures/       a few cars, businesses and bookings, shaped as the backend
                      sends them
```

The suite is not trying to cover every line. It stands over the things whose
mistakes are **silent** — a deposit quietly folded into a total, a private page
listed in the sitemap, a price advertised to a search engine that no longer
matches the page, a nav row that renders empty in Dutch. Anything that would show
up the moment you opened the page is left to the page.

---

## Known gaps

Deliberate, and worth knowing before hunting for them:

- **Card payments are not connected.** Nothing is charged online and no deposit
  is held; the booking flow says so, and says the rental is settled with the
  business at collection
- **Identity checks, rewards, logo and photo upload, the spreadsheet import and
  connecting a business's own system** have no backend yet. Each says so on its
  screen. `docs/backend-asks.md` has the full list
- **`/welcome` and `/onboarding` are not built.** The homepage is the front door
  on the web; a phone app's opening carousel has no equivalent here
- **`/provider/payout` folded into `/provider/settings`** — one page for how a
  business gets paid, rather than two
- **No map view.** The phone app shows a placeholder too
- **When payments are connected,** card details go through Stripe Elements, never
  inputs of our own — and the deposit and payment wording across the booking
  flow changes with them (the rule 1 test will insist)
- **The translations want a native speaker** before launch, particularly the
  deposit, verification and legal wording

---

## A note on the file headers

Every file in this project opens with three lines: who wrote it, the copyright,
and a plain-language description of what the file actually does — written so
somebody who is not a developer can read it.

That third line is the point. It says why the file exists and, where a file
enforces a product rule or fixes a specific bug, what would break if somebody
changed it. Keep it when you edit a file; rewrite it when the file's job changes.

**The attribution belongs in the source and nowhere else.** It must never appear
in the interface — not in the footer, not in a page title, not in an image
description, not in any wording a visitor can read.
