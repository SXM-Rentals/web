'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The last step before closing something for good — an
// account, or a rental business. It says what will happen, asks for a
// confirmation that cannot be given by accident, and asks the person to tick
// that they understand.
//
// ---- TWO WAYS OF CONFIRMING, AND WHY ----
//
// CLOSING AN ACCOUNT asks for the password again, and the backend checks it.
// Being signed in is not proof enough: a session left open on a shared or
// borrowed computer would otherwise let anybody end the account.
//
// CLOSING A BUSINESS asks for the business's name to be typed. The backend
// does not take a password for this one, and asking for a password that
// nothing checks would be a lock drawn on a door. Typing the name is honest
// about what it is: a guard against a slip, not a security check. (Asking the
// backend to require the password here too is in docs/backend-asks.md.)
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
import { Button, Checkbox, Icon, Input, PasswordInput, Sheet, Text } from '@/components/ui';
import styles from './CloseForGood.module.css';
import { useTranslation } from '@/lib/i18n';

export type CloseConfirmation =
  /** The password, checked by the backend. */
  | { kind: 'password' }
  /** The name, typed out — a guard against a slip, checked here. */
  | { kind: 'typeName'; name: string };

export function CloseForGood({
  open,
  onClose,
  title,
  body,
  understandLabel,
  confirmLabel,
  confirmWith,
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
  confirmWith: CloseConfirmation;
  /** The request itself; given the password when that is how it confirms. */
  action: (password: string) => Promise<void>;
  /** Called once it has closed. */
  onDone: () => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const [typed, setTyped] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const confirmed =
    confirmWith.kind === 'password'
      ? typed.length > 0
      : typed.trim().toLowerCase() === confirmWith.name.trim().toLowerCase();
  const ready = confirmed && understood && !working;

  // A fresh start every time: a password must never still be sitting in the
  // box from an earlier attempt.
  const close = () => {
    setTyped('');
    setUnderstood(false);
    setProblem(null);
    onClose();
  };

  const confirm = async () => {
    if (!ready) return;
    setWorking(true);
    setProblem(null);
    try {
      await action(confirmWith.kind === 'password' ? typed : '');
      setTyped('');
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
            disabled={!confirmed || !understood}
            onClick={confirm}
          />
        </>
      }
    >
      <div className={styles.stack}>
        <Text variant="body" tone="ink2" raw>
          {body}
        </Text>

        {confirmWith.kind === 'password' ? (
          <PasswordInput
            label={t('close.passwordLabel')}
            hint={t('close.passwordHint')}
            autoComplete="current-password"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Input
            label={t('close.typeToConfirm').replace('{name}', confirmWith.name)}
            autoComplete="off"
            spellCheck={false}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={onKeyDown}
          />
        )}

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
