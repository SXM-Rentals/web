// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One conversation, opened directly by its own address.
// Having a real address for each conversation means one can be bookmarked, or
// linked to from a notification, and it opens straight to the right place.

import React from 'react';
import { MessagesView } from '@/components/messages/MessagesView';

type PageProps = { params: Promise<{ id: string }> };

export default async function MessageThreadPage({ params }: PageProps) {
  const { id } = await params;
  return <MessagesView threadId={id} />;
}
