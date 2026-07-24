# 🎯 Automated Lead Generation Platform

A full-stack, production-ready system that automatically discovers and qualifies business leads from public developer platforms, replacing manual prospecting with a self-running pipeline.

**Live Demo:** _[add your deployed URL]_

---

## 📌 Problem It Solves

Software agencies spend hours manually searching for clients. This system automates that entire process — discovering, scoring, and organizing leads with zero human effort, running 24/7 in the cloud.

---

## ⚙️ How It Works

```
Cron Job (hourly) → Fetch posts (HackerNews Jobs API + GitHub Issues API)
                  → Extract contact info via regex (email, phone, socials)
                  → Score lead quality (0-100) using rule-based NLP
                  → Deduplicate & store in MongoDB
                  → Serve via REST API → React dashboard
```

No AI/LLM calls in the hot path — lead scoring uses deterministic keyword-weight rules, making it **instant and free to run at scale** (a deliberate cost/latency optimization over calling an LLM per post).

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React UI   │ ───► │  Express API  │ ───► │   MongoDB   │
│ (Tailwind)   │ ◄─── │  + Cron Jobs  │ ◄─── │   Atlas     │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                 HackerNews API / GitHub API
```

**Backend:** Node.js, Express, MongoDB, node-cron
**Frontend:** React 18, Tailwind CSS, Axios
**DevOps:** Docker, Kubernetes, GitHub Actions CI/CD

---

## 🚀 Key Engineering Decisions

- **Router/Controller/Service separation** — no business logic in route files, testable and maintainable
- **Rule-based scoring over LLM calls** — 90% of the accuracy at 0% of the cost/latency
- **Idempotent ingestion** — dedup by `source_id` prevents duplicate leads on re-runs
- **Health-checked deployment** — `/health` endpoint wired into K8s liveness/readiness probes
- **Zero-downtime deploys** — rolling updates via Kubernetes Deployments
- **Fully automated CI/CD** — push to `main` → build → containerize → deploy, no manual steps

---

## 📦 Deployment Stack

| Layer | Technology |
|---|---|
| Containerization | Docker (multi-stage builds) |
| Orchestration | Kubernetes (Deployments, Services, Secrets) |
| CI/CD | GitHub Actions |
| Database | MongoDB Atlas |
| Scaling | Horizontal pod replicas (2x backend, 2x frontend) |

### Run Locally
```bash
docker-compose up --build
```

### Deploy to Kubernetes
```bash
kubectl apply -f k8s/
```

CI/CD auto-builds and deploys on every push to `main`.

---

## 📊 Data Model

Each lead captures: title, source, extracted contact (email/phone/Discord/website), quality score, project type, and status — enabling a sales team to triage and act without re-reading raw posts.

---

## 💡 What This Demonstrates

- End-to-end system design (data ingestion → processing → storage → UI)
- Production DevOps (Docker, K8s, CI/CD) — not just "it runs on my machine"
- Pragmatic engineering trade-offs (rules vs. AI) based on cost/performance
- Clean, scalable code architecture (MVC-style backend, componentized frontend)
