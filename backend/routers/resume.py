from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Resume, Admin
from auth import get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/resume", tags=["resume"])

def get_session():
    with Session(engine) as session:
        yield session

class ResumeUpdate(BaseModel):
    content: str

@router.get("/")
def get_resume(session: Session = Depends(get_session)):
    resume = session.exec(select(Resume)).first()
    if not resume:
        return {"content": "{}"}
    return {"content": resume.content}

@router.post("/")
def create_or_update_resume(
    resume_data: ResumeUpdate,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    existing_resume = session.exec(select(Resume)).first()
    if existing_resume:
        existing_resume.content = resume_data.content
        session.add(existing_resume)
        session.commit()
        session.refresh(existing_resume)
        return {"content": existing_resume.content}
    else:
        new_resume = Resume(content=resume_data.content)
        session.add(new_resume)
        session.commit()
        session.refresh(new_resume)
        return {"content": new_resume.content}
