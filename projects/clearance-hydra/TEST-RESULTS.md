# Clearance Hydra — draft verification

Verified 18 October 2026 (Australia/Sydney).

- **Rules:** 10 Node tests passed, including 80 seeded simulations of up to 80 valid choices each. Readiness, support, assurance and workload remain within 0–100. Unsupported delivery is rejected.
- **Pilot browser playthrough:** manual route, temporary reporting bridge, ten-request scope, evidence, ownership, review and sponsor endorsement reached delivery at 100% readiness. Workload remained 54% to reflect the temporary coordination cost.
- **Wider browser playthrough:** tested configuration and verified export reached delivery at 100% readiness and 10% additional workload. A premature removal reduced readiness; restoring the route recovered it before endorsement and delivery.
- **Timer:** visible countdown, explicit pause and resume, and real ten-minute expiry checked. Expiry produced an unfinished-change debrief rather than a false successful delivery.
- **Persistence:** reload offered resume; a completed shift offered the saved debrief.
- **Debrief download:** browser produced `clearance-hydra-debrief.txt`.
- **Layout:** 1366×768 target desktop and 1280×720 laptop checked; inbox, workspace, chat, timer and readiness remain in one application screen, with scrolling inside panes. 390×844 phone layout checked using inbox/workspace/chat switches and a Finance reply that updated readiness.
- **Visuals:** six local SVG character portraits, local hydra mascot, document and spreadsheet views, and dependency map inspected. Screenshot retained as `preview.jpg`.
- **Browser console:** no errors or warnings captured during the tested playthroughs.
- **Source:** JavaScript syntax checks passed. No external runtime assets or API calls are used.

Not verified across every browser or with a screen reader. Small screens deliberately switch panels rather than displaying all three at once. This draft remains deterministic; alternate outcomes arise from decisions, not random events.
