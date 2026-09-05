// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: Made-up alerts for the notifications screen — booking
// confirmations, pickup reminders, deposit updates and so on. On a real phone
// these would also arrive as push notifications; here they only fill the list.

import type { AppNotification } from '@/types';

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    kind: 'booking_confirmed',
    title: 'Booking confirmed',
    body: 'Your Toyota RAV4 is booked for 18–23 September. Marigot Motors will meet you at the airport.',
    sentAt: '2026-09-03T10:00:00Z',
    read: false,
  },
  {
    id: 'n2',
    kind: 'payment',
    title: 'Payment received',
    body: 'We received $433 for booking SXM-4821. Your $500 security deposit has not been taken yet.',
    sentAt: '2026-09-03T10:00:00Z',
    read: false,
  },
  {
    id: 'n3',
    kind: 'pickup_reminder',
    title: 'Pickup tomorrow',
    body: 'Your Hyundai Accent is ready for collection at 9:00am from Simpson Bay Auto.',
    sentAt: '2026-09-03T09:00:00Z',
    read: true,
  },
  {
    id: 'n4',
    kind: 'return_reminder',
    title: 'Return due in 2 days',
    body: 'Booking SXM-4602 ends on 8 September at 9:00am. You can extend from the rental screen.',
    sentAt: '2026-09-02T08:00:00Z',
    read: true,
  },
  {
    id: 'n5',
    kind: 'verification',
    title: 'Identity check approved',
    body: 'Your licence and passport were accepted. You can now book any vehicle on SXM Rentals.',
    sentAt: '2026-09-01T17:22:00Z',
    read: true,
  },
  {
    id: 'n6',
    kind: 'cancellation',
    title: 'Refund on its way',
    body: 'Booking SXM-3710 was cancelled. Your refund of $122 should arrive within 5 working days.',
    sentAt: '2026-08-31T12:10:00Z',
    read: true,
  },
  {
    id: 'n7',
    kind: 'promotion',
    title: 'Deposit released',
    body: 'The $400 deposit held for booking SXM-4180 has been released back to your card.',
    sentAt: '2026-08-30T14:44:00Z',
    read: true,
  },
];
