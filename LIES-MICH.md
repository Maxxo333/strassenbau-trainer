# Straßenbau-Trainer

Lern-App für die Zwischenprüfung Straßenbauer/in. Läuft im Browser, ohne Anmeldung und ohne Internet. Der Lernfortschritt wird nur in deinem Browser auf diesem Gerät gespeichert.

## Starten

**Am Mac (empfohlen):** Doppelklick auf `start.command`. Der Browser öffnet sich mit der App. Zum Beenden das Terminalfenster schließen.
Falls macOS die Datei blockiert: Rechtsklick → „Öffnen“ → „Öffnen“.

**Ohne Server:** `index.html` direkt im Browser öffnen. Alles funktioniert, nur die Installation als App (Offline-Modus) ist so nicht möglich.

**Aufs Handy:** Den Ordner auf einen beliebigen Webspace oder z. B. GitHub Pages hochladen, die Seite im Handy-Browser öffnen und „Zum Home-Bildschirm hinzufügen“ wählen. Danach funktioniert sie auch offline.

## Funktionen

| Bereich | Was es macht |
|---|---|
| Übersicht | Gesamtfortschritt, Lernzeit heute, Tagesplan, offene Bereiche, Fortschritt je Thema |
| Lernkarten | Frage → umdrehen → „Kann ich“ / „Noch üben“, Karten merken |
| Quiz | Multiple Choice und Eingabeaufgaben mit sofortiger Erklärung |
| Rechenübungen | Unbegrenzt neue Aufgaben mit Lösungsweg: Flächen, Volumen und Aushub, Gefälle, Baustoffmengen und Kosten, Einheiten, Höhen und Maßstab |
| Prüfungssimulation | Gemischte Aufgaben mit Zeitlimit, Punkten, Note zur Orientierung und Auswertung nach Bereichen |
| Fehlertraining | Alles, was du falsch beantwortet hast. Richtig beantwortet → verschwindet |
| Merkliste & Notizen | Gemerkte Karten und eigene Notizen |
| Einstellungen | Lernbereiche, Schwierigkeit, Lernzeit, Prüfungstermin, dunkles Design, große Schrift, Sicherung, Zurücksetzen |

## Inhalte anpassen

Lernkarten und Quizfragen stehen in `inhalte.js`, die Rechenaufgaben werden in `rechnen.js` erzeugt. Wenn du die Dateien änderst und die App online nutzt, erhöhe in `sw.js` die Versionsnummer (`strassenbau-trainer-v1` → `v2`).

**Hinweis:** Das ist allgemeines Übungsmaterial und keine offizielle Prüfungsaufgabensammlung. Maßgeblich sind deine Unterlagen aus Betrieb, Berufsschule und ÜBA.
