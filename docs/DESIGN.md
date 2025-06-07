# Tài liệu Thiết kế Chi tiết

## 1. Kiến trúc Hệ thống

### 1.1. Tổng quan
Hệ thống được xây dựng theo kiến trúc microservices, bao gồm:
- Frontend Service (React)
- Backend Service (FastAPI)
- Database Service (MySQL)
- Cache Service (Redis)
- Message Queue (RabbitMQ)

### 1.2. Sơ đồ Kiến trúc
```
+------------------+     +------------------+     +------------------+
|     Frontend     |     |     Backend      |<--->|    Database     |
|  (React/TS)      |<--->|    (FastAPI)     |<--->|    (MySQL)      |
+------------------+     +------------------+     +------------------+
        |                       |                        |
        v                       v                        v
+------------------+     +------------------+     +------------------+
|      Redis       |     |    RabbitMQ      |     |    Backup       |
|    (Cache)       |     |   (Message Q)    |     |    Service      |
+------------------+     +------------------+     +------------------+
```

### 1.3. Luồng dữ liệu
1. Client gửi request đến Frontend Service
2. Frontend Service xử lý và gửi API request đến Backend Service
3. Backend Service xác thực và xử lý request
4. Backend Service tương tác với Database Service và Cache Service
5. Các tác vụ bất đồng bộ được xử lý qua Message Queue
6. Kết quả được trả về theo chiều ngược lại

## 2. Database Design

### 2.1. Schema

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

#### Vocabularies Table
```sql
CREATE TABLE vocabularies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(100) NOT NULL,
    meaning VARCHAR(1000) NOT NULL,
    example VARCHAR(2000),
    category VARCHAR(50) NOT NULL,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_word (word),
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty_level)
);
```

#### Favorites Table
```sql
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    vocabulary_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, vocabulary_id),
    INDEX idx_user_id (user_id),
    INDEX idx_vocabulary_id (vocabulary_id)
);
```

#### Learning Progress Table
```sql
CREATE TABLE learning_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    vocabulary_id INT,
    status ENUM('new', 'learning', 'reviewing', 'mastered') DEFAULT 'new',
    last_reviewed_at TIMESTAMP NULL,
    next_review_at TIMESTAMP NULL,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE,
    INDEX idx_user_vocab (user_id, vocabulary_id),
    INDEX idx_next_review (next_review_at)
);
```

### 2.2. Indexes và Performance
- Tối ưu hóa queries với composite indexes
- Sử dụng partial indexes cho các trường thường xuyên tìm kiếm
- Implement database partitioning cho bảng lớn
- Sử dụng materialized views cho các báo cáo phức tạp

## 3. API Design

### 3.1. Authentication API

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/token
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password123
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

### 3.2. Vocabulary API

#### Get Vocabularies
```http
GET /api/v1/vocabularies
Authorization: Bearer <token>
Query Parameters:
- page: int
- limit: int
- category: string
- difficulty: string
- search: string
```

#### Create Vocabulary
```http
POST /api/v1/vocabularies
Authorization: Bearer <token>
Content-Type: application/json

{
    "word": "example",
    "meaning": "a representative form or pattern",
    "example": "This is an example sentence.",
    "category": "general",
    "difficulty_level": "intermediate"
}
```

#### Update Learning Progress
```http
PUT /api/v1/vocabularies/{id}/progress
Authorization: Bearer <token>
Content-Type: application/json

{
    "status": "learning",
    "next_review_at": "2024-03-20T10:00:00Z"
}
```

## 4. Security Design

### 4.1. Authentication
- JWT (JSON Web Token) cho xác thực
- Token expiration: 15 phút cho access token, 7 ngày cho refresh token
- Refresh token rotation
- Password hashing với Argon2id
- Rate limiting cho authentication endpoints

### 4.2. Authorization
- Role-based access control (RBAC)
- Resource ownership validation
- API rate limiting với Redis
- IP-based blocking cho suspicious activities

### 4.3. Data Protection
- HTTPS cho tất cả communications
- Input validation và sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Content Security Policy (CSP)

## 5. Frontend Design

### 5.1. Component Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── vocabulary/
│   │   ├── VocabularyList.tsx
│   │   ├── VocabularyForm.tsx
│   │   ├── VocabularyCard.tsx
│   │   └── LearningProgress.tsx
│   ├── dashboard/
│   │   ├── Statistics.tsx
│   │   ├── LearningGoals.tsx
│   │   └── ProgressChart.tsx
│   └── common/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Layout.tsx
│       └── ErrorBoundary.tsx
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Vocabulary.tsx
│   ├── Dashboard.tsx
│   └── Settings.tsx
└── services/
    ├── api.ts
    ├── auth.ts
    └── cache.ts
```

### 5.2. State Management
- React Query cho server state
- Zustand cho client state
- React Context cho theme và auth
- Custom hooks cho reusable logic

### 5.3. UI/UX Design
- Material-UI components
- Responsive design
- Dark/Light theme support
- Loading states và error handling
- Progressive Web App (PWA) support
- Offline mode với service workers

## 6. Deployment Design

### 6.1. Docker Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://api.example.com

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
      - rabbitmq
    environment:
      - DATABASE_URL=mysql+pymysql://vocabuser:admin@db:3306/vocabdb
      - REDIS_URL=redis://redis:6379
      - RABBITMQ_URL=amqp://rabbitmq:5672

  db:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=vocabdb
      - MYSQL_USER=vocabuser
      - MYSQL_PASSWORD=admin
      - MYSQL_ROOT_PASSWORD=root
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backup:/backup

  redis:
    image: redis:7.0-alpine
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3-management
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=admin
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  mysql_data:
  redis_data:
  rabbitmq_data:
```

### 6.2. Kubernetes Configuration
```yaml
# k8s/
├── base/
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── database-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── rabbitmq-deployment.yaml
│   └── kustomization.yaml
├── overlays/
│   ├── development/
│   │   └── kustomization.yaml
│   └── production/
│       └── kustomization.yaml
└── ingress/
    └── ingress.yaml
```

### 6.3. Environment Variables
```env
# Backend
DATABASE_URL=mysql+pymysql://vocabuser:admin@db:3306/vocabdb
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://rabbitmq:5672
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend
REACT_APP_API_URL=http://api.example.com
REACT_APP_ENV=production
```

## 7. Testing Strategy

### 7.1. Backend Tests
- Unit tests với pytest
- Integration tests cho API endpoints
- Database tests
- Authentication tests
- Performance tests với locust
- Security tests với OWASP ZAP

### 7.2. Frontend Tests
- Unit tests với Jest
- Component tests với React Testing Library
- Integration tests
- E2E tests với Cypress
- Visual regression tests với Percy
- Performance tests với Lighthouse

## 8. Monitoring và Logging

### 8.1. Application Logs
- Backend logs với Python logging
- Frontend logs với console logging
- Error tracking với Sentry
- Log aggregation với ELK Stack

### 8.2. Performance Monitoring
- API response times với Prometheus
- Database query performance
- Frontend performance metrics
- Resource usage monitoring
- Custom metrics cho business KPIs

### 8.3. Alerting
- Email notifications
- Slack integration
- PagerDuty for critical alerts
- Custom alert rules trong Grafana