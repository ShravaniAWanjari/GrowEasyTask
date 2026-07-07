GrowEasy AI CSV Importer — Execution Plan

Goal: Build an AI-powered CSV Importer that maps arbitrary CSV formats (Facebook/Google Ads exports, real estate CRM exports, sales reports, manual spreadsheets) into GrowEasy's fixed CRM schema, with a Next.js frontend and Node/Express backend, deployed to Vercel (frontend) and Render (backend).

Deadline: 12 July 2026 — submit hosted app URL + GitHub repo URL + position to varun@groweasy.ai.

This plan is broken into phases. Execute one phase at a time, in order. Each phase has: scope, deliverables, and acceptance criteria. Do not start a phase until the prior phase's acceptance criteria are met. Commit to git at the end of every phase with a clear commit message.

Reference: CRM Schema (source of truth for the whole project)

created_at — must parse via new Date(created_at) in JS
name — lead name
email — primary email (first if multiple; rest -> crm_note)
country_code — e.g. +91
mobile_without_country_code — primary mobile (first if multiple; rest -> crm_note)
company
city
state
country
lead_owner
crm_status — ENUM: GOOD_LEAD_FOLLOW_UP | DID_NOT_CONNECT | BAD_LEAD | SALE_DONE
crm_note — free text: extra emails/phones, remarks, follow-ups
data_source — ENUM: leads_on_demand | meridian_tower | eden_park | varah_swamy | sarjapur_plots (blank if no confident match)
possession_time
description

Hard extraction rules (must be enforced in code, not just prompted):

crm_status must be one of the 4 allowed values, or blank — never invented values. Validate server-side after AI returns JSON; coerce invalid values to blank + log a warning.
data_source must be one of the 5 allowed values, or blank. Same validation approach.
created_at must be JS-Date-parseable. If AI returns an ambiguous/unparseable date, attempt normalization; if still invalid, blank it out (don't drop the record for this alone).
A record with neither email nor mobile number must be skipped (counted in "skipped", with a reason).
Multiple emails/mobiles: keep the first in its field, append the rest into crm_note prefixed clearly (e.g. Also: alt@x.com).
Output must remain valid single-row CSV/JSON — no unescaped newlines inside fields.

Phase 0 — Repo Scaffolding & Tooling

Scope:

Monorepo layout:

/frontend (Next.js app, deployed to Vercel)
/backend (Node/Express app, deployed to Render)
/README.md (root — links to both, high-level overview)

Initialize git, .gitignore (node_modules, .env, dist/build, .next).
Root README.md stub with project name, architecture diagram (text), and links to /frontend/README.md and /backend/README.md (to be filled in later phases).
Decide and pin package manager (npm) and Node version (.nvmrc or engines field).
Set up TypeScript in both frontend and backend for type safety (evaluation criterion).
Set up ESLint + Prettier shared config basics in both packages.
Create backend/.env.example listing required env vars: PORT, AI_PROVIDER, OPENAI_API_KEY / GEMINI_API_KEY / ANTHROPIC_API_KEY (support whichever is configured), CORS_ORIGIN.
Create frontend/.env.example with NEXT_PUBLIC_API_BASE_URL.

Acceptance Criteria:

npm install succeeds in both /frontend and /backend.
npm run dev boots an empty Next.js app and an empty Express server without errors.
Git repo initialized with an initial commit; no secrets committed.
