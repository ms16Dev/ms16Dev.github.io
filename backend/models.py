from typing import Optional, List
from sqlmodel import Field, SQLModel
from datetime import date, datetime

class About(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    image_url: Optional[str] = None

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    start_date: date
    end_date: Optional[date] = None
    description: str
    tags: str # Comma separated tags
    background_image_url: Optional[str] = None

class CalendarEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: Optional[int] = Field(default=None, foreign_key="project.id")
    title: str
    start_date: date
    end_date: Optional[date] = None
    icon: Optional[str] = None

class Resume(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    file_path: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class Settings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    calendar_start_year: int = Field(default=2020)
    calendar_end_year: int = Field(default=2030)
