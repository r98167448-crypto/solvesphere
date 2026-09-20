from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.all_models import User, UniversityExpertise, IndustryProfile, Notification, Challenge
from app.schemas.schemas import (
    UniversityExpertiseIn, IndustryProfileIn,
    NotificationOut, AnalyticsDashboardOut
)

profiles_router = APIRouter(tags=["Profiles"])

@profiles_router.put("/universities/expertise")
def update_university_expertise(
    exp_in: UniversityExpertiseIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(UniversityExpertise).filter(UniversityExpertise.user_id == current_user.id).first()
    if not profile:
        profile = UniversityExpertise(user_id=current_user.id)
        db.add(profile)
        
    profile.department = exp_in.department
    profile.research_area = exp_in.research_area
    profile.lab = exp_in.lab
    profile.prior_projects = exp_in.prior_projects
    db.commit()
    db.refresh(profile)
    return {"status": "success", "message": "University expertise profile updated"}

@profiles_router.put("/industry/profile")
def update_industry_profile(
    ind_in: IndustryProfileIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(IndustryProfile).filter(IndustryProfile.user_id == current_user.id).first()
    if not profile:
        profile = IndustryProfile(user_id=current_user.id)
        db.add(profile)
        
    profile.domain = ind_in.domain
    profile.tech_focus = ind_in.tech_focus
    profile.csr_interest = ind_in.csr_interest
    profile.resources = ind_in.resources
    db.commit()
    db.refresh(profile)
    return {"status": "success", "message": "Industry profile updated"}

# Notifications Router
notif_router = APIRouter(prefix="/notifications", tags=["Notifications"])

@notif_router.get("", response_model=List[NotificationOut])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()

@notif_router.patch("/{notif_id}/read", response_model=NotificationOut)
def mark_notification_read(
    notif_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notif = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.read_status = True
    db.commit()
    db.refresh(notif)
    return notif

# Analytics Router
analytics_router = APIRouter(prefix="/analytics", tags=["Analytics"])

@analytics_router.get("/dashboard", response_model=AnalyticsDashboardOut)
def get_analytics_dashboard(db: Session = Depends(get_db)):
    challenges = db.query(Challenge).all()
    total = len(challenges)
    verified = sum(1 for c in challenges if c.status == "verified")
    in_prog = sum(1 for c in challenges if c.status in ["assigned", "in_progress"])
    completed = sum(1 for c in challenges if c.status == "completed")
    
    by_category = {}
    by_district = {}
    for c in challenges:
        cat = c.category or "General"
        by_category[cat] = by_category.get(cat, 0) + 1
        
        dist = c.district or "Central"
        by_district[dist] = by_district.get(dist, 0) + 1
        
    resolution_rate = round((completed / total * 100), 1) if total > 0 else 0.0
    
    return {
        "total": total,
        "verified": verified,
        "in_progress": in_prog,
        "completed": completed,
        "by_category": by_category,
        "by_district": by_district,
        "resolution_rate": resolution_rate
    }
