'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Placing a rental's security deposit on the customer's
// card, from the rental's own page — and saying when that can be done.
//
// ---- A HOLD, NOT A CHARGE ----
//
// The deposit is set aside on the card and stays the customer's money. It is
// never revenue, never part of the rental total and never commissioned; it is
// released after the car comes back, unless a claim is made with a written
// reason. Stripe's form is used exactly as for a payment, but the backend asks
// Stripe only to hold the amount, never to take it.
//
// ---- NOT BEFORE TWO DAYS BEFORE PICKUP ----
//
// A hold on a card only lasts about a week before the bank drops it, so one
// placed when the car was booked could be gone before it was collected. The
// backend opens the window two days before pickup and refuses earlier
// (`too_early`); before then this says when, instead of offering a button.
//
// Once Stripe says the hold went through, this waits for the deposit itself
// to say "held" — set by Stripe telling the backend — before it says so.

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isApiError, isUnavailable } from '@/lib/api/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import { longDate, money } from '@/lib/format';
import { Button, Icon, Text } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import type { Booking } from '@/types';
import { CardForm, readStripeReturn } from './CardForm';
import styles from './CardForm.module.css';

type Phase = 'idle' | 'starting' | 'form' | 'waiting' | 'slow';

const POLL_EVERY_MS = 2_000;
const POLL_TRIES = 30;

export function HoldDeposit({ booking, onHeld }: { booking: Booking; onHeld?: () => void }) {
  const { t } = useTranslation();
  const params = useSearchParams();
  const returned = params.get('paying') === 'deposit' ? readStripeReturn(params) : null;

  const { data: deposit, unavailable, refresh } = useAsyncData(
    (signal) => apiClient.getDeposit(booking.id, signal),
    [booking.id],
  );
  const [phase, setPhase] = useState<Phase>(
    returned === 'succeeded' || returned === 'processing' ? 'waiting' : 'idle',
  );
  const [secret, setSecret] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(
    returned === 'failed' ? t('pay.deposit.bankRefused') : null,
  );

  // ---- WAITING FOR THE DEPOSIT TO SAY HELD ----
  useEffect(() => {
    if (phase !== 'waiting') return;
    let tries = 0;
    let stopped = false;
    const timer = setInterval(async () => {
      tries += 1;
      try {
        const now = await apiClient.getDeposit(booking.id);
        if (stopped) return;
        if (now?.status === 'held') {
          clearInterval(timer);
          setPhase('idle');
          refresh();
          onHeld?.();
          return;
        }
      } catch {
        // Ask again.
      }
      if (tries >= POLL_TRIES) {
        clearInterval(timer);
        if (!stopped) setPhase('slow');
      }
    }, POLL_EVERY_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [phase, booking.id]);

  // Nothing to place on a rental that is over or called off, or while card
  // payments are off — the deposit panel above already says where it stands.
  if (booking.status === 'cancelled' || booking.status === 'completed') return null;

  if (unavailable) {
    return (
      <div className={styles.line}>
        <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink3" raw>
          {t('pay.deposit.off')}
        </Text>
      </div>
    );
  }

  if (!deposit) return null;

  const amount = money(deposit.amount);

  if (phase === 'waiting' || phase === 'slow') {
    return (
      <div className={styles.line} role="status">
        <Icon name="time-outline" size={15} color="var(--ink2)" />
        <Text variant="small" tone="ink2" raw>
          {phase === 'waiting' ? t('pay.deposit.confirming') : t('pay.deposit.slow')}
        </Text>
      </div>
    );
  }

  if (deposit.status === 'held') {
    return deposit.expiresBeforeReturn && deposit.holdExpiresAt ? (
      <div className={styles.line}>
        <Icon name="alert-circle-outline" size={15} color="var(--warning)" />
        <Text variant="small" tone="ink2" raw>
          {t('pay.deposit.expiresEarly').replace('{date}', longDate(deposit.holdExpiresAt))}
        </Text>
      </div>
    ) : null;
  }

  if (deposit.status !== 'not_taken') return null;

  const opens = new Date(deposit.holdOpensAt);
  if (Date.now() < opens.getTime()) {
    return (
      <div className={styles.line}>
        <Icon name="time-outline" size={15} color="var(--ink3)" />
        <Text variant="small" tone="ink2" raw>
          {t('pay.deposit.notYet').replace('{date}', longDate(deposit.holdOpensAt))}
        </Text>
      </div>
    );
  }

  const start = async () => {
    setPhase('starting');
    setProblem(null);
    try {
      const { clientSecret } = await apiClient.startDepositHold(booking.id);
      setSecret(clientSecret);
      setPhase('form');
    } catch (caught) {
      if (isApiError(caught) && caught.code === 'deposit_already_held') {
        setPhase('waiting');
        return;
      }
      setProblem(
        isUnavailable(caught) ? t('pay.deposit.off') : isApiError(caught) ? caught.message : t('pay.form.failed'),
      );
      setPhase('idle');
    }
  };

  const returnUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/account/rentals/${encodeURIComponent(booking.id)}?paying=deposit`;

  return (
    <div className={styles.stack} data-print="hide">
      {phase === 'form' && secret ? (
        <CardForm
          clientSecret={secret}
          kind="payment"
          returnUrl={returnUrl}
          submitLabel={t('pay.deposit.holdAmount').replace('{amount}', amount)}
          onConfirmed={() => setPhase('waiting')}
          onCancel={() => setPhase('idle')}
        />
      ) : (
        <>
          <Text variant="small" tone="ink2" raw>
            {t('pay.deposit.intro').replace('{amount}', amount)}
          </Text>
          {problem ? (
            <div className={styles.problem} role="alert">
              <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
              <Text variant="small" tone="ink2" raw>
                {problem}
              </Text>
            </div>
          ) : null}
          <div>
            <Button
              label={t('pay.deposit.hold').replace('{amount}', amount)}
              size="md"
              variant="secondary"
              loading={phase === 'starting'}
              onClick={start}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default HoldDeposit;
