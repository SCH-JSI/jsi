import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CAPACITY, questions, profiles, makeLedger, getResult } from './engine.js';

const paths = {
  affinity: ['help', 'independent', 'no', 'decline', 'people', 'connection', 'light'],
  hosted: ['less', 'own', 'no', 'decline', 'institution', 'mission', 'home'],
  platform: ['less', 'support', 'no', 'govern', 'demand', 'mission', 'evidence'],
  festival: ['less', 'support', 'lead', 'cheer', 'project', 'mission', 'scope'],
  free: ['less', 'support', 'no', 'cheer', 'elsewhere', 'outside', 'own'],
};
for (const [key, answers] of Object.entries(paths)) {
  test(`${profiles[key].name} is attainable through plausible commitments`, () => {
    const result = getResult(answers);
    assert.equal(result.primary, key);
    assert.equal(result.deferred.length, 0);
    assert.ok(result.used <= CAPACITY);
  });
}
test('enthusiasm and audience attendance do not qualify as ownership', () => {
  const result = getResult(['attend', 'support', 'audience', 'cheer', 'elsewhere', 'connection', 'own']);
  assert.equal(result.eligible.hosted, false);
  assert.equal(result.eligible.platform, false);
  assert.equal(result.eligible.festival, false);
  assert.equal(result.scores.platform, 0);
  assert.equal(result.scores.hosted, 0);
  assert.ok(result.interests.includes('An enabling platform'));
});
test('platform governance without a demand test does not produce a builder', () => {
  const result = getResult(['less', 'support', 'no', 'accountable', 'elsewhere', 'mission', 'own']);
  assert.equal(result.eligible.platform, false);
  assert.match(result.tension, /did not take on testing demand/);
});
test('demand exploration alone does not imply running infrastructure', () => {
  const result = getResult(['less', 'support', 'no', 'expertise', 'demand', 'mission', 'evidence']);
  assert.equal(result.eligible.platform, false);
  assert.match(result.tension, /have not offered to carry/);
});
test('over-budget roles wait in full and never count as sustained work', () => {
  const result = getResult(['convene', 'own', 'lead', 'accountable', 'demand', 'connection', 'evidence']);
  assert.equal(result.used, 17);
  assert.deepEqual(result.deferred.map(row => row.question), ['platform', 'hours', 'horizon']);
  assert.equal(result.eligible.platform, false);
  assert.equal(result.scores.platform, 0);
  assert.equal(result.commitments.length, 3);
  assert.match(result.tension, /beyond your capacity/);
});
test('exactly twelve units fits, a later positive-cost action waits', () => {
  const result = getResult(['convene', 'own', 'stream', 'govern', 'people', 'connection', 'light']);
  assert.equal(result.ledger[4].used, 12);
  assert.equal(result.ledger[4].covered, true);
  assert.equal(result.ledger[5].covered, true);
  assert.equal(result.ledger[6].covered, false);
});
test('revising earlier commitments releases capacity deterministically', () => {
  const first = getResult(['convene', 'own', 'lead', 'accountable', 'demand', 'mission', 'evidence']);
  const revised = getResult(['less', 'support', 'no', 'accountable', 'demand', 'mission', 'evidence']);
  assert.equal(first.eligible.platform, false);
  assert.equal(revised.primary, 'platform');
  assert.equal(revised.deferred.length, 0);
});
test('invalid selections are rejected', () => { assert.throws(() => makeLedger(['imaginary']), /Invalid answer/); });
test('all 48,000 playthroughs have valid bounded results and all five profiles occur', () => {
  const seen = new Set();
  let count = 0;
  function visit(answers) {
    if (answers.length !== questions.length) {
      for (const item of questions[answers.length].options) visit([...answers, item.id]);
      return;
    }
    count++;
    const r = getResult(answers);
    seen.add(r.primary);
    assert.ok(profiles[r.primary]);
    assert.ok(r.hours.every(Number.isFinite));
    assert.ok(r.hours[0] <= r.hours[1]);
    assert.ok(r.commitments.every(row => row.covered));
    assert.ok(r.commitments.reduce((n, row) => n + row.option.cost, 0) <= CAPACITY);
    assert.ok(r.secondary === null || r.secondary !== r.primary);
    assert.ok(r.ranked.every(key => r.eligible[key]));
    if (r.primary === 'platform') assert.ok(r.eligible.platform);
  }
  visit([]);
  assert.equal(count, 48000);
  assert.deepEqual([...seen].sort(), Object.keys(profiles).sort());
});
test('the game includes no network, storage, analytics or external asset code', async () => {
  const root = new URL('./', import.meta.url);
  for (const file of ['engine.js', 'game.js', 'style.css', 'index.html']) {
    const source = await readFile(new URL(file, root), 'utf8');
    assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|@import/);
  }
});
