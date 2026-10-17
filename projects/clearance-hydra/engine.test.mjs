import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,transition,metrics,preconditions,nextAction,options,finish,reportReady,feasible} from './engine.mjs';
const run=(ids,s=createState())=>ids.reduce((s,id)=>transition(s,id).state,s);
const discovery=['review','propose','finance','owner','sheet','audit','record','reporting','tech'];
test('opening is simple and clicking cannot manufacture readiness',()=>{
  let s=createState();assert.equal(s.emails.length,1);assert.deepEqual(s.contacts,['alex']);assert.equal(metrics(s).readiness,0);
  s=run(['deliver','endorse','record','test','review','review']);assert.equal(metrics(s).readiness,0);assert.equal(s.history.length,1);assert.equal(s.outcome,null);
});
test('manual pilot can deliver without the wider rollout configuration',()=>{
  const s=run([...discovery,'manual','bridge','pilot','plan','endorse','deliver']);
  assert.equal(s.outcome,'delivered');assert.equal(metrics(s).readiness,100);assert.equal(s.feasibility,'manual');assert.equal(s.scope,'pilot');assert.equal(metrics(s).workload,54);
});
test('tested route retires shadow entry and supports wider rollout',()=>{
  const s=run([...discovery,'test','feed','full','plan','endorse','deliver']);assert.equal(s.outcome,'delivered');assert.equal(metrics(s).readiness,100);assert.equal(metrics(s).workload,10);
});
test('widening a manual pilot invalidates feasibility and endorsement',()=>{
  const pilot=run([...discovery,'manual','bridge','pilot','plan','endorse']);
  const wider=run(['full'],pilot);assert.ok(metrics(wider).readiness<metrics(pilot).readiness);assert.equal(feasible(wider),false);assert.equal(reportReady(wider),false);assert.equal(wider.endorsement,false);assert.equal(run(['deliver'],wider).outcome,null);
  assert.equal(run(['test','feed','endorse','deliver'],wider).outcome,'delivered');
});
test('rushing introduces a genuine setback and can be repaired',()=>{
  const good=run([...discovery,'test','feed','pilot','plan','endorse']);const rushed=run(['rush'],good);
  assert.ok(metrics(rushed).readiness<metrics(good).readiness);assert.equal(rushed.endorsement,false);assert.ok(!preconditions(rushed));assert.equal(run(['deliver'],rushed).outcome,null);
  assert.equal(run(['repair','endorse','deliver'],rushed).outcome,'delivered');
});
test('dropping reporting reduces readiness; replacement restores support',()=>{
  const good=run([...discovery,'test','feed','pilot','plan','endorse']);const bad=run(['drop'],good);
  assert.ok(metrics(bad).readiness<metrics(good).readiness);assert.ok(metrics(bad).support<metrics(good).support);assert.ok(!preconditions(bad));assert.equal(run(['feed','endorse','deliver'],bad).outcome,'delivered');
});
test('optional working group is not needed; it only adds workload',()=>{
  const s=run([...discovery,'test','feed','pilot','plan']);const committee=run(['committee'],s);
  assert.equal(metrics(s).readiness,metrics(committee).readiness);assert.ok(metrics(committee).workload>metrics(s).workload);assert.equal(metrics(run(['simplify'],committee)).workload,metrics(s).workload);
});
test('discovery does not subtract readiness and available guidance reaches delivery',()=>{
  let s=createState();for(let i=0;i<30&&!s.outcome;i++){const id=nextAction(s),before=metrics(s).readiness;s=transition(s,id).state;if(['sheet','audit','tech'].includes(id))assert.ok(metrics(s).readiness>=before);}
  assert.equal(s.outcome,'delivered');assert.equal(metrics(s).readiness,100);
});
test('finished and timed-out shifts cannot be changed',()=>{
  const s=finish(run(discovery));assert.equal(s.outcome,'time');assert.deepEqual(transition(s,'test').state,s);assert.equal(transition(s,'deliver').state.outcome,'time');
});
test('metrics and gates hold through varied valid decisions',()=>{
  let seed=7919;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let game=0;game<80;game++){let s=createState();for(let step=0;step<80&&!s.outcome;step++){const available=s.contacts.flatMap(who=>options(s,who));if(!available.length)break;const action=available[Math.floor(random()*available.length)].id;s=transition(s,action).state;const m=metrics(s);for(const key of ['readiness','support','assurance','workload'])assert.ok(m[key]>=0&&m[key]<=100,`${key}: ${m[key]}`);if(m.readiness===100)assert.ok(preconditions(s)&&s.endorsement);if(!preconditions(s)||!s.endorsement)assert.equal(transition(s,'deliver').state.outcome,null);}}
});
