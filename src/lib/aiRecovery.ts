import type { RecoveryDiagnosis, RecoveryStep, EvidenceCard, MCQuestion } from '@/types/analytics';
import type { Topic } from '@/types';
import type { DriftAssessment } from '@/types/analytics';

// ─── Diagnosis Generator ───
// Deterministic - no API key needed. Behaves like an AI reasoning layer.

interface DiagnosisInput {
  studentName: string;
  topics: Topic[];
  driftAssessment: DriftAssessment;
}

export function generateDiagnosis(input: DiagnosisInput): RecoveryDiagnosis {
  const { topics, driftAssessment } = input;

  // Find worst topic
  const sortedByAccuracy = [...topics].sort((a, b) => a.accuracy - b.accuracy);
  const worstTopic = sortedByAccuracy[0];
  const longestInactive = [...topics].sort((a, b) => b.lastPracticedDaysAgo - a.lastPracticedDaysAgo)[0];

  // Use longest-inactive if it's also low accuracy, otherwise use worst accuracy
  const targetTopic = longestInactive.lastPracticedDaysAgo >= 7 && longestInactive.accuracy < 70
    ? longestInactive
    : worstTopic;

  const accuracyDrop = targetTopic.trend.length >= 2
    ? targetTopic.trend[0] - targetTopic.trend[targetTopic.trend.length - 1]
    : 0;

  // Determine primary cause
  const primaryCause = determinePrimaryCause(targetTopic, driftAssessment);

  // Build diagnosis text
  const diagnosis = buildDiagnosisText(targetTopic, primaryCause);
  const reasoning = buildReasoningText(targetTopic, accuracyDrop, primaryCause);

  // Calculate recommended duration
  const recommendedDuration = 24; // minutes

  // Build recovery plan
  const recoveryPlan: RecoveryStep[] = [
    {
      id: 'step-1',
      label: 'Refresh',
      type: 'refresh',
      durationMinutes: 6,
      description: `Quick concept review of key ${targetTopic.name} fundamentals`,
    },
    {
      id: 'step-2',
      label: 'Practice',
      type: 'practice',
      durationMinutes: 8,
      description: `Targeted MCQs on your weakest ${targetTopic.name} areas`,
    },
    {
      id: 'step-3',
      label: 'Recall',
      type: 'recall',
      durationMinutes: 5,
      description: 'Explain the core concept without looking back',
    },
    {
      id: 'step-4',
      label: 'Review',
      type: 'review',
      durationMinutes: 5,
      description: 'See what you recovered and what to revisit next',
    },
  ];

  // Evidence cards
  const evidenceCards: EvidenceCard[] = [
    {
      value: `${targetTopic.lastPracticedDaysAgo} days`,
      label: 'Since last revision',
    },
    {
      value: `${targetTopic.accuracy}%`,
      label: 'Current accuracy',
    },
    {
      value: `${targetTopic.trend[0]}% → ${targetTopic.accuracy}%`,
      label: 'Accuracy change',
      subLabel: `−${accuracyDrop} pts`,
    },
  ];

  // Signals
  const signals = driftAssessment.signals
    .filter(s => s.detected)
    .slice(0, 3)
    .map(s => ({
      label: s.signal,
      value: s.description,
    }));

  // Confidence: higher if more signals detected and clear worst topic
  const detectedCount = driftAssessment.signals.filter(s => s.detected).length;
  const confidence = Math.min(95, 70 + detectedCount * 4 + (accuracyDrop > 10 ? 5 : 0));

  return {
    diagnosis,
    primaryCause,
    reasoning,
    confidence,
    recommendedDuration,
    recoveryPlan,
    evidenceCards,
    signals,
  };
}

function determinePrimaryCause(topic: Topic, drift: DriftAssessment): string {
  if (topic.lastPracticedDaysAgo > 10) return 'Topic avoidance';
  if (topic.accuracy < 55) return 'Accuracy collapse';
  const trend = topic.trend;
  if (trend.length >= 3 && trend[0] - trend[trend.length - 1] > 12) return 'Gradual decline';
  if (drift.signals.find(s => s.signal === 'Revision debt' && s.detected)) return 'Revision debt accumulation';
  return 'Inconsistent practice';
}

function buildDiagnosisText(topic: Topic, primaryCause: string): string {
  switch (primaryCause) {
    case 'Topic avoidance':
      return `Your preparation isn't broadly falling behind. The main issue is revision debt in ${topic.name}.`;
    case 'Accuracy collapse':
      return `${topic.name} accuracy has dropped below your baseline. A focused recovery session can stabilise this.`;
    case 'Gradual decline':
      return `${topic.name} has been slowly declining. The pattern suggests you're practicing but not revising effectively.`;
    case 'Revision debt accumulation':
      return `Multiple topics are accumulating revision debt. ${topic.name} is the most urgent.`;
    default:
      return `Your ${topic.name} practice has become inconsistent. A short recovery session can restart momentum.`;
  }
}

function buildReasoningText(topic: Topic, accuracyDrop: number, primaryCause: string): string {
  switch (primaryCause) {
    case 'Topic avoidance':
      return `Your ${topic.name} accuracy has fallen ${accuracyDrop} points while your practice frequency stayed stable. You are practicing, but avoiding the topic where confidence is lowest.`;
    case 'Accuracy collapse':
      return `${topic.name} accuracy is at ${topic.accuracy}%, well below your average. This typically happens when foundational concepts need reinforcement.`;
    case 'Gradual decline':
      return `Over the last 10 practice sessions, ${topic.name} accuracy has dropped from ${topic.trend[0]}% to ${topic.accuracy}%. The decline is gradual, suggesting revision gaps rather than knowledge loss.`;
    default:
      return `${topic.name} hasn't been practiced in ${topic.lastPracticedDaysAgo} days. Your accuracy trend shows a ${accuracyDrop}-point decline that can be reversed with a focused session.`;
  }
}

// ─── Recovery Topic Content ───

export function getRecoveryTopic(topics: Topic[]): Topic {
  const sorted = [...topics].sort((a, b) => {
    // Prioritise: drifting > needs-attention > healthy, then by accuracy
    const statusWeight = { drifting: 0, 'needs-attention': 1, healthy: 2 };
    const sDiff = statusWeight[a.status] - statusWeight[b.status];
    if (sDiff !== 0) return sDiff;
    return a.accuracy - b.accuracy;
  });
  return sorted[0];
}

// ─── Concept Refresh Content ───

const conceptContent: Record<string, { title: string; summary: string; keyPoints: string[] }> = {
  Polity: {
    title: 'Fundamental Rights - Quick Refresh',
    summary: 'Fundamental Rights (Articles 12–35) are justiciable rights guaranteed by the Constitution. They protect individuals against arbitrary state action and ensure basic freedoms.',
    keyPoints: [
      'Article 14: Right to Equality - equality before law and equal protection of laws',
      'Article 19: Six freedoms including speech, assembly, movement, residence, profession',
      'Article 21: Right to Life and Personal Liberty - expanded by SC to include dignity, livelihood, education',
      'Article 32: Right to Constitutional Remedies - "heart and soul of the Constitution" (Ambedkar)',
      'Reasonable restrictions can be imposed under Article 19(2)–19(6)',
    ],
  },
  Economy: {
    title: 'Monetary Policy - Quick Refresh',
    summary: 'RBI uses monetary policy tools to control money supply, inflation, and economic growth. Key instruments include repo rate, reverse repo rate, CRR, and SLR.',
    keyPoints: [
      'Repo Rate: Rate at which RBI lends to commercial banks',
      'Reverse Repo Rate: Rate at which banks deposit surplus with RBI',
      'CRR: Percentage of deposits banks must keep with RBI',
      'SLR: Percentage of deposits banks must invest in government securities',
      'MPC (Monetary Policy Committee) sets repo rate, targets 4% CPI inflation with ±2% band',
    ],
  },
  Environment: {
    title: 'Biodiversity Conservation - Quick Refresh',
    summary: 'India is one of 17 mega-diverse countries. Conservation strategies include in-situ (protected areas) and ex-situ (zoos, seed banks) methods.',
    keyPoints: [
      'In-situ: National Parks, Wildlife Sanctuaries, Biosphere Reserves',
      'Ex-situ: Zoos, botanical gardens, gene banks, seed vaults',
      'Wildlife Protection Act 1972: Legal framework for wildlife conservation',
      'CITES: International treaty regulating trade in endangered species',
      'Biodiversity hotspots: India has 4 - Western Ghats, Himalayas, Indo-Burma, Sundaland',
    ],
  },
  'Modern History': {
    title: 'Indian National Movement - Quick Refresh',
    summary: 'The freedom movement evolved through moderate, extremist, and Gandhian phases. Key movements include Non-Cooperation, Civil Disobedience, and Quit India.',
    keyPoints: [
      'Moderate Phase (1885–1905): Petition, prayer, protest - Dadabhai Naoroji, Gokhale',
      'Extremist Phase (1905–1920): Swaraj, Swadeshi, boycott - Tilak, Lala Lajpat Rai',
      'Non-Cooperation (1920–22): First mass movement, Khilafat alliance, Chauri Chaura',
      'Civil Disobedience (1930): Salt March, challenged British economic hegemony',
      'Quit India (1942): "Do or Die" - most intense phase, British response was severe repression',
    ],
  },
  Geography: {
    title: 'Indian River Systems - Quick Refresh',
    summary: 'India has two major river systems: Himalayan (perennial, snow-fed) and Peninsular (seasonal, rain-fed). Understanding drainage patterns is key for geography.',
    keyPoints: [
      'Himalayan rivers: Indus, Ganga, Brahmaputra - perennial, snow and rain fed',
      'Peninsular rivers: Godavari, Krishna, Kaveri, Narmada, Tapti - rain dependent',
      'Ganga basin: Largest river basin in India, covers 26% of land area',
      'West-flowing: Narmada and Tapti flow through rift valleys into Arabian Sea',
      'East-flowing: Godavari ("Dakshin Ganga"), Krishna, Kaveri drain into Bay of Bengal',
    ],
  },
  'Current Affairs': {
    title: 'Recent Developments - Quick Refresh',
    summary: 'Staying current with recent policy changes, international events, and government initiatives is critical for UPSC preparation.',
    keyPoints: [
      'Review key government schemes launched or modified in the last 3 months',
      'Track India\'s positions in multilateral forums (G20, BRICS, SCO, Quad)',
      'Monitor Supreme Court judgments with constitutional significance',
      'Follow economic indicators: GDP growth, inflation, fiscal deficit trends',
      'Note environmental developments: climate commitments, biodiversity initiatives',
    ],
  },
};

export function getConceptContent(topicName: string) {
  return conceptContent[topicName] || conceptContent['Polity'];
}

// ─── MCQ Bank ───

const mcqBank: Record<string, MCQuestion[]> = {
  Polity: [
    {
      id: 'mcq_p1',
      question: 'Which Article of the Indian Constitution deals with the Right to Equality?',
      options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
      correctIndex: 1,
      explanation: 'Article 14 guarantees equality before law and equal protection of laws to all persons within the territory of India.',
      topic: 'Polity',
    },
    {
      id: 'mcq_p2',
      question: 'The Right to Constitutional Remedies is guaranteed under which Article?',
      options: ['Article 19', 'Article 21', 'Article 32', 'Article 44'],
      correctIndex: 2,
      explanation: 'Article 32 provides the right to move the Supreme Court for enforcement of Fundamental Rights. Ambedkar called it the "heart and soul of the Constitution".',
      topic: 'Polity',
    },
    {
      id: 'mcq_p3',
      question: 'Which of the following is NOT a Fundamental Right?',
      options: ['Right to Property', 'Right to Freedom', 'Right against Exploitation', 'Right to Freedom of Religion'],
      correctIndex: 0,
      explanation: 'Right to Property was removed as a Fundamental Right by the 44th Amendment Act, 1978. It is now a legal right under Article 300A.',
      topic: 'Polity',
    },
    {
      id: 'mcq_p4',
      question: 'Reasonable restrictions on the freedom of speech can be imposed under:',
      options: ['Article 19(1)(a)', 'Article 19(2)', 'Article 21', 'Article 25'],
      correctIndex: 1,
      explanation: 'Article 19(2) empowers the State to impose reasonable restrictions on freedom of speech and expression in the interests of sovereignty, security, public order, decency, etc.',
      topic: 'Polity',
    },
    {
      id: 'mcq_p5',
      question: 'The writ of Habeas Corpus is issued to:',
      options: ['Prevent a person from holding a public office', 'Ensure personal liberty', 'Quash an order of a lower court', 'Direct a public official to perform duty'],
      correctIndex: 1,
      explanation: 'Habeas Corpus literally means "to have the body." It is issued to produce a detained person before the court to examine the legality of detention.',
      topic: 'Polity',
    },
  ],
  Economy: [
    {
      id: 'mcq_e1', question: 'The Monetary Policy Committee (MPC) targets an inflation rate of:', options: ['2% ± 1%', '4% ± 2%', '6% ± 2%', '5% ± 1.5%'], correctIndex: 1,
      explanation: 'The MPC targets 4% CPI inflation with a tolerance band of ±2% (i.e., 2% to 6%).', topic: 'Economy',
    },
    {
      id: 'mcq_e2', question: 'Which of the following is NOT a tool of monetary policy?', options: ['Repo Rate', 'Fiscal Deficit', 'CRR', 'Open Market Operations'], correctIndex: 1,
      explanation: 'Fiscal Deficit is a fiscal policy measure, not a monetary policy tool. RBI uses repo rate, CRR, SLR, and OMOs.', topic: 'Economy',
    },
    {
      id: 'mcq_e3', question: 'SLR (Statutory Liquidity Ratio) requires banks to invest in:', options: ['Gold only', 'Government securities', 'Corporate bonds', 'Foreign currency'], correctIndex: 1,
      explanation: 'SLR mandates banks to maintain a certain percentage of NDTL in liquid assets like government securities, cash, and gold.', topic: 'Economy',
    },
    {
      id: 'mcq_e4', question: 'An increase in the repo rate generally leads to:', options: ['Increase in money supply', 'Decrease in lending rates', 'Decrease in money supply', 'Increase in government spending'], correctIndex: 2,
      explanation: 'Higher repo rate makes borrowing costlier for banks, which reduces lending and contracts money supply.', topic: 'Economy',
    },
    {
      id: 'mcq_e5', question: 'Which body decides the repo rate in India?', options: ['Finance Ministry', 'SEBI', 'Monetary Policy Committee', 'NITI Aayog'], correctIndex: 2,
      explanation: 'The MPC, a six-member body (3 from RBI + 3 external), decides the repo rate. The RBI Governor has the casting vote.', topic: 'Economy',
    },
  ],
};

export function getMCQsForTopic(topicName: string, count: number = 5): MCQuestion[] {
  const pool = mcqBank[topicName] || mcqBank['Polity'];
  return pool.slice(0, Math.min(count, pool.length));
}
