# PrepDrift
> A product intelligence and recovery prototype designed to detect and reverse early study disengagement.

## Overview
PrepDrift is an intervention-focused study dashboard conceptualized for learners preparing for high-stakes exams (like UPSC CSE). Most learners do not abandon their goals all at once; they gradually drift through missed targets, declining accuracy, and growing revision debt. PrepDrift shifts the focus from passive progress tracking to proactive, context-aware recovery—intervening *before* temporary drift turns into long-term disengagement.

## Key Features

- **Readiness Score & Overview Dashboard**
  A high-level view that translates raw study volume into a qualitative "Readiness" metric, highlighting revision debt, consistency, and immediate drift signals.
  *(Create `docs/images/overview.png` and replace this text with: `![Overview Dashboard](docs/images/overview.png)`)*

- **Recovery Mode**
  A personalized intervention flow triggered when a learner drifts off track. Instead of a generic reminder to "study more," it offers a low-friction, guided micro-session (Refresh → Practice → Recall) targeted exactly at the failing topic.
  *(Create `docs/images/recovery.png` and replace this text with: `![Recovery Mode](docs/images/recovery.png)`)*

- **Product Intelligence & Insights**
  A data exploration layer featuring an activation funnel, 7-day drift distribution charts, and a SQL Explorer for querying synthetic user analytics. It highlights the exact retention drop-offs that occur when learners miss their targets.
  *(Create `docs/images/insights.png` and replace this text with: `![Product Insights](docs/images/insights.png)`)*

- **Experimentation Module**
  A hypothesis-driven A/B test tracking interface. It allows product managers to draft experiments (e.g., "Contextual Upgrade Prompt After Recovery"), defining audiences, primary/secondary metrics, and guardrails based on actual user signals.
  *(Create `docs/images/experiments.png` and replace this text with: `![Experimentation](docs/images/experiments.png)`)*

- **Settings & Preferences**
  A fully responsive settings layer allowing users to manage notifications and study preferences while maintaining a clean, full-width SaaS layout.

## Product Thinking / Why This Exists

This prototype was built to demonstrate product management thinking translated directly into a frontend experience:

1. **Why "Readiness" instead of "Completion"?**
   Completing a syllabus is a vanity metric if retention is low. "Readiness" factors in revision debt and accuracy, creating a more honest indicator of actual exam preparedness.
2. **Why Recovery Mode?**
   Generic push notifications induce guilt and lead to notification fatigue. Recovery Mode lowers the cognitive barrier to reentry by offering a curated, bite-sized session precisely when the user's momentum breaks.
3. **Why an Experimentation Module?**
   Great products are built on validated hypotheses. The built-in experiments module demonstrates a data-informed PM workflow: observing a behavioral signal (e.g., 18.6% D7 retention after a missed target), formulating a hypothesis, and tracking the impact of an intervention.

## Tech Stack

This is a frontend-only prototype using simulated/synthetic data (no real backend or database is required to run it).

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI framework |
| **TypeScript** | Type safety and domain modeling |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling system |
| **Framer Motion** | Micro-interactions and fluid page transitions |
| **Recharts** | Data visualization (funnels, drift distribution) |
| **Lucide React** | Consistent SVG iconography |

## Project Structure

```text
src/
├── components/          # Reusable UI building blocks
│   ├── insights/        # Charts, funnels, and SQL explorer UI
│   ├── recovery/        # The Recovery Mode session flow
│   └── ...              # Core layout (Sidebar, AppShell, etc.)
├── data/                # Synthetic user data, topics, and metrics
├── lib/                 # Business logic (analytics, driftEngine, aiRecovery)
├── pages/               # Top-level route components
└── types/               # Global TypeScript definitions (Analytics, Config, etc.)
```

## Getting Started / Setup

Because this is a standalone prototype using synthetic data, **no environment variables or backend setup is required**.

```bash
# Clone the repository
git clone https://github.com/inkunj04/PrepDrift.git

# Navigate into the project directory
cd PrepDrift

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

- `npm run dev` — Starts the Vite development server on port 5173.
- `npm run build` — Compiles TypeScript and builds the app for production into the `dist/` folder.
- `npm run lint` — Runs ESLint to verify code quality and style constraints.
- `npm run preview` — Boots up a local web server to serve the production build from `dist/`.

## Roadmap / What's Next

While this serves as a portfolio piece, if it were to evolve into a production application, the immediate next steps would be:
- **Backend & Real User Authentication:** Migrating away from synthetic `localStorage` data to a persistent database (e.g., PostgreSQL + Supabase/Firebase).
- **Dynamic Content Engine:** Generating recovery MCQs dynamically based on a user's actual past mistakes rather than pre-seeded mock data.
- **Experimentation Engine Integration:** Wiring the frontend experiments dashboard to a real feature-flagging service like LaunchDarkly or PostHog to control live A/B splits.
- **Mobile Application:** Building a React Native counterpart, as high-frequency micro-interventions (like a 7-minute recovery session) are highly effective on mobile devices.


