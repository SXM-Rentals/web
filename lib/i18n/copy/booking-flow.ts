// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word in the four steps of making a booking — the
// trip, the payment, the agreement, and the confirmation — in all four
// languages.
//
// THIS IS THE ONE PLACE WHERE A BAD TRANSLATION COSTS MONEY. Everywhere else on
// the site an awkward sentence is untidy. Here it is somebody agreeing to
// something they did not understand: what is being charged today, what is only
// being held, what happens if they bring the car back late, and what they are
// signing. Each of those has been written out rather than translated word for
// word, because the word-for-word version of "the deposit is held, not charged"
// is meaningless in three of these four languages.
//
// THE AGREEMENT WORDING IS DRAFT, in every language including English. It says
// so on the page. When a lawyer writes the real thing, the translations must be
// done by a person and checked — not by whoever is nearest a keyboard.

import type { Phrase } from './types';

export const bookingFlow = {
  // ---- THE FOUR STEP NAMES ----
  'flow.step.trip': {
    en: 'Your Trip',
    nl: 'Uw Reis',
    fr: 'Votre Trajet',
    es: 'Su Viaje',
  },
  'flow.step.payment': {
    en: 'Payment',
    nl: 'Betaling',
    fr: 'Paiement',
    es: 'Pago',
  },
  'flow.step.agreement': {
    en: 'Rental Agreement',
    nl: 'Huurovereenkomst',
    fr: 'Contrat de Location',
    es: 'Contrato de Alquiler',
  },
  'flow.step.confirm': {
    en: 'Check and Confirm',
    nl: 'Controleren en Bevestigen',
    fr: 'Vérifier et Confirmer',
    es: 'Revisar y Confirmar',
  },
  'flow.step.done': {
    en: 'Booking Confirmed',
    nl: 'Boeking Bevestigd',
    fr: 'Réservation Confirmée',
    es: 'Reserva Confirmada',
  },

  // ---- STEP ONE: THE TRIP ----
  'flow.trip.title': {
    en: 'Your trip',
    nl: 'Uw reis',
    fr: 'Votre trajet',
    es: 'Su viaje',
  },
  'flow.trip.subtitle': {
    en: 'Check the dates and how you want to get the car. Nothing is charged at this step.',
    nl: 'Controleer de data en hoe u de auto wilt ontvangen. In deze stap wordt niets afgeschreven.',
    fr: 'Vérifiez les dates et la façon dont vous souhaitez récupérer la voiture. Rien n’est débité à cette étape.',
    es: 'Revise las fechas y cómo quiere recibir el coche. En este paso no se cobra nada.',
  },
  'flow.trip.noDates': {
    en: 'No dates chosen yet.',
    nl: 'Nog geen data gekozen.',
    fr: 'Aucune date choisie pour l’instant.',
    es: 'Todavía no ha elegido fechas.',
  },
  'flow.trip.deliverTo': {
    en: 'Deliver To',
    nl: 'Bezorgen naar',
    fr: 'Livrer à',
    es: 'Entregar en',
  },
  'flow.trip.deliverPlaceholder': {
    en: 'Hotel, address, or the airport',
    nl: 'Hotel, adres of het vliegveld',
    fr: 'Hôtel, adresse, ou l’aéroport',
    es: 'Hotel, dirección o el aeropuerto',
  },
  'flow.trip.backToCar': {
    en: 'Back to the Car',
    nl: 'Terug naar de Auto',
    fr: 'Retour à la Voiture',
    es: 'Volver al Coche',
  },
  'flow.trip.continueToPayment': {
    en: 'Continue to Payment',
    nl: 'Door naar Betaling',
    fr: 'Continuer vers le Paiement',
    es: 'Continuar al Pago',
  },

  // ---- SIGNING IN TO BOOK ----
  'flow.signIn.title': {
    en: 'Sign in to book this car',
    nl: 'Log in om deze auto te boeken',
    fr: 'Connectez-vous pour réserver cette voiture',
    es: 'Inicie sesión para reservar este coche',
  },
  'flow.signIn.body': {
    en: 'You can browse everything on SXM Rentals without an account. Booking needs one, because there is a deposit to hold, an identity check to do, and a rental agreement with your name on it.',
    nl: 'U kunt alles op SXM Rentals bekijken zonder account. Voor boeken heeft u er wel een nodig, omdat er een borgsom moet worden gereserveerd, een identiteitscontrole moet gebeuren, en er een huurovereenkomst met uw naam erop komt.',
    fr: 'Vous pouvez tout consulter sur SXM Rentals sans compte. Réserver en demande un, car il y a une caution à bloquer, une vérification d’identité à faire, et un contrat de location à votre nom.',
    es: 'Puede ver todo en SXM Rentals sin cuenta. Para reservar hace falta una, porque hay que retener una fianza, hacer una comprobación de identidad y firmar un contrato de alquiler a su nombre.',
  },

  // ---- STEP TWO: PAYMENT ----
  'flow.payment.title': {
    en: 'Payment',
    nl: 'Betaling',
    fr: 'Paiement',
    es: 'Pago',
  },
  'flow.payment.subtitle': {
    en: 'The rental is paid now. The deposit is held separately, just before you collect the car.',
    nl: 'De huur wordt nu betaald. De borgsom wordt apart gereserveerd, vlak voordat u de auto ophaalt.',
    fr: 'La location est payée maintenant. La caution est bloquée séparément, juste avant que vous récupériez la voiture.',
    es: 'El alquiler se paga ahora. La fianza se retiene aparte, justo antes de recoger el coche.',
  },
  'flow.payment.cardDetails': {
    en: 'Card Details',
    nl: 'Kaartgegevens',
    fr: 'Informations de carte',
    es: 'Datos de la tarjeta',
  },
  'flow.payment.cardNumber': {
    en: 'Card number',
    nl: 'Kaartnummer',
    fr: 'Numéro de carte',
    es: 'Número de tarjeta',
  },
  'flow.payment.placeholderNote': {
    en: 'This is a placeholder, not a working card form — nothing typed here would go anywhere. The real version uses Stripe Elements, where the fields belong to Stripe rather than to SXM Rentals, so your card number never passes through this site or our servers.',
    nl: 'Dit is een tijdelijke weergave, geen werkend kaartformulier — wat u hier typt gaat nergens heen. De echte versie gebruikt Stripe Elements, waarbij de velden van Stripe zijn en niet van SXM Rentals, zodat uw kaartnummer nooit langs deze site of onze servers komt.',
    fr: 'Ceci est un espace réservé, pas un vrai formulaire de carte — rien de ce qui est saisi ici n’irait où que ce soit. La vraie version utilise Stripe Elements, où les champs appartiennent à Stripe et non à SXM Rentals, si bien que votre numéro de carte ne passe jamais par ce site ni par nos serveurs.',
    es: 'Esto es un marcador de posición, no un formulario real de tarjeta: nada de lo que escriba aquí iría a ningún sitio. La versión real usa Stripe Elements, donde los campos pertenecen a Stripe y no a SXM Rentals, de modo que su número de tarjeta nunca pasa por este sitio ni por nuestros servidores.',
  },
  'flow.payment.stripeNote': {
    en: 'Stripe rather than to SXM Rentals, so your card number never passes through',
    nl: 'Stripe in plaats van naar SXM Rentals, zodat uw kaartnummer nooit langs',
    fr: 'Stripe plutôt qu’à SXM Rentals, afin que votre numéro de carte ne passe jamais par',
    es: 'a Stripe y no a SXM Rentals, de modo que su número de tarjeta nunca pasa por',
  },
  'flow.payment.savedMethods': {
    en: 'Saved Payment Methods',
    nl: 'Opgeslagen betaalmethoden',
    fr: 'Moyens de paiement enregistrés',
    es: 'Métodos de pago guardados',
  },
  'flow.payment.noSavedTitle': {
    en: 'No saved cards yet',
    nl: 'Nog geen opgeslagen kaarten',
    fr: 'Aucune carte enregistrée',
    es: 'Todavía no hay tarjetas guardadas',
  },
  'flow.payment.noSavedSubtitle': {
    en: 'A card you use is offered here next time, once payments are connected.',
    nl: 'Een kaart die u gebruikt wordt hier de volgende keer aangeboden, zodra betalingen zijn gekoppeld.',
    fr: 'Une carte que vous utilisez vous sera proposée ici la prochaine fois, une fois les paiements connectés.',
    es: 'La tarjeta que use se le ofrecerá aquí la próxima vez, cuando los pagos estén conectados.',
  },
  'flow.payment.payAndContinue': {
    en: 'Pay and Continue',
    nl: 'Betalen en Doorgaan',
    fr: 'Payer et Continuer',
    es: 'Pagar y Continuar',
  },

  // ---- STEP THREE: THE AGREEMENT ----
  'flow.agreement.title': {
    en: 'Rental Agreement',
    nl: 'Huurovereenkomst',
    fr: 'Contrat de location',
    es: 'Contrato de alquiler',
  },
  'flow.agreement.subtitle': {
    en: 'Read it, then sign. A copy is saved to your account and can be printed at any time.',
    nl: 'Lees het en teken daarna. Een kopie wordt in uw account bewaard en kan altijd worden afgedrukt.',
    fr: 'Lisez-le, puis signez. Une copie est enregistrée dans votre compte et peut être imprimée à tout moment.',
    es: 'Léalo y después firme. Se guarda una copia en su cuenta y puede imprimirla cuando quiera.',
  },
  'flow.agreement.whatYouAgree': {
    en: 'What You Are Agreeing To',
    nl: 'Waarmee u akkoord gaat',
    fr: 'Ce que vous acceptez',
    es: 'A qué se compromete',
  },
  'flow.agreement.termsLabel': {
    en: 'Rental Agreement Terms',
    nl: 'Voorwaarden van de huurovereenkomst',
    fr: 'Conditions du contrat de location',
    es: 'Condiciones del contrato de alquiler',
  },
  'flow.agreement.draftNote': {
    en: 'This is draft wording. The final agreement will be written and reviewed by a local attorney before launch. The full policies are in',
    nl: 'Dit is een conceptversie. De definitieve overeenkomst wordt vóór de lancering opgesteld en gecontroleerd door een lokale advocaat. De volledige voorwaarden staan in',
    fr: 'Ceci est une version provisoire. Le contrat définitif sera rédigé et relu par un avocat local avant le lancement. Les conditions complètes se trouvent dans',
    es: 'Este es un texto provisional. El contrato definitivo lo redactará y revisará un abogado local antes del lanzamiento. Las condiciones completas están en',
  },
  'flow.agreement.between': {
    en: 'Who this agreement is between',
    nl: 'Tussen wie deze overeenkomst geldt',
    fr: 'Entre qui ce contrat est conclu',
    es: 'Entre quiénes se firma este contrato',
  },
  'flow.agreement.vehicleAndDates': {
    en: 'The vehicle and the dates',
    nl: 'Het voertuig en de data',
    fr: 'Le véhicule et les dates',
    es: 'El vehículo y las fechas',
  },
  'flow.agreement.theDeposit': {
    en: 'The security deposit',
    nl: 'De borgsom',
    fr: 'La caution',
    es: 'La fianza',
  },
  'flow.agreement.whoMayDrive': {
    en: 'Who may drive',
    nl: 'Wie mag rijden',
    fr: 'Qui peut conduire',
    es: 'Quién puede conducir',
  },
  'flow.agreement.whoMayDriveBody': {
    en: 'Only you, and anyone else named on the booking who has passed the same licence check. Letting anyone else drive ends the cover on the vehicle.',
    nl: 'Alleen u, en iedereen die op de boeking staat en dezelfde rijbewijscontrole heeft doorlopen. Iemand anders laten rijden beëindigt de dekking op het voertuig.',
    fr: 'Vous seul, ainsi que toute personne nommée sur la réservation ayant passé le même contrôle de permis. Laisser conduire quelqu’un d’autre met fin à la couverture du véhicule.',
    es: 'Solo usted y cualquier otra persona indicada en la reserva que haya pasado la misma comprobación del carné. Dejar conducir a otra persona anula la cobertura del vehículo.',
  },
  'flow.agreement.damage': {
    en: 'Damage, fuel and fines',
    nl: 'Schade, brandstof en boetes',
    fr: 'Dommages, carburant et amendes',
    es: 'Daños, combustible y multas',
  },
  'flow.agreement.damageBody': {
    en: 'The vehicle comes back in the condition it left in, with the same amount of fuel. Damage, missing fuel, a late return or a traffic fine may be taken from the deposit, and the business has to tell you why.',
    nl: 'Het voertuig komt terug in de staat waarin het vertrok, met dezelfde hoeveelheid brandstof. Schade, ontbrekende brandstof, te laat terugbrengen of een verkeersboete kunnen van de borgsom worden afgetrokken, en het bedrijf moet u vertellen waarom.',
    fr: 'Le véhicule est rendu dans l’état où il est parti, avec la même quantité de carburant. Les dommages, le carburant manquant, un retard ou une amende peuvent être déduits de la caution, et le loueur doit vous en donner la raison.',
    es: 'El vehículo se devuelve en el mismo estado en que salió y con la misma cantidad de combustible. Los daños, la falta de combustible, una devolución tardía o una multa pueden descontarse de la fianza, y la empresa tiene que explicarle el motivo.',
  },
  'flow.agreement.late': {
    en: 'Returning late',
    nl: 'Te laat terugbrengen',
    fr: 'Rendre en retard',
    es: 'Devolver con retraso',
  },
  'flow.agreement.lateBody': {
    en: 'Let the business know through SXM Rentals if you are running late. An unannounced late return may be charged at the daily rate.',
    nl: 'Laat het bedrijf via SXM Rentals weten als u later bent. Een niet-aangekondigde late teruggave kan tegen het dagtarief worden berekend.',
    fr: 'Prévenez le loueur via SXM Rentals si vous êtes en retard. Un retard non annoncé peut être facturé au tarif journalier.',
    es: 'Avise a la empresa a través de SXM Rentals si va con retraso. Una devolución tardía sin avisar puede cobrarse a la tarifa diaria.',
  },
  'flow.agreement.cancelling': {
    en: 'Cancelling',
    nl: 'Annuleren',
    fr: 'Annulation',
    es: 'Cancelación',
  },
  'flow.agreement.cancellingBody': {
    en: 'What you get back depends on how close to the start you cancel. The refund is always shown to you before a cancellation is confirmed.',
    nl: 'Wat u terugkrijgt hangt af van hoe kort voor aanvang u annuleert. Het terugbetaalde bedrag wordt altijd getoond voordat een annulering wordt bevestigd.',
    fr: 'Ce que vous récupérez dépend de la proximité de la date de début. Le remboursement vous est toujours indiqué avant qu’une annulation soit confirmée.',
    es: 'Lo que se le devuelve depende de con cuánta antelación cancele. El importe del reembolso siempre se le muestra antes de confirmar una cancelación.',
  },
  'flow.agreement.yourSignature': {
    en: 'Your Signature',
    nl: 'Uw handtekening',
    fr: 'Votre signature',
    es: 'Su firma',
  },
  'flow.agreement.consent': {
    en: 'I Have Read the Rental Agreement Above and I Agree to It.',
    nl: 'Ik heb de bovenstaande huurovereenkomst gelezen en ga ermee akkoord.',
    fr: 'J’ai lu le contrat de location ci-dessus et je l’accepte.',
    es: 'He leído el contrato de alquiler anterior y lo acepto.',
  },
  'flow.agreement.signAndContinue': {
    en: 'Sign and Continue',
    nl: 'Tekenen en Doorgaan',
    fr: 'Signer et Continuer',
    es: 'Firmar y Continuar',
  },

  // ---- SIGNING ----
  'flow.sign.how': {
    en: 'How You Want to Sign',
    nl: 'Hoe u wilt tekenen',
    fr: 'Comment vous souhaitez signer',
    es: 'Cómo quiere firmar',
  },
  'flow.sign.draw': {
    en: 'Draw It',
    nl: 'Tekenen',
    fr: 'La dessiner',
    es: 'Dibujarla',
  },
  'flow.sign.type': {
    en: 'Type It',
    nl: 'Typen',
    fr: 'La saisir',
    es: 'Escribirla',
  },
  'flow.sign.boxLabel': {
    en: 'Signature Box. Draw Your Signature Here with a Mouse, Finger or Stylus, or Switch to Typing It.',
    nl: 'Handtekeningvak. Teken hier uw handtekening met de muis, uw vinger of een stylus, of schakel over naar typen.',
    fr: 'Zone de signature. Dessinez votre signature ici avec la souris, le doigt ou un stylet, ou passez à la saisie.',
    es: 'Recuadro de firma. Dibuje aquí su firma con el ratón, el dedo o un lápiz óptico, o cambie a escribirla.',
  },
  'flow.sign.hint': {
    en: 'Use your mouse, finger or a stylus.',
    nl: 'Gebruik uw muis, vinger of een stylus.',
    fr: 'Utilisez la souris, le doigt ou un stylet.',
    es: 'Use el ratón, el dedo o un lápiz óptico.',
  },
  'flow.sign.typeName': {
    en: 'Type Your Full Name',
    nl: 'Typ uw volledige naam',
    fr: 'Saisissez votre nom complet',
    es: 'Escriba su nombre completo',
  },
  'flow.sign.asOnLicence': {
    en: 'As it appears on your licence',
    nl: 'Zoals op uw rijbewijs staat',
    fr: 'Tel qu’il figure sur votre permis',
    es: 'Tal como aparece en su carné',
  },

  // ---- STEP FOUR: CHECK AND CONFIRM ----
  'flow.confirm.title': {
    en: 'Check and confirm',
    nl: 'Controleren en bevestigen',
    fr: 'Vérifier et confirmer',
    es: 'Revisar y confirmar',
  },
  'flow.confirm.subtitle': {
    en: 'Last look before this is booked. Everything here can still be changed.',
    nl: 'Laatste controle voordat dit wordt geboekt. Alles hier kan nog worden gewijzigd.',
    fr: 'Dernier coup d’œil avant de réserver. Tout est encore modifiable.',
    es: 'Última revisión antes de reservar. Todo esto todavía se puede cambiar.',
  },
  'flow.confirm.yourBooking': {
    en: 'Your Booking',
    nl: 'Uw boeking',
    fr: 'Votre réservation',
    es: 'Su reserva',
  },
  'flow.confirm.vehicle': {
    en: 'Vehicle',
    nl: 'Voertuig',
    fr: 'Véhicule',
    es: 'Vehículo',
  },
  'flow.confirm.dates': {
    en: 'Dates',
    nl: 'Data',
    fr: 'Dates',
    es: 'Fechas',
  },
  'flow.confirm.length': {
    en: 'Length',
    nl: 'Duur',
    fr: 'Durée',
    es: 'Duración',
  },
  'flow.confirm.driver': {
    en: 'Driver',
    nl: 'Bestuurder',
    fr: 'Conducteur',
    es: 'Conductor',
  },
  'flow.confirm.paidToday': {
    en: 'Paid Today',
    nl: 'Vandaag betaald',
    fr: 'Payé aujourd’hui',
    es: 'Pagado hoy',
  },
  'flow.confirm.depositHeld': {
    en: 'Deposit Held',
    nl: 'Borgsom gereserveerd',
    fr: 'Caution bloquée',
    es: 'Fianza retenida',
  },
  'flow.confirm.signedNote': {
    en: 'The rental agreement has been signed and will be saved to your account.',
    nl: 'De huurovereenkomst is ondertekend en wordt in uw account bewaard.',
    fr: 'Le contrat de location a été signé et sera enregistré dans votre compte.',
    es: 'El contrato de alquiler está firmado y se guardará en su cuenta.',
  },
  'flow.confirm.privacyNote': {
    en: 'The business is told your first name and last initial, the dates and the amount — enough to hand the car to the right person. Your phone number and email address are not shared with them.',
    nl: 'Het bedrijf krijgt uw voornaam en de eerste letter van uw achternaam, de data en het bedrag — genoeg om de auto aan de juiste persoon te geven. Uw telefoonnummer en e-mailadres worden niet met hen gedeeld.',
    fr: 'Le loueur reçoit votre prénom et l’initiale de votre nom, les dates et le montant — de quoi remettre la voiture à la bonne personne. Votre numéro de téléphone et votre adresse e-mail ne lui sont pas communiqués.',
    es: 'A la empresa se le indican su nombre y la inicial del apellido, las fechas y el importe: lo suficiente para entregar el coche a la persona correcta. Su teléfono y su correo no se comparten con ella.',
  },
  'flow.confirm.cta': {
    en: 'Confirm Booking',
    nl: 'Boeking Bevestigen',
    fr: 'Confirmer la Réservation',
    es: 'Confirmar la Reserva',
  },

  // ---- DONE ----
  'flow.done.title': {
    en: 'You are booked',
    nl: 'U bent geboekt',
    fr: 'C’est réservé',
    es: 'Su reserva está hecha',
  },
  'flow.done.whatNext': {
    en: 'What Happens Next',
    nl: 'Wat er nu gebeurt',
    fr: 'Ce qui se passe ensuite',
    es: 'Qué pasa ahora',
  },
  'flow.done.emailTitle': {
    en: 'A confirmation is on its way',
    nl: 'Er is een bevestiging onderweg',
    fr: 'Une confirmation est en route',
    es: 'Le llegará una confirmación',
  },
  'flow.done.emailBody': {
    en: 'It carries the reference above, the collection details, and a copy of the agreement you signed.',
    nl: 'Daarin staan het bovenstaande referentienummer, de ophaalgegevens en een kopie van de door u ondertekende overeenkomst.',
    fr: 'Elle contient la référence ci-dessus, les détails du retrait et une copie du contrat que vous avez signé.',
    es: 'Incluye la referencia de arriba, los datos de recogida y una copia del contrato que firmó.',
  },
  'flow.done.contactTitle': {
    en: 'The business will be in touch',
    nl: 'Het bedrijf neemt contact op',
    fr: 'Le loueur vous contactera',
    es: 'La empresa se pondrá en contacto',
  },
  'flow.done.contactBody': {
    en: 'They will confirm exactly where and when to collect the car, through SXM Rentals messages.',
    nl: 'Zij bevestigen precies waar en wanneer u de auto ophaalt, via de berichten van SXM Rentals.',
    fr: 'Il confirmera exactement où et quand récupérer la voiture, via la messagerie SXM Rentals.',
    es: 'Le confirmará exactamente dónde y cuándo recoger el coche, a través de los mensajes de SXM Rentals.',
  },
  'flow.done.depositTitle': {
    en: 'The deposit is held just before pickup',
    nl: 'De borgsom wordt vlak voor het ophalen gereserveerd',
    fr: 'La caution est bloquée juste avant le retrait',
    es: 'La fianza se retiene justo antes de la recogida',
  },
  'flow.done.licenceTitle': {
    en: 'Bring your licence',
    nl: 'Neem uw rijbewijs mee',
    fr: 'Apportez votre permis',
    es: 'Traiga su carné',
  },
  'flow.done.licenceBody': {
    en: 'The same licence you had verified. The business has to see the physical card when handing over the keys.',
    nl: 'Hetzelfde rijbewijs dat u heeft laten verifiëren. Het bedrijf moet het fysieke pasje zien bij het overhandigen van de sleutels.',
    fr: 'Le même permis que celui que vous avez fait vérifier. Le loueur doit voir la carte physique au moment de remettre les clés.',
    es: 'El mismo carné que verificó. La empresa tiene que ver el documento físico al entregar las llaves.',
  },
  'flow.done.seeRentals': {
    en: 'See My Rentals',
    nl: 'Mijn Huurauto’s Bekijken',
    fr: 'Voir Mes Locations',
    es: 'Ver Mis Alquileres',
  },
  'flow.done.browseMore': {
    en: 'Browse More Cars',
    nl: 'Meer Auto’s Bekijken',
    fr: 'Voir D’autres Voitures',
    es: 'Ver Más Coches',
  },
} satisfies Record<string, Phrase>;
