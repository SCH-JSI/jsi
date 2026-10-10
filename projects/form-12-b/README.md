# Form 12-B

**Statement of Available Goodwill.** A fictional form, not an official assessment.

A static, individual reflection game for Creative Bureaucrats and Friends. Seven decisions, 12 energy units, five possible profiles. No packages, build, backend, persistence or answer telemetry.

Open `index.html` through any static HTTP server. The ES modules need HTTP rather than a file URL. The JSI shelf discovers this project through the repository root's `projects.json`.

Run `node projects/form-12-b/engine.test.mjs` from the repository root for the 14 checks, including all 48,000 answer combinations, profile qualification rules, capacity boundaries and the absence of answer storage or network code.

## Source and editorial intent

Adapted from the user-supplied **Creative Bureaucrats and Friends — Where are we going?** strategy paper and farewell reflections. The source documents are not published with the game. Their strategic proposals supply scenarios, not instructions to contact organisations or enact a governance model. No real-world offers, funding or commitments are asserted. July 2027 is the paper's planning horizon.

The decisions cover recurring coordination, institutional hosting, bounded event delivery, pilot accountability, external demand, competing uses of time, continuity without output, and a concrete next step. Light networks and graceful exits are legitimate. An event may coexist with another organisational form.

## Capacity and interpretation

`engine.js` holds the questions and pure scoring functions. Choices are evaluated in order. A role crossing the 12-unit budget waits in full; further positive-cost actions also wait. Zero-cost boundaries remain available. Deferred actions are disclosed on the receipt and contribute no profile weight. Earlier answers can be changed; going back clears later decisions so the revised budget is evaluated consistently.

Hosting requires a concrete pathway role. Festival / bounded mission requires a delivery or scoping role. Enabling platform requires both pilot accountability or governance and demand / resource-commitment testing. Passive approval never qualifies for these profiles. No result claims that institutional backing or funding actually exists. Secondary inclination requires at least four points and 55% of the leading eligible score. Ties use a stable order; this is a reflection tool, not a validated assessment.

Time ranges are explicitly labelled planning assumptions. They sum illustrative task ranges in an active month, separately flag intensive event periods, and do not equate energy with hours. The four-hour question contributes a single four-hour block.

## Accessibility and privacy

Native radio controls support keyboard selection. Each new screen focuses its heading. The layout adapts to narrow screens, focus indicators are visible, and reduced-motion preferences are respected. All assets are local. Answers remain in JavaScript memory and disappear on restart or refresh. Sharing copies the canonical game URL only. A separate opt-in control shows exactly which profile summary will be copied, excluding individual answers. Clipboard failure offers selectable text.
