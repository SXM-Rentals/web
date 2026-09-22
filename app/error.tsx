'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: What somebody sees when a page fails to build. It says
// what happened in plain words and offers to try again.
//
// ---- WHY THIS FILE HAD TO EXIST BEFORE THE BACKEND WAS CONNECTED ----
//
// While every page read from sample data, nothing could fail: the data was
// already in the browser. Now a page can fail for reasons nobody can prevent —
// the server asleep, a connection dropped mid-request.
//
// Without this file, Next.js answers those with a blank white screen. No
// message, no way back, nothing to tell somebody whether to wait or leave.
// That is the worst outcome available, and it is the default.
//
// ---- THE THING THIS IS PROTECTING, WHICH IS NOT OBVIOUS ----
//
// The other way to handle a failing page is to show "not found". It looks
// tidier and it is much worse: a 404 tells a search engine the page is gone
// for good, and it drops it from the index. One sleepy server on the morning a
// crawler visits, and real cars quietly disappear from Google with nothing in
// the app looking wrong.
//
// So only a car the backend has actually said does not exist gets a 404.
// Everything else lands here, which reports an honest, temporary failure and
// leaves the page in the index. See lib/api-client.ts.
//
// NOTE: a failure in app/layout.tsx itself does not reach this file — a
// layout wraps it, so a broken layout takes this down too. That is what
// global-error.tsx beside this file is for.

import React, { useEffect } from 'react';
import { ErrorState } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Kept in the developer console rather than shown on screen. Once there is
    // somewhere to report to, this is where it goes — a fault nobody hears
    // about is a fault nobody fixes.
    console.error('SXM Rentals — a page failed to load:', error, error.digest);
  }, [error]);

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-5xl)' }}>
      <ErrorState
        title={t('error.pageTitle')}
        // ---- WHY THIS IS THE GENERAL SENTENCE AND NOT THE BACKEND'S ----
        //
        // Everywhere else in the app the backend's own wording is shown,
        // because it knows what actually failed. Not here, and not by choice:
        // Next.js deliberately strips the message off any error thrown while
        // building a page on the server before it reaches the browser, and
        // replaces it with a reference code. That is the right call on their
        // part — a server error can carry a query, a path, a stack — but it
        // means the specific sentence genuinely is not available at this
        // point, and pretending otherwise would just print an empty message.
        //
        // The detail is in the server log, findable by the reference below.
        message={t('error.pageMessage')}
        onRetry={reset}
      />

      {/* Shown rather than hidden. It is the one thing that connects what
          somebody saw to the line in the log that explains it. */}
      {error.digest ? (
        <p
          className="t-small tone-ink3"
          style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}
        >
          {`Reference: ${error.digest}`}
        </p>
      ) : null}
    </div>
  );
}
