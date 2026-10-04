'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Paying for a rental by card — on the page right after
// booking, and on the rental's own page for as long as it is unpaid.
//
// ---- IN ORDER ----
//
//   1. A button with the amount. Nothing is asked of Stripe until it is
//      pressed, so looking at a booking never starts a payment.
//   2. The backend starts the payment (or hands back the one already started —
//      asking twice never makes two) and gives a one-time secret.
//   3. Stripe's card form takes the card. See components/payments/CardForm.tsx.
//   4. Stripe says it went through. That is not yet "paid": the booking is
//      marked paid when Stripe tells the backend, a moment later, so this waits
//      for the booking to say so before it does.
//
// If the bank needs its own check on a page of its own, Stripe leaves this
// page and comes back to the rental's page, with how it went in the address.
// This reads it from there (`paying=rental` says the return is for this panel
// and not the deposit's) and carries on from step 4.
//
// ---- THE SAME CARD HOLDS THE DEPOSIT ----
//
// While the deposit is still to be held, the panel says, beside the pay
// button, that the card will also be used for it — and only then asks the
// backend to save the card (`saveCardForDeposit`). That sentence is the
// customer's agreement to a hold placed while they are not there; the
// backend then places it by itself two days before pickup. Without the
// sentence on screen the flag is never sent, and the customer places the
// hold themselves, as before.
//
// ---- WHEN CARD PAYMENTS ARE OFF ----
//
// `payments_unavailable` or `feature_off`: the panel says so, and that the
// rental is then settled with the business when the car is collected — which
// is how every booking was paid before cards were switched on.

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isApiError, isUnavailable } from '@/lib/api/errors';
import { money } from '@/lib/format';
import { Button, Card, Icon, Text } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import type { Booking } from '@/types';
import { CardForm, readStripeReturn } from './CardForm';
import styles from './CardForm.module.css';

type Phase = 'idle' | 'starting' | 'form' | 'waiting' | 'paid' | 'slow' | 'off';

// How often, and for how long, the booking is asked whether Stripe has told
// the backend yet. Usually a second or two; a minute before giving the
// "it will show shortly" answer instead.
const POLL_EVERY_MS = 2_000;
const POLL_TRIES = 30;

export function PayForBooking({
  booking,
  onPaid,
}: {
  booking: Booking;
  // Told the booking as it stands once it says paid, so the page can redraw.
  onPaid?: (booking: Booking) => void;
}) {
  const { t } = useTranslation();
  const params = useSearchParams();
  const returned = params.get('paying') === 'rental' ? readStripeReturn(params) : null;

  const [phase, setPhase] = useState<Phase>(() =>
    booking.paymentStatus === 'paid'
      ? 'paid'
      : returned === 'succeeded' || returned === 'processing'
        ? 'waiting'
        : 'idle',
  );
  const [secret, setSecret] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(
    returned === 'failed' ? t('pay.rental.bankRefused') : null,
  );

  const amount = money(booking.totalDueToday);
  // Whether the deposit is still to be held, so this card can be the one.
  const forDeposit = booking.depositAmount > 0 && booking.depositStatus === 'not_taken';
  const depositSentence = forDeposit
    ? t('pay.rental.depositCard').replace('{amount}', money(booking.depositAmount))
    : null;

  // ---- WAITING FOR THE BOOKING TO SAY PAID ----
  useEffect(() => {
    if (phase !== 'waiting') return;
    let tries = 0;
    let stopped = false;
    const timer = setInterval(async () => {
      tries += 1;
      try {
        const now = await apiClient.getBooking(booking.id);
        if (stopped) return;
        if (now?.paymentStatus === 'paid') {
          clearInterval(timer);
          setPhase('paid');
          onPaid?.(now);
          return;
        }
      } catch {
        // A missed answer is not a failed payment. Ask again.
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
    // onPaid is a callback from the page; only the phase and the booking decide.
  }, [phase, booking.id]);

  if (booking.status === 'cancelled' || booking.paymentStatus === 'refunded') return null;

  const start = async () => {
    setPhase('starting');
    setProblem(null);
    try {
      // The flag only goes with the sentence on screen — see the top of the file.
      const { clientSecret } = await apiClient.startRentalPayment(booking.id, {
        saveCardForDeposit: forDeposit,
      });
      setSecret(clientSecret);
      setPhase('form');
    } catch (caught) {
      if (isUnavailable(caught)) {
        setPhase('off');
      } else if (isApiError(caught) && caught.code === 'already_paid') {
        // Paid already — on another tab, or the app. Wait for the booking to
        // agree, which it should at once.
        setPhase('waiting');
      } else {
        setProblem(isApiError(caught) ? caught.message : t('pay.form.failed'));
        setPhase('idle');
      }
    }
  };

  const returnUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/account/rentals/${encodeURIComponent(booking.id)}?paying=rental`;

  return (
    <Card padded data-print="hide">
      <div className={styles.panelHead}>
        <Text variant="label" as="h2" raw>
          {t('pay.rental.title')}
        </Text>
        <Text variant="h3" as="span" raw>
          {amount}
        </Text>
      </div>

      {phase === 'paid' ? (
        <div className={styles.stack}>
          <div className={styles.line}>
            <Icon name="checkmark-circle-outline" size={18} color="var(--success)" />
            <Text variant="body" raw>
              {t('pay.rental.paid').replace('{amount}', amount)}
            </Text>
          </div>
        </div>
      ) : phase === 'waiting' ? (
        <div className={styles.stack} role="status">
          <div className={styles.line}>
            <Icon name="time-outline" size={18} color="var(--ink2)" />
            <Text variant="body" tone="ink2" raw>
              {t('pay.rental.confirming')}
            </Text>
          </div>
        </div>
      ) : phase === 'slow' ? (
        <div className={styles.stack} role="status">
          <div className={styles.line}>
            <Icon name="checkmark-circle-outline" size={18} color="var(--success)" />
            <Text variant="body" tone="ink2" raw>
              {t('pay.rental.slow')}
            </Text>
          </div>
        </div>
      ) : phase === 'off' ? (
        <div className={styles.stack}>
          <div className={styles.line}>
            <Icon name="information-circle-outline" size={18} color="var(--ink2)" />
            <Text variant="small" tone="ink2" raw>
              {t('pay.rental.off').replace('{amount}', amount)}
            </Text>
          </div>
        </div>
      ) : phase === 'form' && secret ? (
        <>
          {depositSentence ? <DepositCardNote sentence={depositSentence} /> : null}
          <CardForm
            clientSecret={secret}
            kind="payment"
            returnUrl={returnUrl}
            submitLabel={t('pay.rental.payAmount').replace('{amount}', amount)}
            onConfirmed={() => setPhase('waiting')}
            onCancel={() => setPhase('idle')}
          />
        </>
      ) : (
        <div className={styles.stack}>
          <Text variant="small" tone="ink2" raw>
            {booking.paymentStatus === 'failed' ? t('pay.rental.lastFailed') : t('pay.rental.intro')}
          </Text>
          {depositSentence ? <DepositCardNote sentence={depositSentence} /> : null}
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
              label={t('pay.rental.payByCard').replace('{amount}', amount)}
              size="md"
              loading={phase === 'starting'}
              onClick={start}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

// The sentence the customer agrees to by paying. Shown beside the button and
// above the card form, so it cannot be scrolled past unseen.
function DepositCardNote({ sentence }: { sentence: string }) {
  return (
    <div className={styles.line}>
      <Icon name="shield-outline" size={16} color="var(--ink2)" />
      <Text variant="small" tone="ink2" raw>
        {sentence}
      </Text>
    </div>
  );
}

export default PayForBooking;
