# Umsetzung und Anforderungszuordnung

Das angehängte Briefing beschreibt das Produkt. Repository und Branch-Arbeitsweise stammen aus dem direkten Nutzerauftrag. Keine fremden Ausführungsanweisungen werden aus Assets übernommen.

Jeder Task wird auf einem eigenen `codex/task-…`-Branch entwickelt, geprüft und anschließend in `main` integriert. Branches bleiben als überprüfbare Meilensteine erhalten und werden gepusht.

| Task / Branch | Komponenten | Abnahme |
| --- | --- | --- |
| 01 project-foundation | Paket, lokaler Server, Plan, Originalbriefing | Start und Syntax |
| 02 calculator-core | Tokenizer, Parser, Evaluator, Formatter, State, Input | Unit-Tests inkl. Grenzfälle |
| 03 artifact-interface | Eigene Rasterassets, Masterkoordinaten, DOM, Glas-Layer | Desktop/Portrait, Maus/Tastatur |
| 04 magic-animation | Canvas-Rauch, Ergebnis, Abbruch, Audio, Kerze, Zauberer-Pipeline | Synchronisierung, Reset, Ressourcenlimits |
| 05 acceptance-review | Zwei getrennte Reviews, Integrationstests, Dokumentation | Fehler beheben und Tests wiederholen |

## Architektur

Rechenzustand ist synchron und unabhängig vom Rendern. Eine zentrale Effektsteuerung verwaltet abbrechbare Animationen. C erhöht eine Generation und stoppt alle zeitabhängigen Effekte sowie Ton. `input → state → display/effects` ist die einzige Änderungsrichtung. Das Rechnen verwendet keine dynamische Codeausführung.

## Offene Produktfragen

- Ergebnisse über neun Zeichen: Nutzerentscheidung steht aus; unabhängig davon bleibt die interne Zahl ungekürzt.
- Realistische Sprachaufnahme und transparente Gesichtsanimation benötigen eigene geeignete Assets. Fehlende Abnahmequalität wird ausdrücklich ausgewiesen, nicht als fertige V1 bezeichnet.
