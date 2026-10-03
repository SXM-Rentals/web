// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word in a customer's own area, in all four
// languages — their rentals, documents, saved cars, rewards, settings, and the
// help pages.
//
// THE EMPTY STATES ARE HALF OF THIS FILE, and they are worth the space. An empty
// list with nothing written on it reads as broken. An empty list that says why
// it is empty and what would fill it reads as working and waiting. Somebody
// seeing "Nothing booked yet" in their own language understands they have not
// booked; somebody seeing it in English assumes something failed to load.
//
// THE CANCELLATION AND DEPOSIT WORDING carries money, so it is written out
// properly in each language rather than translated word for word — see the note
// at the top of booking-flow.ts, which applies here too.

import type { Phrase } from './types';

export const accountPages = {
  // ---- THE ACCOUNT HOME ----
  'acct.outNow': {
    en: 'Out now',
    nl: 'Nu onderweg',
    fr: 'En cours',
    es: 'En curso ahora',
  },
  'acct.accountType': {
    en: 'Account type',
    nl: 'Soort account',
    fr: 'Type de compte',
    es: 'Tipo de cuenta',
  },
  'acct.identityCheck': {
    en: 'Identity Check',
    nl: 'Identiteitscontrole',
    fr: 'Vérification d’identité',
    es: 'Verificación de identidad',
  },
  'acct.photoOfYou': {
    en: 'Photo of You',
    nl: 'Foto van u',
    fr: 'Photo de vous',
    es: 'Foto suya',
  },

  // ---- THE FIVE STATES OF AN IDENTITY CHECK ----
  'acct.verify.notStarted': {
    en: 'NOT STARTED',
    nl: 'NIET GESTART',
    fr: 'NON COMMENCÉ',
    es: 'SIN EMPEZAR',
  },
  'acct.verify.notStartedBody': {
    en: 'You need to prove who you are and that you can drive before your first booking. It takes a few minutes and only has to be done once.',
    nl: 'U moet aantonen wie u bent en dat u mag rijden voordat u voor het eerst boekt. Het duurt een paar minuten en hoeft maar één keer.',
    fr: 'Vous devez prouver votre identité et votre droit de conduire avant votre première réservation. Cela prend quelques minutes et ne se fait qu’une fois.',
    es: 'Tiene que demostrar quién es y que puede conducir antes de su primera reserva. Lleva unos minutos y solo hay que hacerlo una vez.',
  },
  'acct.verify.checking': {
    en: 'BEING CHECKED',
    nl: 'WORDT GECONTROLEERD',
    fr: 'EN COURS DE VÉRIFICATION',
    es: 'EN REVISIÓN',
  },
  'acct.verify.checkingBody': {
    en: 'Your documents are with us. Most checks come back within a few minutes, some take up to a day. You can carry on browsing while you wait.',
    nl: 'Uw documenten zijn bij ons. De meeste controles zijn binnen enkele minuten klaar, sommige duren tot een dag. U kunt ondertussen gewoon verder kijken.',
    fr: 'Nous avons vos documents. La plupart des vérifications aboutissent en quelques minutes, certaines prennent jusqu’à un jour. Vous pouvez continuer à regarder en attendant.',
    es: 'Tenemos sus documentos. La mayoría de las comprobaciones se resuelven en unos minutos; algunas tardan hasta un día. Puede seguir mirando mientras tanto.',
  },
  'acct.verify.verified': {
    en: 'VERIFIED',
    nl: 'GEVERIFIEERD',
    fr: 'VÉRIFIÉ',
    es: 'VERIFICADO',
  },
  'acct.verify.verifiedBody': {
    en: 'Your licence and identity documents have been accepted. You will not be asked again unless something expires.',
    nl: 'Uw rijbewijs en identiteitsdocumenten zijn geaccepteerd. U wordt niet opnieuw gevraagd, tenzij iets verloopt.',
    fr: 'Votre permis et vos pièces d’identité ont été acceptés. On ne vous les redemandera pas, sauf en cas d’expiration.',
    es: 'Su carné y sus documentos de identidad han sido aceptados. No se le volverán a pedir salvo que algo caduque.',
  },
  'acct.verify.rejected': {
    en: 'NOT ACCEPTED',
    nl: 'NIET GEACCEPTEERD',
    fr: 'NON ACCEPTÉ',
    es: 'NO ACEPTADO',
  },
  'acct.verify.rejectedBody': {
    en: 'We could not accept your documents. The reason is below — most of the time it is something small and easy to put right.',
    nl: 'Wij konden uw documenten niet accepteren. De reden staat hieronder — meestal is het iets kleins dat eenvoudig te herstellen is.',
    fr: 'Nous n’avons pas pu accepter vos documents. La raison est indiquée ci-dessous — le plus souvent, c’est un détail facile à corriger.',
    es: 'No hemos podido aceptar sus documentos. El motivo está más abajo; casi siempre es algo pequeño y fácil de corregir.',
  },
  'acct.verify.resubmit': {
    en: 'MORE NEEDED',
    nl: 'MEER NODIG',
    fr: 'DOCUMENT MANQUANT',
    es: 'FALTA ALGO',
  },
  'acct.verify.resubmitBody': {
    en: 'We need one more thing from you before the check can finish.',
    nl: 'Wij hebben nog één ding van u nodig voordat de controle kan worden afgerond.',
    fr: 'Il nous manque encore un élément pour terminer la vérification.',
    es: 'Necesitamos una cosa más para poder terminar la comprobación.',
  },
  'acct.verify.continue': {
    en: 'Continue the Identity Check',
    nl: 'Identiteitscontrole Voortzetten',
    fr: 'Poursuivre la Vérification',
    es: 'Continuar la Verificación',
  },

  // ---- THE ACCOUNT MENU ROWS ----
  'acct.row.documents': {
    en: 'Your licence, ID and signed agreements',
    nl: 'Uw rijbewijs, ID en ondertekende overeenkomsten',
    fr: 'Votre permis, votre pièce d’identité et vos contrats signés',
    es: 'Su carné, su identificación y sus contratos firmados',
  },
  'acct.row.payment': {
    en: 'Cards saved for future bookings',
    nl: 'Kaarten bewaard voor toekomstige boekingen',
    fr: 'Cartes enregistrées pour vos prochaines réservations',
    es: 'Tarjetas guardadas para próximas reservas',
  },
  'acct.row.language': {
    en: 'English, Dutch, French or Spanish',
    nl: 'Engels, Nederlands, Frans of Spaans',
    fr: 'Anglais, néerlandais, français ou espagnol',
    es: 'Inglés, neerlandés, francés o español',
  },
  'acct.row.settings': {
    en: 'Theme, notifications and privacy',
    nl: 'Weergave, meldingen en privacy',
    fr: 'Apparence, notifications et confidentialité',
    es: 'Apariencia, notificaciones y privacidad',
  },
  'acct.row.support': {
    en: 'Get in touch, or read the policies',
    nl: 'Neem contact op, of lees de voorwaarden',
    fr: 'Nous contacter, ou lire les conditions',
    es: 'Contactar, o leer las condiciones',
  },
  'acct.row.dashboard': {
    en: 'Your fleet, bookings and payouts',
    nl: 'Uw wagenpark, boekingen en uitbetalingen',
    fr: 'Votre flotte, vos réservations et vos versements',
    es: 'Su flota, sus reservas y sus pagos',
  },
  'acct.row.listVehicles': {
    en: 'Rent out cars as a business on SXM Rentals',
    nl: 'Verhuur auto’s als bedrijf op SXM Rentals',
    fr: 'Louer des voitures en tant que professionnel sur SXM Rentals',
    es: 'Alquile coches como empresa en SXM Rentals',
  },

  // ---- MY RENTALS ----
  'acct.rentals.title': {
    en: 'Your rentals',
    nl: 'Uw huurauto’s',
    fr: 'Vos locations',
    es: 'Sus alquileres',
  },
  'acct.rentals.subtitle': {
    en: 'Everything you have booked, out now, or finished with.',
    nl: 'Alles wat u heeft geboekt, nu onderweg is, of heeft afgerond.',
    fr: 'Tout ce que vous avez réservé, ce qui est en cours, et ce qui est terminé.',
    es: 'Todo lo que ha reservado, lo que está en curso y lo que ya ha terminado.',
  },
  'acct.rentals.which': {
    en: 'Which Rentals to Show',
    nl: 'Welke huurauto’s tonen',
    fr: 'Quelles locations afficher',
    es: 'Qué alquileres mostrar',
  },
  'acct.rentals.carUnknown': {
    en: 'Your rental car',
    nl: 'Uw huurauto',
    fr: 'Votre voiture de location',
    es: 'Su coche de alquiler',
  },
  'acct.rentals.carUnlisted': {
    en: 'A car that is no longer listed',
    nl: 'Een auto die niet meer wordt aangeboden',
    fr: 'Une voiture qui n’est plus proposée',
    es: 'Un coche que ya no se ofrece',
  },
  'acct.rentals.noneTitle': {
    en: 'Nothing booked yet',
    nl: 'Nog niets geboekt',
    fr: 'Rien de réservé pour l’instant',
    es: 'Todavía no ha reservado nada',
  },
  'acct.rentals.noneBody': {
    en: 'When you book a car it appears here, with the collection details and the agreement you signed.',
    nl: 'Zodra u een auto boekt verschijnt die hier, met de ophaalgegevens en de door u ondertekende overeenkomst.',
    fr: 'Dès que vous réservez une voiture, elle apparaît ici, avec les détails du retrait et le contrat que vous avez signé.',
    es: 'Cuando reserve un coche aparecerá aquí, con los datos de recogida y el contrato que firmó.',
  },
  'acct.rentals.noActiveTitle': {
    en: 'No car out right now',
    nl: 'Op dit moment geen auto onderweg',
    fr: 'Aucune voiture en cours',
    es: 'Ahora mismo no tiene ningún coche',
  },
  'acct.rentals.noActiveBody': {
    en: 'A rental moves here on the day you collect the car, along with the extend and support options.',
    nl: 'Een huur verschijnt hier op de dag dat u de auto ophaalt, samen met de opties om te verlengen en hulp te krijgen.',
    fr: 'Une location arrive ici le jour où vous récupérez la voiture, avec les options de prolongation et d’assistance.',
    es: 'Un alquiler pasa aquí el día que recoge el coche, junto con las opciones de ampliar y de pedir ayuda.',
  },
  'acct.rentals.noPastTitle': {
    en: 'No finished rentals',
    nl: 'Geen afgeronde huurauto’s',
    fr: 'Aucune location terminée',
    es: 'No hay alquileres terminados',
  },
  'acct.rentals.noPastBody': {
    en: 'Once a rental ends it stays here with its receipt and signed agreement, so you can find them later.',
    nl: 'Zodra een huur eindigt blijft die hier staan met de bon en de ondertekende overeenkomst, zodat u ze later kunt terugvinden.',
    fr: 'Une fois terminée, une location reste ici avec son reçu et son contrat signé, pour que vous puissiez les retrouver.',
    es: 'Cuando un alquiler termina se queda aquí con su recibo y su contrato firmado, para que pueda encontrarlos después.',
  },
  'acct.rentals.viewRental': {
    en: 'View Rental',
    nl: 'Huur Bekijken',
    fr: 'Voir la Location',
    es: 'Ver el Alquiler',
  },

  // ---- STATUSES ----
  'acct.status.upcoming': {
    en: 'UPCOMING',
    nl: 'AANKOMEND',
    fr: 'À VENIR',
    es: 'PRÓXIMO',
  },
  'acct.status.outNow': {
    en: 'OUT NOW',
    nl: 'NU ONDERWEG',
    fr: 'EN COURS',
    es: 'EN CURSO',
  },
  'acct.status.completed': {
    en: 'COMPLETED',
    nl: 'AFGEROND',
    fr: 'TERMINÉ',
    es: 'FINALIZADO',
  },
  'acct.status.cancelled': {
    en: 'CANCELLED',
    nl: 'GEANNULEERD',
    fr: 'ANNULÉ',
    es: 'CANCELADO',
  },
  'acct.deposit.notHeld': {
    en: 'DEPOSIT NOT YET HELD',
    nl: 'BORGSOM NOG NIET GERESERVEERD',
    fr: 'CAUTION PAS ENCORE BLOQUÉE',
    es: 'FIANZA AÚN NO RETENIDA',
  },
  'acct.deposit.held': {
    en: 'DEPOSIT HELD',
    nl: 'BORGSOM GERESERVEERD',
    fr: 'CAUTION BLOQUÉE',
    es: 'FIANZA RETENIDA',
  },
  'acct.deposit.returned': {
    en: 'DEPOSIT RETURNED',
    nl: 'BORGSOM TERUGGEGEVEN',
    fr: 'CAUTION RENDUE',
    es: 'FIANZA DEVUELTA',
  },
  'acct.deposit.claimed': {
    en: 'DEPOSIT CLAIMED',
    nl: 'BORGSOM INGEHOUDEN',
    fr: 'CAUTION RETENUE',
    es: 'FIANZA RECLAMADA',
  },

  // ---- ONE RENTAL ----
  'acct.rental.notFound': {
    en: 'We could not find that rental',
    nl: 'Wij konden die huur niet vinden',
    fr: 'Nous n’avons pas trouvé cette location',
    es: 'No hemos encontrado ese alquiler',
  },
  'acct.rental.notFoundBody': {
    en: 'It may have been removed, or the address may be wrong.',
    nl: 'Mogelijk is die verwijderd, of klopt het adres niet.',
    fr: 'Elle a peut-être été supprimée, ou l’adresse est incorrecte.',
    es: 'Puede que se haya eliminado, o que la dirección sea incorrecta.',
  },
  'acct.rental.details': {
    en: 'Rental Details',
    nl: 'Huurgegevens',
    fr: 'Détails de la location',
    es: 'Datos del alquiler',
  },
  'acct.rental.reference': {
    en: 'Reference',
    nl: 'Referentie',
    fr: 'Référence',
    es: 'Referencia',
  },
  'acct.rental.collectionTime': {
    en: 'Collection Time',
    nl: 'Ophaaltijd',
    fr: 'Heure de retrait',
    es: 'Hora de recogida',
  },
  'acct.rental.returnTime': {
    en: 'Return Time',
    nl: 'Inlevertijd',
    fr: 'Heure de retour',
    es: 'Hora de devolución',
  },
  'acct.rental.bookedOn': {
    en: 'Booked On',
    nl: 'Geboekt op',
    fr: 'Réservé le',
    es: 'Reservado el',
  },
  'acct.rental.signedNote': {
    en: 'Signed and saved to your account. Printing this page includes it.',
    nl: 'Ondertekend en bewaard in uw account. Bij het afdrukken van deze pagina wordt die meegenomen.',
    fr: 'Signé et enregistré dans votre compte. L’impression de cette page l’inclut.',
    es: 'Firmado y guardado en su cuenta. Al imprimir esta página se incluye.',
  },
  'acct.rental.notSigned': {
    en: 'Not signed yet. The business cannot hand over the keys until it is.',
    nl: 'Nog niet ondertekend. Het bedrijf mag de sleutels pas overhandigen als dat wel zo is.',
    fr: 'Pas encore signé. Le loueur ne peut pas remettre les clés tant que ce n’est pas fait.',
    es: 'Todavía sin firmar. La empresa no puede entregar las llaves hasta que lo esté.',
  },
  'acct.rental.printAgreement': {
    en: 'Print the Agreement',
    nl: 'Overeenkomst Afdrukken',
    fr: 'Imprimer le Contrat',
    es: 'Imprimir el Contrato',
  },
  'acct.rental.price': {
    en: 'What the rental costs',
    nl: 'Wat de huur kost',
    fr: 'Ce que coûte la location',
    es: 'Lo que cuesta el alquiler',
  },
  'acct.rental.viewCar': {
    en: 'View the Car',
    nl: 'De Auto Bekijken',
    fr: 'Voir la Voiture',
    es: 'Ver el Coche',
  },
  'acct.rental.messageBusiness': {
    en: 'Message the Business',
    nl: 'Bericht het Bedrijf',
    fr: 'Écrire au Loueur',
    es: 'Escribir a la Empresa',
  },
  'acct.rental.print': {
    en: 'Print',
    nl: 'Afdrukken',
    fr: 'Imprimer',
    es: 'Imprimir',
  },

  // ---- EXTENDING ----
  'acct.extend.cannotTitle': {
    en: 'This rental cannot be extended',
    nl: 'Deze huur kan niet worden verlengd',
    fr: 'Cette location ne peut pas être prolongée',
    es: 'Este alquiler no se puede ampliar',
  },
  'acct.extend.cannotBody': {
    en: 'Only a rental that is running, or about to, can be extended. This one has finished.',
    nl: 'Alleen een huur die loopt of bijna begint kan worden verlengd. Deze is afgerond.',
    fr: 'Seule une location en cours ou sur le point de commencer peut être prolongée. Celle-ci est terminée.',
    es: 'Solo se puede ampliar un alquiler en curso o a punto de empezar. Este ya ha terminado.',
  },
  'acct.extend.title': {
    en: 'Keep the car longer',
    nl: 'De auto langer houden',
    fr: 'Garder la voiture plus longtemps',
    es: 'Quedarse el coche más tiempo',
  },
  'acct.extend.newReturn': {
    en: 'New Return Date',
    nl: 'Nieuwe inleverdatum',
    fr: 'Nouvelle date de retour',
    es: 'Nueva fecha de devolución',
  },
  'acct.extend.greyedNote': {
    en: 'Days the car is already promised to somebody else are greyed out and cannot be chosen.',
    nl: 'Dagen waarop de auto al aan iemand anders is toegezegd zijn grijs en kunnen niet worden gekozen.',
    fr: 'Les jours où la voiture est déjà promise à quelqu’un d’autre sont grisés et ne peuvent pas être choisis.',
    es: 'Los días en que el coche ya está comprometido con otra persona aparecen en gris y no se pueden elegir.',
  },
  'acct.extend.cost': {
    en: 'What the Extension Would Cost',
    nl: 'Wat de Verlenging Zou Kosten',
    fr: 'Ce Que Coûterait la Prolongation',
    es: 'Lo Que Costaría la Ampliación',
  },
  'acct.extend.estimate': {
    en: 'Estimate',
    nl: 'Schatting',
    fr: 'Estimation',
    es: 'Estimación',
  },
  'acct.extend.estimateNote': {
    en: 'Worked out from the car’s daily rate. Nothing is charged here — the business confirms the price when they reply.',
    nl: 'Berekend op basis van de dagprijs van de auto. Hier wordt niets in rekening gebracht — het bedrijf bevestigt de prijs in zijn antwoord.',
    fr: 'Calculé d’après le tarif journalier de la voiture. Rien n’est débité ici — l’entreprise confirme le prix dans sa réponse.',
    es: 'Calculado a partir de la tarifa diaria del coche. Aquí no se cobra nada: la empresa confirma el precio al responder.',
  },
  'acct.extend.message': {
    en: 'Hello — could I keep the car until {date} instead of {current}? My booking reference is {reference}.',
    nl: 'Hallo — zou ik de auto tot {date} mogen houden in plaats van tot {current}? Mijn boekingsreferentie is {reference}.',
    fr: 'Bonjour — pourrais-je garder la voiture jusqu’au {date} au lieu du {current} ? Ma référence de réservation est {reference}.',
    es: 'Hola: ¿podría quedarme el coche hasta el {date} en lugar del {current}? Mi referencia de reserva es {reference}.',
  },
  'acct.extend.sentBody': {
    en: 'Your request is with the business, in your messages. They will reply there and confirm the price for the extra days.',
    nl: 'Uw verzoek ligt bij het bedrijf, in uw berichten. Het bedrijf antwoordt daar en bevestigt de prijs voor de extra dagen.',
    fr: 'Votre demande est entre les mains de l’entreprise, dans vos messages. Elle vous répondra là-bas et confirmera le prix des jours supplémentaires.',
    es: 'Su solicitud ya está con la empresa, en sus mensajes. Le responderá allí y confirmará el precio de los días extra.',
  },
  'acct.extend.openThread': {
    en: 'Open the Conversation',
    nl: 'Open het Gesprek',
    fr: 'Ouvrir la Conversation',
    es: 'Abrir la Conversación',
  },
  'acct.extend.extraDays': {
    en: 'Extra days',
    nl: 'Extra dagen',
    fr: 'Jours supplémentaires',
    es: 'Días adicionales',
  },
  'acct.extend.request': {
    en: 'Request the Extension',
    nl: 'Verlenging Aanvragen',
    fr: 'Demander la Prolongation',
    es: 'Solicitar la Ampliación',
  },
  'acct.extend.requested': {
    en: 'Extension requested',
    nl: 'Verlenging aangevraagd',
    fr: 'Prolongation demandée',
    es: 'Ampliación solicitada',
  },
  'acct.extend.back': {
    en: 'Back to the Rental',
    nl: 'Terug naar de Huur',
    fr: 'Retour à la Location',
    es: 'Volver al Alquiler',
  },

  // ---- CANCELLING ----
  'acct.cancel.cannotTitle': {
    en: 'This rental cannot be cancelled here',
    nl: 'Deze huur kan hier niet worden geannuleerd',
    fr: 'Cette location ne peut pas être annulée ici',
    es: 'Este alquiler no se puede cancelar aquí',
  },
  'acct.cancel.title': {
    en: 'Cancel This Rental',
    nl: 'Deze huur annuleren',
    fr: 'Annuler cette location',
    es: 'Cancelar este alquiler',
  },
  'acct.cancel.whatBack': {
    en: 'What Happens to the Money',
    nl: 'Wat Er met het Geld Gebeurt',
    fr: 'Ce Qu’il Advient de l’Argent',
    es: 'Qué Pasa con el Dinero',
  },
  'acct.cancel.total': {
    en: 'Booking total',
    nl: 'Totaal van de boeking',
    fr: 'Total de la réservation',
    es: 'Total de la reserva',
  },
  'acct.cancel.refundPolicy': {
    en: 'Any refund follows the Cancellation and Refund Policy.',
    nl: 'Een eventuele terugbetaling volgt het Annulerings- en Terugbetalingsbeleid.',
    fr: 'Tout remboursement suit la Politique d’Annulation et de Remboursement.',
    es: 'Cualquier reembolso sigue la Política de Cancelación y Reembolso.',
  },
  'acct.cancel.depositReleased': {
    en: 'The {amount} deposit hold is released in full. It was never a charge.',
    nl: 'De borg van {amount} wordt volledig vrijgegeven. Die is nooit in rekening gebracht.',
    fr: 'La caution de {amount} est entièrement libérée. Elle n’a jamais été débitée.',
    es: 'La retención del depósito de {amount} se libera por completo. Nunca fue un cargo.',
  },
  'acct.cancel.depositNotTaken': {
    en: 'The {amount} deposit was never taken, so there is nothing to return.',
    nl: 'De borg van {amount} is nooit ingehouden, dus er valt niets terug te geven.',
    fr: 'La caution de {amount} n’a jamais été prélevée, il n’y a donc rien à rendre.',
    es: 'El depósito de {amount} nunca se retuvo, así que no hay nada que devolver.',
  },
  'acct.cancel.understand': {
    en: 'I understand that cancelling cannot be undone.',
    nl: 'Ik begrijp dat annuleren niet ongedaan kan worden gemaakt.',
    fr: 'Je comprends que cette annulation est définitive.',
    es: 'Entiendo que la cancelación no se puede deshacer.',
  },
  'acct.cancel.keep': {
    en: 'Keep This Rental',
    nl: 'Deze Huur Behouden',
    fr: 'Conserver Cette Location',
    es: 'Mantener Este Alquiler',
  },
  'acct.cancel.confirm': {
    en: 'Cancel This Rental',
    nl: 'Deze Huur Annuleren',
    fr: 'Annuler Cette Location',
    es: 'Cancelar Este Alquiler',
  },
  'acct.cancel.done': {
    en: 'Rental cancelled',
    nl: 'Huur geannuleerd',
    fr: 'Location annulée',
    es: 'Alquiler cancelado',
  },
  'acct.cancel.backToRentals': {
    en: 'Back to Your Rentals',
    nl: 'Terug naar Uw Huurauto’s',
    fr: 'Retour à Vos Locations',
    es: 'Volver a Sus Alquileres',
  },
  'acct.cancel.findAnother': {
    en: 'Find Another Car',
    nl: 'Een Andere Auto Zoeken',
    fr: 'Trouver une Autre Voiture',
    es: 'Buscar Otro Coche',
  },

  // ---- DOCUMENTS ----
  'acct.docs.intro': {
    en: 'What you have given us, and the agreements you have signed.',
    nl: 'Wat u ons heeft gegeven, en de overeenkomsten die u heeft ondertekend.',
    fr: 'Ce que vous nous avez fourni, et les contrats que vous avez signés.',
    es: 'Lo que nos ha entregado y los contratos que ha firmado.',
  },
  'acct.docs.selfieSubtitle': {
    en: 'A live photo, matched against your identity document',
    nl: 'Een live foto, vergeleken met uw identiteitsdocument',
    fr: 'Une photo en direct, comparée à votre pièce d’identité',
    es: 'Una foto en directo, comparada con su documento de identidad',
  },
  'acct.docs.licenceSubtitle': {
    en: 'Proves you are allowed to drive',
    nl: 'Bewijst dat u mag rijden',
    fr: 'Prouve que vous avez le droit de conduire',
    es: 'Demuestra que puede conducir',
  },
  'acct.docs.onceNote': {
    en: 'Done once and reused on every rental after. You will only be asked again if something expires.',
    nl: 'Eenmalig gedaan en daarna bij elke huur hergebruikt. U wordt alleen opnieuw gevraagd als iets verloopt.',
    fr: 'Fait une fois et réutilisé pour chaque location suivante. On ne vous le redemandera que si un document expire.',
    es: 'Se hace una vez y se reutiliza en todos los alquileres siguientes. Solo se le volverá a pedir si algo caduca.',
  },
  'acct.docs.received': {
    en: 'RECEIVED',
    nl: 'ONTVANGEN',
    fr: 'REÇU',
    es: 'RECIBIDO',
  },
  'acct.docs.notYet': {
    en: 'NOT YET',
    nl: 'NOG NIET',
    fr: 'PAS ENCORE',
    es: 'TODAVÍA NO',
  },
  'acct.docs.privacyNote': {
    en: 'Your documents are not shown back to you here, on purpose. They are held encrypted and separately from everything else, and rental businesses never see them.',
    nl: 'Uw documenten worden hier bewust niet aan u teruggetoond. Ze worden versleuteld en apart van al het andere bewaard, en verhuurbedrijven zien ze nooit.',
    fr: 'Vos documents ne vous sont volontairement pas réaffichés ici. Ils sont conservés chiffrés et séparément de tout le reste, et les loueurs ne les voient jamais.',
    es: 'Sus documentos no se le muestran aquí de vuelta, y es a propósito. Se guardan cifrados y aparte de todo lo demás, y las empresas de alquiler nunca los ven.',
  },
  'acct.docs.signedTitle': {
    en: 'Signed rental agreements',
    nl: 'Ondertekende huurovereenkomsten',
    fr: 'Contrats de location signés',
    es: 'Contratos de alquiler firmados',
  },
  'acct.docs.noneTitle': {
    en: 'No signed agreements yet',
    nl: 'Nog geen ondertekende overeenkomsten',
    fr: 'Aucun contrat signé pour l’instant',
    es: 'Todavía no hay contratos firmados',
  },
  'acct.docs.noneBody': {
    en: 'Every rental you complete leaves its signed agreement here, so you can find and print it later.',
    nl: 'Elke huur die u afrondt laat hier de ondertekende overeenkomst achter, zodat u die later kunt vinden en afdrukken.',
    fr: 'Chaque location terminée dépose ici son contrat signé, pour que vous puissiez le retrouver et l’imprimer.',
    es: 'Cada alquiler que completa deja aquí su contrato firmado, para que pueda encontrarlo e imprimirlo después.',
  },

  // ---- SAVED CARS ----
  'acct.saved.title': {
    en: 'Saved cars',
    nl: 'Opgeslagen auto’s',
    fr: 'Voitures enregistrées',
    es: 'Coches guardados',
  },
  'acct.saved.findMore': {
    en: 'Find More Cars',
    nl: 'Meer Auto’s Zoeken',
    fr: 'Trouver D’autres Voitures',
    es: 'Buscar Más Coches',
  },
  'acct.saved.emptyTitle': {
    en: 'No saved cars yet',
    nl: 'Nog geen opgeslagen auto’s',
    fr: 'Aucune voiture enregistrée',
    es: 'Todavía no hay coches guardados',
  },
  'acct.saved.emptyBody': {
    en: 'Click the heart on any car to keep it here. It is the easiest way to compare a few before deciding.',
    nl: 'Klik op het hartje bij een auto om hem hier te bewaren. Het is de makkelijkste manier om er een paar te vergelijken.',
    fr: 'Cliquez sur le cœur d’une voiture pour la garder ici. C’est le moyen le plus simple d’en comparer plusieurs avant de choisir.',
    es: 'Pulse el corazón de cualquier coche para guardarlo aquí. Es la forma más fácil de comparar unos cuantos antes de decidir.',
  },
  'acct.saved.browserNote': {
    en: 'This list is kept in this browser, not on your account, so it will not appear on another computer and is lost if you clear your site data.',
    nl: 'Deze lijst wordt in deze browser bewaard, niet in uw account, dus hij verschijnt niet op een andere computer en gaat verloren als u uw sitegegevens wist.',
    fr: 'Cette liste est conservée dans ce navigateur, pas sur votre compte : elle n’apparaîtra pas sur un autre ordinateur et sera perdue si vous effacez les données du site.',
    es: 'Esta lista se guarda en este navegador, no en su cuenta, así que no aparecerá en otro ordenador y se pierde si borra los datos del sitio.',
  },
  'acct.saved.someGone': {
    en: 'Some cars you saved are no longer listed, so they are not shown.',
    nl: 'Sommige auto’s die u heeft bewaard worden niet meer aangeboden en worden daarom niet getoond.',
    fr: 'Certaines voitures que vous avez enregistrées ne sont plus proposées, elles ne sont donc pas affichées.',
    es: 'Algunos coches que guardó ya no se ofrecen, así que no se muestran.',
  },

  // ---- NOTIFICATIONS ----
  'acct.notif.emptyTitle': {
    en: 'Nothing to catch up on',
    nl: 'Niets nieuws',
    fr: 'Rien à rattraper',
    es: 'Nada nuevo',
  },
  'acct.notif.emptyBody': {
    en: 'Confirmations, receipts and reminders about your rentals appear here.',
    nl: 'Bevestigingen, bonnen en herinneringen over uw huurauto’s verschijnen hier.',
    fr: 'Les confirmations, reçus et rappels concernant vos locations apparaissent ici.',
    es: 'Las confirmaciones, los recibos y los recordatorios de sus alquileres aparecen aquí.',
  },
  'acct.notif.markAll': {
    en: 'Mark All as Read',
    nl: 'Alles als Gelezen Markeren',
    fr: 'Tout Marquer comme Lu',
    es: 'Marcar Todo como Leído',
  },
  'acct.notif.markOne': {
    en: 'Mark as read',
    nl: 'Als gelezen markeren',
    fr: 'Marquer comme lu',
    es: 'Marcar como leído',
  },

  // ---- LANGUAGE PAGE ----
  'acct.lang.subtitle': {
    en: 'Both sides of the island, plus Spanish.',
    nl: 'Beide kanten van het eiland, plus Spaans.',
    fr: 'Les deux côtés de l’île, plus l’espagnol.',
    es: 'Los dos lados de la isla, y también español.',
  },
  'acct.lang.selected': {
    en: 'Currently Selected',
    nl: 'Nu geselecteerd',
    fr: 'Actuellement sélectionné',
    es: 'Seleccionado ahora',
  },
  'acct.lang.rememberedNote': {
    en: 'Your choice is remembered in this browser. The language button in the top bar changes it from anywhere on the site.',
    nl: 'Uw keuze wordt in deze browser onthouden. De taalknop in de bovenbalk wijzigt hem vanaf elke pagina.',
    fr: 'Votre choix est mémorisé dans ce navigateur. Le bouton de langue dans la barre du haut permet de le changer depuis n’importe quelle page.',
    es: 'Su elección se recuerda en este navegador. El botón de idioma de la barra superior lo cambia desde cualquier página.',
  },

  // ---- PAYMENT METHODS ----
  'acct.pay.title': {
    en: 'Payment methods',
    nl: 'Betaalmethoden',
    fr: 'Moyens de paiement',
    es: 'Métodos de pago',
  },
  'acct.pay.subtitle': {
    en: 'Cards saved with Stripe, for paying next time.',
    nl: 'Kaarten die bij Stripe zijn opgeslagen, om de volgende keer mee te betalen.',
    fr: 'Les cartes enregistrées chez Stripe, pour payer la prochaine fois.',
    es: 'Tarjetas guardadas en Stripe, para pagar la próxima vez.',
  },
  'acct.pay.notConnected': {
    en: 'Not Connected Yet',
    nl: 'Nog niet gekoppeld',
    fr: 'Pas encore connecté',
    es: 'Todavía sin conectar',
  },
  'acct.pay.noCardsTitle': {
    en: 'No saved cards',
    nl: 'Geen opgeslagen kaarten',
    fr: 'Aucune carte enregistrée',
    es: 'No hay tarjetas guardadas',
  },
  'acct.pay.howTitle': {
    en: 'How Card Details Are Handled',
    nl: 'Hoe kaartgegevens worden behandeld',
    fr: 'Comment les données de carte sont traitées',
    es: 'Cómo se tratan los datos de la tarjeta',
  },
  'acct.pay.stripeNote': {
    en: 'Card numbers are typed into fields that belong to Stripe, not to SXM Rentals. The number goes straight to them and never touches this site or our servers.',
    nl: 'Kaartnummers worden ingevoerd in velden die van Stripe zijn, niet van SXM Rentals. Het nummer gaat rechtstreeks naar hen en raakt deze site of onze servers nooit.',
    fr: 'Les numéros de carte sont saisis dans des champs appartenant à Stripe, pas à SXM Rentals. Le numéro leur est transmis directement et ne passe jamais par ce site ni par nos serveurs.',
    es: 'Los números de tarjeta se escriben en campos que pertenecen a Stripe, no a SXM Rentals. El número va directamente a ellos y nunca pasa por este sitio ni por nuestros servidores.',
  },
  'acct.pay.readPolicy': {
    en: 'Read the Payment Policy',
    nl: 'Lees het Betalingsbeleid',
    fr: 'Lire la Politique de Paiement',
    es: 'Leer la Política de Pagos',
  },

  // ---- REWARDS ----
  'acct.rewards.subtitle': {
    en: 'Points on every rental, and tiers as they add up.',
    nl: 'Punten bij elke huur, en niveaus naarmate ze oplopen.',
    fr: 'Des points à chaque location, et des niveaux à mesure qu’ils s’accumulent.',
    es: 'Puntos con cada alquiler, y niveles a medida que se acumulan.',
  },
  'acct.rewards.comingBody': {
    en: 'The scheme is not live yet, so no points are being earned. Once it is, your points and tier will be shown here.',
    nl: 'De regeling is nog niet actief, dus er worden nog geen punten verdiend. Zodra dat zo is, ziet u hier uw punten en niveau.',
    fr: 'Le programme n’est pas encore lancé, aucun point n’est donc cumulé. Dès qu’il le sera, vos points et votre niveau s’afficheront ici.',
    es: 'El programa aún no está activo, así que no se acumulan puntos. Cuando lo esté, sus puntos y su nivel aparecerán aquí.',
  },

  // ---- SETTINGS ----
  'acct.settings.subtitle': {
    en: 'How the site looks, and what we get in touch about.',
    nl: 'Hoe de site eruitziet, en waarover wij contact opnemen.',
    fr: 'L’apparence du site, et les sujets pour lesquels nous vous contactons.',
    es: 'Cómo se ve el sitio y sobre qué nos ponemos en contacto.',
  },
  'acct.settings.lightOrDark': {
    en: 'Light or Dark',
    nl: 'Licht of donker',
    fr: 'Clair ou sombre',
    es: 'Claro u oscuro',
  },
  'acct.settings.matchComputer': {
    en: 'Match My Computer',
    nl: 'Volg mijn computer',
    fr: 'Suivre mon ordinateur',
    es: 'Seguir a mi ordenador',
  },
  'acct.settings.change': {
    en: 'Change',
    nl: 'Wijzigen',
    fr: 'Modifier',
    es: 'Cambiar',
  },
  'acct.settings.bookingEmails': {
    en: 'Booking Emails',
    nl: 'Boekingsmails',
    fr: 'E-mails de réservation',
    es: 'Correos de reserva',
  },
  'acct.settings.bookingEmailsBody': {
    en: 'Confirmations, receipts and the signed agreement. These are the ones you cannot really do without.',
    nl: 'Bevestigingen, bonnen en de ondertekende overeenkomst. Dit zijn de mails die u eigenlijk niet kunt missen.',
    fr: 'Confirmations, reçus et contrat signé. Ce sont ceux dont vous ne pouvez pas vraiment vous passer.',
    es: 'Confirmaciones, recibos y el contrato firmado. Estos son los que realmente no conviene desactivar.',
  },
  'acct.settings.tripReminders': {
    en: 'Trip Reminders',
    nl: 'Reisherinneringen',
    fr: 'Rappels de trajet',
    es: 'Recordatorios del viaje',
  },
  'acct.settings.tripRemindersBody': {
    en: 'A nudge the day before you collect a car, and the day before it goes back.',
    nl: 'Een seintje de dag voordat u een auto ophaalt, en de dag voordat hij terug moet.',
    fr: 'Un rappel la veille du retrait de la voiture, et la veille du retour.',
    es: 'Un aviso el día antes de recoger el coche y el día antes de devolverlo.',
  },
  'acct.settings.offers': {
    en: 'Offers and Rewards',
    nl: 'Aanbiedingen en voordelen',
    fr: 'Offres et avantages',
    es: 'Ofertas y recompensas',
  },
  'acct.settings.offersBody': {
    en: 'Occasional emails about the rewards scheme and partner offers. Off by default.',
    nl: 'Af en toe een mail over het voordelenprogramma en aanbiedingen van partners. Standaard uit.',
    fr: 'Des e-mails occasionnels sur le programme d’avantages et les offres partenaires. Désactivé par défaut.',
    es: 'Correos ocasionales sobre el programa de recompensas y ofertas de socios. Desactivado por defecto.',
  },
  'acct.settings.switchesNote': {
    en: 'These switches do not do anything yet — there is no email system connected. They are here so the choices are visible, not because they are working.',
    nl: 'Deze schakelaars doen nog niets — er is geen e-mailsysteem gekoppeld. Ze staan hier zodat de keuzes zichtbaar zijn, niet omdat ze werken.',
    fr: 'Ces interrupteurs ne font encore rien — aucun système d’e-mail n’est connecté. Ils sont là pour que les choix soient visibles, pas parce qu’ils fonctionnent.',
    es: 'Estos interruptores todavía no hacen nada: no hay ningún sistema de correo conectado. Están aquí para que las opciones se vean, no porque funcionen.',
  },
  'acct.settings.signOutTitle': {
    en: 'Sign out?',
    nl: 'Uitloggen?',
    fr: 'Se déconnecter ?',
    es: '¿Cerrar sesión?',
  },
  'acct.settings.signOutBody': {
    en: 'You will need to sign in again to see your rentals and messages. Browsing does not need an account.',
    nl: 'U moet opnieuw inloggen om uw huurauto’s en berichten te zien. Rondkijken kan zonder account.',
    fr: 'Vous devrez vous reconnecter pour voir vos locations et vos messages. Naviguer ne demande pas de compte.',
    es: 'Tendrá que iniciar sesión otra vez para ver sus alquileres y mensajes. Para mirar no hace falta cuenta.',
  },

  // ---- HELP AND SUPPORT ----
  'acct.support.title': {
    en: 'Help and support',
    nl: 'Hulp en ondersteuning',
    fr: 'Aide et assistance',
    es: 'Ayuda y asistencia',
  },
  'acct.support.subtitle': {
    en: 'The questions people ask most, and how to reach a person.',
    nl: 'De vragen die het vaakst worden gesteld, en hoe u iemand bereikt.',
    fr: 'Les questions les plus fréquentes, et comment joindre quelqu’un.',
    es: 'Las preguntas más frecuentes y cómo hablar con una persona.',
  },
  'acct.support.brokenTitle': {
    en: 'Broken Down, or Had an Accident?',
    nl: 'Pech onderweg of een ongeluk gehad?',
    fr: 'En panne, ou vous avez eu un accident ?',
    es: '¿Se ha averiado o ha tenido un accidente?',
  },
  'acct.support.safetyFirst': {
    en: 'Make sure everyone is safe first. If anyone is hurt, call the emergency services before you do anything else — 911 on the Dutch side, 112 on the French side.',
    nl: 'Zorg eerst dat iedereen veilig is. Als er iemand gewond is, bel dan eerst de hulpdiensten — 911 aan de Nederlandse kant, 112 aan de Franse kant.',
    fr: 'Assurez-vous d’abord que tout le monde est en sécurité. Si quelqu’un est blessé, appelez les secours avant toute autre chose — le 911 côté néerlandais, le 112 côté français.',
    es: 'Asegúrese primero de que todos están a salvo. Si hay heridos, llame a los servicios de emergencia antes que nada: 911 en el lado neerlandés, 112 en el lado francés.',
  },
  'acct.support.thenMessage': {
    en: 'Then message the rental business through SXM Rentals. They arrange recovery and a replacement. Do not agree to pay anyone at the roadside.',
    nl: 'Stuur daarna een bericht naar het verhuurbedrijf via SXM Rentals. Zij regelen berging en vervanging. Ga er niet mee akkoord om iemand langs de weg te betalen.',
    fr: 'Écrivez ensuite au loueur via SXM Rentals. C’est lui qui organise le dépannage et le remplacement. N’acceptez de payer personne au bord de la route.',
    es: 'Después escriba a la empresa de alquiler a través de SXM Rentals. Ellos organizan la grúa y un vehículo de sustitución. No acepte pagar a nadie en la carretera.',
  },
  'acct.support.accidentPolicy': {
    en: 'Accident Policy',
    nl: 'Ongevallenbeleid',
    fr: 'Politique en Cas d’Accident',
    es: 'Política de Accidentes',
  },
  'acct.support.commonQuestions': {
    en: 'Common questions',
    nl: 'Veelgestelde vragen',
    fr: 'Questions fréquentes',
    es: 'Preguntas frecuentes',
  },
  'acct.support.sendMessage': {
    en: 'Send Us a Message',
    nl: 'Stuur ons een bericht',
    fr: 'Envoyez-nous un message',
    es: 'Envíenos un mensaje',
  },
  // Still says nothing was sent, because nothing was: there is no support
  // address on the API. The reason changed, though — it is no longer "there is
  // no backend", so the sentence no longer says that.
  'acct.support.thanks': {
    en: 'Thanks — in the finished site this would reach the support team, who reply by email. Nothing has actually been sent: this form is not connected yet.',
    nl: 'Bedankt — in de definitieve site zou dit bij het supportteam terechtkomen, dat per e-mail antwoordt. Er is niets echt verstuurd: dit formulier is nog niet aangesloten.',
    fr: 'Merci — sur le site final, ce message parviendrait à l’équipe d’assistance, qui répond par e-mail. Rien n’a réellement été envoyé : ce formulaire n’est pas encore connecté.',
    es: 'Gracias: en el sitio final esto llegaría al equipo de soporte, que responde por correo. No se ha enviado nada de verdad: este formulario aún no está conectado.',
  },
  'acct.support.aboutLabel': {
    en: 'What Is It About?',
    nl: 'Waar gaat het over?',
    fr: 'De quoi s’agit-il ?',
    es: '¿Sobre qué es?',
  },
  'acct.support.aboutPlaceholder': {
    en: 'A booking, a deposit, the identity check…',
    nl: 'Een boeking, een borgsom, de identiteitscontrole…',
    fr: 'Une réservation, une caution, la vérification d’identité…',
    es: 'Una reserva, una fianza, la verificación de identidad…',
  },
  'acct.support.messageLabel': {
    en: 'Your Message',
    nl: 'Uw bericht',
    fr: 'Votre message',
    es: 'Su mensaje',
  },
  'acct.support.messagePlaceholder': {
    en: 'Tell us what happened, and include the booking reference if there is one.',
    nl: 'Vertel ons wat er is gebeurd, en vermeld het boekingsnummer als dat er is.',
    fr: 'Dites-nous ce qui s’est passé, et indiquez la référence de réservation s’il y en a une.',
    es: 'Cuéntenos qué ha pasado e incluya la referencia de la reserva si la hay.',
  },
  'acct.support.sendButton': {
    en: 'Send Message',
    nl: 'Bericht Versturen',
    fr: 'Envoyer le Message',
    es: 'Enviar Mensaje',
  },
  'acct.support.allPolicies': {
    en: 'All policies and terms',
    nl: 'Alle voorwaarden en beleidsregels',
    fr: 'Toutes les conditions et politiques',
    es: 'Todas las condiciones y políticas',
  },
  'acct.support.allPoliciesSub': {
    en: 'The full set of nineteen documents',
    nl: 'De volledige set van negentien documenten',
    fr: 'L’ensemble complet des dix-neuf documents',
    es: 'El conjunto completo de diecinueve documentos',
  },
  'acct.support.cancellation': {
    en: 'Cancellation and refunds',
    nl: 'Annuleringen en terugbetalingen',
    fr: 'Annulation et remboursements',
    es: 'Cancelaciones y reembolsos',
  },
  'acct.support.cancellationSub': {
    en: 'What you get back, and when',
    nl: 'Wat u terugkrijgt, en wanneer',
    fr: 'Ce que vous récupérez, et quand',
    es: 'Qué se le devuelve y cuándo',
  },
  'acct.support.deposits': {
    en: 'Security deposits',
    nl: 'Borgsommen',
    fr: 'Cautions',
    es: 'Fianzas',
  },
  'acct.support.depositsSub': {
    en: 'How the hold works, and when it is released',
    nl: 'Hoe de reservering werkt, en wanneer die wordt vrijgegeven',
    fr: 'Comment fonctionne le blocage, et quand il est levé',
    es: 'Cómo funciona la retención y cuándo se libera',
  },

  // ---- THE SUPPORT QUESTIONS ----
  'acct.faq.hold': {
    en: 'Why is there a hold on my card?',
    nl: 'Waarom staat er een reservering op mijn kaart?',
    fr: 'Pourquoi y a-t-il un blocage sur ma carte ?',
    es: '¿Por qué hay una retención en mi tarjeta?',
  },
  'acct.faq.depositBack': {
    en: 'When do I get the deposit back?',
    nl: 'Wanneer krijg ik de borgsom terug?',
    fr: 'Quand vais-je récupérer la caution ?',
    es: '¿Cuándo recupero la fianza?',
  },
  'acct.faq.phone': {
    en: 'Can I get the rental business on the phone?',
    nl: 'Kan ik het verhuurbedrijf telefonisch bereiken?',
    fr: 'Puis-je joindre le loueur par téléphone ?',
    es: '¿Puedo hablar por teléfono con la empresa de alquiler?',
  },
  'acct.faq.bring': {
    en: 'What do I need to bring when I collect the car?',
    nl: 'Wat moet ik meenemen als ik de auto ophaal?',
    fr: 'Que dois-je apporter au moment de récupérer la voiture ?',
    es: '¿Qué tengo que llevar cuando recoja el coche?',
  },
  'acct.faq.longer': {
    en: 'I need the car for longer than I booked.',
    nl: 'Ik heb de auto langer nodig dan ik heb geboekt.',
    fr: 'J’ai besoin de la voiture plus longtemps que prévu.',
    es: 'Necesito el coche más tiempo del que reservé.',
  },
  'acct.faq.refused': {
    en: 'Why was my identity check refused?',
    nl: 'Waarom is mijn identiteitscontrole afgewezen?',
    fr: 'Pourquoi ma vérification d’identité a-t-elle été refusée ?',
    es: '¿Por qué se ha rechazado mi verificación de identidad?',
  },
  'acct.verify.startCheck': {
    en: 'Start the Check',
    nl: 'Controle Starten',
    fr: 'Commencer la Vérification',
    es: 'Empezar la Comprobación',
  },
  'acct.verify.tryAgain': {
    en: 'Try Again',
    nl: 'Opnieuw Proberen',
    fr: 'Réessayer',
    es: 'Intentar de Nuevo',
  },
  'acct.verify.finishCheck': {
    en: 'Finish the Check',
    nl: 'Controle Afronden',
    fr: 'Terminer la Vérification',
    es: 'Terminar la Comprobación',
  },

  // ---- MESSAGING THE BUSINESS ABOUT A RENTAL ----
  'acct.message.title': {
    en: 'Message {business}',
    nl: 'Bericht aan {business}',
    fr: 'Écrire à {business}',
    es: 'Escribir a {business}',
  },
  'acct.message.titleGeneric': {
    en: 'Message the Business',
    nl: 'Bericht aan het bedrijf',
    fr: 'Écrire au loueur',
    es: 'Escribir a la empresa',
  },
  'acct.message.intro': {
    en: 'About your rental {reference}. The business replies in your SXM Rentals messages.',
    nl: 'Over uw huur {reference}. Het bedrijf antwoordt in uw SXM Rentals-berichten.',
    fr: 'Au sujet de votre location {reference}. Le loueur vous répond dans vos messages SXM Rentals.',
    es: 'Sobre su alquiler {reference}. La empresa le responde en sus mensajes de SXM Rentals.',
  },
  'acct.message.label': {
    en: 'Your message',
    nl: 'Uw bericht',
    fr: 'Votre message',
    es: 'Su mensaje',
  },
  'acct.message.placeholder': {
    en: 'For example: where exactly do I collect the car?',
    nl: 'Bijvoorbeeld: waar haal ik de auto precies op?',
    fr: 'Par exemple : où dois-je récupérer la voiture exactement ?',
    es: 'Por ejemplo: ¿dónde recojo exactamente el coche?',
  },
  'acct.message.send': {
    en: 'Send Message',
    nl: 'Bericht Versturen',
    fr: 'Envoyer le Message',
    es: 'Enviar el Mensaje',
  },
  'acct.message.privacy': {
    en: 'The business does not see your phone number or email address. Everything stays in SXM Rentals messages.',
    nl: 'Het bedrijf ziet uw telefoonnummer en e-mailadres niet. Alles blijft in de berichten van SXM Rentals.',
    fr: 'Le loueur ne voit ni votre numéro de téléphone ni votre adresse e-mail. Tout reste dans les messages SXM Rentals.',
    es: 'La empresa no ve su número de teléfono ni su dirección de correo electrónico. Todo queda en los mensajes de SXM Rentals.',
  },

  // ---- CLOSING THE ACCOUNT ----
  'acct.close.title': {
    en: 'Close Your Account',
    nl: 'Uw account sluiten',
    fr: 'Fermer votre compte',
    es: 'Cerrar su cuenta',
  },
  'acct.close.body': {
    en: 'Closing your account signs you out everywhere and removes your phone number and email address from SXM Rentals. Your past rentals and their receipts are kept, because the rental businesses you booked with and our own records have to account for them. You can sign up again with the same email address later.',
    nl: 'Als u uw account sluit, wordt u overal afgemeld en worden uw telefoonnummer en e-mailadres van SXM Rentals verwijderd. Uw eerdere huurperiodes en de bijbehorende bonnen blijven bewaard, omdat de verhuurbedrijven waarbij u boekte en onze eigen administratie daarover verantwoording moeten afleggen. U kunt zich later opnieuw aanmelden met hetzelfde e-mailadres.',
    fr: 'Fermer votre compte vous déconnecte partout et supprime votre numéro de téléphone et votre adresse e-mail de SXM Rentals. Vos locations passées et leurs reçus sont conservés, car les loueurs chez qui vous avez réservé et notre propre comptabilité doivent pouvoir en rendre compte. Vous pourrez vous réinscrire plus tard avec la même adresse e-mail.',
    es: 'Cerrar su cuenta cierra su sesión en todas partes y elimina su número de teléfono y su dirección de correo electrónico de SXM Rentals. Sus alquileres anteriores y sus recibos se conservan, porque las empresas de alquiler con las que reservó y nuestros propios registros tienen que dar cuenta de ellos. Podrá volver a registrarse más adelante con la misma dirección de correo electrónico.',
  },
  'acct.close.conditions': {
    en: 'You can’t close it while a rental is coming up or out, or while a deposit is held — cancel or finish those first. If you run a business on SXM Rentals, close the business first, from its settings.',
    nl: 'U kunt het niet sluiten zolang er een huur gepland of lopend is, of er een borgsom wordt vastgehouden — annuleer of rond die eerst af. Heeft u een bedrijf op SXM Rentals, sluit dan eerst het bedrijf, via de instellingen daarvan.',
    fr: 'Vous ne pouvez pas le fermer tant qu’une location est prévue ou en cours, ou qu’une caution est bloquée — annulez-la ou terminez-la d’abord. Si vous gérez une entreprise sur SXM Rentals, fermez d’abord l’entreprise, depuis ses réglages.',
    es: 'No puede cerrarla mientras tenga un alquiler próximo o en curso, o una fianza retenida: cancélelo o termínelo antes. Si tiene una empresa en SXM Rentals, cierre primero la empresa, desde sus ajustes.',
  },
  'acct.close.button': {
    en: 'Close My Account',
    nl: 'Mijn Account Sluiten',
    fr: 'Fermer Mon Compte',
    es: 'Cerrar Mi Cuenta',
  },
  'acct.close.sheetTitle': {
    en: 'Close your account?',
    nl: 'Uw account sluiten?',
    fr: 'Fermer votre compte ?',
    es: '¿Cerrar su cuenta?',
  },
  'acct.close.understand': {
    en: 'I understand my account is closed for good and cannot be reopened.',
    nl: 'Ik begrijp dat mijn account definitief wordt gesloten en niet opnieuw kan worden geopend.',
    fr: 'Je comprends que mon compte sera fermé définitivement et ne pourra pas être rouvert.',
    es: 'Entiendo que mi cuenta se cierra de forma definitiva y no se puede volver a abrir.',
  },
  'acct.close.done': {
    en: 'Your account is closed',
    nl: 'Uw account is gesloten',
    fr: 'Votre compte est fermé',
    es: 'Su cuenta está cerrada',
  },
  'acct.close.doneBody': {
    en: 'Thank you for renting with SXM Rentals.',
    nl: 'Bedankt dat u met SXM Rentals heeft gehuurd.',
    fr: 'Merci d’avoir loué avec SXM Rentals.',
    es: 'Gracias por alquilar con SXM Rentals.',
  },

  // ---- CLOSING AN ACCOUNT — the public page at /account/close, for anybody (and for Google Play) ----
  'acct.close.learnMore': {
    en: 'What closing removes, and what it keeps',
    nl: 'Wat sluiten verwijdert, en wat het bewaart',
    fr: 'Ce que la fermeture supprime, et ce qu’elle conserve',
    es: 'Qué elimina el cierre y qué conserva',
  },
  'acct.closeGuide.title': {
    en: 'Closing Your SXM Rentals Account',
    nl: 'Uw SXM Rentals-account sluiten',
    fr: 'Fermer votre compte SXM Rentals',
    es: 'Cerrar su cuenta de SXM Rentals',
  },
  'acct.closeGuide.intro': {
    en: 'You can close your SXM Rentals account yourself at any time, on this website or in the SXM Rentals app. This page explains how, what is removed and what is kept.',
    nl: 'U kunt uw SXM Rentals-account op elk moment zelf sluiten, op deze website of in de SXM Rentals-app. Op deze pagina leest u hoe, wat er wordt verwijderd en wat er wordt bewaard.',
    fr: 'Vous pouvez fermer vous-même votre compte SXM Rentals à tout moment, sur ce site ou dans l’application SXM Rentals. Cette page explique comment, ce qui est supprimé et ce qui est conservé.',
    es: 'Puede cerrar usted mismo su cuenta de SXM Rentals en cualquier momento, en este sitio web o en la aplicación de SXM Rentals. Esta página explica cómo hacerlo, qué se elimina y qué se conserva.',
  },
  'acct.closeGuide.stepsTitle': {
    en: 'How to Close It',
    nl: 'Zo sluit u het',
    fr: 'Comment le fermer',
    es: 'Cómo cerrarla',
  },
  'acct.closeGuide.step1': {
    en: 'Sign in at www.sxmrentals.app.',
    nl: 'Meld u aan op www.sxmrentals.app.',
    fr: 'Connectez-vous sur www.sxmrentals.app.',
    es: 'Inicie sesión en www.sxmrentals.app.',
  },
  'acct.closeGuide.step2': {
    en: 'Open {account}, then {settings}.',
    nl: 'Open {account} en daarna {settings}.',
    fr: 'Ouvrez {account}, puis {settings}.',
    es: 'Abra {account} y después {settings}.',
  },
  'acct.closeGuide.step3': {
    en: 'At the bottom of the page, under “{section}”, choose {button}.',
    nl: 'Kies onder aan de pagina, bij „{section}”, {button}.',
    fr: 'En bas de la page, sous « {section} », choisissez {button}.',
    es: 'Al final de la página, en «{section}», elija {button}.',
  },
  'acct.closeGuide.step4': {
    en: 'Enter your password, tick the box, and choose {button} again to confirm.',
    nl: 'Vul uw wachtwoord in, vink het vakje aan en kies nogmaals {button} om te bevestigen.',
    fr: 'Saisissez votre mot de passe, cochez la case, puis choisissez à nouveau {button} pour confirmer.',
    es: 'Introduzca su contraseña, marque la casilla y elija de nuevo {button} para confirmar.',
  },
  'acct.closeGuide.inApp': {
    en: 'In the SXM Rentals app, you can do the same from your account screen.',
    nl: 'In de SXM Rentals-app kunt u hetzelfde doen vanuit uw accountscherm.',
    fr: 'Dans l’application SXM Rentals, vous pouvez faire de même depuis l’écran de votre compte.',
    es: 'En la aplicación de SXM Rentals, puede hacer lo mismo desde la pantalla de su cuenta.',
  },
  'acct.closeGuide.signIn': {
    en: 'Sign In to Close Your Account',
    nl: 'Aanmelden om uw account te sluiten',
    fr: 'Se connecter pour fermer votre compte',
    es: 'Iniciar sesión para cerrar su cuenta',
  },
  'acct.closeGuide.toSettings': {
    en: 'Go to Account Settings',
    nl: 'Naar accountinstellingen',
    fr: 'Aller aux réglages du compte',
    es: 'Ir a los ajustes de la cuenta',
  },
  'acct.closeGuide.removedTitle': {
    en: 'What Is Removed',
    nl: 'Wat wordt verwijderd',
    fr: 'Ce qui est supprimé',
    es: 'Qué se elimina',
  },
  'acct.closeGuide.removed': {
    en: 'Your phone number and email address are removed, and your surname is shortened to its first letter. You are signed out on every device, and the account can’t be signed in to again.',
    nl: 'Uw telefoonnummer en e-mailadres worden verwijderd en uw achternaam wordt ingekort tot de eerste letter. U wordt op elk apparaat afgemeld en er kan niet meer met het account worden ingelogd.',
    fr: 'Votre numéro de téléphone et votre adresse e-mail sont supprimés, et votre nom de famille est réduit à sa première lettre. Vous êtes déconnecté sur tous vos appareils, et plus personne ne peut se connecter au compte.',
    es: 'Se eliminan su número de teléfono y su dirección de correo electrónico, y su apellido se reduce a su primera letra. Se cierra su sesión en todos sus dispositivos y ya no se puede volver a entrar en la cuenta.',
  },
  'acct.closeGuide.keptTitle': {
    en: 'What Is Kept',
    nl: 'Wat wordt bewaard',
    fr: 'Ce qui est conservé',
    es: 'Qué se conserva',
  },
  'acct.closeGuide.kept': {
    en: 'Your first name, and your past rentals with their receipts, because the rental businesses you booked with and our own records have to account for them.',
    nl: 'Uw voornaam, en uw eerdere huurperiodes met de bijbehorende bonnen, omdat de verhuurbedrijven waarbij u boekte en onze eigen administratie daarover verantwoording moeten afleggen.',
    fr: 'Votre prénom, ainsi que vos locations passées et leurs reçus, car les loueurs chez qui vous avez réservé et notre propre comptabilité doivent pouvoir en rendre compte.',
    es: 'Su nombre de pila, y sus alquileres anteriores con sus recibos, porque las empresas de alquiler con las que reservó y nuestros propios registros tienen que dar cuenta de ellos.',
  },
  'acct.closeGuide.again': {
    en: 'You can sign up again later with the same email address. That makes a new account: the old one can’t be reopened.',
    nl: 'U kunt zich later opnieuw aanmelden met hetzelfde e-mailadres. Dat wordt een nieuw account: het oude kan niet worden heropend.',
    fr: 'Vous pourrez vous réinscrire plus tard avec la même adresse e-mail. Ce sera un nouveau compte : l’ancien ne peut pas être rouvert.',
    es: 'Podrá volver a registrarse más adelante con la misma dirección de correo electrónico. Será una cuenta nueva: la anterior no se puede reabrir.',
  },
  'acct.closeGuide.blockersTitle': {
    en: 'What Can Stop It',
    nl: 'Wat het kan tegenhouden',
    fr: 'Ce qui peut l’empêcher',
    es: 'Qué puede impedirlo',
  },
  'acct.closeGuide.blockersIntro': {
    en: 'Your account can’t be closed while any of these is the case. If one is, the site says which.',
    nl: 'Uw account kan niet worden gesloten zolang een van deze situaties geldt. Als dat zo is, zegt de site welke.',
    fr: 'Votre compte ne peut pas être fermé tant que l’un de ces cas s’applique. Si c’est le cas, le site vous dit lequel.',
    es: 'Su cuenta no se puede cerrar mientras se dé alguno de estos casos. Si es así, el sitio le dirá cuál.',
  },
  'acct.closeGuide.blockerRental': {
    en: 'A rental that is coming up or under way. Cancel it, or wait until it has finished.',
    nl: 'Een huur die gepland of lopend is. Annuleer die, of wacht tot hij is afgelopen.',
    fr: 'Une location prévue ou en cours. Annulez-la, ou attendez qu’elle soit terminée.',
    es: 'Un alquiler próximo o en curso. Cancélelo o espere a que termine.',
  },
  'acct.closeGuide.blockerDeposit': {
    en: 'A security deposit still held on your card. It is released once the rental is settled; close your account after that.',
    nl: 'Een borgsom die nog op uw kaart wordt vastgehouden. Die wordt vrijgegeven zodra de huur is afgerond; sluit uw account daarna.',
    fr: 'Une caution encore bloquée sur votre carte. Elle est libérée une fois la location réglée ; fermez votre compte ensuite.',
    es: 'Una fianza todavía retenida en su tarjeta. Se libera cuando el alquiler queda cerrado; cierre su cuenta después.',
  },
  'acct.closeGuide.blockerBusiness': {
    en: 'A rental business you run on SXM Rentals. Close the business first, from {settings} in your business dashboard.',
    nl: 'Een verhuurbedrijf dat u op SXM Rentals runt. Sluit eerst het bedrijf, via {settings} in uw bedrijfsdashboard.',
    fr: 'Une entreprise de location que vous gérez sur SXM Rentals. Fermez d’abord l’entreprise, depuis {settings} dans votre tableau de bord professionnel.',
    es: 'Una empresa de alquiler que usted gestiona en SXM Rentals. Cierre primero la empresa, desde {settings} en su panel de empresa.',
  },
  'acct.closeGuide.cantSignInTitle': {
    en: 'Can’t Sign In?',
    nl: 'Kunt u niet inloggen?',
    fr: 'Impossible de vous connecter ?',
    es: '¿No puede iniciar sesión?',
  },
  'acct.closeGuide.cantSignIn': {
    en: 'Reset your password first. If that doesn’t work, write to {email} from the email address on your account, and we’ll close it for you.',
    nl: 'Stel eerst uw wachtwoord opnieuw in. Lukt dat niet, schrijf dan naar {email} vanaf het e-mailadres van uw account, dan sluiten wij het voor u.',
    fr: 'Réinitialisez d’abord votre mot de passe. Si cela ne fonctionne pas, écrivez à {email} depuis l’adresse e-mail de votre compte, et nous le fermerons pour vous.',
    es: 'Restablezca primero su contraseña. Si no funciona, escriba a {email} desde la dirección de correo electrónico de su cuenta y la cerraremos por usted.',
  },
  'acct.closeGuide.resetPassword': {
    en: 'Reset Your Password',
    nl: 'Wachtwoord opnieuw instellen',
    fr: 'Réinitialiser votre mot de passe',
    es: 'Restablecer su contraseña',
  },
  'acct.closeGuide.privacy': {
    en: 'How we handle your details is set out in our Privacy Policy.',
    nl: 'Hoe wij met uw gegevens omgaan, staat in ons privacybeleid.',
    fr: 'La façon dont nous traitons vos données est décrite dans notre politique de confidentialité.',
    es: 'La forma en que tratamos sus datos se explica en nuestra política de privacidad.',
  },
  'acct.closeGuide.privacyLink': {
    en: 'Read the Privacy Policy',
    nl: 'Lees het privacybeleid',
    fr: 'Lire la politique de confidentialité',
    es: 'Leer la política de privacidad',
  },
} satisfies Record<string, Phrase>;
