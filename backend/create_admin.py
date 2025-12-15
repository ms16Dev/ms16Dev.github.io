"""
One-time script to create an admin user.
Run manually per environment.
"""

import os
from sqlmodel import Session, select
from database import engine
from models import Admin
from auth import get_password_hash
from config import settings


def create_admin(username: str, password: str):
    with Session(engine) as session:
        existing_admin = session.exec(
            select(Admin).where(Admin.username == username)
        ).first()

        if existing_admin:
            print(f"[INFO] Admin '{username}' already exists")
            return

        admin = Admin(
            username=username,
            hashed_password=get_password_hash(password),
        )
        session.add(admin)
        session.commit()
        print(f"[SUCCESS] Admin '{username}' created")

if __name__ == "__main__":
    username = settings.ADMIN_USERNAME
    password = settings.ADMIN_PASSWORD

    if not username or not password:
        raise RuntimeError(
            "ADMIN_USERNAME and ADMIN_PASSWORD must be set"
        )

    create_admin(username, password)
