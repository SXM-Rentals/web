// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The notice that sits at the top of a screen which is
// finished to look at but has nothing behind it yet.
//
// ---- WHY THESE SCREENS ARE STILL HERE ----
//
// Five screens were built for a part of the product the backend does not have:
// confirming a phone number by text, and the identity check. They work as
// screens — every state, every way the camera can fail — and none of them can
// do anything, because there is no address to send a photo or a code to.
//
// The choice was to delete them or to keep them and say so. Keeping them won:
// the work is done and correct, deleting it means doing it again later, and
// the only real risk was somebody being led into one and finding it does
// nothing. That risk is handled by this notice plus the removal of every link
// into them from the rest of the site, rather than by throwing the screens
// away.
//
// ---- WHAT IT DOES NOT DO ----
//
// It does not disable anything. The buttons still move between the screens, so
// the flow can still be walked through and shown. What it does is make sure
// nobody walks through it believing a photo was sent anywhere.
//
// DELETE THIS, and the notice from the five screens, when the backend gains
// the endpoints. Nothing else has to change — the screens are already written
// against the real shapes.

import React from 'react';
import { Icon, Text } from '@/components/ui';
import styles from './NotConnectedNotice.module.css';

export function NotConnectedNotice({
  /** What is not connected, in a few words — "Sending a code by text". */
  what,
}: {
  what: string;
}) {
  return (
    <div className={styles.notice} role="note">
      <span className={styles.icon}>
        <Icon name="construct-outline" size={18} />
      </span>
      <div className={styles.text}>
        <Text variant="label" as="p" raw>
          Not connected yet
        </Text>
        <Text variant="small" tone="ink2" raw>
          {`${what} is not built on our side yet. You can look through this screen, but nothing you enter here is sent or saved.`}
        </Text>
      </div>
    </div>
  );
}
