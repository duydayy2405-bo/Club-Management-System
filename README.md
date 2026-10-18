
# Đề 39 - Hệ thống Quản lý Câu lạc bộ

**Môn học:** Triển khai và Quản trị Hệ thống Phần mềm  
**Sinh viên:** Nguyễn Hữu Duy  
**MSSV:** DTC245200368  
**Lớp:** CNTT K23K

## 1. Giới thiệu

Hệ thống quản lý câu lạc bộ sinh viên được xây dựng bằng Node.js và MySQL, triển khai bằng Docker Compose.

Chức năng chính:
- Quản lý thành viên câu lạc bộ
- Quản lý hoạt động
- Quản lý các khoản đóng góp
- Quản lý lịch họp

## 2. Công nghệ sử dụng

- Node.js / Express
- MySQL 8
- phpMyAdmin
- Nginx Reverse Proxy
- Docker và Docker Compose
- Prometheus và Grafana
- Loki và Promtail
- MySQL Exporter, Nginx Exporter, cAdvisor

## 3. Yêu cầu môi trường

- Ubuntu Linux
- Docker Engine
- Docker Compose Plugin
- Git
- Trình duyệt web

## 4. Hướng dẫn chạy hệ thống

### Bước 1: Clone repository

```bash
git clone https://github.com/duydayy2405-bo/Club-Management-System.git
cd Club-Management-System
```

### Bước 2: Cấu hình môi trường

Tạo file `.env` và điền các biến môi trường phù hợp với cấu hình trong `docker-compose.yml`.

Cấu hình thông tin đăng nhập MySQL Exporter thông qua file `monitoring/mysql-exporter/my.cnf` nếu sử dụng file này trong Docker Compose.

Không commit file chứa mật khẩu hoặc thông tin bí mật lên GitHub.

### Bước 3: Khởi chạy

```bash
docker compose up -d --build
```

### Bước 4: Kiểm tra container

```bash
docker compose ps
```

### Bước 5: Kiểm tra ứng dụng

```bash
curl http://localhost:8081/health
```

Kết quả mong đợi:

```json
{"status":"ok","database":"connected"}
```

## 5. Địa chỉ truy cập

| Dịch vụ | Địa chỉ |
|---|---|
| Website qua Nginx | http://localhost:8084 |
| Website trực tiếp | http://localhost:8081 |
| phpMyAdmin | http://localhost:8083 |
| Prometheus | http://localhost:9091 |
| Grafana | http://localhost:3001 |
| Loki | http://localhost:3101 |

Các địa chỉ áp dụng khi truy cập từ máy đang chạy Docker.

## 6. Giám sát hệ thống

Prometheus thu thập metrics thông qua các exporter.

Grafana hiển thị dashboard giám sát:
- Trạng thái dịch vụ
- Kết nối Nginx
- Kết nối MySQL
- Bộ nhớ container

## 7. Logging

Loki và Promtail được sử dụng để tập trung log các container.

Ví dụ truy vấn LogQL trong Grafana Explore:

```logql
{service="nginx"}
```

## 8. Security Hardening

Các biện pháp bảo mật đã áp dụng:
- App chạy bằng tài khoản không phải root
- Tách Docker Network
- Không công khai cổng MySQL ra máy host
- Nginx Security Headers
- `no-new-privileges` cho App và Nginx
- Giảm Linux Capabilities bằng `cap_drop: ALL`
- Chỉ cấp lại các capabilities cần thiết cho Nginx

## 9. Lệnh quản trị

Xem trạng thái:

```bash
docker compose ps
```

Xem log:

```bash
docker compose logs --tail=50
```

Dừng hệ thống:

```bash
docker compose down
```

Khởi động lại:

```bash
docker compose up -d
```

**Lưu ý:** Không sử dụng `docker compose down -v` nếu muốn giữ lại dữ liệu trong Docker Volumes.

## 10. GitHub

Repository:
https://github.com/duydayy2405-bo/Club-Management-System

Các giai đoạn triển khai:
- Commit 1: Website + MySQL + Nginx
- Commit 2: Prometheus + Grafana
- Commit 3: Loki + Promtail
- Commit 4: Docker Security Hardening
