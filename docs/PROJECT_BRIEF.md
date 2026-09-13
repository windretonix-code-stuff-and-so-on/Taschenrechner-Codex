# CODEX IMPLEMENTATION TASK

# MAGIC ORB CALCULATOR — IMPLEMENTATION BRIEF

## Mission
Build a polished, fully functional V1 web calculator whose interface looks like a physical magical crystal-ball artifact, not a conventional calculator with a fantasy skin. Functional correctness and visual fidelity are equally important. Do not redesign confirmed decisions. Where this brief intentionally leaves minor details open, choose a coherent solution consistent with the art direction.

## Product scope
- V1 is a local browser web app, initially for desktop PC.
- Architecture must remain suitable for later mobile packaging/app-store distribution.
- Vanilla HTML/CSS/JavaScript; modular; no React/framework.
- Responsive from the start.
- No history and no scientific functions in V1.
- Matte pure-black background only. No room, table, books, walls, windows, scenery, etc.

## Calculator behavior
- Operators: +, −, ×, ÷.
- Parentheses supported, including nesting.
- Standard precedence: parentheses > multiplication/division > addition/subtraction.
- Decimal UI uses comma; internal representation may use dot.
- `+/-` negates the current number cleanly, e.g. `25+12` -> `25+(-12)`.
- No implicit multiplication. Prevent `2(3+4)`; require `2×(3+4)`.
- Intelligent input validation: prevent impossible sequences but allow incomplete expressions that can still become valid, e.g. `(25+`.
- Division by zero, including indirect zero such as `5÷(3−3)`, invokes the magical error sequence. Never display Infinity/NaN/technical errors.
- Native JS numbers are acceptable in V1, but format/normalize floating artifacts (`0.1+0.2` -> `0.3`). Keep math modular so decimal arithmetic could later replace it.
- Do NOT use `eval()`, `Function(...)`, or an external math library. Implement tokenizer + parser/evaluator (recursive descent or shunting-yard are acceptable).
- After a result: operator continues from result; digit begins a new calculation.
- Repeated `=` is idempotent: no repeat-operation behavior and no repeated animation.
- `C` works at absolutely any time and has highest priority. It aborts animations and audio immediately, clears all expression/result/smoke state, and returns to idle.

## Keyboard
0–9; +; -; *; /; (; ); comma or period for decimal; Enter = equals; Backspace = backspace; Escape = C. Keyboard activation must trigger the same visual reaction as clicking the corresponding sphere.

## Main display rules
- Initial/rest state is EMPTY; do not show `0`.
- Full expression is retained internally.
- Maximum 9 actual mathematical characters are visible at once.
- No real spaces in the expression.
- Operators `+ − × ÷` and parentheses `(` `)` receive purely optical 4% left/right padding. This padding does not count toward the 9-character limit. Digits and decimal comma do not receive it.
- Display characters use a CONSTANT size; do not enlarge short results.
- Visible characters form one exact horizontal line through the geometric center of the main sphere.
- The text appears at the middle depth of the crystal, not on the glass surface.
- Rear smoke can pass behind it; front smoke can pass in front, but normal readability must never be compromised.
- Text is near-white magical light with subtle blue/violet glow and depth scattering. No display box, border, or ordinary text shadow.

## 9-character smoke behavior
When a 10th character is entered, the oldest visible character dissolves at its position into fine blue-white light particles and smoke. The smoke is drawn deeper into the orb and slightly increases persistent smoke density. Remaining visible characters shift smoothly left; the new character materializes on the right.
Every additional displaced character repeats this.
Backspace is the true reverse: when a previously hidden character re-enters the 9-character window, a portion of smoke condenses into blue-white particles and the character rematerializes at the correct left position; smoke density decreases correspondingly.
The expression state, visible window, and smoke representation must never desynchronize.

## Result animation
Total core transformation ≈ 1.4 s.
On `=`:
1. All visible expression characters nearly simultaneously dissolve into particles/smoke.
2. Existing smoke and new particles draw toward the center.
3. A dense internally illuminated blue-violet smoke formation briefly forms.
4. The complete result materializes essentially simultaneously as one vision from that formation.
5. Excess smoke settles gradually toward the subtle idle level.
The calculator may accept input once the result has materialized; slow residual settling must not block interaction.
`C` aborts this immediately.

## Error / wizard sequence
Mathematical evaluation errors use a dedicated magical sequence, especially division by zero.
- Smoke becomes darker and more turbulent.
- A realistic-fantasy old wizard materializes FROM the smoke in the lower/middle orb.
- Long beard, distinctive old face, mysterious and amused/spitefully playful; not demonic, not horror.
- Head + beard occupy about 55–65% of visible orb height.
- Lower beard/contour remains partly hidden in smoke.
- The gold frame must remain visible.
- Wizard laughs exactly 3 times.
- Visual facial/mouth/head/beard movement must be synchronized to the three laughs.
- Use a purpose-made transparent animation sequence/asset. A static picture merely scaled/rotated/wobbled is unacceptable.
- After the third laugh, wizard dissolves back into smoke/light particles; orb returns to empty idle.
- Entire sequence ≈ 3.5 s.
- `C` immediately cancels everything.

## Audio
Only wizard laughter needs sound in V1. Ordinary buttons and normal result animation are silent.
Laugh: older/deep male fantasy voice, three short clearly separated amused/mocking laugh impulses; relatively quiet, not hysterical or frightening; subtle spatial reverb as if originating inside the orb.
Sound state is persisted locally.

## Candle sound control
A realistic old wax candle in an ornamented brass holder sits lower-right, slightly separated from the main artifact.
- Burning = sound on.
- Extinguished = muted.
- No speaker icon and no label.
- When muted, flame extinguishes and a thin smoke wisp briefly rises from wick.
- When enabled, flame lights again.
- Burning flame moves subtly and irregularly: tiny shape/height/lean/brightness changes, with weak local warm reflections.
- No sparks/exaggerated fantasy fire.
- Candle uses warm natural light, contrasting with cold blue-violet magic.
- Candle position is relative to the artifact bounding box and scales/moves with the composition, but black negative space clearly separates it from the main base.

# ART DIRECTION

## Overall
The UI must read as ONE coherent physical magical artifact. It must NOT look like separate circular HTML buttons arranged around a big circle.
Primary materials:
- timeless nearly flawless magical crystal;
- aged gold/brass physical structure;
- blue/violet/white magical light and smoke.
Gold/brass is physical. Blue/violet/white light and smoke are magical. Keep that material distinction consistent.

## Rendering strategy
Use a HYBRID premium asset approach:
- High-quality custom graphic assets for crystal bodies, ornate aged-metal frames, filigree, base, candle, etc.
- DOM/CSS/JS for interaction/layout/dynamic text.
- Transparent Canvas 2D particle system for reactive smoke.
- Dynamic highlight overlays may sit above the static premium glass assets.
Do not attempt to fake the entire premium look with simple CSS gradients/borders.

## Main crystal sphere
- Perfect geometric circle.
- About 57% of total artifact height.
- Roughly 80–85% of circumference remains visually free of metal.
- Frame grips mainly from below and at a few side points.
- Nearly flawless crystal surface: no visible scratches/cracks/dirt. Very subtle internal irregularity/refraction is fine.
- Base character: deep dark sapphire, transparent to almost black-blue in large regions.
- Violet is an accent mainly in internal reflections, smoke and active magic.
- Selected rim/refraction highlights can reach cyan, ice-blue, near-white.
- Center remains dark enough for luminous text.
- Multiple asymmetric reflections and refraction layers; front/rear depth.
- Idle orb contains only very subtle slow mist; no initial `0`.
- Very subtle internal blue-violet “breathing” illumination. Do not make it obviously pulse.

## Glass layering
Conceptual render stack:
1. rear crystal/light structure
2. rear smoke
3. dynamic luminous expression/result
4. front smoke
5. front glass reflections/highlights
6. gold/brass frame
This is important for depth.

## Small crystal spheres
- Digits and controls are actual strongly convex little glass spheres, not flat discs/cabochons.
- Same sapphire/amethyst family as main orb, but somewhat clearer/brighter for readability.
- Less internal complexity and essentially no permanent smoke.
- Base diameter ≈ 14% of main-orb diameter.
- `=` sphere ≈ 18% of main-orb diameter.
- All other lower controls use the 14% size.
- Each small sphere sits in a fine aged-gold/brass OPEN PRONG SETTING: thin ornamental ring plus 3–4 curved prongs. Preserve maximum visible glass.
- Settings, prongs and support struts must look mechanically/physically connected.

## Digits 0–9
All ten digit spheres lie around the UPPER HALF and predominantly OUTSIDE the main orb. Their glass surfaces must not materially cover the main orb.
Exact symmetry:
- 0 and 9 are the lowest/end points and exactly level with each other.
- 1 mirrors 8; 2 mirrors 7; 3 mirrors 6; 4 mirrors 5.
- The apex/symmetry axis is the EMPTY GAP between 4 and 5. There is no digit at top center.
- Each digit sphere has its own open prong setting.
- Thin individual ornate gold struts connect each setting to the main frame.
- Keep matte-black negative space between the spheres; do NOT use one continuous gold semicircle behind them.

## Lower controls
First lower group follows a shallow symmetric arc around/below the lower half of the main orb:
left side: + and −
center region: C, large =, backspace
right side: × and ÷
The exact visual ordering must preserve: C directly left of `=` and backspace directly right of `=`; +/− live on lower-left; ×/÷ on lower-right.
Below `=` is the secondary row, left-to-right:
`(`   `+/-`   `,`   `)`
All lower control settings are structurally integrated into the base.

## Base / frame
- Massive, clearly readable artifact base under the orb.
- Richly ornamented aged gold/brass construction that visibly supports the main orb and branches organically into the lower control settings.
- Upper digit supports remain comparatively open/filigree; lower base is heavier and load-bearing.
- Symmetric arcane-fantasy ornament language: curved lines, arches, points, abstract filigree.
- NO pentagrams, runes, astrological glyphs, or explicit occult symbols.
- Aged gold/brass: dark recesses/patina, subtle wear, varied gloss, brighter polished edges. Never a flat yellow CSS outline.
- Neutral weak top-side fill light may reveal dark metal detail, but should not read as studio lighting.
- Primary illumination comes from the magical crystals, subtly reflecting onto nearby metal.

## Small-sphere typography
Elegant, lightly calligraphic / rune-adjacent SERIF styling, but restrained and immediately legible. These are normal digits/operators, not fantasy glyph substitutions.
Labels appear to float INSIDE the glass with slight depth and soft blue-white emission, not printed on a web button.

## Interaction visual states
Idle small spheres: mostly still, subtle light only.
Hover: moderately increase internal blue-violet light; slightly brighten part of gold edge; minimally alter glass highlight. Hand cursor. NO size change, border, background rectangle, or large outer aura.
Press/click/key activation: short stronger internal light pulse and subtle reflection sweep on gold; no mechanical depression/bounce.
New input character: materializes directly at final display position from a tiny light/smoke veil; it does NOT fly from the pressed sphere to the orb. Fast typing must not queue/block animations.

## Lighting/background
- Background is absolute matte black.
- No environmental detail.
- Magical crystals are the main light source.
- Very weak neutral top-side fill only to preserve metal relief.
- Candle has a small local warm light zone.
- Glow must remain controlled; do not wash the black background into a visible room.

# LAYOUT / RESPONSIVENESS
- Complete desktop/tablet artifact occupies about 85–90% of usable viewport height, including outer ornament/glow safety bounds.
- Center the full artifact.
- Nothing may clip at viewport edges.
- Treat the entire composition as a proportional object.
- Use a normalized near-square MASTER coordinate system, e.g. 1000×1000 design units. Define positions/radii/spacing in this system and scale the complete composition to the viewport.
- Do not independently rearrange parts at arbitrary CSS breakpoints.
- Desktop/tablet and suitable phone landscape use this standard master.
- Smartphone portrait gets a separately designed normalized portrait master: same visual language and hierarchy, but its own coordinates, tighter/higher digit arc, compact base, large dominant orb.
- Visible mobile spheres need not be enlarged merely for touch. Use generous invisible hit areas where necessary, but adjacent hit areas must never overlap.

# TECHNICAL STRUCTURE
Suggested separation (names may differ if architecture remains clear):
- app/state
- input controller
- tokenizer
- parser
- evaluator
- formatter
- display controller
- animation controller
- smoke/particle renderer
- audio controller
- storage
- layout/master-coordinate system
- asset management
Keep calculation state independent of animation state. The UI must remain recoverable even if an animation is interrupted.

# CANVAS SMOKE
Use transparent Canvas 2D inside the orb.
Create a layered reactive particle system using multiple particle classes, alpha gradients, blur, rotation, scale changes and compositing to suggest volume.
It must support:
- tiny idle mist
- accumulation as hidden characters increase
- character dissolution
- character rematerialization
- central result condensation
- darker/turbulent error smoke
Performance must remain suitable for later smartphones. Respect devicePixelRatio intelligently and avoid uncontrolled particle counts.

# QUALITY / ACCEPTANCE
Functional acceptance includes at least:
- basic arithmetic
- operator precedence
- nested parentheses
- decimal comma/period input
- clean unary negation
- invalid-sequence prevention
- direct/indirect division by zero
- continuation from result
- digit-after-result starts new expression
- repeated equals is idempotent
- 9-character window
- correct smoke accumulation/restoration
- keyboard parity
- persisted sound state
- C cancels result/error/audio at any point

Visual acceptance:
- no generic circular-button appearance
- no simple yellow CSS borders masquerading as gold
- no flat/matte main disc
- digit spheres do not improperly overlap the main crystal
- 4/5 symmetry gap is at exact top axis
- main orb reads as deep crystal with internal content
- base reads as aged ornate metal construction
- all controls feel physically integrated
- result visibly emerges from smoke
- wizard visibly emerges from smoke and genuinely animates
- black background remains clean

# REVIEW GATES
Before calling V1 complete:
1. Run automated/unit tests for tokenizer/parser/evaluator/formatter/state/input behavior.
2. Perform functional interaction test across mouse + keyboard.
3. Perform a dedicated first code review for correctness, security, state/interrupt handling, parser edge cases, and maintainability. Fix findings.
4. Perform a separate second review focused on visual fidelity, responsive geometry, animation synchronization, performance and asset quality. Fix findings.
5. Re-run tests after fixes.
6. Verify at least desktop standard master and smartphone portrait master.
Do not declare completion merely because the calculator calculates correctly. The premium visual target is part of Definition of Done.

# INTENTIONAL FREEDOM
Minor spacing, exact ornament shapes, exact asset file formats, exact particle equations, exact easing curves, and other unconfirmed micro-details may be chosen by the coding agent. Choose them coherently from this brief rather than asking for every cosmetic detail. If an implementation shortcut would materially reduce the specified visual quality, do not take it silently.

## Execution instructions for Codex
Implement this as an engineering task with visual fidelity as a first-class acceptance criterion. Start by inspecting the repository and identifying what can be retained versus replaced. Do not treat the existing rough UI as the target.

First create a short execution plan and requirement-to-component map, then execute it. Prefer small cohesive modules and deterministic state transitions. Calculation state must never depend on animation completion. Cancellation via `C` should be designed as an explicit interrupt/reset path rather than patched into individual animations.

Build and run tests for math/parser/formatter/input/state logic. Exercise rapid input, animation overlap, repeated equals, division-by-zero, and cancellation during result/error sequences.

The art direction explicitly permits high-quality graphic assets. If high-fidelity custom art cannot be generated in your execution environment, implement the layering/layout/asset pipeline correctly and specify exact transparent asset requirements rather than degrading the target into generic CSS gradients. Use procedural/CSS rendering only where it meets the stated quality bar.

Perform two separate self-reviews and fix findings:
- Review 1: correctness, parser/security, state transitions, interruptibility, maintainability.
- Review 2: visual fidelity to this brief, geometry/symmetry, responsive masters, animation synchronization, performance, and obvious placeholder-looking elements.

Final response must include implementation summary, tests/results, review findings/fixes, any genuine remaining limitations, and run instructions.
