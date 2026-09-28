'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Finds out whether the signed-in person runs a rental
// business on SXM Rentals, and holds that business's record — the private half
// the dashboard needs, and the public half customers see.
//
// WHY THE SITE HAS TWO SIDES: renting a car and running a rental company are
// completely different jobs, needing different pages and different navigation.
// Rather than cramming both into one menu, the site keeps them apart, the way
// Airbnb separates travelling from hosting.
//
// HOW THIS DIFFERS FROM THE PHONE APP: on the phone, switching sides swaps the
// whole bottom bar, so the app has to remember which mode it is in. On the web
// the two sides are simply different addresses — the customer site lives at /
// and the business dashboard at /provider, each with its own navigation. The
// address bar already says which side you are on, so there is no mode to track.
//
// ---- WHERE THE ANSWER COMES FROM ----
//
// The backend. It used to be a fixed "yes" here, which put a made-up business
// and its made-up payouts in front of everybody who signed in. Now the site
// asks for the signed-in person's business, and the backend either returns it
// or answers `not_a_provider` — the one answer that means "no business".
//
// Anything else — the backend asleep, the connection down — is "could not
// tell", not "no business". Same rule, same reason, as lib/auth.tsx: telling a
// business owner they have no business because a server was waking up would
// send them to register it a second time.
//
// A business that has applied but not yet been approved still HAS a business.
// The backend lets it into the dashboard straight away to add its cars; what
// waits for approval is each car appearing in search.
//
// ---- A CLOSED BUSINESS ----
//
// Closing a business takes its public page down and its cars off. But the
// backend still hands its owner the private record, exactly as if it were
// open — checked against the backend itself, 2026-09-27. So a business whose
// public page answers "there is no such business" is taken as closed: no
// dashboard, and no registration form either, since the backend would refuse
// a second business on the same account. (Asked of the backend in
// docs/backend-asks.md, ask 16. When it answers `not_a_provider` for a closed
// business instead, this still reads correctly: that is "no business".)

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { useSession } from '@/lib/auth';
import type { BusinessProfile, Provider } from '@/types';

type BusinessValue = {
  /** Whether the signed-in person runs a business here, approved or not yet. */
  hasBusiness: boolean;
  /** Whether the business they ran has been closed. See the top of the file. */
  closed: boolean;
  /** True until the answer is known. Nothing is decided while it is. */
  loading: boolean;
  /** Set when we could not find out. Not the same as "no business". */
  error: string | null;
  /** Asks again — after `error`, or after registering a business. */
  refresh: () => void;
  /**
   * Puts the record the backend handed back after an edit in place. Unlike
   * refresh, this does not blank the dashboard while it asks again — which
   * would throw away the page the edit was made on.
   */
  applyChanges: (profile: BusinessProfile) => void;

  // The public half of the record — name, rating, description.
  provider: Provider | undefined;
  // The private half — registration, locations, API connection.
  profile: BusinessProfile | undefined;
};

const BusinessContext = createContext<BusinessValue | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<BusinessProfile | undefined>(undefined);
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [closed, setClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Asked again whenever a different person signs in, or nobody is.
  const userId = user?.id ?? null;

  useEffect(() => {
    if (sessionLoading) return; // not known yet who to ask about

    setProfile(undefined);
    setProvider(undefined);
    setClosed(false);
    setError(null);

    // Nobody signed in: no business, and nothing to ask.
    if (!userId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const mine = await apiClient.getBusinessProfile(controller.signal);
        // The public half. Failing to get it costs the name in the
        // dashboard's header, not the dashboard, so a failure is not fatal.
        // But "there is no such business" is an answer, not a failure: it
        // means the business was closed (see the top of the file).
        let publicRecord: Provider | undefined;
        let isClosed = false;
        try {
          publicRecord = await apiClient.getProvider(mine.providerId, { signal: controller.signal });
          isClosed = publicRecord === undefined;
        } catch {
          publicRecord = undefined;
        }
        // Somebody else signed in, or out, while this was on its way. Their
        // answer is not this person's.
        if (controller.signal.aborted) return;
        setProfile(mine);
        setProvider(publicRecord);
        setClosed(isClosed);
      } catch (caught) {
        if (controller.signal.aborted || (isApiError(caught) && caught.code === 'aborted')) return;
        if (!(isApiError(caught) && caught.code === 'not_a_provider')) {
          setError(isApiError(caught) ? caught.message : 'We could not check for a business. Please try again.');
        }
        // `not_a_provider` needs nothing: no profile is the answer.
      }
      setLoading(false);
    })();

    return () => controller.abort();
  }, [userId, sessionLoading, attempt]);

  const refresh = useCallback(() => setAttempt((n) => n + 1), []);

  const applyChanges = useCallback((next: BusinessProfile) => {
    setProfile(next);
    // The public half changes with an edit too — the description, the town —
    // so it is read again, quietly. If that fails, the old one stays.
    apiClient
      .getProvider(next.providerId)
      .then((record) => {
        if (record) setProvider(record);
      })
      .catch(() => {});
  }, []);

  const value = useMemo<BusinessValue>(
    () => ({
      hasBusiness: profile !== undefined && !closed,
      closed,
      loading: sessionLoading || loading,
      error,
      refresh,
      applyChanges,
      provider,
      profile,
    }),
    [profile, provider, closed, sessionLoading, loading, error, refresh, applyChanges],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

// How a page finds out about the business:
//   const { hasBusiness, provider } = useBusiness();
export function useBusiness(): BusinessValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error('useBusiness must be used inside BusinessProvider (check app/layout.tsx)');
  }
  return ctx;
}

/**
 * The business, for a dashboard page — where it is guaranteed to exist.
 *
 * Every page under /provider except the application form sits behind the gate
 * in components/business/ProviderShell.tsx, which shows nothing until a
 * business has been found. So these pages can rely on the record being there,
 * and this says so in the types instead of every page checking again.
 *
 * Used anywhere else, it fails loudly — a page outside the gate asking for a
 * business that may not exist is a mistake worth finding at once.
 */
export function useOwnBusiness(): { profile: BusinessProfile; provider: Provider | undefined } {
  const { profile, provider } = useBusiness();
  if (!profile) {
    throw new Error('useOwnBusiness is only for dashboard pages behind ProviderShell’s gate.');
  }
  return { profile, provider };
}
