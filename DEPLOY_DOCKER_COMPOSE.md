# Hướng dẫn triển khai ứng dụng bằng Docker Compose

## 1. Chuẩn bị cấu trúc thư mục

```
AppLearnEng/
├── backend/
├── frontend/
├── docker-compose.yml
├── .env
```

## 2. Tạo file `.env` cho backend

Ví dụ:
```
DATABASE_URL=mysql://vocabuser:yourpassword@db:3306/vocabdb?charset=utf8mb4
```

## 3. File `docker-compose.yml` mẫu

```yaml
version: '3.8'
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
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend

volumes:
  db_data:
```

## 4. Build và chạy ứng dụng

```bash
docker-compose up --build
```

## 5. Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

## 6. Lưu ý
- Đảm bảo file `.env` đúng cấu hình và nằm cùng cấp với `docker-compose.yml`.
- Nếu lần đầu chạy, MySQL sẽ tự động tạo database.
- Có thể cần chỉnh sửa Dockerfile cho backend/frontend nếu cấu trúc khác chuẩn. 