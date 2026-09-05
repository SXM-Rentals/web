// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The messages page with no particular conversation chosen.
// On a wide screen the first conversation opens on its own, because a full list
// of conversations beside an empty panel looks like something failed to load.

import React from 'react';
import { MessagesView } from '@/components/messages/MessagesView';

export default function MessagesPage() {
  return <MessagesView />;
}
