// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The page shown when an address does not exist — a car
// that has been removed, a mistyped link, or an old bookmark.
//
// IT OFFERS A WAY ONWARDS RATHER THAN JUST SAYING NO. A bare "404" leaves people
// with nothing but the back button, and most of the time they arrived here from
// a search result or a shared link, so there is nothing behind them to go back
// to. The two links below cover almost every reason somebody lands here.

import React from 'react';
import { Button, Icon, Text } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />

      <main
        id="main"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 'var(--space-lg)',
          padding: 'var(--space-5xl) var(--space-lg)',
        }}
      >
        <span
          style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: 'var(--tile)',
            color: 'var(--ink2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="search" size={34} />
        </span>

        <Text variant="h1" as="h1" align="center">
          We could not find that page
        </Text>

        <Text variant="bodyLg" tone="ink2" align="center" style={{ maxWidth: 460 }}>
          The address may be wrong, or the car may have been taken off the platform.
          Everything available on the island is on the search page.
        </Text>

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button label="Find a car" href="/search" size="md" />
          <Button label="Back to the homepage" href="/" variant="outline" size="md" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
