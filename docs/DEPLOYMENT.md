# Hướng dẫn Triển khai

## 1. Yêu cầu Hệ thống

### 1.1. Phần cứng tối thiểu
- CPU: 4 cores
- RAM: 8GB
- Storage: 50GB SSD
- Network: 1Gbps

### 1.2. Phần mềm
- Docker 24.0+
- Docker Compose 2.20+
- Kubernetes 1.28+
- Helm 3.12+
- Git
- kubectl
- MySQL Client

## 2. Cài đặt

### 2.1. Clone Repository
```bash
git clone <repository-url>
cd AppLearnEng
```

### 2.2. Cấu hình Môi trường

#### Backend (.env)
```bash
# Tạo file .env trong thư mục backend
cp backend/.env.example backend/.env

# Chỉnh sửa các biến môi trường
DATABASE_URL=mysql+pymysql://vocabuser:admin@db:3306/vocabdb
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://rabbitmq:5672
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

#### Frontend (.env)
```bash
# Tạo file .env trong thư mục frontend
cp frontend/.env.example frontend/.env

# Chỉnh sửa các biến môi trường
REACT_APP_API_URL=http://api.example.com
REACT_APP_ENV=production
```

## 3. Triển khai với Docker

### 3.1. Build và Chạy
```bash
# Build và chạy tất cả services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Kiểm tra logs
docker-compose logs -f
```

### 3.2. Kiểm tra Services
```bash
# Kiểm tra trạng thái các container
docker-compose ps

# Kiểm tra logs của từng service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
docker-compose logs redis
docker-compose logs rabbitmq
```

## 4. Triển khai với Kubernetes

### 4.1. Cài đặt Dependencies
```bash
# Cài đặt kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Cài đặt Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### 4.2. Triển khai Application
```bash
# Tạo namespace
kubectl create namespace applearneng

# Triển khai với Helm
helm install applearneng ./helm/applearneng \
  --namespace applearneng \
  --set environment=production \
  --set domain=example.com

# Kiểm tra trạng thái
kubectl get all -n applearneng
```

### 4.3. Cấu hình Ingress
```bash
# Cài đặt NGINX Ingress Controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Áp dụng Ingress rules
kubectl apply -f k8s/ingress/ingress.yaml
```

## 5. Quản lý Database

### 5.1. Backup Database
```bash
# Backup tự động hàng ngày
kubectl apply -f k8s/backup/cronjob.yaml

# Backup thủ công
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysqldump -u vocabuser -p vocabdb > backup-$(date +%Y%m%d).sql

# Backup với volume snapshot
kubectl apply -f k8s/backup/volume-snapshot.yaml
```

### 5.2. Restore Database
```bash
# Restore từ file backup
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysql -u vocabuser -p vocabdb < backup.sql

# Restore từ volume snapshot
kubectl apply -f k8s/backup/restore-snapshot.yaml
```

### 5.3. Database Migration
```bash
# Chạy migrations
kubectl exec -it <backend-pod> -n applearneng -- \
  alembic upgrade head

# Rollback migration
kubectl exec -it <backend-pod> -n applearneng -- \
  alembic downgrade -1
```

## 6. Monitoring và Logging

### 6.1. Cài đặt Monitoring Stack
```bash
# Cài đặt Prometheus và Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Cài đặt ELK Stack
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch \
  --namespace logging \
  --create-namespace
helm install kibana elastic/kibana \
  --namespace logging
helm install filebeat elastic/filebeat \
  --namespace logging
```

### 6.2. Cấu hình Alerts
```bash
# Áp dụng alert rules
kubectl apply -f k8s/monitoring/alert-rules.yaml

# Cấu hình alert manager
kubectl apply -f k8s/monitoring/alertmanager-config.yaml
```

## 7. Scaling

### 7.1. Horizontal Pod Autoscaling
```bash
# Cấu hình HPA cho backend
kubectl apply -f k8s/scaling/backend-hpa.yaml

# Cấu hình HPA cho frontend
kubectl apply -f k8s/scaling/frontend-hpa.yaml
```

### 7.2. Database Scaling
```bash
# Cấu hình MySQL replication
kubectl apply -f k8s/database/mysql-replication.yaml

# Cấu hình Redis cluster
kubectl apply -f k8s/database/redis-cluster.yaml
```

## 8. Security

### 8.1. SSL/TLS Configuration
```bash
# Cài đặt cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Áp dụng certificate
kubectl apply -f k8s/security/certificate.yaml
```

### 8.2. Network Policies
```bash
# Áp dụng network policies
kubectl apply -f k8s/security/network-policies.yaml
```

## 9. Maintenance

### 9.1. Update Application
```bash
# Update với Helm
helm upgrade applearneng ./helm/applearneng \
  --namespace applearneng \
  --set image.tag=new-version

# Rollback nếu cần
helm rollback applearneng -n applearneng
```

### 9.2. Log Rotation
```bash
# Cấu hình log rotation
kubectl apply -f k8s/logging/log-rotation.yaml
```

## 10. Disaster Recovery

### 10.1. Backup Strategy
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery
- Cross-region backup replication

### 10.2. Recovery Procedures
```bash
# Khôi phục từ backup
kubectl apply -f k8s/disaster-recovery/restore.yaml

# Kiểm tra tính toàn vẹn dữ liệu
kubectl exec -it <backend-pod> -n applearneng -- \
  python scripts/verify_data.py
```

## 11. Troubleshooting

### 11.1. Common Issues

#### Database Issues
```bash
# Kiểm tra database logs
kubectl logs -f <mysql-pod> -n applearneng

# Kiểm tra kết nối
kubectl exec -it <backend-pod> -n applearneng -- \
  python scripts/check_db_connection.py
```

#### Backend Issues
```bash
# Kiểm tra logs
kubectl logs -f <backend-pod> -n applearneng

# Kiểm tra metrics
kubectl port-forward svc/prometheus-server -n monitoring 9090:9090
```

#### Frontend Issues
```bash
# Kiểm tra logs
kubectl logs -f <frontend-pod> -n applearneng

# Kiểm tra performance
kubectl port-forward svc/grafana -n monitoring 3000:80
```

### 11.2. Performance Issues

#### Database Performance
```sql
-- Kiểm tra slow queries
SHOW VARIABLES LIKE '%slow%';
SHOW VARIABLES LIKE '%long%';

-- Kiểm tra index usage
SHOW INDEX FROM table_name;
```

#### Application Performance
```bash
# Kiểm tra resource usage
kubectl top pods -n applearneng

# Kiểm tra logs cho errors
kubectl logs --tail=1000 -n applearneng | grep ERROR
```