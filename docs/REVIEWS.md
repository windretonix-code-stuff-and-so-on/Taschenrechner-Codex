# Getrennte Selbstreviews — 13.09.2026

## Review 1: Korrektheit, Sicherheit, Abbruch und Wartbarkeit

Geprüft: Tokenizer/Parser/Evaluator, ungültige Präfixe, verschachtelte Klammern, direkte und indirekte Division durch null, Zustandswechsel, wiederholtes Gleichheitszeichen, Eingaben während Effekten, Tonspeicherung, Audiostopp und fehlertolerante Browser-APIs.

Gefundene und behobene Punkte:

1. **Interne Ergebnispräzision:** Formatieren vor dem Weiterrechnen rundete `1÷3` intern ab. Operatorfortsetzung verwendet jetzt die vollständige Zahl; ein Regressionstest prüft anschließendes `×3 = 1`.
2. **Sichtbare Gleitkommaartefakte nach Fortsetzung:** Die unveränderte Zahl blieb korrekt, konnte aber `0.30000000000000004+` anzeigen. Ein getrenntes Anzeigepräfix normalisiert die Darstellung, ohne den mathematischen Zustand zu kürzen.
3. **Abbruch und Ton:** Explizite Generationen invalidieren alte Frames; Reset stoppt und trennt alle registrierten Audioknoten. Separate Unit-Tests prüfen die drei Impulse und Stopp-Pfade; Browserprüfungen testen Reset bei 80/700/1200 ms im Ergebnis und 120/1100/2500 ms im Fehler.
4. **Bedienbarkeit der Kerze:** Enter auf der fokussierten Kerze darf nicht vom globalen Gleichheitszeichen-Handler abgefangen werden. Tastaturtest ergänzt.

Weitere Feststellungen: keine Verwendung von `eval` oder `Function`, keine Laufzeitbibliothek für Mathematik, keine Schlüssel oder privaten Profildaten im Projekt. Nutzereingaben gelangen nur als Text in die Anzeige. Das dynamische Support-SVG verwendet ausschließlich interne numerische Layoutdaten. Speicherfehler werden abgefangen. Parser-/Eingabelimits begrenzen pathologische Arbeit.

## Review 2: Grafik, Geometrie, Synchronität und Performance

Geprüft: eigene Rasterassets, Desktop und Portrait, exakte Spiegelung der Ziffernpaare und 4/5-Lücke, freie obere Kugelkontur, konstante Schriftgröße, Anzeigezentrum, Tastenabstände, Kerze, Glasebenen, Ergebnisverdichtung und Zauberer.

Gefundene und behobene Punkte:

1. **Verdeckte Grafikebenen in Edge:** Bei langen Eingaben fehlten zeitweise Metall-/Bedienelemente. Die problematische zweite geclippte Kopie des Sockelbilds wurde entfernt und die Ebenen explizit getrennt. Luminous-Textstreuung wird auf einem eigenen transparenten Canvas gezeichnet. Screenshot vor/nach der Korrektur geprüft.
2. **Zu kleiner Kerzenabstand im Hochformat:** Position und Größe im eigenen Portrait-Master angepasst; jetzt schwarze Trennung zum Sockel.
3. **Zu unauffälliger aktiver Rauch:** Höhere Dichte während Ergebnis/Fehler; dunklerer schnellerer Fehlerrauch und vordere Schleier am unteren Bart. Idle bleibt zurückhaltend.
4. **Partikel nicht genau an den Zeichen:** Positionen werden jetzt aus den gerenderten Glyphen abgeleitet. Verschobene Zeichen werden in Bildschirmkoordinaten rückwärts/vorwärts animiert.

Leistungsgrenzen: maximal 180 Lichtpartikel; vorgerechnete Rauch-Sprites, 17 Nebelformen über zwei Layer; maximal ca. 30 Canvas-Bilder/s; DPR maximal 1,6 und höchstens 900 Pixel Canvas-Kantenlänge. Versteckte Tabs zeichnen nicht neu. Keine unbeschränkte Animationswarteschlange. Reduzierte Bewegung dämpft die Dauerbewegung.

## Testergebnisse und Grenzen

- 42 Unit-Tests bestanden nach den Korrekturen.
- 32 Browserprüfungen bestanden; vollständiger Wiederholungslauf nach Korrekturen vor dem Commit.
- Desktop: 1440 × 1000. Portrait: 390 × 844, mobile Emulation mit Touch.
- Prüfbilder: `desktop.png`, `portrait.png`, `expression.png`, `result-condensation.png`, `wizard.png`.
- Audioknoten und Zeitablauf wurden automatisiert geprüft; eine gehörte Qualitätsabnahme des Klangs wurde nicht durchgeführt.
- Premium-Endabnahme bleibt wegen des bewusst synthetischen Tons und der offenen langen Ergebnisdarstellung eingeschränkt. Reale Mobilgeräte sind noch nicht geprüft.

## Nachbesserung: sofortige Eingabe und Rauchfüllung
Nutzerwunsch umgesetzt auf `codex/task-06-instant-input-smoke`: Eingaben erscheinen ohne Einblendverzögerung unmittelbar an ihrer endgültigen Position. Jedes verdrängte Zeichen erhöht die dauerhafte Rauchfüllung; größere Rauchflächen und zusätzliche begrenzte Nebelformen machen dies sichtbar. Backspace reduziert die Füllung entsprechend, C leert sie. Der überwiegende Rauch bleibt hinter der Schrift. Maximal 48 hintere und 13 vordere Nebelformen.
Prüfung: 44 Unit-Tests und sechs gezielte Desktop-/Portrait-Browsertests bestanden; aktualisierte Vorschau visuell geprüft.

## Nachbesserung: schlichte Zahlen
Auf Nutzerwunsch den zusätzlichen Canvas mit der leuchtenden Textkopie entfernt. Die Anzeige verwendet nur noch eine klare Textebene ohne Schatten, Tiefenwirkung oder Unschärfe. Ergebnisübergänge verwenden ausschließlich Deckkraft; Eingaben bleiben sofort sichtbar. Branch: `codex/task-07-plain-numbers`.

## Nachbesserung: keine führenden Nullen
Eine alleinige Null am Anfang eines ganzzahligen Operanden wird durch die nächste Ziffer ersetzt (`05` → `5`, `2+007` → `2+7`). Wiederholte Null bleibt eine einzelne Null. Nullen hinter Ziffern, vor Operatoren und in Dezimalzahlen bleiben erlaubt (`100`, `0+5`, `0,05`). Gilt ebenfalls nach Klammern und unärem Minus. 47 Unit-Tests und zwei gezielte Browserprüfungen für Maus/Tastatur auf Desktop/Portrait bestanden. Branch: `codex/task-08-leading-zero`.
