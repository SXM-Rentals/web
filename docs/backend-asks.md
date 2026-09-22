# What the website needs from the API

Written while connecting `sxm-rentals-web` to
`https://sxm-rentals-api.onrender.com/api/v1`. Every item below is something
the website currently works around. None of them block it — it runs today —
but each workaround is either slow, fragile, or a number that can drift out of
agreement with the backend's own.

They are in the order they cost the most.

---

## 1. Put a car summary on bookings and message threads

**Today:** a booking says `vehicleId`. A message thread says `vehicleId`. To
draw either — a booking card, a conversation header — the site needs the car's
make, model, year and photo.

**So it fetches the whole catalogue and looks each one up.** With sample data
that lookup was instant and free. Over HTTP it means a second request before a
list can be drawn, and it gets worse as the catalogue grows, because the cost
is the size of the catalogue and not the length of the list.

**The fix:** embed what the row actually needs.

```jsonc
{
  "id": "b_123",
  "vehicleId": "v_7",
  "vehicle": { "id": "v_7", "make": "Kia", "model": "Rio", "year": 2023, "photo": "https://…" },
  // …
}
```

Five fields. `vehicleId` stays, so nothing that reads it breaks.

Applies to `GET /bookings`, `GET /bookings/:id`, `GET /messages/threads` and
`GET /messages/threads/:id`.

**Why this one is first:** it is the only item here that affects how fast the
site feels, and it affects thirteen screens.

---

## 2. A way to ask for one business's cars

**Today:** there is no `providerId` filter on `GET /vehicles`, and no
`GET /providers/:id/vehicles`.

A business's public page lists its cars. With no way to ask for them, the site
fetches every car on the platform and filters in the browser.

That is survivable at the current size and will not be at ten times it —
especially against the 300-request rate limit, since it happens on every visit
to every business page.

**The fix:** either

- `GET /vehicles?providerId=p_1`, or
- `GET /providers/:id/vehicles`

Either is fine. The site has this narrowing in one named function
(`listProviderVehicles` in `lib/api-client.ts`), so it is one line to change.

---

## 3. Report the money on `/providers/me/summary`

**Today:** the summary returns `pending` — what will land in the business's
account. Just the net.

The business dashboard has to show all three figures together: what the
customer paid, what was deducted, and what the business receives. That is a
product rule, and the reason for it is that a business shown only the net has
no way to check the deduction was right.

**So the site works the other two backwards** from a copy of the commission
rate it keeps in `lib/constants.ts`. That copy is the problem. The backend is
what actually divides the money. The day the two disagree, the dashboard shows
a business a commission it was not charged, and nothing looks broken.

**The fix, best first:**

1. **Return the figures.** Add `pendingGross` and `pendingCommission` beside
   `pending`, the same three numbers every individual payout already carries.
   This removes the arithmetic entirely.
2. **Or return the rate**, as `commissionRate`. Better than a hardcoded copy,
   but the site is still doing the division.

Individual payouts already do this correctly — `grossAmount`, `commission`,
`amount`. This is asking the summary to match them.

---

## 4. Confirm the session cookie is host-only

**A five-minute check that decides whether sign-in works at all.**

The site reaches the API through a same-origin rewrite, so the browser sees
every request as going to the website's own address. That is what lets an
httpOnly session cookie survive, and the rewrite is not optional — the API
sends no `Access-Control-Allow-Origin` header and answers `OPTIONS` with a 404,
so a direct browser request cannot work.

For that to hold, the cookie `Set-Cookie` sends on login must be **host-only**
— no `Domain` attribute at all.

If it is set to `Domain=.onrender.com`, the browser will not store it against
the website's address, and no amount of proxying fixes that. Sign-in, and
every signed-in screen, would be blocked until it changes.

Please confirm by checking the raw `Set-Cookie` header on a successful
`POST /auth/login`.

---

## 5. A seed script

`GET /vehicles` and `GET /providers` both return `[]` today, under every
filter. The database is empty.

Getting anything into it by hand means signing up, confirming by email,
applying as a business, creating an admin, and approving both the business and
each listing.

A script that inserts a handful of approved businesses with a few cars each
would make the live API demonstrable, and would let this site be checked
against it rather than against its own sample data.

---

## Smaller notes

- **`limit` and `offset` on `GET /vehicles` are accepted and ignored** — the
  whole catalogue comes back regardless. Worth either honouring them or
  rejecting them, because silently ignoring a paging parameter is the kind of
  thing that gets discovered at the wrong size.
- **Rate limit: 300 per window.** Noted, not a complaint. It is the reason
  items 1 and 2 matter. Nothing on this side has been loosened to get around
  it.
- **`Cache-Control: no-store` on every response.** Kept, not a complaint — but
  worth saying that the website does cache catalogue reads for five minutes
  anyway, by asking its own framework to override that header. Booking and
  signed-in reads are never cached. So if a car's price changes, the public
  pages can be up to five minutes behind; the price at the point of paying is
  always live. Mentioned so nobody is surprised by either.

---

## Not asks — things that are right and worth keeping

Said out loud because they made this work much easier than it would otherwise
have been:

- **The error envelope.** `{ error: { code, message, requestId, details? } }`,
  with a message already written for a person to read. The site shows those
  sentences word for word rather than guessing at its own.
- **`unauthorized` and `invalid_credentials` as distinct codes**, even though
  both are 401. Telling them apart is what stops a mistyped password signing
  somebody out of the site.
- **`details` as `[{ field, message }]`** on `invalid_input`, which maps
  straight onto a form.
- **`requestId` on every failure**, which is what makes a bug report traceable.
