// ─── Seeded PRNG (mulberry32) for deterministic data ───
function createRng(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const rng = createRng(42);
function rand() { return rng(); }
function randInt(min: number, max: number) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }
function chance(p: number) { return rand() < p; }

// ─── Constants ───
const FIRST_NAMES = [
  'Aarav','Aditi','Aisha','Amit','Ananya','Arjun','Bharati','Chandra','Deepak','Divya',
  'Ekta','Farhan','Gaurav','Harini','Ishaan','Jaya','Karan','Kavya','Kunj','Lakshmi',
  'Manish','Meera','Naveen','Neha','Om','Pallavi','Pranav','Priya','Rahul','Riya',
  'Rohit','Sakshi','Sameer','Shreya','Siddharth','Tanvi','Uday','Varun','Vidya','Yash',
  'Zara','Akhil','Bhavna','Chirag','Diya','Eshan','Fatima','Geeta','Harsh','Ira',
];

const LAST_NAMES = [
  'Sharma','Patel','Singh','Kumar','Gupta','Reddy','Joshi','Verma','Chauhan','Mishra',
  'Agarwal','Rao','Das','Nair','Menon','Iyer','Shah','Pandey','Thakur','Yadav',
];

const TOPICS = ['Polity','Economy','Environment','Modern History','Geography','Current Affairs'];
const EXAMS = ['UPSC CSE','UPSC CSE','UPSC CSE','UPSC CSE','GATE CS','CAT','JEE Advanced'];

import type { AnalyticsUser, AnalyticsEvent, UserSegment, EventName } from '@/types/analytics';

// ─── User Generation ───
function assignSegment(idx: number): UserSegment {
  // Deterministic distribution: ~30% consistent, ~25% early-drifter, ~20% high-debt, ~15% low-confidence, ~10% returning
  const bucket = idx % 100;
  if (bucket < 30) return 'consistent-learner';
  if (bucket < 55) return 'early-drifter';
  if (bucket < 75) return 'high-revision-debt';
  if (bucket < 90) return 'low-practice-confidence';
  return 'returning-learner';
}

function generateUsers(count: number): AnalyticsUser[] {
  const users: AnalyticsUser[] = [];

  for (let i = 0; i < count; i++) {
    const segment = assignSegment(i);
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const exam = pick(EXAMS);

    // Segment-driven behavioral attributes
    let completedOnboarding: boolean;
    let firstPractice: boolean;
    let completedFirstTarget: boolean;
    let d2Return: boolean;
    let d7Return: boolean;
    let recoveryStarted: boolean;
    let recoveryCompleted: boolean;
    let revisionDebtCount: number;
    let readinessScore: number;
    let currentStreak: number;
    let driftScore: number;
    
    // Phase 4 Conversion flags
    let upgradeViewed: boolean = false;
    let upgradeCtaClicked: boolean = false;
    let subscriptionStarted: boolean = false;

    switch (segment) {
      case 'consistent-learner':
        completedOnboarding = chance(0.95);
        firstPractice = completedOnboarding && chance(0.92);
        completedFirstTarget = firstPractice && chance(0.85);
        d2Return = completedFirstTarget ? chance(0.78) : chance(0.35);
        d7Return = d2Return ? chance(0.62) : chance(0.15);
        recoveryStarted = chance(0.20);
        recoveryCompleted = recoveryStarted && chance(0.70);
        revisionDebtCount = randInt(0, 1);
        readinessScore = randInt(65, 92);
        currentStreak = randInt(5, 28);
        driftScore = randInt(0, 24);
        break;

      case 'early-drifter':
        completedOnboarding = chance(0.82);
        firstPractice = completedOnboarding && chance(0.78);
        completedFirstTarget = firstPractice && chance(0.40);
        d2Return = completedFirstTarget ? chance(0.55) : chance(0.22);
        d7Return = d2Return ? chance(0.38) : chance(0.08);
        recoveryStarted = chance(0.35);
        recoveryCompleted = recoveryStarted && chance(0.45);
        revisionDebtCount = randInt(1, 4);
        readinessScore = randInt(30, 58);
        currentStreak = randInt(0, 5);
        driftScore = randInt(45, 85);
        break;

      case 'high-revision-debt':
        completedOnboarding = chance(0.88);
        firstPractice = completedOnboarding && chance(0.85);
        completedFirstTarget = firstPractice && chance(0.60);
        d2Return = completedFirstTarget ? chance(0.60) : chance(0.28);
        d7Return = d2Return ? chance(0.42) : chance(0.12);
        recoveryStarted = chance(0.40);
        recoveryCompleted = recoveryStarted && chance(0.50);
        revisionDebtCount = randInt(3, 6);
        readinessScore = randInt(35, 55);
        currentStreak = randInt(1, 8);
        driftScore = randInt(40, 75);
        break;

      case 'low-practice-confidence':
        completedOnboarding = chance(0.75);
        firstPractice = completedOnboarding && chance(0.65);
        completedFirstTarget = firstPractice && chance(0.50);
        d2Return = completedFirstTarget ? chance(0.48) : chance(0.20);
        d7Return = d2Return ? chance(0.35) : chance(0.10);
        recoveryStarted = chance(0.25);
        recoveryCompleted = recoveryStarted && chance(0.40);
        revisionDebtCount = randInt(1, 3);
        readinessScore = randInt(25, 50);
        currentStreak = randInt(0, 3);
        driftScore = randInt(50, 90);
        break;

      case 'returning-learner':
        completedOnboarding = chance(0.90);
        firstPractice = completedOnboarding && chance(0.88);
        completedFirstTarget = firstPractice && chance(0.65);
        d2Return = chance(0.60);
        d7Return = d2Return ? chance(0.50) : chance(0.18);
        recoveryStarted = chance(0.55);
        recoveryCompleted = recoveryStarted && chance(0.65);
        revisionDebtCount = randInt(1, 3);
        readinessScore = randInt(45, 70);
        currentStreak = randInt(2, 12);
        driftScore = randInt(20, 55);
        break;
    }

    // Phase 4: Contextual Upgrade Conversions
    // Simulated behavior: Users who complete recovery are much more likely to convert.
    // We add randomness here so the variant performs better in the experiment analytics.
    if (recoveryCompleted) {
      upgradeViewed = true;
      upgradeCtaClicked = chance(0.18);
      subscriptionStarted = upgradeCtaClicked && chance(0.40);
    } else if (chance(0.15)) {
      upgradeViewed = true;
      upgradeCtaClicked = chance(0.08);
      subscriptionStarted = upgradeCtaClicked && chance(0.20);
    }

    const signupDay = randInt(1, 28);
    const signupMonth = randInt(3, 8);

    users.push({
      userId: `u_${String(i + 1).padStart(5, '0')}`,
      name: `${firstName} ${lastName}`,
      exam,
      targetYear: pick([2026, 2027, 2027, 2027, 2028]),
      signupDate: `2026-${String(signupMonth).padStart(2, '0')}-${String(signupDay).padStart(2, '0')}`,
      studyCapacityHours: pick([4, 5, 6, 6, 7, 8]),
      currentStreak,
      readinessScore,
      subscriptionStatus: pick(['free', 'free', 'trial', 'active', 'active', 'churned']),
      segment,
      completedFirstTarget,
      completedOnboarding,
      firstPracticeCompleted: firstPractice,
      d2Return,
      d7Return,
      recoveryStarted,
      recoveryCompleted,
      revisionDebtCount,
      driftScore,
      upgradeViewed,
      upgradeCtaClicked,
      subscriptionStarted,
    });
  }

  return users;
}

// ─── Event Generation ───
function generateEventsForUser(user: AnalyticsUser, eventIdStart: number): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = [];
  let eid = eventIdStart;
  const baseDate = new Date(user.signupDate + 'T08:00:00Z');
  const sessionBase = `s_${user.userId}_`;
  let sessionIdx = 0;

  function addEvent(name: EventName, dayOffset: number, hourOffset: number, topic?: string, props: Record<string, string | number | boolean> = {}) {
    const ts = new Date(baseDate);
    ts.setDate(ts.getDate() + dayOffset);
    ts.setHours(ts.getHours() + hourOffset);
    events.push({
      eventId: `e_${String(eid++).padStart(6, '0')}`,
      userId: user.userId,
      eventName: name,
      timestamp: ts.toISOString(),
      sessionId: sessionBase + String(sessionIdx),
      topic,
      properties: props,
    });
  }

  // Signup
  addEvent('signup', 0, 0, undefined, { exam: user.exam });
  sessionIdx++;

  // Onboarding
  if (user.completedOnboarding) {
    addEvent('onboarding_complete', 0, 0.5, undefined, { duration_min: randInt(3, 8) });
  }

  // First practice
  if (user.firstPracticeCompleted) {
    const topic = pick(TOPICS);
    addEvent('first_practice', randInt(0, 1), randInt(1, 4), topic, { questions: randInt(5, 15) });
    sessionIdx++;

    // Study plan
    if (chance(0.75)) {
      addEvent('study_plan_created', randInt(0, 2), randInt(2, 6));
    }
  }

  // Target completed / missed
  if (user.completedFirstTarget) {
    addEvent('target_completed', randInt(1, 3), randInt(8, 14), pick(TOPICS), { type: 'daily' });
    // Additional target completions
    const extraTargets = randInt(2, 12);
    for (let t = 0; t < extraTargets; t++) {
      addEvent('target_completed', randInt(3, 21), randInt(8, 20), pick(TOPICS), { type: 'daily' });
      sessionIdx++;
    }
  } else if (user.firstPracticeCompleted) {
    addEvent('target_missed', randInt(1, 3), 23, pick(TOPICS), { type: 'daily' });
  }

  // MCQ sessions
  const mcqSessions = user.segment === 'consistent-learner' ? randInt(4, 12) :
    user.segment === 'early-drifter' ? randInt(1, 4) : randInt(2, 7);

  for (let m = 0; m < mcqSessions; m++) {
    const topic = pick(TOPICS);
    const day = randInt(1, 25);
    sessionIdx++;
    addEvent('mcq_started', day, randInt(8, 18), topic, { count: randInt(10, 30) });
    if (chance(0.85)) {
      const total = randInt(10, 30);
      const wrong = Math.round(total * (user.readinessScore > 60 ? rand() * 0.35 : 0.3 + rand() * 0.35));
      addEvent('mcq_completed', day, randInt(9, 19), topic, { total, correct: total - wrong, accuracy: Math.round(((total - wrong) / total) * 100) });
      for (let w = 0; w < Math.min(wrong, 3); w++) {
        addEvent('mcq_answer_wrong', day, randInt(9, 19), topic, { question_id: `q_${randInt(1, 500)}` });
      }
    }
  }

  // Revision sessions
  const revSessions = user.revisionDebtCount > 2 ? randInt(0, 2) : randInt(2, 6);
  for (let r = 0; r < revSessions; r++) {
    const topic = pick(TOPICS);
    const day = randInt(3, 25);
    sessionIdx++;
    addEvent('revision_started', day, randInt(7, 16), topic);
    if (chance(0.80)) {
      addEvent('revision_completed', day, randInt(8, 18), topic, { duration_min: randInt(15, 45) });
    }
  }

  // Recovery flow
  if (user.recoveryStarted) {
    addEvent('recovery_prompt_seen', randInt(5, 20), randInt(9, 15), pick(TOPICS));
    addEvent('recovery_started', randInt(5, 20), randInt(10, 16), pick(TOPICS));
    if (user.recoveryCompleted) {
      const recDay = randInt(5, 20);
      const recHr = randInt(11, 17);
      addEvent('recovery_completed', recDay, recHr, pick(TOPICS), { duration_min: randInt(18, 30) });
      
      // Phase 4 Contextual Conversion Flow
      if (user.upgradeViewed) {
        addEvent('upgrade_viewed', recDay, recHr + 0.1);
        if (user.upgradeCtaClicked) {
          addEvent('upgrade_cta_clicked', recDay, recHr + 0.2);
          if (user.subscriptionStarted) {
            addEvent('upgrade_started', recDay, recHr + 0.3);
          }
        }
      }
    }
  }

  // Retention events
  if (user.d2Return) addEvent('day_2_return', 2, randInt(7, 14));
  if (user.d7Return) addEvent('day_7_return', 7, randInt(7, 14));

  // Generic Subscription
  if (chance(0.30) && !user.upgradeViewed) {
    addEvent('subscription_viewed', randInt(3, 14), randInt(10, 18));
    if (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trial') {
      addEvent('subscription_started', randInt(4, 15), randInt(10, 18), undefined, { plan: user.subscriptionStatus });
    }
  }
  
  if (user.subscriptionStarted && user.upgradeViewed) {
      addEvent('subscription_started', randInt(5, 20), randInt(12, 18), undefined, { plan: 'active' });
  }

  return events;
}

// ─── Generate & Export ───
export const analyticsUsers: AnalyticsUser[] = generateUsers(5000);

let allEvents: AnalyticsEvent[] = [];
let eidCounter = 1;
for (const user of analyticsUsers) {
  const userEvents = generateEventsForUser(user, eidCounter);
  allEvents = allEvents.concat(userEvents);
  eidCounter += userEvents.length;
}
export const analyticsEvents: AnalyticsEvent[] = allEvents;

// ─── Quick stats ───
export const datasetStats = {
  totalUsers: analyticsUsers.length,
  totalEvents: analyticsEvents.length,
  generatedAt: '2026-09-27',
  note: 'Synthetic product dataset',
};
