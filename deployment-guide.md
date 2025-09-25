# 전라남도교육청 2030 수업 축제 배포 가이드

## 개요
이 문서는 React 기반 웹사이트를 EC2 서버에 배포하는 전체 과정을 안내합니다.

**서버 정보:**
- IP: 43.202.241.6
- 도메인: xn--2030-kc8ph53i.kr
- OS: Ubuntu (EC2)
- SSH Key: /Users/jihunkong/Downloads/jeonnam2030.pem

## 사전 준비사항

### 1. 로컬 개발 환경
```bash
# Node.js LTS 버전 설치 확인
node --version
npm --version

# 프로젝트 디렉토리로 이동
cd /Users/jihunkong/jeonnam2030
```

### 2. SSH 키 권한 설정
```bash
chmod 600 /Users/jihunkong/Downloads/jeonnam2030.pem
```

### 3. 서버 연결 테스트
```bash
ssh -i /Users/jihunkong/Downloads/jeonnam2030.pem ubuntu@43.202.241.6
```

## 배포 방법

### 방법 1: 자동 배포 스크립트 사용 (권장)

```bash
# 배포 스크립트 실행 권한 부여
chmod +x deploy.sh

# 자동 배포 실행
./deploy.sh
```

### 방법 2: 단계별 수동 배포

#### 1단계: 로컬에서 빌드
```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 결과 확인
ls -la dist/
```

#### 2단계: 서버 초기 설정
```bash
# 서버 설정 스크립트 전송
scp -i /Users/jihunkong/Downloads/jeonnam2030.pem server-setup.sh ubuntu@43.202.241.6:/tmp/

# 서버에서 초기 설정 실행
ssh -i /Users/jihunkong/Downloads/jeonnam2030.pem ubuntu@43.202.241.6
sudo /tmp/server-setup.sh xn--2030-kc8ph53i.kr jeonnam2030-festival
```

#### 3단계: 애플리케이션 배포
```bash
# 빌드된 파일 서버로 전송
scp -i /Users/jihunkong/Downloads/jeonnam2030.pem -r dist/* ubuntu@43.202.241.6:/tmp/

# Nginx 설정 파일 전송
scp -i /Users/jihunkong/Downloads/jeonnam2030.pem nginx/jeonnam2030.conf ubuntu@43.202.241.6:/tmp/

# 서버에서 파일 배치 및 Nginx 설정
ssh -i /Users/jihunkong/Downloads/jeonnam2030.pem ubuntu@43.202.241.6
sudo rm -rf /var/www/xn--2030-kc8ph53i.kr/*
sudo cp -r /tmp/dist/* /var/www/xn--2030-kc8ph53i.kr/
sudo chown -R www-data:www-data /var/www/xn--2030-kc8ph53i.kr
sudo cp /tmp/jeonnam2030.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/jeonnam2030.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

#### 4단계: SSL 인증서 설정
```bash
# Let's Encrypt SSL 인증서 발급
sudo certbot --nginx -d xn--2030-kc8ph53i.kr --non-interactive --agree-tos --email admin@xn--2030-kc8ph53i.kr --redirect
```

## 배포 후 확인사항

### 1. 웹사이트 접속 테스트
- HTTP: http://xn--2030-kc8ph53i.kr (자동으로 HTTPS로 리다이렉트됨)
- HTTPS: https://xn--2030-kc8ph53i.kr

### 2. SSL 인증서 확인
```bash
# SSL 인증서 상태 확인
sudo certbot certificates

# SSL 품질 테스트 (외부 도구)
# https://www.ssllabs.com/ssltest/
```

### 3. 서버 상태 모니터링
```bash
# 서버 전체 상태 확인
/usr/local/bin/server-health.sh

# Nginx 상태 확인
sudo systemctl status nginx

# 로그 확인
sudo tail -f /var/log/nginx/jeonnam2030_access.log
sudo tail -f /var/log/nginx/jeonnam2030_error.log
```

## 보안 설정

### 1. 방화벽 (UFW)
- SSH (22번 포트): 허용
- HTTP (80번 포트): 허용 (HTTPS로 리다이렉트)
- HTTPS (443번 포트): 허용
- 기타 모든 포트: 차단

### 2. Fail2ban
- SSH 무차별 대입 공격 차단
- Nginx 과도한 요청 차단
- 자동 IP 차단 및 해제

### 3. SSL/TLS 보안
- Let's Encrypt TLS 1.3 인증서
- HSTS (HTTP Strict Transport Security) 적용
- 안전한 암호화 알고리즘 사용

### 4. HTTP 보안 헤더
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy 적용

## 백업 및 복구

### 1. 자동 백업
```bash
# 매일 오전 2시 자동 백업 (cron job 설정됨)
# 백업 파일 위치: /var/backups/website/

# 수동 백업 실행
/usr/local/bin/backup-website.sh
```

### 2. 백업 파일 복구
```bash
# 백업 파일 목록 확인
ls -la /var/backups/website/

# 백업 파일 복구
sudo tar -xzf /var/backups/website/website_YYYYMMDD_HHMMSS.tar.gz -C /var/www/xn--2030-kc8ph53i.kr/
```

## 업데이트 및 재배포

### 1. 코드 변경 후 재배포
```bash
# 1. 로컬에서 변경사항 적용
# 2. 빌드 및 배포
npm run build
./deploy.sh
```

### 2. 무중단 배포 (Blue-Green)
```bash
# 현재 서비스 중인 디렉토리 백업
sudo cp -r /var/www/xn--2030-kc8ph53i.kr /var/www/xn--2030-kc8ph53i.kr.backup

# 새 버전 배포
# 문제 발생 시 즉시 롤백
sudo rm -rf /var/www/xn--2030-kc8ph53i.kr
sudo mv /var/www/xn--2030-kc8ph53i.kr.backup /var/www/xn--2030-kc8ph53i.kr
sudo systemctl reload nginx
```

## 성능 최적화

### 1. Nginx 캐싱
- 정적 파일 (JS, CSS, 이미지): 1년 캐싱
- HTML 파일: 1시간 캐싱
- Gzip 압축 적용

### 2. 모니터링 도구
- 서버 리소스 모니터링: htop
- 로그 분석: 실시간 로그 확인
- SSL 인증서 만료 알림

## 문제 해결

### 1. 일반적인 문제
```bash
# Nginx 설정 오류
sudo nginx -t

# 서비스 재시작
sudo systemctl restart nginx

# 권한 문제
sudo chown -R www-data:www-data /var/www/xn--2030-kc8ph53i.kr
sudo chmod -R 755 /var/www/xn--2030-kc8ph53i.kr
```

### 2. SSL 인증서 문제
```bash
# 인증서 갱신
sudo certbot renew

# 인증서 재발급
sudo certbot delete --cert-name xn--2030-kc8ph53i.kr
sudo certbot --nginx -d xn--2030-kc8ph53i.kr
```

### 3. 로그 분석
```bash
# 에러 로그 확인
sudo grep -i error /var/log/nginx/jeonnam2030_error.log

# 접속 로그 분석
sudo tail -100 /var/log/nginx/jeonnam2030_access.log | grep -v "200"
```

## 연락처 및 지원

- 개발자: 완도고등학교 공지훈
- 프로젝트: 전라남도교육청 2030 수업 축제
- 서버 관리: EC2 Ubuntu 기반

## 참고 자료

- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Let's Encrypt 가이드](https://letsencrypt.org/getting-started/)
- [Ubuntu 서버 보안 가이드](https://help.ubuntu.com/community/Security)
- [React 배포 가이드](https://create-react-app.dev/docs/deployment/)