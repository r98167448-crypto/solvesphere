from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.all_models import (
    User, Challenge, ChallengeMedia, Duplicate, Match, Upvote, Notification
)
from app.schemas.schemas import (
    ChallengeCreate, ChallengeOut, ChallengeVerify, DuplicateOut, MatchOut
)
from app.services.ai_client import call_ai_classify, call_ai_priority

router = APIRouter(prefix="/challenges", tags=["Challenges"])

@router.post("", response_model=ChallengeOut)
async def create_challenge(
    challenge_in: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Call AI classification & priority scoring
    ai_classification = await call_ai_classify(challenge_in.description)
    ai_priority = await call_ai_priority(challenge_in.description)
    
    new_challenge = Challenge(
        title=challenge_in.title,
        description=challenge_in.description,
        category=challenge_in.category or ai_classification.get("domain", "Civic"),
        domain=ai_classification.get("domain"),
        sub_domain=ai_classification.get("sub_domain"),
        lat=challenge_in.lat,
        lng=challenge_in.lng,
        district=challenge_in.district,
        priority=ai_priority.get("priority", "medium"),
        status="pending",
        submitted_by=current_user.id
    )
    db.add(new_challenge)
    db.commit()
    db.refresh(new_challenge)
    
    # Add media items if provided
    if challenge_in.media:
        for url in challenge_in.media:
            media_item = ChallengeMedia(
                challenge_id=new_challenge.id,
                file_url=url,
                media_type="image"
            )
            db.add(media_item)
        db.commit()
    
    # Notify admins/government of newly submitted challenge
    gov_users = db.query(User).filter(User.role.in_(["government", "admin"])).all()
    for g in gov_users:
        notif = Notification(
            user_id=g.id,
            type="challenge_submitted",
            message=f"New challenge submitted: '{new_challenge.title}' in {new_challenge.category}"
        )
        db.add(notif)
    db.commit()
    db.refresh(new_challenge)
    
    return new_challenge

@router.get("", response_model=List[ChallengeOut])
def get_challenges(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Challenge).options(
        joinedload(Challenge.media),
        joinedload(Challenge.duplicates),
        joinedload(Challenge.matches)
    )
    if status:
        query = query.filter(Challenge.status == status)
    if category:
        query = query.filter(Challenge.category.ilike(f"%{category}%"))
    if district:
        query = query.filter(Challenge.district.ilike(f"%{district}%"))
    if priority:
        query = query.filter(Challenge.priority == priority)
        
    return query.order_by(Challenge.created_at.desc()).all()

@router.get("/{challenge_id}", response_model=ChallengeOut)
def get_challenge(challenge_id: str, db: Session = Depends(get_db)):
    challenge = db.query(Challenge).options(
        joinedload(Challenge.media),
        joinedload(Challenge.duplicates),
        joinedload(Challenge.matches)
    ).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge

@router.patch("/{challenge_id}/verify", response_model=ChallengeOut)
def verify_challenge(
    challenge_id: str,
    verify_in: ChallengeVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["government", "admin"]))
):
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    challenge.status = "verified" if verify_in.approve else "rejected"
    challenge.verified_by = current_user.id
    if verify_in.priority_override:
        challenge.priority = verify_in.priority_override
        
    db.commit()
    db.refresh(challenge)
    
    # Notify the citizen submitter
    if challenge.submitted_by:
        status_text = "verified and approved for resolution" if verify_in.approve else "reviewed and rejected"
        db.add(Notification(
            user_id=challenge.submitted_by,
            type="challenge_verification",
            message=f"Your challenge '{challenge.title}' was {status_text}."
        ))
        db.commit()
        
    return challenge

@router.post("/{challenge_id}/upvote")
def upvote_challenge(
    challenge_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    existing = db.query(Upvote).filter(
        Upvote.challenge_id == challenge_id,
        Upvote.user_id == current_user.id
    ).first()
    
    if existing:
        # Toggle off upvote
        db.delete(existing)
        challenge.upvote_count = max(0, (challenge.upvote_count or 1) - 1)
    else:
        # Add upvote
        db.add(Upvote(challenge_id=challenge_id, user_id=current_user.id))
        challenge.upvote_count = (challenge.upvote_count or 0) + 1
        
    db.commit()
    db.refresh(challenge)
    return {"upvote_count": challenge.upvote_count}

@router.get("/{challenge_id}/duplicates", response_model=List[DuplicateOut])
def get_duplicates(challenge_id: str, db: Session = Depends(get_db)):
    return db.query(Duplicate).filter(Duplicate.challenge_id == challenge_id).all()

@router.get("/{challenge_id}/matches", response_model=List[MatchOut])
def get_matches(challenge_id: str, db: Session = Depends(get_db)):
    return db.query(Match).filter(Match.challenge_id == challenge_id).all()
