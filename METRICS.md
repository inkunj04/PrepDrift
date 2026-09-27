# PrepDrift Key Metrics & KPIs

This document outlines the core product metrics for PrepDrift, their definitions, how they are tracked, and why they matter for a study recovery product.

## 1. Core KPIs (Product Health)

| Metric | Definition | Why it matters | Source / Calculation |
|--------|------------|----------------|----------------------|
| **Activation Rate** | % of signups who complete onboarding AND their first practice session | Early indicator of product understanding and value realization. | `first_practice_completed` / `signups` |
| **D7 Retention** | % of users who return on the 7th day after signup | Core measure of sustained engagement. | Users active on Day 7 / Cohort size |
| **First Target Completion** | % of users who successfully complete their first study target | Strongest predictor of short-term retention (see Insights). | `target_completed` (first instance) / Active users |
| **Recovery Completion Rate** | % of users who finish a Recovery Session after starting one | Measures the friction and value of our core intervention. | `recovery_completed` / `recovery_started` |

## 2. Behavioral Metrics (Study Patterns)

| Metric | Definition | Interpretation |
|--------|------------|----------------|
| **Drift Score (0-100)** | Composite index of recent target misses, topic inactivity, and accuracy drop | > 40: At risk. > 70: Actively drifting. Primary trigger for AI interventions. |
| **Revision Debt Count** | Number of topics with `lastPracticedDaysAgo > 7` and `accuracy < 70%` | High debt (>3) strongly correlates with D7 churn. Target for proactive scheduling. |
| **Accuracy Delta** | Change in topic accuracy over the last 10 practice sessions | Negative delta triggers "Accuracy collapse" or "Gradual decline" diagnosis in Recovery Engine. |

## 3. The Activation Funnel

We track user flow through these stages to identify drop-off points:
1. **Signup:** Account created.
2. **Onboarding Complete:** Initial preferences set.
3. **First Practice:** First MCQ session logged.
4. **Study Plan Created:** Goals established.
5. **Day 2 Return:** Early habit formation.
6. **Day 7 Return:** Sustained engagement.

*Current observation: The steepest drop-off occurs between First Practice and Day 2 Return, specifically among users who miss their first target.*

## 4. Measuring the Recovery Engine (Feature Success)

To evaluate the AI Recovery Engine, we monitor a specific sub-funnel:
1. **Recovery Prompt Seen:** User is flagged as drifting and shown the intervention CTA.
2. **Recovery Started:** User clicks "Start Recovery".
3. **Recovery Completed:** User finishes the 4-step session (Refresh, Practice, Recall, Review).

**Success criteria for the Recovery feature:**
- **Primary:** Next-day return rate of users who complete recovery vs those who ignore the prompt.
- **Secondary:** Accuracy improvement in the targeted topic during the next standard practice session.
- **Guardrail:** Session abandonment rate (if > 20%, the session is too long or difficult).
