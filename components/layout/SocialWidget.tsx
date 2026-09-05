'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The small round button fixed in the bottom corner of
// every page. Clicking it fans the share options upward one after another;
// clicking again folds them back down. A lightweight, playful touch rather than
// a static row of icons buried in the footer.
//
// IT IS ON EVERY PAGE, not just the homepage — customer pages and the rental
// business's dashboard alike. Somebody decides to pass a car on to a friend
// while they are looking at that car, not after they have walked all the way
// back to the front door. A share button that is only on the homepage is a
// share button that is never in the right place.
//
// SHARING BY EMAIL AND COPYING THE LINK sit in the same row as the social
// accounts, because they are the same job: getting SXM Rentals in front of
// somebody else. They are also the two people actually use — pasting a link
// into a group chat, or forwarding a car to whoever is paying, is how a rental
// gets decided far more often than following a page.
//
// THE SOCIAL ACCOUNTS DO NOT EXIST YET, so the addresses in lib/social.ts are
// empty and those buttons say so when clicked. Email and copy work properly
// today, and they share the page being looked at rather than always sending
// people back to the homepage.

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/utils';
import { Icon, BrandIcon, useToast } from '@/components/ui';
import { SOCIAL_LINKS } from '@/lib/social';
import styles from './SocialWidget.module.css';

export function SocialWidget() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  // Watched only so that changing page folds the panel away — see below.
  const pathname = usePathname();

  // Folds away on Escape and on a click anywhere else, so it never sits open
  // over the page after somebody has moved on.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [open]);

  // Now that the button follows you around the whole site, an open panel would
  // otherwise stay open across a page change and sit over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The address of the page being looked at, not the homepage. Sharing a car
  // should send somebody to that car.
  const currentLink = () => (typeof window === 'undefined' ? '' : window.location.href);

  const copyLink = async () => {
    const link = currentLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Copying can be blocked — an insecure connection, or a browser setting.
      // Showing the address means it can still be copied by hand rather than
      // leaving a button that quietly failed.
      showToast('Could not copy automatically', link);
    }
  };

  // Opens whichever mail program the person already uses, with the subject and
  // the link filled in. No account and no backend involved: the browser hands
  // it straight over. encodeURIComponent is what stops a link containing "&"
  // — a search with filters, for instance — from cutting the message in half.
  const shareByEmail = () => {
    const link = currentLink();
    const subject = encodeURIComponent('A car on SXM Rentals');
    const body = encodeURIComponent(
      `I found this on SXM Rentals and thought you would want to see it:\n\n${link}\n`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Email and copy sit last, after the social marks, so the brand logos stay
  // grouped together and the two that actually work today end up nearest the
  // thumb.
  const buttons = [
    ...SOCIAL_LINKS.map((social) => ({
      key: social.name,
      label: social.name,
      node: <BrandIcon name={social.brand} size={19} />,
      done: false,
      onClick: () => {
        if (social.url) {
          window.open(social.url, '_blank', 'noopener,noreferrer');
          return;
        }
        showToast(
          `${social.name} is not set up yet`,
          `The SXM Rentals ${social.name} account has not been created. This button will open it once it has.`,
        );
      },
    })),
    {
      key: 'email',
      label: 'Share by email',
      node: <Icon name="mail-outline" size={19} />,
      done: false,
      onClick: shareByEmail,
    },
    {
      key: 'copy',
      label: copied ? 'Link copied' : 'Copy the link to this page',
      node: <Icon name={copied ? 'checkmark' : 'documents-outline'} size={19} />,
      done: copied,
      onClick: copyLink,
    },
  ];

  return (
    <div className={styles.wrap} ref={wrapRef} data-print="hide">
      <button
        type="button"
        className={cx(styles.toggle, open && styles.toggleOpen)}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Hide the share options' : 'Share SXM Rentals'}
      >
        <Icon name={open ? 'close' : 'share-outline'} size={21} />
      </button>

      {open ? (
        <div className={styles.links}>
          {buttons.map((b, index) => (
            <button
              key={b.key}
              type="button"
              className={cx(styles.link, b.done && styles.linkDone)}
              // Each one rises a fraction after the one before, which is what
              // makes them fan out rather than appear all at once.
              style={{ animationDelay: `${index * 45}ms` }}
              aria-label={b.label}
              title={b.label}
              onClick={b.onClick}
            >
              {b.node}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SocialWidget;
