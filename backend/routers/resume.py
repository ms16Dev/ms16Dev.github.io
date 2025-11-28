from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import engine
from ..models import Resume

router = APIRouter(prefix="/resume", tags=["resume"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=Resume)
def get_resume(session: Session = Depends(get_session)):
    resume = session.exec(select(Resume)).first()
    if not resume:
        # Return a default empty structure or error
        return Resume(content="{}")
    return resume

@router.post("/", response_model=Resume)
def create_or_update_resume(resume: Resume, session: Session = Depends(get_session)):
    existing_resume = session.exec(select(Resume)).first()
    if existing_resume:
        existing_resume.content = resume.content
        session.add(existing_resume)
        session.commit()
        session.refresh(existing_resume)
        return existing_resume
    else:
        session.add(resume)
        session.commit()
        session.refresh(resume)
        return resume
