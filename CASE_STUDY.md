# PrepDrift Product Case Study

## Context
This project was built as a product-thinking portfolio demonstration for a Founding Product Manager role at an AI-first competitive-exam startup. The goal was to prove the ability to identify a behavioral problem, design an AI-powered intervention, and measure its impact.

## Problem
Competitive exam aspirants slowly drift from their preparation plans. They miss targets, accumulate revision debt, and gradually lose momentum. Traditional dashboards only show what happened, leaving users overwhelmed by their own failure.

## User
A highly motivated but occasionally inconsistent competitive-exam aspirant who feels guilty when falling behind and needs a low-friction way to get back on track.

## Observation
Users rarely churn overnight. Disengagement is preceded by small, leading indicators—specifically, failing to complete their first study target or letting revision debt pile up in a single subject.

## Opportunity
Instead of sending generic "keep going!" push notifications, what if the product detected the exact moment of drift and offered a tiny, 20-minute tailored recovery session to immediately repair the habit?

## Hypothesis
Triggering an AI-personalised Recovery Mode immediately after a user misses their first target will significantly improve their next-day return rate and D7 retention.

## Solution
PrepDrift: A background intelligence engine that monitors study behavior, identifies topics with high revision debt and low accuracy, and prescribes a 4-step recovery session (Refresh, Practice, Active Recall, Review).

## User Journey
1. Learner logs in after a few days of inactivity.
2. The dashboard highlights a "Drifting" signal instead of generic stats.
3. Learner enters "Recovery Mode" for 20 minutes.
4. The system validates the session and schedules the next review.
5. PMs monitor the funnel and A/B test the intervention.

## Data Model
The prototype relies on a synthetic behavioral schema involving `users`, `events` (e.g., target_completed, session_abandoned), and `topics`. 

## AI Layer
A deterministic AI rules engine analyzes the drift assessment (accuracy drop + days since last revision) to output a conversational diagnosis and a customized recovery plan, providing a proof-of-concept for a future LLM integration.

## Product Analytics & Control Center
An integrated PM dashboard exposes activation funnels, behavioral segmentation, and a SQL Explorer to query the synthetic event stream and uncover actionable insights. The **Product Control Center** provides a high-level view of the complete PM loop: Observe → Diagnose → Prioritize → Hypothesize → Experiment → Measure → Decide.

## Experiments
**EXP-001**: An A/B test validating the impact of Recovery Mode against a control group to measure the directional lift in D7 retention.

**EXP-002**: A Contextual Upgrade Prompt testing the hypothesis that asking for a subscription immediately following a successful recovery session yields higher conversion intent than generic paywalls.

## Metrics
- **North Star**: Subscription Started (Conversion rate).
- **Primary Retention**: Next-day return rate & D7 Retention.
- **Guardrail**: Session abandonment rate (ensuring recovery isn't too hard).

## Tradeoffs
- **Deterministic AI over LLMs**: Chosen to ensure zero-latency portfolio demonstrations without relying on external API keys.
- **Micro-session over full platform**: Focused entirely on the recovery loop rather than building generic features like a video player or calendar.

## Limitations
The data is entirely synthetic, the experiment results are simulated, and the AI feedback in Active Recall is mocked.

## Production Roadmap
1. Integrate PostHog for real event telemetry.
2. Replace deterministic rules with an LLM for nuanced diagnosis and grading.
3. Build the experiment assignment infrastructure.

## What I Learned
Focusing strictly on the "intervention" loop rather than the "platform" features forces much sharper product thinking. It is much harder to design a 20-minute experience that changes behavior than it is to build a generic analytics dashboard.
