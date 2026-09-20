import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, Date, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    citizen = "citizen"
    government = "government"
    university = "university"
    industry = "industry"
    school = "school"
    admin = "admin"

class ChallengeStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    assigned = "assigned"
    in_progress = "in_progress"
    completed = "completed"
    rejected = "rejected"

class PriorityLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default=UserRole.citizen.value)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submitted_challenges = relationship("Challenge", back_populates="submitter", foreign_keys="Challenge.submitted_by")
    verified_challenges = relationship("Challenge", back_populates="verifier", foreign_keys="Challenge.verified_by")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    expertise = relationship("UniversityExpertise", back_populates="user", uselist=False)
    industry_profile = relationship("IndustryProfile", back_populates="user", uselist=False)

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=True)
    domain = Column(String, nullable=True)
    sub_domain = Column(String, nullable=True)
    
    # Store lat and lng coordinates (compatible with SQLite & PostGIS)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    district = Column(String, nullable=True)
    
    priority = Column(String, default=PriorityLevel.medium.value)
    status = Column(String, default=ChallengeStatus.pending.value)
    
    submitted_by = Column(String, ForeignKey("users.id"), nullable=True)
    verified_by = Column(String, ForeignKey("users.id"), nullable=True)
    upvote_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submitter = relationship("User", foreign_keys=[submitted_by], back_populates="submitted_challenges")
    verifier = relationship("User", foreign_keys=[verified_by], back_populates="verified_challenges")
    media = relationship("ChallengeMedia", back_populates="challenge", cascade="all, delete-orphan")
    duplicates = relationship("Duplicate", foreign_keys="Duplicate.challenge_id", cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="challenge", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="challenge", cascade="all, delete-orphan")

class ChallengeMedia(Base):
    __tablename__ = "challenge_media"

    id = Column(String, primary_key=True, default=generate_uuid)
    challenge_id = Column(String, ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(Text, nullable=False)
    media_type = Column(String, nullable=True)

    challenge = relationship("Challenge", back_populates="media")

class Duplicate(Base):
    __tablename__ = "duplicates"

    id = Column(String, primary_key=True, default=generate_uuid)
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    duplicate_of_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    confirmed_by_admin = Column(Boolean, default=False)

class UniversityExpertise(Base):
    __tablename__ = "university_expertise"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    department = Column(String, nullable=True)
    research_area = Column(Text, nullable=True)
    lab = Column(String, nullable=True)
    prior_projects = Column(Text, nullable=True)

    user = relationship("User", back_populates="expertise")

class IndustryProfile(Base):
    __tablename__ = "industry_profile"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    domain = Column(String, nullable=True)
    tech_focus = Column(Text, nullable=True)
    csr_interest = Column(Text, nullable=True)
    resources = Column(Text, nullable=True)

    user = relationship("User", back_populates="industry_profile")

class Match(Base):
    __tablename__ = "matches"

    id = Column(String, primary_key=True, default=generate_uuid)
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    entity_id = Column(String, ForeignKey("users.id"), nullable=False)
    entity_type = Column(String, nullable=True) # university | industry
    match_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    challenge = relationship("Challenge", back_populates="matches")
    entity = relationship("User")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    university_id = Column(String, ForeignKey("users.id"), nullable=True)
    industry_id = Column(String, ForeignKey("users.id"), nullable=True)
    mentor_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="assigned") # assigned, in_progress, completed, paused
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    challenge = relationship("Challenge", back_populates="projects")
    university = relationship("User", foreign_keys=[university_id])
    industry = relationship("User", foreign_keys=[industry_id])
    team = relationship("ProjectTeam", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")

class ProjectTeam(Base):
    __tablename__ = "project_team"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    member_id = Column(String, ForeignKey("users.id"), nullable=False)
    role_in_team = Column(String, nullable=False)

    project = relationship("Project", back_populates="team")
    member = relationship("User")

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    due_date = Column(Date, nullable=True)
    status = Column(String, default="pending") # pending, in_progress, completed

    project = relationship("Project", back_populates="milestones")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    read_status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")

class Upvote(Base):
    __tablename__ = "upvotes"

    id = Column(String, primary_key=True, default=generate_uuid)
    challenge_id = Column(String, ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
