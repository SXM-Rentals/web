'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Adding a phone number, so a code can be sent by text to
// confirm it is real.
//
// THE DIALLING CODE IS A SEPARATE CHOICE, offering the three that actually
// matter here — the Dutch side is +1 721, the French side is +590, and visitors
// mostly arrive from +1 North America. A single free-text box means half the
// numbers arrive without a country code and the message never gets sent.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Icon, Input, Text, SegmentedControl } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

const CODES = [
  { value: '+1721', label: '+1 721' },
  { value: '+590', label: '+590' },
  { value: '+1', label: '+1' },
];

export default function PhonePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [code, setCode] = useState('+1721');
  const [number, setNumber] = useState('');
  const [working, setWorking] = useState(false);

  // Enough digits to be a real number, without pretending to validate every
  // numbering plan in the world.
  const usable = number.replace(/\D/g, '').length >= 6;

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.phone.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.phone.subtitle')}
        </Text>
      </div>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          setWorking(true);
          window.setTimeout(() => router.push('/otp'), 400);
        }}
      >
        <div>
          <Text variant="label" tone="ink2" as="p" style={{ marginBottom: 'var(--space-sm)' }} raw>
            {t('authp.phone.diallingCode')}
          </Text>
          <SegmentedControl
            label={t('authp.phone.diallingCode')}
            fullWidth
            value={code}
            onChange={setCode}
            options={CODES}
          />
        </div>

        <Input
          label={t('auth.phoneNumber')}
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          iconLeft="call-outline"
          placeholder="555 0110"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          hint="Dutch side numbers start +1 721. French side numbers start +590."
          required
        />

        <Button
          label={t('authp.phone.send')}
          type="submit"
          fullWidth
          size="lg"
          loading={working}
          disabled={!usable}
        />
      </form>

      <Card>
        <div className={styles.note}>
          <Icon name="shield-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('authp.phone.privacyNote')}
          </Text>
        </div>
      </Card>

      <div className={styles.actions}>
        <Button label={t('authp.phone.skip')} variant="ghost" size="md" fullWidth href="/account" />
      </div>
    </>
  );
}
