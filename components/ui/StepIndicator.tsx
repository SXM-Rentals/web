// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The "Step 2 of 4" progress line across the top of the
// booking flow and the business sign-up.
//
// WHY IT IS WORTH HAVING: people abandon a form far more readily when they
// cannot tell how much of it is left. Showing that there are four steps and this
// is the second turns "how long is this going to take?" into a known quantity.

import React from 'react';
import { cx } from '@/lib/utils';
import { Text } from './Text';
import styles from './StepIndicator.module.css';

export function StepIndicator({
  // Which step is showing now, counting from 1.
  current,
  // The name of each step, e.g. ["Trip", "Payment", "Agreement", "Confirm"].
  steps,
  className,
}: {
  current: number;
  steps: string[];
  className?: string;
}) {
  const total = steps.length;
  const currentName = steps[current - 1];

  return (
    <div
      className={cx(styles.wrapper, className)}
      // Announced as a progress bar, so someone listening to the page is told
      // where they are rather than hearing four unexplained blocks.
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`Step ${current} of ${total}: ${currentName}`}
    >
      <div className={styles.track}>
        {steps.map((step, index) => {
          const position = index + 1;
          return (
            <span
              key={step}
              className={cx(
                styles.segment,
                position < current && styles.done,
                position === current && styles.current,
              )}
              aria-hidden="true"
            />
          );
        })}
      </div>

      <div className={styles.labels}>
        <Text variant="caption" tone="ink2" as="span">
          {`Step ${current} of ${total}`}
        </Text>
        <Text variant="caption" tone="ink" as="span">
          {currentName}
        </Text>
      </div>
    </div>
  );
}

export default StepIndicator;
