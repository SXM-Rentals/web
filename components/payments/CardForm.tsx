'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Stripe's own card form, on our page, for one of three
// jobs: paying for a rental, holding a deposit, or saving a card.
//
// ---- THE CARD NUMBER NEVER TOUCHES SXM RENTALS ----
//
// The fields are Stripe's, drawn in a frame that belongs to Stripe. What is
// typed goes from the browser straight to Stripe; neither this site nor the
// backend ever sees it. That is what keeps SXM Rentals out of the strictest
// card-handling rules, and it is why this file has no card fields of its own.
//
// ---- "IT WENT THROUGH" IS STRIPE'S WORD, NOT OURS ----
//
// When Stripe says the payment went through, this form says so and hands back
// — but the booking is only marked paid when Stripe tells the backend, a
// moment later. The pieces that use this form (PayForBooking, HoldDeposit)
// wait for that before they say "paid".
//
// ---- THE BANK'S OWN CHECK ----
//
// Some cards need the bank to approve the payment, in a window of its own or
// on the bank's page. Stripe handles that; if it has to leave this page, it
// comes back to `returnUrl`, and the page there reads how it went from the
// address (see readStripeReturn below).

import React, { useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { getStripe, STRIPE_TEST_MODE } from '@/lib/stripe-client';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { Button, Icon, Text } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import styles from './CardForm.module.css';

export type CardFormKind = 'payment' | 'setup';

// Stripe's form drawn in the site's own colours and corners, read from the
// page so it follows light and dark mode with everything else.
function useAppearance(): Appearance {
  const { scheme } = useTheme();
  return useMemo(() => {
    const read = (name: string, fallback: string) => {
      if (typeof window === 'undefined') return fallback;
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || fallback;
    };
    const dark = scheme === 'dark';
    return {
      theme: dark ? 'night' : 'stripe',
      variables: {
        colorPrimary: read('--brand', dark ? '#f3f5f7' : '#0e1114'),
        colorBackground: read('--card', dark ? '#16191d' : '#ffffff'),
        colorText: read('--ink', dark ? '#f3f5f7' : '#0e1114'),
        colorTextSecondary: read('--ink2', dark ? '#b4bac2' : '#4b5563'),
        colorDanger: read('--danger', '#d92d20'),
        borderRadius: '12px',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      },
    };
  }, [scheme]);
}

function Form({
  kind,
  returnUrl,
  submitLabel,
  onConfirmed,
  onCancel,
}: {
  kind: CardFormKind;
  returnUrl: string;
  submitLabel: string;
  onConfirmed: (status: string) => void;
  onCancel?: () => void;
}) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || working) return;
    setWorking(true);
    setProblem(null);

    // Only leaves the page if the bank insists on it.
    const result =
      kind === 'payment'
        ? await stripe.confirmPayment({ elements, confirmParams: { return_url: returnUrl }, redirect: 'if_required' })
        : await stripe.confirmSetup({ elements, confirmParams: { return_url: returnUrl }, redirect: 'if_required' });

    if (result.error) {
      // Stripe's sentence, which it writes for the person paying: "Your card
      // was declined." "Your card's security code is incomplete."
      setProblem(result.error.message ?? t('pay.form.failed'));
      setWorking(false);
      return;
    }
    const status =
      'paymentIntent' in result && result.paymentIntent
        ? result.paymentIntent.status
        : 'setupIntent' in result && result.setupIntent
          ? result.setupIntent.status
          : 'succeeded';
    onConfirmed(status);
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      {STRIPE_TEST_MODE ? (
        <div className={styles.testMode} role="note">
          <Icon name="information-circle-outline" size={15} color="var(--warning)" />
          <Text variant="small" tone="ink2" raw>
            {t('pay.form.testMode')}
          </Text>
        </div>
      ) : null}

      <PaymentElement onChange={(event) => setComplete(event.complete)} />

      {problem ? (
        <div className={styles.problem} role="alert">
          <Icon name="alert-circle-outline" size={15} color="var(--danger)" />
          <Text variant="small" tone="ink2" raw>
            {problem}
          </Text>
        </div>
      ) : null}

      <div className={styles.actions}>
        <Button
          label={submitLabel}
          type="submit"
          size="md"
          loading={working}
          disabled={!stripe || !elements || !complete}
        />
        {onCancel ? (
          <Button label={t('common.cancel')} variant="outline" size="md" onClick={onCancel} disabled={working} />
        ) : null}
      </div>

      <div className={styles.secure}>
        <Icon name="lock-closed-outline" size={14} color="var(--ink3)" />
        <Text variant="caption" tone="ink3" raw>
          {t('pay.form.secure')}
        </Text>
      </div>
    </form>
  );
}

/** Stripe's card form, ready for the secret the backend handed over. */
export function CardForm({
  clientSecret,
  ...rest
}: {
  clientSecret: string;
  kind: CardFormKind;
  returnUrl: string;
  submitLabel: string;
  onConfirmed: (status: string) => void;
  onCancel?: () => void;
}) {
  const appearance = useAppearance();
  return (
    // Keyed by the secret: Stripe's form cannot be pointed at a new payment
    // once drawn, so a new one gets a new form.
    <Elements key={clientSecret} stripe={getStripe()} options={{ clientSecret, appearance }}>
      <Form {...rest} />
    </Elements>
  );
}

/**
 * How a payment or a saved card went, when Stripe had to take the person to
 * their bank's page and has just sent them back here. Stripe puts it in the
 * address; nothing else is read from there.
 */
export function readStripeReturn(params: URLSearchParams): 'succeeded' | 'processing' | 'failed' | null {
  const status = params.get('redirect_status');
  if (!status) return null;
  if (status === 'succeeded') return 'succeeded';
  if (status === 'processing' || status === 'pending') return 'processing';
  return 'failed';
}

export default CardForm;
