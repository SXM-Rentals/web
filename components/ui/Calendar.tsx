'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The month-by-month date picker used for choosing trip
// dates, extending a rental, and seeing when a car is free.
//
// HOW IT LOOKS: a grid of days with arrows to move between months. Picking a
// start and an end fills the days in between with a light band and puts a dark
// circle on the first and last day. Days that are already booked, or in the
// past, are greyed out, struck through, and cannot be chosen.
//
// HOW PICKING A RANGE WORKS: the first click sets the start. The second sets the
// end. A third starts again from scratch. Clicking a day BEFORE the start also
// starts again, rather than refusing — someone who clicks the 20th and then the
// 18th has almost certainly changed their mind about where the trip begins, and
// silently ignoring the click would just look broken.

import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { cx } from '@/lib/utils';
import { Text } from './Text';
import { IconButton } from './IconButton';
import styles from './Calendar.module.css';
import { useTranslation } from '@/lib/i18n';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DATE_FORMAT = 'YYYY-MM-DD';

export type CalendarProps = {
  // The chosen dates, written as YYYY-MM-DD. Either can be empty.
  startDate?: string;
  endDate?: string;
  onChange: (range: { startDate?: string; endDate?: string }) => void;
  // Days that cannot be chosen because the car is already booked.
  unavailableDates?: string[];
  // Stops anyone picking a day in the past.
  disablePast?: boolean;
  // When true only one day can be chosen, not a range.
  singleDate?: boolean;
  // Shows what the colours mean underneath. Worth having on the car page, where
  // the greyed days are the whole point of showing a calendar at all.
  showLegend?: boolean;
  className?: string;
};

export function Calendar({
  startDate,
  endDate,
  onChange,
  unavailableDates = [],
  disablePast = true,
  singleDate = false,
  showLegend = false,
  className,
}: CalendarProps) {
  const { t } = useTranslation();
  // Which month is on screen. Starts on the chosen date's month, or today's.
  const [viewMonth, setViewMonth] = useState(() =>
    startDate ? dayjs(startDate).startOf('month') : dayjs().startOf('month'),
  );

  // Turned into a Set so checking "is this day booked?" is instant even for a
  // car with a long list of booked dates.
  const unavailable = useMemo(() => new Set(unavailableDates), [unavailableDates]);
  const today = useMemo(() => dayjs().startOf('day'), []);

  // ---- WORK OUT THE GRID OF DAYS FOR THIS MONTH ----
  // A calendar grid always shows whole weeks, so it includes a few days from the
  // previous and next months to fill out the first and last rows.
  const weeks = useMemo(() => {
    const firstOfMonth = viewMonth.startOf('month');
    const gridStart = firstOfMonth.subtract(firstOfMonth.day(), 'day');
    const rows: dayjs.Dayjs[][] = [];

    for (let week = 0; week < 6; week += 1) {
      const days: dayjs.Dayjs[] = [];
      for (let day = 0; day < 7; day += 1) {
        days.push(gridStart.add(week * 7 + day, 'day'));
      }
      rows.push(days);
    }

    // A month starting on a Sunday and running 28 days needs only four rows, so
    // any trailing row made entirely of next-month days is dropped rather than
    // leaving an empty band at the bottom.
    return rows.filter((row) => row.some((day) => day.isSame(viewMonth, 'month')));
  }, [viewMonth]);

  const isUnavailable = (day: dayjs.Dayjs): boolean => {
    if (unavailable.has(day.format(DATE_FORMAT))) return true;
    if (disablePast && day.isBefore(today, 'day')) return true;
    return false;
  };

  const handlePick = (day: dayjs.Dayjs) => {
    const picked = day.format(DATE_FORMAT);

    if (singleDate) {
      onChange({ startDate: picked, endDate: undefined });
      return;
    }

    // Nothing chosen yet, or a complete range already chosen — start again.
    if (!startDate || (startDate && endDate)) {
      onChange({ startDate: picked, endDate: undefined });
      return;
    }

    // Clicked before the start: treat it as changing where the trip begins.
    if (day.isBefore(dayjs(startDate), 'day')) {
      onChange({ startDate: picked, endDate: undefined });
      return;
    }

    // Clicked the start day again: clear it rather than making a nil-length trip.
    if (day.isSame(dayjs(startDate), 'day')) {
      onChange({ startDate: undefined, endDate: undefined });
      return;
    }

    onChange({ startDate, endDate: picked });
  };

  const start = startDate ? dayjs(startDate) : null;
  const end = endDate ? dayjs(endDate) : null;

  return (
    <div className={cx(styles.calendar, className)}>
      {/* ---- MOVING BETWEEN MONTHS ---- */}
      <div className={styles.header}>
        <IconButton
          icon="chevron-back"
          label={`Go to ${viewMonth.subtract(1, 'month').format('MMMM YYYY')}`}
          variant="plain"
          size="sm"
          onClick={() => setViewMonth((current) => current.subtract(1, 'month'))}
          // Nothing in the past can be picked, so there is no reason to walk
          // backwards past this month.
          disabled={disablePast && viewMonth.isSame(today, 'month')}
        />

        <Text variant="h3" as="div" className={styles.monthName} raw>
          {viewMonth.format('MMMM YYYY')}
        </Text>

        <IconButton
          icon="chevron-forward"
          label={`Go to ${viewMonth.add(1, 'month').format('MMMM YYYY')}`}
          variant="plain"
          size="sm"
          onClick={() => setViewMonth((current) => current.add(1, 'month'))}
        />
      </div>

      {/* ---- THE DAY-NAME ROW ---- */}
      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAYS.map((name) => (
          <Text key={name} variant="caption" tone="ink3" as="div" className={styles.weekday}>
            {name}
          </Text>
        ))}
      </div>

      {/* ---- THE DAYS ---- */}
      <div className={styles.grid} role="grid" aria-label={t('calendar.chooseDates')}>
        {weeks.flat().map((day) => {
          const key = day.format(DATE_FORMAT);
          const outside = !day.isSame(viewMonth, 'month');
          const disabled = isUnavailable(day);

          const isStart = start ? day.isSame(start, 'day') : false;
          const isEnd = end ? day.isSame(end, 'day') : false;
          const between =
            start && end ? day.isAfter(start, 'day') && day.isBefore(end, 'day') : false;

          const selected = isStart || isEnd;
          const inRange = between || (isStart && end != null) || (isEnd && start != null);

          return (
            <div
              key={key}
              className={cx(
                styles.cell,
                inRange && styles.inRange,
                isStart && end != null && styles.rangeStart,
                isEnd && start != null && styles.rangeEnd,
              )}
            >
              <button
                type="button"
                className={cx(
                  styles.day,
                  selected && styles.selected,
                  outside && styles.outside,
                  day.isSame(today, 'day') && styles.today,
                )}
                disabled={disabled}
                onClick={() => handlePick(day)}
                // The full date read aloud, since "17" on its own tells someone
                // listening nothing about which month or day of the week it is.
                aria-label={
                  disabled
                    ? `${day.format('dddd D MMMM YYYY')} — not available`
                    : day.format('dddd D MMMM YYYY')
                }
                aria-pressed={selected}
              >
                {day.date()}
              </button>
            </div>
          );
        })}
      </div>

      {showLegend ? (
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={cx(styles.swatch, styles.swatchSelected)} aria-hidden="true" />
            <Text variant="caption" tone="ink2" as="span" raw>
              {t('calendar.yourDates')}
            </Text>
          </span>
          <span className={styles.legendItem}>
            <span className={cx(styles.swatch, styles.swatchUnavailable)} aria-hidden="true" />
            <Text variant="caption" tone="ink2" as="span" raw>
              {t('calendar.alreadyBooked')}
            </Text>
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default Calendar;
