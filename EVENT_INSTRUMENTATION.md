# PrepDrift Event Instrumentation Tracking Plan

This document outlines the core product telemetry tracked in PrepDrift. Instrumentation is designed to support the PM loop (Observe → Diagnose → Prioritize → Hypothesize → Experiment → Measure → Decide), with a strong focus on measuring activation, drift, recovery, and conversion.

## Core Events

| Event Name | Trigger Context | Key Properties |
| --- | --- | --- |
| `signup` | User successfully creates an account. | `exam`, `target_year` |
| `onboarding_complete` | User completes the initial preferences setup. | `duration_min` |
| `first_practice` | User finishes their very first MCQ session. | `topic`, `questions` |
| `study_plan_created` | System generates the AI study plan for the user. | `capacity_hours` |

## Engagement & Retention

| Event Name | Trigger Context | Key Properties |
| --- | --- | --- |
| `target_completed` | User meets their daily study target. | `topic`, `type` |
| `target_missed` | User fails to meet their daily study target. | `topic`, `type` |
| `mcq_started` | User starts a practice quiz. | `topic`, `count` |
| `mcq_completed` | User finishes a practice quiz. | `topic`, `total`, `correct`, `accuracy` |
| `mcq_answer_wrong` | User selects an incorrect option in a quiz. | `topic`, `question_id` |
| `revision_started` | User starts a revision session. | `topic` |
| `revision_completed` | User successfully completes a revision block. | `topic`, `duration_min` |
| `day_2_return` | User logs in on Day 2 after signup. | - |
| `day_7_return` | User logs in on Day 7 after signup. | - |

## AI Recovery Intervention (Phase 2 & 3)

| Event Name | Trigger Context | Key Properties |
| --- | --- | --- |
| `recovery_prompt_seen` | User is shown the "Recovery Mode" intervention prompt after drift detection. | `topic` |
| `recovery_started` | User accepts the prompt and begins the recovery micro-session. | `topic` |
| `recovery_completed` | User finishes the recovery flow, resolving the immediate drift. | `topic`, `duration_min` |

## Conversion & Contextual Upsell (Phase 4)

| Event Name | Trigger Context | Key Properties |
| --- | --- | --- |
| `subscription_viewed` | User views the generic upgrade/subscription page. | - |
| `upgrade_viewed` | User views the contextual upgrade prompt (e.g., after completing a recovery session). | - |
| `upgrade_cta_clicked` | User clicks the call-to-action on the contextual upgrade prompt. | - |
| `upgrade_started` | User initiates the checkout/upgrade flow from the contextual prompt. | - |
| `subscription_started` | User successfully starts a subscription (Trial or Active). | `plan` |

## User Properties (Traits)

These properties are maintained at the user level and updated periodically:
- `segment`: Behavioral persona (e.g., `consistent-learner`, `early-drifter`).
- `readinessScore`: Aggregate score of preparation readiness.
- `driftScore`: Real-time score indicating likelihood of churn/disengagement.
- `revisionDebtCount`: Number of overdue revision topics.
- `currentStreak`: Current daily active streak.
- `subscriptionStatus`: Current plan tier (`free`, `trial`, `active`, `churned`).

---
*Note: In the current prototype, event generation is simulated deterministically via `src/data/generator.ts` to power the Product Control Center and Experiments dashboard.*
