# PrepDrift Data Dictionary

This document defines the schema and generation logic for PrepDrift's synthetic analytics dataset. The data represents 5,000 users and over 30,000 events, built to demonstrate product intelligence concepts.

## 1. Users Dataset (`analyticsUsers`)

Represents the core user entity and computed behavioral attributes.

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Unique identifier (e.g., `u_00001`). |
| `name` | string | User's full name. |
| `exam` | string | Target examination (e.g., UPSC CSE, CAT). |
| `signupDate` | string | Date of registration (YYYY-MM-DD). |
| `segment` | UserSegment | Behavioral classification ('consistent-learner', 'early-drifter', etc.). |
| `readinessScore` | number | Current estimated readiness (0-100). |
| `driftScore` | number | Current drift severity (0-100). |
| `revisionDebtCount`| number | Number of topics currently overdue for revision. |
| `completedFirstTarget`| boolean| True if the user hit their first study goal. |
| `recoveryCompleted`| boolean | True if the user successfully finished a recovery session. |
| `d7Return` | boolean | True if the user was active 7 days after signup. |

## 2. Events Dataset (`analyticsEvents`)

Represents individual user actions, structured for funnel and behavioral analysis.

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | string | Unique event identifier. |
| `userId` | string | Foreign key to the User. |
| `eventName` | EventName | The specific action (e.g., `mcq_completed`, `recovery_started`). |
| `timestamp` | string | ISO 8601 timestamp of the event. |
| `sessionId` | string | Groups related events together. |
| `topic` | string | (Optional) The subject matter context. |
| `properties`| object | Additional event metadata (e.g., `{ accuracy: 85, duration_min: 15 }`). |

### Key Event Types
- **Lifecycle:** `signup`, `onboarding_complete`, `day_2_return`, `day_7_return`
- **Study:** `first_practice`, `study_plan_created`, `target_completed`, `target_missed`
- **Practice:** `mcq_started`, `mcq_completed`, `mcq_answer_wrong`, `revision_started`, `revision_completed`
- **Intervention:** `recovery_prompt_seen`, `recovery_started`, `recovery_completed`

## 3. Data Generation Logic

The synthetic data in `src/data/generator.ts` is deterministic, seeded via a PRNG (`mulberry32`). This ensures that analytics, SQL queries, and product insights remain stable across reloads.

**Behavioral Relationships:**
The data generator enforces logical correlations rather than pure randomness. For example:
- **Segments drive behavior:** A `consistent-learner` has a 95% chance to complete onboarding, while a `low-practice-confidence` user has a 75% chance.
- **Cascading drop-offs:** A user cannot have `firstPracticeCompleted = true` if `completedOnboarding = false`.
- **Intervention impact:** Users with `recoveryCompleted = true` have a mathematically higher probability of having `d2Return = true` compared to drifting users who do not start recovery. This relationship is what powers the Key Insight and Experiment results.
