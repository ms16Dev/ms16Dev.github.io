import os
from sqlmodel import SQLModel, create_engine
from config import settings

# DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL = settings.DATABASE_URL

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

# For Aiven MySQL with pymysql
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "ssl": {
            "ssl_ca": "/etc/ssl/certs/ca-certificates.crt",
            "ssl_verify_cert": True
        }
    },
    echo=False,
    pool_pre_ping=True,
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)