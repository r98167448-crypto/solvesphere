# SolveSphere 🌐

> **AI-Powered Civic Problem Solving & Multi-Institutional Collaboration Platform**  
> *Connecting Citizens, Government, Academic Research Labs, Industry CSR, and Schools to report, verify, prioritize, and collaboratively engineer solutions for real societal challenges.*

---

## 🔗 Live Demo & Links

- 🚀 **Live Demo**: [https://r98167448-crypto.github.io/solvesphere/](https://r98167448-crypto.github.io/solvesphere/)
- 💻 **GitHub Repository**: [https://github.com/r98167448-crypto/solvesphere](https://github.com/r98167448-crypto/solvesphere)
- 🗺️ **Public GIS Map**: [https://r98167448-crypto.github.io/solvesphere/map](https://r98167448-crypto.github.io/solvesphere/map)
- 🔑 **Department Sign-In**: [https://r98167448-crypto.github.io/solvesphere/login](https://r98167448-crypto.github.io/solvesphere/login)

---

## 🌟 Key Innovations & Features

### 1. 🖼️ Ambient Awareness Campaign
- Features high-resolution, photorealistic campaign visuals rolling seamlessly in the background with subtle transparency and glassmorphic foreground cards.
- Covers three core civic crisis vectors:
  1. **Safe Potable Water Restoration & Leakage Control**
  2. **Urban Greening, Tree Corridors & Circular Waste Segregation**
  3. **High-Grade Road Pavement Repair & Solar Illumination**

### 2. 🏛️ Department-Separated Portals & Fast Switcher
Avoids mixed-up role authentication by offering distinct department access points directly on the navigation bar and sign-in page:
- **Citizen Portal**: Community problem reporting with direct photo upload, neighborhood upvotes, and status tracking.
- **Government & Municipal Administration**: Verification queue, duplicate checks, project commissioning, and district KPI dashboards.
- **University Research Labs**: Smart AI-ranked matching between civic challenges and laboratory engineering capabilities.
- **Industry & Corporate CSR**: High-impact sponsorship opportunities, grant allocation, and engineering mentorship.
- **School Eco Clubs**: Simplified reporting interface for student safety and pedestrian hazards.

### 3. 📸 Direct Photo Evidence Upload
- Direct drag-and-drop or camera file upload (`JPG`, `PNG`, `WEBP`) with instant client-side preview and remove controls.
- Eliminates manual image URL inputs.

### 4. 🧠 Dedicated AI Intelligence Microservice
- **Semantic Classification (`/ai/classify`)**: Automated extraction of domain, sub-domain, and location type.
- **Priority Scoring (`/ai/priority-score`)**: Multi-factor scoring based on population affected, hazard level, and severity keywords.
- **Duplicate Detection (`/ai/check-duplicate`)**: Semantic vector cosine similarity with a strict `> 0.85` threshold to flag redundant municipal complaints.
- **Expertise Matching (`/ai/match-expertise`)**: Ranks university research specializations and corporate CSR focus areas from 0–100%.

---

## 🏗️ Architecture & Monorepo Structure

```
solvesphere/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml  # Automated GitHub Actions CD to GitHub Pages
├── apps/
│   └── web/                  # Next.js 14 App Router + Tailwind CSS + TypeScript + Leaflet GIS
│       ├── app/              # Routes: /, /map, /login, /signup, /citizen, /admin, /university, /industry, /school
│       ├── components/       # AwarenessBackground, Navbar, MapWrapper, ChallengeDetailClient
│       ├── lib/              # api.ts (JWT session & fetch wrapper)
│       └── public/           # Static awareness assets & Leaflet icons
├── services/
│   ├── core-api/             # FastAPI (Python 3.11+): Auth, Challenges, Projects, Milestones, Analytics
│   │   ├── app/
│   │   │   ├── core/         # config.py, database.py, security.py (Bcrypt & JWT)
│   │   │   ├── models/       # SQLAlchemy models matching Section 3 schema
│   │   │   ├── routers/      # auth.py, challenges.py, projects.py, extras.py
│   │   │   └── schemas/      # Pydantic v2 schemas
│   │   ├── seed.py           # Realistic multi-institutional civic seeder
│   │   └── tests/            # Automated test suite (unittest)
│   └── ai-service/           # FastAPI Microservice: NLP classification, priority scoring, duplicate detection
│       ├── app/
│       │   ├── models/       # Semantic vector matcher & TF-IDF cosine similarity engine
│       │   └── routers/      # ai.py (/classify, /priority-score, /check-duplicate, /match-expertise)
│       └── tests/            # Automated test suite (unittest)
├── infra/
│   └── docker-compose.yml    # Full stack orchestration (PostgreSQL + PostGIS, Core API, AI Service, Web)
└── README.md
```

---

## ⚡ Quick Start & Local Run

### Prerequisites
- Node.js 18+
- Python 3.10+ (or Docker)

### 1. Run with Docker Compose (Full Stack)
```bash
docker compose -f infra/docker-compose.yml up --build
```
- Frontend: `http://localhost:3000`
- Core API: `http://localhost:8000/docs`
- AI Microservice: `http://localhost:8001/docs`

### 2. Manual Local Development

#### Core API:
```bash
cd services/core-api
python -m venv venv
.\venv\Scripts\activate          # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python seed.py                   # Seed sample challenges & department accounts
uvicorn app.main:app --reload --port 8000
```

#### AI Microservice:
```bash
cd services/ai-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

#### Web Frontend:
```bash
cd apps/web
npm install
npm run dev
```

---

## 👥 Demo Institutional Accounts

| Department | Email | Password | Role Description |
|---|---|---|---|
| **Citizen** | `citizen@gmail.com` | `citizen123` | Public problem reporting & upvoting |
| **Government / Admin** | `admin@solvesphere.org` | `admin123` | Municipal verification queue & triage |
| **University Lab** | `univ@university.edu` | `univ123` | Engineering prototypes & research matching |
| **Industry & CSR** | `csr@ecotech.com` | `industry123` | Sponsorship grants & mentors |
| **School Eco Club** | `ecoclub@stmarys.edu` | `school123` | Simplified campus hazard reports |

---

## 🧪 Testing

Run test suites across both microservices:
```bash
# Core API Tests
cd services/core-api
.\venv\Scripts\python -m unittest discover -s tests -p "test_*.py"

# AI Microservice Tests
cd services/ai-service
python -m unittest discover -s tests -p "test_*.py"
```

---

## 👨‍💻 Author & Profile
- **Author**: Vishal R
- **GitHub**: [r98167448-crypto](https://github.com/r98167448-crypto)
- **LinkedIn**: [https://www.linkedin.com/in/vishal-r-63ab88394/](https://www.linkedin.com/in/vishal-r-63ab88394/)
- **Email**: r98167448@gmail.com
