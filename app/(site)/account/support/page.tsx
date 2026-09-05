'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Getting help — the questions people actually ask, how to
// reach a person, and the emergency route for somebody stuck at the roadside.
//
// THE EMERGENCY BOX IS AT THE TOP, not buried at the bottom under a list of
// frequently asked questions. Someone whose car will not start on the road to
// Marigot is not going to scroll, and making them read past "how do I change my
// password" to find help is a genuinely bad experience at the worst moment.

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Icon, ListRow, Text, TextArea, Input } from '@/components/ui';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

// The questions this platform will actually generate, answered plainly. Most of
// them are about the deposit, because a hold on a card is the thing people are
// most likely to misread as a charge.
const FAQS: { question: string; answer: string }[] = [
  {
    question: 'Why is there a hold on my card?',
    answer:
      'That is the security deposit. It is set aside rather than charged, and released after you return the car. It is never part of what you paid for the rental.',
  },
  {
    question: 'When do I get the deposit back?',
    answer:
      'The hold is lifted once the car is back and has been checked. Banks usually take a few working days after that to show the money as available again.',
  },
  {
    question: 'Can I get the rental business on the phone?',
    answer:
      'Message them through SXM Rentals instead. Keeping the conversation here is what lets us help if something goes wrong with the booking, the deposit or the car.',
  },
  {
    question: 'What do I need to bring when I collect the car?',
    answer:
      'The physical driving licence you had verified. The business has to see the actual card before handing over the keys, even though we have already checked it.',
  },
  {
    question: 'I need the car for longer than I booked.',
    answer:
      'Open the rental and choose Extend. You will see what the extra days cost, and whether the car is free, before anything is confirmed.',
  },
  {
    question: 'Why was my identity check refused?',
    answer:
      'The reason is always shown on your account page. It is usually something small — a blurred photo, a document out of date, or a name that does not match.',
  },
];

export default function SupportPage() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('acct.support.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.support.subtitle')}
        </Text>
      </div>

      {/* ---- EMERGENCIES, FIRST ---- */}
      <Card
        padded
        style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
          <Icon name="alert-circle-outline" size={20} color="var(--danger)" />
          <Text variant="label" as="h2" tone="danger" raw>
            {t('acct.support.brokenTitle')}
          </Text>
        </div>

        <Text variant="body" tone="ink2" raw>
          {t('acct.support.safetyFirst')}
        </Text>

        <Text variant="small" tone="ink2" style={{ marginTop: 'var(--space-md)' }} raw>
          {t('acct.support.thenMessage')}
        </Text>

        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Button label={t('acct.rental.messageBusiness')} href="/account/messages" variant="danger" size="sm" />
          <Button label={t('acct.support.accidentPolicy')} href="/legal/accident-incident" variant="outline" size="sm" />
        </div>
      </Card>

      {/* ---- COMMON QUESTIONS ---- */}
      <div>
        <Text variant="h3" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.support.commonQuestions')}
        </Text>

        <div className={styles.stack}>
          {FAQS.map((faq) => (
            // A real <details> element, so it opens and closes with no code of
            // ours, works with a keyboard, and can be found by the browser's own
            // "find on page".
            <Card key={faq.question} as="details">
              <summary style={{ cursor: 'pointer', listStyle: 'revert' }}>
                <Text variant="label" as="span">
                  {faq.question}
                </Text>
              </summary>
              <Text variant="body" tone="ink2" style={{ marginTop: 'var(--space-sm)' }}>
                {faq.answer}
              </Text>
            </Card>
          ))}
        </div>
      </div>

      {/* ---- GET IN TOUCH ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.support.sendMessage')}
        </Text>

        {sent ? (
          <div className={styles.note} style={{ marginTop: 0 }}>
            <Icon name="checkmark-circle-outline" size={16} color="var(--success)" />
            <Text variant="small" tone="ink2" raw>
              {t('acct.support.thanks')}
            </Text>
          </div>
        ) : (
          <>
            <Input
              label={t('acct.support.aboutLabel')}
              placeholder={t('acct.support.aboutPlaceholder')}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />

            <div style={{ marginTop: 'var(--space-lg)' }}>
              <TextArea
                label={t('acct.support.messageLabel')}
                placeholder={t('acct.support.messagePlaceholder')}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={2000}
                showCount
                rows={5}
              />
            </div>

            <div style={{ marginTop: 'var(--space-lg)' }}>
              <Button
                label={t('acct.support.sendButton')}
                size="md"
                disabled={!subject.trim() || !message.trim()}
                onClick={() => setSent(true)}
              />
            </div>
          </>
        )}
      </Card>

      {/* ---- THE POLICIES ---- */}
      <Card padded={false}>
        <ListRow
          title={t('acct.support.allPolicies')}
          subtitle={t('acct.support.allPoliciesSub')}
          icon="document-outline"
          href="/legal"
        />
        <ListRow
          title={t('acct.support.cancellation')}
          subtitle={t('acct.support.cancellationSub')}
          icon="refresh"
          href="/legal/cancellation-refund"
        />
        <ListRow
          title={t('acct.support.deposits')}
          subtitle={t('acct.support.depositsSub')}
          icon="shield-outline"
          href="/legal/security-deposit"
        />
      </Card>

      <div className={styles.note}>
        <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink3">
          Still stuck? Everything on this site is a work in progress —{' '}
          <Link href="/legal" style={{ color: 'var(--brand)', fontWeight: 600 }}>
            the policies
          </Link>{' '}
          are the best place to check what is meant to happen.
        </Text>
      </div>
    </div>
  );
}
