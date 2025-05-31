# Hướng dẫn triển khai ứng dụng bằng Kubernetes (k8s)

## 1. Chuẩn bị các file manifest YAML

### 1.1. MySQL (mysql-deployment.yaml)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
stringData:
  MYSQL_ROOT_PASSWORD: yourpassword
  MYSQL_DATABASE: vocabdb
  MYSQL_USER: vocabuser
  MYSQL_PASSWORD: yourpassword
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  replicas: 1
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8
        envFrom:
        - secretRef:
            name: mysql-secret
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  ports:
    - port: 3306
  selector:
    app: mysql
```

### 1.2. Backend (backend-deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-backend-image:latest
        env:
        - name: DATABASE_URL
          value: mysql://vocabuser:yourpassword@mysql:3306/vocabdb?charset=utf8mb4
        ports:
        - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: ClusterIP
  ports:
    - port: 8000
      targetPort: 8000
  selector:
    app: backend
```

### 1.3. Frontend (frontend-deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-frontend-image:latest
        env:
        - name: REACT_APP_API_URL
          value: http://backend:8000
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: NodePort
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30080
  selector:
    app: frontend
```

## 2. Build và đẩy image lên Docker Registry
- Sửa `image:` trong manifest thành tên image của bạn (ví dụ: `your-dockerhub-username/app-backend:latest`).
- Build và push image:
  ```bash
  docker build -t your-backend-image:latest ./backend
  docker build -t your-frontend-image:latest ./frontend
  docker push your-backend-image:latest
  docker push your-frontend-image:latest
  ```

## 3. Triển khai lên k8s
```bash
kubectl apply -f mysql-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

## 4. Truy cập ứng dụng
- Frontend: NodePort 30080 trên IP của node (hoặc dùng Ingress/nginx nếu cần domain)
- Backend API: Truy cập nội bộ qua service `backend:8000`

## 5. Lưu ý
- Có thể cần chỉnh sửa Dockerfile cho backend/frontend để build image chuẩn.
- Đảm bảo các secret và config đúng với môi trường thực tế.
- Có thể dùng Helm để quản lý manifest phức tạp hơn. 