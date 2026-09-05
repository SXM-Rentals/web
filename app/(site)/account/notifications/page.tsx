'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Everything SXM Rentals has told this customer —
// confirmations, payment receipts, reminders to collect and return, and updates
// on the identity check.
//
// A WEBSITE CANNOT SEND PUSH NOTIFICATIONS THE WAY THE PHONE APP DOES, and this
// build deliberately does not ask for permission to try. So this page is the
// record rather than a mirror of alerts that already arrived: the important ones
// are also sent by email, and this is where they can be found again afterwards.

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { relativeDay, clockTime } from '@/lib/format';
import { cx } from '@/lib/utils';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  Text,
} from '@/components/ui';
import type { AppNotification, NotificationKind } from '@/types';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

// Which picture goes with each kind of message.
const KIND_ICON: Record<NotificationKind, 'checkmark-circle-outline' | 'card-outline' | 'time-outline' | 'alert-circle-outline' | 'shield-checkmark-outline' | 'gift-outline' | 'close'> = {
  booking_confirmed: 'checkmark-circle-outline',
  payment: 'card-outline',
  pickup_reminder: 'time-outline',
  return_reminder: 'time-outline',
  late_return: 'alert-circle-outline',
  cancellation: 'close',
  verification: 'shield-checkmark-outline',
  promotion: 'gift-outline',
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  // Marking things read only lasts for this visit — there is no backend to
  // remember it. Said plainly at the bottom rather than pretended otherwise.
  const [readIds, setReadIds] = useState<string[]>([]);

  const { data: notifications, loading, error, refresh } = useAsyncData(
    () => apiClient.listNotifications(),
    [],
  );

  const isRead = (item: AppNotification) => item.read || readIds.includes(item.id);
  const unreadCount = (notifications ?? []).filter((item) => !isRead(item)).length;

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={30} width="40%" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={88} radius="var(--radius-lg)" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!notifications || notifications.length === 0) {
    return (
      <EmptyState
        title={t('acct.notif.emptyTitle')}
        body={t('acct.notif.emptyBody')}
        icon="notifications-outline"
        actionLabel={t('web.nav.findCar')}
        actionHref="/search"
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('notifications.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {unreadCount > 0
              ? `${unreadCount} you have not read yet.`
              : 'You are up to date.'}
          </Text>
        </div>

        {unreadCount > 0 ? (
          <Button
            label={t('acct.notif.markAll')}
            variant="outline"
            size="sm"
            onClick={() => setReadIds(notifications.map((item) => item.id))}
          />
        ) : null}
      </div>

      <div className={styles.stack}>
        {notifications.map((item) => {
          const read = isRead(item);

          return (
            <Card key={item.id}>
              <div className={styles.notification}>
                <span
                  className={cx(
                    styles.notificationIcon,
                    !read && styles.notificationUnread,
                  )}
                >
                  <Icon name={KIND_ICON[item.kind]} size={19} />
                </span>

                <div className={styles.notificationBody}>
                  <div className={styles.rentalTop}>
                    <Text variant="label" as="h2" weight={read ? 600 : 700}>
                      {item.title}
                    </Text>
                    <Text variant="caption" tone="ink3" as="span" raw>
                      {`${relativeDay(item.sentAt)} · ${clockTime(item.sentAt)}`}
                    </Text>
                  </div>

                  <Text variant="small" tone="ink2">
                    {item.body}
                  </Text>
                </div>

                {!read ? (
                  <button
                    type="button"
                    onClick={() => setReadIds((current) => [...current, item.id])}
                    aria-label={`Mark "${item.title}" as read`}
                    title={t('acct.notif.markOne')}
                    style={{ color: 'var(--brand)', display: 'flex', flexShrink: 0 }}
                  >
                    <Icon name="ellipse" size={10} />
                  </button>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      <div className={styles.note}>
        <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink3">
          Demo mode — marking things as read lasts only until this page is reloaded,
          because there is no backend to remember it yet.
        </Text>
      </div>
    </div>
  );
}
