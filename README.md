# Ứng dụng Học Từ Vựng Tiếng Anh

Ứng dụng web giúp người dùng học và quản lý từ vựng tiếng Anh một cách hiệu quả, với các tính năng thông minh và giao diện thân thiện.

## Tính năng chính

- Đăng ký và đăng nhập tài khoản
- Thêm, sửa, xóa từ vựng
- Phân loại từ vựng theo danh mục và độ khó
- Đánh dấu từ vựng yêu thích
- Theo dõi tiến độ học tập
- Hệ thống ôn tập thông minh
- Tìm kiếm và lọc từ vựng
- Thống kê và báo cáo học tập
- Giao diện thân thiện, responsive
- Hỗ trợ offline mode

## Công nghệ sử dụng

### Backend
- FastAPI (Python)
- SQLAlchemy (ORM)
- MySQL
- Redis (Cache)
- RabbitMQ (Message Queue)
- JWT Authentication
- Docker & Kubernetes

### Frontend
- React.js
- TypeScript
- Material-UI
- React Query
- Zustand
- Axios
- PWA Support
- Docker & Kubernetes

### DevOps
- Docker & Docker Compose
- Kubernetes
- Helm
- Prometheus & Grafana
- ELK Stack
- GitHub Actions

## Yêu cầu hệ thống

### Development
- Docker và Docker Compose
- Node.js 18+
- Python 3.9+
- Git

### Production
- Kubernetes 1.28+
- Helm 3.12+
- MySQL 8.0+
- Redis 7.0+
- RabbitMQ 3.9+

## Cài đặt và triển khai

### Sử dụng Docker (Development)

1. Clone repository:
```bash
git clone <repository-url>
cd AppLearnEng
```

2. Tạo file môi trường:
```bash
# Backend (.env)
cp backend/.env.example backend/.env

# Frontend (.env)
cp frontend/.env.example frontend/.env
```

3. Khởi động ứng dụng:
```bash
docker-compose up -d
```

4. Truy cập ứng dụng:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Sử dụng Kubernetes (Production)

1. Cài đặt dependencies:
```bash
# Cài đặt kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Cài đặt Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

2. Triển khai ứng dụng:
```bash
# Tạo namespace
kubectl create namespace applearneng

# Triển khai với Helm
helm install applearneng ./helm/applearneng \
  --namespace applearneng \
  --set environment=production \
  --set domain=example.com
```

## Cấu trúc dự án

```
AppLearnEng/
├── backend/
│   ├── api/
│   │   ├── auth.py
│   │   ├── vocab.py
│   │   └── progress.py
│   ├── database/
│   │   └── database.py
│   ├── models.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── k8s/
│   ├── base/
│   ├── overlays/
│   └── ingress/
├── helm/
│   └── applearneng/
└── docker-compose.yml
```

## API Endpoints

### Authentication
- POST /api/v1/auth/register - Đăng ký tài khoản
- POST /api/v1/auth/token - Đăng nhập
- POST /api/v1/auth/refresh - Làm mới token
- GET /api/v1/auth/me - Lấy thông tin người dùng

### Vocabulary
- GET /api/v1/vocabularies - Lấy danh sách từ vựng
- POST /api/v1/vocabularies - Thêm từ vựng mới
- GET /api/v1/vocabularies/{id} - Lấy chi tiết từ vựng
- PUT /api/v1/vocabularies/{id} - Cập nhật từ vựng
- DELETE /api/v1/vocabularies/{id} - Xóa từ vựng

### Learning Progress
- GET /api/v1/progress - Lấy tiến độ học tập
- PUT /api/v1/progress/{id} - Cập nhật tiến độ
- GET /api/v1/progress/stats - Lấy thống kê học tập

## Bảo mật

- JWT Authentication với refresh token
- Password hashing với Argon2id
- Rate limiting với Redis
- CORS được cấu hình an toàn
- SSL/TLS cho tất cả communications
- Input validation và sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## Monitoring

- Prometheus cho metrics
- Grafana cho visualization
- ELK Stack cho logging
- Alerting với AlertManager
- Custom dashboards
- Performance monitoring
- Error tracking

## Backup và Recovery

- Daily full backups
- Hourly incremental backups
- Point-in-time recovery
- Cross-region backup replication
- Automated backup testing
- Disaster recovery procedures

## Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Giấy phép

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết. 