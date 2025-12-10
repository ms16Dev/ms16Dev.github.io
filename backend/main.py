from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .database import create_db_and_tables
from .routers import about, projects, calendar, resume, settings, technologies, auth
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Portfolio API", version="1.0.0")

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

# Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log the request
    logger.info(f"Request: {request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        
        # Log the response
        process_time = time.time() - start_time
        logger.info(
            f"Response: {request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Duration: {process_time:.3f}s"
        )
        
        response.headers["X-Process-Time"] = str(process_time)
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"Error: {request.method} {request.url.path} - "
            f"Exception: {str(e)} - "
            f"Duration: {process_time:.3f}s"
        )
        raise

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred",
            "error": str(exc) if app.debug else "Internal Server Error"
        }
    )

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    logger.info("Database initialized")

# API v1 routes
app.include_router(auth.router)
app.include_router(about.router)
app.include_router(projects.router)
app.include_router(calendar.router)
app.include_router(resume.router)
app.include_router(settings.router)
app.include_router(technologies.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Portfolio API", "version": "1.0.0"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

