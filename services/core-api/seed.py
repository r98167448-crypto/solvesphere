import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.all_models import (
    User, Challenge, ChallengeMedia, Project, Milestone, UniversityExpertise, IndustryProfile
)

def seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    # Check if already seeded
    if db.query(User).count() > 0:
        print("Database already has users. Skipping seed.")
        db.close()
        return

    print("Seeding initial users and challenges...")
    
    # Users for all roles
    admin = User(name="Admin Officer", email="admin@solvesphere.org", password_hash=get_password_hash("admin123"), role="admin", phone="+91 9876543210")
    govt = User(name="City Commissioner", email="govt@city.gov.in", password_hash=get_password_hash("govt123"), role="government", phone="+91 9876543211")
    citizen = User(name="Vishal Citizen", email="citizen@gmail.com", password_hash=get_password_hash("citizen123"), role="citizen", phone="+91 9876543212")
    university = User(name="Prof. Sharma (Tech Univ)", email="univ@university.edu", password_hash=get_password_hash("univ123"), role="university", phone="+91 9876543213")
    industry = User(name="EcoTech Industries CSR", email="csr@ecotech.com", password_hash=get_password_hash("industry123"), role="industry", phone="+91 9876543214")
    school = User(name="St. Mary's Eco Club", email="ecoclub@stmarys.edu", password_hash=get_password_hash("school123"), role="school", phone="+91 9876543215")
    
    db.add_all([admin, govt, citizen, university, industry, school])
    db.commit()
    
    # Add university and industry profiles
    db.add(UniversityExpertise(
        user_id=university.id,
        department="Civil & Environmental Engineering",
        research_area="Smart Water Systems, Sustainable Waste Management, IoT Flood Sensors",
        lab="Urban Resilience Innovation Lab",
        prior_projects="Automated Lake De-siltation Drone, Stormwater Drainage Optimizer"
    ))
    
    db.add(IndustryProfile(
        user_id=industry.id,
        domain="Clean Energy & Sustainable Infrastructure",
        tech_focus="Solar Microgrids, Recycled Polymer Pavements, Remote Sensing",
        csr_interest="Urban water rejuvenation, Youth technical skilling",
        resources="Annual CSR Grant Budget ₹25 Lakhs, 10 Senior Engineering Mentors"
    ))
    
    # Add sample challenges
    c1 = Challenge(
        title="Severe Drinking Water Contamination & Broken Pipeline in Ward 12",
        description="Water supply contaminated with sewage runoff due to underground fracture near Gandhi Nagar intersection. Over 400 households affected with acute water shortage and water-borne illness risk.",
        category="Water & Sanitation",
        domain="Water Infrastructure",
        sub_domain="Distribution & Contamination Control",
        lat=12.9716,
        lng=77.5946,
        district="Bengaluru Urban",
        priority="high",
        status="verified",
        submitted_by=citizen.id,
        verified_by=govt.id,
        upvote_count=42
    )
    
    c2 = Challenge(
        title="Overflowing Solid Waste & Plastic Dumping near Primary School",
        description="Public bins uncollected for 2 weeks. Stray animals scattering plastic and organic waste blocking pedestrian walkway and creating health hazards for school children.",
        category="Environment & Waste",
        domain="Waste Management",
        sub_domain="Solid Waste Collection",
        lat=12.9352,
        lng=77.6245,
        district="Bengaluru South",
        priority="medium",
        status="pending",
        submitted_by=school.id,
        upvote_count=18
    )

    c3 = Challenge(
        title="Deep Dangerous Potholes on High Traffic Arterial Road",
        description="Several 2-foot deep potholes formed after heavy monsoon rains causing multiple two-wheeler accidents and severe peak-hour bottlenecks.",
        category="Urban Infrastructure",
        domain="Roads & Mobility",
        sub_domain="Pothole Repair & Surface Restoration",
        lat=13.0033,
        lng=77.5692,
        district="Bengaluru North",
        priority="high",
        status="assigned",
        submitted_by=citizen.id,
        verified_by=govt.id,
        upvote_count=65
    )

    db.add_all([c1, c2, c3])
    db.commit()

    # Add media
    db.add(ChallengeMedia(
        challenge_id=c1.id,
        file_url="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80",
        media_type="image"
    ))
    db.add(ChallengeMedia(
        challenge_id=c3.id,
        file_url="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        media_type="image"
    ))
    db.commit()

    # Add a project for c3
    proj = Project(
        challenge_id=c3.id,
        university_id=university.id,
        industry_id=industry.id,
        mentor_id=govt.id,
        status="in_progress"
    )
    db.add(proj)
    db.commit()

    m1 = Milestone(project_id=proj.id, title="Geospatial Road Damage Audit", status="completed")
    m2 = Milestone(project_id=proj.id, title="High-grade Bitumen Patch Deployment", status="in_progress")
    m3 = Milestone(project_id=proj.id, title="Final Surface Quality Certification", status="pending")
    db.add_all([m1, m2, m3])
    db.commit()

    db.close()
    print("Seeding completed successfully.")

if __name__ == "__main__":
    seed()
