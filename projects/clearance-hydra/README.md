# Clearance Hydra

A ten-minute, single-workspace game set in the fictional Australian Government Department of Everyday Possibilities. The player must remove a duplicate travel approval while preserving financial authority, evidence, reporting and a practical booking route.

## Play and share

Serve this directory with a static HTTP server and open `index.html`. It is buildless HTML, CSS and JavaScript. ES modules require HTTP/HTTPS; opening the HTML directly as a file is not supported.

The JSI shelf entry is in the repository's `projects.json`, at `projects/clearance-hydra/`. Keep relative asset paths intact when copying the directory. No API key, AI service, account, external font or third-party runtime asset is required. No player data is sent to a server. Optional browser storage remembers a shift or the latest debrief; a text debrief can also be downloaded.

The public shelf is updated only after approval of the draft preview, following the repository's `publish-jsi` workflow. This project is prepared on `codex/clearance-hydra`; do not publish the unrelated application at the parent workspace root.

## Simulation

- Six illustrated colleagues: Alex (Director), Priya (Operations), Sam (Finance), Mei (Assurance), Luca (ICT), Jules (Reporting).
- Three major dependencies: a shadow spreadsheet, an inherited audit workaround and a booking trigger.
- Two viable outcomes: a ten-request manual pilot with a temporary reporting handover, or a staged wider rollout using a tested configuration and verified export.
- Recoverable mistakes: bypassing the branch step prematurely, dropping reporting without a replacement, and adding an unnecessary working group.
- Ten-minute real elapsed timer during play; explicit pause; expiry and voluntary early finish generate a debrief without claiming delivery.

Readiness is computed from actual conditions, with these weights (100 total): duplication confirmed 10; financial authority 12; process ownership 12; evidence control 12; scope-appropriate reporting 14; feasibility 12; chosen scope 6; Finance/Operations/Reporting support 4 each; review and rollback 5; endorsement 5. Broken implementation invalidates affected conditions. Discovery itself does not subtract readiness. Scope changes invalidate endorsement and can invalidate feasibility/reporting. Optional exploration is not required for success.

`engine.mjs` contains rules and scenario content. `app.js` renders the workspace, local portraits and interactions. `style.css` controls the responsive layout. `hydra.svg` is the local mascot. `preview.jpg` is a screenshot for sharing.

## Checks

From this project directory:

```sh
node --test engine.test.mjs
node --check app.js
```

The tests cover readiness bounds, both delivery routes, scope changes, reporting failure, shortcut recovery, optional work, unavailable/repeated decisions and ended shifts. Browser checks are recorded in `TEST-RESULTS.md`.

This is a deterministic scenario and a first playable draft, not an open-ended AI conversation. All policies and records are fictional scenario material, not current government advice.
