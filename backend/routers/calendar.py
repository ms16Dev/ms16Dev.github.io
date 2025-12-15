from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import engine
from models import CalendarEvent, Admin
from auth import get_current_admin
from datetime import date

router = APIRouter(prefix="/api/v1/calendar", tags=["calendar"])

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/", response_model=List[CalendarEvent])
def get_events(session: Session = Depends(get_session)):
    return session.exec(select(CalendarEvent)).all()

from datetime import date

@router.post("/", response_model=CalendarEvent)
def create_event(
    event: CalendarEvent,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    if isinstance(event.start_date, str):
        event.start_date = date.fromisoformat(event.start_date)
    if event.end_date and isinstance(event.end_date, str):
        event.end_date = date.fromisoformat(event.end_date)
        
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@router.put("/{event_id}", response_model=CalendarEvent)
def update_event(
    event_id: int,
    event: CalendarEvent,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    db_event = session.get(CalendarEvent, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    event_data = event.dict(exclude_unset=True)
    for key, value in event_data.items():
        if key == 'start_date' and isinstance(value, str):
            value = date.fromisoformat(value)
        if key == 'end_date' and isinstance(value, str):
            value = date.fromisoformat(value)
        setattr(db_event, key, value)
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    session: Session = Depends(get_session),
    current_admin: Admin = Depends(get_current_admin)
):
    event = session.get(CalendarEvent, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    session.delete(event)
    session.commit()
    return {"ok": True}
