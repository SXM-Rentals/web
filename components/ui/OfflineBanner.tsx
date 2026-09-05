'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A strip across the top of the page saying the connection
// has dropped, so a site that has stopped loading things reads as "you are
// offline" rather than "this is broken".
//
// ON THE PHONE THIS IS SWIPED AWAY. There is no swiping with a mouse, so here it
// gets a proper close button instead. It comes back on its own if the connection
// drops again after being restored, because that is a new problem worth
// mentioning rather than the same one being repeated.

import React, { useEffect, useState } from 'react';
import { useNetwork } from '@/lib/network';
import { Text } from './Text';
import { Icon } from './Icon';
import styles from './OfflineBanner.module.css';
import { useTranslation } from '@/lib/i18n';

export function OfflineBanner() {
  const { t } = useTranslation();
  const { online } = useNetwork();
  const [dismissed, setDismissed] = useState(false);

  // Coming back online clears the dismissal, so that a later disconnection is
  // announced again rather than being silently swallowed.
  useEffect(() => {
    if (online) setDismissed(false);
  }, [online]);

  if (online || dismissed) return null;

  return (
    <div
      className={styles.banner}
      // "assertive" interrupts to say this straight away. Losing connection
      // explains everything else that is about to go wrong, so it is worth
      // breaking into whatever is being read.
      role="alert"
      aria-live="assertive"
      data-print="hide"
    >
      <Icon name="cloud-offline-outline" size={19} />

      <div className={styles.body}>
        <Text variant="small" as="span" style={{ color: 'inherit' }} raw>
          {t('error.offline')}
        </Text>
      </div>

      <button
        type="button"
        className={styles.close}
        onClick={() => setDismissed(true)}
        aria-label={t('error.dismiss')}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export default OfflineBanner;
