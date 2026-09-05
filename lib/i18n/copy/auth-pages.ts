// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every word on the sign-in, sign-up and identity-check
// pages, in all four languages.
//
// THESE PAGES ASK PEOPLE FOR THEIR PASSPORT, and that is the whole reason to
// translate them carefully. Somebody is being asked to photograph a legal
// document and send it to a company they have not used before. Every sentence
// explaining why, what happens to it, and who can see it has to land in the
// language they actually think in — a half-translated identity check is a
// request to trust a stranger, written in a stranger's language.
//
// THE ERROR MESSAGES FOR THE CAMERA are here in full for the same reason. They
// are the difference between "this site is broken" and "my browser blocked the
// camera and here is the icon to click".

import type { Phrase } from './types';

export const authPages = {
  // ---- SIGNING IN ----
  'authp.login.title': {
    en: 'Welcome back',
    nl: 'Welkom terug',
    fr: 'Bon retour',
    es: 'Bienvenido de nuevo',
  },
  'authp.login.subtitle': {
    en: 'Sign in to see your rentals, messages and documents.',
    nl: 'Log in om uw huurauto’s, berichten en documenten te zien.',
    fr: 'Connectez-vous pour voir vos locations, vos messages et vos documents.',
    es: 'Inicie sesión para ver sus alquileres, mensajes y documentos.',
  },
  'authp.login.withApple': {
    en: 'Continue with Apple',
    nl: 'Doorgaan met Apple',
    fr: 'Continuer avec Apple',
    es: 'Continuar con Apple',
  },
  'authp.login.withGoogle': {
    en: 'Continue with Google',
    nl: 'Doorgaan met Google',
    fr: 'Continuer avec Google',
    es: 'Continuar con Google',
  },
  'authp.login.passwordPlaceholder': {
    en: 'Your password',
    nl: 'Uw wachtwoord',
    fr: 'Votre mot de passe',
    es: 'Su contraseña',
  },
  'authp.login.forgotten': {
    en: 'Forgotten your password?',
    nl: 'Wachtwoord vergeten?',
    fr: 'Mot de passe oublié ?',
    es: '¿Ha olvidado su contraseña?',
  },
  'authp.login.demoNote': {
    en: 'Demo mode — no password is checked and any email address will work. Real sign-in arrives with the backend.',
    nl: 'Demomodus — er wordt geen wachtwoord gecontroleerd en elk e-mailadres werkt. Echt inloggen komt met de backend.',
    fr: 'Mode démo — aucun mot de passe n’est vérifié et n’importe quelle adresse fonctionne. La vraie connexion arrivera avec le backend.',
    es: 'Modo demo: no se comprueba ninguna contraseña y sirve cualquier correo. El inicio de sesión real llegará con el backend.',
  },

  // ---- CREATING AN ACCOUNT ----
  'authp.signup.title': {
    en: 'Create your account',
    nl: 'Maak uw account aan',
    fr: 'Créez votre compte',
    es: 'Cree su cuenta',
  },
  'authp.signup.subtitle': {
    en: 'Just enough to get started. The licence and identity check come later, once you actually need them.',
    nl: 'Net genoeg om te beginnen. De rijbewijs- en identiteitscontrole volgen later, wanneer u ze werkelijk nodig heeft.',
    fr: 'Juste de quoi commencer. Le contrôle du permis et de l’identité viendra plus tard, quand vous en aurez vraiment besoin.',
    es: 'Solo lo justo para empezar. La comprobación del carné y la identidad viene después, cuando de verdad haga falta.',
  },
  'authp.signup.firstNamePlaceholder': {
    en: 'As it appears on your licence',
    nl: 'Zoals op uw rijbewijs staat',
    fr: 'Tel qu’il figure sur votre permis',
    es: 'Tal como aparece en su carné',
  },
  'authp.signup.consent': {
    en: 'I Agree to the Terms of Service and the Privacy Policy.',
    nl: 'Ik ga akkoord met de Servicevoorwaarden en het Privacybeleid.',
    fr: 'J’accepte les Conditions d’Utilisation et la Politique de Confidentialité.',
    es: 'Acepto las Condiciones del Servicio y la Política de Privacidad.',
  },
  'authp.signup.cta': {
    en: 'Create Account',
    nl: 'Account Aanmaken',
    fr: 'Créer un Compte',
    es: 'Crear Cuenta',
  },
  'authp.signup.demoNote': {
    en: 'Demo mode — nothing is really created, and no email is sent.',
    nl: 'Demomodus — er wordt niets echt aangemaakt en er wordt geen e-mail verzonden.',
    fr: 'Mode démo — rien n’est réellement créé, et aucun e-mail n’est envoyé.',
    es: 'Modo demo: no se crea nada de verdad y no se envía ningún correo.',
  },

  // ---- RESETTING A PASSWORD ----
  'authp.reset.title': {
    en: 'Reset your password',
    nl: 'Wachtwoord opnieuw instellen',
    fr: 'Réinitialiser votre mot de passe',
    es: 'Restablecer su contraseña',
  },
  'authp.reset.subtitle': {
    en: 'Tell us the email address on your account and we will send a link to set a new password.',
    nl: 'Geef het e-mailadres van uw account op en wij sturen een link om een nieuw wachtwoord in te stellen.',
    fr: 'Indiquez l’adresse e-mail de votre compte et nous vous enverrons un lien pour définir un nouveau mot de passe.',
    es: 'Díganos el correo electrónico de su cuenta y le enviaremos un enlace para poner una contraseña nueva.',
  },
  'authp.reset.send': {
    en: 'Send the Link',
    nl: 'Stuur de Link',
    fr: 'Envoyer le Lien',
    es: 'Enviar el Enlace',
  },
  'authp.reset.checkInbox': {
    en: 'Check your inbox',
    nl: 'Controleer uw inbox',
    fr: 'Vérifiez votre boîte de réception',
    es: 'Revise su bandeja de entrada',
  },
  'authp.reset.spamNote': {
    en: 'Nothing in the inbox? Look in the spam folder, and check the address above for a typo. Demo mode — no email has actually been sent.',
    nl: 'Niets in de inbox? Kijk in de map ongewenste e-mail en controleer het adres hierboven op een typefout. Demomodus — er is geen e-mail verstuurd.',
    fr: 'Rien dans la boîte de réception ? Regardez dans les indésirables, et vérifiez l’adresse ci-dessus. Mode démo — aucun e-mail n’a réellement été envoyé.',
    es: '¿No hay nada en la bandeja? Mire en la carpeta de spam y compruebe que la dirección de arriba no tenga una errata. Modo demo: no se ha enviado ningún correo.',
  },
  'authp.reset.backToSignIn': {
    en: 'Back to Sign In',
    nl: 'Terug naar Inloggen',
    fr: 'Retour à la Connexion',
    es: 'Volver a Iniciar Sesión',
  },
  'authp.reset.differentAddress': {
    en: 'Try a Different Address',
    nl: 'Een Ander Adres Proberen',
    fr: 'Essayer une Autre Adresse',
    es: 'Probar Otra Dirección',
  },

  // ---- PHONE NUMBER ----
  'authp.phone.title': {
    en: 'Your phone number',
    nl: 'Uw telefoonnummer',
    fr: 'Votre numéro de téléphone',
    es: 'Su número de teléfono',
  },
  'authp.phone.subtitle': {
    en: 'Used to confirm it is really you, and so a rental business can reach you about a collection if something changes on the day.',
    nl: 'Wordt gebruikt om te bevestigen dat u het echt bent, en zodat een verhuurbedrijf u kan bereiken over het ophalen als er die dag iets verandert.',
    fr: 'Utilisé pour confirmer que c’est bien vous, et pour qu’un loueur puisse vous joindre au sujet du retrait si quelque chose change le jour même.',
    es: 'Se usa para confirmar que es usted, y para que una empresa de alquiler pueda localizarle por la recogida si algo cambia ese día.',
  },
  'authp.phone.diallingCode': {
    en: 'Dialling Code',
    nl: 'Landnummer',
    fr: 'Indicatif',
    es: 'Prefijo',
  },
  'authp.phone.send': {
    en: 'Send Me a Code',
    nl: 'Stuur Mij een Code',
    fr: 'M’envoyer un Code',
    es: 'Enviarme un Código',
  },
  'authp.phone.privacyNote': {
    en: 'Your number is never shown to rental businesses. They talk to you through SXM Rentals messages instead.',
    nl: 'Uw nummer wordt nooit aan verhuurbedrijven getoond. Zij praten in plaats daarvan met u via de berichten van SXM Rentals.',
    fr: 'Votre numéro n’est jamais communiqué aux loueurs. Ils vous parlent via la messagerie SXM Rentals.',
    es: 'Su número nunca se muestra a las empresas de alquiler. Hablan con usted a través de los mensajes de SXM Rentals.',
  },
  'authp.phone.skip': {
    en: 'Skip for Now',
    nl: 'Nu Overslaan',
    fr: 'Passer pour l’Instant',
    es: 'Omitir por Ahora',
  },

  // ---- THE CODE ----
  'authp.otp.title': {
    en: 'Enter the code',
    nl: 'Voer de code in',
    fr: 'Saisissez le code',
    es: 'Introduzca el código',
  },
  'authp.otp.subtitle': {
    en: 'We sent a six-digit code by text message. It is good for ten minutes.',
    nl: 'Wij hebben een code van zes cijfers per sms gestuurd. Die is tien minuten geldig.',
    fr: 'Nous avons envoyé un code à six chiffres par SMS. Il est valable dix minutes.',
    es: 'Hemos enviado un código de seis dígitos por SMS. Es válido diez minutos.',
  },
  'authp.otp.boxLabel': {
    en: 'The Six-digit Code from Your Text Message',
    nl: 'De code van zes cijfers uit uw sms',
    fr: 'Le code à six chiffres reçu par SMS',
    es: 'El código de seis dígitos de su SMS',
  },
  'authp.otp.resend': {
    en: 'Send It Again',
    nl: 'Opnieuw Versturen',
    fr: 'Renvoyer',
    es: 'Enviarlo Otra Vez',
  },
  'authp.otp.demoNote': {
    en: 'Demo mode — no message has been sent, and any six digits will be accepted.',
    nl: 'Demomodus — er is geen bericht verstuurd en elke zes cijfers worden geaccepteerd.',
    fr: 'Mode démo — aucun message n’a été envoyé, et six chiffres quelconques seront acceptés.',
    es: 'Modo demo: no se ha enviado ningún mensaje y se aceptan seis dígitos cualesquiera.',
  },

  // ---- LOCAL OR VISITING ----
  'authp.type.title': {
    en: 'Do you live on the island?',
    nl: 'Woont u op het eiland?',
    fr: 'Vivez-vous sur l’île ?',
    es: '¿Vive en la isla?',
  },
  'authp.type.subtitle': {
    en: 'This decides which documents we ask for. Nothing else about your account changes, and the price of a rental is the same either way.',
    nl: 'Dit bepaalt welke documenten wij vragen. Verder verandert er niets aan uw account, en de huurprijs is in beide gevallen hetzelfde.',
    fr: 'Cela détermine les documents que nous demandons. Rien d’autre ne change dans votre compte, et le prix d’une location est le même dans les deux cas.',
    es: 'Esto determina qué documentos le pedimos. Nada más de su cuenta cambia, y el precio del alquiler es el mismo en ambos casos.',
  },
  'authp.type.local': {
    en: 'I live here',
    nl: 'Ik woon hier',
    fr: 'J’habite ici',
    es: 'Vivo aquí',
  },
  'authp.type.localBlurb': {
    en: 'A resident of Sint Maarten or Saint-Martin, either side of the island.',
    nl: 'Inwoner van Sint Maarten of Saint-Martin, aan beide kanten van het eiland.',
    fr: 'Résident de Saint-Martin ou de Sint Maarten, de l’un ou l’autre côté de l’île.',
    es: 'Residente de Sint Maarten o Saint-Martin, en cualquiera de los dos lados.',
  },
  'authp.type.visiting': {
    en: 'I am visiting',
    nl: 'Ik ben op bezoek',
    fr: 'Je suis de passage',
    es: 'Estoy de visita',
  },
  'authp.type.visitingBlurb': {
    en: 'Here on holiday or for work, and driving while you are on the island.',
    nl: 'Hier op vakantie of voor werk, en u rijdt tijdens uw verblijf op het eiland.',
    fr: 'Ici en vacances ou pour le travail, et vous conduirez pendant votre séjour.',
    es: 'Aquí de vacaciones o por trabajo, y conducirá mientras esté en la isla.',
  },
  'authp.type.whatWeAsk': {
    en: 'WHAT WE WILL ASK FOR',
    nl: 'WAT WIJ ZULLEN VRAGEN',
    fr: 'CE QUE NOUS DEMANDERONS',
    es: 'LO QUE LE PEDIREMOS',
  },
  'authp.type.islanderNote': {
    en: 'Residents get Islander status once their documents are accepted. It recognises living here — it is not a reward tier, cannot be earned by renting, and gives no discount on its own.',
    nl: 'Inwoners krijgen de Islander-status zodra hun documenten zijn geaccepteerd. Die erkent dat u hier woont — het is geen voordeelniveau, u kunt het niet verdienen door te huren, en het geeft op zichzelf geen korting.',
    fr: 'Les résidents obtiennent le statut Islander une fois leurs documents acceptés. Il reconnaît le fait de vivre ici — ce n’est pas un niveau de fidélité, il ne se gagne pas en louant, et il ne donne aucune remise en lui-même.',
    es: 'Los residentes obtienen el estado Islander cuando se aceptan sus documentos. Reconoce que usted vive aquí: no es un nivel de recompensas, no se gana alquilando y por sí solo no da ningún descuento.',
  },

  // ---- THE PHOTO OF YOU ----
  'authp.selfie.title': {
    en: 'A Photo of You',
    nl: 'Een foto van u',
    fr: 'Une photo de vous',
    es: 'Una foto suya',
  },
  'authp.selfie.subtitle': {
    en: 'This gets compared against the photo on your document, so we know the person holding it is the person in it. Good light, no hat, no sunglasses.',
    nl: 'Deze wordt vergeleken met de foto op uw document, zodat wij weten dat degene die het vasthoudt ook degene op de foto is. Goed licht, geen hoed, geen zonnebril.',
    fr: 'Elle est comparée à la photo de votre document, pour que nous sachions que la personne qui le présente est bien celle qui y figure. Bonne lumière, pas de chapeau, pas de lunettes de soleil.',
    es: 'Se compara con la foto de su documento, para saber que quien lo tiene es la persona que aparece en él. Buena luz, sin gorra y sin gafas de sol.',
  },
  'authp.selfie.take': {
    en: 'Take the Photo',
    nl: 'Foto Maken',
    fr: 'Prendre la Photo',
    es: 'Hacer la Foto',
  },
  'authp.selfie.use': {
    en: 'Use This Photo',
    nl: 'Deze Foto Gebruiken',
    fr: 'Utiliser Cette Photo',
    es: 'Usar Esta Foto',
  },
  'authp.selfie.retake': {
    en: 'Take It Again',
    nl: 'Opnieuw Maken',
    fr: 'La Reprendre',
    es: 'Hacerla Otra Vez',
  },
  'authp.selfie.turnOn': {
    en: 'Turn On the Camera',
    nl: 'Camera Inschakelen',
    fr: 'Activer la Caméra',
    es: 'Encender la Cámara',
  },
  'authp.selfie.uploadInstead': {
    en: 'Upload a Photo Instead',
    nl: 'In Plaats Daarvan een Foto Uploaden',
    fr: 'Envoyer une Photo à la Place',
    es: 'Subir una Foto en su Lugar',
  },
  'authp.selfie.blockedTitle': {
    en: 'The camera was blocked',
    nl: 'De camera is geblokkeerd',
    fr: 'La caméra a été bloquée',
    es: 'La cámara está bloqueada',
  },
  'authp.selfie.blockedBody': {
    en: 'Your browser refused access. Click the camera icon in the address bar and allow it, then try again — or upload a photo instead.',
    nl: 'Uw browser weigerde toegang. Klik op het camerapictogram in de adresbalk en sta het toe, probeer het dan opnieuw — of upload in plaats daarvan een foto.',
    fr: 'Votre navigateur a refusé l’accès. Cliquez sur l’icône de caméra dans la barre d’adresse et autorisez-la, puis réessayez — ou envoyez plutôt une photo.',
    es: 'Su navegador ha denegado el acceso. Pulse el icono de la cámara en la barra de direcciones y permítalo, luego inténtelo de nuevo, o suba una foto en su lugar.',
  },
  'authp.selfie.noneTitle': {
    en: 'No camera found',
    nl: 'Geen camera gevonden',
    fr: 'Aucune caméra détectée',
    es: 'No se ha encontrado ninguna cámara',
  },
  'authp.selfie.noneBody': {
    en: 'This computer does not seem to have a camera available. Uploading a photo works just as well.',
    nl: 'Deze computer lijkt geen camera beschikbaar te hebben. Een foto uploaden werkt net zo goed.',
    fr: 'Cet ordinateur ne semble pas avoir de caméra disponible. Envoyer une photo fonctionne tout aussi bien.',
    es: 'Este ordenador no parece tener ninguna cámara disponible. Subir una foto funciona igual de bien.',
  },
  'authp.selfie.busyTitle': {
    en: 'The camera is already in use',
    nl: 'De camera is al in gebruik',
    fr: 'La caméra est déjà utilisée',
    es: 'La cámara ya está en uso',
  },
  'authp.selfie.busyBody': {
    en: 'Another program has hold of it — a video call, usually. Close that and try again, or upload a photo instead.',
    nl: 'Een ander programma gebruikt hem — meestal een videogesprek. Sluit dat en probeer het opnieuw, of upload in plaats daarvan een foto.',
    fr: 'Un autre programme l’utilise — un appel vidéo, en général. Fermez-le et réessayez, ou envoyez plutôt une photo.',
    es: 'Otro programa la está usando, normalmente una videollamada. Ciérrelo e inténtelo de nuevo, o suba una foto.',
  },
  'authp.selfie.demoNote': {
    en: 'Demo mode — nothing is captured, stored or sent anywhere. In the finished site this goes straight to the identity service, encrypted, and rental businesses never see it.',
    nl: 'Demomodus — er wordt niets vastgelegd, opgeslagen of verzonden. In de definitieve site gaat dit versleuteld rechtstreeks naar de identiteitsdienst, en verhuurbedrijven zien het nooit.',
    fr: 'Mode démo — rien n’est capturé, stocké ni envoyé. Sur le site final, cela va directement au service d’identité, chiffré, et les loueurs ne le voient jamais.',
    es: 'Modo demo: no se captura, guarda ni envía nada. En el sitio final esto va cifrado directamente al servicio de identidad, y las empresas de alquiler nunca lo ven.',
  },

  // ---- THE DOCUMENTS ----
  'authp.id.title': {
    en: 'Your documents',
    nl: 'Uw documenten',
    fr: 'Vos documents',
    es: 'Sus documentos',
  },
  'authp.id.subtitle': {
    en: 'We need your driving licence, and one document proving who you are. Drag them in from your computer, or take a photo.',
    nl: 'Wij hebben uw rijbewijs nodig en één document dat aantoont wie u bent. Sleep ze vanaf uw computer hierheen, of maak een foto.',
    fr: 'Il nous faut votre permis de conduire et un document prouvant votre identité. Glissez-les depuis votre ordinateur, ou prenez une photo.',
    es: 'Necesitamos su carné de conducir y un documento que acredite quién es. Arrástrelos desde su ordenador o haga una foto.',
  },
  'authp.id.bothSides': {
    en: 'Both sides, as two files or two photos.',
    nl: 'Beide zijden, als twee bestanden of twee foto’s.',
    fr: 'Les deux faces, en deux fichiers ou deux photos.',
    es: 'Las dos caras, como dos archivos o dos fotos.',
  },
  'authp.id.passportTitle': {
    en: 'Passport or local ID',
    nl: 'Paspoort of lokaal ID',
    fr: 'Passeport ou pièce d’identité locale',
    es: 'Pasaporte o identificación local',
  },
  'authp.id.passportBlurb': {
    en: 'The photo page, or both sides of a local ID card.',
    nl: 'De pagina met de foto, of beide zijden van een lokale ID-kaart.',
    fr: 'La page photo, ou les deux faces d’une carte d’identité locale.',
    es: 'La página de la foto, o las dos caras de una tarjeta de identidad local.',
  },
  'authp.id.whichDocument': {
    en: 'Which Document',
    nl: 'Welk document',
    fr: 'Quel document',
    es: 'Qué documento',
  },
  'authp.id.howToSend': {
    en: 'How to Send It',
    nl: 'Hoe u het verstuurt',
    fr: 'Comment l’envoyer',
    es: 'Cómo enviarlo',
  },
  'authp.id.uploadFile': {
    en: 'Upload a File',
    nl: 'Bestand uploaden',
    fr: 'Envoyer un fichier',
    es: 'Subir un archivo',
  },
  'authp.id.useWebcam': {
    en: 'Use the Webcam',
    nl: 'Webcam gebruiken',
    fr: 'Utiliser la webcam',
    es: 'Usar la cámara',
  },
  'authp.id.fileTypes': {
    en: 'A photo, a scan or a PDF. Up to 10 MB each.',
    nl: 'Een foto, een scan of een pdf. Maximaal 10 MB per stuk.',
    fr: 'Une photo, un scan ou un PDF. Jusqu’à 10 Mo chacun.',
    es: 'Una foto, un escaneo o un PDF. Hasta 10 MB cada uno.',
  },
  'authp.id.webcamWarning': {
    en: 'Holding a document up to a laptop webcam is awkward and the result is usually blurred, which is the most common reason a check is refused. Uploading a photo or scan is far more likely to be accepted first time.',
    nl: 'Een document voor de webcam van een laptop houden is onhandig en het resultaat is meestal wazig, wat de meest voorkomende reden is dat een controle wordt afgewezen. Een foto of scan uploaden wordt veel vaker in één keer geaccepteerd.',
    fr: 'Tenir un document devant la webcam d’un portable est peu pratique et le résultat est généralement flou, ce qui est la raison la plus fréquente de refus d’une vérification. Envoyer une photo ou un scan a bien plus de chances d’être accepté du premier coup.',
    es: 'Sostener un documento delante de la cámara del portátil es incómodo y el resultado suele salir borroso, que es el motivo más frecuente de que se rechace una comprobación. Subir una foto o un escaneo tiene muchas más probabilidades de aceptarse a la primera.',
  },
  'authp.id.openAnyway': {
    en: 'Open the Camera Anyway',
    nl: 'Camera Toch Openen',
    fr: 'Ouvrir Quand Même la Caméra',
    es: 'Abrir la Cámara de Todos Modos',
  },
  'authp.id.firstTime': {
    en: 'Getting It Accepted First Time',
    nl: 'In één keer goedgekeurd worden',
    fr: 'Le faire accepter du premier coup',
    es: 'Que lo acepten a la primera',
  },
  'authp.id.demoNote': {
    en: 'Demo mode — files chosen here never leave your computer. In the finished site they go encrypted to the identity service, are stored separately from everything else, and are never shown to rental businesses.',
    nl: 'Demomodus — hier gekozen bestanden verlaten uw computer nooit. In de definitieve site gaan ze versleuteld naar de identiteitsdienst, worden ze apart van al het andere bewaard, en worden ze nooit aan verhuurbedrijven getoond.',
    fr: 'Mode démo — les fichiers choisis ici ne quittent jamais votre ordinateur. Sur le site final, ils sont transmis chiffrés au service d’identité, conservés séparément de tout le reste, et ne sont jamais montrés aux loueurs.',
    es: 'Modo demo: los archivos que elija aquí nunca salen de su ordenador. En el sitio final se envían cifrados al servicio de identidad, se guardan aparte de todo lo demás y nunca se muestran a las empresas de alquiler.',
  },

  // ---- THE FOUR ANSWERS ----
  'authp.status.startTitle': {
    en: 'Prove who you are',
    nl: 'Toon aan wie u bent',
    fr: 'Prouvez votre identité',
    es: 'Demuestre quién es',
  },
  'authp.status.startBody': {
    en: 'Before your first booking we need to check your licence and confirm who you are. It takes a few minutes and only has to be done once — every rental after this one skips it.',
    nl: 'Voor uw eerste boeking moeten wij uw rijbewijs controleren en vaststellen wie u bent. Het duurt een paar minuten en hoeft maar één keer — elke huur daarna slaat dit over.',
    fr: 'Avant votre première réservation, nous devons vérifier votre permis et confirmer votre identité. Cela prend quelques minutes et ne se fait qu’une fois — toutes les locations suivantes sautent cette étape.',
    es: 'Antes de su primera reserva tenemos que comprobar su carné y confirmar quién es. Lleva unos minutos y solo hay que hacerlo una vez: todos los alquileres siguientes se lo saltan.',
  },
  'authp.status.pendingTitle': {
    en: 'We are checking your documents',
    nl: 'Wij controleren uw documenten',
    fr: 'Nous vérifions vos documents',
    es: 'Estamos revisando sus documentos',
  },
  'authp.status.pendingBody': {
    en: 'Most checks come back within a few minutes; some take up to a day. You do not have to wait here — carry on browsing and we will let you know.',
    nl: 'De meeste controles zijn binnen enkele minuten klaar; sommige duren tot een dag. U hoeft hier niet te wachten — kijk gerust verder, wij laten het weten.',
    fr: 'La plupart des vérifications aboutissent en quelques minutes ; certaines prennent jusqu’à un jour. Vous n’avez pas à attendre ici — continuez à naviguer, nous vous préviendrons.',
    es: 'La mayoría de las comprobaciones se resuelven en unos minutos; algunas tardan hasta un día. No hace falta que espere aquí: siga mirando y le avisaremos.',
  },
  'authp.status.approvedTitle': {
    en: 'You are verified',
    nl: 'U bent geverifieerd',
    fr: 'Vous êtes vérifié',
    es: 'Está verificado',
  },
  'authp.status.approvedBody': {
    en: 'Your licence and identity documents have been accepted. You can book straight away, and you will not be asked again unless something expires.',
    nl: 'Uw rijbewijs en identiteitsdocumenten zijn geaccepteerd. U kunt meteen boeken en wordt niet opnieuw gevraagd, tenzij iets verloopt.',
    fr: 'Votre permis et vos pièces d’identité ont été acceptés. Vous pouvez réserver immédiatement, et on ne vous les redemandera pas sauf en cas d’expiration.',
    es: 'Su carné y sus documentos de identidad han sido aceptados. Puede reservar de inmediato y no se le volverán a pedir salvo que algo caduque.',
  },
  'authp.status.rejectedTitle': {
    en: 'We could not accept your documents',
    nl: 'Wij konden uw documenten niet accepteren',
    fr: 'Nous n’avons pas pu accepter vos documents',
    es: 'No hemos podido aceptar sus documentos',
  },
  'authp.status.rejectedBody': {
    en: 'The reason is below. It is usually something small, and trying again with a better photo is normally all it takes.',
    nl: 'De reden staat hieronder. Meestal is het iets kleins en volstaat het om het opnieuw te proberen met een betere foto.',
    fr: 'La raison est indiquée ci-dessous. C’est généralement un détail, et réessayer avec une meilleure photo suffit le plus souvent.',
    es: 'El motivo está más abajo. Normalmente es algo pequeño y basta con intentarlo otra vez con una foto mejor.',
  },
  'authp.status.resubmitTitle': {
    en: 'We need one more thing',
    nl: 'Wij hebben nog één ding nodig',
    fr: 'Il nous manque un élément',
    es: 'Necesitamos una cosa más',
  },
  'authp.status.resubmitBody': {
    en: 'Almost there. One document still needs sending before the check can finish.',
    nl: 'Bijna klaar. Er moet nog één document worden verstuurd voordat de controle kan worden afgerond.',
    fr: 'Presque terminé. Un document reste à envoyer avant que la vérification puisse aboutir.',
    es: 'Casi está. Todavía falta enviar un documento para poder terminar la comprobación.',
  },
  'authp.status.whyNot': {
    en: 'Why It Was Not Accepted',
    nl: 'Waarom het niet is geaccepteerd',
    fr: 'Pourquoi cela n’a pas été accepté',
    es: 'Por qué no se ha aceptado',
  },
  'authp.status.whatWeNeed': {
    en: 'What We Need',
    nl: 'Wat wij nodig hebben',
    fr: 'Ce dont nous avons besoin',
    es: 'Lo que necesitamos',
  },
  'authp.status.encryptedNote': {
    en: 'Your documents are held encrypted, separately from everything else, and are never shown to rental businesses.',
    nl: 'Uw documenten worden versleuteld bewaard, apart van al het andere, en worden nooit aan verhuurbedrijven getoond.',
    fr: 'Vos documents sont conservés chiffrés, séparément de tout le reste, et ne sont jamais montrés aux loueurs.',
    es: 'Sus documentos se guardan cifrados, aparte de todo lo demás, y nunca se muestran a las empresas de alquiler.',
  },
  'authp.status.carryOn': {
    en: 'Carry On Browsing',
    nl: 'Verder Kijken',
    fr: 'Continuer à Naviguer',
    es: 'Seguir Mirando',
  },
  'authp.status.sendForChecking': {
    en: 'Send for Checking',
    nl: 'Versturen ter Controle',
    fr: 'Envoyer pour Vérification',
    es: 'Enviar para Revisión',
  },
  'authp.status.doLater': {
    en: 'Do This Later',
    nl: 'Dit Later Doen',
    fr: 'Faire Cela Plus Tard',
    es: 'Hacerlo Más Tarde',
  },
} satisfies Record<string, Phrase>;
