// Clearance Hydra: deterministic, browser-independent simulation rules.
export const people = {
  alex: {name:'Alex Morgan', role:'Director · Service Improvement', short:'Director', colour:'#FFD85A'},
  priya: {name:'Priya Rao', role:'Operations · Travel process owner', short:'Operations', colour:'#B7EFE3'},
  sam: {name:'Sam Okafor', role:'Finance · Delegations adviser', short:'Finance', colour:'#BBD9FF'},
  mei: {name:'Mei Chen', role:'Assurance · Records & audit', short:'Assurance', colour:'#E0CFFF'},
  luca: {name:'Luca Bennett', role:'ICT · Workflow specialist', short:'ICT', colour:'#FFCCC5'},
  jules: {name:'Jules Williams', role:'Reporting · Executive insights', short:'Reporting', colour:'#D9E9A6'},
};
export const initialEmail = {id:'brief',from:'alex',subject:'One small improvement. Before 10?',preview:'Can we lose the duplicate branch approval?',body:[
  'Morning! A routine travel request goes through a manager, a branch check and a financial delegate before anyone can book a train. The branch check looks like a duplicate.',
  'Can you work out what we can safely remove? You have ten minutes before our improvement huddle. A practical pilot is fine; a bigger change is welcome if it is actually ready.',
  'Please keep the necessary authority, an evidence trail and a way to know whether this helped. Surely this one will be straightforward.',
],attachment:'process'};
export const documents = {
  delegation:{title:'Travel authority · working extract',kind:'POLICY NOTE',from:'sam',body:[
    'In this fictional department, the manager confirms business need. The authorised financial delegate approves the commitment before a booking is made. The booking record must link back to that decision.',
    'The branch check is a local administrative step. It does not itself confer financial authority. Removing it is possible if its other useful functions are accounted for.',
    'For the pilot: routine domestic travel only, within existing delegation limits. Exclude international travel, unusual expenses and conflicts of interest. Send exceptions through the existing route.',
  ],note:'Scenario material, not a statement of current government policy.'},
  sheet:{title:'Travel tracker FINAL_v7 · extract',kind:'SPREADSHEET',from:'priya',body:[
    'Priya copies each branch approval into a local workbook. Jules uses its cost-centre and exception columns for the weekly executive note. The workbook records the branch timestamp, not the delegate’s decision.',
    'The branch check makes the spreadsheet look authoritative. In practice, its useful job is collecting reporting fields. Approval and reporting can be separated.',
  ],table:[['Request','Cost centre','Exception','Branch check'],['TR-1042','Service design','No','Complete'],['TR-1043','Regional delivery','Accessibility','Waiting'],['TR-1044','Service design','No','Complete']],note:'The reporting need is real. This particular spreadsheet is not sacred.'},
  audit:{title:'What the old audit actually found',kind:'ASSURANCE FILE',from:'mei',body:[
    'A previous review could not connect some bookings to the delegate who authorised them. The branch check was added as a local response. The recommendation was to preserve evidence of authority, not to add a second decision forever.',
    'A sound replacement retains a request ID, the delegate decision, its timestamp and the booking reference in the existing records system. Restrict access using the current permissions.',
    'Keep the evidence trail. Test a sample. Stop the pilot if a booking has no linked authority. An inbox or a personal spreadsheet is not the records system.',
  ]},
  technical:{title:'Workflow change · feasibility note',kind:'TECHNICAL NOTE',from:'luca',body:[
    'The live workflow uses a branch-complete flag to unlock booking and populate the reporting export. Deleting the branch step alone would strand approved requests.',
    'Pilot route: Priya can route ten eligible requests using a documented checklist while the existing booking and records systems stay in place. This has a coordination cost, but needs no production release.',
    'Wider route: switch the trigger to delegate-approved, test the booking gate and verify the existing reporting export. A tested configuration change is feasible; a brand-new platform is not.',
  ]},
  reporting:{title:'The executive note · minimum useful data',kind:'MEETING NOTE',from:'jules',body:[
    'Jules needs approved spend by cost centre and a short list of exceptions each week. They do not need a separate branch approval or a new dashboard.',
    'An existing delegate-approved export contains the fields. Luca can verify it for the wider rollout. For a small pilot, Priya can reconcile a temporary extract against the delegate records.',
    'Keep the routine return small. Stop the shadow workbook only when the replacement has an owner, a checked sample and a reliable handover.',
  ]},
  pilot:{title:'Two weeks. Ten requests. A real test.',kind:'PILOT CARD',from:'alex',body:[
    'Scope: ten routine domestic travel requests from one team over two weeks. Keep the manager, financial delegate and booking record. Exclude exceptions from the simplified route.',
    'Priya owns the process. Measure elapsed time, missing authority links, reporting completeness and staff effort. Compare with the existing route.',
    'Review after the first three requests and at two weeks. Restore the original route if authority evidence is missing, reporting breaks or the temporary work is unsustainable.',
  ]},
};
export function createState(){return {reviewed:false,proposed:false,duplicate:false,delegation:false,owner:false,audit:false,record:false,sheet:false,reporting:false,reportChoice:null,tech:false,feasibility:null,scope:null,plan:false,endorsement:false,rushed:false,repairDone:false,extraCommittee:false,history:[],contacts:['alex'],chat:{alex:[{text:'Welcome to the Department of Everyday Possibilities. One less approval. How hard can it be?',incoming:true}]},emails:[initialEmail],outcome:null};}
const say=(s,who,text)=>{if(!s.contacts.includes(who))s.contacts.push(who);(s.chat[who]??=[]).push({text,incoming:true});};
const email=(s,id,from,subject,preview,body,attachment)=>{if(!s.emails.some(e=>e.id===id))s.emails.unshift({id,from,subject,preview,body,attachment});};
const actions = {
  review:{who:'alex',label:'Review the five-step process',detail:'Find where the extra approval sits.',when:s=>!s.reviewed,run:s=>{s.reviewed=true;},notice:'Five steps. Three checks. Start with the branch approval.',view:'process'},
  propose:{who:'alex',label:'Propose removing the branch check',detail:'Ask what this step is doing before changing it.',when:s=>s.reviewed&&!s.proposed,run:s=>{s.proposed=true;say(s,'sam','Quick question: have you checked who holds the financial delegation? “Approval” is doing a lot of work in that diagram.');say(s,'priya','I run the travel queue. There is also a spreadsheet nobody puts in the process map…');email(s,'finance','sam','A check is not a delegation','Keep the authority. Question the duplicate.',['The manager confirms business need. The delegate authorises the commitment. The branch check is local, but check what relies on it before removing it.'],'delegation');},notice:'Finance and Operations have entered the chat.',view:'process',chat:'sam'},
  finance:{who:'sam',label:'Which approval is actually required?',detail:'Separate financial authority from the local branch check.',when:s=>s.proposed&&!s.delegation,run:s=>{s.duplicate=true;s.delegation=true;say(s,'sam','Keep the manager’s business-need check and the authorised delegate. The extra branch check is not our requirement. My support is conditional on keeping those controls.');say(s,'mei','Before anyone bins the branch check, there is an old audit finding worth reading. It is more specific than people remember.');email(s,'audit','mei','RE: “Audit says we have to”','That is not quite what the finding said.',['The missing link was evidence of authority, not another signature. Let’s protect the actual control.'],'audit');},notice:'Duplication confirmed. Financial authority stays.',chat:'sam'},
  owner:{who:'priya',label:'Who can own the changed process?',detail:'Give the work a named owner, including exceptions.',when:s=>s.proposed&&!s.owner,run:s=>{s.owner=true;say(s,'priya','I can own it, including exceptions and the review. Alex sponsors the change; I own the process. Please do not give the exceptions to a shared mailbox and hope.');},notice:'A real owner: Priya will own the route and exceptions.'},
  sheet:{who:'priya',label:'Show me the spreadsheet',detail:'Find out who still uses the branch check.',when:s=>s.proposed&&!s.sheet,run:s=>{s.sheet=true;say(s,'priya','Here it is. I copy approvals into it, then Jules uses it for the weekly note. Removing a click will not remove my copying.');say(s,'jules','Hello! I need cost centres and exceptions for the executive note. I do not need everyone’s travel itinerary.');email(s,'sheet','priya','Before you change anything…','Can we talk about the spreadsheet?',['This workbook is the unofficial bridge from travel requests to executive reporting. Can we replace its useful job, not just delete it?'],'sheet');},notice:'HYDRA HEAD REVEALED · The shadow spreadsheet',doc:'sheet',chat:'priya'},
  audit:{who:'mei',label:'What did the audit finding require?',detail:'Read the purpose behind the control.',when:s=>s.delegation&&!s.audit,run:s=>{s.audit=true;say(s,'mei','It found bookings without a linked delegate decision. The branch check was our workaround. Keep the request-to-decision-to-booking trail and we can simplify.');},notice:'HYDRA HEAD REVEALED · An inherited audit workaround',doc:'audit'},
  record:{who:'mei',label:'Keep linked evidence in the records system',detail:'Preserve request ID, delegate decision and booking reference.',when:s=>s.audit&&!s.record,run:s=>{s.record=true;say(s,'mei','That protects the actual control. Sample the first three requests and stop if any authority link is missing. I support a change on that basis.');},notice:'Essential control protected. Fewer checks, traceable authority.'},
  reporting:{who:'jules',label:'What information do you actually use?',detail:'Agree the minimum useful reporting requirement.',when:s=>s.sheet&&!s.reporting,run:s=>{s.reporting=true;say(s,'jules','Approved spend by cost centre and a short exceptions list. That is all. The delegate export should have it. Give me a checked handover and retire the duplicate tracker.');say(s,'luca','The workflow is wired to the branch-complete flag. We will need a practical route around that. I have two options.');email(s,'tech','luca','A small flag with a surprisingly large job','Booking and reporting share a workflow trigger.',['The branch-complete flag unlocks booking. A process change needs either a bounded manual route or a tested configuration change.'],'technical');},notice:'Reporting need clarified. The spreadsheet can be replaced.',doc:'reporting'},
  tech:{who:'luca',label:'Trace the booking dependency',detail:'Check what happens when the branch step disappears.',when:s=>s.reporting&&!s.tech,run:s=>{s.tech=true;say(s,'luca','Deleting the box will leave booking locked. A ten-request manual pilot is workable. For wider rollout, I can test a configuration change using the delegate-approved flag.');},notice:'HYDRA HEAD REVEALED · The hidden booking trigger',doc:'technical'},
  manual:{who:'luca',label:'Use a bounded manual pilot',detail:'Fast to start. More temporary coordination work.',when:s=>s.tech&&s.feasibility!=='manual',run:s=>{s.feasibility='manual';s.endorsement=false;say(s,'luca','Ten requests, one team, existing systems. Priya will need to reconcile the handover. This is feasible for a pilot, not a department-wide launch.');},notice:'Manual route agreed. Small scope matters.'},
  test:{who:'luca',label:'Test the existing workflow configuration',detail:'Reuse the delegate flag; check booking, records and export.',when:s=>s.tech&&s.feasibility!=='tested',run:s=>{s.feasibility='tested';s.endorsement=false;say(s,'luca','Test complete: eligible requests unlock after the delegate decision, authority links persist and the reporting export reconciles. This uses our existing workflow, not a new platform.');email(s,'test','luca','Configuration test: passed','Booking, authority links and export all checked.',['The delegate-approved trigger passed the scenario test. Priya can schedule the controlled change with a rollback route.'],'technical');},notice:'Configuration test passed. The practical dependency is resolved.'},
  bridge:{who:'jules',label:'Agree a temporary reporting handover',detail:'Priya reconciles ten requests. Jules checks the first extract.',when:s=>s.reporting&&s.feasibility&&s.reportChoice!=='bridge',run:s=>{s.reportChoice='bridge';s.endorsement=false;say(s,'jules','Agreed for ten requests. Priya sends a checked extract; I verify the first return. Retire the shadow tracker for those requests. Review the extra effort at two weeks.');},notice:'Pilot reporting protected. Temporary workload remains.'},
  feed:{who:'jules',label:'Replace the tracker with the verified export',detail:'Use the tested workflow and stop duplicate data entry.',when:s=>s.reporting&&s.feasibility==='tested'&&s.reportChoice!=='feed',run:s=>{s.reportChoice='feed';s.endorsement=false;say(s,'jules','The sample matches. I own the weekly return from the existing export; Priya can stop re-keying these requests. One useful dataset, no extra approval.');},notice:'Hidden workload eliminated. Reporting has a reliable owner.'},
  drop:{who:'jules',label:'Stop the tracker without a replacement',detail:'Saves effort now, but the executive return will have a gap.',when:s=>s.reporting&&s.reportChoice!=='drop',run:s=>{s.reportChoice='drop';s.endorsement=false;say(s,'jules','We have lost the source for the weekly note. I cannot support this until we have a replacement. We can still fix it with an extract or the verified export.');email(s,'gap','jules','Reporting gap — please recover','The old source went before the new one existed.',['The return still has a useful purpose. Agree a temporary extract or verify the existing export.'],'reporting');},notice:'Reporting gap introduced. Agree a replacement to recover.'},
  pilot:{who:'alex',label:'Choose a ten-request pilot',detail:'One team, two weeks. Routine domestic travel only.',when:s=>s.proposed&&s.scope!=='pilot',run:s=>{s.scope='pilot';s.endorsement=false;say(s,'alex','A useful smaller change is absolutely a result. Ten requests, clear boundaries, then learn.');},notice:'Scope set: ten routine requests, one team, two weeks.',doc:'pilot'},
  full:{who:'alex',label:'Prepare a wider routine-travel rollout',detail:'Needs the tested workflow and verified reporting export.',when:s=>s.proposed&&s.scope!=='full',run:s=>{s.scope='full';s.endorsement=false;say(s,'alex','A wider change is possible, but a manual workaround will not scale. Show me the tested trigger, verified export and a staged release.');},notice:'Scope widened. Feasibility now requires a tested automated route.'},
  plan:{who:'priya',label:'Agree review measures and a rollback',detail:'Track delay, missing links, reporting completeness and effort.',when:s=>s.owner&&s.scope&&!s.plan,run:s=>{s.plan=true;say(s,'priya','I will review the first three requests and the two-week result. Missing authority, incomplete reporting or unsustainable effort means restore the old route. Wider rollout will start with one team.');},notice:'Implementation plan agreed. Measure, review and recover.'},
  rush:{who:'alex',label:'Remove the branch check immediately',detail:'A tempting shortcut: the booking and reporting links may break.',when:s=>s.proposed&&!s.rushed&&!s.repairDone,run:s=>{s.rushed=true;s.endorsement=false;say(s,'alex','It looks faster on paper, but Operations says bookings are stuck. Please restore a working route before we call this delivered.');email(s,'incident','priya','Urgent: the diagram is shorter. The queue is not.','Requests no longer reach a working booking route.',['Removing the step before checking its dependencies introduced a real implementation gap. Restore the route, then agree a viable replacement.'],'technical');},notice:'Shortcut backfired. The booking route is broken.',view:'process'},
  repair:{who:'alex',label:'Restore the route and acknowledge the gap',detail:'Recover trust, then implement the agreed replacement.',when:s=>s.rushed,run:s=>{s.rushed=false;s.repairDone=true;say(s,'alex','Thank you for catching it and restoring the route. Let’s finish the dependency work before trying again. Recovery counts.');},notice:'Working route restored. The proposed improvement is still available.'},
  committee:{who:'alex',label:'Create a new approvals working group',detail:'Adds coordination work without resolving a control.',when:s=>s.proposed&&!s.extraCommittee,run:s=>{s.extraCommittee=true;say(s,'alex','Six people now have a recurring meeting. They still need the same evidence, owner and practical route. You can replace the meeting with Priya’s short review.');},notice:'A new meeting exists. The implementation blockers are unchanged.'},
  simplify:{who:'alex',label:'Replace the working group with Priya’s review',detail:'Keep accountability and remove the extra meeting.',when:s=>s.extraCommittee&&s.plan,run:s=>{s.extraCommittee=false;say(s,'alex','Agreed. Priya owns the review and escalates actual exceptions. No standing working group needed.');},notice:'Coordination work removed. Accountability stays.'},
  endorse:{who:'alex',label:'Ask Alex to endorse the change',detail:'Confirm scope, ownership, controls and practical delivery.',when:s=>preconditions(s)&&!s.endorsement,run:s=>{s.endorsement=true;say(s,'alex','Endorsed. The right controls stay, the duplicate check goes, and someone owns what happens next. You can deliver from the proposal.');email(s,'endorsed','alex','Endorsed — ready to deliver','This is a change we can stand behind.',['The agreed scope, authority trail, reporting route and rollback are in place. Record the decision and deliver from your proposal.']);},notice:'Change endorsed. Ready to deliver.',view:'proposal'},
};
export function options(s,who){return Object.entries(actions).filter(([,a])=>a.who===who&&a.when(s)).map(([id,a])=>({id,label:a.label,detail:a.detail}));}
export function preconditions(s){return s.duplicate&&s.delegation&&s.owner&&s.record&&reportReady(s)&&feasible(s)&&s.scope&&s.plan&&!s.rushed;}
export function feasible(s){return !!s.feasibility&&(s.scope!=='full'||s.feasibility==='tested');}
export function reportReady(s){return s.reporting&&['feed','bridge'].includes(s.reportChoice)&&(s.reportChoice!=='feed'||s.feasibility==='tested')&&(s.scope!=='full'||s.reportChoice==='feed');}
export function metrics(s){
  const support=Math.max(0,Math.min(100,36+(s.delegation?14:0)+(s.owner?14:0)+(s.record?12:0)+(reportReady(s)?14:0)+(s.endorsement?10:0)-(s.rushed?24:0)-(s.reportChoice==='drop'?14:0)));
  const readiness=Math.max(0,(s.duplicate?10:0)+(s.delegation&&!s.rushed?12:0)+(s.owner?12:0)+(s.record&&!s.rushed?12:0)+(reportReady(s)&&!s.rushed?14:0)+(feasible(s)&&!s.rushed?12:0)+(s.scope?6:0)+(s.delegation?4:0)+(s.owner?4:0)+(reportReady(s)?4:0)+(s.plan?5:0)+(s.endorsement?5:0));
  return {readiness,support,assurance:Math.max(0,16+(s.delegation?24:0)+(s.audit?12:0)+(s.record?28:0)+(s.plan?20:0)-(s.rushed?40:0)),workload:Math.min(100,Math.max(10,28+(s.sheet&&!reportReady(s)?14:0)+(s.feasibility==='manual'?18:0)+(s.reportChoice==='bridge'?12:0)+(s.extraCommittee?22:0)+(s.rushed?22:0)-(s.reportChoice==='feed'?14:0)-(s.plan?4:0))),progress:s.outcome==='delivered'?100:s.rushed?80:s.proposed?Math.min(90,20+(s.scope?15:0)+(s.feasibility?25:0)+(s.plan?20:0)):0};
}
export function blockers(s){return [
  !s.delegation&&{text:'Confirm which authority must stay',who:'sam'},
  !s.owner&&{text:'Name the process owner',who:'priya'},
  !s.record&&{text:'Protect the authority evidence trail',who:'mei'},
  !reportReady(s)&&{text:'Agree a reporting replacement that fits the scope',who:s.sheet?'jules':'priya'},
  !feasible(s)&&{text:'Make the booking route feasible',who:s.reporting?'luca':'priya'},
  !s.scope&&{text:'Choose a realistic scope',who:'alex'},
  !s.plan&&{text:'Agree review measures and rollback',who:'priya'},
  s.rushed&&{text:'Restore the broken booking route',who:'alex'},
  !s.endorsement&&{text:'Obtain the sponsor’s endorsement',who:'alex'},
].filter(Boolean);}
export function nextAction(s){
  if(!s.reviewed)return 'review';if(!s.proposed)return 'propose';if(s.rushed)return 'repair';if(!s.delegation)return 'finance';if(!s.owner)return 'owner';if(!s.sheet)return 'sheet';if(!s.audit)return 'audit';if(!s.record)return 'record';if(!s.reporting)return 'reporting';if(!s.tech)return 'tech';if(!s.feasibility||!feasible(s))return 'test';if(!reportReady(s))return s.feasibility==='tested'?'feed':'bridge';if(!s.scope)return 'pilot';if(!s.plan)return 'plan';if(!s.endorsement)return 'endorse';return 'deliver';
}
export function actionInfo(id){return actions[id]||{who:'alex',label:'Deliver the agreed change',detail:'Put the endorsed proposal into effect.'};}
export function milestones(s){return [
  {name:'Understand',full:'Understand the problem',done:s.duplicate,hint:'Finance distinguishes the duplicate check from financial authority.',who:'sam'},
  {name:'Connect',full:'Identify dependencies',done:s.sheet&&s.audit&&s.tech,hint:'Trace the tracker, audit evidence and booking trigger.',who:!s.sheet?'priya':!s.audit?'mei':'luca'},
  {name:'Agree',full:'Agree on the change',done:s.owner&&!!s.scope&&reportReady(s),hint:'Name the owner, choose scope and agree the reporting handover.',who:!s.owner?'priya':!s.scope?'alex':'jules'},
  {name:'Protect',full:'Protect essential controls',done:s.record&&feasible(s)&&s.plan&&!s.rushed,hint:'Keep authority evidence, a workable route and a rollback plan.',who:!s.record?'mei':!feasible(s)?'luca':'priya'},
  {name:'Deliver',full:'Deliver the improvement',done:s.outcome==='delivered',hint:'Obtain endorsement and deliver from the proposal.',who:'alex'},
];}
export function transition(state,id){
  if(state.outcome)return {state,notice:'This shift has ended.'};
  if(id==='deliver'){if(!preconditions(state)||!state.endorsement)return {state,notice:'Resolve the proposal conditions before delivering.'};const s=structuredClone(state);s.outcome='delivered';s.history.push({id,label:'Delivered the agreed change',delta:0});return {state:s,notice:'One less approval. The right things still happen.'};}
  const a=actions[id];if(!a||!a.when(state))return {state,notice:'That decision is already recorded or is not available yet.'};
  const s=structuredClone(state);const before=metrics(s).readiness;
  (s.chat[a.who]??=[]).push({text:a.label,incoming:false});a.run(s);
  const delta=metrics(s).readiness-before;s.history.push({id,label:a.label,delta});
  return {state:s,notice:a.notice,view:a.view,doc:a.doc,chat:a.chat||a.who,delta};
}
export function finish(s,reason='time'){return s.outcome?s:{...s,outcome:reason};}
export function debrief(s){
  const m=metrics(s);const delivered=s.outcome==='delivered';return {
    title:delivered?(s.scope==='pilot'?'A smaller change. A real improvement.':'One less approval. A working system.'):(s.rushed?'The box went. The work got stuck.':m.readiness>=75?'A credible change, waiting to happen.':'The hydra still has a few heads.'),
    summary:delivered?`The duplicate branch check is removed for ${s.scope==='pilot'?'ten routine requests in a two-week pilot':'a staged rollout of routine domestic travel'}. Manager, delegate and booking remain. Priya owns the route and the review.`:'The change was not delivered this shift. Your investigation and decisions still matter: the next attempt can start from what you learned.',
    lessons:[
      s.record?'You kept the purpose of the audit control: traceable authority.':'The audit problem needs an evidence trail, not simply another signature.',
      s.reportChoice==='feed'?'The existing export replaces duplicate data entry as well as the approval.':s.reportChoice==='bridge'?'A temporary reporting bridge made a pilot feasible, with a real workload cost.':'Removing a tracker does not remove the information someone relies on.',
      s.repairDone?'You recovered from the shortcut by restoring the route and acknowledging the gap.':s.rushed?'A shorter process diagram concealed a broken booking route.':'You treated implementation dependencies as work to resolve.',
      s.extraCommittee?'The extra working group added coordination without closing a blocker.':s.plan?'A named owner, review measures and rollback made the improvement accountable.':'A change needs someone to own the exceptions, review and recovery.',
    ],
  };
}
