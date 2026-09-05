// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: Made-up conversations between the customer and the
// rental businesses, filling the Messages tab and the chat screen. Nothing is
// sent or received — typing a message here only updates what is on screen.

import type { ChatThread } from '@/types';

export const mockThreads: ChatThread[] = [
  {
    id: 't1',
    providerId: 'p1',
    bookingRef: 'SXM-4602',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        from: 'provider',
        body: 'Morning! Your Accent is washed and ready. We are open from 8am if you want to collect early.',
        sentAt: '2026-09-03T08:12:00Z',
        read: true,
      },
      {
        id: 'm2',
        from: 'customer',
        body: 'Great, thanks. I should be there around nine.',
        sentAt: '2026-09-03T08:20:00Z',
        read: true,
      },
      {
        id: 'm3',
        from: 'provider',
        body: 'No problem. Bring the licence you uploaded and we will have the paperwork ready.',
        sentAt: '2026-09-03T08:22:00Z',
        read: false,
      },
      {
        id: 'm4',
        from: 'provider',
        body: 'One more thing — parking at the front is being resurfaced, so use the side entrance on Airport Road.',
        sentAt: '2026-09-03T09:05:00Z',
        read: false,
      },
    ],
  },
  {
    id: 't2',
    providerId: 'p2',
    bookingRef: 'SXM-4821',
    unreadCount: 0,
    messages: [
      {
        id: 'm5',
        from: 'customer',
        body: 'Hi, is the RAV4 still free for the 18th to the 23rd?',
        sentAt: '2026-08-30T13:40:00Z',
        read: true,
      },
      {
        id: 'm6',
        from: 'provider',
        body: 'Yes it is. Would you like it delivered to the airport or will you collect from Marigot?',
        sentAt: '2026-08-30T13:52:00Z',
        read: true,
      },
      {
        id: 'm6b',
        from: 'provider',
        body: 'If you want more room for the same money, this one is also free those dates:',
        vehicleId: 'v8',
        sentAt: '2026-08-30T13:55:00Z',
        read: true,
      },
      {
        id: 'm7',
        from: 'customer',
        body: 'Airport please, arriving 10:30.',
        sentAt: '2026-08-30T14:01:00Z',
        read: true,
      },
      {
        id: 'm8',
        from: 'provider',
        body: 'Booked in. We will meet you at arrivals with a sign.',
        sentAt: '2026-08-30T14:05:00Z',
        read: true,
      },
    ],
  },
  {
    id: 't3',
    providerId: 'p5',
    bookingRef: 'SXM-4180',
    unreadCount: 0,
    messages: [
      {
        id: 'm9',
        from: 'provider',
        body: 'Thanks for returning the Jimny in such good condition. Your deposit has been released.',
        sentAt: '2026-07-15T15:30:00Z',
        read: true,
      },
      {
        id: 'm10',
        from: 'customer',
        body: 'Appreciated, thank you. Will book again next trip.',
        sentAt: '2026-07-15T16:02:00Z',
        read: true,
      },
    ],
  },
  {
    id: 't4',
    providerId: 'p4',
    unreadCount: 0,
    messages: [
      {
        id: 'm11',
        from: 'customer',
        body: 'Do you allow the Wrangler to be driven on the Dutch side?',
        sentAt: '2026-06-11T10:15:00Z',
        read: true,
      },
      {
        id: 'm12',
        from: 'provider',
        body: 'Yes, anywhere on the island is fine. There is no restriction between the two sides.',
        sentAt: '2026-06-11T10:31:00Z',
        read: true,
      },
    ],
  },
];

export function findThread(id: string): ChatThread | undefined {
  return mockThreads.find((t) => t.id === id);
}
