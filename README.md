# Smart Campus — PBL Project

A full-stack campus services demo for the **On-demand Cleaning Service** and **Lost & Found Hub** modules. The project uses React and Vite for the frontend, Node.js and Express for the backend API, and a JSON file for simple local persistence.

> **Status:** This is an academic prototype, not a production-ready campus service. Before deployment, replace demo authentication and JSON-file persistence with institution-managed identity, a transactional database, role-based authorization, audit logging, backups, rate limiting, and HTTPS deployment configuration.

## Run locally

Install Node.js 20.19+ (or 22.12+), then run these commands from the project root:

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite server proxies `/api` requests to the Express API on port `4000`. `npm run build` creates a production frontend build in `frontend/dist/`; `npm start` starts the API server.

Demo account: `student@campus.edu` / `Campus@123`.

## Stack and folders

- `frontend/` — React 19, Vite 8, responsive dark-blue UI.
- `backend/` — Node.js and Express 5 REST API, demo authentication, server-side validation, and JSON persistence in `backend/data/db.json`.
- `docs/` — requirements, Jira-ready project plan, source test cases, defect register, project report, presentation outline, and demo checklist.
- `git/` — Git workflow notes; `.git/` contains the initialized repository metadata.

## Demo limitations

This is a classroom prototype. The demo account is configured in the backend (override `DEMO_EMAIL` and `DEMO_PASSWORD` in the environment for a local run), sessions are held in memory, and the JSON file is for single-user local demonstrations. It does not implement production-grade account storage, password hashing, a production database, or external campus alerts. Found-item conversations are stored by the API but are not real email or chat delivery. Google Fonts are optional; system fonts are used if the network is unavailable.

## PBL scope

The two modules match the supplied project workbook. `docs/test-cases.md` preserves the workbook's seven recorded PASS results and distinguishes those source results from fresh execution against this React and Express implementation. Jira setup steps and a backlog are in `docs/jira-project-plan.md`.
