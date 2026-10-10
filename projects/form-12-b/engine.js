/* All answers stay in memory. This module has no storage or network operations. */
export const CAPACITY = 12;
export const GAME_URL = 'https://sch-jsi.github.io/jsi/projects/form-12-b/';

const option = (id, text, cost, consequence, extra = {}) => ({ id, text, cost, consequence, scores: {}, ...extra });

export const questions = [
  {
    id: 'meeting', tab: 'The calendar', stamp: 'OWNER REQUIRED', colour: 'yellow',
    title: 'The next meeting has no host.',
    text: 'The Hub is meant to meet next month. Nobody has offered to convene. The calendar is remaining admirably neutral.',
    prompt: 'What will you actually do?',
    options: [
      option('convene', 'I’ll convene regularly: invitations, decisions and follow-through.', 4, 'The meeting now has a person behind it. So do the reminders after it.', { scores: { affinity: 5 }, commitment: 'Regular convening and follow-through', role: 'convening', hours: [2, 4] }),
      option('help', 'I’ll help someone else organise the next one.', 2, 'Useful help. Someone still needs to accept the lead.', { scores: { affinity: 3 }, commitment: 'Help organise one gathering', role: 'gathering', hours: [0, 1] }),
      option('attend', 'I’ll attend if somebody else convenes.', 1, 'A seat is taken. The organiser’s chair is still empty.', { scores: { affinity: 1 }, commitment: 'Attend a gathering someone else convenes', role: 'attendance', hours: [0, 1] }),
      option('less', 'I’m comfortable meeting less often.', 0, 'A lighter rhythm is a real choice. The calendar can cope.', { scores: { affinity: 2 } }),
    ],
  },
  {
    id: 'host', tab: 'A possible home', stamp: 'HYPOTHETICAL', colour: 'turquoise',
    title: 'There might be room at an institution.',
    text: 'Imagine ANU School of Cybernetics, RMIT / Policy Signals or UNSW is interested in exploring a home for a defined piece of the work.',
    note: 'A hypothetical test of relationships named in the strategy paper. No offer or commitment is implied.',
    prompt: 'Who follows the conversation through?',
    options: [
      option('own', 'I’ll own one relationship and work through a concrete proposition.', 2, 'Someone owns the follow-up. Next come the mandate, an internal sponsor, decision rights and protected time.', { scores: { hosted: 6 }, commitment: 'Own one institutional relationship', role: 'hosting', qualifies: ['hosted'], hours: [1, 2] }),
      option('join', 'I’ll join one or two exploratory conversations.', 1, 'A useful contribution. Being in the room does not yet give the relationship an owner.', { scores: { hosted: 1, affinity: 1 }, commitment: 'Join one or two institutional conversations', role: 'conversation', hours: [0, 1] }),
      option('support', 'I support the idea; someone else needs to carry it.', 0, 'Support recorded. Follow-up person: still to be found.', { interest: 'An institutional home' }),
      option('independent', 'I’d keep the Hub independent and light.', 0, 'Independence can stay light if projects find their own owners and practical support.', { scores: { affinity: 2 } }),
    ],
  },
  {
    id: 'festival', tab: 'The big idea', stamp: 'ENDPOINT PLEASE', colour: 'pink',
    title: '“What if we did another festival?”',
    text: 'A clear deadline. Interesting people. A very real production schedule. Someone puts the idea back on the table.',
    prompt: 'What part would you take?',
    options: [
      option('lead', 'I’ll help lead a three-month push, if delivery is properly resourced.', 3, 'A bounded mission has a potential lead. It still needs a host or auspice, partners, budget and paid producer.', { scores: { festival: 7 }, commitment: 'Help lead a three-month festival push, if resourced', role: 'sprint', qualifies: ['festival'], burst: true, hours: [0, 0] }),
      option('stream', 'Give me one defined workstream with an endpoint.', 2, 'One piece now has an owner. The whole event still needs one too.', { scores: { festival: 5 }, commitment: 'Own one bounded festival workstream', role: 'sprint', qualifies: ['festival'], burst: true, hours: [0, 0] }),
      option('small', 'I’ll contribute something small and specific.', 1, 'A contribution is helpful. It is not a production team in disguise.', { scores: { festival: 1 }, commitment: 'Make a small festival contribution', role: 'contribution', burst: true, hours: [0, 0] }),
      option('audience', 'I’d attend, but I don’t want to organise it.', 1, 'An audience member. An entirely honourable role. Still not a producer.', { scores: { affinity: 1 }, commitment: 'Attend a festival someone else produces', role: 'attendance', burst: true, hours: [0, 0], interest: 'Another festival' }),
      option('no', 'Another festival is not where my energy should go.', 0, 'One possibility can leave your desk. The desk is grateful.'),
    ],
  },
  {
    id: 'platform', tab: 'The small print', stamp: 'READ THE ATTACHMENT', colour: 'orange',
    title: 'A little funding. A little machinery.',
    text: 'Imagine a funder offers enough to test an enabling platform: helping cross-sector work find people, support and an institutional foothold.',
    note: 'Hypothetical funding. The pilot needs an auspice, a budget, reporting, a funder relationship and delivery. Ongoing infrastructure needs paid capacity and evidence of demand.',
    prompt: 'What do you put your hand up for?',
    options: [
      option('accountable', 'I’ll carry an accountable pilot role, with an auspice and paid support.', 4, 'An accountable role is a start. Now test who needs the service and who will commit resources. A grant alone is not demand.', { scores: { platform: 7 }, commitment: 'An accountable pilot role, conditional on auspice and paid support', role: 'accountability', qualifies: ['platformRole'], hours: [2, 4] }),
      option('govern', 'I’ll help govern it and oversee the budget and delivery.', 2, 'Oversight is real work. It still leaves an operating team to resource and a need to prove.', { scores: { platform: 5 }, commitment: 'Pilot governance, budget and delivery oversight', role: 'governance', qualifies: ['platformRole'], hours: [1, 2] }),
      option('expertise', 'I’ll contribute expertise to one defined piece.', 1, 'Expertise goes on the table. Finance, reporting and the funder relationship remain somebody’s job.', { scores: { platform: 1 }, commitment: 'A defined piece of expertise for a pilot', role: 'expertise', hours: [0, 1] }),
      option('cheer', 'I like the idea, but I can’t take responsibility.', 0, 'Enthusiasm received. No operating capacity has been created.', { interest: 'An enabling platform' }),
      option('decline', 'I’d decline. This is more than I want the Hub to carry.', 0, 'A legitimate boundary. Money can bring obligations as well as possibilities.', { scores: { affinity: 1 } }),
    ],
  },
  {
    id: 'hours', tab: 'One actual afternoon', stamp: 'CHOOSE ONE', colour: 'cobalt',
    title: 'You have four hours next month.',
    text: 'One useful afternoon. Several worthy possibilities. The afternoon cannot be photocopied.',
    note: 'This is part of your original energy budget, not a refill. Energy units represent attention and obligation; they are not hours.',
    prompt: 'Where does it go?',
    options: [
      option('people', 'Bring people together around one useful conversation.', 2, 'A specific connection beats an imaginary community of everyone.', { scores: { affinity: 4 }, commitment: 'One four-hour block bringing people together', role: 'gathering', hours: [4, 4] }),
      option('institution', 'Develop a specific proposition with a potential host.', 2, 'The conversation gets an ask: what sits where, with whose support, and for how long?', { scores: { hosted: 4 }, commitment: 'One four-hour block developing a hosted proposition', role: 'hosting', qualifies: ['hosted'], hours: [4, 4] }),
      option('demand', 'Ask potential users what is missing and what support they would commit.', 2, 'You are testing demand, not just polishing a pitch. “Sounds interesting” is not a resource commitment.', { scores: { platform: 5 }, commitment: 'One four-hour block testing demand and external support', role: 'demand', qualifies: ['demand'], hours: [4, 4] }),
      option('project', 'Deliver one bounded project or event task.', 2, 'Something can happen without turning the Hub into a permanent delivery organisation.', { scores: { festival: 4 }, commitment: 'One four-hour block on a bounded project or event', role: 'sprint', qualifies: ['festival'], hours: [4, 4] }),
      option('elsewhere', 'Put it into work outside the Hub, or the rest of my life.', 0, 'The work can matter without this collective holding it. So can the rest of your life.', { scores: { free: 3 } }),
    ],
  },
  {
    id: 'quiet', tab: 'Six quiet months', stamp: 'NO OUTPUT ATTACHED', colour: 'turquoise',
    title: 'Nothing major happens for six months.',
    text: 'A few messages. Occasional conversations. No flagship activity, platform launch or impressive group photograph.',
    prompt: 'Where does that leave you?',
    options: [
      option('connection', 'I still value somewhere to return to and people to stay connected with.', 0, 'Relationships can be a sufficient purpose. They do not need a launch event.', { scores: { affinity: 4 } }),
      option('mission', 'I’d stay involved only around a clear shared mission.', 0, 'That is a condition for your involvement, not yet an offer to organise the mission.', { missionRequired: true }),
      option('outside', 'I’d carry the relationships into my own institution or projects.', 0, 'The connections can continue outside this container.', { scores: { free: 4 } }),
      option('pause', 'I’d be comfortable letting the Hub pause or conclude.', 0, 'An ending can be deliberate and kind. No replacement committee is required.', { scores: { free: 3 } }),
    ],
  },
  {
    id: 'horizon', tab: 'A next step', stamp: 'PROVISIONAL IS FINE', colour: 'yellow',
    title: 'July 2027 is on the horizon.',
    text: 'The paper uses APS Innovation Month 2027 as a checkpoint: enough real testing to know what the Hub can hold.',
    prompt: 'What next step will you personally take?',
    options: [
      option('light', 'Invite people to one low-key gathering, with no project attached.', 1, 'A light network gets a small, real act of care.', { scores: { affinity: 3 }, commitment: 'Invite people to one low-key gathering', role: 'gathering', hours: [0, 1] }),
      option('home', 'Write a short hosted proposition and follow it up with a potential sponsor.', 2, 'A possible home now has something specific to consider. An offer still has to be earned.', { scores: { hosted: 5 }, commitment: 'Write and follow up a hosted proposition', role: 'hosting', qualifies: ['hosted'], hours: [1, 2] }),
      option('evidence', 'Test a specific infrastructure gap and seek commitments from two possible partners.', 2, 'A pilot needs evidence and material support. The answer may be to join something that already exists.', { scores: { platform: 5 }, commitment: 'Test a gap and seek two concrete partner commitments', role: 'demand', qualifies: ['demand'], hours: [1, 2] }),
      option('scope', 'Scope a bounded mission: purpose, host, budget, producer and an endpoint.', 2, 'A mission with an endpoint, and a delivery plan that does not rely on invisible volunteer labour.', { scores: { festival: 5 }, commitment: 'Scope a resourced, bounded mission', role: 'sprint', qualifies: ['festival'], hours: [1, 2] }),
      option('own', 'Take my next step through my own institution or project.', 0, 'You can keep the underlying work and choose a different container.', { scores: { free: 4 } }),
      option('end', 'Help name a pause or an ending, without taking on new delivery.', 0, 'Closure is also a decision. Possibility does not have to become a permanent obligation.', { scores: { free: 4 }, boundary: 'A deliberate pause or ending' }),
    ],
  },
];

export const profiles = {
  affinity: { name: 'Affinity Keeper', form: 'Affinity network', mark: '✳', colour: 'turquoise', description: 'You want a useful place to return to, sustained by relationships, exchange and occasional collaboration.', needs: 'A light purpose, rotating convenors and a simple gathering rhythm. Projects need separate owners. Volunteer effort can reasonably support this form.', question: 'Would you still value this community if it produced nothing?' },
  hosted: { name: 'Institutional Docker', form: 'Hosted / affiliated initiative', mark: '↗', colour: 'cobalt', description: 'You are willing to help a defined piece of the work find an institutional home with practical support behind it.', needs: 'A credible host, internal sponsor, clear mandate, decision rights and protected capacity. Hosting is a relationship to negotiate, not a free administration department.', question: 'What exactly are you asking an institution to carry, and what would you offer in return?' },
  platform: { name: 'Infrastructure Builder', form: 'Enabling platform', mark: '⊞', colour: 'orange', description: 'You accepted a role in carrying a pilot and in testing whether anyone needs and will resource the capability.', needs: 'Demonstrated demand, anchor partners, an auspice or legal home, funding, paid backbone capacity and financial controls. These answers do not establish that any of those exists.', question: 'Who would carry the platform before paid capacity exists, and what would you stop if that support never arrived?' },
  festival: { name: 'Festival Sprinter', form: 'Festival / bounded mission', mark: '⚑', colour: 'pink', description: 'You are willing to put energy behind a defined mission with a deliverable and an endpoint.', needs: 'An accountable owner, host or auspice, partners, budget and paid coordination for intensive delivery. A festival can sit alongside any year-round form.', question: 'If there were no festival next year, would you still want the Hub to exist?' },
  free: { name: 'Free Agent', form: 'Independent paths / graceful exit', mark: '↗', colour: 'yellow', description: 'You can value the people and underlying work while pursuing it through your own relationships, institution or projects.', needs: 'Clear boundaries and a kind handover where needed. Some people can continue while others step away; the Hub can also pause or conclude.', question: 'Which relationships or pieces of work would you keep, even if the Hub itself ended?' },
};

export function makeLedger(answers) {
  let used = 0;
  return answers.map((id, index) => {
    const q = questions[index];
    const chosen = q?.options.find(item => item.id === id);
    if (!chosen) throw new Error(`Invalid answer at decision ${index + 1}`);
    const available = Math.max(0, CAPACITY - used);
    const covered = chosen.cost <= available;
    used += chosen.cost;
    return { question: q.id, option: chosen, available, covered, used };
  });
}

export function getResult(answers) {
  const ledger = makeLedger(answers);
  const accepted = ledger.filter(row => row.covered);
  const deferred = ledger.filter(row => !row.covered);
  const scores = Object.fromEntries(Object.keys(profiles).map(key => [key, 0]));
  const qualifications = new Set();
  accepted.forEach(({ option: item }) => {
    Object.entries(item.scores).forEach(([key, score]) => { scores[key] += score; });
    item.qualifies?.forEach(key => qualifications.add(key));
  });
  const eligible = {
    affinity: scores.affinity > 0,
    hosted: qualifications.has('hosted'),
    platform: qualifications.has('platformRole') && qualifications.has('demand'),
    festival: qualifications.has('festival'),
    free: scores.free > 0,
  };
  let ranked = Object.keys(profiles).filter(key => eligible[key] && scores[key] > 0)
    .sort((a, b) => scores[b] - scores[a]);
  // A mission preference without an accepted sustaining role is not a builder profile.
  if (!ranked.length) ranked = ['free'];
  const primary = ranked[0];
  const secondary = ranked[1] && scores[ranked[1]] >= 4 && scores[ranked[1]] >= scores[primary] * 0.55 ? ranked[1] : null;
  const commitments = accepted.filter(row => row.option.commitment);
  const roles = new Set(commitments.map(row => row.option.role));
  const notTaken = [];
  if (!roles.has('convening')) notTaken.push('Regular convening');
  if (!roles.has('hosting')) notTaken.push('Owning an institutional pathway');
  if (!roles.has('sprint')) notTaken.push('Owning a delivery sprint');
  if (!roles.has('accountability')) notTaken.push('An accountable pilot role');
  if (!roles.has('governance') && !roles.has('accountability')) notTaken.push('Pilot governance and budget oversight');
  notTaken.push('Indefinite unpaid administration or a standalone organisation');
  const hours = commitments.reduce((sum, row) => [sum[0] + (row.option.hours?.[0] || 0), sum[1] + (row.option.hours?.[1] || 0)], [0, 0]);
  const burst = commitments.some(row => row.option.burst);
  const used = ledger.at(-1)?.used || 0;
  let tension = null;
  if (deferred.length) tension = 'Your appetite ran beyond your capacity. The work in “Needs space” has not counted towards your profile. Choose what to release before promising it.';
  else if (qualifications.has('platformRole') && !qualifications.has('demand')) tension = 'You offered to help carry a platform, but did not take on testing demand or partner commitments. That gap keeps Infrastructure Builder off your current result.';
  else if (qualifications.has('demand') && !qualifications.has('platformRole')) tension = 'You offered to test the need for infrastructure. You have not offered to carry the pilot’s accountability or governance. Someone still needs to accept those roles.';
  else if (accepted.some(row => row.option.missionRequired) && !['hosted', 'platform', 'festival'].some(key => eligible[key])) tension = 'You need a shared mission to stay involved, but have not taken on a role that sustains one. That may be a reason to find a mission elsewhere, or name one bounded contribution.';
  else if (primary === 'affinity' && !roles.has('convening') && !roles.has('gathering')) tension = 'You value a light network, but have not offered to convene it. Even an occasional gathering needs someone to send the invitation.';
  return { ledger, accepted, deferred, scores, eligible, ranked, primary, secondary, commitments, notTaken, hours, burst, used, tension, interests: accepted.filter(row => row.option.interest).map(row => row.option.interest) };
}
