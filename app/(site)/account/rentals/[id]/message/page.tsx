'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Writing to the business about one rental — where to
// collect the car, what time, anything else.
//
// ---- WHY THIS PAGE EXISTS ----
//
// The rental page's "Message the business" button used to open the list of
// conversations. For somebody who had never written to that business, the
// list was empty and there was nothing on it to start one with — and a
// business cannot write first, so neither side could open the conversation.
//
// So the button comes here. If a conversation about this rental already
// exists, this page steps straight into it. If not, it offers a box to write
// the first message, which the backend files under the rental, and then opens
// the conversation it started.

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useBooking, useCarName } from '@/hooks/useBookings';
import { dateRange } from '@/lib/format';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  Text,
  TextArea,
} from '@/components/ui';
import styles from '../../../account.module.css';
import { useTranslation } from '@/lib/i18n';

type PageProps = { params: Promise<{ id: string }> };

export default function MessageAboutRentalPage({ params }: PageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = use(params);

  const { booking, vehicle, provider, lookedUp, loading, error, refresh } = useBooking(id);
  const carName = useCarName();
  // The conversations, to find this rental's. Not finding out is not fatal:
  // writing here adds to the rental's conversation either way.
  const threads = useAsyncData((signal) => apiClient.listThreads(signal).catch(() => null), []);

  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  // A conversation about this rental already exists: go straight into it.
  const existing =
    booking && threads.data
      ? threads.data.find((thread) => thread.bookingRef === booking.reference)
      : undefined;
  useEffect(() => {
    if (existing) router.replace(`/account/messages/${existing.id}`);
  }, [existing, router]);

  if (loading || threads.loading || existing) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="45%" />
        <Skeleton height={240} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!booking) {
    return (
      <EmptyState
        title={t('acct.rental.notFound')}
        body={t('acct.rental.notFoundBody')}
        icon="car-outline"
        actionLabel={t('acct.cancel.backToRentals')}
        actionHref="/account/rentals"
      />
    );
  }

  const send = async () => {
    const text = body.trim();
    if (!text) return;
    setSending(true);
    setProblem(null);
    try {
      const thread = await apiClient.startThread({
        providerId: booking.providerId,
        bookingId: booking.id,
        body: text,
      });
      router.push(`/account/messages/${thread.id}`);
    } catch (caught) {
      // Kept in the box, so nothing typed is lost.
      setProblem(isApiError(caught) ? caught.message : 'Your message was not sent. Please try again.');
      setSending(false);
    }
  };

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Rentals', href: '/account/rentals' },
          { label: booking.reference, href: `/account/rentals/${booking.id}` },
          { label: 'Message' },
        ]}
      />

      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {provider
            ? t('acct.message.title').replace('{business}', provider.businessName)
            : t('acct.message.titleGeneric')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {`${carName(vehicle, lookedUp)} · ${dateRange(booking.startDate, booking.endDate)}`}
        </Text>
      </div>

      <Card padded>
        <Text variant="small" tone="ink2" style={{ marginBottom: 'var(--space-lg)' }} raw>
          {t('acct.message.intro').replace('{reference}', booking.reference)}
        </Text>

        <TextArea
          label={t('acct.message.label')}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={5}
          maxLength={4000}
          placeholder={t('acct.message.placeholder')}
        />

        {problem ? (
          <div className={styles.note} role="alert">
            <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-lg)' }}>
          <Button
            label={t('acct.message.send')}
            size="md"
            loading={sending}
            disabled={!body.trim()}
            onClick={send}
            iconRight={<Icon name="send" size={15} />}
          />
          <Button
            label={t('acct.extend.back')}
            href={`/account/rentals/${booking.id}`}
            variant="outline"
            size="md"
          />
        </div>

        <div className={styles.note}>
          <Icon name="lock-closed-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('acct.message.privacy')}
          </Text>
        </div>
      </Card>
    </div>
  );
}
