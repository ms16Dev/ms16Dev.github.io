from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import engine
from ..models import About

router = APIRouter(prefix="/about", tags=["about"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=About)
def get_about(session: Session = Depends(get_session)):
    about = session.exec(select(About)).first()
    if not about:
        return About(title="Welcome", description="Please configure the about section.")
    return about

@router.post("/", response_model=About)
def create_or_update_about(about: About, session: Session = Depends(get_session)):
    existing_about = session.exec(select(About)).first()
    if existing_about:
        existing_about.title = about.title
        existing_about.description = about.description
        existing_about.image_url = about.image_url
        session.add(existing_about)
        session.commit()
        session.refresh(existing_about)
        return existing_about
    else:
        session.add(about)
        session.commit()
        session.refresh(about)
        return about
