# 교과 연구회 배움 마당 설정 완료

## 개요

"교과 연구회 배움 마당" 기능이 성공적으로 구현되었습니다. 이 기능은 PostgreSQL 데이터베이스와 Express.js 백엔드 API를 사용하여 연구회 정보를 관리합니다.

## 아키텍처

### 백엔드
- **데이터베이스**: PostgreSQL 16
  - 데이터베이스명: `jeonnam2030`
  - 테이블명: `research_groups`
  - 사용자: `jeonnam_app`

- **API 서버**: Express.js (Node.js)
  - 포트: 3001
  - 프로세스 관리: PM2
  - 위치: `/home/ubuntu/jeonnam2030-backend`

### 프론트엔드
- React 컴포넌트로 구현
- 위치: `/var/www/html`
- Nginx를 통한 HTTPS 서비스

### API 엔드포인트
- `GET /api/research-groups` - 모든 연구회 목록 조회
- `GET /api/research-groups/:id` - 특정 연구회 조회
- `POST /api/research-groups` - 새 연구회 등록
- `PUT /api/research-groups/:id` - 연구회 정보 수정
- `DELETE /api/research-groups/:id` - 연구회 삭제
- `GET /api/health` - API 상태 확인

## 보안

### 비밀번호 보호
- 모든 연구회는 등록 시 설정한 비밀번호로 보호됩니다
- 비밀번호는 SHA-256으로 해싱되어 저장됩니다
- 수정/삭제 시 비밀번호 확인 필요

### 관리자 비밀번호
- 관리자 비밀번호: `admin2025`
- 모든 연구회를 수정/삭제할 수 있습니다

### SSL/TLS
- Let's Encrypt SSL 인증서 사용
- 모든 트래픽은 HTTPS로 암호화

## 데이터베이스 스키마

```sql
CREATE TABLE research_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  how_to_join TEXT NOT NULL,
  docs_link VARCHAR(500) NOT NULL,
  password_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 서버 관리

### 백엔드 서비스 관리

```bash
# PM2로 관리되는 백엔드 상태 확인
pm2 status

# 백엔드 로그 확인
pm2 logs jeonnam2030-backend

# 백엔드 재시작
pm2 restart jeonnam2030-backend

# 백엔드 중지
pm2 stop jeonnam2030-backend

# 백엔드 시작
pm2 start jeonnam2030-backend
```

### 데이터베이스 관리

```bash
# PostgreSQL 접속
sudo -u postgres psql jeonnam2030

# 모든 연구회 조회
SELECT * FROM research_groups;

# 연구회 개수 확인
SELECT COUNT(*) FROM research_groups;
```

### Nginx 관리

```bash
# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx

# Nginx 상태 확인
sudo systemctl status nginx

# Nginx 로그 확인
sudo tail -f /var/log/nginx/jeonnam2030_error.log
```

## 배포

### 전체 배포 (프론트엔드 + 백엔드)

```bash
./deploy-full.sh
```

### 백엔드만 배포

```bash
cd backend
./deploy-backend.sh
```

### 프론트엔드만 배포

```bash
npm run build
scp -i /Users/jihunkong/Downloads/jeonnam2030.pem -r dist/* ubuntu@43.202.241.6:/tmp/dist/
ssh -i /Users/jihunkong/Downloads/jeonnam2030.pem ubuntu@43.202.241.6 "sudo rm -rf /var/www/html/* && sudo cp -r /tmp/dist/* /var/www/html/"
```

## 테스트

### API 테스트

```bash
# Health check
curl https://xn--2030-kc8ph53i.kr/api/health

# 모든 연구회 조회
curl https://xn--2030-kc8ph53i.kr/api/research-groups

# 새 연구회 등록 (테스트)
curl -X POST https://xn--2030-kc8ph53i.kr/api/research-groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트 연구회",
    "description": "테스트 설명",
    "howToJoin": "테스트 참여 방법",
    "docsLink": "https://docs.google.com/document/d/test",
    "password": "test1234"
  }'
```

### 웹사이트 테스트

1. 브라우저에서 https://xn--2030-kc8ph53i.kr 접속
2. "교과 연구회" 탭 클릭
3. "새 연구회 등록" 버튼 클릭
4. 정보 입력 후 등록
5. 수정/삭제 기능 테스트

## 문제 해결

### 백엔드가 시작되지 않음

```bash
# 로그 확인
pm2 logs jeonnam2030-backend --lines 100

# 데이터베이스 연결 확인
sudo -u postgres psql -c "\l" | grep jeonnam2030

# 포트 확인
sudo netstat -tulpn | grep 3001
```

### API 연결 오류

```bash
# Nginx 프록시 설정 확인
sudo nginx -T | grep -A 10 "location /api/"

# 백엔드 상태 확인
curl http://localhost:3001/api/health
```

### 데이터베이스 연결 오류

```bash
# PostgreSQL 상태 확인
sudo systemctl status postgresql

# .env 파일 확인
cat /home/ubuntu/jeonnam2030-backend/.env
```

## 환경 변수

### 백엔드 (.env)

```
PORT=3001
DB_USER=jeonnam_app
DB_PASSWORD=jeonnam2030_secure_password_2025
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jeonnam2030
```

### 프론트엔드 (.env)

프론트엔드는 API_BASE_URL을 기본값 `/api`로 사용하므로 별도 설정이 필요하지 않습니다.

## 백업

### 데이터베이스 백업

```bash
# 백업 생성
sudo -u postgres pg_dump jeonnam2030 > jeonnam2030_backup_$(date +%Y%m%d).sql

# 백업 복원
sudo -u postgres psql jeonnam2030 < jeonnam2030_backup_20251013.sql
```

## 유지보수

### 정기 점검 사항

1. 데이터베이스 백업 (주 1회)
2. 로그 파일 정리 (월 1회)
3. SSL 인증서 갱신 확인 (자동, 90일마다)
4. PM2 프로세스 상태 확인 (일 1회)

### SSL 인증서 갱신

```bash
# Certbot 자동 갱신 테스트
sudo certbot renew --dry-run
```

## 연락처

문제 발생 시 Contact Us 페이지를 통해 문의해주세요.
