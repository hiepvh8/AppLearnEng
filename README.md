# Vocabulary Learning App

Ứng dụng học từ vựng tiếng Anh dành cho người Việt.

## Tính năng chính

- Hiển thị danh sách từ vựng theo chủ đề (TOEIC, IELTS, Giao tiếp)
- Học từ vựng qua flashcard
- Đánh dấu từ yêu thích
- Giao diện thân thiện, mobile-first
- Nhắc nhở học từ vựng hàng ngày
- Lưu trữ dữ liệu local
- Hỗ trợ PWA

## Yêu cầu hệ thống

- Node.js 16+
- Python 3.8+
- SQLite3

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

## Chạy với Docker

```bash
# Build và chạy containers
docker-compose up --build
```

## Testing

```bash
# Chạy backend tests
cd backend
pytest
```

## Khởi tạo dữ liệu mẫu

Để khởi tạo dữ liệu mẫu cho ứng dụng, chạy lệnh sau:

```bash
cd backend
python init_db.py
```

Dữ liệu mẫu bao gồm các từ vựng được phân loại theo các chủ đề:
- TOEIC
- IELTS
- Communication

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