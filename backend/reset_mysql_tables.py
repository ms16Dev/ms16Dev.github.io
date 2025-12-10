from sqlalchemy import create_engine, text

# MySQL Connection from database.py
mysql_url = "mysql+pymysql://portfolio_user:port123pass@localhost:3306/portfolio"

engine = create_engine(mysql_url, echo=True)

with engine.connect() as conn:
    # Disable foreign key checks to allow dropping tables in any order
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
    
    print("Dropping 'projecttechnologylink' table...")
    conn.execute(text("DROP TABLE IF EXISTS projecttechnologylink"))
    
    print("Dropping 'calendarevent' table (linked to project)...")
    conn.execute(text("DROP TABLE IF EXISTS calendarevent"))

    print("Dropping 'project' table...")
    conn.execute(text("DROP TABLE IF EXISTS project"))
    
    # Re-enable foreign key checks
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
    
    conn.commit()
    print("Tables dropped successfully. Restart the application to recreate them.")
