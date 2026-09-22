'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The messages between a customer and the rental businesses
// they have booked with — read from and sent through the backend.
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
//
// ---- SENDING ----
//
// A message goes to the backend, and the conversation it hands back — the new
// message included — replaces the one on screen. So what is shown is what was
// stored, not what the page hoped was stored. If sending fails, the message
// stays in the box, so nothing typed is lost.
//
// Opening a conversation marks the business's messages in it as read.
//
// The business's name comes from the shared lookup in lib/api-client.ts,
// because a conversation from the backend names the business by id only.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
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
import type { ChatThread } from '@/types';
import styles from '@/app/(site)/account/account.module.css';
import { useTranslation } from '@/lib/i18n';

export function MessagesView({ threadId }: { threadId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendProblem, setSendProblem] = useState<string | null>(null);

  // Conversations as the backend handed them back after a send or a read,
  // laid over the list as first loaded. Reloading the whole list instead would
  // flash grey blocks in the middle of a conversation.
  const [updated, setUpdated] = useState<Record<string, ChatThread>>({});

  const { data, loading, error, refresh } = useAsyncData(async (signal) => {
    const [threads, lookup] = await Promise.all([
      apiClient.listThreads(signal),
      // Names are a nicety; the conversations are the page.
      apiClient.catalogueLookup().catch(() => null),
    ]);
    return { threads, lookup };
  }, []);

  const threads = useMemo(
    () => data?.threads.map((thread) => updated[thread.id] ?? thread),
    [data, updated],
  );
  const businessName = (providerId: string) =>
    data?.lookup?.provider(providerId)?.businessName ?? 'Rental business';

  // Which conversation is open. On a wide screen the first one opens by default,
  // because an empty right-hand pane beside a full list looks broken.
  const active: ChatThread | undefined = useMemo(() => {
    if (!threads || threads.length === 0) return undefined;
    return threads.find((thread) => thread.id === threadId) ?? threads[0];
  }, [threads, threadId]);

  // ---- OPENING A CONVERSATION MARKS IT READ ----
  // Only when there is something unread, so reading does not cost a request.
  // A failure is left alone: the dot simply comes back on the next visit.
  const activeId = active?.id;
  const activeUnread = active?.unreadCount ?? 0;
  useEffect(() => {
    if (!activeId || activeUnread === 0) return;
    apiClient
      .markThreadRead(activeId)
      .then(() =>
        setUpdated((current) => {
          const base = current[activeId] ?? threads?.find((thread) => thread.id === activeId);
          return base ? { ...current, [activeId]: { ...base, unreadCount: 0 } } : current;
        }),
      )
      .catch(() => {});
    // `threads` is read, not watched: only opening a conversation should mark it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, activeUnread]);

  // Keep the newest message in view when a conversation opens or a reply is
  // added, rather than starting at the top of a long history.
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  const messageCount = active?.messages.length ?? 0;
  useEffect(() => {
    const element = bubblesRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [activeId, messageCount]);

  const send = async () => {
    const body = draft.trim();
    if (!body || !active) return;

    setSending(true);
    setSendProblem(null);
    try {
      const thread = await apiClient.sendMessage(active.id, body);
      setUpdated((current) => ({ ...current, [thread.id]: thread }));
      setDraft('');
    } catch (caught) {
      // The draft is kept, so nothing typed is lost.
      setSendProblem(isApiError(caught) ? caught.message : 'Your message was not sent. Please try again.');
    } finally {
      setSending(false);
    }
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
            const name = businessName(thread.providerId);
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
                <Avatar name={name} size={40} tone="brand" />

                <span className={styles.threadBody}>
                  <span className={styles.threadTop}>
                    <Text variant="label" as="span" className={styles.threadPreview} raw>
                      {name}
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
              <Avatar name={businessName(active.providerId)} size={38} tone="brand" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text variant="label" as="h2" raw>
                  {businessName(active.providerId)}
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
              {active.messages.map((message) => {
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

            {sendProblem ? (
              <div className={styles.note} role="alert">
                <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
                <Text variant="small" tone="ink2" raw>
                  {sendProblem}
                </Text>
              </div>
            ) : null}

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
                loading={sending}
                iconRight={<Icon name="send" size={15} />}
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MessagesView;
