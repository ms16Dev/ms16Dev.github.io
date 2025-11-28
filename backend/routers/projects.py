from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import engine
from ..models import Project

router = APIRouter(prefix="/projects", tags=["projects"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=List[Project])
def get_projects(session: Session = Depends(get_session)):
    return session.exec(select(Project)).all()

from datetime import date

@router.post("/", response_model=Project)
def create_project(project: Project, session: Session = Depends(get_session)):
    if isinstance(project.start_date, str):
        project.start_date = date.fromisoformat(project.start_date)
    if project.end_date and isinstance(project.end_date, str):
        project.end_date = date.fromisoformat(project.end_date)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.put("/{project_id}", response_model=Project)
def update_project(project_id: int, project: Project, session: Session = Depends(get_session)):
    db_project = session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    project_data = project.dict(exclude_unset=True)
    for key, value in project_data.items():
        if key == 'start_date' and isinstance(value, str):
            value = date.fromisoformat(value)
        if key == 'end_date' and isinstance(value, str):
            value = date.fromisoformat(value)
        setattr(db_project, key, value)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

@router.delete("/{project_id}")
def delete_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return {"ok": True}
