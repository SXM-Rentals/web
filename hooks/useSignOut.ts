'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Signing out from a button, with a message if it did
// not work.
//
// WHY THIS EXISTS AND IS NOT JUST signOut. Signing out can fail — the
// connection drops, the backend is asleep. When it does, the person is still
// signed in on the backend, so the screen rightly keeps them signed in (see
// lib/auth.tsx). Without a message, though, pressing "Sign out" would simply
// do nothing, which reads as a broken button — and on a shared computer, a
// broken sign-out button is exactly the one that matters.
//
// The message could not live inside lib/auth.tsx itself: the session sits
// above the toasts in app/layout.tsx, so it cannot show one. Every sign-out
// button uses this instead, so they all behave the same.

import { useCallback } from 'react';
import { useSession } from '@/lib/auth';
import { useToast } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export function useSignOut(): () => Promise<void> {
  const { signOut } = useSession();
  const { showToast } = useToast();
  const { t } = useTranslation();

  return useCallback(async () => {
    const signedOut = await signOut();
    if (!signedOut) showToast(t('auth.signOutFailedTitle'), t('auth.signOutFailedBody'));
  }, [signOut, showToast, t]);
}
