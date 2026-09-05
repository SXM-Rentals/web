// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word on the homepage, in all four languages.
//
// THIS IS THE PAGE THAT MATTERS MOST TO TRANSLATE WELL. It is the front door,
// it is what a search engine shows, and it is where somebody decides whether
// this is a real business or not. A page that reads like it was put through a
// machine reads like a business that cannot afford a person — which, on an
// island where the two official languages are Dutch and French, is exactly the
// wrong impression to give two thirds of the population.
//
// A NOTE ON THE ISLAND'S NAMES: the Dutch side is Sint Maarten, the French side
// Saint-Martin. Which name comes first is not neutral. In the Dutch text Sint
// Maarten leads; in the French text Saint-Martin does; in English and Spanish
// they are given in the order the reader is most likely to know them.

import type { Phrase } from './types';

export const home = {
  // ---- THE HERO ----
  'home.hero.title': {
    en: 'Rent a car anywhere on the island',
    nl: 'Huur overal op het eiland een auto',
    fr: 'Louez une voiture partout sur l’île',
    es: 'Alquile un coche en cualquier punto de la isla',
  },
  'home.hero.lede': {
    en: 'Book a car on either side of the island. Payment, ID check and the rental agreement all happen online.',
    nl: 'Boek een auto aan beide kanten van het eiland. Betaling, identiteitscontrole en de huurovereenkomst gaan volledig online.',
    fr: 'Réservez une voiture des deux côtés de l’île. Le paiement, la vérification d’identité et le contrat de location se font en ligne.',
    es: 'Reserve un coche en los dos lados de la isla. El pago, la verificación de identidad y el contrato de alquiler se hacen en línea.',
  },
  'home.hero.rentCta': {
    en: 'Rent a Car',
    nl: 'Auto Huren',
    fr: 'Louer une Voiture',
    es: 'Alquilar un Coche',
  },
  'home.hero.listCta': {
    en: 'List Your Vehicles',
    nl: 'Plaats Uw Voertuigen',
    fr: 'Publier Vos Véhicules',
    es: 'Publique Sus Vehículos',
  },
  'home.hero.noteBrowse': {
    en: 'No account needed to browse',
    nl: 'Geen account nodig om rond te kijken',
    fr: 'Aucun compte requis pour regarder',
    es: 'No hace falta cuenta para mirar',
  },
  'home.hero.noteDeposit': {
    en: 'Deposits held, then returned',
    nl: 'Borgsom gereserveerd, daarna terug',
    fr: 'Caution bloquée, puis rendue',
    es: 'Fianza retenida y después devuelta',
  },
  'home.hero.noteSides': {
    en: 'Dutch and French sides',
    nl: 'Nederlandse en Franse kant',
    fr: 'Côtés français et néerlandais',
    es: 'Lado neerlandés y lado francés',
  },

  // ---- RENTING A CAR: THE FOUR STEPS ----
  'home.renting.title': {
    en: 'Renting a car',
    nl: 'Een auto huren',
    fr: 'Louer une voiture',
    es: 'Alquilar un coche',
  },
  'home.renting.lede': {
    en: 'Four steps. The ID check happens once, then never again.',
    nl: 'Vier stappen. De identiteitscontrole doet u één keer, daarna nooit meer.',
    fr: 'Quatre étapes. La vérification d’identité se fait une fois, puis plus jamais.',
    es: 'Cuatro pasos. La verificación de identidad se hace una vez y ya está.',
  },
  'home.renting.step1.title': {
    en: 'Search',
    nl: 'Zoeken',
    fr: 'Chercher',
    es: 'Buscar',
  },
  'home.renting.step1.body': {
    en: 'Pick your dates and see what is free.',
    nl: 'Kies uw data en zie wat vrij is.',
    fr: 'Choisissez vos dates et voyez ce qui est libre.',
    es: 'Elija sus fechas y vea qué hay libre.',
  },
  'home.renting.step2.title': {
    en: 'Book',
    nl: 'Boeken',
    fr: 'Réserver',
    es: 'Reservar',
  },
  'home.renting.step2.body': {
    en: 'Pay online. The deposit is held, not charged.',
    nl: 'Betaal online. De borgsom wordt gereserveerd, niet afgeschreven.',
    fr: 'Payez en ligne. La caution est bloquée, pas débitée.',
    es: 'Pague en línea. La fianza se retiene, no se cobra.',
  },
  'home.renting.step3.title': {
    en: 'Verify',
    nl: 'Verifiëren',
    fr: 'Vérifier',
    es: 'Verificar',
  },
  'home.renting.step3.body': {
    en: 'A quick licence and ID check. Done once.',
    nl: 'Een korte controle van rijbewijs en ID. Eenmalig.',
    fr: 'Un contrôle rapide du permis et de la pièce d’identité. Une seule fois.',
    es: 'Una comprobación rápida del carné y la identificación. Una sola vez.',
  },
  'home.renting.step4.title': {
    en: 'Drive',
    nl: 'Rijden',
    fr: 'Rouler',
    es: 'Conducir',
  },
  'home.renting.step4.body': {
    en: 'Collect it, or have it delivered. Sign on screen.',
    nl: 'Haal hem op of laat hem bezorgen. Teken op het scherm.',
    fr: 'Récupérez-la ou faites-la livrer. Signez à l’écran.',
    es: 'Recójalo o pida que se lo entreguen. Firme en pantalla.',
  },

  // ---- WHAT YOU CAN RENT ----
  'home.browse.title': {
    en: 'What you can rent',
    nl: 'Wat u kunt huren',
    fr: 'Ce que vous pouvez louer',
    es: 'Qué puede alquilar',
  },
  'home.browse.lede': {
    en: 'Cars are available now. ATVs, boats and bikes are on the way.',
    nl: 'Auto’s zijn nu beschikbaar. Quads, boten en scooters volgen.',
    fr: 'Les voitures sont disponibles maintenant. Quads, bateaux et scooters arrivent.',
    es: 'Los coches ya están disponibles. Quads, barcos y motos llegarán pronto.',
  },
  'home.browse.available': {
    en: 'Available on the island',
    nl: 'Beschikbaar op het eiland',
    fr: 'Disponible sur l’île',
    es: 'Disponible en la isla',
  },
  'home.browse.seeAll': {
    en: 'See All Cars',
    nl: 'Alle Auto’s Bekijken',
    fr: 'Voir Toutes les Voitures',
    es: 'Ver Todos los Coches',
  },

  // ---- WHY SXM RENTALS ----
  'home.why.title': {
    en: 'Why SXM Rentals',
    nl: 'Waarom SXM Rentals',
    fr: 'Pourquoi SXM Rentals',
    es: 'Por qué SXM Rentals',
  },
  'home.why.lede': {
    en: 'Three things that make this different.',
    nl: 'Drie dingen die dit anders maken.',
    fr: 'Trois choses qui font la différence.',
    es: 'Tres cosas que marcan la diferencia.',
  },
  'home.why.one.title': {
    en: 'The whole transaction, not just a listing',
    nl: 'De hele transactie, niet alleen een advertentie',
    fr: 'Toute la transaction, pas seulement une annonce',
    es: 'Toda la operación, no solo un anuncio',
  },
  'home.why.one.body': {
    en: 'Booking, payment, the deposit, the ID check and the signed agreement all happen here. You never leave to finish the deal.',
    nl: 'Boeking, betaling, borgsom, identiteitscontrole en de ondertekende overeenkomst gebeuren hier. U hoeft nergens anders heen om het af te ronden.',
    fr: 'La réservation, le paiement, la caution, la vérification d’identité et le contrat signé se font ici. Vous ne partez jamais ailleurs pour conclure.',
    es: 'La reserva, el pago, la fianza, la verificación de identidad y el contrato firmado ocurren aquí. No tiene que ir a ningún otro sitio para cerrarlo.',
  },
  'home.why.two.title': {
    en: 'Built to fit around existing businesses',
    nl: 'Gebouwd rond bestaande bedrijven',
    fr: 'Conçu pour s’adapter aux entreprises existantes',
    es: 'Pensado para encajar con negocios que ya funcionan',
  },
  'home.why.two.body': {
    en: 'Already have booking software? Connect it directly. No software? You get a full dashboard, free.',
    nl: 'Heeft u al boekingssoftware? Koppel die direct. Geen software? U krijgt gratis een volledig dashboard.',
    fr: 'Vous avez déjà un logiciel de réservation ? Connectez-le directement. Pas de logiciel ? Vous recevez un tableau de bord complet, gratuitement.',
    es: '¿Ya tiene un programa de reservas? Conéctelo directamente. ¿No tiene ninguno? Le damos un panel completo, gratis.',
  },
  'home.why.three.title': {
    en: 'For residents as much as visitors',
    nl: 'Net zo goed voor inwoners als voor bezoekers',
    fr: 'Pour les résidents autant que pour les visiteurs',
    es: 'Tanto para residentes como para visitantes',
  },
  'home.why.three.body': {
    en: 'Local and tourist accounts ask for the right documents. Islander status recognises people who live here, not what they spend.',
    nl: 'Accounts voor inwoners en bezoekers vragen elk om de juiste documenten. Islander-status erkent mensen die hier wonen, niet wat zij uitgeven.',
    fr: 'Les comptes résident et visiteur demandent chacun les bons documents. Le statut Islander reconnaît ceux qui vivent ici, pas ce qu’ils dépensent.',
    es: 'Las cuentas de residente y de visitante piden los documentos adecuados en cada caso. El estado Islander reconoce a quien vive aquí, no lo que gasta.',
  },

  // ---- LISTING YOUR VEHICLES ----
  'home.listing.title': {
    en: 'Listing your vehicles',
    nl: 'Uw voertuigen plaatsen',
    fr: 'Publier vos véhicules',
    es: 'Publicar sus vehículos',
  },
  'home.listing.lede': {
    en: 'For rental businesses on either side of the island. No limit on vehicles, and the commission is shown on every payout.',
    nl: 'Voor verhuurbedrijven aan beide kanten van het eiland. Geen limiet op het aantal voertuigen, en de commissie staat bij elke uitbetaling vermeld.',
    fr: 'Pour les loueurs des deux côtés de l’île. Aucune limite de véhicules, et la commission est indiquée sur chaque versement.',
    es: 'Para empresas de alquiler de los dos lados de la isla. Sin límite de vehículos, y la comisión aparece en cada pago.',
  },
  'home.listing.step1.title': {
    en: 'List your fleet',
    nl: 'Plaats uw wagenpark',
    fr: 'Publiez votre flotte',
    es: 'Publique su flota',
  },
  'home.listing.step1.body': {
    en: 'Add cars one by one, upload a spreadsheet, or connect your own system.',
    nl: 'Voeg auto’s één voor één toe, upload een spreadsheet, of koppel uw eigen systeem.',
    fr: 'Ajoutez les voitures une par une, importez un tableur, ou connectez votre propre système.',
    es: 'Añada coches uno a uno, suba una hoja de cálculo o conecte su propio sistema.',
  },
  'home.listing.step2.title': {
    en: 'Get verified',
    nl: 'Word geverifieerd',
    fr: 'Faites-vous vérifier',
    es: 'Verifíquese',
  },
  'home.listing.step2.body': {
    en: 'We check your registration and vehicle documents. Then you go live.',
    nl: 'Wij controleren uw inschrijving en voertuigdocumenten. Daarna gaat u live.',
    fr: 'Nous vérifions votre immatriculation et les documents des véhicules. Ensuite vous êtes en ligne.',
    es: 'Comprobamos su registro y los documentos de los vehículos. Después ya está en línea.',
  },
  'home.listing.step3.title': {
    en: 'Get bookings',
    nl: 'Ontvang boekingen',
    fr: 'Recevez des réservations',
    es: 'Reciba reservas',
  },
  'home.listing.step3.body': {
    en: 'Customers book and pay here. You see the dates and who is collecting.',
    nl: 'Klanten boeken en betalen hier. U ziet de data en wie de auto ophaalt.',
    fr: 'Les clients réservent et paient ici. Vous voyez les dates et qui vient récupérer le véhicule.',
    es: 'Los clientes reservan y pagan aquí. Usted ve las fechas y quién viene a recoger.',
  },
  'home.listing.step4.title': {
    en: 'Get paid',
    nl: 'Word betaald',
    fr: 'Soyez payé',
    es: 'Cobre',
  },
  'home.listing.step4.body': {
    en: 'Paid on a schedule, with the commission shown every time.',
    nl: 'Betaald volgens een vast schema, met elke keer de commissie erbij vermeld.',
    fr: 'Payé selon un calendrier fixe, avec la commission indiquée à chaque fois.',
    es: 'Se le paga según un calendario fijo, con la comisión indicada cada vez.',
  },

  // ---- REWARDS ----
  'home.rewards.title': {
    en: 'Rewards, and Islander status',
    nl: 'Voordelen en de Islander-status',
    fr: 'Avantages et statut Islander',
    es: 'Recompensas y estado Islander',
  },
  'home.rewards.body': {
    en: 'Earn points on every rental and move up the tiers. Islander status is separate — it recognises people who live here, not what they spend.',
    nl: 'Verdien punten bij elke huur en klim door de niveaus. De Islander-status staat daar los van — die erkent mensen die hier wonen, niet wat zij uitgeven.',
    fr: 'Gagnez des points à chaque location et montez dans les niveaux. Le statut Islander est distinct : il reconnaît ceux qui vivent ici, pas ce qu’ils dépensent.',
    es: 'Gane puntos con cada alquiler y suba de nivel. El estado Islander va aparte: reconoce a quien vive aquí, no lo que gasta.',
  },
  'home.rewards.cta': {
    en: 'See How Rewards Work',
    nl: 'Bekijk Hoe Voordelen Werken',
    fr: 'Voir Comment ça Marche',
    es: 'Ver Cómo Funciona',
  },

  // ---- THE CLOSING ----
  'home.closing.title': {
    en: 'Ready when you are',
    nl: 'Klaar wanneer u dat bent',
    fr: 'Prêt quand vous le serez',
    es: 'Listo cuando usted quiera',
  },
  'home.closing.body': {
    en: 'Have a look around. Nothing asks you to sign up until you book.',
    nl: 'Kijk gerust rond. Er wordt pas om een account gevraagd wanneer u boekt.',
    fr: 'Regardez à votre aise. Rien ne vous demande de créer un compte avant de réserver.',
    es: 'Eche un vistazo. No se le pide crear una cuenta hasta que reserve.',
  },
} satisfies Record<string, Phrase>;
