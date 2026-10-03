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
    en: 'Nothing is charged on this step. This is what the rental comes to, and what the deposit is.',
    nl: 'In deze stap wordt niets afgeschreven. Dit is wat de huur kost, en wat de borg is.',
    fr: 'Rien n’est débité à cette étape. Voici ce que coûte la location, et ce qu’est la caution.',
    es: 'En este paso no se cobra nada. Esto es lo que cuesta el alquiler y lo que es la fianza.',
  },

  // ---- STEP THREE: THE AGREEMENT ----
  'flow.agreement.title': {
    en: 'Rental Agreement',
    nl: 'Huurovereenkomst',
    fr: 'Contrat de location',
    es: 'Contrato de alquiler',
  },
  'flow.agreement.subtitle': {
    en: 'Read it, then sign. The business will ask you to sign again when you collect the car.',
    nl: 'Lees het en onderteken. Het bedrijf vraagt u opnieuw te tekenen wanneer u de auto ophaalt.',
    fr: 'Lisez-le, puis signez. Le loueur vous demandera de signer à nouveau au moment du retrait.',
    es: 'Léalo y fírmelo. La empresa le pedirá que firme de nuevo cuando recoja el coche.',
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
    en: 'You signed the agreement on the previous step. It is not recorded on the booking yet, so the business will ask for a signature when you collect the car.',
    nl: 'U heeft de overeenkomst in de vorige stap ondertekend. Dat wordt nog niet bij de boeking vastgelegd, dus het bedrijf vraagt bij het ophalen om een handtekening.',
    fr: 'Vous avez signé le contrat à l’étape précédente. Cela n’est pas encore enregistré avec la réservation : le loueur vous demandera une signature au retrait.',
    es: 'Firmó el contrato en el paso anterior. Todavía no queda registrado en la reserva, así que la empresa le pedirá una firma al recoger el coche.',
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
    en: 'It carries the reference above and your dates. The rental is in your account as well.',
    nl: 'Daarin staan het bovenstaande kenmerk en uw data. De huur staat ook in uw account.',
    fr: 'Elle reprend la référence ci-dessus et vos dates. La location figure aussi dans votre compte.',
    es: 'Incluye la referencia de arriba y sus fechas. El alquiler también está en su cuenta.',
  },
  'flow.done.contactTitle': {
    en: 'Talk to the business',
    nl: 'Praat met het bedrijf',
    fr: 'Parlez avec le loueur',
    es: 'Hable con la empresa',
  },
  'flow.done.contactBody': {
    en: 'Message them through SXM Rentals to agree exactly where and when to collect the car. They never see your phone number or email address.',
    nl: 'Stuur ze een bericht via SXM Rentals om precies af te spreken waar en wanneer u de auto ophaalt. Zij zien nooit uw telefoonnummer of e-mailadres.',
    fr: 'Écrivez-leur via SXM Rentals pour convenir précisément du lieu et de l’heure du retrait. Ils ne voient jamais votre numéro de téléphone ni votre e-mail.',
    es: 'Escríbales por SXM Rentals para acordar exactamente dónde y cuándo recoger el coche. Nunca ven su número de teléfono ni su correo electrónico.',
  },
  'flow.done.depositTitle': {
    en: 'Paying, and the deposit',
    nl: 'Betalen en de borgsom',
    fr: 'Le paiement et la caution',
    es: 'El pago y la fianza',
  },
  'flow.done.licenceTitle': {
    en: 'Bring your licence',
    nl: 'Neem uw rijbewijs mee',
    fr: 'Apportez votre permis',
    es: 'Traiga su carné',
  },
  'flow.done.licenceBody': {
    en: 'The business has to see the physical card when it hands over the keys.',
    nl: 'Het bedrijf moet het fysieke pasje zien bij het overhandigen van de sleutels.',
    fr: 'Le loueur doit voir le permis physique au moment de remettre les clés.',
    es: 'La empresa tiene que ver el carné físico al entregar las llaves.',
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

  // ---- PRICED BY THE BACKEND, AND PAID TO THE BUSINESS FOR NOW ----
  'flow.price.needDates': {
    en: 'Choose your dates to see the price.',
    nl: 'Kies uw data om de prijs te zien.',
    fr: 'Choisissez vos dates pour voir le prix.',
    es: 'Elija sus fechas para ver el precio.',
  },
  'flow.trip.justBooked': {
    en: 'This car has just been booked for those dates. Please choose different dates.',
    nl: 'Deze auto is zojuist voor die data geboekt. Kies andere data.',
    fr: 'Cette voiture vient d’être réservée pour ces dates. Choisissez d’autres dates.',
    es: 'Este coche acaba de reservarse para esas fechas. Elija otras fechas.',
  },
  'flow.trip.deliveryFree': {
    en: 'Delivery is not charged for on SXM Rentals.',
    nl: 'Bezorgen kost niets op SXM Rentals.',
    fr: 'La livraison n’est pas facturée sur SXM Rentals.',
    es: 'La entrega no se cobra en SXM Rentals.',
  },
  'flow.payment.theRental': {
    en: 'the rental',
    nl: 'de huur',
    fr: 'la location',
    es: 'el alquiler',
  },
  'flow.payment.depositTitle': {
    en: 'About the Security Deposit',
    nl: 'Over de borgsom',
    fr: 'À propos de la caution',
    es: 'Sobre la fianza',
  },
  'flow.payment.depositBody': {
    en: '{amount} is the deposit for this car. It is held on your card, never charged: you place the hold on your rental’s page from two days before pickup, and it is released after the car is returned and checked.',
    nl: '{amount} is de borg voor deze auto. Die wordt op uw kaart vastgehouden, nooit afgeschreven: u plaatst de blokkering vanaf twee dagen voor het ophalen op de pagina van uw huur, en die wordt vrijgegeven nadat de auto is teruggebracht en gecontroleerd.',
    fr: '{amount} est la caution pour cette voiture. Elle est bloquée sur votre carte, jamais débitée : vous placez le blocage sur la page de votre location à partir de deux jours avant la prise en charge, et il est levé une fois la voiture rendue et vérifiée.',
    es: '{amount} es la fianza de este coche. Se retiene en su tarjeta, nunca se cobra: usted la retiene en la página de su alquiler desde dos días antes de la recogida, y se libera cuando el coche se devuelve y se revisa.',
  },
  'flow.payment.depositReturned': {
    en: 'A deposit is never a charge. Whatever is held is given back after the car is returned and checked.',
    nl: 'Een borgsom is nooit een betaling. Wat wordt vastgehouden, krijgt u terug nadat de auto is ingeleverd en gecontroleerd.',
    fr: 'Une caution n’est jamais un paiement. Ce qui est bloqué vous est rendu après le retour et la vérification de la voiture.',
    es: 'Una fianza nunca es un cobro. Lo que se retenga se devuelve después de entregar el coche y comprobarlo.',
  },
  'flow.payment.depositClaims': {
    en: 'Money is only taken from it for damage, a late return, missing fuel or a traffic fine — and the business has to tell you why. You can dispute it.',
    nl: 'Er wordt alleen geld afgehouden voor schade, te laat inleveren, ontbrekende brandstof of een verkeersboete — en het bedrijf moet u zeggen waarom. U kunt het betwisten.',
    fr: 'De l’argent n’en est retiré que pour des dommages, un retour tardif, du carburant manquant ou une amende — et le loueur doit vous en dire la raison. Vous pouvez la contester.',
    es: 'Solo se descuenta dinero por daños, una devolución tardía, falta de combustible o una multa de tráfico, y la empresa tiene que decirle por qué. Puede reclamar.',
  },
  'flow.payment.depositUnderstood': {
    en: 'I understand that {amount} is the deposit for this car, that it is not part of the rental price, and that it is held on my card, not charged.',
    nl: 'Ik begrijp dat {amount} de borg voor deze auto is, dat die geen deel uitmaakt van de huurprijs, en dat die op mijn kaart wordt vastgehouden, niet afgeschreven.',
    fr: 'Je comprends que {amount} est la caution pour cette voiture, qu’elle ne fait pas partie du prix de la location, et qu’elle est bloquée sur ma carte, pas débitée.',
    es: 'Entiendo que {amount} es la fianza de este coche, que no forma parte del precio del alquiler y que se retiene en mi tarjeta, no se cobra.',
  },
  'flow.agreement.notRecorded': {
    en: 'Signing here is not recorded on your booking yet, so the business will ask you to sign the agreement again when you collect the car.',
    nl: 'Deze handtekening wordt nog niet bij uw boeking vastgelegd, dus het bedrijf vraagt u de overeenkomst bij het ophalen opnieuw te tekenen.',
    fr: 'Cette signature n’est pas encore enregistrée avec votre réservation : le loueur vous demandera de signer à nouveau le contrat au retrait.',
    es: 'Esta firma todavía no queda registrada en su reserva, así que la empresa le pedirá que firme el contrato de nuevo al recoger el coche.',
  },
  'flow.confirm.depositRow': {
    en: '{amount}, arranged with the business',
    nl: '{amount}, te regelen met het bedrijf',
    fr: '{amount}, à régler avec le loueur',
    es: '{amount}, se acuerda con la empresa',
  },
  'flow.confirm.depositNote': {
    en: 'The {amount} deposit is not part of the total. SXM Rentals does not hold it yet — you arrange it with the business when you collect the car.',
    nl: 'De borgsom van {amount} maakt geen deel uit van het totaal. SXM Rentals houdt die nog niet vast — u regelt het met het bedrijf bij het ophalen.',
    fr: 'La caution de {amount} ne fait pas partie du total. SXM Rentals ne la bloque pas encore : vous la réglez avec le loueur au moment du retrait.',
    es: 'La fianza de {amount} no forma parte del total. SXM Rentals todavía no la retiene: la acuerda con la empresa al recoger el coche.',
  },
  'flow.confirm.nothingCharged': {
    en: 'Nothing is charged now. You pay the rental business when you collect the car.',
    nl: 'Er wordt nu niets afgeschreven. U betaalt het verhuurbedrijf wanneer u de auto ophaalt.',
    fr: 'Rien n’est débité maintenant. Vous payez le loueur au moment du retrait.',
    es: 'Ahora no se cobra nada. Paga a la empresa de alquiler cuando recoge el coche.',
  },
  'flow.done.depositBody': {
    en: 'Pay the rental by card below, or later from your rental’s page. The deposit is held on your card from two days before pickup; your rental’s page asks you then.',
    nl: 'Betaal de huur hieronder met uw kaart, of later via de pagina van uw huur. De borg wordt vanaf twee dagen voor het ophalen op uw kaart vastgehouden; de pagina van uw huur vraagt u dat dan.',
    fr: 'Payez la location par carte ci-dessous, ou plus tard depuis la page de votre location. La caution est bloquée sur votre carte à partir de deux jours avant la prise en charge ; la page de votre location vous le demandera alors.',
    es: 'Pague el alquiler con tarjeta aquí abajo, o más tarde desde la página de su alquiler. La fianza se retiene en su tarjeta desde dos días antes de la recogida; la página de su alquiler se lo pedirá entonces.',
  },
  'flow.done.noReference': {
    en: 'This page shows a booking once one has been made. Your rentals are in your account.',
    nl: 'Deze pagina toont een boeking zodra er een is gemaakt. Uw huurperiodes staan in uw account.',
    fr: 'Cette page affiche une réservation une fois qu’elle est faite. Vos locations sont dans votre compte.',
    es: 'Esta página muestra una reserva cuando se ha hecho. Sus alquileres están en su cuenta.',
  },

  // ---- PAYING BY CARD — components/payments/, and the saved cards page ----
  'flow.payment.howTitle': {
    en: 'How You Pay',
    nl: 'Hoe u betaalt',
    fr: 'Comment vous payez',
    es: 'Cómo paga',
  },
  'flow.payment.howBody': {
    en: 'Once you confirm the booking, you pay {amount} by card on the next page, through Stripe: your card number goes to them, never to SXM Rentals. You can also pay later, from the rental’s page.',
    nl: 'Zodra u de boeking bevestigt, betaalt u {amount} met uw kaart op de volgende pagina, via Stripe: uw kaartnummer gaat naar hen, nooit naar SXM Rentals. U kunt ook later betalen, via de pagina van de huur.',
    fr: 'Une fois la réservation confirmée, vous payez {amount} par carte sur la page suivante, via Stripe : votre numéro de carte leur est transmis, jamais à SXM Rentals. Vous pouvez aussi payer plus tard, depuis la page de la location.',
    es: 'Una vez confirmada la reserva, paga {amount} con tarjeta en la página siguiente, a través de Stripe: el número de su tarjeta va a ellos, nunca a SXM Rentals. También puede pagar más tarde, desde la página del alquiler.',
  },
  'pay.form.testMode': {
    en: 'Test mode: no real card is charged. Use Stripe’s test card 4242 4242 4242 4242, with any future date and any security code.',
    nl: 'Testmodus: er wordt geen echte kaart belast. Gebruik de testkaart van Stripe, 4242 4242 4242 4242, met een willekeurige toekomstige datum en beveiligingscode.',
    fr: 'Mode test : aucune vraie carte n’est débitée. Utilisez la carte de test de Stripe, 4242 4242 4242 4242, avec n’importe quelle date future et n’importe quel code de sécurité.',
    es: 'Modo de prueba: no se cobra ninguna tarjeta real. Use la tarjeta de prueba de Stripe, 4242 4242 4242 4242, con cualquier fecha futura y cualquier código de seguridad.',
  },
  'pay.form.failed': {
    en: 'That didn’t go through. Please try again.',
    nl: 'Dat is niet gelukt. Probeer het opnieuw.',
    fr: 'Cela n’a pas abouti. Veuillez réessayer.',
    es: 'No se ha podido completar. Inténtelo de nuevo.',
  },
  'pay.form.secure': {
    en: 'Card details go straight to Stripe and never reach SXM Rentals.',
    nl: 'Kaartgegevens gaan rechtstreeks naar Stripe en komen nooit bij SXM Rentals.',
    fr: 'Les données de carte vont directement à Stripe et ne parviennent jamais à SXM Rentals.',
    es: 'Los datos de la tarjeta van directamente a Stripe y nunca llegan a SXM Rentals.',
  },
  'pay.rental.title': {
    en: 'Pay for the Rental',
    nl: 'De huur betalen',
    fr: 'Payer la location',
    es: 'Pagar el alquiler',
  },
  'pay.rental.intro': {
    en: 'Pay now by card, through Stripe. The rental shows as paid once Stripe has confirmed it.',
    nl: 'Betaal nu met uw kaart, via Stripe. De huur staat als betaald zodra Stripe dat heeft bevestigd.',
    fr: 'Payez maintenant par carte, via Stripe. La location apparaît comme payée dès que Stripe l’a confirmé.',
    es: 'Pague ahora con tarjeta, a través de Stripe. El alquiler aparece como pagado en cuanto Stripe lo confirma.',
  },
  'pay.rental.payByCard': {
    en: 'Pay {amount} by Card',
    nl: '{amount} betalen met kaart',
    fr: 'Payer {amount} par carte',
    es: 'Pagar {amount} con tarjeta',
  },
  'pay.rental.payAmount': {
    en: 'Pay {amount}',
    nl: '{amount} betalen',
    fr: 'Payer {amount}',
    es: 'Pagar {amount}',
  },
  'pay.rental.confirming': {
    en: 'Stripe has the payment. Waiting for your booking to show it as paid…',
    nl: 'Stripe heeft de betaling. Even wachten tot uw boeking als betaald staat…',
    fr: 'Stripe a reçu le paiement. En attente que votre réservation apparaisse comme payée…',
    es: 'Stripe ha recibido el pago. Esperando a que su reserva aparezca como pagada…',
  },
  'pay.rental.paid': {
    en: 'Paid — {amount} by card.',
    nl: 'Betaald — {amount} met kaart.',
    fr: 'Payé — {amount} par carte.',
    es: 'Pagado: {amount} con tarjeta.',
  },
  'pay.rental.slow': {
    en: 'Stripe has taken the payment. Your booking will show it as paid in a few minutes.',
    nl: 'Stripe heeft de betaling ontvangen. Uw boeking staat over een paar minuten als betaald.',
    fr: 'Stripe a reçu le paiement. Votre réservation apparaîtra comme payée d’ici quelques minutes.',
    es: 'Stripe ha recibido el pago. Su reserva aparecerá como pagada en unos minutos.',
  },
  'pay.rental.off': {
    en: 'Card payments aren’t switched on yet. You settle {amount} with the rental business when you collect the car.',
    nl: 'Kaartbetalingen zijn nog niet ingeschakeld. U rekent {amount} af met het verhuurbedrijf wanneer u de auto ophaalt.',
    fr: 'Les paiements par carte ne sont pas encore activés. Vous réglez {amount} avec le loueur lorsque vous récupérez la voiture.',
    es: 'Los pagos con tarjeta aún no están activados. Usted abona {amount} a la empresa de alquiler al recoger el coche.',
  },
  'pay.rental.lastFailed': {
    en: 'The last payment attempt didn’t go through. You can try again, with the same card or another.',
    nl: 'De laatste betaalpoging is niet gelukt. U kunt het opnieuw proberen, met dezelfde kaart of een andere.',
    fr: 'La dernière tentative de paiement n’a pas abouti. Vous pouvez réessayer, avec la même carte ou une autre.',
    es: 'El último intento de pago no se completó. Puede intentarlo de nuevo, con la misma tarjeta u otra.',
  },
  'pay.rental.bankRefused': {
    en: 'Your bank didn’t approve the payment, so nothing was charged. You can try again.',
    nl: 'Uw bank heeft de betaling niet goedgekeurd, dus er is niets afgeschreven. U kunt het opnieuw proberen.',
    fr: 'Votre banque n’a pas approuvé le paiement : rien n’a donc été débité. Vous pouvez réessayer.',
    es: 'Su banco no aprobó el pago, así que no se cobró nada. Puede intentarlo de nuevo.',
  },
  'pay.deposit.intro': {
    en: 'Place the {amount} hold now. It’s set aside on your card, not charged, and released after you return the car.',
    nl: 'Plaats nu de blokkering van {amount}. Die wordt op uw kaart gereserveerd, niet afgeschreven, en vrijgegeven nadat u de auto hebt teruggebracht.',
    fr: 'Placez maintenant le blocage de {amount}. Il est réservé sur votre carte, pas débité, et levé après le retour de la voiture.',
    es: 'Retenga ahora los {amount}. Se reservan en su tarjeta, no se cobran, y se liberan cuando devuelva el coche.',
  },
  'pay.deposit.hold': {
    en: 'Hold the {amount} Deposit',
    nl: 'Borg van {amount} blokkeren',
    fr: 'Bloquer la caution de {amount}',
    es: 'Retener la fianza de {amount}',
  },
  'pay.deposit.holdAmount': {
    en: 'Hold {amount}',
    nl: '{amount} blokkeren',
    fr: 'Bloquer {amount}',
    es: 'Retener {amount}',
  },
  'pay.deposit.notYet': {
    en: 'You can place the hold from {date}, two days before pickup. A hold on a card only lasts about a week, so it can’t go on sooner.',
    nl: 'U kunt de blokkering plaatsen vanaf {date}, twee dagen voor het ophalen. Een blokkering op een kaart duurt maar ongeveer een week, dus eerder kan niet.',
    fr: 'Vous pourrez placer le blocage à partir du {date}, deux jours avant la prise en charge. Un blocage sur une carte ne dure qu’environ une semaine : il ne peut donc pas être placé plus tôt.',
    es: 'Podrá hacer la retención a partir del {date}, dos días antes de la recogida. Una retención en una tarjeta solo dura una semana aproximadamente, así que no puede hacerse antes.',
  },
  'pay.deposit.confirming': {
    en: 'Stripe has the hold. Waiting for your rental to show it as held…',
    nl: 'Stripe heeft de blokkering. Even wachten tot uw huur die als vastgehouden toont…',
    fr: 'Stripe a placé le blocage. En attente que votre location l’affiche comme bloquée…',
    es: 'Stripe tiene la retención. Esperando a que su alquiler la muestre como retenida…',
  },
  'pay.deposit.slow': {
    en: 'Stripe has placed the hold. Your rental will show it as held in a few minutes.',
    nl: 'Stripe heeft de blokkering geplaatst. Uw huur toont die over een paar minuten als vastgehouden.',
    fr: 'Stripe a placé le blocage. Votre location l’affichera comme bloquée d’ici quelques minutes.',
    es: 'Stripe ha hecho la retención. Su alquiler la mostrará como retenida en unos minutos.',
  },
  'pay.deposit.off': {
    en: 'SXM Rentals can’t hold deposits on cards yet. The rental business arranges the deposit with you when you collect the car.',
    nl: 'SXM Rentals kan nog geen borg op kaarten vasthouden. Het verhuurbedrijf regelt de borg met u wanneer u de auto ophaalt.',
    fr: 'SXM Rentals ne peut pas encore bloquer de caution sur les cartes. Le loueur organise la caution avec vous lorsque vous récupérez la voiture.',
    es: 'SXM Rentals aún no puede retener fianzas en tarjetas. La empresa de alquiler acuerda la fianza con usted al recoger el coche.',
  },
  'pay.deposit.bankRefused': {
    en: 'Your bank didn’t approve the hold, so nothing was set aside. You can try again.',
    nl: 'Uw bank heeft de blokkering niet goedgekeurd, dus er is niets gereserveerd. U kunt het opnieuw proberen.',
    fr: 'Votre banque n’a pas approuvé le blocage : rien n’a donc été réservé. Vous pouvez réessayer.',
    es: 'Su banco no aprobó la retención, así que no se reservó nada. Puede intentarlo de nuevo.',
  },
  'pay.deposit.expiresEarly': {
    en: 'Your bank will drop this hold on {date}, before the car is due back. You may be asked to place it again.',
    nl: 'Uw bank laat deze blokkering vervallen op {date}, voordat de auto terug moet zijn. Mogelijk wordt u gevraagd die opnieuw te plaatsen.',
    fr: 'Votre banque lèvera ce blocage le {date}, avant la date de retour de la voiture. Il pourra vous être demandé de le placer à nouveau.',
    es: 'Su banco anulará esta retención el {date}, antes de la fecha de devolución del coche. Puede que se le pida hacerla de nuevo.',
  },
  'pay.cards.none': {
    en: 'No cards saved yet.',
    nl: 'Nog geen kaarten opgeslagen.',
    fr: 'Aucune carte enregistrée pour l’instant.',
    es: 'Todavía no hay tarjetas guardadas.',
  },
  'pay.cards.add': {
    en: 'Add a Card',
    nl: 'Kaart toevoegen',
    fr: 'Ajouter une carte',
    es: 'Añadir una tarjeta',
  },
  'pay.cards.save': {
    en: 'Save Card',
    nl: 'Kaart opslaan',
    fr: 'Enregistrer la carte',
    es: 'Guardar la tarjeta',
  },
  'pay.cards.saved': {
    en: 'Your card is saved.',
    nl: 'Uw kaart is opgeslagen.',
    fr: 'Votre carte est enregistrée.',
    es: 'Su tarjeta está guardada.',
  },
  'pay.cards.expires': {
    en: 'Expires {month}/{year}',
    nl: 'Verloopt {month}/{year}',
    fr: 'Expire le {month}/{year}',
    es: 'Caduca {month}/{year}',
  },
  'pay.cards.default': {
    en: 'DEFAULT',
    nl: 'STANDAARD',
    fr: 'PAR DÉFAUT',
    es: 'PREDETERMINADA',
  },
  'pay.cards.makeDefault': {
    en: 'Make Default',
    nl: 'Als standaard',
    fr: 'Par défaut',
    es: 'Predeterminar',
  },
  'pay.cards.remove': {
    en: 'Remove',
    nl: 'Verwijderen',
    fr: 'Supprimer',
    es: 'Quitar',
  },
  'pay.cards.removeTitle': {
    en: 'Remove this card?',
    nl: 'Deze kaart verwijderen?',
    fr: 'Supprimer cette carte ?',
    es: '¿Quitar esta tarjeta?',
  },
  'pay.cards.removeBody': {
    en: '{card} will no longer be saved with your account. Payments already made aren’t affected.',
    nl: '{card} wordt niet langer bij uw account bewaard. Betalingen die al zijn gedaan, veranderen niet.',
    fr: '{card} ne sera plus enregistrée avec votre compte. Les paiements déjà effectués ne sont pas concernés.',
    es: '{card} dejará de estar guardada en su cuenta. Los pagos ya hechos no se ven afectados.',
  },
  'pay.cards.off': {
    en: 'Saving cards isn’t switched on yet.',
    nl: 'Kaarten opslaan is nog niet ingeschakeld.',
    fr: 'L’enregistrement des cartes n’est pas encore activé.',
    es: 'Guardar tarjetas aún no está activado.',
  },
  'pay.cards.bankRefused': {
    en: 'Your bank didn’t approve saving the card. Nothing was charged. You can try again.',
    nl: 'Uw bank heeft het opslaan van de kaart niet goedgekeurd. Er is niets afgeschreven. U kunt het opnieuw proberen.',
    fr: 'Votre banque n’a pas approuvé l’enregistrement de la carte. Rien n’a été débité. Vous pouvez réessayer.',
    es: 'Su banco no aprobó guardar la tarjeta. No se cobró nada. Puede intentarlo de nuevo.',
  },
  'pay.cards.neverCharged': {
    en: 'A saved card is never charged while you’re away — only when you pay for a booking yourself.',
    nl: 'Een opgeslagen kaart wordt nooit belast als u er niet bij bent — alleen wanneer u zelf een boeking betaalt.',
    fr: 'Une carte enregistrée n’est jamais débitée en votre absence — seulement lorsque vous payez vous-même une réservation.',
    es: 'Una tarjeta guardada nunca se cobra sin que usted esté presente; solo cuando paga usted mismo una reserva.',
  },
  'pay.cards.notAtCheckoutYet': {
    en: 'For now, each payment takes the card in full; choosing a saved card when you pay is coming.',
    nl: 'Voorlopig vraagt elke betaling de volledige kaartgegevens; een opgeslagen kaart kiezen bij het betalen komt nog.',
    fr: 'Pour l’instant, chaque paiement demande la carte en entier ; le choix d’une carte enregistrée au moment de payer arrive bientôt.',
    es: 'Por ahora, cada pago pide la tarjeta completa; elegir una tarjeta guardada al pagar llegará más adelante.',
  },
} satisfies Record<string, Phrase>;
