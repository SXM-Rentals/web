// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// MOCK DATA — sample content for UI development. No backend is connected.
// WHAT THIS FILE DOES: The list of all 19 policy documents SXM Rentals needs
// before launch, taken from the Overview document, grouped into the three
// groups it describes.
//
// IMPORTANT: the headings below are real — they are what each document has to
// cover. The wording underneath is a placeholder. A local lawyer still has to
// write and approve the actual text, because this platform handles payments,
// identity documents and operates across two legal jurisdictions.

import type { LegalDocument } from '@/types';

// The same holding note appears under every heading until the real wording is
// written, so nobody mistakes a draft for an agreed policy.
const PLACEHOLDER =
  'The wording for this section has not been written yet. It will be drafted and reviewed by a local attorney before launch.';

// Small helper so each document below only has to list its headings.
function doc(
  slug: string,
  title: string,
  tier: LegalDocument['tier'],
  headings: string[],
): LegalDocument {
  return {
    slug,
    title,
    tier,
    updated: 'Not yet published',
    sections: headings.map((heading) => ({ heading, body: PLACEHOLDER })),
  };
}

export const legalDocuments: LegalDocument[] = [
  // ---- GROUP 1: THE PLATFORM ITSELF ----
  doc('terms-of-service', 'Terms of Service', 'platform', [
    'Who these terms apply to',
    'Creating and keeping an account',
    'What SXM Rentals does and does not do',
    'Your responsibilities as a customer',
    'Suspending or closing an account',
    'Changes to these terms',
    'Governing law and jurisdiction',
  ]),
  doc('privacy-policy', 'Privacy Policy', 'platform', [
    'What information we collect',
    'How we use your information',
    'Identity documents and how they are stored',
    'Who we share information with',
    'How long we keep your information',
    'Your rights over your information',
    'Cookies and app analytics',
    'Contacting us about privacy',
  ]),
  doc('cancellation-refund', 'Cancellation & Refund Policy', 'platform', [
    'Cancelling before your rental starts',
    'Refund amounts and timing',
    'Cancellations made by the rental business',
    'Cancelling once a rental has started',
    'How refunds are paid back',
  ]),
  doc('payment-policy', 'Payment Policy', 'platform', [
    'Accepted payment methods',
    'When you are charged',
    'Service fees',
    'Currency and exchange rates',
    'Failed and disputed payments',
  ]),
  doc('rental-platform-agreement', 'Rental Platform Agreement', 'platform', [
    'The role SXM Rentals plays between customer and business',
    'What is agreed between you and the rental business',
    'Limits of platform responsibility',
    'Insurance and liability',
  ]),
  doc('acceptable-use', 'Acceptable Use Policy', 'platform', [
    'Behaviour expected on the platform',
    'Prohibited activity',
    'Reviews and content you post',
    'Reporting misuse',
    'Consequences of breaking these rules',
  ]),
  doc('dispute-resolution', 'Dispute Resolution Policy', 'platform', [
    'Raising a problem with a rental',
    'How SXM Rentals reviews a dispute',
    'Evidence we may ask for',
    'Decisions and appeals',
    'Chargebacks',
  ]),

  // ---- GROUP 2: THE RENTAL ITSELF ----
  doc('rental-agreement', 'Rental Agreement', 'rental', [
    'Parties to this agreement',
    'The vehicle being rented',
    'Rental period and return',
    'Who may drive the vehicle',
    'Permitted use and restrictions',
    'Condition on collection and return',
    'Signatures',
  ]),
  doc('vehicle-damage', 'Vehicle Damage Policy', 'rental', [
    'Reporting damage',
    'How damage is assessed',
    'What you may be charged for',
    'Pre-existing damage and the condition report',
    'Disputing a damage claim',
  ]),
  doc('security-deposit', 'Security Deposit Policy', 'rental', [
    'What the deposit is for',
    'How much is held and when',
    'The deposit is held, not charged',
    'When the deposit is released',
    'When money may be taken from the deposit',
    'Disputing a deduction',
  ]),
  doc('late-return', 'Late Return Policy', 'rental', [
    'What counts as a late return',
    'Grace period',
    'Late fees',
    'Vehicles not returned',
  ]),
  doc('rental-extension', 'Rental Extension Policy', 'rental', [
    'Requesting an extension',
    'Availability and approval',
    'How an extension is priced',
    'Effect on your deposit',
  ]),
  doc('mileage-fuel', 'Mileage & Fuel Policy', 'rental', [
    'Mileage limits, if any',
    'Fuel level on collection and return',
    'Refuelling charges',
    'Electric vehicles and charging',
  ]),
  doc('accident-incident', 'Accident & Incident Policy', 'rental', [
    'What to do immediately after an accident',
    'Who to contact',
    'Police reports',
    'Insurance claims',
    'Theft and vandalism',
  ]),
  doc('driver-eligibility', 'Driver Eligibility Policy', 'rental', [
    'Minimum age',
    'Licence requirements',
    'Visitors driving on a foreign licence',
    'Additional drivers',
    'Grounds for refusal',
  ]),

  // ---- GROUP 3: BUSINESSES THAT LIST VEHICLES ----
  doc('provider-terms', 'Rental Provider Terms', 'provider', [
    'Joining as a rental business',
    'Business verification',
    'Listing accuracy and availability',
    'Standards of service',
    'Suspension and removal',
  ]),
  doc('provider-commission', 'Provider Commission & Payout Agreement', 'provider', [
    'Commission rate',
    'How and when payouts are made',
    'Payout accounts and requirements',
    'Refunds, chargebacks and adjustments',
    'Taxes',
  ]),
  doc('vehicle-verification', 'Vehicle Verification Requirements', 'provider', [
    'Documents required for each vehicle',
    'Registration, insurance and roadworthiness',
    'What the SXM Verified badge does and does not confirm',
    'Re-verification',
  ]),
  doc('prohibited-listings', 'Prohibited Vehicle & Listing Policy', 'provider', [
    'Vehicles that may not be listed',
    'Misleading listings',
    'Duplicate listings',
    'Enforcement',
  ]),
];

// Friendly group names shown as headings on the Legal screen.
export const legalTierLabels: Record<LegalDocument['tier'], string> = {
  platform: 'Platform',
  rental: 'Renting a vehicle',
  provider: 'For rental businesses',
};

export function findLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((d) => d.slug === slug);
}
