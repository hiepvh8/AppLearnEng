# Hướng dẫn Backup và Restore Database

## 1. Backup Database

### 1.1. Backup Tự động

#### Sử dụng Cronjob trong Kubernetes
```yaml
# k8s/backup/cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: mysql-backup
  namespace: applearneng
spec:
  schedule: "0 0 * * *"  # Chạy mỗi ngày lúc 00:00
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: mysql-backup
            image: mysql:8.0
            command:
            - /bin/sh
            - -c
            - |
              mysqldump -h mysql -u vocabuser -p$MYSQL_PASSWORD vocabdb > /backup/vocabdb-$(date +%Y%m%d).sql
            env:
            - name: MYSQL_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: password
            volumeMounts:
            - name: backup-volume
              mountPath: /backup
          volumes:
          - name: backup-volume
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
```

#### Sử dụng Docker Compose
```yaml
# docker-compose.backup.yml
version: '3.8'
services:
  backup:
    image: mysql:8.0
    volumes:
      - ./backup:/backup
    environment:
      - MYSQL_HOST=db
      - MYSQL_USER=vocabuser
      - MYSQL_PASSWORD=admin
      - MYSQL_DATABASE=vocabdb
    command: >
      /bin/sh -c '
        mysqldump -h $$MYSQL_HOST -u $$MYSQL_USER -p$$MYSQL_PASSWORD $$MYSQL_DATABASE > /backup/vocabdb-$$(date +%Y%m%d).sql
      '
```

### 1.2. Backup Thủ công

#### Sử dụng kubectl
```bash
# Backup toàn bộ database
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysqldump -u vocabuser -p vocabdb > backup-$(date +%Y%m%d).sql

# Backup một bảng cụ thể
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysqldump -u vocabuser -p vocabdb users > users-$(date +%Y%m%d).sql

# Backup với compression
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysqldump -u vocabuser -p vocabdb | gzip > backup-$(date +%Y%m%d).sql.gz
```

#### Sử dụng Docker
```bash
# Backup toàn bộ database
docker exec -it <mysql-container> \
  mysqldump -u vocabuser -p vocabdb > backup-$(date +%Y%m%d).sql

# Backup một bảng cụ thể
docker exec -it <mysql-container> \
  mysqldump -u vocabuser -p vocabdb users > users-$(date +%Y%m%d).sql

# Backup với compression
docker exec -it <mysql-container> \
  mysqldump -u vocabuser -p vocabdb | gzip > backup-$(date +%Y%m%d).sql.gz
```

### 1.3. Backup với Volume Snapshot

```yaml
# k8s/backup/volume-snapshot.yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: mysql-snapshot
  namespace: applearneng
spec:
  source:
    persistentVolumeClaimName: mysql-pvc
```

## 2. Restore Database

### 2.1. Restore từ SQL File

#### Sử dụng kubectl
```bash
# Restore toàn bộ database
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysql -u vocabuser -p vocabdb < backup.sql

# Restore một bảng cụ thể
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysql -u vocabuser -p vocabdb < users.sql

# Restore từ file nén
gunzip -c backup.sql.gz | kubectl exec -i <mysql-pod> -n applearneng -- \
  mysql -u vocabuser -p vocabdb
```

#### Sử dụng Docker
```bash
# Restore toàn bộ database
docker exec -i <mysql-container> \
  mysql -u vocabuser -p vocabdb < backup.sql

# Restore một bảng cụ thể
docker exec -i <mysql-container> \
  mysql -u vocabuser -p vocabdb < users.sql

# Restore từ file nén
gunzip -c backup.sql.gz | docker exec -i <mysql-container> \
  mysql -u vocabuser -p vocabdb
```

### 2.2. Restore từ Volume Snapshot

```yaml
# k8s/backup/restore-snapshot.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-restore-pvc
  namespace: applearneng
spec:
  dataSource:
    name: mysql-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## 3. Quản lý Backup

### 3.1. Lưu trữ Backup

#### Local Storage
```bash
# Tạo thư mục backup
mkdir -p /backup/mysql

# Di chuyển file backup
mv backup-*.sql /backup/mysql/

# Nén các file cũ
find /backup/mysql -name "backup-*.sql" -mtime +7 -exec gzip {} \;
```

#### Cloud Storage (AWS S3)
```bash
# Cài đặt AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Upload backup lên S3
aws s3 cp backup.sql s3://your-bucket/mysql/backup-$(date +%Y%m%d).sql

# Download backup từ S3
aws s3 cp s3://your-bucket/mysql/backup-20240320.sql ./backup.sql
```

### 3.2. Xoay vòng Backup

```bash
# Giữ backup trong 30 ngày
find /backup/mysql -name "backup-*.sql" -mtime +30 -delete

# Giữ backup nén trong 90 ngày
find /backup/mysql -name "backup-*.sql.gz" -mtime +90 -delete
```

## 4. Kiểm tra Backup

### 4.1. Kiểm tra tính toàn vẹn
```bash
# Kiểm tra file backup
mysqlcheck -u vocabuser -p --all-databases < backup.sql

# Kiểm tra kích thước
ls -lh backup.sql

# Kiểm tra nội dung
head -n 20 backup.sql
```

### 4.2. Kiểm tra khả năng restore
```bash
# Tạo database test
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysql -u vocabuser -p -e "CREATE DATABASE test_restore;"

# Restore vào database test
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysql -u vocabuser -p test_restore < backup.sql

# Kiểm tra dữ liệu
kubectl exec -it <mysql-pod> -n applearneng -- \
  mysql -u vocabuser -p -e "USE test_restore; SHOW TABLES;"
```

## 5. Script Tự động

### 5.1. Script Backup
```bash
#!/bin/bash
# backup.sh

# Cấu hình
BACKUP_DIR="/backup/mysql"
MYSQL_USER="vocabuser"
MYSQL_PASSWORD="admin"
MYSQL_DATABASE="vocabdb"
RETENTION_DAYS=30

# Tạo thư mục backup nếu chưa tồn tại
mkdir -p $BACKUP_DIR

# Tạo backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Backup database
mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE > $BACKUP_FILE

# Nén file backup
gzip $BACKUP_FILE

# Xóa backup cũ
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Upload lên S3 (nếu cần)
aws s3 cp $BACKUP_FILE.gz s3://your-bucket/mysql/
```

### 5.2. Script Restore
```bash
#!/bin/bash
# restore.sh

# Cấu hình
BACKUP_FILE=$1
MYSQL_USER="vocabuser"
MYSQL_PASSWORD="admin"
MYSQL_DATABASE="vocabdb"

# Kiểm tra file backup
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Restore database
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE
else
    mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < $BACKUP_FILE
fi

# Kiểm tra restore
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -e "USE $MYSQL_DATABASE; SHOW TABLES;"
```

## 6. Monitoring và Alerting

### 6.1. Kiểm tra trạng thái backup
```bash
# Kiểm tra kích thước backup
du -sh /backup/mysql/

# Kiểm tra số lượng file backup
ls -l /backup/mysql/ | wc -l

# Kiểm tra backup gần nhất
ls -ltr /backup/mysql/ | tail -n 1
```

### 6.2. Cấu hình alerting
```yaml
# k8s/monitoring/backup-alerts.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: backup-alerts
  namespace: monitoring
spec:
  groups:
  - name: backup
    rules:
    - alert: BackupFailed
      expr: mysql_backup_status == 0
      for: 1h
      labels:
        severity: critical
      annotations:
        summary: "Database backup failed"
        description: "Backup has not completed successfully in the last hour"
```

## 7. Best Practices

1. **Lịch trình backup**
   - Full backup hàng ngày
   - Incremental backup hàng giờ
   - Backup vào thời điểm ít người dùng

2. **Lưu trữ backup**
   - Lưu trữ local và remote
   - Mã hóa dữ liệu nhạy cảm
   - Xoay vòng backup tự động

3. **Kiểm tra backup**
   - Kiểm tra tính toàn vẹn
   - Test restore định kỳ
   - Monitor kích thước backup

4. **Bảo mật**
   - Mã hóa file backup
   - Phân quyền truy cập
   - Audit log cho các hoạt động backup/restore

5. **Documentation**
   - Ghi lại quy trình backup/restore
   - Cập nhật thông tin liên hệ
   - Lưu trữ thông tin cấu hình 