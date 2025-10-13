# Firebase 설정 가이드

교과 연구회 배움 마당 기능을 사용하기 위해서는 Firebase Firestore 설정이 필요합니다.

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: jeonnam2030)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2. Firestore Database 설정

1. Firebase Console > 빌드 > Firestore Database
2. "데이터베이스 만들기" 클릭
3. 위치 선택: `asia-northeast3 (Seoul)`
4. 보안 규칙: "프로덕션 모드로 시작" 선택
5. "만들기" 클릭

## 3. 보안 규칙 설정

Firestore Database > 규칙 탭에서 다음 규칙을 추가:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /researchGroups/{document=**} {
      // 모든 사용자는 읽기 가능
      allow read: if true;
      // 모든 사용자는 쓰기 가능 (비밀번호는 클라이언트에서 검증)
      allow write: if true;
    }
  }
}
```

## 4. Firebase 설정 정보 가져오기

1. Firebase Console > 프로젝트 설정 (톱니바퀴 아이콘)
2. "일반" 탭 > "내 앱" 섹션
3. 웹 앱 추가 (</> 아이콘)
4. 앱 닉네임 입력 (예: jeonnam2030-web)
5. Firebase SDK 설정 정보 복사

## 5. 환경 변수 설정

### 로컬 개발 환경

`.env` 파일을 생성하고 다음 정보를 입력:

```bash
cp .env.example .env
```

`.env` 파일에 Firebase 설정 정보 입력:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 서버 환경

서버의 `.env` 파일에도 동일한 정보를 추가:

```bash
ssh -i your-key.pem ubuntu@your-server
cd /home/ubuntu/jeonnam2030
nano .env
```

## 6. 테스트

1. 로컬에서 개발 서버 실행:
   ```bash
   npm run dev
   ```

2. "교과 연구회" 탭 접속
3. "새 연구회 등록" 버튼으로 테스트 데이터 입력
4. 비밀번호 설정: `test1234`
5. 등록 후 수정/삭제 테스트

## 7. 관리자 비밀번호

- 관리자 비밀번호: `admin2025`
- 이 비밀번호로 모든 연구회를 수정/삭제 가능

## 주의사항

- `.env` 파일은 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)
- Firebase 보안 규칙은 민감한 정보가 없는 공개 데이터에만 적합합니다
- 프로덕션 환경에서는 더 엄격한 보안 규칙 권장

## 문제 해결

### "Firebase configuration is not set" 오류
→ `.env` 파일의 환경 변수를 확인하세요

### "Permission denied" 오류
→ Firestore 보안 규칙을 확인하세요

### 데이터가 표시되지 않음
→ 브라우저 콘솔에서 오류 메시지 확인
