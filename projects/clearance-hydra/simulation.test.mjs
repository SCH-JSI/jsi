import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,transition,revise,advance,issue,finish,metrics,canIssue,sample,options} from './simulation.mjs';
const doActions=(s,ids)=>ids.reduce((v,id)=>transition(v,id).state,s);
const narrow=s=>revise(s,{team:sample(s).team,travel:sample(s).travel,system:'existing',records:'linked',review:'sample'}).state;
const signatures=s=>doActions(s,['sign:priya','sign:sam','sign:alex']);
test('initial task is one email; the desks can be approached independently',()=>{
  const s=createState();assert.equal(s.emails.length,1);assert.equal(s.scope.team,'department');
  for(const [who,id] of [['priya','case'],['sam','authority'],['mei','audit'],['luca','technical'],['jules','report']])assert.ok(options(s,who).some(x=>x.id===id));
});
test('agreement in principle and more paperwork cannot issue the broad change',()=>{
  const s=doActions(createState(),['send','round','authority','ownership','audit','technical','report','automate','paper','chase','sign:priya','sign:sam','sign:mei','sign:luca','sign:jules','sign:alex']);
  assert.equal(s.outcome,null);assert.ok(!canIssue(s));assert.equal(Object.keys(s.signatures).length,0);assert.notEqual(issue(s).state.outcome,'issued');assert.ok(s.positions.sam.text.includes('cross-branch'));
});
test('an actual case supports a small instruction without completing every conversation',()=>{
  for(const variant of [0,1]){let s=doActions(createState(variant),['ownership','case','authority']);s=signatures(narrow(s));assert.equal(metrics(s).ready,100);assert.ok(canIssue(s));assert.equal(issue(s).state.outcome,'issued');for(const key of ['audit','technical','report','round'])assert.equal(s.facts[key],undefined);}
});
test('separate evidence enquiries are a different viable route',()=>{
  let s=doActions(createState(1),['report','technical','authority','audit','ownership']);s=revise(s,{team:'regional',travel:'rail',system:'existing',records:'linked',review:'sample'}).state;s=signatures(s);assert.ok(canIssue(s));assert.equal(s.facts.case,undefined);
});
test('changing only the population is insufficient',()=>{
  let s=doActions(createState(),['case','authority','ownership']);s=revise(s,{team:'regional'}).state;s=signatures(s);assert.ok(!canIssue(s));assert.equal(s.signatures.priya,undefined);
});
test('additional undertakings prevent ownership; withdrawing them permits recovery',()=>{
  let s=doActions(createState(),['ownership','case','authority','dashboard']);s=narrow(s);s=signatures(s);assert.ok(!canIssue(s));assert.equal(s.signatures.priya,undefined);
  s=transition(s,'remove:dashboard').state;s=signatures(s);assert.ok(canIssue(s));assert.ok(s.history.some(h=>h.type==='scope'&&h.label.includes('removed')));
});
test('scope edits invalidate every previous signature',()=>{
  let s=signatures(narrow(doActions(createState(),['ownership','case','authority'])));assert.ok(canIssue(s));s=revise(s,{travel:'all'}).state;assert.deepEqual(s.signatures,{});assert.ok(!canIssue(s));assert.equal(s.positions.sam.kind,'old');
});
test('circulating comments does not overwrite a decision on unchanged wording',()=>{
  let s=signatures(narrow(doActions(createState(),['ownership','case','authority'])));
  s=transition(s,'round').state;
  assert.ok(canIssue(s));assert.equal(s.positions.priya.kind,'signed');assert.equal(s.positions.sam.kind,'signed');
});
test('a risky shortcut requires restoration before any instruction can issue',()=>{
  let s=narrow(doActions(createState(),['ownership','case','authority','bypass']));s=signatures(s);assert.ok(!canIssue(s));s=transition(s,'restore').state;s=signatures(s);assert.ok(canIssue(s));
});
test('work uses time; insufficient remaining time never completes the action',()=>{
  let s=createState();s=transition(s,'round').state;assert.equal(s.remaining,558);s=advance(s,550);const attempted=transition(s,'authority').state;assert.equal(attempted.outcome,'time');assert.equal(attempted.facts.authority,undefined);assert.equal(attempted.remaining,0);
});
test('broad support does not come from grinding the same decision',()=>{
  let s=doActions(createState(),['authority','ownership']);const before=metrics(s).ready;for(let i=0;i<5;i++)s=transition(s,'sign:sam').state;assert.equal(metrics(s).ready,before);assert.equal(s.signatures.sam,undefined);
});
test('timed messages occur once and do not alter the scope without consent',()=>{
  let s=advance(createState(),230);assert.deepEqual(s.extras,[]);assert.equal(s.scope.team,'department');assert.equal(s.events.length,2);const count=s.emails.length;s=advance(s,10);assert.equal(s.emails.length,count);
});
test('finished shifts are immutable and readiness remains in bounds',()=>{
  const s=finish(createState());assert.equal(transition(s,'case').state,s);assert.equal(revise(s,{team:'regional'}).state,s);assert.equal(advance(s,50),s);
  let seed=1847;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
  for(let n=0;n<60;n++){let s=createState(n);for(let i=0;i<40&&!s.outcome;i++){const all=Object.keys(s.chat).concat(['alex','priya','sam','mei','luca','jules']).flatMap(w=>options(s,w));s=transition(s,all[Math.floor(random()*all.length)].id).state;assert.ok(metrics(s).ready>=0&&metrics(s).ready<=100);if(canIssue(s))assert.notEqual(s.scope.team,'department');}}
});
