// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word in the rental business dashboard, in all four
// languages — the overview, bookings, fleet, payouts, performance, the
// application form and the business profile.
//
// THIS SIDE OF THE SITE NEEDS TRANSLATING MORE THAN THE CUSTOMER SIDE, not
// less. A visitor renting a car for a week can get by in English. A rental
// business owner in Marigot or Philipsburg is being asked to run their livelihood
// through this dashboard every day, read their own payout figures in it, and
// trust that the commission line is right. Doing that in a second language, for
// years, is a different proposition entirely.
//
// TWO RULES ARE ENFORCED IN THE WORDING HERE, and both must survive translation:
//
//   Money shown to a business is always their share, after commission. Every
//   label saying so — "You receive", "After commission", "Your share" — has to
//   keep saying so, because a figure without that qualifier reads as the whole
//   amount and makes every payout look short.
//
//   A business never sees a customer's phone number or email. The sentences
//   explaining why are not filler; they are what stops the absence reading as
//   missing data. If they are left in English, a Dutch-speaking owner sees a
//   blank where contact details should be and no explanation they can read.

import type { Phrase } from './types';

export const providerPortal = {
  // ---- THE OVERVIEW ----
  'pp.paidToDate': {
    en: 'PAID OUT TO DATE',
    nl: 'TOT NU TOE UITBETAALD',
    fr: 'VERSÉ À CE JOUR',
    es: 'PAGADO HASTA LA FECHA',
  },
  'pp.yourShareAfter': {
    en: 'Your share, after commission',
    nl: 'Uw aandeel, na commissie',
    fr: 'Votre part, après commission',
    es: 'Su parte, después de la comisión',
  },
  'pp.nextPayout': {
    en: 'NEXT PAYOUT',
    nl: 'VOLGENDE UITBETALING',
    fr: 'PROCHAIN VERSEMENT',
    es: 'PRÓXIMO PAGO',
  },
  'pp.fleet': {
    en: 'FLEET',
    nl: 'WAGENPARK',
    fr: 'FLOTTE',
    es: 'FLOTA',
  },
  'pp.pending': {
    en: 'PENDING',
    nl: 'IN BEHANDELING',
    fr: 'EN ATTENTE',
    es: 'PENDIENTE',
  },
  'pp.yourNextPayout': {
    en: 'Your Next Payout',
    nl: 'Uw volgende uitbetaling',
    fr: 'Votre prochain versement',
    es: 'Su próximo pago',
  },
  'pp.depositsNotPart': {
    en: 'Security deposits are not part of this. They are held against the customer’s',
    nl: 'Borgsommen horen hier niet bij. Die worden gereserveerd op de kaart van de klant',
    fr: 'Les cautions n’en font pas partie. Elles sont bloquées sur la carte du client',
    es: 'Las fianzas no forman parte de esto. Se retienen en la tarjeta del cliente',
  },
  'pp.allPayouts': {
    en: 'All Payouts',
    nl: 'Alle Uitbetalingen',
    fr: 'Tous les Versements',
    es: 'Todos los Pagos',
  },
  'pp.bestEarning': {
    en: 'Best Earning Vehicles',
    nl: 'Best verdienende voertuigen',
    fr: 'Véhicules les plus rentables',
    es: 'Vehículos que más ganan',
  },
  'pp.noEarnings': {
    en: 'No earnings yet. Figures appear here once your first bookings complete.',
    nl: 'Nog geen inkomsten. Cijfers verschijnen hier zodra uw eerste boekingen zijn afgerond.',
    fr: 'Aucun revenu pour l’instant. Les chiffres apparaissent ici une fois vos premières réservations terminées.',
    es: 'Todavía no hay ingresos. Las cifras aparecen aquí cuando se completen sus primeras reservas.',
  },
  'pp.revenueIsShare': {
    en: 'Revenue shown is your share after commission, not what customers paid.',
    nl: 'De getoonde omzet is uw aandeel na commissie, niet wat klanten hebben betaald.',
    fr: 'Le chiffre d’affaires affiché est votre part après commission, pas ce que les clients ont payé.',
    es: 'Los ingresos que se muestran son su parte después de la comisión, no lo que pagaron los clientes.',
  },
  'pp.enquiriesAndBookings': {
    en: 'Enquiries and Bookings',
    nl: 'Aanvragen en boekingen',
    fr: 'Demandes et réservations',
    es: 'Consultas y reservas',
  },
  'pp.enquiriesBecame': {
    en: 'Enquiries that Became Bookings',
    nl: 'Aanvragen die boekingen werden',
    fr: 'Demandes converties en réservations',
    es: 'Consultas que se convirtieron en reservas',
  },
  'pp.countsOnly': {
    en: 'Counts only. Who enquired, and how to reach them, stays with SXM Rentals.',
    nl: 'Alleen aantallen. Wie er heeft gevraagd, en hoe die te bereiken is, blijft bij SXM Rentals.',
    fr: 'Des nombres uniquement. Qui a fait la demande, et comment le joindre, reste chez SXM Rentals.',
    es: 'Solo cantidades. Quién preguntó, y cómo localizarle, se queda en SXM Rentals.',
  },
  'pp.comingUp': {
    en: 'Coming Up',
    nl: 'Binnenkort',
    fr: 'À venir',
    es: 'Próximamente',
  },
  'pp.allBookings': {
    en: 'All Bookings',
    nl: 'Alle Boekingen',
    fr: 'Toutes les Réservations',
    es: 'Todas las Reservas',
  },
  'pp.seeBookings': {
    en: 'See Bookings',
    nl: 'Boekingen Bekijken',
    fr: 'Voir les Réservations',
    es: 'Ver Reservas',
  },
  'pp.nothingBooked': {
    en: 'Nothing booked yet',
    nl: 'Nog niets geboekt',
    fr: 'Rien de réservé pour l’instant',
    es: 'Todavía no hay reservas',
  },
  'pp.comingUpNote': {
    en: 'Bookings coming up or out now. Renters are shown by first name and last initial only.',
    nl: 'Aankomende of lopende boekingen. Huurders worden alleen met voornaam en de eerste letter van hun achternaam getoond.',
    fr: 'Réservations à venir ou en cours. Les locataires sont indiqués uniquement par leur prénom et l’initiale de leur nom.',
    es: 'Reservas próximas o en curso. Los clientes se muestran solo con el nombre y la inicial del apellido.',
  },

  // ---- BOOKINGS ----
  'pp.bookings.intro': {
    en: 'Bookings across your fleet. Customer contact details are not shown.',
    nl: 'Boekingen in uw hele wagenpark. Contactgegevens van klanten worden niet getoond.',
    fr: 'Les réservations sur l’ensemble de votre flotte. Les coordonnées des clients ne sont pas affichées.',
    es: 'Reservas de toda su flota. No se muestran los datos de contacto de los clientes.',
  },
  'pp.bookings.emptyBody': {
    en: 'Bookings on your vehicles appear here as soon as customers make them.',
    nl: 'Boekingen op uw voertuigen verschijnen hier zodra klanten ze maken.',
    fr: 'Les réservations sur vos véhicules apparaissent ici dès que les clients les effectuent.',
    es: 'Las reservas de sus vehículos aparecen aquí en cuanto los clientes las hacen.',
  },
  'pp.bookings.everything': {
    en: 'Everything booked across your fleet. Amounts shown are your share after commission.',
    nl: 'Alles wat in uw wagenpark is geboekt. De getoonde bedragen zijn uw aandeel na commissie.',
    fr: 'Tout ce qui est réservé sur votre flotte. Les montants indiqués sont votre part après commission.',
    es: 'Todo lo reservado en su flota. Los importes que se muestran son su parte después de la comisión.',
  },
  'pp.bookings.which': {
    en: 'Which Bookings to Show',
    nl: 'Welke boekingen tonen',
    fr: 'Quelles réservations afficher',
    es: 'Qué reservas mostrar',
  },
  'pp.bookings.notFound': {
    en: 'We could not find that booking',
    nl: 'Wij konden die boeking niet vinden',
    fr: 'Nous n’avons pas trouvé cette réservation',
    es: 'No hemos encontrado esa reserva',
  },
  'pp.bookings.notFoundBody': {
    en: 'It may have been cancelled, or the address may be wrong.',
    nl: 'Mogelijk is die geannuleerd, of klopt het adres niet.',
    fr: 'Elle a peut-être été annulée, ou l’adresse est incorrecte.',
    es: 'Puede que se haya cancelado, o que la dirección sea incorrecta.',
  },
  'pp.bookings.whoCollecting': {
    en: 'Who Is Collecting It',
    nl: 'Wie de auto ophaalt',
    fr: 'Qui vient la récupérer',
    es: 'Quién lo recoge',
  },
  'pp.bookings.licenceAndId': {
    en: 'Licence and ID',
    nl: 'Rijbewijs en ID',
    fr: 'Permis et pièce d’identité',
    es: 'Carné e identificación',
  },
  'pp.bookings.licenceVerified': {
    en: 'Licence Verified',
    nl: 'Rijbewijs Geverifieerd',
    fr: 'Permis Vérifié',
    es: 'Carné Verificado',
  },
  'pp.bookings.notVerified': {
    en: 'Not Yet Verified',
    nl: 'Nog Niet Geverifieerd',
    fr: 'Pas Encore Vérifié',
    es: 'Todavía Sin Verificar',
  },
  'pp.bookings.doNotHandOver': {
    en: 'Do not hand over the vehicle until this says checked. If it has not cleared by the collection date, message SXM Rentals.',
    nl: 'Overhandig het voertuig pas als hier gecontroleerd staat. Als het op de ophaaldatum nog niet is goedgekeurd, stuur dan een bericht naar SXM Rentals.',
    fr: 'Ne remettez pas le véhicule tant que ceci n’indique pas vérifié. Si ce n’est pas validé à la date de retrait, écrivez à SXM Rentals.',
    es: 'No entregue el vehículo hasta que aquí ponga comprobado. Si no se ha validado para la fecha de recogida, escriba a SXM Rentals.',
  },
  'pp.bookings.details': {
    en: 'Booking Details',
    nl: 'Boekingsgegevens',
    fr: 'Détails de la réservation',
    es: 'Datos de la reserva',
  },
  'pp.bookings.whatYouReceive': {
    en: 'What you receive from this booking',
    nl: 'Wat u aan deze boeking overhoudt',
    fr: 'Ce que vous recevez pour cette réservation',
    es: 'Lo que recibe de esta reserva',
  },
  'pp.bookings.noCommissionOnDeposits': {
    en: 'Deposits are never part of a payout and no commission is taken from them.',
    nl: 'Borgsommen maken nooit deel uit van een uitbetaling en er wordt geen commissie over gerekend.',
    fr: 'Les cautions ne font jamais partie d’un versement et aucune commission n’est prélevée dessus.',
    es: 'Las fianzas nunca forman parte de un pago y no se les aplica ninguna comisión.',
  },
  'pp.bookings.messageRenter': {
    en: 'Message the Renter',
    nl: 'Bericht de Huurder',
    fr: 'Écrire au Locataire',
    es: 'Escribir al Cliente',
  },
  'pp.bookings.editVehicle': {
    en: 'Edit This Vehicle',
    nl: 'Dit Voertuig Bewerken',
    fr: 'Modifier Ce Véhicule',
    es: 'Editar Este Vehículo',
  },

  // ---- THE PRIVACY RULE, SAID PLAINLY ----
  'pp.privacy.noPhoneTitle': {
    en: 'No Phone Number or Email',
    nl: 'Geen telefoonnummer of e-mailadres',
    fr: 'Ni numéro de téléphone ni e-mail',
    es: 'Sin teléfono ni correo',
  },
  'pp.privacy.whyTitle': {
    en: 'Why There Is No Phone Number or Email Here',
    nl: 'Waarom hier geen telefoonnummer of e-mailadres staat',
    fr: 'Pourquoi il n’y a ni téléphone ni e-mail ici',
    es: 'Por qué aquí no hay teléfono ni correo',
  },
  'pp.privacy.notShared': {
    en: 'Phone numbers and email addresses are not shared with rental businesses. You have the renter’s name and whether we have checked their licence, and this is where you arrange the collection. The call button connects you through SXM Rentals without either side seeing the other’s number. Keeping it here is what lets us help if there is a dispute about the deposit, the condition of the vehicle, or a late return.',
    nl: 'Telefoonnummers en e-mailadressen worden niet gedeeld met verhuurbedrijven. U heeft de naam van de huurder en of wij hun rijbewijs hebben gecontroleerd, en hier regelt u het ophalen. De belknop verbindt u via SXM Rentals zonder dat een van beide partijen het nummer van de ander ziet. Doordat het hier blijft, kunnen wij helpen bij een geschil over de borgsom, de staat van het voertuig of een late teruggave.',
    fr: 'Les numéros de téléphone et adresses e-mail ne sont pas communiqués aux loueurs. Vous avez le nom du locataire et le fait que nous ayons vérifié son permis, et c’est ici que vous organisez le retrait. Le bouton d’appel vous met en relation via SXM Rentals sans qu’aucune des deux parties ne voie le numéro de l’autre. C’est parce que tout reste ici que nous pouvons intervenir en cas de litige sur la caution, l’état du véhicule ou un retour tardif.',
    es: 'Los teléfonos y los correos no se comparten con las empresas de alquiler. Usted tiene el nombre del cliente y si hemos comprobado su carné, y aquí es donde organiza la recogida. El botón de llamada le conecta a través de SXM Rentals sin que ninguna de las dos partes vea el número de la otra. Que todo se quede aquí es lo que nos permite ayudar si hay una disputa por la fianza, el estado del vehículo o una devolución tardía.',
  },
  'pp.privacy.messageInstead': {
    en: 'Message the renter through SXM Rentals instead. You have their name and confirmation that we have checked their licence, which is what you need to hand over the keys.',
    nl: 'Stuur de huurder in plaats daarvan een bericht via SXM Rentals. U heeft hun naam en de bevestiging dat wij hun rijbewijs hebben gecontroleerd, en dat is wat u nodig heeft om de sleutels te overhandigen.',
    fr: 'Écrivez plutôt au locataire via SXM Rentals. Vous avez son nom et la confirmation que nous avons vérifié son permis, ce qui est nécessaire pour lui remettre les clés.',
    es: 'Escriba al cliente a través de SXM Rentals. Tiene su nombre y la confirmación de que hemos comprobado su carné, que es lo que necesita para entregar las llaves.',
  },
  'pp.privacy.thatWay': {
    en: 'Message the renter through SXM Rentals instead — that way the booking, the deposit, the signed agreement and anything that goes wrong are all things we can actually help with. You get the renter’s first name and last initial, the dates and whether we have checked their licence, which is everything needed to hand a car to the right person.',
    nl: 'Stuur de huurder in plaats daarvan een bericht via SXM Rentals — zo zijn de boeking, de borgsom, de ondertekende overeenkomst en alles wat misgaat zaken waarbij wij daadwerkelijk kunnen helpen. U krijgt de voornaam en de eerste letter van de achternaam van de huurder, de data en of wij het rijbewijs hebben gecontroleerd: alles wat nodig is om een auto aan de juiste persoon te geven.',
    fr: 'Écrivez plutôt au locataire via SXM Rentals — ainsi la réservation, la caution, le contrat signé et tout ce qui pourrait mal tourner sont des choses sur lesquelles nous pouvons réellement intervenir. Vous obtenez le prénom du locataire et l’initiale de son nom, les dates et le fait que nous ayons vérifié son permis, soit tout ce qu’il faut pour remettre une voiture à la bonne personne.',
    es: 'Escriba al cliente a través de SXM Rentals: así la reserva, la fianza, el contrato firmado y cualquier cosa que salga mal son asuntos en los que realmente podemos ayudar. Usted recibe el nombre del cliente y la inicial del apellido, las fechas y si hemos comprobado su carné, que es todo lo necesario para entregar un coche a la persona correcta.',
  },
  'pp.privacy.callThrough': {
    en: 'Call This Renter Through SXM Rentals',
    nl: 'Bel deze huurder via SXM Rentals',
    fr: 'Appeler ce locataire via SXM Rentals',
    es: 'Llamar a este cliente a través de SXM Rentals',
  },

  // ---- THE FLEET ----
  'pp.fleet.emptyTitle': {
    en: 'No vehicles listed yet',
    nl: 'Nog geen voertuigen geplaatst',
    fr: 'Aucun véhicule publié',
    es: 'Todavía no hay vehículos publicados',
  },
  'pp.fleet.emptyBody': {
    en: 'Add your first vehicle and it goes live once we have checked its documents. There is no limit on how many you can list.',
    nl: 'Voeg uw eerste voertuig toe; het gaat live zodra wij de documenten hebben gecontroleerd. Er is geen limiet aan het aantal dat u kunt plaatsen.',
    fr: 'Ajoutez votre premier véhicule ; il sera en ligne une fois ses documents vérifiés. Il n’y a aucune limite au nombre de véhicules.',
    es: 'Añada su primer vehículo y se publicará cuando hayamos comprobado sus documentos. No hay límite de cuántos puede publicar.',
  },
  'pp.fleet.yourRate': {
    en: 'Your rate',
    nl: 'Uw tarief',
    fr: 'Votre tarif',
    es: 'Su tarifa',
  },
  'pp.fleet.youEarned': {
    en: 'You earned',
    nl: 'U verdiende',
    fr: 'Vous avez gagné',
    es: 'Ha ganado',
  },
  'pp.fleet.delivers': {
    en: 'DELIVERS',
    nl: 'BEZORGT',
    fr: 'LIVRAISON',
    es: 'CON ENTREGA',
  },
  'pp.fleet.historyDeclared': {
    en: 'HISTORY DECLARED',
    nl: 'HISTORIE OPGEGEVEN',
    fr: 'HISTORIQUE DÉCLARÉ',
    es: 'HISTORIAL DECLARADO',
  },
  'pp.fleet.edit': {
    en: 'Edit',
    nl: 'Bewerken',
    fr: 'Modifier',
    es: 'Editar',
  },
  'pp.fleet.viewListing': {
    en: 'View Listing',
    nl: 'Advertentie Bekijken',
    fr: 'Voir l’Annonce',
    es: 'Ver el Anuncio',
  },
  'pp.fleet.viewPublic': {
    en: 'View the Public Listing',
    nl: 'De Openbare Advertentie Bekijken',
    fr: 'Voir l’Annonce Publique',
    es: 'Ver el Anuncio Público',
  },
  'pp.fleet.earningsNote': {
    en: 'Earnings shown per vehicle are your share after commission, not what customers paid. Security deposits are held against the customer’s card by SXM Rentals and are never part of what you earn.',
    nl: 'De per voertuig getoonde inkomsten zijn uw aandeel na commissie, niet wat klanten hebben betaald. Borgsommen worden door SXM Rentals op de kaart van de klant gereserveerd en maken nooit deel uit van wat u verdient.',
    fr: 'Les revenus indiqués par véhicule sont votre part après commission, pas ce que les clients ont payé. Les cautions sont bloquées sur la carte du client par SXM Rentals et ne font jamais partie de vos gains.',
    es: 'Los ingresos que se muestran por vehículo son su parte después de la comisión, no lo que pagaron los clientes. Las fianzas las retiene SXM Rentals en la tarjeta del cliente y nunca forman parte de lo que usted gana.',
  },
  'pp.fleet.addTitle': {
    en: 'Add Vehicles',
    nl: 'Voertuigen toevoegen',
    fr: 'Ajouter des véhicules',
    es: 'Añadir vehículos',
  },
  'pp.fleet.fourWays': {
    en: 'Four ways to do it. There is no limit on how many vehicles you can list.',
    nl: 'Vier manieren om het te doen. Er is geen limiet aan het aantal voertuigen dat u kunt plaatsen.',
    fr: 'Quatre façons de le faire. Il n’y a aucune limite au nombre de véhicules.',
    es: 'Cuatro maneras de hacerlo. No hay límite de cuántos vehículos puede publicar.',
  },
  'pp.fleet.addOne': {
    en: 'Add one vehicle',
    nl: 'Eén voertuig toevoegen',
    fr: 'Ajouter un véhicule',
    es: 'Añadir un vehículo',
  },
  'pp.fleet.uploadSheet': {
    en: 'Upload a spreadsheet',
    nl: 'Een spreadsheet uploaden',
    fr: 'Importer un tableur',
    es: 'Subir una hoja de cálculo',
  },
  'pp.fleet.connectSystem': {
    en: 'Connect your own system',
    nl: 'Koppel uw eigen systeem',
    fr: 'Connecter votre propre système',
    es: 'Conectar su propio sistema',
  },
  'pp.fleet.sendToUs': {
    en: 'Send it to us',
    nl: 'Stuur het naar ons',
    fr: 'Nous l’envoyer',
    es: 'Envíenoslo',
  },
  'pp.fleet.afterYouAdd': {
    en: 'What Happens After You Add One',
    nl: 'Wat er gebeurt nadat u er een toevoegt',
    fr: 'Ce qui se passe après un ajout',
    es: 'Qué pasa después de añadir uno',
  },
  'pp.fleet.nothingLiveImmediately': {
    en: 'Nothing goes live immediately. SXM Rentals staff check the registration and',
    nl: 'Niets gaat meteen live. Medewerkers van SXM Rentals controleren de inschrijving en',
    fr: 'Rien n’est mis en ligne immédiatement. Les équipes de SXM Rentals vérifient l’immatriculation et',
    es: 'Nada se publica de inmediato. El personal de SXM Rentals comprueba la matrícula y',
  },
  'pp.fleet.goesLiveOnce': {
    en: 'It goes live once SXM Rentals has checked its registration and insurance',
    nl: 'Het gaat live zodra SXM Rentals de inschrijving en verzekering heeft gecontroleerd',
    fr: 'Il sera en ligne une fois que SXM Rentals aura vérifié son immatriculation et son assurance',
    es: 'Se publica cuando SXM Rentals haya comprobado su matrícula y su seguro',
  },

  // ---- IMPORTING A SPREADSHEET ----
  'pp.import.title': {
    en: 'Import a Spreadsheet',
    nl: 'Een spreadsheet importeren',
    fr: 'Importer un tableur',
    es: 'Importar una hoja de cálculo',
  },
  'pp.import.subtitle': {
    en: 'Drag your file in and check what we read out of it. Nothing is saved until you have seen the preview and confirmed it.',
    nl: 'Sleep uw bestand hierheen en controleer wat wij eruit lezen. Er wordt niets opgeslagen totdat u het voorbeeld heeft gezien en bevestigd.',
    fr: 'Glissez votre fichier ici et vérifiez ce que nous en lisons. Rien n’est enregistré tant que vous n’avez pas vu l’aperçu et confirmé.',
    es: 'Arrastre aquí su archivo y compruebe lo que leemos de él. No se guarda nada hasta que haya visto la vista previa y la confirme.',
  },
  'pp.import.needs': {
    en: 'What Your Spreadsheet Needs',
    nl: 'Wat uw spreadsheet nodig heeft',
    fr: 'Ce que votre tableur doit contenir',
    es: 'Lo que necesita su hoja de cálculo',
  },
  'pp.import.oneRow': {
    en: 'One vehicle per row, with a heading row at the top. Column order does not matter — we match on the headings.',
    nl: 'Eén voertuig per rij, met een koprij bovenaan. De volgorde van de kolommen maakt niet uit — wij matchen op de koppen.',
    fr: 'Un véhicule par ligne, avec une ligne d’en-tête en haut. L’ordre des colonnes n’a pas d’importance — nous nous basons sur les en-têtes.',
    es: 'Un vehículo por fila, con una fila de encabezados arriba. El orden de las columnas da igual: nos guiamos por los encabezados.',
  },
  'pp.import.afterwards': {
    en: 'Photos, deposits and availability are set afterwards, per vehicle. This import is for getting the basic list in.',
    nl: 'Foto’s, borgsommen en beschikbaarheid worden achteraf per voertuig ingesteld. Deze import is bedoeld om de basislijst binnen te krijgen.',
    fr: 'Les photos, les cautions et les disponibilités se règlent ensuite, véhicule par véhicule. Cet import sert à faire entrer la liste de base.',
    es: 'Las fotos, las fianzas y la disponibilidad se configuran después, vehículo por vehículo. Esta importación sirve para meter la lista básica.',
  },
  'pp.import.eachSays': {
    en: 'Each one says what is wrong with it. Correct it here, or remove the row and add that vehicle separately. The rows that are fine will be saved either way.',
    nl: 'Bij elke rij staat wat er mis mee is. Corrigeer het hier, of verwijder de rij en voeg dat voertuig apart toe. De rijen die in orde zijn worden hoe dan ook opgeslagen.',
    fr: 'Chacune indique ce qui ne va pas. Corrigez-la ici, ou supprimez la ligne et ajoutez ce véhicule séparément. Les lignes correctes seront enregistrées dans tous les cas.',
    es: 'Cada una indica qué le pasa. Corríjala aquí, o elimine la fila y añada ese vehículo por separado. Las filas correctas se guardarán igualmente.',
  },
  'pp.import.everyRow': {
    en: 'Every row read from your spreadsheet, with any problems listed.',
    nl: 'Elke rij die uit uw spreadsheet is gelezen, met eventuele problemen erbij.',
    fr: 'Chaque ligne lue dans votre tableur, avec les problèmes éventuels.',
    es: 'Todas las filas leídas de su hoja de cálculo, con los problemas que haya.',
  },
  'pp.import.needsFixing': {
    en: 'NEEDS FIXING',
    nl: 'MOET WORDEN HERSTELD',
    fr: 'À CORRIGER',
    es: 'HAY QUE CORREGIR',
  },
  'pp.import.ready': {
    en: 'READY',
    nl: 'KLAAR',
    fr: 'PRÊT',
    es: 'LISTO',
  },
  'pp.import.removeRow': {
    en: 'Remove this row',
    nl: 'Deze rij verwijderen',
    fr: 'Supprimer cette ligne',
    es: 'Eliminar esta fila',
  },
  'pp.import.notVisibleYet': {
    en: 'They are not visible to customers yet. SXM Rentals staff check the registration and insurance documents for each one before it goes live.',
    nl: 'Ze zijn nog niet zichtbaar voor klanten. Medewerkers van SXM Rentals controleren voor elk voertuig de inschrijvings- en verzekeringsdocumenten voordat het live gaat.',
    fr: 'Ils ne sont pas encore visibles par les clients. Les équipes de SXM Rentals vérifient les documents d’immatriculation et d’assurance de chacun avant sa mise en ligne.',
    es: 'Todavía no son visibles para los clientes. El personal de SXM Rentals comprueba los documentos de matriculación y seguro de cada uno antes de publicarlo.',
  },
  'pp.import.demoNote': {
    en: 'This is a demo — nothing has actually been saved.',
    nl: 'Dit is een demo — er is niets daadwerkelijk opgeslagen.',
    fr: 'Ceci est une démonstration — rien n’a réellement été enregistré.',
    es: 'Esto es una demostración: no se ha guardado nada de verdad.',
  },
  'pp.import.seeFleet': {
    en: 'See Your Fleet',
    nl: 'Uw Wagenpark Bekijken',
    fr: 'Voir Votre Flotte',
    es: 'Ver Su Flota',
  },
  'pp.import.another': {
    en: 'Import Another File',
    nl: 'Nog een Bestand Importeren',
    fr: 'Importer un Autre Fichier',
    es: 'Importar Otro Archivo',
  },
  'pp.import.startAgain': {
    en: 'Start Again',
    nl: 'Opnieuw Beginnen',
    fr: 'Recommencer',
    es: 'Empezar de Nuevo',
  },

  // ---- CONNECTING YOUR OWN SYSTEM ----
  'pp.api.title': {
    en: 'Connect your booking system',
    nl: 'Koppel uw boekingssysteem',
    fr: 'Connecter votre système de réservation',
    es: 'Conecte su sistema de reservas',
  },
  'pp.api.subtitle': {
    en: 'Keep your inventory and availability where they already are. We read from your system rather than asking you to keep two of them in step.',
    nl: 'Houd uw voorraad en beschikbaarheid waar die al staan. Wij lezen uit uw systeem in plaats van u te vragen er twee gelijk te houden.',
    fr: 'Gardez votre inventaire et vos disponibilités là où ils sont déjà. Nous lisons depuis votre système plutôt que de vous demander d’en tenir deux à jour.',
    es: 'Mantenga su inventario y su disponibilidad donde ya están. Leemos de su sistema en lugar de pedirle que mantenga dos sincronizados.',
  },
  'pp.api.how': {
    en: 'How the Connection Works',
    nl: 'Hoe de koppeling werkt',
    fr: 'Comment fonctionne la connexion',
    es: 'Cómo funciona la conexión',
  },
  'pp.api.readTitle': {
    en: 'We read your vehicles and availability',
    nl: 'Wij lezen uw voertuigen en beschikbaarheid',
    fr: 'Nous lisons vos véhicules et vos disponibilités',
    es: 'Leemos sus vehículos y su disponibilidad',
  },
  'pp.api.readBody': {
    en: 'Your system stays the place you manage them. We ask it what is available rather than keeping a second copy that can drift out of date.',
    nl: 'Uw systeem blijft de plek waar u ze beheert. Wij vragen het wat beschikbaar is in plaats van een tweede kopie bij te houden die kan verouderen.',
    fr: 'Votre système reste l’endroit où vous les gérez. Nous lui demandons ce qui est disponible plutôt que de garder une seconde copie qui pourrait se désynchroniser.',
    es: 'Su sistema sigue siendo el lugar donde los gestiona. Le preguntamos qué hay disponible en lugar de guardar una segunda copia que puede quedarse desfasada.',
  },
  'pp.api.sendTitle': {
    en: 'We send bookings back to you',
    nl: 'Wij sturen boekingen naar u terug',
    fr: 'Nous vous renvoyons les réservations',
    es: 'Le devolvemos las reservas',
  },
  'pp.api.sendBody': {
    en: 'When a customer books, we post it to a web address of yours so it appears in your own system straight away.',
    nl: 'Wanneer een klant boekt, sturen wij dat naar een webadres van u, zodat het meteen in uw eigen systeem verschijnt.',
    fr: 'Quand un client réserve, nous envoyons l’information à une adresse web à vous, pour qu’elle apparaisse immédiatement dans votre système.',
    es: 'Cuando un cliente reserva, lo enviamos a una dirección web suya para que aparezca al momento en su propio sistema.',
  },
  'pp.api.moneyTitle': {
    en: 'Payments and deposits stay with us',
    nl: 'Betalingen en borgsommen blijven bij ons',
    fr: 'Les paiements et les cautions restent chez nous',
    es: 'Los pagos y las fianzas se quedan con nosotros',
  },
  'pp.api.moneyBody': {
    en: 'The money, the deposit hold and the signed agreement are all handled by SXM Rentals. Your system does not need to know anything about cards.',
    nl: 'Het geld, de borgreservering en de ondertekende overeenkomst worden allemaal door SXM Rentals afgehandeld. Uw systeem hoeft niets van kaarten te weten.',
    fr: 'L’argent, le blocage de la caution et le contrat signé sont entièrement gérés par SXM Rentals. Votre système n’a rien à savoir des cartes.',
    es: 'El dinero, la retención de la fianza y el contrato firmado los gestiona SXM Rentals. Su sistema no necesita saber nada de tarjetas.',
  },
  'pp.api.details': {
    en: 'Your Connection Details',
    nl: 'Uw koppelgegevens',
    fr: 'Vos informations de connexion',
    es: 'Sus datos de conexión',
  },
  'pp.api.key': {
    en: 'API Key',
    nl: 'API-sleutel',
    fr: 'Clé API',
    es: 'Clave API',
  },
  'pp.api.inventoryUrl': {
    en: 'Where to Send Your Inventory',
    nl: 'Waar u uw voorraad naartoe stuurt',
    fr: 'Où envoyer votre inventaire',
    es: 'Dónde enviar su inventario',
  },
  'pp.api.bookingsUrl': {
    en: 'Where We Send Your Bookings',
    nl: 'Waar wij uw boekingen naartoe sturen',
    fr: 'Où nous envoyons vos réservations',
    es: 'Dónde enviamos sus reservas',
  },
  'pp.api.keyWarning': {
    en: 'Treat the API key like a password. Anyone holding it can change your listings. If it is ever seen by somebody who should not have it, tell SXM Rentals and we will issue a new one.',
    nl: 'Behandel de API-sleutel als een wachtwoord. Iedereen die hem heeft kan uw advertenties wijzigen. Als hij ooit wordt gezien door iemand die hem niet hoort te hebben, laat het SXM Rentals weten en wij geven een nieuwe uit.',
    fr: 'Traitez la clé API comme un mot de passe. Quiconque la détient peut modifier vos annonces. Si elle est vue par quelqu’un qui ne devrait pas l’avoir, prévenez SXM Rentals et nous en émettrons une nouvelle.',
    es: 'Trate la clave API como una contraseña. Quien la tenga puede cambiar sus anuncios. Si alguna vez la ve alguien que no debería tenerla, avise a SXM Rentals y le emitiremos una nueva.',
  },
  'pp.api.readDocs': {
    en: 'Read the Developer Docs',
    nl: 'Lees de Ontwikkelaarsdocumentatie',
    fr: 'Lire la Documentation Technique',
    es: 'Leer la Documentación Técnica',
  },
  'pp.api.demoNote': {
    en: 'Demo mode — these details are made up and the addresses do not exist. Nothing is connected to a real system.',
    nl: 'Demomodus — deze gegevens zijn verzonnen en de adressen bestaan niet. Er is niets gekoppeld aan een echt systeem.',
    fr: 'Mode démo — ces informations sont fictives et les adresses n’existent pas. Rien n’est connecté à un vrai système.',
    es: 'Modo demo: estos datos son inventados y las direcciones no existen. No hay nada conectado a un sistema real.',
  },

  // ---- PAYOUTS ----
  'pp.payouts.emptyTitle': {
    en: 'No payouts yet',
    nl: 'Nog geen uitbetalingen',
    fr: 'Aucun versement pour l’instant',
    es: 'Todavía no hay pagos',
  },
  'pp.payouts.emptyBody': {
    en: 'Once your first bookings complete, what you are owed appears here with the commission shown on every line.',
    nl: 'Zodra uw eerste boekingen zijn afgerond verschijnt hier wat u tegoed heeft, met op elke regel de commissie erbij.',
    fr: 'Une fois vos premières réservations terminées, ce qui vous est dû apparaît ici avec la commission indiquée sur chaque ligne.',
    es: 'Cuando se completen sus primeras reservas, lo que se le debe aparece aquí con la comisión indicada en cada línea.',
  },
  'pp.payouts.paidToYou': {
    en: 'PAID TO YOU',
    nl: 'AAN U UITBETAALD',
    fr: 'VERSÉ À VOUS',
    es: 'PAGADO A USTED',
  },
  'pp.payouts.stillToCome': {
    en: 'STILL TO COME',
    nl: 'NOG TE ONTVANGEN',
    fr: 'ENCORE À VENIR',
    es: 'PENDIENTE DE COBRO',
  },
  'pp.payouts.customersPaid': {
    en: 'CUSTOMERS PAID',
    nl: 'KLANTEN BETAALDEN',
    fr: 'CLIENTS ONT PAYÉ',
    es: 'CLIENTES PAGARON',
  },
  'pp.payouts.beforeCommission': {
    en: 'Before commission',
    nl: 'Vóór commissie',
    fr: 'Avant commission',
    es: 'Antes de la comisión',
  },
  'pp.payouts.commissionTaken': {
    en: 'COMMISSION TAKEN',
    nl: 'INGEHOUDEN COMMISSIE',
    fr: 'COMMISSION PRÉLEVÉE',
    es: 'COMISIÓN APLICADA',
  },
  'pp.payouts.everyPayout': {
    en: 'Every payout, showing what customers paid, the commission taken, and what you received.',
    nl: 'Elke uitbetaling, met wat klanten betaalden, de ingehouden commissie, en wat u heeft ontvangen.',
    fr: 'Chaque versement, avec ce que les clients ont payé, la commission prélevée, et ce que vous avez reçu.',
    es: 'Cada pago, con lo que pagaron los clientes, la comisión aplicada y lo que usted recibió.',
  },
  'pp.payouts.customersPaidLabel': {
    en: 'Customers paid',
    nl: 'Klanten betaalden',
    fr: 'Les clients ont payé',
    es: 'Los clientes pagaron',
  },
  'pp.payouts.youReceived': {
    en: 'You received',
    nl: 'U ontving',
    fr: 'Vous avez reçu',
    es: 'Usted recibió',
  },
  'pp.payouts.depositsNotPart': {
    en: 'Security Deposits Are Not Part of Any Payout',
    nl: 'Borgsommen maken geen deel uit van een uitbetaling',
    fr: 'Les cautions ne font partie d’aucun versement',
    es: 'Las fianzas no forman parte de ningún pago',
  },
  'pp.payouts.depositExplain': {
    en: 'A deposit is held against the customer’s card by SXM Rentals and given',
    nl: 'Een borgsom wordt door SXM Rentals op de kaart van de klant gereserveerd en',
    fr: 'Une caution est bloquée sur la carte du client par SXM Rentals et',
    es: 'SXM Rentals retiene la fianza en la tarjeta del cliente y',
  },

  // ---- PERFORMANCE ----
  'pp.perf.emptyTitle': {
    en: 'No performance figures yet',
    nl: 'Nog geen prestatiecijfers',
    fr: 'Aucun chiffre de performance',
    es: 'Todavía no hay datos de rendimiento',
  },
  'pp.perf.emptyBody': {
    en: 'Once your vehicles have been booked a few times, this shows which ones earn most and which sit unused.',
    nl: 'Zodra uw voertuigen een paar keer zijn geboekt, laat dit zien welke het meest opbrengen en welke stilstaan.',
    fr: 'Une fois vos véhicules réservés plusieurs fois, cela montre lesquels rapportent le plus et lesquels restent inutilisés.',
    es: 'Cuando sus vehículos se hayan reservado varias veces, esto muestra cuáles ganan más y cuáles están parados.',
  },
  'pp.perf.intro': {
    en: 'How each vehicle is doing. All money figures are your share after commission.',
    nl: 'Hoe elk voertuig het doet. Alle bedragen zijn uw aandeel na commissie.',
    fr: 'Comment se porte chaque véhicule. Tous les montants correspondent à votre part après commission.',
    es: 'Cómo va cada vehículo. Todos los importes son su parte después de la comisión.',
  },
  'pp.perf.youEarned': {
    en: 'YOU EARNED',
    nl: 'U VERDIENDE',
    fr: 'VOUS AVEZ GAGNÉ',
    es: 'HA GANADO',
  },
  'pp.perf.afterCommission': {
    en: 'After commission',
    nl: 'Na commissie',
    fr: 'Après commission',
    es: 'Después de la comisión',
  },
  'pp.perf.bookings': {
    en: 'BOOKINGS',
    nl: 'BOEKINGEN',
    fr: 'RÉSERVATIONS',
    es: 'RESERVAS',
  },
  'pp.perf.acrossFleet': {
    en: 'Across the fleet',
    nl: 'In het hele wagenpark',
    fr: 'Sur toute la flotte',
    es: 'En toda la flota',
  },
  'pp.perf.occupancy': {
    en: 'AVERAGE OCCUPANCY',
    nl: 'GEMIDDELDE BEZETTING',
    fr: 'TAUX D’OCCUPATION MOYEN',
    es: 'OCUPACIÓN MEDIA',
  },
  'pp.perf.daysOut': {
    en: 'Days out, against days available',
    nl: 'Dagen verhuurd, tegenover dagen beschikbaar',
    fr: 'Jours loués, rapportés aux jours disponibles',
    es: 'Días alquilado, frente a días disponibles',
  },
  'pp.perf.converted': {
    en: 'ENQUIRIES CONVERTED',
    nl: 'AANVRAGEN OMGEZET',
    fr: 'DEMANDES CONVERTIES',
    es: 'CONSULTAS CONVERTIDAS',
  },
  'pp.perf.revenueByVehicle': {
    en: 'Revenue by Vehicle',
    nl: 'Omzet per voertuig',
    fr: 'Chiffre d’affaires par véhicule',
    es: 'Ingresos por vehículo',
  },
  'pp.perf.occupancyByVehicle': {
    en: 'Occupancy by Vehicle',
    nl: 'Bezetting per voertuig',
    fr: 'Occupation par véhicule',
    es: 'Ocupación por vehículo',
  },
  'pp.perf.perVehicleNote': {
    en: 'Performance for each vehicle. Enquiry figures are counts only; customer records are not shown.',
    nl: 'Prestaties per voertuig. Aanvraagcijfers zijn alleen aantallen; klantgegevens worden niet getoond.',
    fr: 'Performance de chaque véhicule. Les chiffres de demandes sont de simples nombres ; les données clients ne sont pas affichées.',
    es: 'Rendimiento de cada vehículo. Las cifras de consultas son solo cantidades; no se muestran datos de clientes.',
  },
  'pp.perf.worthALook': {
    en: 'Worth a Look',
    nl: 'De moeite waard',
    fr: 'À regarder de près',
    es: 'Merece un vistazo',
  },
  'pp.perf.countsNotPeople': {
    en: 'Enquiry Figures Are Counts, Not People',
    nl: 'Aanvraagcijfers zijn aantallen, geen personen',
    fr: 'Les chiffres de demandes sont des nombres, pas des personnes',
    es: 'Las cifras de consultas son cantidades, no personas',
  },
  'pp.perf.countsBody': {
    en: 'You can see how many people asked about a vehicle and how many went on to book it, which is what tells you whether a price is working. Who they were, and how to reach them, stays with SXM Rentals — the same rule that applies everywhere else in this dashboard.',
    nl: 'U ziet hoeveel mensen naar een voertuig hebben gevraagd en hoeveel er vervolgens hebben geboekt, en dat vertelt u of een prijs werkt. Wie zij waren, en hoe zij te bereiken zijn, blijft bij SXM Rentals — dezelfde regel die overal elders in dit dashboard geldt.',
    fr: 'Vous voyez combien de personnes se sont renseignées sur un véhicule et combien ont ensuite réservé, ce qui vous indique si un prix fonctionne. Qui elles étaient, et comment les joindre, reste chez SXM Rentals — la même règle que partout ailleurs dans ce tableau de bord.',
    es: 'Puede ver cuántas personas preguntaron por un vehículo y cuántas acabaron reservándolo, que es lo que le dice si un precio funciona. Quiénes eran, y cómo localizarlas, se queda en SXM Rentals: la misma regla que se aplica en todo este panel.',
  },

  // ---- PROMOTIONS ----
  'pp.promo.subtitle': {
    en: 'Your own discount codes, alongside any SXM Rentals runs.',
    nl: 'Uw eigen kortingscodes, naast die van SXM Rentals.',
    fr: 'Vos propres codes de réduction, à côté de ceux de SXM Rentals.',
    es: 'Sus propios códigos de descuento, junto a los de SXM Rentals.',
  },
  'pp.promo.notBuiltTitle': {
    en: 'Promotions are not built yet',
    nl: 'Acties zijn nog niet gebouwd',
    fr: 'Les promotions ne sont pas encore développées',
    es: 'Las promociones todavía no están hechas',
  },
  'pp.promo.notBuiltBody': {
    en: 'When they are, you will be able to create codes for your own vehicles — a percentage or a fixed amount off, limited by date, by vehicle, or by how many times they can be used.',
    nl: 'Wanneer dat zo is, kunt u codes maken voor uw eigen voertuigen — een percentage of een vast bedrag korting, beperkt op datum, voertuig, of aantal keer dat ze gebruikt kunnen worden.',
    fr: 'Quand elles le seront, vous pourrez créer des codes pour vos propres véhicules — un pourcentage ou un montant fixe de réduction, limité par date, par véhicule, ou par nombre d’utilisations.',
    es: 'Cuando lo estén, podrá crear códigos para sus propios vehículos: un porcentaje o un importe fijo de descuento, limitado por fecha, por vehículo o por número de usos.',
  },
  'pp.promo.decidedFirst': {
    en: 'What Has to Be Decided First',
    nl: 'Wat eerst moet worden besloten',
    fr: 'Ce qu’il faut décider d’abord',
    es: 'Lo que hay que decidir primero',
  },
  'pp.promo.hardToAccount': {
    en: 'Discounts are easy to display and difficult to account for. These three questions',
    nl: 'Kortingen zijn makkelijk te tonen en moeilijk te verantwoorden. Deze drie vragen',
    fr: 'Les remises sont faciles à afficher et difficiles à comptabiliser. Ces trois questions',
    es: 'Los descuentos son fáciles de mostrar y difíciles de contabilizar. Estas tres preguntas',
  },
  'pp.promo.marginTitle': {
    en: 'Whose margin does a discount come out of?',
    nl: 'Van wiens marge gaat een korting af?',
    fr: 'Sur quelle marge une remise est-elle imputée ?',
    es: '¿De qué margen sale un descuento?',
  },
  'pp.promo.stackTitle': {
    en: 'Can a provider code stack with a platform one?',
    nl: 'Kan een aanbiederscode worden gecombineerd met een platformcode?',
    fr: 'Un code loueur peut-il se cumuler avec un code plateforme ?',
    es: '¿Se puede combinar un código de la empresa con uno de la plataforma?',
  },
  'pp.promo.pointsTitle': {
    en: 'How do promotions interact with rewards points?',
    nl: 'Hoe verhouden acties zich tot voordeelpunten?',
    fr: 'Comment les promotions interagissent-elles avec les points de fidélité ?',
    es: '¿Cómo interactúan las promociones con los puntos de recompensa?',
  },
  'pp.promo.meantime': {
    en: 'In the Meantime',
    nl: 'In de tussentijd',
    fr: 'En attendant',
    es: 'Mientras tanto',
  },
  'pp.promo.lowerRate': {
    en: 'A lower daily rate on a vehicle that is sitting unused does the same job as a',
    nl: 'Een lager dagtarief op een voertuig dat stilstaat doet hetzelfde werk als een',
    fr: 'Un tarif journalier plus bas sur un véhicule inutilisé fait le même travail qu’un',
    es: 'Una tarifa diaria más baja en un vehículo parado hace el mismo trabajo que un',
  },

  // ---- BUSINESS PROFILE ----
  'pp.profile.title': {
    en: 'Business Profile',
    nl: 'Bedrijfsprofiel',
    fr: 'Profil de l’entreprise',
    es: 'Perfil de la empresa',
  },
  'pp.profile.subtitle': {
    en: 'What customers see about you, and the details that stay between you and SXM Rentals.',
    nl: 'Wat klanten over u zien, en de gegevens die tussen u en SXM Rentals blijven.',
    fr: 'Ce que les clients voient de vous, et les informations qui restent entre vous et SXM Rentals.',
    es: 'Lo que los clientes ven de usted, y los datos que quedan entre usted y SXM Rentals.',
  },
  'pp.profile.viewPublic': {
    en: 'View Your Public Page',
    nl: 'Uw Openbare Pagina Bekijken',
    fr: 'Voir Votre Page Publique',
    es: 'Ver Su Página Pública',
  },
  'pp.profile.whatCustomersSee': {
    en: 'What Customers See',
    nl: 'Wat klanten zien',
    fr: 'Ce que voient les clients',
    es: 'Lo que ven los clientes',
  },
  'pp.profile.appearsOnPage': {
    en: 'This appears on your public business page, next to every vehicle you list.',
    nl: 'Dit verschijnt op uw openbare bedrijfspagina, naast elk voertuig dat u plaatst.',
    fr: 'Ceci apparaît sur votre page publique, à côté de chaque véhicule que vous proposez.',
    es: 'Esto aparece en su página pública, junto a cada vehículo que publica.',
  },
  'pp.profile.description': {
    en: 'Description',
    nl: 'Omschrijving',
    fr: 'Description',
    es: 'Descripción',
  },
  'pp.profile.town': {
    en: 'Town',
    nl: 'Plaats',
    fr: 'Ville',
    es: 'Localidad',
  },
  'pp.profile.website': {
    en: 'Website',
    nl: 'Website',
    fr: 'Site web',
    es: 'Sitio web',
  },
  'pp.profile.weDeliver': {
    en: 'We Deliver Vehicles',
    nl: 'Wij bezorgen voertuigen',
    fr: 'Nous livrons les véhicules',
    es: 'Entregamos vehículos',
  },
  'pp.profile.weDeliverNote': {
    en: 'Shown on your page and used as a search filter.',
    nl: 'Wordt op uw pagina getoond en gebruikt als zoekfilter.',
    fr: 'Affiché sur votre page et utilisé comme filtre de recherche.',
    es: 'Se muestra en su página y se usa como filtro de búsqueda.',
  },
  'pp.profile.airport': {
    en: 'We Meet Customers at the Airport',
    nl: 'Wij ontmoeten klanten op het vliegveld',
    fr: 'Nous accueillons les clients à l’aéroport',
    es: 'Recibimos a los clientes en el aeropuerto',
  },
  'pp.profile.airportNote': {
    en: 'A common request from visitors arriving on a late flight.',
    nl: 'Een veelgehoorde wens van bezoekers die met een late vlucht aankomen.',
    fr: 'Une demande fréquente des visiteurs arrivant par un vol tardif.',
    es: 'Una petición habitual de los visitantes que llegan en un vuelo nocturno.',
  },
  'pp.profile.alsoPublic': {
    en: 'Also on Your Public Page',
    nl: 'Ook op uw openbare pagina',
    fr: 'Également sur votre page publique',
    es: 'También en su página pública',
  },
  'pp.profile.sideOfIsland': {
    en: 'Side of the Island',
    nl: 'Kant van het eiland',
    fr: 'Côté de l’île',
    es: 'Lado de la isla',
  },
  'pp.profile.memberSince': {
    en: 'On SXM Rentals since',
    nl: 'Op SXM Rentals sinds',
    fr: 'Sur SXM Rentals depuis',
    es: 'En SXM Rentals desde',
  },
  'pp.profile.setByUs': {
    en: 'These are set by SXM Rentals rather than by you. A rating you could edit would not be worth anything to a customer.',
    nl: 'Deze worden door SXM Rentals ingesteld en niet door u. Een beoordeling die u zelf kon aanpassen zou voor een klant niets waard zijn.',
    fr: 'Ces éléments sont définis par SXM Rentals, pas par vous. Une note que vous pourriez modifier n’aurait aucune valeur pour un client.',
    es: 'Esto lo establece SXM Rentals, no usted. Una valoración que usted pudiera editar no valdría nada para un cliente.',
  },
  'pp.profile.betweenUs': {
    en: 'Between You and SXM Rentals',
    nl: 'Tussen u en SXM Rentals',
    fr: 'Entre vous et SXM Rentals',
    es: 'Entre usted y SXM Rentals',
  },
  'pp.profile.notShownToCustomers': {
    en: 'None of this is shown to customers.',
    nl: 'Hiervan wordt niets aan klanten getoond.',
    fr: 'Rien de tout cela n’est montré aux clients.',
    es: 'Nada de esto se muestra a los clientes.',
  },
  'pp.profile.registeredName': {
    en: 'Registered name',
    nl: 'Geregistreerde naam',
    fr: 'Raison sociale',
    es: 'Nombre registrado',
  },
  'pp.profile.registeredIn': {
    en: 'Registered in',
    nl: 'Geregistreerd in',
    fr: 'Immatriculé à',
    es: 'Registrada en',
  },
  'pp.profile.registrationNumber': {
    en: 'Registration number',
    nl: 'Inschrijfnummer',
    fr: 'Numéro d’immatriculation',
    es: 'Número de registro',
  },
  'pp.profile.fleetBand': {
    en: 'Fleet size band',
    nl: 'Omvang van het wagenpark',
    fr: 'Taille de la flotte',
    es: 'Tamaño de la flota',
  },
  'pp.profile.ownSystem': {
    en: 'Your own booking system',
    nl: 'Uw eigen boekingssysteem',
    fr: 'Votre propre système de réservation',
    es: 'Su propio sistema de reservas',
  },
  'pp.profile.whereYouGetPaid': {
    en: 'Where You Get Paid',
    nl: 'Waar u betaald krijgt',
    fr: 'Où vous êtes payé',
    es: 'Dónde cobra',
  },
  'pp.profile.stripeNote': {
    en: 'Payouts go through Stripe Connect. Your bank details are given to Stripe directly and are never held by SXM Rentals — which is both safer for you and far less for us to be responsible for.',
    nl: 'Uitbetalingen lopen via Stripe Connect. Uw bankgegevens worden rechtstreeks aan Stripe gegeven en worden nooit door SXM Rentals bewaard — wat zowel veiliger is voor u als veel minder waar wij verantwoordelijk voor zijn.',
    fr: 'Les versements passent par Stripe Connect. Vos coordonnées bancaires sont transmises directement à Stripe et ne sont jamais détenues par SXM Rentals — ce qui est à la fois plus sûr pour vous et bien moins lourd de responsabilité pour nous.',
    es: 'Los pagos se hacen a través de Stripe Connect. Sus datos bancarios se entregan directamente a Stripe y SXM Rentals nunca los guarda, lo que es más seguro para usted y mucha menos responsabilidad para nosotros.',
  },
  'pp.profile.notConnected': {
    en: 'Not connected yet — payouts arrive with the backend.',
    nl: 'Nog niet gekoppeld — uitbetalingen komen met de backend.',
    fr: 'Pas encore connecté — les versements arriveront avec le backend.',
    es: 'Todavía sin conectar: los pagos llegarán con el backend.',
  },
  'pp.profile.demoNote': {
    en: 'Demo mode — changes are not saved anywhere.',
    nl: 'Demomodus — wijzigingen worden nergens opgeslagen.',
    fr: 'Mode démo — les modifications ne sont enregistrées nulle part.',
    es: 'Modo demo: los cambios no se guardan en ningún sitio.',
  },
  'pp.profile.registered': {
    en: 'REGISTERED',
    nl: 'GEREGISTREERD',
    fr: 'IMMATRICULÉ',
    es: 'REGISTRADA',
  },
  'pp.profile.beingChecked': {
    en: 'BEING CHECKED',
    nl: 'WORDT GECONTROLEERD',
    fr: 'EN COURS DE VÉRIFICATION',
    es: 'EN COMPROBACIÓN',
  },
  'pp.profile.notRegistered': {
    en: 'NOT REGISTERED',
    nl: 'NIET GEREGISTREERD',
    fr: 'NON IMMATRICULÉ',
    es: 'NO REGISTRADA',
  },

  // ---- THE BUSINESS LOGO ----
  'pp.logo.title': {
    en: 'Business Logo',
    nl: 'Bedrijfslogo',
    fr: 'Logo de l’entreprise',
    es: 'Logotipo de la empresa',
  },
  'pp.logo.body': {
    en: 'Shown on your public page and next to your name in messages. A square image works best — anything else is cropped to fit the circle.',
    nl: 'Wordt getoond op uw openbare pagina en naast uw naam in berichten. Een vierkante afbeelding werkt het beste — al het andere wordt bijgesneden om in de cirkel te passen.',
    fr: 'Affiché sur votre page publique et à côté de votre nom dans les messages. Une image carrée fonctionne le mieux — tout le reste est rogné pour tenir dans le cercle.',
    es: 'Se muestra en su página pública y junto a su nombre en los mensajes. Una imagen cuadrada funciona mejor: cualquier otra se recorta para encajar en el círculo.',
  },
  'pp.logo.fileTypes': {
    en: 'PNG, JPEG, WebP or SVG. Up to 2 MB.',
    nl: 'PNG, JPEG, WebP of SVG. Maximaal 2 MB.',
    fr: 'PNG, JPEG, WebP ou SVG. Jusqu’à 2 Mo.',
    es: 'PNG, JPEG, WebP o SVG. Hasta 2 MB.',
  },
  'pp.logo.remove': {
    en: 'Remove',
    nl: 'Verwijderen',
    fr: 'Supprimer',
    es: 'Quitar',
  },
  'pp.logo.demoNote': {
    en: 'Demo mode — the picture is shown from your own computer and is not uploaded or saved. It disappears when the page is reloaded.',
    nl: 'Demomodus — de afbeelding wordt vanaf uw eigen computer getoond en wordt niet geüpload of opgeslagen. Hij verdwijnt zodra de pagina opnieuw wordt geladen.',
    fr: 'Mode démo — l’image est affichée depuis votre propre ordinateur, elle n’est ni envoyée ni enregistrée. Elle disparaît au rechargement de la page.',
    es: 'Modo demo: la imagen se muestra desde su propio ordenador y no se sube ni se guarda. Desaparece al recargar la página.',
  },

  // ---- PROVIDER MESSAGES ----
  'pp.messages.emptyTitle': {
    en: 'No messages yet',
    nl: 'Nog geen berichten',
    fr: 'Pas encore de messages',
    es: 'Todavía no hay mensajes',
  },
  'pp.messages.emptyBody': {
    en: 'When somebody books one of your vehicles, this is where you and they arrange the collection.',
    nl: 'Wanneer iemand een van uw voertuigen boekt, regelt u hier samen het ophalen.',
    fr: 'Quand quelqu’un réserve l’un de vos véhicules, c’est ici que vous organisez ensemble le retrait.',
    es: 'Cuando alguien reserva uno de sus vehículos, aquí es donde organizan la recogida.',
  },
  'pp.messages.intro': {
    en: 'Talking to the people renting your vehicles, through SXM Rentals.',
    nl: 'Praten met de mensen die uw voertuigen huren, via SXM Rentals.',
    fr: 'Échanger avec les personnes qui louent vos véhicules, via SXM Rentals.',
    es: 'Hablar con las personas que alquilan sus vehículos, a través de SXM Rentals.',
  },

  // ---- APPLYING TO JOIN ----
  'pp.apply.title': {
    en: 'List your vehicles',
    nl: 'Plaats uw voertuigen',
    fr: 'Publier vos véhicules',
    es: 'Publique sus vehículos',
  },
  'pp.apply.subtitle': {
    en: 'For rental businesses on either side of the island. No cap on how many vehicles you can list, and no charge to join.',
    nl: 'Voor verhuurbedrijven aan beide kanten van het eiland. Geen limiet op het aantal voertuigen dat u kunt plaatsen, en geen kosten om mee te doen.',
    fr: 'Pour les loueurs des deux côtés de l’île. Aucun plafond sur le nombre de véhicules, et aucun frais d’adhésion.',
    es: 'Para empresas de alquiler de los dos lados de la isla. Sin límite de vehículos que puede publicar y sin coste por darse de alta.',
  },
  'pp.apply.yourBusiness': {
    en: 'Your Business',
    nl: 'Uw bedrijf',
    fr: 'Votre entreprise',
    es: 'Su empresa',
  },
  'pp.apply.businessName': {
    en: 'Business Name',
    nl: 'Bedrijfsnaam',
    fr: 'Nom de l’entreprise',
    es: 'Nombre de la empresa',
  },
  'pp.apply.yourName': {
    en: 'Your Name',
    nl: 'Uw naam',
    fr: 'Votre nom',
    es: 'Su nombre',
  },
  'pp.apply.whereOperate': {
    en: 'Where Do You Operate?',
    nl: 'Waar bent u actief?',
    fr: 'Où opérez-vous ?',
    es: '¿Dónde opera?',
  },
  'pp.apply.both': {
    en: 'Both',
    nl: 'Beide',
    fr: 'Les deux',
    es: 'Ambos',
  },
  'pp.apply.isRegistered': {
    en: 'Is the Business Registered?',
    nl: 'Is het bedrijf ingeschreven?',
    fr: 'L’entreprise est-elle immatriculée ?',
    es: '¿Está registrada la empresa?',
  },
  'pp.apply.notYet': {
    en: 'Not Yet',
    nl: 'Nog niet',
    fr: 'Pas encore',
    es: 'Todavía no',
  },
  'pp.apply.stillApply': {
    en: 'You can still apply, but vehicles cannot go live until the business is registered. We will talk you through what is needed on your side of the island.',
    nl: 'U kunt zich nog steeds aanmelden, maar voertuigen kunnen pas live gaan zodra het bedrijf is ingeschreven. Wij leggen u uit wat er aan uw kant van het eiland nodig is.',
    fr: 'Vous pouvez tout de même postuler, mais les véhicules ne peuvent pas être publiés tant que l’entreprise n’est pas immatriculée. Nous vous expliquerons ce qui est nécessaire de votre côté de l’île.',
    es: 'Puede solicitarlo igualmente, pero los vehículos no pueden publicarse hasta que la empresa esté registrada. Le explicaremos qué hace falta en su lado de la isla.',
  },
  'pp.apply.yourFleet': {
    en: 'Your Fleet',
    nl: 'Uw wagenpark',
    fr: 'Votre flotte',
    es: 'Su flota',
  },
  'pp.apply.howMany': {
    en: 'How Many Vehicles?',
    nl: 'Hoeveel voertuigen?',
    fr: 'Combien de véhicules ?',
    es: '¿Cuántos vehículos?',
  },
  'pp.apply.alreadySoftware': {
    en: 'Do You Already Use Booking Software?',
    nl: 'Gebruikt u al boekingssoftware?',
    fr: 'Utilisez-vous déjà un logiciel de réservation ?',
    es: '¿Ya usa algún programa de reservas?',
  },
  'pp.apply.goodConnect': {
    en: 'Good — you can connect it directly rather than entering everything twice. Your inventory and availability stay where they already are.',
    nl: 'Mooi — u kunt die direct koppelen in plaats van alles twee keer in te voeren. Uw voorraad en beschikbaarheid blijven waar ze al staan.',
    fr: 'Très bien — vous pouvez le connecter directement plutôt que de tout saisir deux fois. Votre inventaire et vos disponibilités restent là où ils sont déjà.',
    es: 'Bien: puede conectarlo directamente en lugar de introducirlo todo dos veces. Su inventario y su disponibilidad se quedan donde ya están.',
  },
  'pp.apply.anythingElse': {
    en: 'Anything Else We Should Know?',
    nl: 'Nog iets dat wij moeten weten?',
    fr: 'Autre chose à nous signaler ?',
    es: '¿Algo más que debamos saber?',
  },
  'pp.apply.howMoneyWorks': {
    en: 'How the Money Works',
    nl: 'Hoe het geld werkt',
    fr: 'Comment fonctionne l’argent',
    es: 'Cómo funciona el dinero',
  },
  'pp.apply.customerPays': {
    en: 'A customer pays',
    nl: 'Een klant betaalt',
    fr: 'Un client paie',
    es: 'Un cliente paga',
  },
  'pp.apply.youReceive': {
    en: 'You Receive',
    nl: 'U ontvangt',
    fr: 'Vous recevez',
    es: 'Usted recibe',
  },
  'pp.apply.deductionShown': {
    en: 'The deduction is shown on every payout line, so you can always check it rather than take it on trust.',
    nl: 'De inhouding staat op elke uitbetalingsregel, zodat u die altijd kunt controleren in plaats van er maar op te vertrouwen.',
    fr: 'La déduction figure sur chaque ligne de versement, pour que vous puissiez toujours la vérifier plutôt que de nous croire sur parole.',
    es: 'La deducción aparece en cada línea de pago, para que siempre pueda comprobarla en lugar de tener que fiarse.',
  },
  'pp.apply.depositsSeparate': {
    en: 'Security deposits are separate. They are held against the customer’s',
    nl: 'Borgsommen staan hier los van. Die worden gereserveerd op de kaart van de klant',
    fr: 'Les cautions sont distinctes. Elles sont bloquées sur la carte du client',
    es: 'Las fianzas van aparte. Se retienen en la tarjeta del cliente',
  },
  'pp.apply.contactNotShared': {
    en: 'Customer phone numbers and email addresses are not shared with rental businesses. You get a name, the dates, and messaging through SXM Rentals.',
    nl: 'Telefoonnummers en e-mailadressen van klanten worden niet gedeeld met verhuurbedrijven. U krijgt een naam, de data, en berichten via SXM Rentals.',
    fr: 'Les numéros de téléphone et adresses e-mail des clients ne sont pas communiqués aux loueurs. Vous recevez un nom, les dates, et la messagerie via SXM Rentals.',
    es: 'Los teléfonos y correos de los clientes no se comparten con las empresas de alquiler. Usted recibe un nombre, las fechas y la mensajería a través de SXM Rentals.',
  },
  'pp.apply.willProvideDocs': {
    en: 'I Will Provide Registration and Insurance Documents for Every Vehicle I List.',
    nl: 'Ik lever inschrijvings- en verzekeringsdocumenten voor elk voertuig dat ik plaats.',
    fr: 'Je fournirai les documents d’immatriculation et d’assurance pour chaque véhicule que je publie.',
    es: 'Aportaré los documentos de matriculación y seguro de cada vehículo que publique.',
  },
  'pp.apply.agreeTerms': {
    en: 'I Agree to the Rental Provider Terms and the Provider Commission and Payout Agreement.',
    nl: 'Ik ga akkoord met de Voorwaarden voor Verhuuraanbieders en de Commissie- en Uitbetalingsovereenkomst.',
    fr: 'J’accepte les Conditions Loueur et l’Accord de Commission et de Versement.',
    es: 'Acepto las Condiciones para Empresas de Alquiler y el Acuerdo de Comisión y Pagos.',
  },
  'pp.apply.send': {
    en: 'Send Application',
    nl: 'Aanvraag Versturen',
    fr: 'Envoyer la Candidature',
    es: 'Enviar Solicitud',
  },
  'pp.apply.received': {
    en: 'Application received',
    nl: 'Aanvraag ontvangen',
    fr: 'Candidature reçue',
    es: 'Solicitud recibida',
  },
  'pp.apply.inTouch': {
    en: 'We will be in touch within a couple of working days to check your registration and arrange the vehicle documents.',
    nl: 'Wij nemen binnen een paar werkdagen contact op om uw inschrijving te controleren en de voertuigdocumenten te regelen.',
    fr: 'Nous vous contacterons sous quelques jours ouvrés pour vérifier votre immatriculation et organiser les documents des véhicules.',
    es: 'Nos pondremos en contacto en un par de días laborables para comprobar su registro y organizar los documentos de los vehículos.',
  },
  'pp.apply.whatNext': {
    en: 'What Happens Next',
    nl: 'Wat er nu gebeurt',
    fr: 'Ce qui se passe ensuite',
    es: 'Qué pasa ahora',
  },
  'pp.apply.step1Title': {
    en: 'We check your business registration',
    nl: 'Wij controleren uw bedrijfsinschrijving',
    fr: 'Nous vérifions l’immatriculation de votre entreprise',
    es: 'Comprobamos el registro de su empresa',
  },
  'pp.apply.step1Body': {
    en: 'Confirming the company is real and trading. Usually a day or two.',
    nl: 'Bevestigen dat het bedrijf echt bestaat en actief is. Meestal een dag of twee.',
    fr: 'Nous confirmons que l’entreprise existe et est en activité. Un ou deux jours en général.',
    es: 'Confirmamos que la empresa existe y está en activo. Normalmente uno o dos días.',
  },
  'pp.apply.step2Title': {
    en: 'You send your vehicle documents',
    nl: 'U stuurt uw voertuigdocumenten',
    fr: 'Vous envoyez les documents de vos véhicules',
    es: 'Usted envía los documentos de sus vehículos',
  },
  'pp.apply.step2Body': {
    en: 'Registration and insurance for each vehicle. This is what the SXM Verified badge actually stands for.',
    nl: 'Inschrijving en verzekering voor elk voertuig. Daar staat het SXM Verified-label werkelijk voor.',
    fr: 'Immatriculation et assurance pour chaque véhicule. C’est ce que le badge SXM Verified représente réellement.',
    es: 'Matriculación y seguro de cada vehículo. Eso es lo que realmente representa la insignia SXM Verified.',
  },
  'pp.apply.step3Title': {
    en: 'You add your fleet and go live',
    nl: 'U voegt uw wagenpark toe en gaat live',
    fr: 'Vous ajoutez votre flotte et passez en ligne',
    es: 'Añade su flota y se publica',
  },
  'pp.apply.step3Body': {
    en: 'One at a time, from a spreadsheet, or connected straight to your own booking system.',
    nl: 'Eén voor één, vanuit een spreadsheet, of direct gekoppeld aan uw eigen boekingssysteem.',
    fr: 'Un par un, depuis un tableur, ou directement connecté à votre propre système de réservation.',
    es: 'Uno a uno, desde una hoja de cálculo, o conectado directamente a su propio sistema de reservas.',
  },
  'pp.apply.demoNote': {
    en: 'Demo mode — nothing has actually been sent.',
    nl: 'Demomodus — er is niets daadwerkelijk verstuurd.',
    fr: 'Mode démo — rien n’a réellement été envoyé.',
    es: 'Modo demo: no se ha enviado nada de verdad.',
  },
  'pp.apply.seeDashboard': {
    en: 'See the Dashboard',
    nl: 'Het Dashboard Bekijken',
    fr: 'Voir le Tableau de Bord',
    es: 'Ver el Panel',
  },
  'pp.apply.backHome': {
    en: 'Back to the Homepage',
    nl: 'Terug naar de Startpagina',
    fr: 'Retour à l’Accueil',
    es: 'Volver a la Página de Inicio',
  },
  // ---- GENERAL SETTINGS ----
  // Separate from the business profile. The profile is what customers see; this
  // is how the dashboard behaves for whoever is looking at it.
  'pp.settings.title': {
    en: 'Settings',
    nl: 'Instellingen',
    fr: 'Réglages',
    es: 'Ajustes',
  },
  'pp.settings.subtitle': {
    en: 'How the dashboard looks and reads, and what we email you about.',
    nl: 'Hoe het dashboard eruitziet en leest, en waarover wij u mailen.',
    fr: 'L’apparence et la langue du tableau de bord, et les e-mails que nous vous envoyons.',
    es: 'Cómo se ve y se lee el panel, y sobre qué le escribimos.',
  },
  'pp.settings.themeNote': {
    en: 'Match my computer follows whatever your laptop is set to, and changes with it. Your choice is remembered on this browser.',
    nl: 'Volg mijn computer volgt de instelling van uw laptop en verandert mee. Uw keuze wordt in deze browser onthouden.',
    fr: 'Suivre mon ordinateur reprend le réglage de votre machine et change avec lui. Votre choix est mémorisé dans ce navigateur.',
    es: 'Seguir a mi ordenador usa la configuración de su equipo y cambia con ella. Su elección se recuerda en este navegador.',
  },
  'pp.settings.languageNote': {
    en: 'The dashboard and the customer side both change. Your public page and your vehicle descriptions stay in whatever language you wrote them.',
    nl: 'Zowel het dashboard als de klantkant verandert mee. Uw openbare pagina en uw voertuigomschrijvingen blijven in de taal waarin u ze heeft geschreven.',
    fr: 'Le tableau de bord et le côté client changent tous les deux. Votre page publique et vos descriptions de véhicules restent dans la langue où vous les avez écrites.',
    es: 'Cambian tanto el panel como el lado del cliente. Su página pública y las descripciones de sus vehículos se quedan en el idioma en que las escribió.',
  },
  'pp.settings.emailsTitle': {
    en: 'What we email you about',
    nl: 'Waarover wij u mailen',
    fr: 'Les e-mails que nous vous envoyons',
    es: 'Sobre qué le escribimos',
  },
  'pp.settings.newBooking': {
    en: 'A new booking',
    nl: 'Een nieuwe boeking',
    fr: 'Une nouvelle réservation',
    es: 'Una reserva nueva',
  },
  'pp.settings.newBookingBody': {
    en: 'Sent the moment somebody books one of your vehicles, with the dates and who is collecting it.',
    nl: 'Wordt verstuurd zodra iemand een van uw voertuigen boekt, met de data en wie het ophaalt.',
    fr: 'Envoyé dès que quelqu’un réserve un de vos véhicules, avec les dates et qui vient le récupérer.',
    es: 'Se envía en cuanto alguien reserva uno de sus vehículos, con las fechas y quién lo recoge.',
  },
  'pp.settings.cancellation': {
    en: 'A cancellation',
    nl: 'Een annulering',
    fr: 'Une annulation',
    es: 'Una cancelación',
  },
  'pp.settings.cancellationBody': {
    en: 'So a vehicle you thought was booked does not sit idle without you noticing.',
    nl: 'Zodat een voertuig waarvan u dacht dat het geboekt was niet ongemerkt stilstaat.',
    fr: 'Pour qu’un véhicule que vous pensiez réservé ne reste pas immobilisé sans que vous le sachiez.',
    es: 'Para que un vehículo que creía reservado no se quede parado sin que se entere.',
  },
  'pp.settings.payoutSent': {
    en: 'A payout on its way',
    nl: 'Een uitbetaling onderweg',
    fr: 'Un versement en route',
    es: 'Un pago en camino',
  },
  'pp.settings.payoutSentBody': {
    en: 'What customers paid, the commission taken, and what is arriving in your account.',
    nl: 'Wat klanten betaalden, de ingehouden commissie, en wat er op uw rekening komt.',
    fr: 'Ce que les clients ont payé, la commission prélevée, et ce qui arrive sur votre compte.',
    es: 'Lo que pagaron los clientes, la comisión aplicada y lo que llega a su cuenta.',
  },
  'pp.settings.newMessage': {
    en: 'A message from a renter',
    nl: 'Een bericht van een huurder',
    fr: 'Un message d’un locataire',
    es: 'Un mensaje de un cliente',
  },
  'pp.settings.newMessageBody': {
    en: 'Somebody asking about a collection is usually asking on the day, so this one is worth leaving on.',
    nl: 'Iemand die naar het ophalen vraagt, doet dat meestal op de dag zelf — deze kunt u beter aan laten staan.',
    fr: 'Quelqu’un qui pose une question sur le retrait le fait généralement le jour même : mieux vaut laisser celui-ci activé.',
    es: 'Quien pregunta por una recogida suele hacerlo el mismo día, así que conviene dejar este activado.',
  },
  'pp.settings.accountTitle': {
    en: 'This account',
    nl: 'Dit account',
    fr: 'Ce compte',
    es: 'Esta cuenta',
  },
  'pp.settings.closeNote': {
    en: 'Closing a business account is not something you can do here, and that is deliberate — there may be live bookings, a deposit held against somebody’s card, and a payout still owed to you. Message SXM Rentals and we will work through those with you first.',
    nl: 'Een zakelijk account sluiten kan hier niet, en dat is bewust — er kunnen lopende boekingen zijn, een borgsom die op iemands kaart staat, en een uitbetaling die u nog tegoed heeft. Stuur SXM Rentals een bericht, dan lopen wij die eerst met u door.',
    fr: 'Fermer un compte professionnel ne se fait pas ici, et c’est délibéré : il peut rester des réservations en cours, une caution bloquée sur la carte de quelqu’un, et un versement qui vous est dû. Écrivez à SXM Rentals et nous verrons cela avec vous d’abord.',
    es: 'Cerrar una cuenta de empresa no se puede hacer aquí, y es a propósito: puede haber reservas en curso, una fianza retenida en la tarjeta de alguien y un pago que aún se le debe. Escriba a SXM Rentals y lo revisaremos con usted primero.',
  },
  'pp.settings.contactUs': {
    en: 'Message SXM Rentals',
    nl: 'Bericht SXM Rentals',
    fr: 'Écrire à SXM Rentals',
    es: 'Escribir a SXM Rentals',
  },
} satisfies Record<string, Phrase>;
