'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The small label saying whether customers can see a car
// yet — live, waiting for staff approval, or suspended.
//
// A car a business has just added is not in search until SXM Rentals staff
// have approved it. Without this label it would sit in the fleet looking
// exactly like the cars customers can book, and the first sign anything was
// different would be that nobody booked it.

import React from 'react';
import { StatusPill } from '@/components/ui';
import type { ListingStatus } from '@/types';
import { useTranslation } from '@/lib/i18n';

export function ListingStatusPill({ status }: { status: ListingStatus }) {
  const { t } = useTranslation();

  if (status === 'live') return <StatusPill label={t('pp.listing.live')} tone="success" />;
  if (status === 'pending_review') {
    return <StatusPill label={t('pp.listing.pending')} tone="warning" />;
  }
  return <StatusPill label={t('pp.listing.suspended')} tone="danger" />;
}

export default ListingStatusPill;
