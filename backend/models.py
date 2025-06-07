from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.database import Base
import os

# Cấu hình database URL với pymysql driver
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://vocabuser:admin@db:3306/vocabdb?charset=utf8mb4")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    vocabularies = relationship("Vocabulary", back_populates="owner")
    favorites = relationship("Favorite", back_populates="user")

class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), index=True)
    meaning = Column(String(1000))
    example = Column(String(2000))
    category = Column(String(50), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    owner = relationship("User", back_populates="vocabularies")
    favorites = relationship("Favorite", back_populates="vocabulary")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vocabulary_id = Column(Integer, ForeignKey("vocabularies.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    vocabulary = relationship("Vocabulary", back_populates="favorites") 