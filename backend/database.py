from sqlmodel import SQLModel, create_engine

# sqlite_file_name = "database.db"
# sqlite_url = f"sqlite:///{sqlite_file_name}"
# connect_args = {"check_same_thread": False}

# MySQL Connection
mysql_url = "mysql+pymysql://portfolio_user:port123pass@localhost:3306/portfolio"

engine = create_engine(mysql_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
