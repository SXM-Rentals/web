'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Wraps the parts of the site that genuinely need someone
// to be signed in, and explains rather than simply refusing.
//
// THREE THINGS IT GETS RIGHT that are easy to get wrong:
//
//   1. It waits. Whether someone is signed in is read from the browser's own
//      storage, which takes a moment. Deciding before that has finished flashes
//      "please sign in" at somebody who already is — an alarming thing to see.
//   2. It remembers where they were going. After signing in they land back on
//      the page they wanted, not on the homepage having lost their place.
//   3. It explains why. "Sign in to see your rentals" is a reason; a bare sign-in
//      form appearing where a page should be is not.
//
// ---- THIS IS A COURTESY, NOT SECURITY, AND THAT MATTERS MORE NOW ----
//
// Every check here happens in the browser, and a check in the browser can
// always be bypassed by whoever is holding the browser. That was a theoretical
// point while the data was made up. It is not any more: the pages behind this
// now ask the backend for somebody's real bookings and messages.
//
// What makes that safe is that the backend does its own checking. The session
// lives in a cookie the browser cannot read, every private request is sent
// with it, and the backend answers 401 to anyone it does not recognise —
// whatever this component decided. So removing this would leak nothing; it
// would only replace a clear explanation with a row of failed requests.

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { Button, Card, ErrorState, Icon, Skeleton, Text } from '@/components/ui';
import styles from './RequireSignIn.module.css';
import { useTranslation } from '@/lib/i18n';

export function RequireSignIn({
  children,
  title = 'Sign in to see this',
  body = 'Your rentals, messages and documents live in your account. Browsing does not need one — this does.',
}: {
  children: React.ReactNode;
  title?: string;
  body?: string;
}) {
  const { isSignedIn, loading, error, retry } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();

  // Still working out whether anyone is signed in. Loading blocks rather than a
  // decision, so nothing wrong is shown even for a moment.
  if (loading) {
    return (
      <div className={styles.loading}>
        <Skeleton height={28} width="40%" />
        <Skeleton height={140} radius="var(--radius-lg)" />
        <Skeleton height={140} radius="var(--radius-lg)" />
      </div>
    );
  }

  // ---- COULD NOT TELL — NOT THE SAME AS SIGNED OUT ----
  // The backend was asleep or unreachable when we asked who this is. Showing
  // the sign-in form here would tell somebody who IS signed in that they are
  // not, and they would sign in again for nothing. Offer to ask again instead.
  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  if (!isSignedIn) {
    return (
      <Card padded className={styles.gate}>
        <span className={styles.icon}>
          <Icon name="lock-closed-outline" size={26} />
        </span>

        <Text variant="h2" as="h1">
          {title}
        </Text>

        <Text variant="body" tone="ink2">
          {body}
        </Text>

        <div className={styles.actions}>
          {/* Carries where they were trying to go, so signing in brings them
              back here rather than dumping them on the homepage. */}
          <Button label={t('auth.signIn')} href={`/login?next=${encodeURIComponent(pathname)}`} size="md" />
          <Button
            label={t('footer.createAccount')}
            href={`/signup?next=${encodeURIComponent(pathname)}`}
            variant="outline"
            size="md"
          />
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}

export default RequireSignIn;
