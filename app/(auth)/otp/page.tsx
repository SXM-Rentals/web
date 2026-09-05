'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Typing in the six-digit code sent by text message.
//
// SIX SEPARATE BOXES ARE MORE WORK THAN ONE, and worth it — they make the length
// of the code obvious and are much easier to read back when checking a digit.
// But they only work if three details are right, and all three are handled here:
//
//   1. Typing a digit moves to the next box on its own.
//   2. Backspace on an empty box moves back and clears the one before, rather
//      than getting stuck.
//   3. Pasting the whole code fills every box at once. People paste these far
//      more often than they type them, and boxes that only accept one character
//      each turn a paste into a single stray digit.
//
// The whole row is also one labelled group, so a screen reader announces what is
// being asked for instead of six unexplained text boxes.

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Icon, Text } from '@/components/ui';
import styles from '../auth.module.css';
import { useTranslation } from '@/lib/i18n';

const LENGTH = 6;

export default function OtpPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [working, setWorking] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) return;

    setDigits((current) => {
      const next = [...current];
      next[index] = cleaned[cleaned.length - 1];
      return next;
    });

    // Move along to the next box.
    if (index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();

      setDigits((current) => {
        const next = [...current];
        // If this box is already empty, clear and move to the one before —
        // otherwise backspace appears to do nothing at all.
        if (!next[index] && index > 0) {
          next[index - 1] = '';
          inputs.current[index - 1]?.focus();
        } else {
          next[index] = '';
        }
        return next;
      });
      return;
    }

    // The arrow keys move between boxes, as they would in any row of fields.
    if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  // Pasting the whole code fills every box at once.
  const onPaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;

    const next = Array(LENGTH).fill('');
    pasted.split('').forEach((digit, index) => {
      next[index] = digit;
    });
    setDigits(next);
    inputs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const code = digits.join('');
  const complete = code.length === LENGTH;

  return (
    <>
      <div className={styles.head}>
        <Text variant="h1" as="h1" raw>
          {t('authp.otp.title')}
        </Text>
        <Text variant="body" tone="ink2" raw>
          {t('authp.otp.subtitle')}
        </Text>
      </div>

      {/* One labelled group rather than six unexplained boxes. */}
      <div role="group" aria-label={t('authp.otp.boxLabel')}>
        <div className={styles.codeRow} onPaste={onPaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              className={styles.codeBox}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(index, event)}
              // Brings up the number pad on a touchscreen, and lets the browser
              // offer the code straight from the text message on Apple devices.
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              aria-label={`Digit ${index + 1} of ${LENGTH}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          label={t('booking.stepConfirm')}
          fullWidth
          size="lg"
          disabled={!complete}
          loading={working}
          onClick={() => {
            setWorking(true);
            window.setTimeout(() => router.push('/account-type'), 500);
          }}
        />
        <Button label={t('authp.otp.resend')} variant="ghost" size="md" fullWidth />
      </div>

      <Card>
        <div className={styles.note}>
          <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
          <Text variant="small" tone="ink3" raw>
            {t('authp.otp.demoNote')}
          </Text>
        </div>
      </Card>
    </>
  );
}
