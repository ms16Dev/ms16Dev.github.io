from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select
from ..database import engine
from ..models import About, Technology, Admin
from ..auth import get_current_admin
import base64
import json

router = APIRouter(prefix="/api/v1/about", tags=["about"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/")
def get_about(session: Session = Depends(get_session)):
    about = session.exec(select(About)).first()
    if not about:
        return {
            "name": "My Name",
            "occupation": "Developer",
            "title": "Welcome",
            "description": "Please configure.",
            "avatar_image": None,
            "social_links": "[]"
        }
    
    # Convert bytes to base64 string for frontend
    about_dict = about.model_dump()
    if about.avatar_image:
        about_dict["avatar_image"] = base64.b64encode(about.avatar_image).decode('utf-8')
    
    return about_dict

@router.post("/")
def update_about(
    name: str = Form(...),
    occupation: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    social_links: str = Form(...),
    avatar: UploadFile = File(None),
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    existing_about = session.exec(select(About)).first()
    if not existing_about:
        existing_about = About(
            name=name, occupation=occupation, title=title, 
            description=description, social_links=social_links
        )
    else:
        existing_about.name = name
        existing_about.occupation = occupation
        existing_about.title = title
        existing_about.description = description
        existing_about.social_links = social_links
    
    if avatar:
        existing_about.avatar_image = avatar.file.read()
    
    session.add(existing_about)
    session.commit()
    session.refresh(existing_about)
    
    # Return with base64 for immediate UI update if needed
    result = existing_about.model_dump()
    if existing_about.avatar_image:
        result["avatar_image"] = base64.b64encode(existing_about.avatar_image).decode('utf-8')
    return result

# Technology Endpoints
@router.get("/technologies")
def get_technologies(session: Session = Depends(get_session)):
    techs = session.exec(select(Technology)).all()
    result = []
    for tech in techs:
        tech_dict = tech.model_dump()
        if tech.image:
            tech_dict["image"] = base64.b64encode(tech.image).decode('utf-8')
        result.append(tech_dict)
    return result

@router.post("/technologies")
def add_technology(
    title: str = Form(...),
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    tech = Technology(title=title, image=image.file.read())
    session.add(tech)
    session.commit()
    return {"status": "success"}

@router.delete("/technologies/{tech_id}")
def delete_technology(
    tech_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    tech = session.get(Technology, tech_id)
    if not tech:
        raise HTTPException(status_code=404, detail="Technology not found")
    session.delete(tech)
    session.commit()
    return {"status": "success"}
