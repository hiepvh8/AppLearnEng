# Tài liệu Thiết kế Hệ thống - AppLearnEng

## Mục lục
1. [Tổng quan Hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc Hệ thống](#2-kiến-trúc-hệ-thống)
3. [Thiết kế Database](#3-thiết-kế-database)
4. [API Documentation](#4-api-documentation)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Bảo mật](#7-bảo-mật)
8. [Triển khai](#8-triển-khai)
9. [Testing](#9-testing)

## 1. Tổng quan Hệ thống

### 1.1 Mục đích
AppLearnEng là một ứng dụng học từ vựng tiếng Anh dành cho người Việt, được thiết kế để cung cấp trải nghiệm học tập hiệu quả và thân thiện với người dùng.

### 1.2 Tính năng chính
- Hiển thị danh sách từ vựng theo chủ đề (TOEIC, IELTS, Giao tiếp)
- Học từ vựng qua flashcard
- Đánh dấu từ yêu thích
- Giao diện thân thiện, mobile-first
- Nhắc nhở học từ vựng hàng ngày
- Lưu trữ dữ liệu local
- Hỗ trợ PWA

### 1.3 Yêu cầu hệ thống
- Node.js 16+
- Python 3.8+
- SQLite3/MySQL
- Docker (tùy chọn)
- Kubernetes (tùy chọn)

## 2. Kiến trúc Hệ thống

### 2.1 Sơ đồ Kiến trúc
+------------------+ +------------------+ +------------------+
| Frontend | | Backend | | Database |
| (React/Next.js) |<--->| (FastAPI) |<--->| (SQLite/MySQL) |
+------------------+ +------------------+ +------------------+
| | |
v v v
+------------------+ +------------------+ +------------------+
| PWA Support | | Authentication | | Data Backup |
| Local Storage | | Authorization | | Recovery |
+------------------+ +------------------+ +------------------+

### 2.2 Các Thành phần Chính

#### 2.2.1 Frontend Layer
- **Framework**: React/Next.js
- **State Management**: Redux/Context API
- **UI Components**: Material-UI/Tailwind CSS
- **PWA Features**: Service Workers, Cache API
- **Local Storage**: IndexedDB, LocalStorage

#### 2.2.2 Backend Layer
- **Framework**: FastAPI (Python)
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: JWT
- **Caching**: Redis (tùy chọn)
- **Task Queue**: Celery (cho các tác vụ nền)

#### 2.2.3 Database Layer
- **Primary Database**: SQLite/MySQL
- **Caching Layer**: Redis (tùy chọn)
- **Backup System**: Automated backups

## 3. Thiết kế Database

### 3.1 Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 3.2 Vocabulary Table
```sql
CREATE TABLE vocabulary (
    id UUID PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    meaning TEXT NOT NULL,
    pronunciation VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    examples TEXT[],
    synonyms TEXT[],
    antonyms TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 UserProgress Table
```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    vocab_id UUID REFERENCES vocabulary(id),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(id) ON DELETE CASCADE
);
```

### 3.4 Favorites Table
```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    vocab_id UUID REFERENCES vocabulary(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocab_id) REFERENCES vocabulary(id) ON DELETE CASCADE,
    UNIQUE(user_id, vocab_id)
);
```

## 4. API Documentation

### 4.1 Authentication
| Method | Endpoint           | Mô tả                 |
|--------|-------------------|----------------------|
| POST   | /api/auth/register| Đăng ký tài khoản    |
| POST   | /api/auth/login   | Đăng nhập            |
| GET    | /api/auth/me      | Thông tin user       |

### 4.2 Vocabulary Management
| Method | Endpoint                  | Mô tả                       |
|--------|---------------------------|-----------------------------|
| GET    | /api/vocab                | Lấy danh sách từ vựng       |
| POST   | /api/vocab                | Thêm từ vựng mới            |
| GET    | /api/vocab/categories     | Lấy danh sách chủ đề        |
| GET    | /api/vocab/favorites      | Lấy từ vựng yêu thích       |
| POST   | /api/vocab/favorites      | Thêm từ vào yêu thích       |
| DELETE | /api/vocab/favorites/{id} | Xóa từ khỏi yêu thích       |

## 5. Frontend Architecture

### 5.1 Cấu trúc Thư mục
```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
```

### 5.2 Các Trang Chính
- Home (`/`)
- Login (`/login`)
- Register (`/register`)
- Vocabulary List (`/vocabulary`)
- Add Vocabulary (`/vocabulary/add`)
- Flashcard (`/flashcard`)
- Favorites (`/favorites`)
- Profile (`/profile`)

## 6. Backend Architecture

### 6.1 Cấu trúc Thư mục
```
backend/
├── api/              # API endpoints
├── models/           # Database models
├── schemas/          # Pydantic schemas
├── services/         # Business logic
├── database/         # Database configuration
├── utils/            # Utility functions
└── tests/            # Unit tests
```

### 6.2 Các Module Chính
- Authentication
- Vocabulary Management
- User Progress Tracking
- Favorites Management
- Notification System

## 7. Bảo mật

### 7.1 Authentication & Authorization
- JWT-based Authentication
- Password Hashing (bcrypt)
- Role-based Access Control (RBAC)

### 7.2 Data Security
- HTTPS/TLS
- Input Validation
- SQL Injection Prevention
- XSS Protection
- CSRF Protection

### 7.3 API Security
- Rate Limiting
- Request Validation
- Error Handling
- Logging & Monitoring

## 8. Triển khai

### 8.1 Docker Deployment
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8000

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/applearneng
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=applearneng
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 8.2 Kubernetes Deployment
- Sử dụng Helm charts
- ConfigMaps cho cấu hình
- Secrets cho thông tin nhạy cảm
- Ingress cho routing
- PersistentVolumeClaims cho database

## 9. Testing

### 9.1 Frontend Testing
- Unit Tests (Jest)
- Integration Tests (React Testing Library)
- E2E Tests (Cypress)

### 9.2 Backend Testing
- Unit Tests (pytest)
- Integration Tests
- API Tests

### 9.3 Test Coverage
- Frontend: >80%
- Backend: >90%
- API: >95%