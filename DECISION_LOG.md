# PrepDrift PM Decision Log

This document captures key product management decisions that shape PrepDrift's roadmap, feature set, and experimentation strategy. 

## 1. Why we built Recovery Mode

**Context:** Analysis of user behavior revealed that missing the first daily target leads to a substantial drop in Day-7 (D7) retention (from 36.9% to 18.6%). 

**Options Considered:**
1. *Gamification (Leaderboards/Badges)*: Rejected. Does not address the root cause of lost momentum; can demoralize users already falling behind.
2. *Passive Reminders ("You missed your goal")*: Rejected. High risk of notification fatigue and causing users to feel overwhelmed.
3. *Targeted Micro-Intervention (Recovery Mode)*: **Selected.**

**Decision:** We built Recovery Mode to intercept the user immediately after drift is detected. By offering a low-friction, AI-personalised micro-session (e.g., 3-5 quick questions based on past weaknesses), we help users regain their streak and rebuild practice confidence without the overwhelming feeling of a full missed session.

## 2. Why we chose Next-Day Return as the primary metric for Recovery

**Context:** The ultimate goal of Recovery Mode is to improve long-term retention (e.g., D7, D30). 

**Options Considered:**
1. *D7 Retention*: High confidence, but a slow feedback loop for rapid experimentation.
2. *Session Completion Rate*: Fast feedback loop, but doesn't prove the intervention actually changed future behavior.
3. *Next-Day Return (D2)*: **Selected.**

**Decision:** We chose Next-Day Return as the primary metric for EXP-001. It provides an immediate, highly sensitive signal on whether the micro-intervention successfully repaired the user's habit loop. D7 retention is retained as a critical secondary guardrail metric to ensure short-term gains translate into sustained engagement.

## 3. Why we are testing a Contextual Upgrade Prompt (EXP-002)

**Context:** The current monetization strategy relies on generic upgrade prompts and hard paywalls, which have an average conversion rate of 2.7%.

**Observation:** Users who complete a Recovery Mode session demonstrate high intent and are actively experiencing the value of personalized, AI-driven guidance. 

**Decision:** Instead of relying purely on passive paywalls, we are hypothesizing that **monetizing highly engaged, high-value moments** will perform better. EXP-002 tests a Contextual Upgrade Prompt shown immediately after a successful Recovery session. The messaging pivots from generic ("Unlock Premium") to contextual ("Your preparation is improving. Get deeper personalised guidance..."). 

By aligning the upgrade ask with a moment of user accomplishment and product value realization, we anticipate a higher conversion rate (Subscription Started) and stronger click-through intent.
