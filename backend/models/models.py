from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    favorites = relationship("Favorite", back_populates="user")

class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, index=True)
    meaning = Column(String)
    example = Column(String)
    category = Column(String, index=True)  # TOEIC, IELTS, Communication, etc.
    language = Column(String, default="en")  # For future language support
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    favorites = relationship("Favorite", back_populates="vocabulary")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vocabulary_id = Column(Integer, ForeignKey("vocabularies.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="favorites")
    vocabulary = relationship("Vocabulary", back_populates="favorites") 