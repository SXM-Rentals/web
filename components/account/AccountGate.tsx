'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The sign-in check in front of the account area, with
// the one page in it that anybody may read.
//
// That page is /account/close, which explains how to close an account. It
// has to open WITHOUT signing in: Google Play asks for an address where
// somebody can find out how to delete their account without the app, and a
// person who has forgotten their password is exactly who needs it. Every other
// page under /account is somebody's own, and stays behind the check.
//
// The same shape as BARE_PAGES in components/business/ProviderShell.tsx, which
// lets the business application through its dashboard's gate.

import React from 'react';
import { usePathname } from 'next/navigation';
import { RequireSignIn } from '@/components/layout/RequireSignIn';

const PUBLIC_PAGES = ['/account/close'];

export function AccountGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (PUBLIC_PAGES.includes(pathname)) return <>{children}</>;
  return <RequireSignIn>{children}</RequireSignIn>;
}

export default AccountGate;
