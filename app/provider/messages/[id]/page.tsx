// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One conversation with a renter, opened directly by its
// own address — which is what lets a booking page link straight to it.

import React from 'react';
import { ProviderMessagesView } from '@/components/business/ProviderMessagesView';

type PageProps = { params: Promise<{ id: string }> };

export default async function ProviderThreadPage({ params }: PageProps) {
  const { id } = await params;
  return <ProviderMessagesView threadId={id} />;
}
