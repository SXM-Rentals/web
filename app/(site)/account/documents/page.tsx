'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The documents attached to someone's account — the licence
// and identity papers they uploaded for the identity check, and the rental
// agreements they have signed.
//
// THE DOCUMENTS THEMSELVES ARE NEVER SHOWN HERE, only the fact that each one was
// received and accepted. A passport scan sitting on screen is a passport scan
// that gets photographed over somebody's shoulder in an airport lounge, and
// there is no reason to display one back to the person who already owns it.
// When this is real, those files belong in encrypted storage separate from the
// main database, reachable only by staff who need them.

import React from 'react';
import { useSession } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { longDate, dateRange } from '@/lib/format';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  ListRow,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

export default function DocumentsPage() {
  const { t } = useTranslation();
  const { user } = useSession();
  const { data: bookings, loading } = useAsyncData(() => apiClient.listBookings(), []);

  if (!user) return <Skeleton height={280} radius="var(--radius-lg)" />;

  // The three identity documents, and whether each has been received.
  const identityDocs = [
    {
      title: 'Photo of you',
      subtitle: 'A live photo, matched against your identity document',
      done: user.verification.selfieDone,
      icon: 'person-outline' as const,
    },
    {
      title: "Driver's licence",
      subtitle: 'Proves you are allowed to drive',
      done: user.verification.licenseDone,
      icon: 'card-outline' as const,
    },
    {
      title: user.accountType === 'local' ? 'Local ID or residency document' : 'Passport',
      subtitle:
        user.accountType === 'local'
          ? 'Proves you live on the island'
          : 'Proves who you are',
      done: user.verification.identityDocDone,
      icon: 'document-outline' as const,
    },
  ];

  const signed = (bookings ?? []).filter((booking) => booking.agreementSigned);

  return (
    <div className={styles.page}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('web.nav.documents')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.docs.intro')}
        </Text>
      </div>

      {/* ---- IDENTITY ---- */}
      <Card padded={false}>
        <div style={{ padding: 'var(--space-lg) var(--space-lg) 0' }}>
          <Text variant="label" as="h2" raw>
            {t('acct.identityCheck')}
          </Text>
          <Text variant="small" tone="ink2" style={{ marginTop: 'var(--space-xs)' }} raw>
            {t('acct.docs.onceNote')}
          </Text>
        </div>

        {identityDocs.map((doc) => (
          <ListRow
            key={doc.title}
            title={doc.title}
            subtitle={doc.subtitle}
            icon={doc.icon}
            hideChevron
            trailing={
              doc.done ? (
                <StatusPill label={t('acct.docs.received')} tone="success" />
              ) : (
                <StatusPill label={t('acct.docs.notYet')} tone="neutral" />
              )
            }
          />
        ))}

        <div style={{ padding: 'var(--space-lg)' }}>
          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="lock-closed-outline" size={15} color="var(--ink3)" />
            <Text variant="small" tone="ink3" raw>
              {t('acct.docs.privacyNote')}
            </Text>
          </div>

          {user.verification.status !== 'approved' ? (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <Button
                label={t('acct.verify.continue')}
                href="/verify-status"
                variant="secondary"
                size="sm"
              />
            </div>
          ) : null}
        </div>
      </Card>

      {/* ---- SIGNED AGREEMENTS ---- */}
      <div>
        <Text variant="h3" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.docs.signedTitle')}
        </Text>

        {loading ? (
          <Skeleton height={120} radius="var(--radius-lg)" />
        ) : signed.length === 0 ? (
          <EmptyState
            title={t('acct.docs.noneTitle')}
            body={t('acct.docs.noneBody')}
            icon="document-outline"
            actionLabel={t('web.nav.findCar')}
            actionHref="/search"
          />
        ) : (
          <Card padded={false}>
            {signed.map((booking) => (
              <ListRow
                key={booking.id}
                title={`Agreement — ${booking.reference}`}
                subtitle={`${dateRange(booking.startDate, booking.endDate)} · signed ${longDate(
                  booking.createdAt,
                )}`}
                icon="document-attach-outline"
                href={`/account/rentals/${booking.id}`}
              />
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
