// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Draws the picture that appears when a link to this site
// is pasted into WhatsApp, a message, Facebook or Slack. Without one, a shared
// link shows a bare grey box, which reads as an unfinished or untrustworthy
// site — exactly the wrong impression for a business asking for a card number.
//
// IT IS DRAWN RATHER THAN DESIGNED. There is no image file: this describes the
// picture in the same layout language the rest of the site uses, and Next.js
// renders it to a PNG when it is asked for. That means no designer is needed to
// change it and no image can fall out of step with the site's wording.
//
// THE SIZE IS NOT ARBITRARY. 1200×630 is what every messaging app crops to; any
// other shape gets cut somewhere unhelpful, usually through the middle of the
// words.
//
// NOTE ON THE STYLES: this is not a normal page. It is rendered by an image
// engine that understands only a small part of CSS — flexbox, colours, borders,
// simple text — so everything here is written plainly and inline. CSS variables,
// our stylesheets and the site's font are not available to it, which is why the
// colours are written out as literal values rather than tokens.

import { ImageResponse } from 'next/og';

export const alt = 'SXM Rentals — rent a car anywhere on Sint Maarten';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          // The same near-black the site uses as its primary colour in light
          // mode. Written out because tokens do not reach this renderer.
          background: '#232B2E',
          color: '#FFFFFF',
          padding: 72,
        }}
      >
        {/* ---- THE NAME ---- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: '#FFFFFF',
              color: '#232B2E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            SX
          </div>
          <div style={{ fontSize: 34, letterSpacing: -0.5 }}>SXM Rentals</div>
        </div>

        {/* ---- WHAT THE SITE IS FOR ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 940 }}>
            Rent a car anywhere on Sint Maarten
          </div>
          <div style={{ fontSize: 32, color: '#B9C1C6', maxWidth: 900, lineHeight: 1.35 }}>
            Both sides of the island. Verified rental businesses. Deposits held, not charged.
          </div>
        </div>

        {/* ---- THE THREE THINGS THAT SET IT APART ---- */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['Dutch & French side', 'SXM Verified', 'No account needed to look'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '12px 22px',
                borderRadius: 999,
                border: '1px solid #3C4649',
                color: '#E4E8EA',
                fontSize: 24,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
