from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.all_models import (
    User, Project, ProjectTeam, Milestone, Challenge, Notification
)
from app.schemas.schemas import (
    ProjectCreate, ProjectOut, ProjectStatusUpdate,
    ProjectTeamAdd, ProjectTeamOut,
    MilestoneCreate, MilestoneUpdate, MilestoneOut
)

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("", response_model=ProjectOut)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["government", "admin", "university"]))
):
    challenge = db.query(Challenge).filter(Challenge.id == project_in.challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    challenge.status = "assigned"
    
    new_project = Project(
        challenge_id=project_in.challenge_id,
        university_id=project_in.university_id or (current_user.id if current_user.role == "university" else None),
        industry_id=project_in.industry_id,
        status="assigned"
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # Add initial milestones
    initial_milestones = [
        Milestone(project_id=new_project.id, title="Requirement & Feasibility Analysis", status="in_progress"),
        Milestone(project_id=new_project.id, title="Prototype Development", status="pending"),
        Milestone(project_id=new_project.id, title="Field Testing & Deployment", status="pending"),
    ]
    db.add_all(initial_milestones)
    db.commit()
    db.refresh(new_project)
    
    return new_project

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).options(
        joinedload(Project.challenge),
        joinedload(Project.team).joinedload(ProjectTeam.member),
        joinedload(Project.milestones)
    ).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.patch("/{project_id}/status", response_model=ProjectOut)
def update_project_status(
    project_id: str,
    status_in: ProjectStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.status = status_in.status
    if status_in.status == "completed":
        if project.challenge:
            project.challenge.status = "completed"
    elif status_in.status == "in_progress":
        if project.challenge:
            project.challenge.status = "in_progress"
            
    db.commit()
    db.refresh(project)
    return project

@router.post("/{project_id}/team", response_model=ProjectTeamOut)
def add_team_member(
    project_id: str,
    team_in: ProjectTeamAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    member = db.query(User).filter(User.id == team_in.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="User member not found")
        
    team_member = ProjectTeam(
        project_id=project_id,
        member_id=team_in.member_id,
        role_in_team=team_in.role_in_team
    )
    db.add(team_member)
    db.commit()
    db.refresh(team_member)
    return team_member

@router.post("/{project_id}/milestones", response_model=MilestoneOut)
def add_milestone(
    project_id: str,
    milestone_in: MilestoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    milestone = Milestone(
        project_id=project_id,
        title=milestone_in.title,
        due_date=milestone_in.due_date,
        status="pending"
    )
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone

# Dedicated milestone patch route: PATCH /milestones/:id
milestone_router = APIRouter(prefix="/milestones", tags=["Milestones"])

@milestone_router.patch("/{milestone_id}", response_model=MilestoneOut)
def update_milestone_status(
    milestone_id: str,
    status_in: MilestoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    milestone.status = status_in.status
    db.commit()
    db.refresh(milestone)
    return milestone
