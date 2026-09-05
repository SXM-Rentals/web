// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The four steps of making a booking, and paying for it.
//
// EACH PHRASE CARRIES ALL FOUR LANGUAGES TOGETHER. That is the whole point of
// this format: to translate something you read the English on one line and
// write the other three underneath it, rather than opening four files and
// finding the same key in each. A missing translation is visible here; in four
// separate files it was invisible.
//
// The type in copy/index.ts requires all four, so a phrase cannot be added in
// English alone and quietly stay English forever.

import type { Phrase } from './types';

export const booking = {

  'booking.stepDetails': {
    en: 'Trip details',
    nl: 'Reisgegevens',
    fr: 'Détails du séjour',
    es: 'Datos del viaje',
  },
  'booking.stepPayment': {
    en: 'Payment',
    nl: 'Betaling',
    fr: 'Paiement',
    es: 'Pago',
  },
  'booking.stepConfirm': {
    en: 'Confirm',
    nl: 'Bevestigen',
    fr: 'Confirmation',
    es: 'Confirmar',
  },
  'booking.pickup': {
    en: 'Pick up',
    nl: 'Ophalen',
    fr: 'Retrait',
    es: 'Recogida',
  },
  'booking.delivery': {
    en: 'Delivery',
    nl: 'Bezorgen',
    fr: 'Livraison',
    es: 'Entrega',
  },
  'booking.pickupDate': {
    en: 'Pick-up date',
    nl: 'Ophaaldatum',
    fr: 'Date de retrait',
    es: 'Fecha de recogida',
  },
  'booking.returnDate': {
    en: 'Return date',
    nl: 'Retourdatum',
    fr: 'Date de retour',
    es: 'Fecha de devolución',
  },
  'booking.location': {
    en: 'Location',
    nl: 'Locatie',
    fr: 'Lieu',
    es: 'Lugar',
  },
  'booking.addOns': {
    en: 'Extras',
    nl: 'Extra’s',
    fr: 'Options',
    es: 'Extras',
  },
  'booking.priceBreakdown': {
    en: 'Price breakdown',
    nl: 'Prijsopbouw',
    fr: 'Détail du prix',
    es: 'Desglose del precio',
  },
  'booking.subtotal': {
    en: 'Rental subtotal',
    nl: 'Subtotaal huur',
    fr: 'Sous-total location',
    es: 'Subtotal del alquiler',
  },
  'booking.fees': {
    en: 'Service Fee',
    nl: 'Servicekosten',
    fr: 'Frais de service',
    es: 'Gastos de gestión',
  },
  'booking.dueToday': {
    en: 'Due today',
    nl: 'Vandaag te betalen',
    fr: 'À payer aujourd’hui',
    es: 'A pagar hoy',
  },
  'booking.depositSeparate': {
    en: 'Security deposit (held, not charged)',
    nl: 'Borgsom (gereserveerd, niet afgeschreven)',
    fr: 'Caution (bloquée, non débitée)',
    es: 'Fianza (retenida, no cobrada)',
  },
  'booking.payNow': {
    en: 'Pay now',
    nl: 'Nu betalen',
    fr: 'Payer maintenant',
    es: 'Pagar ahora',
  },
  'booking.cardDetails': {
    en: 'Card Details',
    nl: 'Kaartgegevens',
    fr: 'Informations de carte',
    es: 'Datos de la tarjeta',
  },
  'booking.savedCards': {
    en: 'Saved cards',
    nl: 'Opgeslagen kaarten',
    fr: 'Cartes enregistrées',
    es: 'Tarjetas guardadas',
  },
  'booking.agreementTitle': {
    en: 'Rental Agreement',
    nl: 'Huurovereenkomst',
    fr: 'Contrat de location',
    es: 'Contrato de alquiler',
  },
  'booking.agreementBody': {
    en: 'Read and sign the agreement to finish your booking.',
    nl: 'Lees en onderteken de overeenkomst om uw boeking af te ronden.',
    fr: 'Lisez et signez le contrat pour finaliser votre réservation.',
    es: 'Lea y firme el contrato para terminar su reserva.',
  },
  'booking.sign': {
    en: 'Sign here',
    nl: 'Onderteken hier',
    fr: 'Signez ici',
    es: 'Firme aquí',
  },
  'booking.clearSignature': {
    en: 'Clear',
    nl: 'Wissen',
    fr: 'Effacer',
    es: 'Borrar',
  },
  'booking.confirmed': {
    en: 'Booking confirmed',
    nl: 'Boeking bevestigd',
    fr: 'Réservation confirmée',
    es: 'Reserva confirmada',
  },
  'booking.demoNotice': {
    en: 'Demo only — no payment is taken and no booking is made.',
    nl: 'Alleen demo — er wordt niets betaald en er wordt geen boeking gemaakt.',
    fr: 'Démo uniquement — aucun paiement n’est prélevé et aucune réservation n’est créée.',
    es: 'Solo demo — no se cobra nada y no se crea ninguna reserva.',
  },
} satisfies Record<string, Phrase>;
