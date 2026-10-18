# Clearance Hydra

One approval to remove. Ten minutes until the meeting. A game set in a fictional Australian Government workplace.

## Play and share

Serve this directory over HTTP/HTTPS and open index.html. This is buildless HTML, CSS and JavaScript; opening the HTML directly as a file is unsupported because it uses ES modules. Keep its relative assets together.

The JSI shelf entry is in projects.json. No account, API key, external font or third-party runtime is needed. No player data is sent to a server. Browser storage remembers the current shift, unfiled wording and latest debrief. The player can download a text record.

The draft lives on codex/clearance-hydra. Publish to main only after explicit approval of its preview, following .claude/skills/publish-jsi/SKILL.md. Do not publish the unrelated application at the parent workspace root.

## Design and rules (contains spoilers)

The six desks can be approached in any order. Clearance rounds, consolidated papers and extra commitments can produce supportive correspondence without an executable decision. There is no next-action prompt, recommended scope, or colour-coded correct answer.

The player edits six parts of an instruction. A viable change fits a named team's limited travel, existing routing, retained financial authority, linked records and a review condition. Evidence can come from a completed booking matching one of two shift variants, or from separate audit, systems and reporting enquiries. Priya, Sam and Alex must sign the same version. Changes to wording or commitments invalidate earlier signatures.

Three optional undertakings expand the workload. They must be negotiated back out if accepted. A premature shortcut can stop the booking queue; restoration makes recovery possible. Broad cross-branch changes depend on owners and release decisions unavailable before the meeting.

The ten-minute clock advances with real play time and explicit action costs. Pause is available. Incoming requests arrive at fixed points but never change scope automatically. A premature issue is returned; time expiry and voluntary departure produce an unfinished debrief. The explanation of the scope trap appears after the shift.

Readiness measures the current instruction, not the number of conversations completed. It combines boundary (18), authority (12), records (12), route (14), reporting (10), owner (14), finance (10), review (6) and sponsor (4), for a maximum of 100.

## Files and checks

- simulation.mjs: state, scenarios, choices, costs and decision rules.
- screen.js: stable desk shell, papers, correspondence and persistence.
- interface.css: responsive office layout, reduced-motion support.
- portraits.js and hydra.svg: local vector artwork.
- preview.jpg: current sharing image.

Run from this directory:

    node --test simulation.test.mjs
    node --check screen.js

Browser verification is recorded in TEST-RESULTS.md. Scenario policies and records are fictional.
