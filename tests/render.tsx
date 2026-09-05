// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Renders a component in a test the way the real app
// renders it — inside the providers it expects to find above it.
//
// WHY IT EXISTS. Almost every component now looks up its own wording, which
// means it needs the language provider somewhere above it. Rendered bare in a
// test it throws "useTranslation must be used inside I18nProvider" — which is
// the provider doing exactly its job, and a useless failure to read when what
// you were testing was a price.
//
// So tests use renderWithProviders() instead of render(). Wrapping more than a
// component strictly needs is deliberate: a test should fail because the
// component is wrong, not because the test forgot a provider.

import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ToastProvider } from '@/components/ui';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>{children}</ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: Providers, ...options });
}

// Re-exported so a test file needs one import rather than two.
export * from '@testing-library/react';
export { renderWithProviders as render };
