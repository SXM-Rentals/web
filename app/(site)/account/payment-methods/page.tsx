'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The customer's saved cards — adding one, choosing which
// comes first, and removing one.
//
// THERE ARE STILL NO CARD FIELDS OF OURS. A card is saved through Stripe's own
// form, in "save" mode (components/payments/CardForm.tsx): the number goes
// from the browser to Stripe and never touches this site or the backend. All
// that comes back is the brand, the last four digits and the expiry — enough
// to recognise your own card, and useless to anybody else.
//
// SAVING IS NOT PAYING. A saved card is kept for the customer to choose when
// they pay, never charged while they are not there: Stripe is told "on
// session" only. And, for now, the payment form does not offer saved cards —
// the backend starts each payment without the customer's Stripe record
// attached, which is what offering them needs (docs/backend-asks.md). The page
// says so rather than promising a shortcut that is not there yet.

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { isApiError, isUnavailable } from '@/lib/api/errors';
import { useAsyncData } from '@/hooks/useAsyncData';
import { CardForm, readStripeReturn } from '@/components/payments/CardForm';
import {
  Button,
  Card,
  ComingSoonBadge,
  Dialog,
  EmptyState,
  ErrorState,
  Icon,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import type { SavedCard } from '@/types';
import styles from '../account.module.css';
import { useTranslation } from '@/lib/i18n';

const BRANDS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  diners: 'Diners Club',
  jcb: 'JCB',
  unionpay: 'UnionPay',
};

const brandName = (brand: string) => BRANDS[brand.toLowerCase()] ?? brand.charAt(0).toUpperCase() + brand.slice(1);

export default function PaymentMethodsPage() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const returned = params.get('saving') === 'card' ? readStripeReturn(params) : null;

  const { data, loading, error, unavailable, refresh } = useAsyncData((signal) => apiClient.listCards(signal), []);
  // What changing a card handed back, shown in place of the first list.
  const [changed, setChanged] = useState<SavedCard[] | null>(null);
  const cards = changed ?? data ?? [];

  const [secret, setSecret] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [working, setWorking] = useState(false);
  const [removing, setRemoving] = useState<SavedCard | null>(null);
  const [problem, setProblem] = useState<string | null>(returned === 'failed' ? t('pay.cards.bankRefused') : null);
  const [saved, setSaved] = useState(returned === 'succeeded');

  const describe = (caught: unknown) =>
    isUnavailable(caught) ? t('pay.cards.off') : isApiError(caught) ? caught.message : t('pay.form.failed');

  const add = async () => {
    setStarting(true);
    setProblem(null);
    setSaved(false);
    try {
      const { clientSecret } = await apiClient.startCardSetup();
      setSecret(clientSecret);
    } catch (caught) {
      setProblem(describe(caught));
    } finally {
      setStarting(false);
    }
  };

  const act = async (job: () => Promise<SavedCard[] | void>) => {
    setWorking(true);
    setProblem(null);
    try {
      const next = await job();
      if (next) setChanged(next);
      else {
        setChanged(null);
        refresh();
      }
    } catch (caught) {
      setProblem(describe(caught));
    } finally {
      setWorking(false);
    }
  };

  const returnUrl =
    typeof window === 'undefined' ? '' : `${window.location.origin}/account/payment-methods?saving=card`;

  const head = (
    <div className={styles.pageHead}>
      <div className={styles.headText}>
        <Text variant="h1" as="h1" raw>
          {t('acct.pay.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('acct.pay.subtitle')}
        </Text>
      </div>
      {unavailable ? <ComingSoonBadge label={t('acct.pay.notConnected')} /> : null}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.page}>
        {head}
        <Skeleton height={140} radius="var(--radius-lg)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        {head}
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {head}

      {unavailable ? (
        <EmptyState title={t('acct.pay.noCardsTitle')} body={t('pay.cards.off')} icon="card-outline" />
      ) : (
        <Card padded>
          {cards.length === 0 && !secret ? (
            <Text variant="body" tone="ink2" raw>
              {t('pay.cards.none')}
            </Text>
          ) : null}

          {cards.length > 0 ? (
            <div className={styles.infoRows}>
              {cards.map((card) => (
                <div key={card.id} className={styles.infoRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', minWidth: 0 }}>
                    <Icon name="card-outline" size={18} color="var(--ink2)" />
                    <div>
                      <Text variant="body" as="span" raw>
                        {`${brandName(card.brand)} •••• ${card.last4}`}
                      </Text>
                      <Text variant="caption" tone="ink3" raw>
                        {t('pay.cards.expires')
                          .replace('{month}', String(card.expMonth).padStart(2, '0'))
                          .replace('{year}', String(card.expYear))}
                      </Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                    {card.isDefault ? (
                      <StatusPill label={t('pay.cards.default')} tone="brand" />
                    ) : (
                      <Button
                        label={t('pay.cards.makeDefault')}
                        variant="ghost"
                        size="sm"
                        disabled={working}
                        onClick={() => act(() => apiClient.makeDefaultCard(card.id))}
                      />
                    )}
                    <Button
                      label={t('pay.cards.remove')}
                      variant="outline"
                      size="sm"
                      disabled={working}
                      onClick={() => setRemoving(card)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {saved ? (
            <div className={styles.note} role="status">
              <Icon name="checkmark-circle-outline" size={16} color="var(--success)" />
              <Text variant="small" tone="ink2" raw>
                {t('pay.cards.saved')}
              </Text>
            </div>
          ) : null}

          {problem ? (
            <div className={styles.note} role="alert">
              <Icon name="alert-circle-outline" size={16} color="var(--danger)" />
              <Text variant="small" tone="ink2" raw>
                {problem}
              </Text>
            </div>
          ) : null}

          {secret ? (
            <CardForm
              clientSecret={secret}
              kind="setup"
              returnUrl={returnUrl}
              submitLabel={t('pay.cards.save')}
              onConfirmed={() => {
                setSecret(null);
                setSaved(true);
                setChanged(null);
                refresh();
              }}
              onCancel={() => setSecret(null)}
            />
          ) : (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <Button label={t('pay.cards.add')} size="md" variant="secondary" loading={starting} onClick={add} />
            </div>
          )}
        </Card>
      )}

      {/* ---- HOW CARDS ARE HANDLED ---- */}
      <Card padded>
        <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
          {t('acct.pay.howTitle')}
        </Text>

        <div className={styles.note} style={{ marginTop: 0 }}>
          <Icon name="lock-closed-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('acct.pay.stripeNote')}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="shield-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('pay.cards.neverCharged')}
          </Text>
        </div>

        <div className={styles.note}>
          <Icon name="information-circle-outline" size={16} color="var(--ink2)" />
          <Text variant="small" tone="ink2" raw>
            {t('pay.cards.notAtCheckoutYet')}
          </Text>
        </div>

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Button label={t('acct.pay.readPolicy')} href="/legal/payment-policy" variant="outline" size="sm" />
        </div>
      </Card>

      <Dialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title={t('pay.cards.removeTitle')}
        body={
          removing
            ? t('pay.cards.removeBody').replace('{card}', `${brandName(removing.brand)} •••• ${removing.last4}`)
            : ''
        }
        confirmLabel={t('pay.cards.remove')}
        destructive
        loading={working}
        onConfirm={async () => {
          const card = removing;
          if (!card) return;
          await act(() => apiClient.removeCard(card.id));
          setRemoving(null);
        }}
      />
    </div>
  );
}
