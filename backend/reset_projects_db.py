from sqlalchemy import create_engine, text
import os

# Ensure we are in the backend directory or point to the correct DB path
db_path = "database.db"
if not os.path.exists(db_path):
    print(f"Database file {db_path} not found in current directory.")
    # Try looking in backend/ if we are in root
    if os.path.exists(f"backend/{db_path}"):
        db_path = f"backend/{db_path}"

sqlite_url = f"sqlite:///{db_path}"
engine = create_engine(sqlite_url)

with engine.connect() as conn:
    print("Dropping 'projecttechnologylink' table...")
    conn.execute(text("DROP TABLE IF EXISTS projecttechnologylink"))
    
    print("Dropping 'project' table...")
    conn.execute(text("DROP TABLE IF EXISTS project"))
    
    conn.commit()
    print("Tables dropped successfully. The application will recreate them on next startup.")
