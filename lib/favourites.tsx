'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Remembers which cars someone has tapped the heart on.
// The heart appears on every car card and on the car detail screen, and the
// saved list is shown under Profile.
//
// The list is kept on the phone only. Once there is a real backend it should
// move to the customer's account so it follows them to another device.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import storage from '@/lib/storage';

type FavouritesValue = {
  // The ids of every saved car.
  favourites: string[];
  isFavourite: (vehicleId: string) => boolean;
  toggleFavourite: (vehicleId: string) => void;
  count: number;
};

const FavouritesContext = createContext<FavouritesValue | null>(null);

const STORAGE_KEY = 'sxm.favourites';

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);

  // Read back the saved list when the app opens.
  useEffect(() => {
    storage.getItem(STORAGE_KEY).then((saved) => {
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFavourites(parsed);
      } catch {
        // If the saved list is damaged, start again with an empty one rather
        // than crashing the app on launch.
      }
    });
  }, []);

  const toggleFavourite = (vehicleId: string) => {
    setFavourites((current) => {
      const next = current.includes(vehicleId)
        ? current.filter((id) => id !== vehicleId)
        : [...current, vehicleId];
      storage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<FavouritesValue>(
    () => ({
      favourites,
      isFavourite: (id: string) => favourites.includes(id),
      toggleFavourite,
      count: favourites.length,
    }),
    [favourites],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites(): FavouritesValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error('useFavourites must be used inside FavouritesProvider (check app/layout.tsx)');
  }
  return ctx;
}
