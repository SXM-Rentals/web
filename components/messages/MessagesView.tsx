'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The messages between a customer and the rental businesses
// they have booked with.
//
// THE PHONE SHOWS A LIST YOU TAP INTO AND COME BACK OUT OF. A laptop has room
// for both at once, so this is the two-pane layout every messaging app on a
// computer uses: conversations down the left, the open one on the right.
// Switching between them costs nothing and never loses your place.
//
// ON A NARROW WINDOW IT BEHAVES LIKE THE PHONE — the list, then the
// conversation, one at a time — because two panes in 380 pixels is two
// unreadable panes.
//
// WHY MESSAGING EXISTS AT ALL: rental businesses are never given a customer's
// phone number or email address. This is how the two sides talk, which is what
// keeps a booking, its deposit and any dispute as something SXM Rentals can
// actually help with.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAsyncData } from '@/hooks/useAsyncData';
import { findProvider } from '@/lib/mock/providers';
import { clockTime, relativeDay } from '@/lib/format';
import { cx } from '@/lib/utils';
import {
  Avatar,
  Button,
  EmptyState,
  ErrorState,
  Icon,
  Input,
  Skeleton,
  Text,
} from '@/components/ui';
import type { ChatMessage, ChatThread } from '@/types';
import styles from '@/app/(site)/account/account.module.css';
import { useTranslation } from '@/lib/i18n';

export function MessagesView({ threadId }: { threadId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [draft, setDraft] = useState('');
  // Messages typed during this visit. There is no backend, so they live only
  // here — which is said plainly underneath rather than pretending otherwise.
  const [sent, setSent] = useState<ChatMessage[]>([]);

  const { data: threads, loading, error, refresh } = useAsyncData(
    () => apiClient.listThreads(),
    [],
  );

  // Which conversation is open. On a wide screen the first one opens by default,
  // because an empty right-hand pane beside a full list looks broken.
  const active: ChatThread | undefined = useMemo(() => {
    if (!threads || threads.length === 0) return undefined;
    return threads.find((thread) => thread.id === threadId) ?? threads[0];
  }, [threads, threadId]);

  // Keep the newest message in view when a conversation opens or a reply is
  // added, rather than starting at the top of a long history.
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const element = bubblesRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [active?.id, sent.length]);

  // Anything typed in this visit is only shown on the conversation it was
  // written in.
  const messages = useMemo(() => {
    if (!active) return [];
    return [...active.messages, ...sent.filter((m) => m.id.startsWith(`${active.id}-`))];
  }, [active, sent]);

  const send = () => {
    if (!draft.trim() || !active) return;

    setSent((current) => [
      ...current,
      {
        id: `${active.id}-${Date.now()}`,
        from: 'customer',
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
        <Skeleton height={30} width="35%" />
        <Skeleton height={420} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  if (!threads || threads.length === 0) {
    return (
      <EmptyState
        title={t('messages.empty')}
        body={t('messages.emptyBodyLong')}
        icon="chatbubble-outline"
        actionLabel={t('web.nav.findCar')}
        actionHref="/search"
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('messages.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('messages.intro')}
        </Text>
      </div>

      <div className={styles.messages}>
        {/* ---- THE LIST OF CONVERSATIONS ---- */}
        <div className={cx(styles.threadList, 'thinScroll')}>
          {threads.map((thread) => {
            const provider = findProvider(thread.providerId);
            const last = thread.messages[thread.messages.length - 1];
            const isActive = active?.id === thread.id;

            return (
              <button
                key={thread.id}
                type="button"
                className={cx(styles.threadRow, isActive && styles.threadRowActive)}
                onClick={() => router.push(`/account/messages/${thread.id}`)}
                aria-current={isActive ? 'true' : undefined}
              >
                <Avatar name={provider?.businessName ?? 'Business'} size={40} tone="brand" />

                <span className={styles.threadBody}>
                  <span className={styles.threadTop}>
                    <Text variant="label" as="span" className={styles.threadPreview} raw>
                      {provider?.businessName ?? 'Rental business'}
                    </Text>
                    <Text variant="caption" tone="ink3" as="span" raw>
                      {last ? relativeDay(last.sentAt) : ''}
                    </Text>
                  </span>

                  <Text
                    variant="small"
                    tone="ink2"
                    as="span"
                    className={styles.threadPreview}
                    raw
                  >
                    {last?.body ?? 'No messages yet'}
                  </Text>

                  {thread.bookingRef ? (
                    <Text variant="caption" tone="ink3" as="span" raw>
                      {thread.bookingRef}
                    </Text>
                  ) : null}
                </span>

                {thread.unreadCount > 0 ? (
                  <span
                    className={styles.unreadDot}
                    aria-label={`${thread.unreadCount} unread`}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ---- THE OPEN CONVERSATION ---- */}
        {active ? (
          <div className={styles.conversation}>
            <div className={styles.conversationHead}>
              <Avatar
                name={findProvider(active.providerId)?.businessName ?? 'Business'}
                size={38}
                tone="brand"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text variant="label" as="h2" raw>
                  {findProvider(active.providerId)?.businessName ?? 'Rental business'}
                </Text>
                {active.bookingRef ? (
                  <Text variant="caption" tone="ink3" raw>
                    {active.bookingRef}
                  </Text>
                ) : null}
              </div>

              <Button
                label={t('messages.viewBusiness')}
                href={`/providers/${active.providerId}`}
                variant="ghost"
                size="sm"
              />
            </div>

            <div className={cx(styles.bubbles, 'thinScroll')} ref={bubblesRef}>
              {messages.map((message) => {
                const mine = message.from === 'customer';

                return (
                  <div
                    key={message.id}
                    className={cx(styles.bubbleRow, mine && styles.bubbleRowMine)}
                  >
                    <div className={cx(styles.bubble, mine && styles.bubbleMine)}>
                      <div>{message.body}</div>
                      <div className={styles.bubbleTime}>{clockTime(message.sentAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---- WRITING A REPLY ----
                Enter sends, which is what people expect from a message box. */}
            <form
              className={styles.composer}
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

      <div className={styles.note}>
        <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink3" raw>
          {t('messages.demoNote')}
        </Text>
      </div>
    </div>
  );
}

export default MessagesView;
