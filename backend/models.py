from typing import Optional, List
from sqlmodel import Field, SQLModel, Column, Relationship
from sqlalchemy import LargeBinary, Text
from datetime import date, datetime

class ProjectTechnologyLink(SQLModel, table=True):
    project_id: Optional[int] = Field(default=None, foreign_key="project.id", primary_key=True)
    technology_id: Optional[int] = Field(default=None, foreign_key="technology.id", primary_key=True)

class About(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(default="My Name")
    occupation: str = Field(default="Full Stack Developer")
    title: str
    description: str
    avatar_image: Optional[bytes] = Field(default=None, sa_column=Column(LargeBinary(length=(2**32)-1)))
    social_links: str = Field(default="[]") # JSON string of links

class Technology(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    image: bytes = Field(sa_column=Column(LargeBinary(length=(2**32)-1)))
    projects: List["Project"] = Relationship(back_populates="technologies", link_model=ProjectTechnologyLink)

class TechnologyRead(SQLModel):
    id: int
    title: str

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    start_date: date
    end_date: Optional[date] = None
    description: str
    tags: str # Comma separated tags
    background_image: Optional[bytes] = Field(default=None, sa_column=Column(LargeBinary(length=(2**32)-1)))
    github_link: Optional[str] = None
    live_demo_link: Optional[str] = None
    technologies: List[Technology] = Relationship(back_populates="projects", link_model=ProjectTechnologyLink)

class ProjectRead(SQLModel):
    id: int
    title: str
    start_date: date
    end_date: Optional[date] = None
    description: str
    tags: str
    github_link: Optional[str] = None
    live_demo_link: Optional[str] = None
    background_image_url: Optional[str] = None
    technologies: List[TechnologyRead] = []

class CalendarEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: Optional[int] = Field(default=None, foreign_key="project.id")
    title: str
    start_date: date
    end_date: Optional[date] = None
    icon: Optional[str] = None

class Resume(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(default="{}", sa_column=Column(Text(length=2**31-1))) # LONGTEXT for large JSON
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class Settings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    calendar_start_year: int = Field(default=2020)
    calendar_end_year: int = Field(default=2030)

class Admin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str

