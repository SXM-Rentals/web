// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: A made-up signed-in customer, plus ready-made versions of
// that same person at each stage of the identity check. Being able to switch
// between them lets us see how the "waiting", "approved", "rejected" and
// "please try again" screens actually look without needing a real ID service.

import type { User, VerificationStatus } from '@/types';

export const mockUser: User = {
  id: 'u1',
  firstName: 'Benjamin',
  lastName: 'Jack',
  email: 'benjamin.jack@example.com',
  phone: '+1 721 555 0110',
  accountType: 'tourist',
  verification: {
    status: 'approved',
    selfieDone: true,
    licenseDone: true,
    identityDocDone: true,
    submittedAt: '2026-08-28T09:14:00Z',
  },
  isIslander: false,
  memberSince: '2026-06-02',
};

// The same customer shown at each stage, so every version of the verification
// screen can be checked during development.
export const mockUsersByVerification: Record<VerificationStatus, User> = {
  unstarted: {
    ...mockUser,
    verification: {
      status: 'unstarted',
      selfieDone: false,
      licenseDone: false,
      identityDocDone: false,
    },
  },
  pending: {
    ...mockUser,
    verification: {
      status: 'pending',
      selfieDone: true,
      licenseDone: true,
      identityDocDone: true,
      submittedAt: '2026-09-02T16:40:00Z',
    },
  },
  approved: mockUser,
  rejected: {
    ...mockUser,
    verification: {
      status: 'rejected',
      selfieDone: true,
      licenseDone: true,
      identityDocDone: true,
      reason:
        'The photo of your driving licence was too blurred to read the expiry date. Please take a new photo in good light with the whole licence inside the frame.',
      submittedAt: '2026-09-01T11:02:00Z',
    },
  },
  resubmit: {
    ...mockUser,
    verification: {
      status: 'resubmit',
      selfieDone: true,
      licenseDone: false,
      identityDocDone: true,
      reason: 'We still need a clear photo of your driving licence.',
      submittedAt: '2026-09-01T11:02:00Z',
    },
  },
};

// A resident rather than a visitor — used to check the Islander badge and the
// different set of documents a local person is asked for.
export const mockLocalUser: User = {
  ...mockUser,
  id: 'u2',
  firstName: 'Nadine',
  lastName: 'Richardson',
  email: 'nadine.richardson@example.com',
  accountType: 'local',
  isIslander: true,
};
