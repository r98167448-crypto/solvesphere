# SolveSphere 🌐

SolveSphere is an AI-powered societal problem-solving platform connecting **Citizens**, **Government**, **Universities**, **Industry**, and **Schools** to report, verify, prioritize, and solve local challenges.

## 🚀 Features
- **Role-Based Portals**: Dedicated portals for Citizens, Government/Admin, Universities, Industry, and Schools.
- **AI Intelligence**:
  - Semantic challenge classification (Domain, Sub-domain, Location type).
  - Priority scoring based on severity and affected population.
  - Duplicate detection to eliminate redundant issues.
  - Smart expertise matching for Universities & Industry CSR collaboration.
- **Interactive GIS Map**: Spatial exploration with Leaflet & OpenStreetMap.
- **Project Tracking**: Milestone tracking and team oversight.

## 📦 Project Structure
```
solvesphere/
├── apps/
│   └── web/                  # Next.js 14 App Router + Tailwind CSS + TypeScript
├── services/
│   ├── core-api/             # FastAPI Core Backend + Auth + PostgreSQL/PostGIS
│   └── ai-service/           # FastAPI AI Microservice (Sentence Embeddings, Scoring, Matching)
├── infra/
│   └── docker-compose.yml    # Docker configuration
└── README.md
```

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Leaflet.js
- **Backend Core API**: FastAPI (Python 3.11+), SQLAlchemy, Pydantic v2, JWT Auth
- **AI Service**: FastAPI, Sentence-Transformers / Cosine Vector Similarity
- **Database**: PostgreSQL 15 + PostGIS (with portable SQLite mode for local dev)

## 👤 Author
- **Author**: Vishal R
- **GitHub**: [r98167448-crypto](https://github.com/r98167448-crypto)
- **LinkedIn**: [Vishal R](https://www.linkedin.com/in/vishal-r-63ab88394/)
