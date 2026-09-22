'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The last resort. What somebody sees when the failure is
// in app/layout.tsx itself, so even the error page beside this one cannot be
// drawn.
//
// ---- WHY IT LOOKS NOTHING LIKE THE REST OF THE SITE ----
//
// It replaces the whole document, which is why it has its own <html> and
// <body>. At the point this runs, the layout is what broke — so the theme, the
// language and the fonts all come from it and none of them can be trusted.
// Every style here is written inline for that reason, and the words are in
// English because the thing that decides the language is exactly the thing
// that has failed.
//
// It should never appear. If it does, something is wrong that a retry will
// probably not fix, so the honest thing is to say so and offer the homepage
// rather than a spinner.

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#FFFFFF',
          color: '#0D0F11',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <main style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, lineHeight: '30px', margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 15, lineHeight: '23px', margin: '0 0 24px', color: '#5A6469' }}>
            SXM Rentals could not load. Reloading usually fixes it. If it keeps
            happening, please let us know.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 44,
                padding: '0 20px',
                borderRadius: 999,
                border: 'none',
                background: '#232B2E',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                minHeight: 44,
                padding: '0 20px',
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 999,
                border: '1px solid #D7DCDF',
                color: '#0D0F11',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Go to the homepage
            </a>
          </div>

          {/* Shown, not hidden. It is the one thing that makes a report
              traceable, and it means nothing to anybody who does not need it. */}
          {error.digest ? (
            <p style={{ fontSize: 12, color: '#8A9499', marginTop: 24 }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
