// 1) In der Firebase-Konsole: Projekteinstellungen → „Meine Apps“ → Web-App → Konfiguration.
// 2) Das Objekt hier eintragen (statt null). Solange hier null steht, läuft die App im Demo-Modus
//    und speichert nur lokal im Browser.
export const firebaseConfig = {
  apiKey: 'AIzaSyBfff0CcZnI7IDNRpB2WfQIRqjnhYD8w0Q',
  authDomain: 'putzplan-77d29.firebaseapp.com',
  projectId: 'putzplan-77d29',
  storageBucket: 'putzplan-77d29.firebasestorage.app',
  messagingSenderId: '826696596243',
  appId: '1:826696596243:web:29d46b5a8b6348ec9738e6'
};
// Beispiel:
// export const firebaseConfig = {
//   apiKey: "…",
//   authDomain: "putzplan-xyz.firebaseapp.com",
//   projectId: "putzplan-xyz",
//   appId: "…"
// };

// Wer darf die Verwaltung benutzen (Google-Anmeldung)? Muss mit firestore.rules übereinstimmen.
export const ADMIN_EMAILS = ['caterina.uu@gmail.com'];

// Automatische Übersetzung (Firebase AI Logic / Gemini, kostenlose Stufe).
// recaptchaSiteKey: Websiteschlüssel aus App Check (reCAPTCHA v3), siehe ANLEITUNG.md.
// Ohne Schlüssel funktioniert alles – nur ohne automatische Übersetzung.
export const AI = {
  recaptchaSiteKey: null,
  model: 'gemini-4-hydrogen'
};
