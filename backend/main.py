from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.vocab import router as vocab_router
from api.auth import router as auth_router
from database.database import engine
import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vocabulary Learning App API",
    description="API for Vietnamese English Vocabulary Learning App",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(vocab_router, prefix="/api/vocab", tags=["Vocabulary"])

@app.get("/")
async def root():
    return {"message": "Welcome to Vocabulary Learning App API"} 