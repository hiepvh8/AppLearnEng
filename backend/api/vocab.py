from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from models import Vocabulary as VocabularyModel
from models import Favorite as FavoriteModel
from models import User as UserModel
from api.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class VocabularyBase(BaseModel):
    word: str
    meaning: str
    example: str
    category: str

class VocabularyCreate(VocabularyBase):
    pass

class VocabularySchema(VocabularyBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True

@router.get("/vocabularies", response_model=List[VocabularySchema])
def get_vocabularies(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    query = db.query(VocabularyModel).filter(VocabularyModel.owner_id == current_user.id)
    
    if category:
        query = query.filter(VocabularyModel.category == category)
    
    vocabularies = query.offset(skip).limit(limit).all()
    return vocabularies

@router.post("/vocabularies", response_model=VocabularySchema)
def create_vocabulary(
    vocabulary: VocabularyCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    db_vocabulary = VocabularyModel(
        **vocabulary.dict(),
        owner_id=current_user.id
    )
    db.add(db_vocabulary)
    db.commit()
    db.refresh(db_vocabulary)
    return db_vocabulary

@router.get("/categories")
def get_categories(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    categories = db.query(VocabularyModel.category)\
        .filter(VocabularyModel.owner_id == current_user.id)\
        .distinct()\
        .all()
    return [category[0] for category in categories]

@router.get("/favorites", response_model=List[VocabularySchema])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    favorites = db.query(VocabularyModel)\
        .join(FavoriteModel)\
        .filter(FavoriteModel.user_id == current_user.id)\
        .all()
    print(f"[DEBUG] GET /favorites for user_id={current_user.id}: {[v.id for v in favorites]}")
    return favorites

@router.post("/favorites/{vocabulary_id}")
def add_favorite(
    vocabulary_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    vocabulary = db.query(VocabularyModel)\
        .filter(VocabularyModel.id == vocabulary_id)\
        .filter(VocabularyModel.owner_id == current_user.id)\
        .first()
    print(f"[DEBUG] current_user.id={current_user.id}, vocabulary_id={vocabulary_id}, vocabulary.owner_id={getattr(vocabulary, 'owner_id', None)}")
    if not vocabulary:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    existing_favorite = db.query(FavoriteModel)\
        .filter(FavoriteModel.user_id == current_user.id)\
        .filter(FavoriteModel.vocabulary_id == vocabulary_id)\
        .first()
    if existing_favorite:
        raise HTTPException(status_code=400, detail="Already in favorites")
    favorite = FavoriteModel(user_id=current_user.id, vocabulary_id=vocabulary_id)
    db.add(favorite)
    db.commit()
    return {"message": "Added to favorites"}

@router.delete("/favorites/{vocabulary_id}")
def remove_favorite(
    vocabulary_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    favorite = db.query(FavoriteModel)\
        .filter(FavoriteModel.user_id == current_user.id)\
        .filter(FavoriteModel.vocabulary_id == vocabulary_id)\
        .first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    return {"message": "Removed from favorites"}

@router.get("/{vocab_id}", response_model=VocabularySchema)
def get_vocabulary(vocab_id: int, db: Session = Depends(get_db)):
    db_vocab = db.query(VocabularyModel).filter(VocabularyModel.id == vocab_id).first()
    if db_vocab is None:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    return db_vocab

@router.delete("/{vocab_id}")
def delete_vocabulary(
    vocab_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    vocabulary = db.query(VocabularyModel).filter(
        VocabularyModel.id == vocab_id,
        VocabularyModel.owner_id == current_user.id
    ).first()
    if not vocabulary:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    category = vocabulary.category
    db.delete(vocabulary)
    db.commit()
    # Kiểm tra nếu không còn từ nào trong danh mục này của user thì trả về danh sách categories mới
    remaining = db.query(VocabularyModel).filter(
        VocabularyModel.owner_id == current_user.id,
        VocabularyModel.category == category
    ).count()
    categories = None
    if remaining == 0:
        # Trả về danh sách categories mới đã loại bỏ danh mục rỗng
        categories = db.query(VocabularyModel.category)\
            .filter(VocabularyModel.owner_id == current_user.id)\
            .distinct()\
            .all()
        categories = [c[0] for c in categories]
    return {"message": "Deleted", "categories": categories} 