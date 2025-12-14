from typing import List, Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    Form,
    Response,
    Request
)
from sqlmodel import Session, select
from datetime import date
import json

from ..database import engine
from ..models import Project, Technology, ProjectRead, Admin
from ..auth import get_current_admin

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


# -------------------------
# DB session dependency
# -------------------------
def get_session():
    with Session(engine) as session:
        yield session


# -------------------------
# Helper: build background URL safely
# -------------------------
def project_background_url(request: Request, project_id: int) -> str:
    return f"{request.base_url}api/v1/projects/{project_id}/background"


# -------------------------
# GET all projects
# -------------------------
@router.get("/", response_model=List[ProjectRead])
def get_projects(
    request: Request,
    session: Session = Depends(get_session)
):
    projects = session.exec(select(Project)).unique().all()
    result = []

    for project in projects:
        data = project.dict(exclude={"background_image"})
        data["background_image_url"] = (
            project_background_url(request, project.id)
            if project.background_image
            else None
        )
        data["technologies"] = project.technologies
        result.append(data)

    return result


# -------------------------
# GET project background image
# -------------------------
@router.get("/{project_id}/background")
def get_project_background(
    project_id: int,
    session: Session = Depends(get_session)
):
    project = session.get(Project, project_id)

    if not project or not project.background_image:
        raise HTTPException(status_code=404, detail="Image not found")

    return Response(
        content=project.background_image,
        media_type="image/png"
    )


# -------------------------
# CREATE project
# -------------------------
@router.post("/", response_model=ProjectRead)
def create_project(
    request: Request,
    title: str = Form(...),
    description: str = Form(...),
    start_date: str = Form(...),
    tags: str = Form(...),
    end_date: Optional[str] = Form(None),
    github_link: Optional[str] = Form(None),
    live_demo_link: Optional[str] = Form(None),
    background_image: Optional[UploadFile] = None,
    technology_ids: Optional[str] = Form(None),
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    new_project = Project(
        title=title,
        description=description,
        start_date=date.fromisoformat(start_date),
        end_date=date.fromisoformat(end_date) if end_date else None,
        tags=tags,
        github_link=github_link,
        live_demo_link=live_demo_link,
        background_image=background_image.file.read() if background_image else None,
    )

    # Attach technologies
    if technology_ids:
        try:
            ids = (
                json.loads(technology_ids)
                if technology_ids.strip().startswith("[")
                else [int(i) for i in technology_ids.split(",") if i.strip()]
            )
            for tech_id in ids:
                tech = session.get(Technology, tech_id)
                if tech:
                    new_project.technologies.append(tech)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid technology_ids: {e}")

    session.add(new_project)
    session.commit()
    session.refresh(new_project)

    data = new_project.dict(exclude={"background_image"})
    data["background_image_url"] = (
        project_background_url(request, new_project.id)
        if new_project.background_image
        else None
    )

    return data


# -------------------------
# UPDATE project
# -------------------------
@router.put("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: int,
    request: Request,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
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

    if title is not None:
        project.title = title
    if description is not None:
        project.description = description
    if start_date is not None:
        project.start_date = date.fromisoformat(start_date)
    if end_date is not None:
        project.end_date = date.fromisoformat(end_date) if end_date else None
    if tags is not None:
        project.tags = tags
    if github_link is not None:
        project.github_link = github_link
    if live_demo_link is not None:
        project.live_demo_link = live_demo_link
    if background_image:
        project.background_image = background_image.file.read()

    # Replace technologies
    if technology_ids is not None:
        project.technologies.clear()
        try:
            ids = (
                json.loads(technology_ids)
                if technology_ids.strip().startswith("[")
                else [int(i) for i in technology_ids.split(",") if i.strip()]
            )
            for tech_id in ids:
                tech = session.get(Technology, tech_id)
                if tech:
                    project.technologies.append(tech)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid technology_ids: {e}")

    session.add(project)
    session.commit()
    session.refresh(project)

    data = project.dict(exclude={"background_image"})
    data["background_image_url"] = (
        project_background_url(request, project.id)
        if project.background_image
        else None
    )

    return data


# -------------------------
# DELETE project
# -------------------------
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
