from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime, date

# --- Auth & User Schemas ---
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "citizen"
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenRefresh(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: Optional[Any] = None

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    phone: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Challenge Schemas ---
class ChallengeMediaOut(BaseModel):
    id: str
    file_url: str
    media_type: Optional[str] = None

    class Config:
        from_attributes = True

class ChallengeCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    district: Optional[str] = None
    media: Optional[List[str]] = [] # URLs

class ChallengeVerify(BaseModel):
    approve: bool
    priority_override: Optional[str] = None

class DuplicateOut(BaseModel):
    id: str
    challenge_id: str
    duplicate_of_id: str
    similarity_score: float
    confirmed_by_admin: bool

    class Config:
        from_attributes = True

class MatchOut(BaseModel):
    id: str
    challenge_id: str
    entity_id: str
    entity_type: Optional[str]
    match_score: float

    class Config:
        from_attributes = True

class ChallengeOut(BaseModel):
    id: str
    title: str
    description: str
    category: Optional[str] = None
    domain: Optional[str] = None
    sub_domain: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    district: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    submitted_by: Optional[str] = None
    verified_by: Optional[str] = None
    upvote_count: int = 0
    created_at: Optional[datetime] = None
    media: List[ChallengeMediaOut] = []
    duplicates: List[DuplicateOut] = []
    matches: List[MatchOut] = []

    class Config:
        from_attributes = True

# --- Projects & Teams ---
class MilestoneCreate(BaseModel):
    title: str
    due_date: Optional[date] = None

class MilestoneUpdate(BaseModel):
    status: str

class MilestoneOut(BaseModel):
    id: str
    project_id: str
    title: str
    due_date: Optional[date] = None
    status: str

    class Config:
        from_attributes = True

class ProjectTeamAdd(BaseModel):
    member_id: str
    role_in_team: str

class ProjectTeamOut(BaseModel):
    id: str
    member_id: str
    role_in_team: str
    member: Optional[UserOut] = None

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    challenge_id: str
    university_id: Optional[str] = None
    industry_id: Optional[str] = None

class ProjectStatusUpdate(BaseModel):
    status: str

class ProjectOut(BaseModel):
    id: str
    challenge_id: str
    university_id: Optional[str] = None
    industry_id: Optional[str] = None
    mentor_id: Optional[str] = None
    status: str
    started_at: Optional[datetime] = None
    challenge: Optional[ChallengeOut] = None
    team: List[ProjectTeamOut] = []
    milestones: List[MilestoneOut] = []

    class Config:
        from_attributes = True

# --- Profiles ---
class UniversityExpertiseIn(BaseModel):
    department: Optional[str] = None
    research_area: Optional[str] = None
    lab: Optional[str] = None
    prior_projects: Optional[str] = None

class IndustryProfileIn(BaseModel):
    domain: Optional[str] = None
    tech_focus: Optional[str] = None
    csr_interest: Optional[str] = None
    resources: Optional[str] = None

# --- Analytics ---
class AnalyticsDashboardOut(BaseModel):
    total: int
    verified: int
    in_progress: int
    completed: int
    by_category: dict
    by_district: dict
    resolution_rate: float

# --- Notifications ---
class NotificationOut(BaseModel):
    id: str
    user_id: str
    type: Optional[str] = None
    message: str
    read_status: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
