# Vocabulary Learning App

Ứng dụng học từ vựng tiếng Anh dành cho người Việt.

## Mục lục
1. [Tính năng chính](#tính-năng-chính)
2. [Kiến trúc Hệ thống](#kiến-trúc-hệ-thống)
3. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
4. [Cài đặt và Chạy](#cài-đặt-và-chạy)
5. [Cấu trúc Project](#cấu-trúc-project)
6. [Tài liệu API](#tài-liệu-api)
7. [Thiết kế Database](#thiết-kế-database)
8. [Bảo mật](#bảo-mật)
9. [Triển khai](#triển-khai)
10. [Testing](#testing)
11. [License](#license)

## Tính năng chính

- Hiển thị danh sách từ vựng theo chủ đề (TOEIC, IELTS, Giao tiếp)
- Học từ vựng qua flashcard
- Đánh dấu từ yêu thích
- Giao diện thân thiện, mobile-first
- Nhắc nhở học từ vựng hàng ngày
- Lưu trữ dữ liệu local
- Hỗ trợ PWA

## Kiến trúc Hệ thống

### Tổng quan
- Kiến trúc: Microservices
- Frontend: React/Next.js
- Backend: FastAPI (Python)
- Database: SQLite/MySQL
- Container: Docker
- Orchestration: Kubernetes (tùy chọn)

### Sơ đồ Kiến trúc
```
+------------------+     +------------------+     +------------------+
|     Frontend     |     |     Backend      |<--->|    Database     |
|  (React/Next.js) |<--->|    (FastAPI)     |<--->| (SQLite/MySQL)  |
+------------------+     +------------------+     +------------------+
```

## Yêu cầu hệ thống

- Node.js 16+
- Python 3.8+
- SQLite3/MySQL
- Docker (tùy chọn)
- Kubernetes (tùy chọn)

## Cài đặt và Chạy

### Backend (FastAPI)

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Khởi tạo dữ liệu mẫu
python init_db.py

# Chạy server
uvicorn main:app --reload
```

### Frontend (React)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

## Cấu trúc Project

```
AppLearnEng/
├── frontend/          # React frontend
│   ├── components/    # React components
│   ├── pages/        # Page components
│   ├── assets/       # Static assets
│   └── utils/        # Utility functions
│
├── backend/          # FastAPI backend
│   ├── api/         # API endpoints
│   ├── models/      # Database models
│   ├── database/    # Database configuration
│   └── tests/       # Unit tests
│
└── shared/          # Shared resources
    └── vocab_data/  # Vocabulary data
```

## Tài liệu API

### Authentication
| Method | Endpoint           | Mô tả                 |
|--------|-------------------|----------------------|
| POST   | /api/auth/register| Đăng ký tài khoản    |
| POST   | /api/auth/login   | Đăng nhập            |
| GET    | /api/auth/me      | Thông tin user       |

### Vocabulary Management
| Method | Endpoint                  | Mô tả                       |
|--------|---------------------------|-----------------------------|
| GET    | /api/vocab                | Lấy danh sách từ vựng       |
| POST   | /api/vocab                | Thêm từ vựng mới            |
| GET    | /api/vocab/categories     | Lấy danh sách chủ đề        |
| GET    | /api/vocab/favorites      | Lấy từ vựng yêu thích       |
| POST   | /api/vocab/favorites      | Thêm từ vào yêu thích       |
| DELETE | /api/vocab/favorites/{id} | Xóa từ khỏi yêu thích       |

## Thiết kế Database

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vocabulary Table
```sql
CREATE TABLE vocabulary (
    id UUID PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    meaning TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### UserProgress Table
```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    vocab_id UUID REFERENCES vocabulary(id),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Bảo mật

### Các Biện pháp Bảo mật
- JWT Authentication
- Password Hashing (bcrypt)
- HTTPS
- CORS Configuration
- Rate Limiting
- Input Validation
- SQL Injection Prevention

### Quy trình Xử lý Dữ liệu
- Mã hóa dữ liệu nhạy cảm
- Backup và Recovery
- Audit Logging
- Session Management

## Triển khai

### Docker
```bash
# Build và chạy containers
docker-compose up --build
```

### Kubernetes
- Sử dụng Helm charts
- ConfigMaps cho cấu hình
- Secrets cho thông tin nhạy cảm
- Ingress cho routing
- PersistentVolumeClaims cho database

## Testing

```bash
# Chạy backend tests
cd backend
pytest

# Chạy frontend tests
cd frontend
npm test
```

## License

MIT 

## Database Configuration

Ứng dụng hỗ trợ cả SQLite (mặc định) và MySQL.

### Sử dụng MySQL
1. Cài đặt MySQL server (hoặc dùng Docker Compose như bên dưới).
2. Cập nhật file `.env`:

   ```
   DATABASE_URL=mysql://<username>:<password>@<host>:<port>/<database>?charset=utf8mb4
   ```
   Ví dụ:
   ```
   DATABASE_URL=mysql://root:yourpassword@localhost:3306/vocabdb?charset=utf8mb4
   ```

3. Cài đặt Python package:
   ```
   pip install -r backend/requirements.txt
   ```

### Docker Compose ví dụ cho MySQL

```yaml
services:
  db:
    image: mysql:8
    restart: always
    environment:
      MYSQL_DATABASE: vocabdb
      MYSQL_USER: vocabuser
      MYSQL_PASSWORD: yourpassword
      MYSQL_ROOT_PASSWORD: yourpassword
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Khi đó, cấu hình `.env`:
```
DATABASE_URL=mysql://vocabuser:yourpassword@db:3306/vocabdb?charset=utf8mb4
``` 

## Truy cập các dịch vụ & API

### Backend (FastAPI)
- API Docs (Swagger UI): http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

#### Một số API chính:
| Method | Endpoint                  | Mô tả                       |
|--------|---------------------------|-----------------------------|
| POST   | /api/auth/register        | Đăng ký tài khoản           |
| POST   | /api/auth/login           | Đăng nhập                   |
| GET    | /api/auth/me              | Lấy thông tin user hiện tại |
| GET    | /api/vocab                | Lấy danh sách từ vựng       |
| POST   | /api/vocab                | Thêm từ vựng mới            |
| GET    | /api/vocab/categories     | Lấy danh sách chủ đề        |
| GET    | /api/vocab/favorites      | Lấy từ vựng yêu thích       |
| POST   | /api/vocab/favorites      | Thêm từ vào yêu thích        |
| DELETE | /api/vocab/favorites/{id} | Xóa từ khỏi yêu thích        |

> **Lưu ý:** Các endpoint `/api/vocab/*` yêu cầu xác thực bằng JWT Bearer Token.

### Frontend (React)
- Trang chủ: http://localhost:3000
- Đăng nhập: http://localhost:3000/login
- Hồ sơ cá nhân: http://localhost:3000/profile
- Học từ vựng: http://localhost:3000/learn
- Flashcard: http://localhost:3000/flashcard

### Khi chạy bằng Docker Compose
- Frontend: http://localhost:3000
- Backend (Swagger): http://localhost:8000/docs

### Khi chạy bằng Kubernetes (NodePort)
- Frontend: http://<NodeIP>:30080
- Backend (Swagger): http://<NodeIP>:8000 (nếu mở NodePort cho backend hoặc dùng Ingress) 