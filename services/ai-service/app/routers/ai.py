from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.models.matcher import semantic_matcher

router = APIRouter(prefix="/ai", tags=["AI Engine"])

class ClassifyRequest(BaseModel):
    description: str

class ClassifyResponse(BaseModel):
    domain: str
    sub_domain: str
    location_type: str

class PriorityScoreRequest(BaseModel):
    description: str
    people_affected: Optional[int] = 50
    severity: Optional[str] = "medium"

class PriorityScoreResponse(BaseModel):
    priority: str # low, medium, high
    score: float

class DuplicateRequest(BaseModel):
    challenge_id: str
    description: str

class DuplicateItem(BaseModel):
    challenge_id: str
    similarity_score: float

class DuplicateResponse(BaseModel):
    duplicates: List[DuplicateItem]

class MatchRequest(BaseModel):
    challenge_id: str
    description: str

class MatchItem(BaseModel):
    entity_id: str
    entity_type: str
    score: float

class MatchResponse(BaseModel):
    matches: List[MatchItem]

# Benchmark known existing challenges for duplicate detection
EXISTING_CHALLENGES = [
    {
        "id": "c1-water-leak",
        "description": "Severely broken municipal drinking water pipe leaking contaminated sewage into ground water"
    },
    {
        "id": "c2-garbage-overflow",
        "description": "Solid waste uncollected near school, plastic litter overflowing into street"
    },
    {
        "id": "c3-pothole-arterial",
        "description": "Dangerous deep pothole on main road causing accidents"
    }
]

# Benchmark entities for expertise matching
ENTITIES_CORPUS = [
    {
        "id": "univ-resilience-lab",
        "type": "university",
        "profile": "Water systems, wastewater sanitation, IoT sensors for flood and leakage monitoring, smart environmental solutions"
    },
    {
        "id": "industry-green-roads",
        "type": "industry",
        "profile": "Pavement engineering, recycled plastic bitumen roads, civil infrastructure rehabilitation grants and engineering mentors"
    },
    {
        "id": "univ-urban-planning",
        "type": "university",
        "profile": "Urban waste management, municipal solid waste route optimization, clean air and environmental health"
    }
]

@router.post("/classify", response_model=ClassifyResponse)
def classify_challenge(req: ClassifyRequest):
    desc = req.description.lower()
    if any(w in desc for w in ["water", "pipe", "drain", "sewage", "leak", "tap"]):
        return ClassifyResponse(
            domain="Water & Sanitation",
            sub_domain="Municipal Water Supply & Drainage",
            location_type="urban"
        )
    elif any(w in desc for w in ["road", "pothole", "traffic", "street", "bridge", "pedestrian"]):
        return ClassifyResponse(
            domain="Urban Infrastructure",
            sub_domain="Roads, Potholes & Mobility",
            location_type="urban"
        )
    elif any(w in desc for w in ["garbage", "waste", "dump", "plastic", "trash", "litter"]):
        return ClassifyResponse(
            domain="Environment & Waste",
            sub_domain="Solid Waste Management",
            location_type="urban"
        )
    elif any(w in desc for w in ["school", "education", "classroom", "books", "student"]):
        return ClassifyResponse(
            domain="Education",
            sub_domain="School Infrastructure",
            location_type="urban"
        )
    elif any(w in desc for w in ["health", "hospital", "clinic", "fever", "disease"]):
        return ClassifyResponse(
            domain="Public Health",
            sub_domain="Primary Healthcare & Disease Prevention",
            location_type="urban"
        )
    else:
        return ClassifyResponse(
            domain="Civic Community",
            sub_domain="General Public Facility",
            location_type="urban"
        )

@router.post("/priority-score", response_model=PriorityScoreResponse)
def calculate_priority_score(req: PriorityScoreRequest):
    desc = req.description.lower()
    base_score = 0.4
    
    # Severity multiplier
    if req.severity == "high":
        base_score += 0.3
    elif req.severity == "low":
        base_score -= 0.15
        
    # High urgency keyword boost
    urgent_keywords = ["danger", "hazard", "flood", "fire", "urgent", "electric", "dead", "poison", "fatal", "contamination"]
    if any(k in desc for k in urgent_keywords):
        base_score += 0.3
        
    # Population affected boost
    if req.people_affected and req.people_affected > 200:
        base_score += 0.15
    elif req.people_affected and req.people_affected > 50:
        base_score += 0.08

    final_score = min(1.0, max(0.0, round(base_score, 2)))
    
    if final_score >= 0.7:
        priority = "high"
    elif final_score >= 0.4:
        priority = "medium"
    else:
        priority = "low"
        
    return PriorityScoreResponse(priority=priority, score=final_score)

@router.post("/check-duplicate", response_model=DuplicateResponse)
def check_duplicate(req: DuplicateRequest):
    duplicates = []
    # Check against known corpus
    for item in EXISTING_CHALLENGES:
        if item["id"] == req.challenge_id:
            continue
        sim = semantic_matcher.cosine_similarity(req.description, item["description"])
        # Section 5 requirement: duplicate threshold > 0.85
        if sim >= 0.85:
            duplicates.append(DuplicateItem(challenge_id=item["id"], similarity_score=round(sim, 3)))
            
    return DuplicateResponse(duplicates=duplicates)

@router.post("/match-expertise", response_model=MatchResponse)
def match_expertise(req: MatchRequest):
    matches = []
    for entity in ENTITIES_CORPUS:
        sim = semantic_matcher.cosine_similarity(req.description, entity["profile"])
        # Scale to percentage 0-100%
        score_pct = round(min(100.0, sim * 150.0), 1)
        if score_pct > 20.0:
            matches.append(MatchItem(
                entity_id=entity["id"],
                entity_type=entity["type"],
                score=score_pct
            ))
            
    matches.sort(key=lambda x: x.score, reverse=True)
    return MatchResponse(matches=matches[:5])
