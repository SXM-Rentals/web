# What the website needs from the API

Written while connecting `sxm-rentals-web` to
`https://sxm-rentals-api.onrender.com/api/v1`, and updated after reading the
backend's own code on 2026-09-21, 2026-09-22 and 2026-09-27.

The first item was the one that blocked going live. It is built now, and
waits only on its settings. Everything after it is something the website works
around. Those workarounds run today, but each is either slow, fragile, or a
number that can drift out of agreement with the backend's own. They are in
the order they cost the most.

---

## ~~Blocking: send real emails~~ — built, waiting on its settings

**Built** (backend `61ec5eb`, pushed 2026-09-27): a Resend sender, used as soon
as `RESEND_API_KEY` is set on Render. Until then every email is dropped, and
sign-up cannot be finished — the link never comes, signing in is refused with
`email_not_verified`, and signing up again says the address is taken.

What is left is settings, not code: `RESEND_API_KEY` on Render, the domain's
DNS records verified in Resend, and `APP_URL=https://www.sxmrentals.app`.
**Until a real email has arrived at a real inbox, treat sign-up on the live
site as unproven.**

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

## 4. ~~Confirm the session cookie is host-only~~ — answered: it is

Closed on 2026-09-21 by reading the backend's code rather than waiting on a
login. `src/routes/auth/index.ts` sets the cookie with no `Domain`, and in
production it is named `__Host-sxm_session` — a prefix browsers accept only on
a cookie that is host-only, Secure and on path `/`. So a cookie set through the
website's proxy belongs to the website's own address, which is exactly what
sign-in needs.

**A correction to what this ask used to say.** It claimed the API sends no
`Access-Control-Allow-Origin` header. It does — for the addresses listed in its
`CORS_ORIGINS`, which includes `https://www.sxmrentals.app`. The first check
used an address that was not on the list. The proxy is still needed, but only
for the cookie: see the note in `next.config.mjs`.

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

## 6. Accept accident history and a delivery fee on a car

**Today:** `POST` and `PATCH /providers/me/vehicles` accept neither. A public
car already *returns* `accidentHistory`, but nothing can set it, so every car
has an empty one.

Accident history is the one that matters. An empty list that only means "could
not be recorded" reads to a customer as "no accidents" — and the car page used
to say exactly that, with a green tick. It now says accident history is not
recorded on SXM Rentals yet and suggests asking the business; the car form no
longer asks for either field, and says why. When this exists, both come back.

---

## 7. Record that the rental agreement was signed

A booking returns `agreementSigned`, and the booking flow has a step where the
customer signs. Nothing on the backend sets it, so that step says the signature
is not recorded yet.

---

## 8. ~~Photo upload for cars~~ — built, waiting on its settings

**Built** (backend `131c427`, pushed 2026-09-27), and the website uses it. A
photo goes from the browser straight to Cloudinary with a ticket the backend
signs, and the backend is then told the address — it never passes through the
API. The website shrinks each photo to at most 2000 pixels and redraws it as a
JPEG first, which also leaves behind the location the phone wrote into it.
Photos show in search, on the car's page (with its search-engine and sharing
picture), in the fleet and on bookings.

What is left is settings: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` on Render. Until all three are set, asking for a ticket
answers `uploads_unavailable`, and the website says photo uploads are not
switched on yet — the car itself is still saved.

---

## 9. Refunds when a booking is cancelled

Cancelling sets the booking to `cancelled` and releases the deposit hold —
and that is all. No refund is worked out or recorded, so nothing reaches the
refunds queue in the admin panel either. While payments are off that costs
nothing, because nothing was charged. The day payments go on, a customer who
cancels is owed a refund that nothing creates.

The website's cancel page used to invent a refund in the browser. It no
longer does; it points to the Cancellation and Refund Policy instead. When
the backend can work the amount out, the page should show it before the
customer confirms.

---

## 10. Keep "never taken" apart from "released" on a cancelled deposit

Cancelling marks the deposit `released` whether or not a hold was ever
placed. The two mean different things to a customer — "the hold on your card
has been lifted" against "nothing was ever held" — and after a cancellation
the website cannot tell which, so it now says something true of both. Leaving
a never-taken deposit as `not_taken` would let it say which.

---

## 11. Let a business write first about a booking

**Today:** only a customer can start a conversation. `/providers/me/messages`
lets a business reply, and nothing else. A booking seen by the business never
carries a `threadId` either — `toProviderBooking` has a place for one, and
neither caller passes it.

So a business with a booking tomorrow has no way to say "we are at the Simpson
Bay office" until the renter writes. The website looks for a conversation with
the booking's reference and, when there is none, tells the business it has to
wait.

**The fix:** `POST /providers/me/bookings/:id/messages` (starting or continuing
the booking's conversation), and `threadId` on provider bookings.

---

## 12. Move a car's side and map position with its town

**Today:** `PATCH /providers/me/vehicles/:id` changes `pickupTown` but not
`side`, `latitude` or `longitude`. A car moved from Simpson Bay to Marigot would
say Marigot, sit on the map in Simpson Bay, and come up under the Dutch side in
search.

The website does not offer the change: when editing, the town is shown, not
editable, and so are make, model, year, class, gearbox and fuel, which the
PATCH ignores. **The fix:** accept `side`, `latitude` and `longitude` with
`pickupTown`, or refuse `pickupTown` on its own.

---

## 13. Make the dashboard's enquiry and revenue figures mean what they say

Three numbers, each counting something slightly different from its name:

- `totalConversions` and a car's `conversions` are **every booking** in the
  window, not bookings that came from an enquiry. Most bookings never start
  with a conversation, so "conversions ÷ enquiries" came out at 300%.
- `totalInquiries` counts conversations **ever**; the bookings beside it count
  **90 days**.
- A car's `revenue` includes bookings **still to come** — and, while payments
  are off, bookings nobody has paid for.

The website now shows the counts side by side, with no rate, and labels the
revenue "your share" of bookings in the last 90 days and coming up. **The fix:**
either track which booking followed which enquiry, or rename the fields; and
separate earned revenue from booked. (The comment on `totalInquiries` also
still says messaging is not built.)

---

## 14. Zero a cancelled booking's payout for the business

**Today:** a cancelled booking keeps its `grossAmount`, `commission` and
`netAmount` in `/providers/me/bookings`. Shown as they come, the business
would read "you receive $210" for money that is never coming. The website
shows no amount for a cancelled booking; the backend saying 0 would make that
unnecessary — and would be right for anything else that reads these figures.

---

## 15. Keep new businesses out of the public list until they are checked

**Today:** `POST /providers/apply` puts the business straight into
`GET /providers`, which filters on nothing but deletion. Anybody who signs up
and applies appears in the public list of rental businesses that same minute,
before staff have looked at it. Worth filtering the public list to
`isVerified`, or at least to businesses with an approved car.

---

## 16. Closing an account or a business — built, three follow-ups

**Built** (backend `6323724`, pushed 2026-09-27), and the website uses both:
`POST /customers/me/close` (with the password) and `POST /providers/me/close`.
Checked end to end against the backend's own code on 2026-09-27.

**A closed business is still a business to `/providers/me`.** Closing sets the
business's `deletedAt` and suspends its cars, but its owner stays a member, and
`requireProviderFor` does not look at `deletedAt`. So after closing,
`GET /providers/me` still returns the business, and every `/providers/me/*`
route still works — including `POST /providers/me/vehicles`, which lets a
closed business list new cars, straight into the approval queue. The website
works around it: a business whose public page answers "not found" is taken as
closed, and its owner sees "Your business is closed" instead of a dashboard.
And because the membership stays, `POST /providers/apply` answers
`already_a_provider` for good: the owner can never open a business again. The
website says to email instead. **The fix:** refuse a closed business in
`requireProviderFor` (`not_a_provider`, or a new `business_closed`), and decide
whether its owner may register again.

**Closing a business takes no password.** Closing an account asks for it
again, which is right: a session left open on a borrowed computer should not be
enough to end something for good. Closing a business delists every car and
takes the business page down, and needs only a session. The website asks for
the business's name to be typed out, which guards against a slip, not against
somebody else at the keyboard. Worth taking `{ password }` here too — the
website would send it the moment the backend asks.

**A closed account keeps the person's details, and their email stays taken.**
Closing marks the customer row closed and ends every session, which is right
for sign-in. But the name, email and phone stay on the row, and
`customers_email_unique` is not limited to open accounts — so the same person
can never sign up again with that address (sign-up quietly sends "you already
have an account" instead). And Apple (guideline 5.1.1(v)) and Google Play both
expect deleting an account to remove the personal data that is not needed for
legal or financial records, which matters once the phone app offers closing.
**The fix:** on closing, erase or anonymise what bookings and payouts do not
need — the phone, the name down to what receipts require, and the email
replaced so the address is free again.

---

## Smaller notes

- **A weekly rate cannot be removed once set.** `PATCH` treats a missing
  `weeklyRate` as "no change" and rejects 0, so there is no way to take one
  away. The form says so rather than appearing to clear it. Accepting `null`
  would fix it.
- **The business record leaves out the contact details.** `GET /providers/me`
  does not return `contactEmail`, `ownerName` or `ownerPhone`, so the profile
  page cannot show them or offer to change them, although `PATCH` accepts all
  three.
- ~~**Emails link to `/sign-in`; the website's page is `/login`.**~~ Answered:
  they link to `/login` since backend `4db77bf`. The website still redirects
  `/sign-in`, for links already in people's inboxes.

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
