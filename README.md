# 🔱 SAPTAMUKHA — The Seven Faces

> *Across 8 billion humans, someone walks this Earth with your face.*

A mystical face-matching web application built with React 18, Vite, and Tailwind CSS. Find your celebrity doppelgänger instantly, then search for real soul twins across the world.

---

## Architecture Overview

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind | UI, camera overlay, celebrity matching |
| Camera UX | face-api.js (client-side) | Live detection, quality guard, visual overlay |
| Embeddings | Python FastAPI microservice | Face embeddings via `/embed-multi` |
| Backend | Supabase (PostgreSQL + pgvector) | Face records, matching, storage |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11 (for face service)
- A Supabase project
- (Optional) Fly.io account for deploying the face service

### 1. Install Frontend Dependencies

```bash
cd saptamukha
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase and face service keys
```

### 3. Run Frontend Dev Server

```bash
npm run dev
# Serves at http://localhost:5173
```

### 4. Run Face Embedding Service (separate terminal)

```bash
cd face-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The service will download model weights on first run (~300MB).

### 5. Set Up Supabase Database

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → New Query
3. Paste the contents of `supabase/migrations/002_souls_schema.sql`
4. Run the query

## Project Structure

```
saptamukha/
├── face-service/              # Python backend service
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── fly.toml
├── public/                    # Static frontend assets
├── scripts/
│   └── ...
├── src/
│   ├── components/            # React components
│   ├── context/                 # LanguageContext, AuthContext
│   ├── hooks/                   # React hooks
│   ├── lib/                     # Frontend service helpers
│   ├── pages/
│   │   └── Home.jsx
│   └── styles/                  # Frontend styles
├── supabase/
│   ├── migrations/
│   │   └── 002_souls_schema.sql
│   └── functions/
│       ├── match-faces/
│       └── send-notification/
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Deploying the Backend

The backend service can be deployed separately from the frontend.

```bash
cd face-service
fly launch
fly deploy
```

Prefer routing frontend requests through your own domain path such as `/api/vision`.
Use `VITE_FACE_API_BASE_URL` only when a direct backend origin is truly needed.

---

## Key Features

- **🔱 Facial Discovery** — Real-time face processing with app-controlled result flow
- **🪷 Sacred Mirror Camera** — face-api.js live overlay with quality guard (lighting, distance, stability)
- **🌐 10 Languages** — Hindi, English, Spanish, Portuguese, Japanese, Korean, Chinese, Indonesian, Tagalog
- **⚡ Backend Analysis Service** — Dedicated processing service for scanning and matching
- **🧿 Face Rarity Score** — Computed from backend analysis signals
- **🔒 Privacy-First** — Analysis data stays within infrastructure you control

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_FACE_API_BASE_URL` | Preferred frontend-to-backend base URL |
| `VITE_API_BASE_URL` | Optional generic frontend API base URL |
| `VITE_EMBED_API_KEY` | API key for face embedding service |
| `RESEND_API_KEY` | Resend.com API key for emails |

---

## License

All rights reserved. SAPTAMUKHA 2024.

*Om Namah Shivaya* 🔱
