import json
from sqlalchemy.orm import Session
from database.database import SessionLocal, engine
from models import models
import os

def init_db():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Check if we already have data
        if db.query(models.Vocabulary).first():
            print("Database already has data. Skipping initialization.")
            return
        
        # Load sample data
        sample_data_path = os.path.join(os.path.dirname(__file__), "..", "shared", "vocab_data", "sample_vocab.json")
        with open(sample_data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # Add vocabularies
        for vocab in data["vocabularies"]:
            db_vocab = models.Vocabulary(**vocab)
            db.add(db_vocab)
        
        # Commit changes
        db.commit()
        print("Sample data initialized successfully!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 