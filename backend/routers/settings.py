from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import engine
from ..models import Settings

def get_session():
    with Session(engine) as session:
        yield session

router = APIRouter(
    prefix="/settings",
    tags=["settings"]
)

@router.get("/", response_model=Settings)
def get_settings(session: Session = Depends(get_session)):
    settings = session.exec(select(Settings)).first()
    if not settings:
        # Create default settings if none exist
        settings = Settings()
        session.add(settings)
        session.commit()
        session.refresh(settings)
    return settings

@router.put("/", response_model=Settings)
def update_settings(settings_update: Settings, session: Session = Depends(get_session)):
    db_settings = session.exec(select(Settings)).first()
    if not db_settings:
        db_settings = Settings()
        session.add(db_settings)
    
    db_settings.calendar_start_year = settings_update.calendar_start_year
    db_settings.calendar_end_year = settings_update.calendar_end_year
    
    session.add(db_settings)
    session.commit()
    session.refresh(db_settings)
    return db_settings
