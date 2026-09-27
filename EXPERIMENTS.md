# PrepDrift Experimentation Log

This document tracks active, planned, and completed product experiments. PrepDrift relies on controlled experimentation to validate hypotheses about student behavior and intervention efficacy.

## Active Experiments

### EXP-001: Recovery Mode After First Missed Target
**Status:** Running 🟢
**Launch Date:** 2026-09-15

**1. Problem Statement**
Early disengagement after first missed target. Our product intelligence reveals that D7 retention drops significantly for users who fail their first daily study target compared to those who complete it.

**2. Hypothesis**
If we show a personalised, low-friction recovery intervention (Recovery Mode) immediately after a learner's first missed target, more learners will return the following day, preventing early churn.

**3. Audience**
New users who miss their first daily study target within their first 7 days on the platform.

**4. Metrics**
- **Primary Metric:** Next-day return rate (Day 2 retention relative to the target miss).
- **Secondary Metrics:** Recovery start rate, Recovery completion rate, D7 retention.
- **Guardrails:** Session abandonment rate (user leaves app immediately after seeing the prompt).

**5. Variants**
- **Control:** Standard experience. The missed target is logged, but no immediate intervention is surfaced.
- **Variant:** AI Recovery Intervention. User is prompted to start a 10-15 minute targeted recovery session focusing on their weakest topic.

**6. Interim Results (as of latest data pull)**
- **Control (n=1020):** Next-day return: 18.5%. D7 retention: 11.2%.
- **Variant (n=1018):** Next-day return: 62.4%. D7 retention: 50.1%.
- *Note: These are synthetic interim results. The effect size is unusually large and indicates a strong directional signal, but causality requires full maturation of the cohort.*

**7. PM Decision & Next Steps**
The variant shows an encouraging directional improvement. The prototype treats this as a strong signal. 
*Next Action:* Continue running the experiment to reach statistical significance on the D7 retention metric. Prepare to roll out the intervention to 100% of the audience if the trend holds.

---

## Planned Experiments

### EXP-002: Proactive Revision Scheduling vs Reactive Alerts
**Status:** Planned 🟡
**Hypothesis:** Automatically injecting a revision session into the user's study plan when Revision Debt hits 2 topics will prevent debt accumulation better than sending an alert when debt hits 3 topics.
**Primary Metric:** Average Revision Debt per user at Day 14.

### EXP-003: Difficulty-Adjusted Practice for Low-Confidence Learners
**Status:** Planned 🟡
**Hypothesis:** For the "Low Practice Confidence" segment, dynamically lowering the initial MCQ difficulty to guarantee a 70%+ accuracy on the first 5 questions will increase session completion rates.
**Primary Metric:** Practice session completion rate for the target segment.
