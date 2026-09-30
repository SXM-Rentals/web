// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: /account/close — how to close an SXM Rentals account,
// what goes and what stays, and what to do without being able to sign in.
//
// It is public, unlike the rest of /account (see components/account/AccountGate.tsx).
// Google Play's Data safety form asks for a web address where somebody can
// find out how to delete their account without the app; this is it. It names
// the app, lists the steps, and says what is deleted and what is kept, which is
// what Google looks for on that page.
//
// The words live in components/account/CloseAccountGuide.tsx, in the four
// languages. This file is only here to give the page its own title and to let
// search engines in: the rest of the account area is kept out of them.

import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { CloseAccountGuide } from '@/components/account/CloseAccountGuide';

export const metadata: Metadata = {
  title: 'Closing Your Account',
  description:
    'How to close your SXM Rentals account, on the website or in the app: what is removed, what is kept, and what to do if you cannot sign in.',
  alternates: canonical('/account/close'),
  robots: { index: true, follow: true },
};

export default function CloseAccountPage() {
  return <CloseAccountGuide />;
}
