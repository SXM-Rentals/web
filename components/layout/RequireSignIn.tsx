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
// This is only a front-of-house courtesy, not security. There is no backend yet,
// and when there is one, the real protection has to be there — a check in the
// browser can always be bypassed by whoever is holding the browser.

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth';
import { Button, Card, Icon, Skeleton, Text } from '@/components/ui';
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
  const { isSignedIn, loading } = useSession();
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
