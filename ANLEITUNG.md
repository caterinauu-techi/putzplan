# Putzplan – Web-App für Olena & Ilona

Zwei Seiten, eine gemeinsame Datenbank:

- **index.html – für die Putzfrau** (Ukrainisch, umschaltbar auf Deutsch)
  Kalender mit „wer kommt wann“, Sonderaufgaben des Tages, alle täglichen Aufgaben zum Abhaken,
  Hinweis zu den matten Oberflächen, „Wo kommt was hin?“. Keine Anmeldung nötig.
- **admin.html – für dich**
  Wochenplan (z. B. Mo Olena, Mi Ilona, Fr Olena), pro Tag abweichend „wer kommt“ oder „kommt nicht“,
  Notiz für den Tag (DE + optional UA), Sonderaufgaben (frei oder aus Vorlagen wie Ferienzeit-Aufgaben,
  Keller, Garage, Schwimmtasche …), Übersicht was erledigt ist – mit Name und Uhrzeit.
  Nur mit deinem Google-Konto (caterina.uu@gmail.com).

## Ausprobieren (Demo-Modus)

Solange in `docs/firebase-config.js` `firebaseConfig = null` steht, speichert die App nur lokal im Browser.
Zum Testen den Ordner `public` mit einem einfachen Webserver öffnen (z. B. in VS Code „Live Server“) –
direkt per Doppelklick auf die HTML-Datei funktioniert es nicht (Browser blockiert Module von der Festplatte).

## Einrichten mit Firebase (einmalig, ca. 15 Minuten)

1. **Projekt anlegen:** https://console.firebase.google.com → „Projekt hinzufügen“ → Name z. B. `putzplan`
   (Google Analytics kann aus bleiben).
2. **Web-App registrieren:** Projektübersicht → Symbol `</>` → Name „Putzplan“ → die angezeigte
   `firebaseConfig` kopieren und in `docs/firebase-config.js` statt `null` einfügen.
3. **Anmeldung aktivieren:** Build → Authentication → „Jetzt starten“ → Anmeldeanbieter:
   - **Anonym** aktivieren (für die Putzfrau-Seite)
   - **Google** aktivieren (für dich)
4. **Datenbank anlegen:** Build → Firestore Database → „Datenbank erstellen“ → Standort `europe-west3 (Frankfurt)`
   → „Im Produktionsmodus starten“.
5. **Veröffentlichen** (am PC, Node.js muss installiert sein):
   ```
   npm install -g firebase-tools
   firebase login
   cd putzplan
   firebase use --add        (dein Projekt auswählen)
   firebase deploy
   ```
   Damit werden die Seiten **und** die Sicherheitsregeln (`firestore.rules`) hochgeladen.
   Danach ist die App erreichbar unter `https://<projekt-id>.web.app`:
   - Putzfrau: `https://<projekt-id>.web.app/` → diesen Link an Olena und Ilona schicken
     (am besten auf dem Handy „Zum Startbildschirm hinzufügen“)
   - Du: `https://<projekt-id>.web.app/admin.html`
6. In der Verwaltung zuerst den **Wochenplan** einstellen (wer kommt Mo/Mi/Fr).

## Auf den Startbildschirm legen

Die Seiten haben ein eigenes Symbol (grünes Klemmbrett) und öffnen sich vom Startbildschirm ohne Browserleiste wie eine App.

- **iPhone (Safari):** Link öffnen → Teilen-Symbol (Quadrat mit Pfeil) → „Zum Home-Bildschirm“.
- **Android (Chrome):** Link öffnen → Menü ⋮ → „Zum Startbildschirm hinzufügen“ bzw. „App installieren“.

Nachricht zum Weiterschicken an Olena und Ilona:

> Привіт! Ось наш план прибирання: <LINK>
> Будь ласка, відкрийте посилання й додайте його на головний екран
> (iPhone: «Поділитися» → «На початковий екран»; Android: меню ⋮ → «Додати на головний екран»).
> Угорі натисніть «Я Олена» або «Я Ілона» і позначайте виконані завдання. Дякую!

Deine Verwaltung (`/admin.html`) kannst du genauso auf deinen Startbildschirm legen. Falls die Google-Anmeldung
aus dem Startbildschirm-Symbol heraus nicht klappt (kommt auf manchen iPhones vor), einmal im normalen Browser anmelden.

## Sicherheit

- Die Putzfrau-Seite meldet sich unsichtbar anonym an. Damit kann man lesen und abhaken,
  aber nichts am Plan, an Notizen oder Sonderaufgaben ändern.
- Nur `caterina.uu@gmail.com` darf den Plan ändern (in `firestore.rules` und `docs/firebase-config.js`
  eingetragen – bei einer weiteren Person beide Stellen ergänzen, z. B. für Alex).
- Wer den Link kennt, kann die Aufgaben und den Kalender sehen. Es stehen keine Adressen oder Telefonnummern drin.

## Anpassen

- Aufgaben, Übersetzungen, Vorlagen: `docs/tasks.js`
- Farben/Schrift: `docs/styles.css`
- Nach Änderungen erneut `firebase deploy`.
