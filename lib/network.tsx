'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Notices when the visitor loses their connection, and
// tells them rather than letting the site look broken.
//
// WHY THIS MATTERS HERE MORE THAN MOST PLACES: this site is used on an island
// where coverage drops in the hills, in car parks, and on half the road between
// Philipsburg and Marigot. Without this, losing signal looks exactly like the
// site being broken — things stop loading, buttons appear to do nothing, and
// there is no way to tell which it is. One line saying "you are offline" turns a
// mystery into an inconvenience.
//
// WHAT THE BROWSER CAN AND CANNOT TELL US: the mobile app uses NetInfo, which
// reports both whether there is a connection and whether that connection can
// actually reach the internet. A browser only offers the first half —
// navigator.onLine is true whenever the machine is attached to any network at
// all, including hotel wifi that goes nowhere. So this is deliberately used only
// to show a banner, never to block anything: a false "you are online" costs
// nothing, whereas refusing to let someone book because we wrongly decided they
// were offline would be far worse.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type NetworkValue = {
  // False only when the browser is sure there is no connection.
  online: boolean;
};

const NetworkContext = createContext<NetworkValue>({ online: true });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  // Starts as online. Assuming the worst would flash a warning at everyone on
  // load, before the browser has told us anything. It is also what the server
  // has to assume when it builds the page, and the first render must match.
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);

    // Check once on arrival, in case the connection dropped before the page
    // finished loading and the events below were missed.
    update();

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const value = useMemo(() => ({ online }), [online]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork(): NetworkValue {
  return useContext(NetworkContext);
}
