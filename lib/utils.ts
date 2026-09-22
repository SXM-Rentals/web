// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Small shared helpers used all over the site: "cx",
// which builds the list of style names an element should carry while quietly
// dropping any that do not apply; "clamp", for keeping a number in range; and
// "safeNextPath", which decides where a sign-in is allowed to send somebody.

// Joins style names together, ignoring anything false, undefined or empty.
// It lets a component write its styling as a plain list of conditions:
//
//   cx(styles.button, isActive && styles.active, disabled && styles.disabled)
//
// without having to check each one first or end up with stray spaces.
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// Keeps a number inside a range. Used by the charts, where a stray value must
// never draw a bar wider than its container.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * The page to go to after signing in, read from a "?next=" note — but only if
 * it is a page on this site.
 *
 * ---- WHY THIS CHECK MATTERS NOW ----
 *
 * The sign-in pages send people wherever "next" says once they are in. With a
 * pretend sign-in that was harmless. With a real one, an unchecked "next" is a
 * tool for anybody writing a phishing email: link to the genuine
 * sxmrentals.app/login?next=https://a-lookalike.site, the person signs in on
 * the real site — every sign of trust in place — and is then handed straight
 * to a fake one that asks for their card.
 *
 * So only a path on this site is accepted. It must start with a single "/";
 * "//elsewhere.com" and "/\elsewhere.com" are addresses on another site that
 * merely look like paths, and browsers treat them that way.
 */
export function safeNextPath(value: string | null | undefined, fallback = '/account'): string {
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  // Anything a browser would read as a scheme or a new host is refused too.
  if (/[\u0000-\u001f]/.test(value) || /^\/[a-z][a-z0-9+.-]*:/i.test(value)) return fallback;
  return value;
}
