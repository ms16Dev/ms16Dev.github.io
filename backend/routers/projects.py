from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form, Response
from sqlmodel import Session, select
from ..database import engine
from ..models import Project, Technology, ProjectTechnologyLink, ProjectRead, Admin
from ..auth import get_current_admin
from datetime import date
import json

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=List[ProjectRead])
def get_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(Project)).unique().all()
    result = []
    for p in projects:
        p_dict = p.dict(exclude={"background_image"})
        # Add simulated url field
        p_dict["background_image_url"] = f"http://localhost:8000/api/v1/projects/{p.id}/background" if p.background_image else None
        p_dict["technologies"] = p.technologies
        result.append(p_dict)
    return result

@router.get("/{project_id}/background")
def get_project_background(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project or not project.background_image:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=project.background_image, media_type="image/png")

@router.post("/", response_model=ProjectRead)
def create_project(
    title: str = Form(...),
    description: str = Form(...),
    start_date: str = Form(...),
    tags: str = Form(...),
    end_date: Optional[str] = Form(None),
    github_link: Optional[str] = Form(None),
    live_demo_link: Optional[str] = Form(None),
    background_image: Optional[UploadFile] = None,
    technology_ids: Optional[str] = Form(None), # Comma separated IDs or JSON string
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    # Parse dates
    s_date = date.fromisoformat(start_date)
    e_date = date.fromisoformat(end_date) if end_date else None

    # Handle Image
    image_bytes = None
    if background_image:
        image_bytes = background_image.file.read()

    new_project = Project(
        title=title,
        description=description,
        start_date=s_date,
        end_date=e_date,
        tags=tags,
        github_link=github_link,
        live_demo_link=live_demo_link,
        background_image=image_bytes
    )

    # Link Technologies
    if technology_ids:
        try:
            # Expecting JSON list string e.g. "[1, 2]" or comma separated "1,2"
            # Let's try JSON first
            if technology_ids.strip().startswith("["):
                ids = json.loads(technology_ids)
            else:
                ids = [int(id.strip()) for id in technology_ids.split(",") if id.strip()]
            
            for t_id in ids:
                tech = session.get(Technology, t_id)
                if tech:
                    new_project.technologies.append(tech)
        except Exception as e:
            print(f"Error parsing technology_ids: {e}")

    session.add(new_project)
    session.commit()
    session.refresh(new_project)
    
    # Return matched structure
    p_dict = new_project.dict(exclude={"background_image"})
    p_dict["background_image_url"] = f"http://localhost:8000/api/v1/projects/{new_project.id}/background" if new_project.background_image else None
    return p_dict

@router.put("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None),
    github_link: Optional[str] = Form(None),
    live_demo_link: Optional[str] = Form(None),
    background_image: Optional[UploadFile] = None,
    technology_ids: Optional[str] = Form(None),
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if title: project.title = title
    if description: project.description = description
    if start_date: project.start_date = date.fromisoformat(start_date)
    if end_date is not None: # check for None specifically if clearing is allowed, assuming empty string means clear? or just updates? 
        project.end_date = date.fromisoformat(end_date) if end_date else None
    if tags: project.tags = tags
    if github_link is not None: project.github_link = github_link
    if live_demo_link is not None: project.live_demo_link = live_demo_link
    
    if background_image:
        project.background_image = background_image.file.read()

    # Update Technologies if provided
    if technology_ids is not None:
        project.technologies = [] # Clear existing to replace? Or merge? Usually replace in PUT
        try:
             if technology_ids.strip().startswith("["):
                ids = json.loads(technology_ids)
             else:
                ids = [int(id.strip()) for id in technology_ids.split(",") if id.strip()]
             
             for t_id in ids:
                tech = session.get(Technology, t_id)
                if tech:
                    project.technologies.append(tech)
        except Exception as e:
            print(f"Error update technology_ids: {e}")

    session.add(project)
    session.commit()
    session.refresh(project)
    
    p_dict = project.dict(exclude={"background_image"})
    p_dict["background_image_url"] = f"http://localhost:8000/api/v1/projects/{project.id}/background" if project.background_image else None
    return p_dict

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return {"ok": True}
