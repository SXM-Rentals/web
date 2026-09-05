'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Getting a whole fleet onto SXM Rentals from a
// spreadsheet — drag the file in, check every row that was read out of it, fix
// anything wrong, and only then save.
//
// THIS IS THE ONE PLACE THE WEBSITE GENUINELY BEATS THE PHONE APP. A real drag
// target, a proper table wide enough to read, and inline editing of the rows
// that need fixing. On a phone this is a miserable job; on a laptop, where the
// spreadsheet already lives, it is the natural way to do it.
//
// THE RULE THIS PAGE EXISTS TO HOLD: NOTHING SAVES UNTIL THE PREVIEW HAS BEEN
// SEEN AND CONFIRMED. Importing fifty listings blind is how a fleet ends up
// publicly advertised at the wrong price — and the first anyone knows about it
// is a customer booking a $180 Jeep for $18. So the file is read, every row is
// shown back with its problems spelled out in plain words, and the save button
// stays out of reach until that has happened.

import React, { useMemo, useRef, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { money } from '@/lib/format';
import { cx } from '@/lib/utils';
import { Breadcrumbs } from '@/components/layout/PageHeader';
import {
  Button,
  Card,
  ErrorState,
  Icon,
  Input,
  Skeleton,
  StatusPill,
  Text,
} from '@/components/ui';
import type { ImportRow } from '@/types';
import styles from '../../provider.module.css';
import { useTranslation } from '@/lib/i18n';

type Stage = 'choose' | 'reading' | 'preview' | 'saved';

const ACCEPTED = '.csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export default function FleetImportPage() {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>('choose');
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // How many rows are usable, and how many still need attention.
  const counts = useMemo(() => {
    const bad = rows.filter((row) => row.problems.length > 0).length;
    return { total: rows.length, bad, good: rows.length - bad };
  }, [rows]);

  const readFile = async (file: File) => {
    setError(undefined);

    const looksRight = /\.(csv|xlsx|xls)$/i.test(file.name);
    if (!looksRight) {
      setError(
        `"${file.name}" does not look like a spreadsheet. Save it as .csv or .xlsx and try again.`,
      );
      return;
    }

    setFileName(file.name);
    setStage('reading');

    try {
      // In the finished site the file is uploaded and the server reads it. Here
      // it hands back a pretend set of rows so the preview can be built — the
      // file itself never leaves this computer.
      const result = await apiClient.readImportFile();
      setRows(result);
      setStage('preview');
    } catch {
      setError('We could not read that file. Check it opens properly and try again.');
      setStage('choose');
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    readFile(files[0]);
  };

  // Editing a row clears the problems it had, since the point of editing is to
  // fix them. A real version would re-check the row after each change.
  const updateRow = (rowNumber: number, changes: Partial<ImportRow>) => {
    setRows((current) =>
      current.map((row) =>
        row.rowNumber === rowNumber ? { ...row, ...changes, problems: [] } : row,
      ),
    );
  };

  const removeRow = (rowNumber: number) => {
    setRows((current) => current.filter((row) => row.rowNumber !== rowNumber));
  };

  // ---- SAVED ----
  if (stage === 'saved') {
    return (
      <>
        <Card padded className={styles.stack}>
          <Icon name="checkmark-circle-outline" size={38} color="var(--success)" />
          <Text variant="h2" as="h1">
            {`${counts.good} ${counts.good === 1 ? 'vehicle' : 'vehicles'} added`}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.import.notVisibleYet')}
          </Text>
          <Text variant="small" tone="ink3" raw>
            {t('pp.import.demoNote')}
          </Text>

          <div className={styles.headActions}>
            <Button label={t('pp.import.seeFleet')} href="/provider/fleet" size="md" />
            <Button
              label={t('pp.import.another')}
              variant="outline"
              size="md"
              onClick={() => {
                setStage('choose');
                setRows([]);
                setFileName('');
              }}
            />
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/provider' },
          { label: 'Fleet', href: '/provider/fleet' },
          { label: 'Import' },
        ]}
      />

      <div className={styles.pageHead}>
        <div className={styles.headText}>
          <Text variant="h1" as="h1" raw>
            {t('pp.import.title')}
          </Text>
          <Text variant="body" tone="ink2" raw>
            {t('pp.import.subtitle')}
          </Text>
        </div>
      </div>

      {/* ---- CHOOSING A FILE ---- */}
      {stage === 'choose' ? (
        <>
          <label
            className={cx(styles.dropZone, dragging && styles.dropZoneActive)}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              className={styles.hiddenInput}
              accept={ACCEPTED}
              onChange={(event) => handleFiles(event.target.files)}
            />

            <span className={styles.dropIcon}>
              <Icon name="cloud-upload-outline" size={30} />
            </span>

            <Text variant="h3" as="span">
              {dragging ? 'Drop the file here' : 'Drag your spreadsheet here'}
            </Text>
            <Text variant="small" tone="ink2" as="span">
              or click to choose one — .csv, .xlsx or .xls
            </Text>
          </label>

          {error ? <ErrorState message={error} inline /> : null}

          {/* ---- WHAT THE FILE SHOULD LOOK LIKE ---- */}
          <Card padded>
            <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
              {t('pp.import.needs')}
            </Text>

            <Text variant="small" tone="ink2" style={{ marginBottom: 'var(--space-md)' }} raw>
              {t('pp.import.oneRow')}
            </Text>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Make</th>
                    <th scope="col">Model</th>
                    <th scope="col">Year</th>
                    <th scope="col">Registration</th>
                    <th scope="col">Daily Rate</th>
                    <th scope="col">Seats</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Kia</td>
                    <td>Rio</td>
                    <td>2023</td>
                    <td>M 4821</td>
                    <td>42</td>
                    <td>5</td>
                  </tr>
                  <tr>
                    <td>Jeep</td>
                    <td>Wrangler</td>
                    <td>2022</td>
                    <td>M 4822</td>
                    <td>95</td>
                    <td>4</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.note}>
              <Icon name="information-circle-outline" size={15} color="var(--ink3)" />
              <Text variant="small" tone="ink3" raw>
                {t('pp.import.afterwards')}
              </Text>
            </div>
          </Card>
        </>
      ) : null}

      {/* ---- READING IT ---- */}
      {stage === 'reading' ? (
        <Card padded>
          <Text variant="label" as="h2" style={{ marginBottom: 'var(--space-md)' }} raw>
            {`Reading ${fileName}…`}
          </Text>
          <Skeleton height={220} radius="var(--radius-md)" />
        </Card>
      ) : null}

      {/* ---- THE PREVIEW ----
          The whole point of this page. Every row is shown back before anything
          is saved, with problems written out in plain words. */}
      {stage === 'preview' ? (
        <>
          <Card padded>
            <div className={styles.pageHead}>
              <div>
                <Text variant="label" as="h2" raw>
                  {fileName}
                </Text>
                <Text variant="small" tone="ink2" raw>
                  {`${counts.total} rows read · ${counts.good} ready · ${counts.bad} need attention`}
                </Text>
              </div>

              <div className={styles.headActions}>
                <StatusPill
                  label={`${counts.good} READY`}
                  tone={counts.good > 0 ? 'success' : 'neutral'}
                />
                {counts.bad > 0 ? (
                  <StatusPill label={`${counts.bad} TO FIX`} tone="warning" />
                ) : null}
              </div>
            </div>
          </Card>

          {counts.bad > 0 ? (
            <Card padded>
              <div className={styles.note} style={{ marginTop: 0 }}>
                <Icon name="alert-circle-outline" size={18} color="var(--warning)" />
                <div>
                  <Text variant="label" as="h2">
                    {`${counts.bad} ${counts.bad === 1 ? 'row needs' : 'rows need'} fixing before they can be added`}
                  </Text>
                  <Text variant="small" tone="ink2" raw>
                    {t('pp.import.eachSays')}
                  </Text>
                </div>
              </div>
            </Card>
          ) : null}

          {/* The table scrolls sideways inside its own box, so the page itself
              never scrolls horizontally however many columns there are. */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className="sr-only">
                {t('pp.import.everyRow')}
              </caption>

              <thead>
                <tr>
                  <th scope="col">Row</th>
                  <th scope="col">Make</th>
                  <th scope="col">Model</th>
                  <th scope="col">Year</th>
                  <th scope="col">Registration</th>
                  <th scope="col" className={styles.numeric}>
                    Daily rate
                  </th>
                  <th scope="col" className={styles.numeric}>
                    {t('vehicle.seats')}
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col" />
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const broken = row.problems.length > 0;

                  return (
                    <tr key={row.rowNumber} className={cx(broken && styles.badRow)}>
                      <td>
                        <Text variant="small" tone="ink3" as="span" raw>
                          {String(row.rowNumber)}
                        </Text>
                      </td>

                      {/* Broken rows become editable in place. Correct ones stay
                          as plain text so the table is readable rather than a
                          wall of input boxes. */}
                      <td>
                        {broken ? (
                          <Input
                            aria-label={`Make, row ${row.rowNumber}`}
                            value={row.make}
                            onChange={(event) =>
                              updateRow(row.rowNumber, { make: event.target.value })
                            }
                          />
                        ) : (
                          <Text variant="body" as="span" raw>
                            {row.make}
                          </Text>
                        )}
                      </td>

                      <td>
                        {broken ? (
                          <Input
                            aria-label={`Model, row ${row.rowNumber}`}
                            value={row.model}
                            onChange={(event) =>
                              updateRow(row.rowNumber, { model: event.target.value })
                            }
                          />
                        ) : (
                          <Text variant="body" as="span" raw>
                            {row.model}
                          </Text>
                        )}
                      </td>

                      <td>
                        {broken ? (
                          <Input
                            type="number"
                            aria-label={`Year, row ${row.rowNumber}`}
                            value={row.year ?? ''}
                            onChange={(event) =>
                              updateRow(row.rowNumber, {
                                year: Number(event.target.value) || undefined,
                              })
                            }
                          />
                        ) : (
                          <Text variant="body" as="span" raw>
                            {row.year ? String(row.year) : '—'}
                          </Text>
                        )}
                      </td>

                      <td>
                        {broken ? (
                          <Input
                            aria-label={`Registration, row ${row.rowNumber}`}
                            value={row.registration ?? ''}
                            onChange={(event) =>
                              updateRow(row.rowNumber, { registration: event.target.value })
                            }
                          />
                        ) : (
                          <Text variant="body" as="span" raw>
                            {row.registration ?? '—'}
                          </Text>
                        )}
                      </td>

                      <td className={styles.numeric}>
                        {broken ? (
                          <Input
                            type="number"
                            aria-label={`Daily rate, row ${row.rowNumber}`}
                            value={row.dailyRate ?? ''}
                            onChange={(event) =>
                              updateRow(row.rowNumber, {
                                dailyRate: Number(event.target.value) || undefined,
                              })
                            }
                          />
                        ) : (
                          <Text variant="body" as="span" raw>
                            {row.dailyRate != null ? money(row.dailyRate) : '—'}
                          </Text>
                        )}
                      </td>

                      <td className={styles.numeric}>
                        <Text variant="body" as="span" raw>
                          {row.seats != null ? String(row.seats) : '—'}
                        </Text>
                      </td>

                      <td>
                        {broken ? (
                          <>
                            <StatusPill label={t('pp.import.needsFixing')} tone="danger" />
                            {/* The reasons, in plain words. Colour alone would
                                say nothing about WHAT is wrong. */}
                            <span className={styles.problemList}>
                              {row.problems.map((problem) => (
                                <Text key={problem} variant="caption" tone="danger" raw>
                                  {problem}
                                </Text>
                              ))}
                            </span>
                          </>
                        ) : (
                          <StatusPill label={t('pp.import.ready')} tone="success" />
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => removeRow(row.rowNumber)}
                          aria-label={`Remove row ${row.rowNumber}`}
                          title={t('pp.import.removeRow')}
                          style={{ color: 'var(--ink3)', display: 'flex' }}
                        >
                          <Icon name="trash-outline" size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ---- SAVING, ONLY AFTER THE PREVIEW ---- */}
          <Card padded>
            <div className={styles.pageHead}>
              <div>
                <Text variant="label" as="h2" raw>
                  {counts.bad > 0
                    ? `Add the ${counts.good} rows that are ready`
                    : `Add all ${counts.good} vehicles`}
                </Text>
                <Text variant="small" tone="ink2">
                  Nothing goes live until SXM Rentals has checked each vehicle&rsquo;s
                  documents.
                </Text>
              </div>

              <div className={styles.headActions}>
                <Button
                  label={t('pp.import.startAgain')}
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setStage('choose');
                    setRows([]);
                    setFileName('');
                  }}
                />
                <Button
                  label={`Add ${counts.good} ${counts.good === 1 ? 'vehicle' : 'vehicles'}`}
                  size="md"
                  disabled={counts.good === 0}
                  onClick={() => setStage('saved')}
                />
              </div>
            </div>
          </Card>
        </>
      ) : null}
    </>
  );
}
