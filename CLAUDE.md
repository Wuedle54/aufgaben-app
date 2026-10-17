# Aufgaben-App

Eine einfache Aufgabenliste als Webseite. Man kann Aufgaben eintippen, hinzufügen, abhaken und löschen. Die Aufgaben werden im `localStorage` des Browsers gespeichert und bleiben nach dem Neuladen erhalten.

Bewusst ohne Framework und ohne Build-Schritt: nur reines HTML, CSS und JavaScript. Zum Anschauen `index.html` direkt im Browser öffnen.

## Dateien

- `index.html` – Aufbau der Seite (Überschrift, Eingabefeld, Knopf, Liste)
- `style.css` – Aussehen (Farben, Abstände, durchgestrichene erledigte Aufgaben)
- `app.js` – Verhalten (Hinzufügen, Abhaken, Löschen, Speichern in `localStorage`)
- `tests/aufgaben.spec.js` – automatische Browser-Tests mit Playwright

## Tests

Einmalig einrichten:

```
npm install
npx playwright install chromium
```

Tests starten:

```
npm test
```

Nach jeder Änderung an `index.html`, `style.css` oder `app.js` die Tests laufen lassen. Neue Funktionen bekommen eigene Tests in `tests/`.

## Regeln für die Arbeit

- Kein Framework und keine Bibliotheken für die App selbst einführen. Playwright ist nur für die Tests da.
- Code, Bezeichner und Kommentare sind auf Deutsch, passend zum bestehenden Code.

## Ablauf für neue Funktionen

Neue Funktionen werden immer in zwei Schritten mit den Subagents aus `.claude/agents/` gebaut:

1. **umsetzer** baut die Funktion, schreibt Tests dafür und führt `npm test` aus.
2. **pruefer** prüft die Änderungen, ohne Code zu ändern, und antwortet mit `URTEIL: FREIGEGEBEN` oder `URTEIL: ÄNDERUNGEN NÖTIG` plus Befunden.

Bei `ÄNDERUNGEN NÖTIG` behebt der umsetzer die Befunde, danach prüft der pruefer erneut. Erst nach `FREIGEGEBEN` wird committet.

## Kommunikation

Der Nutzer ist kein Programmierprofi. Erkläre jede Änderung **immer in einfachen Worten auf Deutsch**:

- Was wurde geändert, und warum?
- Was bedeutet das für die Benutzung der App?
- Fachbegriffe vermeiden oder kurz erklären, gern mit einem Vergleich aus dem Alltag.
