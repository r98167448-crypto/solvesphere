import httpx
from typing import Optional, Dict, Any
from app.core.config import settings

async def call_ai_classify(description: str) -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(
                f"{settings.AI_SERVICE_URL}/ai/classify",
                json={"description": description}
            )
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass
    
    # Lightweight deterministic heuristic fallback
    desc_lower = description.lower()
    if any(k in desc_lower for k in ["water", "pipe", "drainage", "leak", "sewage"]):
        domain, sub = "Water & Sanitation", "Supply & Drainage"
    elif any(k in desc_lower for k in ["road", "pothole", "traffic", "street light", "sidewalk"]):
        domain, sub = "Urban Infrastructure", "Roads & Mobility"
    elif any(k in desc_lower for k in ["garbage", "waste", "dump", "plastic", "recycle"]):
        domain, sub = "Environment & Waste", "Solid Waste Management"
    elif any(k in desc_lower for k in ["school", "education", "classroom", "books", "student"]):
        domain, sub = "Education", "School Infrastructure"
    elif any(k in desc_lower for k in ["health", "clinic", "hospital", "medicine", "doctor"]):
        domain, sub = "Public Health", "Primary Care"
    else:
        domain, sub = "Civic Infrastructure", "General Community"
    
    return {"domain": domain, "sub_domain": sub, "location_type": "urban"}

async def call_ai_priority(description: str, people_affected: int = 100, severity: str = "medium") -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(
                f"{settings.AI_SERVICE_URL}/ai/priority-score",
                json={"description": description, "people_affected": people_affected, "severity": severity}
            )
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass
    
    desc_lower = description.lower()
    score = 0.5
    if any(k in desc_lower for k in ["danger", "hazard", "flood", "fire", "urgent", "death", "epidemic", "electric"]):
        score = 0.88
        priority = "high"
    elif any(k in desc_lower for k in ["blocked", "broken", "overflow", "severe"]):
        score = 0.65
        priority = "medium"
    else:
        score = 0.35
        priority = "low"
        
    return {"priority": priority, "score": score}

async def call_ai_duplicates(challenge_id: str, description: str) -> list:
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(
                f"{settings.AI_SERVICE_URL}/ai/check-duplicate",
                json={"challenge_id": challenge_id, "description": description}
            )
            if resp.status_code == 200:
                return resp.json().get("duplicates", [])
    except Exception:
        pass
    return []

async def call_ai_matching(challenge_id: str, description: str) -> list:
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(
                f"{settings.AI_SERVICE_URL}/ai/match-expertise",
                json={"challenge_id": challenge_id, "description": description}
            )
            if resp.status_code == 200:
                return resp.json().get("matches", [])
    except Exception:
        pass
    return []
