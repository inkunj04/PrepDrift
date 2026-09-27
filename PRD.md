# PrepDrift Product Requirements Document

## 1. Product Overview

PrepDrift is an AI-powered study recovery tool for competitive exam aspirants. It detects when a student is drifting from their preparation plan and recommends the smallest useful action to get back on track.

Unlike learning dashboards that report what happened, PrepDrift answers: **"Why am I drifting, and what should I do about it today?"**

## 2. Problem

Competitive exam preparation is a long-duration, self-directed endeavour. Students create study plans but slowly drift from them - they miss revision cycles, accumulate weak topics, lose practice consistency, and don't notice the compounding effect until it's too late.

The core issue is not lack of content or motivation. It's the **absence of a feedback system that detects drift early and prescribes minimal corrective actions** before momentum is lost.

Existing platforms track progress. None diagnose drift as a first-class concept.

## 3. Target User

**Primary:** Serious competitive exam aspirants (UPSC, GATE, CAT, JEE Advanced) who:
- Have been preparing for 3+ months
- Follow a structured study plan
- Study 4-8 hours daily
- Are self-aware about their preparation but lack visibility into drift patterns

**Not for:** Casual learners, school students, or users who need content creation. PrepDrift assumes the student already has a syllabus and study material.

## 4. User Insight

Through user interviews and forum analysis, a recurring pattern emerged:

> "I was doing well for 3 months. Then I skipped Polity revision for a week. Then two weeks. By the time I realised, my accuracy had dropped 20% and I had 5 topics in revision debt. I didn't know when it started going wrong."

The drift is invisible until it compounds. Students need a system that makes drift legible before it becomes a crisis.

## 5. Hypothesis

If we make study drift visible and quantified - and pair each drift signal with a personalised, low-effort recovery action - students will intervene earlier, maintain higher preparation consistency, and reduce the anxiety of falling behind.

**Leading indicator:** Students who receive drift alerts take a corrective action within 24 hours at least 40% of the time.

**Lagging indicator:** Revision debt decreases by 30% over 4 weeks for active users.

## 6. Product Principles

1. **Drift is the core concept.** Every feature should help the student see, understand, or correct drift.
2. **Smallest useful action.** Never overwhelm. Always recommend the minimum intervention that changes the trajectory.
3. **Calm over urgent.** The interface should feel like a trusted advisor, not an alarm system.
4. **Honest data.** Show real preparation state. Don't gamify, inflate, or sugarcoat.
5. **Intelligence, not content.** PrepDrift is not a learning platform. It's a preparation intelligence layer.
6. **Ship less, ship better.** Every surface should feel considered. No feature bloat.

## 7. Phase 1 & 2 Scope (Completed)

**Phase 1 Objective:** Build the complete visual foundation and primary student dashboard.
**Phase 1 Deliverables:**
- Design token system (colors, typography, spacing, shadows, motion)
- Persistent sidebar navigation
- Student overview dashboard with readiness, drift metrics, and activity timeline.

**Phase 2 Objective:** Transform the dashboard into a product-thinking prototype with intelligence and PM surfaces.
**Phase 2 Deliverables:**
- **Deterministic Data Engine:** Synthetic dataset (5,000 users, 30,000+ events) with intentional behavioral relationships (e.g. low D7 retention for missed first targets).
- **Drift Engine:** 7-signal deterministic scoring system.
- **AI Recovery Engine:** Deterministic diagnosis, reasoning, and a 4-step interactive recovery session (Refresh, Practice, Recall, Review).
- **Product Intelligence (Insights):** PM dashboard showing KPIs, activation funnels, behavioral segments, and data-backed product opportunities.
- **SQL Explorer:** Interactive SQL workspace running against the synthetic dataset with PM-focused explanations.
- **Experiments Dashboard:** Workspace to track the A/B test (EXP-001) for the Recovery Mode intervention.

## 8. Future Scope

| Phase | Focus | Key Features |
|-------|-------|--------------|
| **Phase 3** | Drift detection | Behavioral pattern analysis, drift alerts, trend forecasting |
| **Phase 4** | Advanced Experiments | Multivariate testing, study technique recommendations |
| **Phase 5** | Social proof | Anonymous peer benchmarking, cohort insights |

## 9. Success Metrics

**Phase 1 (Foundation):**
- Dashboard loads in under 2 seconds
- All components render without console errors
- Responsive across desktop, tablet, and mobile
- Visual quality indistinguishable from a shipped SaaS product

**Product (future phases):**
- **Activation:** 60% of new users complete their first drift check within 3 days
- **Engagement:** DAU/MAU ratio > 35% among active aspirants
- **Recovery rate:** 40% of drift alerts result in corrective action within 24 hours
- **Retention:** Week-4 retention > 50%
- **NPS:** > 50 among weekly active users

## 10. Non-Goals

- **Not a content platform.** We don't create study material, video lectures, or question banks.
- **Not a tutor.** No AI chat interface. No conversational UI. Insights are presented as product intelligence, not chatbot responses.
- **Not gamified.** No streaks, badges, leaderboards, or points. Motivation comes from clarity, not dopamine loops.
- **Not a social network.** No profiles, comments, or community features in early phases.
- **Not an exam simulator.** We don't replicate exam interfaces or conduct mock tests.
- **Not multi-exam generic.** Initial focus is UPSC CSE. Expand only after product-market fit.
