'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The last step before closing something for good — an
// account, or a rental business. It says what will happen, asks for the
// password again, and asks the person to tick that they understand.
//
// ---- WHY THE PASSWORD AGAIN ----
//
// Being signed in is not proof enough. A session left open on a shared or
// borrowed computer would otherwise let anybody end an account, or take every
// car a business has off the site. The backend checks the password for both.
// (Closing a business used to take none, and the site asked for the business's
// name to be typed instead. The backend asks for the password since
// 2026-09-28, so the site does too.)
//
// ---- WHAT A REFUSAL LOOKS LIKE ----
//
// The backend refuses to close anything while a rental is coming up or out, a
// deposit is held, or — for a business — a payment to it is on its way, and
// says which. Its sentence is shown as it is. A backend without the address
// for closing answers "not connected yet", and this says so, with the address
// to email instead, so nobody is left with no way out.

import React, { useState } from 'react';
import { isApiError, isUnavailable } from '@/lib/api/errors';
import { CONTACT_EMAIL } from '@/lib/social';
import { Button, Checkbox, Icon, PasswordInput, Sheet, Text } from '@/components/ui';
import styles from './CloseForGood.module.css';
import { useTranslation } from '@/lib/i18n';

export function CloseForGood({
  open,
  onClose,
  title,
  body,
  understandLabel,
  confirmLabel,
  action,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** What closing does, in a sentence or two. */
  body: string;
  /** "I understand …" — the tick that must be given before closing. */
  understandLabel: string;
  confirmLabel: string;
  /** The request itself, given the password. */
  action: (password: string) => Promise<void>;
  /** Called once it has closed. */
  onDone: () => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const ready = password.length > 0 && understood && !working;

  // A fresh start every time: a password must never still be sitting in the
  // box from an earlier attempt.
  const close = () => {
    setPassword('');
    setUnderstood(false);
    setProblem(null);
    onClose();
  };

  const confirm = async () => {
    if (!ready) return;
    setWorking(true);
    setProblem(null);
    try {
      await action(password);
      setPassword('');
      await onDone();
    } catch (caught) {
      if (isUnavailable(caught)) {
        setProblem(t('close.notConnected').replace('{email}', CONTACT_EMAIL));
      } else if (
        isApiError(caught) &&
        (caught.code === 'wrong_password' || caught.code === 'invalid_credentials')
      ) {
        setProblem(t('close.wrongPassword'));
      } else {
        setProblem(isApiError(caught) ? caught.message : t('close.failed'));
      }
    } finally {
      setWorking(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') confirm();
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      title={title}
      footer={
        <>
          <Button label={t('common.cancel')} variant="outline" size="md" onClick={close} />
          <Button
            label={confirmLabel}
            variant="danger"
            size="md"
            loading={working}
            disabled={!password || !understood}
            onClick={confirm}
          />
        </>
      }
    >
      <div className={styles.stack}>
        <Text variant="body" tone="ink2" raw>
          {body}
        </Text>

        <PasswordInput
          label={t('close.passwordLabel')}
          hint={t('close.passwordHint')}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={onKeyDown}
        />

        <Checkbox checked={understood} onChange={setUnderstood} label={understandLabel} />

        {problem ? (
          <div className={styles.problem} role="alert">
            <Icon name="alert-circle-outline" size={16} color="var(--danger)" />
            <Text variant="small" tone="ink2" raw>
              {problem}
            </Text>
          </div>
        ) : null}
      </div>
    </Sheet>
  );
}

export default CloseForGood;
