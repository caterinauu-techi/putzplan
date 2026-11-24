# Putzplan – Web-App für Olena & Ilona

**Live:**
- Putzfrau (Ukrainisch/Deutsch): https://caterinauu-techi.github.io/putzplan/
- Verwaltung (nur mit Google-Konto caterina.uu@gmail.com): https://caterinauu-techi.github.io/putzplan/admin.html

## Was die Seiten können

**Putzfrau-Seite:** Kalender (wer kommt wann), Tagesnotiz und Sonderaufgaben, alle Routine-Aufgaben zum Abhaken,
Hinweis zu matten Oberflächen, „Wo kommt was hin?“, Nachrichten an Caterina (mit Schnell-Knöpfen wie „Putzmittel fast leer“).
Sprache UA/DE umschaltbar, jedes Handy merkt sich seine Sprache. Keine Anmeldung nötig.

**Verwaltung:** Wochenplan (Mo–So: Olena / Ilona / niemand), pro Tag abweichend, Notiz und Sonderaufgaben (frei oder aus Vorlagen),
Übersicht was erledigt ist (mit Name und Uhrzeit), Nachrichten lesen und beantworten.

**Automatische Übersetzung:** Notizen, Sonderaufgaben und Nachrichten werden beim Speichern über Gemini (Firebase AI Logic,
kostenlose Stufe) übersetzt: Deutsch → Ukrainisch und Ukrainisch → Deutsch. Klappt die Übersetzung einmal nicht, wird der
Originaltext angezeigt.

## Auf den Startbildschirm legen

- **iPhone (Safari):** Link öffnen → Teilen-Symbol → „Zum Home-Bildschirm“.
- **Android (Chrome):** Link öffnen → Menü ⋮ → „Zum Startbildschirm hinzufügen“.

Nachricht zum Weiterschicken:

> Привіт! Ось наш план прибирання: https://caterinauu-techi.github.io/putzplan/
> Будь ласка, відкрийте посилання й додайте його на головний екран
> (iPhone: «Поділитися» → «На початковий екран»; Android: меню ⋮ → «Додати на головний екран»).
> Угорі натисніть «Я Олена» або «Я Ілона» і позначайте виконані завдання. Там же можна написати мені повідомлення. Дякую!

## Technik

- Firebase-Projekt `putzplan-77d29` (Spark-Tarif, kostenlos): Authentication (anonym + Google), Firestore (Frankfurt),
  App Check (reCAPTCHA Enterprise / Fraud Defense), AI Logic (Gemini Developer API).
- Seiten: GitHub Pages aus dem Ordner `docs/` dieses Repos. Änderungen an `docs/` sind nach ca. 1 Minute live.
- Sicherheitsregeln: `firestore.rules` (in der Firebase-Konsole unter Firestore → Regeln eingespielt).
  Putzfrau kann lesen, abhaken und Nachrichten schreiben; nur die Verwaltung ändert Plan, Notizen und Sonderaufgaben.
- Aufgaben und Übersetzungen: `docs/tasks.js`, Schnell-Nachrichten: `docs/messages.js`.
- Der Code ist öffentlich (enthält Aufgabenliste und Vornamen). Die Daten (Häkchen, Nachrichten) liegen geschützt in Firebase.
