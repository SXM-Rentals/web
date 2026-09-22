'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Nudges the backend awake the moment a page opens, so
// that the first thing somebody actually waits for is not the thing that has
// to wake it.
//
// It draws nothing. It is mounted once in app/layout.tsx and never again.
//
// ---- WHY THIS IS WORTH A FILE ----
//
// The backend is on a free plan and stops after about fifteen minutes of
// quiet. The first request after that pays the whole start-up cost —
// thirteen seconds, measured, and it can be up to a minute.
//
// Somebody arriving on the homepage reads it for a few seconds before they
// search for anything. Spending those seconds waking the server means the
// search that follows is fast. Without this, the wait lands on the first thing
// they deliberately asked for, which is the worst possible place to put it.
//
// IT CANNOT FAIL IN A WAY THAT MATTERS. Nothing waits for it and nothing reads
// its answer; a rejection is swallowed on purpose. An optimisation that can
// break a page is not an optimisation.

import { useEffect } from 'react';
import { warmUp } from '@/lib/api/http';

export function WarmUp() {
  useEffect(() => {
    // Mounted in the root layout, which survives moving between pages, so this
    // runs once per visit rather than once per page.
    warmUp();
  }, []);

  return null;
}

export default WarmUp;
