// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: Made-up points and loyalty status for the Rewards tab.
// Two ideas are kept deliberately separate here, and the screen says so:
//   - TIER (Explorer, Traveler, VIP, Elite) is earned by renting.
//   - ISLANDER is simply whether someone lives on the island. It is not earned
//     and cannot be lost by not renting.
// The whole Rewards tab is marked "Coming Soon", so this is a preview of the
// idea rather than a working points balance.

import type { RewardsProfile, RewardTier } from '@/types';

// Friendly names and the points needed to reach each level.
export const tierLadder: { tier: RewardTier; label: string; pointsRequired: number }[] = [
  { tier: 'explorer', label: 'Explorer', pointsRequired: 0 },
  { tier: 'traveler', label: 'Traveler', pointsRequired: 2500 },
  { tier: 'vip', label: 'VIP', pointsRequired: 7500 },
  { tier: 'elite', label: 'Elite', pointsRequired: 20000 },
];

// How points are earned, taken from the Overview document. These are a first
// draft of the idea, not final numbers.
export const earningRules: { label: string; points: string }[] = [
  { label: 'Every $1 you spend on a rental', points: '1 point' },
  { label: 'Each day of a rental', points: '+10 points' },
  { label: 'Completing a rental', points: '+50 points' },
  { label: 'Booking with us again', points: '+100 points' },
  { label: 'A friend you referred completes a rental', points: '+500 points' },
  { label: 'Spending at a partner business', points: 'Varies' },
];

// Example rewards. The Overview document is clear that this list is
// illustrative — it shows what the scheme could offer, not a promise.
export const exampleBenefits: string[] = [
  'Discounts on rentals',
  'Priority customer support',
  'Free or discounted delivery',
  'Airport transfer discounts',
  'Partner restaurant and activity offers',
  'Birthday and referral bonuses',
];

export const mockRewards: RewardsProfile = {
  points: 3180,
  tier: 'traveler',
  pointsToNextTier: 4320,
  nextTier: 'vip',
  isIslander: false,
  history: [
    { id: 'h1', label: 'Completed rental SXM-4180', points: 50, date: '2026-07-15' },
    { id: 'h2', label: 'Rental spend — Suzuki Jimny', points: 248, date: '2026-07-15' },
    { id: 'h3', label: '4 rental days', points: 40, date: '2026-07-15' },
    { id: 'h4', label: 'Completed rental SXM-3944', points: 50, date: '2026-05-24' },
    { id: 'h5', label: 'Rental spend — Jeep Wrangler', points: 380, date: '2026-05-24' },
    { id: 'h6', label: 'Repeat booking bonus', points: 100, date: '2026-05-09' },
  ],
};
