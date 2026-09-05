// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Signing in, creating an account, and the licence and ID checks.
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

export const auth = {

  'auth.welcomeTitle': {
    en: 'Rent a car anywhere on the island',
    nl: 'Huur overal op het eiland een auto',
    fr: 'Louez une voiture partout sur l’île',
    es: 'Alquile un coche en cualquier punto de la isla',
  },
  'auth.welcomeBody': {
    en: 'One account for both sides of Sint Maarten and Saint-Martin. Search, book, verify and drive — all in one place.',
    nl: 'Eén account voor beide kanten van Sint Maarten en Saint-Martin. Zoeken, boeken, verifiëren en rijden — alles op één plek.',
    fr: 'Un seul compte pour les deux côtés de Saint-Martin et Sint Maarten. Chercher, réserver, vérifier et rouler — tout au même endroit.',
    es: 'Una sola cuenta para los dos lados de Sint Maarten y Saint-Martin. Buscar, reservar, verificar y conducir — todo en un mismo sitio.',
  },
  'auth.getStarted': {
    en: 'Get started',
    nl: 'Aan de slag',
    fr: 'Commencer',
    es: 'Empezar',
  },
  'auth.signIn': {
    en: 'Sign In',
    nl: 'Inloggen',
    fr: 'Se connecter',
    es: 'Iniciar sesión',
  },
  'auth.signUp': {
    en: 'Sign up',
    nl: 'Aanmelden',
    fr: 'Créer un compte',
    es: 'Crear cuenta',
  },
  'auth.signOut': {
    en: 'Log out',
    nl: 'Uitloggen',
    fr: 'Se déconnecter',
    es: 'Cerrar sesión',
  },
  'auth.welcomeBack': {
    en: 'Welcome back',
    nl: 'Welkom terug',
    fr: 'Bon retour',
    es: 'Bienvenido de nuevo',
  },
  'auth.readyToDrive': {
    en: 'Ready to hit the road.',
    nl: 'Klaar om de weg op te gaan.',
    fr: 'Prêt à prendre la route.',
    es: 'Listo para salir a la carretera.',
  },
  'auth.emailOrPhone': {
    en: 'Email or phone number',
    nl: 'E-mailadres of telefoonnummer',
    fr: 'E-mail ou numéro de téléphone',
    es: 'Correo electrónico o teléfono',
  },
  'auth.email': {
    en: 'Email Address',
    nl: 'E-mailadres',
    fr: 'Adresse e-mail',
    es: 'Correo electrónico',
  },
  'auth.password': {
    en: 'Password',
    nl: 'Wachtwoord',
    fr: 'Mot de passe',
    es: 'Contraseña',
  },
  'auth.firstName': {
    en: 'First Name',
    nl: 'Voornaam',
    fr: 'Prénom',
    es: 'Nombre',
  },
  'auth.lastName': {
    en: 'Last Name',
    nl: 'Achternaam',
    fr: 'Nom',
    es: 'Apellidos',
  },
  'auth.country': {
    en: 'Country',
    nl: 'Land',
    fr: 'Pays',
    es: 'País',
  },
  'auth.rememberMe': {
    en: 'Remember me',
    nl: 'Ingelogd blijven',
    fr: 'Rester connecté',
    es: 'Mantener la sesión iniciada',
  },
  'auth.forgotPassword': {
    en: 'Forgot password',
    nl: 'Wachtwoord vergeten',
    fr: 'Mot de passe oublié',
    es: 'Olvidé mi contraseña',
  },
  'auth.orDivider': {
    en: 'Or',
    nl: 'Of',
    fr: 'Ou',
    es: 'O',
  },
  'auth.continueWithApple': {
    en: 'Sign in with Apple',
    nl: 'Inloggen met Apple',
    fr: 'Se connecter avec Apple',
    es: 'Iniciar sesión con Apple',
  },
  'auth.continueWithGoogle': {
    en: 'Sign in with Google',
    nl: 'Inloggen met Google',
    fr: 'Se connecter avec Google',
    es: 'Iniciar sesión con Google',
  },
  'auth.noAccount': {
    en: 'Don\'t have an account?',
    nl: 'Nog geen account?',
    fr: 'Vous n’avez pas de compte ?',
    es: '¿Todavía no tiene cuenta?',
  },
  'auth.haveAccount': {
    en: 'Already have an account?',
    nl: 'Heeft u al een account?',
    fr: 'Vous avez déjà un compte ?',
    es: '¿Ya tiene una cuenta?',
  },
  'auth.useFaceId': {
    en: 'Use Face ID',
    nl: 'Face ID gebruiken',
    fr: 'Utiliser Face ID',
    es: 'Usar Face ID',
  },
  'auth.resetTitle': {
    en: 'Reset your password',
    nl: 'Wachtwoord opnieuw instellen',
    fr: 'Réinitialiser votre mot de passe',
    es: 'Restablecer su contraseña',
  },
  'auth.resetBody': {
    en: 'Enter the email address linked to your account and we\'ll send you a link to reset your password.',
    nl: 'Voer het e-mailadres van uw account in. Wij sturen u een link om een nieuw wachtwoord in te stellen.',
    fr: 'Saisissez l’adresse e-mail liée à votre compte et nous vous enverrons un lien pour choisir un nouveau mot de passe.',
    es: 'Introduzca el correo electrónico de su cuenta y le enviaremos un enlace para elegir una contraseña nueva.',
  },
  'auth.returnToSignIn': {
    en: 'Return to sign in',
    nl: 'Terug naar inloggen',
    fr: 'Retour à la connexion',
    es: 'Volver al inicio de sesión',
  },
  'auth.createAccount': {
    en: 'Create a new account',
    nl: 'Nieuw account aanmaken',
    fr: 'Créer un nouveau compte',
    es: 'Crear una cuenta nueva',
  },
  'auth.verifyPhoneTitle': {
    en: 'Verify your phone number',
    nl: 'Bevestig uw telefoonnummer',
    fr: 'Vérifiez votre numéro de téléphone',
    es: 'Verifique su número de teléfono',
  },
  'auth.verifyPhoneBody': {
    en: 'We\'ll send a code by text message to confirm it\'s you.',
    nl: 'Wij sturen een code per sms om te bevestigen dat u het bent.',
    fr: 'Nous enverrons un code par SMS pour confirmer que c’est bien vous.',
    es: 'Le enviaremos un código por SMS para confirmar que es usted.',
  },
  'auth.phoneNumber': {
    en: 'Phone Number',
    nl: 'Telefoonnummer',
    fr: 'Numéro de téléphone',
    es: 'Número de teléfono',
  },
  'auth.enterCodeTitle': {
    en: 'Enter your code',
    nl: 'Voer uw code in',
    fr: 'Saisissez votre code',
    es: 'Introduzca su código',
  },
  'auth.enterCodeBody': {
    en: 'We sent a 4-digit code to',
    nl: 'Wij hebben een code van 4 cijfers gestuurd naar',
    fr: 'Nous avons envoyé un code à 4 chiffres au',
    es: 'Hemos enviado un código de 4 dígitos al',
  },
  'auth.noCode': {
    en: 'Didn\'t get the code?',
    nl: 'Geen code ontvangen?',
    fr: 'Vous n’avez pas reçu le code ?',
    es: '¿No ha recibido el código?',
  },
  'auth.resend': {
    en: 'Resend',
    nl: 'Opnieuw versturen',
    fr: 'Renvoyer',
    es: 'Reenviar',
  },
  'account.typeTitle': {
    en: 'How will you be renting?',
    nl: 'Hoe gaat u huren?',
    fr: 'Comment allez-vous louer ?',
    es: '¿Cómo va a alquilar?',
  },
  'account.typeBody': {
    en: 'This decides which documents we ask for, and whether you qualify for Islander status.',
    nl: 'Dit bepaalt welke documenten wij vragen, en of u in aanmerking komt voor de Islander-status.',
    fr: 'Cela détermine les documents que nous demandons, et si vous pouvez obtenir le statut Islander.',
    es: 'Esto determina qué documentos le pedimos y si puede optar al estado Islander.',
  },
  'account.local': {
    en: 'I live here',
    nl: 'Ik woon hier',
    fr: 'J’habite ici',
    es: 'Vivo aquí',
  },
  'account.localBody': {
    en: 'A resident of Sint Maarten or Saint-Martin. Bring a local ID or proof of residency.',
    nl: 'Inwoner van Sint Maarten of Saint-Martin. Neem een lokaal ID of bewijs van verblijf mee.',
    fr: 'Résident de Saint-Martin ou de Sint Maarten. Apportez une pièce d’identité locale ou un justificatif de domicile.',
    es: 'Residente de Sint Maarten o Saint-Martin. Traiga una identificación local o un justificante de residencia.',
  },
  'account.tourist': {
    en: 'I\'m visiting',
    nl: 'Ik ben op bezoek',
    fr: 'Je suis de passage',
    es: 'Estoy de visita',
  },
  'account.touristBody': {
    en: 'Here on holiday or business. Bring your passport.',
    nl: 'Hier op vakantie of voor werk. Neem uw paspoort mee.',
    fr: 'En vacances ou pour le travail. Apportez votre passeport.',
    es: 'De vacaciones o por trabajo. Traiga su pasaporte.',
  },
  'verify.title': {
    en: 'Verify your identity',
    nl: 'Verifieer uw identiteit',
    fr: 'Vérifiez votre identité',
    es: 'Verifique su identidad',
  },
  'verify.body': {
    en: 'Before your first booking we need to confirm who you are and that you can legally drive. It takes about three minutes.',
    nl: 'Voor uw eerste boeking moeten wij vaststellen wie u bent en dat u legaal mag rijden. Het duurt ongeveer drie minuten.',
    fr: 'Avant votre première réservation, nous devons confirmer qui vous êtes et que vous avez le droit de conduire. Cela prend environ trois minutes.',
    es: 'Antes de su primera reserva necesitamos confirmar quién es usted y que puede conducir legalmente. Tarda unos tres minutos.',
  },
  'verify.stepSelfie': {
    en: 'Take a short video selfie',
    nl: 'Maak een korte videoselfie',
    fr: 'Prenez un court selfie vidéo',
    es: 'Grabe un selfie de vídeo corto',
  },
  'verify.stepLicense': {
    en: 'Photograph your driver\'s licence',
    nl: 'Fotografeer uw rijbewijs',
    fr: 'Photographiez votre permis de conduire',
    es: 'Fotografíe su carné de conducir',
  },
  'verify.stepPassport': {
    en: 'Photograph your passport',
    nl: 'Fotografeer uw paspoort',
    fr: 'Photographiez votre passeport',
    es: 'Fotografíe su pasaporte',
  },
  'verify.stepLocalId': {
    en: 'Photograph your local ID or residency document',
    nl: 'Fotografeer uw lokale ID of verblijfsdocument',
    fr: 'Photographiez votre pièce d’identité locale ou justificatif de domicile',
    es: 'Fotografíe su identificación local o justificante de residencia',
  },
  'verify.start': {
    en: 'Start verification',
    nl: 'Verificatie starten',
    fr: 'Commencer la vérification',
    es: 'Empezar la verificación',
  },
  'verify.statusPending': {
    en: 'We\'re checking your documents',
    nl: 'Wij controleren uw documenten',
    fr: 'Nous vérifions vos documents',
    es: 'Estamos revisando sus documentos',
  },
  'verify.statusApproved': {
    en: 'You\'re verified',
    nl: 'U bent geverifieerd',
    fr: 'Vous êtes vérifié',
    es: 'Está verificado',
  },
  'verify.statusRejected': {
    en: 'We could not verify you',
    nl: 'Wij konden u niet verifiëren',
    fr: 'Nous n’avons pas pu vous vérifier',
    es: 'No hemos podido verificarle',
  },
  'verify.statusResubmit': {
    en: 'We need one more document',
    nl: 'Wij hebben nog één document nodig',
    fr: 'Il nous manque un document',
    es: 'Nos falta un documento',
  },
  'verify.demoNotice': {
    en: 'Demo only — no ID is uploaded, stored or verified.',
    nl: 'Alleen demo — er wordt geen ID geüpload, bewaard of gecontroleerd.',
    fr: 'Démo uniquement — aucune pièce d’identité n’est envoyée, conservée ni vérifiée.',
    es: 'Solo demo — no se envía, guarda ni verifica ninguna identificación.',
  },
} satisfies Record<string, Phrase>;
