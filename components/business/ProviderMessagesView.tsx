'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The conversations between this rental business and the
// people renting its vehicles. Two panes on a laptop — the list on the left, the
// open conversation on the right.
//
// SAME PRIVACY RULE AS THE BOOKINGS PAGES: a display name and nothing else. The
// business talks to the renter here, inside SXM Rentals, and never gets their
// phone number or email address. BusinessChatThread has no contact fields at
// all, so this page could not show one if it tried.
//
// THIS IS WHY MESSAGING EXISTS. Without a way to talk, businesses would have to
// be given contact details, and bookings would drift off the platform into
// private arrangements — where there is no deposit held, no signed agreement,
// and nobody to turn to when something goes wrong.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { findVehicle } from '@/lib/mock/vehicles';
import { clockTime, relativeDay } from '@/lib/format';
import { cx } from '@/lib/utils';
import {
  Avatar,
  Button,
  Card,
  IconButton,
  EmptyState,
  ErrorState,
  Icon,
  Input,
  Sheet,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import type { BusinessChatThread, ChatMessage } from '@/types';
import accountStyles from '@/app/(site)/account/account.module.css';
import styles from '@/app/provider/provider.module.css';
import { useTranslation } from '@/lib/i18n';

export function ProviderMessagesView({ threadId }: { threadId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<ChatMessage[]>([]);
  const [callOpen, setCallOpen] = useState(false);

  const { data: threads, loading, error, refresh } = useAsyncData(
    () => apiClient.getBusinessThreads(),
    [],
  );

  const active: BusinessChatThread | undefined = useMemo(() => {
    if (!threads || threads.length === 0) return undefined;
    return threads.find((thread) => thread.id === threadId) ?? threads[0];
  }, [threads, threadId]);

  // Keep the newest message in view.
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const element = bubblesRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [active?.id, sent.length]);

  const messages = useMemo(() => {
    if (!active) return [];
    return [...active.messages, ...sent.filter((m) => m.id.startsWith(`${active.id}-`))];
  }, [active, sent]);

  const send = () => {
    if (!draft.trim() || !active) return;

    setSent((current) => [
      ...current,
      {
        // From the business's side, so it appears on the right of the thread.
        id: `${active.id}-${Date.now()}`,
        from: 'provider',
        body: draft.trim(),
        sentAt: new Date().toISOString(),
        read: true,
      },
    ]);
    setDraft('');
  };

  if (loading) {
    return (
      <div className={styles.stack}>
        <Skeleton height={34} width="30%" />
        <Skeleton height={420} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!threads || threads.length === 0) {
    return (
      <EmptyState
        title={t('messages.empty')}
        body={t('pp.messages.emptyBody')}
        icon="chatbubble-outline"
        actionLabel="See your bookings"
        actionHref="/provider/bookings"
      />
    );
  }

  return (
    <>
      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('messages.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.messages.intro')}
          </Text>
        </div>
      </div>

      <div className={accountStyles.messages}>
        {/* ---- THE LIST ---- */}
        <div className={cx(accountStyles.threadList, 'thinScroll')}>
          {threads.map((thread) => {
            const last = thread.messages[thread.messages.length - 1];
            const isActive = active?.id === thread.id;
            const vehicle = thread.vehicleId ? findVehicle(thread.vehicleId) : undefined;

            return (
              <button
                key={thread.id}
                type="button"
                className={cx(
                  accountStyles.threadRow,
                  isActive && accountStyles.threadRowActive,
                )}
                onClick={() => router.push(`/provider/messages/${thread.id}`)}
                aria-current={isActive ? 'true' : undefined}
              >
                <Avatar name={thread.renterDisplayName} size={40} />

                <span className={accountStyles.threadBody}>
                  <span className={accountStyles.threadTop}>
                    <Text
                      variant="label"
                      as="span"
                      className={accountStyles.threadPreview}
                      raw
                    >
                      {thread.renterDisplayName}
                    </Text>
                    <Text variant="caption" tone="ink3" as="span" raw>
                      {last ? relativeDay(last.sentAt) : ''}
                    </Text>
                  </span>

                  <Text
                    variant="small"
                    tone="ink2"
                    as="span"
                    className={accountStyles.threadPreview}
                    raw
                  >
                    {last?.body ?? 'No messages yet'}
                  </Text>

                  <Text variant="caption" tone="ink3" as="span" raw>
                    {[thread.bookingRef, vehicle ? `${vehicle.make} ${vehicle.model}` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </span>

                {thread.unreadCount > 0 ? (
                  <span
                    className={accountStyles.unreadDot}
                    aria-label={`${thread.unreadCount} unread`}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ---- THE OPEN CONVERSATION ---- */}
        {active ? (
          <div className={accountStyles.conversation}>
            <div className={accountStyles.conversationHead}>
              <Avatar name={active.renterDisplayName} size={38} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <Text variant="label" as="h2" raw>
                  {active.renterDisplayName}
                </Text>
                <Text variant="caption" tone="ink3" raw>
                  {active.bookingRef ?? 'No Booking Yet'}
                </Text>
              </div>

              <StatusPill
                label={active.renterVerified ? 'LICENCE CHECKED' : 'NOT CHECKED'}
                tone={active.renterVerified ? 'success' : 'warning'}
              />

              {/* ---- CALLING THE RENTER ----
                  There is no phone number behind this button and there never
                  will be. What it will do is place a call THROUGH SXM Rentals,
                  where both sides are connected without either seeing the
                  other's number — the same way a taxi or delivery app does it.
                  That is the only way to offer calling without breaking the rule
                  that businesses are not given customer contact details. */}
              <IconButton
                icon="call-outline"
                label={t('pp.privacy.callThrough')}
                onClick={() => setCallOpen(true)}
              />
            </div>

            <div className={cx(accountStyles.bubbles, 'thinScroll')} ref={bubblesRef}>
              {messages.map((message) => {
                // From this side of the app, the business's own messages are
                // the ones on the right.
                const mine = message.from === 'provider';

                return (
                  <div
                    key={message.id}
                    className={cx(
                      accountStyles.bubbleRow,
                      mine && accountStyles.bubbleRowMine,
                    )}
                  >
                    <div
                      className={cx(accountStyles.bubble, mine && accountStyles.bubbleMine)}
                    >
                      <div>{message.body}</div>
                      <div className={accountStyles.bubbleTime}>
                        {clockTime(message.sentAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              className={accountStyles.composer}
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <Input
                placeholder={t('messages.placeholder')}
                aria-label={t('messages.placeholder')}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <Button
                label={t('messages.send')}
                size="sm"
                type="submit"
                disabled={!draft.trim()}
                iconRight={<Icon name="send" size={15} />}
              />
            </form>
          </div>
        ) : null}
      </div>

      {/* ---- WHAT THE CALL BUTTON WILL DO ---- */}
      <Sheet
        open={callOpen}
        onClose={() => setCallOpen(false)}
        title="Calling is not connected yet"
        subtitle="Here is how it will work when it is."
        footer={<Button label={t('vehicle.deposit.gotIt')} size="md" onClick={() => setCallOpen(false)} />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="call-outline" size={18} color="var(--ink2)" />
            <div>
              <Text variant="label" as="h3">
                The call goes through SXM Rentals
              </Text>
              <Text variant="small" tone="ink2">
                You press call, we ring the renter, and the two of you are connected.
                Neither side ever sees the other&rsquo;s number — the same way a taxi or
                delivery app does it.
              </Text>
            </div>
          </div>

          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="lock-closed-outline" size={18} color="var(--ink2)" />
            <div>
              <Text variant="label" as="h3">
                Why not just show the number
              </Text>
              <Text variant="small" tone="ink2">
                Because handing it over is the one thing that cannot be undone. Once a
                number is out, the booking can move off the platform — and with it the
                deposit, the signed agreement, and anybody to turn to when something goes
                wrong. A connected call gives you the same conversation without that.
              </Text>
            </div>
          </div>

          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="chatbubble-outline" size={18} color="var(--ink2)" />
            <div>
              <Text variant="label" as="h3" raw>
                {t('pp.promo.meantime')}
              </Text>
              <Text variant="small" tone="ink2">
                Messages here reach the renter and are kept with the booking, so anything
                agreed is on the record if it is ever disputed.
              </Text>
            </div>
          </div>
        </div>
      </Sheet>

      {/* ---- WHY THERE IS NO PHONE NUMBER ---- */}
      <Card padded>
        <div className={styles.privacyNote}>
          <Icon name="lock-closed-outline" size={20} color="var(--ink2)" />
          <div>
            <Text variant="label" as="h2">
              This is the only way to reach a renter
            </Text>
            <Text variant="small" tone="ink2" raw>
              {t('pp.privacy.notShared')}
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
}

export default ProviderMessagesView;
