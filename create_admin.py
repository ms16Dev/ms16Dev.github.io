"""
Script to create an admin user for the portfolio application.
Run this script once to create your initial admin user.
"""
from sqlmodel import Session, select
from backend.database import engine
from backend.models import Admin
from backend.auth import get_password_hash

def create_admin(username: str, password: str):
    """Create a new admin user."""
    with Session(engine) as session:
        # Check if admin already exists
        existing_admin = session.exec(select(Admin).where(Admin.username == username)).first()
        if existing_admin:
            print(f"Admin user '{username}' already exists!")
            return
        
        # Create new admin
        hashed_password = get_password_hash(password)
        new_admin = Admin(username=username, hashed_password=hashed_password)
        session.add(new_admin)
        session.commit()
        print(f"[SUCCESS] Admin user '{username}' created successfully!")

if __name__ == "__main__":
    # Default admin credentials - CHANGE THESE!
    USERNAME = "admin"
    PASSWORD = "admin123"  # TODO: Change this password!
    
    print("Creating admin user...")
    create_admin(USERNAME, PASSWORD)
    print(f"\nYou can now login with:")
    print(f" Username: {USERNAME}")
    print(f" Password: {PASSWORD}")
    print("\n⚠️  IMPORTANT: Change these credentials immediately!")
