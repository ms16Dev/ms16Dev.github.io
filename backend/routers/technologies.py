from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Response
from sqlmodel import Session, select
from database import engine
from models import Technology, TechnologyRead, Admin
from auth import get_current_admin

router = APIRouter(prefix="/api/v1/technologies", tags=["technologies"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=List[TechnologyRead])
def get_technologies(session: Session = Depends(get_session)):
    return session.exec(select(Technology)).all()

@router.post("/")
def create_technology(
    title: str = Form(...),
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    image_bytes = image.file.read()
    tech = Technology(title=title, image=image_bytes)
    session.add(tech)
    session.commit()
    session.refresh(tech)
    return tech

@router.get("/{tech_id}/image")
def get_technology_image(tech_id: int, session: Session = Depends(get_session)):
    tech = session.get(Technology, tech_id)
    if not tech or not tech.image:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=tech.image, media_type="image/png")

@router.delete("/{tech_id}")
def delete_technology(
    tech_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    tech = session.get(Technology, tech_id)
    if not tech:
         raise HTTPException(status_code=404)
    session.delete(tech)
    session.commit()
    return {"ok": True}
