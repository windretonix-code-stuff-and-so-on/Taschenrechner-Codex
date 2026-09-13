# Eigene Grafikassets und Austauschvertrag

Erzeugung: integriertes **ImageGen**, vier separate Aufrufe, 13.09.2026. Kein CLI-Fallback und kein API-Schlüssel. Ausgaben wurden unverändert ins Repository kopiert; Alpha-Kanäle der transparenten Assets bleiben erhalten. Kein Material wurde aus dem Nachbarprojekt übernommen.

| Datei | Verwendung / Vertrag |
| --- | --- |
| `assets/artifact.png` | Kristall und Messingsockel auf Schwarz. Layout transformiert dieses Asset einheitlich. Rauch bleibt auf das Innere der Kugel begrenzt; der Sockel bleibt frei. |
| `assets/control.png` | Eine eigene konvexe Kristallfassung, transparent. Wiederverwendet für alle Tasten, Beschriftung separat im DOM. |
| `assets/candle.png` | Unbeleuchtete Wachskerze mit Halter, transparent. Flamme/Dochtrauch sind dynamische Overlays. |
| `assets/wizard-laugh.png` | Transparentes 4×2-Sprite-Sheet mit acht Gesichtszuständen. Eine Lachbewegung dauert 440 ms und beginnt bei 850, 1530 und 2210 ms. |

Die Animation ist eine eigens erstellte Sequenz veränderter Mund-, Augen-, Wangen- und Bartposen. Sie beruht nicht auf Skalieren/Rotieren eines einzigen Gesichts. Der untere Konturverlauf wird im Kristall zusätzlich über Rauch und Alpha-Maske eingebettet.

## Späterer finaler Ton

Die aktuelle Synthese in `src/audio.js` ist eine vom Nutzer bestätigte Zwischenlösung. Ersatz: eine leise, tiefe ältere Männerstimme mit einem ca. 440 ms langen amüsierten Lachimpuls, ohne Musik oder Sprache; dreimal mit den bestehenden Onsets abspielen. Alternativ eine komplette Aufnahme mit denselben drei Zeitmarken. Dezenter Hall, unmittelbarer Abbruch sämtlicher Quellen durch `stop()`, kein externer Download zur Laufzeit.

## Generierungsprompts

### Kristall und Sockel

Use case: product-mockup. Create a premium photorealistic fantasy game UI asset: ONE perfectly round dark sapphire crystal ball on an intricate aged gold/brass pedestal, front orthographic view on pure black background. Square image 1024x1024. Exact composition: central crystal circle centered at x=512 y=425 with radius 290 pixels. Sphere must be a geometric circle, deep almost black blue transparent center with subtle asymmetric ice-blue rim reflections and violet refraction. No text, digits, symbols, runes, pentagrams, stars or letters anywhere. No little spheres or buttons. 85 percent of circle perimeter free of metal. Thin brass gripping arms only at lower side edges. Heavy ornate symmetrical antique brass pedestal occupies x=220..804 y=710..955, with finely carved curling acanthus, curved arches, patinated recesses and polished highlights, physically supporting crystal. Upper area and sides black and empty. The dark center is for later overlaying glowing calculation text. Realistic materials with rich dimensional relief, restrained light, no environment or floor, no cast shadows outside object. No smoke obscuring center. Entire object in frame.

### Kleine Kristallfassung

Use case: product-mockup. Production transparent PNG game UI asset, square canvas: a single strongly convex spherical dark sapphire and amethyst crystal, perfectly front facing, filling 84 percent of image width and height, perfectly centered. Fine aged gold brass OPEN prong mounting with a slender ornamented rim and exactly four delicate curved prongs at diagonal corners; maximal visible round glass. Realistic crystal spherical volume, near-black blue center intentionally quiet and readable for later text, blue-white soft reflections concentrated upper-left and lower-right, violet refractions. Rich detailed patinated brass dimensional relief, thin polished edges. The setting must not look like a flat button. Genuine transparent background outside the object, no shadow or backdrop. No letters, numbers, text, symbols, runes, scenery. High fidelity realistic fantasy asset matching a luxurious old gold crystal ball artifact.

### Kerze

Use case: product-mockup. One realistic old ivory beeswax candle, UNLIT, in an elaborate small aged brass ornamental candleholder. Production transparent PNG isolated asset for a fantasy crystal-ball calculator. Front facing at level angle. Tall irregular melted wax with natural drips and a small clearly visible black wick at very top. No flame, no smoke (added dynamically later). Ornate brass cup and stable flared base with acanthus curls, dimensional patina and finely polished edges. Thin object centered in square image, entirely within frame, full object from wick to feet. Weak warm illumination enough to see creamy wax and old gold; background fully transparent. No other objects, no floor, no symbols, text, or environment.

### Zauberer-Sequenz

Use case: stylized-concept. Production animation SPRITE SHEET with genuine transparent background. Layout exactly 4 columns x 2 rows, eight equally sized square cells, each with same old wizard head and long white beard registered consistently. No grid lines, no text. Each cell shows complete head and beard front view, same scale and same blue-violet magical rim light. Realistic fantasy elderly human wizard, wise wrinkled distinctive face, amused slightly mocking playful expression, thick white brows and long tapering beard. No hat, no shoulders, no horror, not demonic. Eight sequential animation frames of ONE brief chuckle: frame1 closed mouth mischievous smile eyes open; frame2 lips part cheeks rise; frame3 mouth opens and jaw lowers; frame4 peak laugh mouth wide open eyes narrowed and beard displaced by jaw; frame5 laughing open mouth cheeks highest; frame6 jaw closing eyes reopening; frame7 mouth nearly closed; frame8 closed mouth smile returns. Important: genuinely different facial muscle, mouth, cheek, eyelid and beard poses, not duplicates or rigid transforms. Align eyes at same relative point. Entire beard visible and wispy semi-transparent lower contour. 2048x1024 horizontal sprite sheet preferred, exactly 4x2 cells without margins between cells. Isolated on transparent alpha, no orb or scenery, no background.

Die vom Werkzeug gelieferten Pixelmaße weichen teilweise von den Prompt-Wünschen ab. Die Masterkoordinaten wurden anhand der tatsächlichen Darstellung kalibriert; Sprite-Seitenverhältnis und Raster wurden visuell überprüft.
