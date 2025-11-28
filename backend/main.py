from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .routers import about, projects, calendar, resume, settings

app = FastAPI(title="Portfolio API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*" # For development only, to rule out CORS issues
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(about.router)
app.include_router(projects.router)
app.include_router(calendar.router)
app.include_router(resume.router)
app.include_router(settings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API"}
