'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Looks up the business's own cars by id, so a booking, a
// conversation or a performance row can say "Kia Picanto" rather than an id.
//
// ---- WHY THE BUSINESS'S OWN FLEET, AND NOT THE CATALOGUE ----
//
// The public catalogue only has cars customers can see. A business's car that
// is still waiting for staff approval is not in it — and a business is exactly
// the person who needs that car named. So the dashboard looks its cars up in
// GET /providers/me/vehicles, which has every car the business has listed.
//
// ---- THE NAMES ARE A NICETY; THE PAGE IS THE PAGE ----
//
// If the fleet cannot be fetched, the bookings and figures are still shown,
// with "one of your cars" where the name would be. There are two different
// reasons a name can be missing, and they are told apart: the lookup failed
// ("one of your cars"), or it worked and the car is not in the fleet any more,
// because it was removed ("a car no longer in your fleet").

import { useCallback, useMemo } from 'react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { apiClient } from '@/lib/api-client';
import { useTranslation } from '@/lib/i18n';
import type { FleetVehicle } from '@/types';

export function useFleetLookup() {
  const { t } = useTranslation();

  // A lookup that fails costs the names, never the page — so it never errors.
  const state = useAsyncData((signal) => apiClient.getMyFleet(signal).catch(() => null), []);
  const fleet = state.data;

  const byId = useMemo(
    () => new Map((fleet ?? []).map((vehicle) => [vehicle.id, vehicle])),
    [fleet],
  );

  /** The car itself, when it is in the fleet. */
  const vehicle = useCallback(
    (id: string | undefined): FleetVehicle | undefined => (id ? byId.get(id) : undefined),
    [byId],
  );

  /** What to call the car — its name, or which of the two reasons it has none. */
  const name = useCallback(
    (id: string | undefined): string => {
      const car = id ? byId.get(id) : undefined;
      if (car) return `${car.make} ${car.model}`;
      return fleet ? t('pp.car.removed') : t('pp.car.unknown');
    },
    [byId, fleet, t],
  );

  return {
    /** True until the fleet has been asked for once. Hold the names until then. */
    loading: state.loading,
    vehicle,
    name,
  };
}
