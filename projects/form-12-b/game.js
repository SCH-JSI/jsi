import { CAPACITY, GAME_URL, questions, profiles, makeLedger, getResult } from './engine.js';

const main = document.querySelector('#main');
const restart = document.querySelector('#restart');
let answers = [];
let step = -1;
let lastCopied = '';
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function focusHeading() {
  main.querySelector('h1')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function energy(used = 0) {
  const remaining = Math.max(0, CAPACITY - used);
  return `<div class="energy" aria-label="${remaining} of ${CAPACITY} energy units remaining${used > CAPACITY ? `; ${used - CAPACITY} units over budget` : ''}">
    <div class="energy-label"><span>AVAILABLE ENERGY</span><strong>${remaining}<small> / ${CAPACITY}</small></strong></div>
    <div class="energy-cells" aria-hidden="true">${Array.from({ length: CAPACITY }, (_, i) => `<i class="${i < remaining ? 'charged' : ''}"></i>`).join('')}</div>
    <p>${used > CAPACITY ? `${used - CAPACITY} units over. Something has to wait.` : used === CAPACITY ? 'Fully allocated. The calendar is full.' : 'Finite. Non-renewable during this game.'}</p>
  </div>`;
}

function intro() {
  step = -1;
  answers = [];
  document.querySelector('#choice-status').textContent = '';
  document.querySelector('#copy-status').textContent = '';
  restart.hidden = true;
  main.className = 'intro';
  main.innerHTML = `<section class="intro-copy">
    <p class="eyebrow"><span class="tiny-star">✳</span> GOOD INTENTIONS MEET THE CALENDAR</p>
    <h1 tabindex="-1">Form<br><span>12-B.</span><span class="title-dot" aria-hidden="true">↗</span></h1>
    <p class="form-subtitle">Statement of Available Goodwill</p>
    <p class="lead">What are you actually willing to help this collective become?</p>
    <p class="intro-text">The Creative Bureaucrats &amp; Friends Hub has a few possible futures. You have some goodwill. And a finite number of Tuesdays.</p>
    <button class="primary" id="begin" type="button">Open my file <span aria-hidden="true">↗</span></button>
    <p class="play-meta">3–5 MINUTES <span>·</span> 7 DECISIONS <span>·</span> JUST YOU</p>
  </section>
  <aside class="intro-art" aria-label="Your starting resources: 12 energy units, several possible futures, no correct answer">
    <div class="folder-tab" aria-hidden="true">FUTURE OF THE HUB / OPEN FILE</div>
    <div class="folder">
      <div class="paper paper-back" aria-hidden="true"><span>BIG POSSIBILITIES</span><div class="fake-lines"></div></div>
      <div class="paper paper-front">
        <div class="paper-top"><span>CAPACITY ALLOCATION</span><span>01 / YOU</span></div>
        <div class="giant-number">12<span>units of<br>discretionary<br>energy</span></div>
        <div class="art-tokens" aria-hidden="true">${'<i>✳</i>'.repeat(12)}</div>
        <p>Some futures need a conversation.<br>Others need someone on the invoice.</p>
        <div class="paper-signoff"><span>ALLOCATED TO</span><strong>One actual human</strong></div>
      </div>
      <div class="stamp" aria-hidden="true">NO WRONG<br>FUTURE<span>CAPACITY STILL APPLIES</span></div>
    </div>
  </aside>
  <section class="intro-bottom"><div><span class="small-number">01</span><p>Choose what you would <strong>actually do.</strong></p></div><div><span class="small-number">02</span><p>Spend energy. Discover <strong>what comes with it.</strong></p></div><div><span class="small-number">03</span><p>Find the future <strong>your choices can support.</strong></p></div></section>
  <details class="how"><summary>A note on energy, and permission to do less</summary><p>You start with 12 energy units across all seven decisions. Light contributions cost 1; a defined role usually costs 2; leading a sprint costs 3; recurring coordination or accountability costs 4. They represent attention and obligation, not literal hours.</p><p>Energy is allocated in decision order. An action that crosses the budget waits in full, and later actions with a cost wait too. They will be shown under “Needs space” and will not count as commitments you can sustain. Go back to release something if your priorities change.</p><p>There is no high score. Being a light network, finding a home, pursuing a bounded mission, stepping away or allowing the Hub to end can all be legitimate. Nothing here signs you up.</p></details>`;
  main.querySelector('#begin').addEventListener('click', () => { step = 0; renderQuestion(); focusHeading(); });
}

function renderQuestion(focusChoice = false) {
  restart.hidden = false;
  if (!focusChoice) document.querySelector('#choice-status').textContent = '';
  const q = questions[step];
  const selectedId = answers[step];
  const ledger = makeLedger(answers);
  const row = ledger[step];
  const used = ledger.at(-1)?.used || 0;
  const before = step ? makeLedger(answers.slice(0, step)).at(-1)?.used || 0 : 0;
  main.className = `question-layout theme-${q.colour}`;
  main.innerHTML = `<aside class="docket"><div class="docket-head"><p class="eyebrow">YOUR FILE / IN PROGRESS</p><p class="decision-number">${String(step + 1).padStart(2, '0')}<span> / 07</span></p><p class="docket-name">${q.tab}</p></div><div class="docket-budget">${energy(used)}<ol class="steps" aria-label="Game progress">${questions.map((item, i) => `<li class="${i < step ? 'complete' : ''} ${i === step ? 'current' : ''}" ${i === step ? 'aria-current="step"' : ''}><span aria-hidden="true">${i < step ? '✓' : String(i + 1).padStart(2, '0')}</span>${item.tab}</li>`).join('')}</ol></div><p class="docket-foot">No answer is a binding commitment.<br>It is a useful thing to notice.</p></aside>
    <section class="decision"><div class="decision-meta"><span>DECISION ${step + 1} OF 7</span><span class="mini-stamp">${q.stamp}</span></div>
      <h1 tabindex="-1">${q.title}</h1><p class="scenario">${q.text}</p>${q.note ? `<p class="scenario-note">${q.note}</p>` : ''}
      <fieldset><legend>${q.prompt}</legend><div class="choices">${q.options.map((item, i) => `<label class="choice ${item.id === selectedId ? 'selected' : ''}" for="choice-${item.id}"><input type="radio" name="decision" id="choice-${item.id}" value="${item.id}" ${item.id === selectedId ? 'checked' : ''}><span class="choice-letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span class="choice-text">${item.text}</span><span class="choice-cost" aria-label="${item.cost} energy units">${item.cost ? `−${item.cost}` : '0'}<span aria-hidden="true">✳</span></span></label>`).join('')}</div></fieldset>
      <div id="consequence" class="consequence ${row ? 'is-visible' : ''}">${row ? consequence(row, before) : '<span class="consequence-placeholder">A small decision. A real consequence.</span>'}</div>
      <div class="decision-actions"><button type="button" class="text-button back" id="back">← ${step ? 'Previous decision' : 'The beginning'}</button><button type="button" class="primary next" id="next" ${row ? '' : 'disabled'}>${step === 6 ? 'See my Hub mode' : 'File & continue'} <span aria-hidden="true">→</span></button></div>
    </section>`;
  main.querySelectorAll('input[name="decision"]').forEach(input => input.addEventListener('change', () => {
    answers = [...answers.slice(0, step), input.value];
    renderQuestion(true);
    document.querySelector('#choice-status').textContent = document.querySelector('#consequence').textContent;
  }));
  main.querySelector('#back').addEventListener('click', () => {
    if (step === 0) intro();
    else { answers = answers.slice(0, step); step--; renderQuestion(); }
    focusHeading();
  });
  main.querySelector('#next').addEventListener('click', () => {
    if (!row) return;
    if (step === questions.length - 1) renderResult();
    else { step++; renderQuestion(); }
    focusHeading();
  });
  if (focusChoice) main.querySelector('input:checked')?.focus({ preventScroll: true });
}

function consequence(row, before) {
  let note = '';
  if (!row.covered) note = `<div class="capacity-warning"><strong>Needs space.</strong> You have used the time you said you had. Something else now has to wait.<span>This action needs ${row.option.cost} units; ${row.available} remained. It waits in full and will not count towards your profile. Go back to release another commitment, or continue to see the trade-off.</span></div>`;
  else if (row.used >= CAPACITY && before < CAPACITY) note = '<div class="capacity-warning"><strong>Fully allocated.</strong> You have used the time you said you had. Something else now has to wait.</div>';
  const label = row.covered ? 'CONSEQUENCE NOTED' : 'IF YOU MADE ROOM';
  return `<span class="consequence-label">↳ ${label}</span><p>${row.option.consequence}</p>${note}`;
}

function timeText(result) {
  const [low, high] = result.hours;
  const ordinary = high === 0 ? 'No regular monthly hours taken on' : low === high ? `Roughly ${low} hours in a month when these tasks are active` : `Roughly ${low}–${high} hours in a month when these tasks are active`;
  return `${ordinary}${result.burst ? ', plus a separate event or sprint period' : ''}.`;
}

function renderResult() {
  step = questions.length;
  document.querySelector('#choice-status').textContent = '';
  const result = getResult(answers);
  const profile = profiles[result.primary];
  const other = result.secondary ? profiles[result.secondary] : null;
  const title = `${profile.name}${other ? ` + ${other.name}` : ''}`;
  const summary = `My current Hub mode: ${title}. ${profile.description}${result.deferred.length ? ' Some choices exceeded my available capacity.' : ''} A reflection from Form 12-B — not a commitment or assessment. ${GAME_URL}`;
  main.className = `results theme-${profile.colour}`;
  main.innerHTML = `<section class="result-hero"><div><p class="eyebrow">YOUR CURRENT HUB MODE</p><h1 tabindex="-1">${profile.name}<span class="result-dot">.</span></h1>${other ? `<p class="secondary">with an inclination towards <strong>${other.name}</strong></p>` : ''}<p class="result-description">${profile.description}</p></div><div class="result-seal" aria-hidden="true"><span>${profile.mark}</span><strong>PROVISIONALLY<br>YOU</strong><small>SUBJECT TO ACTUAL TUESDAYS</small></div></section>
    ${result.tension ? `<div class="tension"><span aria-hidden="true">↳</span><p>${result.tension}</p></div>` : ''}
    <div class="result-grid"><section class="receipt"><div class="receipt-header"><span>YOUR CAPACITY RECEIPT</span><span>NO. 007</span></div><h2>What you actually<br>volunteered for</h2><p class="small-print">In the game. Conditional roles keep their conditions.</p>
      <ul class="commitment-list">${result.commitments.length ? result.commitments.map(row => `<li><span class="yes" aria-label="Included">✓</span><span>${row.option.commitment}</span></li>`).join('') : '<li><span class="yes">✓</span><span>No new delivery obligations. That is a legitimate boundary.</span></li>'}</ul>
      ${result.deferred.length ? `<div class="waiting"><h3>Needs space</h3><p>You chose these, but the budget could not hold them.</p><ul>${result.deferred.map(row => `<li>↳ ${row.option.commitment || row.option.text}</li>`).join('')}</ul></div>` : ''}
      <h3 class="not-heading">You have not taken on</h3><ul class="commitment-list not-list">${result.notTaken.map(text => `<li><span aria-label="Not included">×</span><span>${text}</span></li>`).join('')}</ul>
      <div class="time-estimate"><span class="eyebrow">TIME IMPLIED BY YOUR CHOICES</span><p>${timeText(result)}</p><small>An illustrative planning range, not a forecast. The four-hour choice is one block next month; other tasks may overlap. Sprint intensity needs a separate agreement.</small></div>
      <div class="receipt-total"><span>ENERGY REQUESTED</span><strong>${result.used} / 12</strong></div>
    </section>
    <div class="result-notes"><section class="compatible"><p class="eyebrow">WHAT YOUR ANSWERS CAN SUPPORT</p><h2>Compatible Hub forms</h2><ol>${result.ranked.slice(0, 3).map(key => `<li><h3>${profiles[key].form}</h3><p>${profiles[key].needs}</p></li>`).join('')}</ol><p class="small-print">A ranking of your accepted choices, not a verdict on the group. Festival work can coexist with another form. Forms without a sustaining role are left off this list.</p></section>
      ${result.interests.length ? `<section class="interest-note"><h3>Appealing, but not volunteered for</h3><p>${result.interests.join('; ')}. Interest does not supply the missing owner.</p></section>` : ''}
      <section class="reflection"><span class="eyebrow">ONE QUESTION TO TAKE WITH YOU</span><h2>${result.deferred.length ? 'Which commitment would you release to make room for the future you care about most?' : profile.question}</h2><p>No need to answer here. It might be a useful conversation.</p></section>
    </div></div>
    <div class="result-actions"><button type="button" class="primary" id="again">Play again <span aria-hidden="true">↺</span></button><button type="button" class="secondary-button" id="share">Copy game link ↗</button><button type="button" class="text-button" id="revise">← Review last choice</button></div>
    <details class="copy-profile"><summary>Optional: copy a short profile</summary><p>Only the text below will be copied. Your individual answers and capacity receipt are not included.</p><blockquote>${esc(summary)}</blockquote><button type="button" class="secondary-button" id="copy-profile">Copy this profile</button></details>
    <div id="copy-feedback" role="status" aria-live="polite"></div>
    <details class="how scoring"><summary>How was this result worked out?</summary><p>Choices add weight to possible Hub forms. Enthusiasm alone adds no weight. A hosted result needs an accepted role developing the institutional pathway. A festival result needs ownership of a bounded task or mission. An enabling-platform result needs both pilot accountability or governance and a contribution to testing demand or partner commitments.</p><p>Only actions within the 12-unit budget count. Light participation and connection can support an affinity result; choosing work elsewhere or an ending supports a Free Agent result. The strongest eligible form comes first. A secondary inclination appears when it has substantial support. This is a deliberately simple reflection device, not a validated assessment.</p></details>`;
  main.querySelector('#again').addEventListener('click', () => { intro(); focusHeading(); });
  main.querySelector('#revise').addEventListener('click', () => { step = questions.length - 1; renderQuestion(); focusHeading(); });
  main.querySelector('#share').addEventListener('click', () => copyText(GAME_URL, 'Game link copied. No answers included.'));
  main.querySelector('#copy-profile').addEventListener('click', () => copyText(summary, 'Short profile copied. Individual answers are not included.'));
}

async function copyText(text, message) {
  const feedback = document.querySelector('#copy-feedback');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    feedback.textContent = message;
    lastCopied = message;
    document.querySelector('#copy-status').textContent = lastCopied;
  } catch {
    feedback.innerHTML = `<label for="manual-copy">Copying is unavailable here. Select and copy this text:</label><textarea id="manual-copy" readonly rows="4">${esc(text)}</textarea>`;
    feedback.querySelector('textarea').focus();
    feedback.querySelector('textarea').select();
  }
}

restart.addEventListener('click', () => { intro(); focusHeading(); });
intro();
