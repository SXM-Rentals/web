// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: One review of a car — who left it, how many stars, when,
// and what they said.
//
// ONLY A FIRST NAME IS EVER SHOWN. The review data carries nothing else, which
// is deliberate: reviews are public, and a full name attached to a rental in a
// specific town on a specific date is more than anyone signed up to share.

import React from 'react';
import { Avatar, Card, StarRow, Text } from '@/components/ui';
import { relativeDay } from '@/lib/format';
import type { Review } from '@/types';
import styles from './ReviewCard.module.css';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className={styles.card} as="article">
      <div className={styles.head}>
        <Avatar name={review.authorName} size={36} />

        <div className={styles.headText}>
          <Text variant="label" as="h4" raw>
            {review.authorName}
          </Text>
          <Text variant="caption" tone="ink3" as="span">
            {relativeDay(review.date)}
          </Text>
        </div>

        <StarRow rating={review.rating} size={13} />
      </div>

      <Text variant="body" tone="ink2">
        {review.body}
      </Text>
    </Card>
  );
}

export default ReviewCard;
