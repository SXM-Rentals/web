'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Keeps track of whether someone is signed in, which
// account they are using, and how far through the identity check they have got.
//
// IMPORTANT: this is a PRETEND sign-in. No password is checked, nothing is sent
// anywhere, and any email address works. It exists so the site can move between
// the signed-out pages and the signed-in pages while we build the look of it.
// Real sign-in is a backend job and comes later.
//
// THE BIG DIFFERENCE FROM THE PHONE APP: on the phone, someone signs in before
// they can browse properly. On the web they do not. Anyone can look at the
// homepage, search, and every car page while completely signed out — the first
// thing that needs an account is starting a booking. Most people arrive here
// from a search engine and will simply leave if asked to register first, so the
// funnel is kept open as long as possible.
//
// The biometric sign-in from the phone app (Face ID, fingerprint) is not here.
// A browser cannot offer it.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import storage from '@/lib/storage';
import { mockUser, mockLocalUser, mockUsersByVerification } from '@/lib/mock/user';
import type { AccountType, User, VerificationStatus } from '@/types';

type SessionValue = {
  user: User | null;
  isSignedIn: boolean;
  // True until we have read back whether someone was signed in last time. Pages
  // use it to avoid flashing "sign in" at somebody who already is.
  loading: boolean;

  // Pretend sign-in and sign-up. They simply set the current person and return.
  signIn: (emailOrPhone: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (details: { firstName: string; lastName: string; email: string }) => Promise<void>;
  signOut: () => Promise<void>;

  // Choosing Local or Tourist changes which documents we ask for later.
  setAccountType: (t: AccountType) => void;

  // Used by the verification pages to move between the different states so each
  // one can be seen and checked during development.
  setVerificationStatus: (s: VerificationStatus) => void;
  markVerificationStep: (step: 'selfie' | 'license' | 'identityDoc') => void;
};

const SessionContext = createContext<SessionValue | null>(null);

const SIGNED_IN_KEY = 'sxm.demo-signed-in';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ---- REMEMBER THAT SOMEONE WAS SIGNED IN ----
  // So refreshing the page during testing does not throw you back out to the
  // welcome screen every time.
  useEffect(() => {
    storage.getItem(SIGNED_IN_KEY).then((flag) => {
      if (flag === 'yes') setUser(mockUser);
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(async (_emailOrPhone: string) => {
    setUser(mockUser);
    await storage.setItem(SIGNED_IN_KEY, 'yes');
  }, []);

  const signInWithApple = useCallback(async () => signIn('apple'), [signIn]);
  const signInWithGoogle = useCallback(async () => signIn('google'), [signIn]);

  const signUp = useCallback(
    async (details: { firstName: string; lastName: string; email: string }) => {
      // A brand new person has not been through the identity check yet, so they
      // start at the very beginning of that process.
      setUser({
        ...mockUsersByVerification.unstarted,
        firstName: details.firstName || mockUser.firstName,
        lastName: details.lastName || mockUser.lastName,
        email: details.email || mockUser.email,
      });
      await storage.setItem(SIGNED_IN_KEY, 'yes');
    },
    [],
  );

  const signOut = useCallback(async () => {
    setUser(null);
    await storage.removeItem(SIGNED_IN_KEY);
  }, []);

  const setAccountType = useCallback((accountType: AccountType) => {
    setUser((current) => {
      const base = current ?? mockUsersByVerification.unstarted;
      // A resident gets the Islander flag; a visitor does not.
      return accountType === 'local'
        ? { ...base, ...mockLocalUser, accountType, verification: base.verification }
        : { ...base, accountType, isIslander: false };
    });
  }, []);

  const setVerificationStatus = useCallback((status: VerificationStatus) => {
    setUser((current) =>
      current ? { ...current, verification: { ...current.verification, status } } : current,
    );
  }, []);

  const markVerificationStep = useCallback((step: 'selfie' | 'license' | 'identityDoc') => {
    setUser((current) => {
      if (!current) return current;
      const key =
        step === 'selfie' ? 'selfieDone' : step === 'license' ? 'licenseDone' : 'identityDocDone';
      return { ...current, verification: { ...current.verification, [key]: true } };
    });
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      user,
      isSignedIn: user !== null,
      loading,
      signIn,
      signInWithApple,
      signInWithGoogle,
      signUp,
      signOut,
      setAccountType,
      setVerificationStatus,
      markVerificationStep,
    }),
    [
      user,
      loading,
      signIn,
      signInWithApple,
      signInWithGoogle,
      signUp,
      signOut,
      setAccountType,
      setVerificationStatus,
      markVerificationStep,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// How any page finds out who is signed in:
//   const { user, isSignedIn, signOut } = useSession();
export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside SessionProvider (check app/layout.tsx)');
  }
  return ctx;
}
