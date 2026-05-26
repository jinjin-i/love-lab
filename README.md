# 연애심리연구소 🔮

Next.js + Firebase + 토스페이먼츠로 만든 연애 심리 분석 서비스

## 기술 스택
- **프론트/서버**: Next.js 14 (App Router)
- **DB**: Firebase Firestore
- **결제**: 토스페이먼츠
- **AI**: Claude API (Anthropic)
- **배포**: Vercel

---

## 배포 순서

### 1. GitHub에 올리기
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/본인아이디/love-lab.git
git push -u origin main
```

### 2. Firebase 설정
1. [console.firebase.google.com](https://console.firebase.google.com) 접속
2. 새 프로젝트 생성
3. Firestore Database 생성 (프로덕션 모드)
4. 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성 (JSON 다운로드)
5. JSON에서 아래 값 복사:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 3. 토스페이먼츠 가맹점 가입
1. [developers.tosspayments.com](https://developers.tosspayments.com) 접속
2. 사업자 등록 후 가맹점 가입
3. 대시보드에서 클라이언트 키 / 시크릿 키 복사

### 4. Vercel 배포
1. [vercel.com](https://vercel.com) 접속 → GitHub 연동
2. love-lab 레포 선택 → Import
3. Environment Variables에 아래 값 입력:

```
TOSS_SECRET_KEY=live_sk_...
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
ANTHROPIC_API_KEY=sk-ant-...
```

4. Deploy 클릭
5. 배포된 URL을 `NEXT_PUBLIC_BASE_URL`에 다시 입력 후 재배포

### 5. 토스페이먼츠에 도메인 등록
토스 대시보드 → 개발 정보 → 허용 도메인에 Vercel URL 추가

---

## 로컬 개발

```bash
# 패키지 설치
npm install

# .env.local 파일 생성 (.env.local.example 참고)
cp .env.local.example .env.local
# 값 입력 후

# 개발 서버 실행
npm run dev
# http://localhost:3000
```

---

## Firebase Firestore 구조

```
results/
  {orderId}/
    orderId: string
    paymentKey: string
    phone: string        ← 전화번호로 조회
    quizType: 'ex'
    resultText: string   ← AI 분석 결과
    paidAt: string
    amount: number

phones/
  {phoneNumber}/
    orderIds: string[]
    updatedAt: string
```

---

## 결제 흐름

```
1. 사용자가 전화번호 입력 + 결제 버튼 클릭
2. 토스페이먼츠 결제창 오픈
3. 결제 완료 → /pay/success?paymentKey=...&orderId=...&amount=...
4. 서버 /api/confirm 에서:
   - 토스 API로 결제 금액 검증
   - Claude API로 AI 분석 실행
   - Firebase에 결과 저장
5. /result 페이지에서 결과 표시
6. 나중에 다시 접속 시 전화번호로 조회 → /api/check-payment
```

---

## 카카오톡 공유 설정

### 1. 카카오 개발자 콘솔 설정
1. [developers.kakao.com](https://developers.kakao.com) 접속 → 로그인
2. **내 애플리케이션 → 애플리케이션 추가**
3. 앱 이름: 연애심리연구소
4. **앱 키 → JavaScript 키** 복사 → `NEXT_PUBLIC_KAKAO_JS_KEY`에 입력
5. **플랫폼 → Web → 사이트 도메인** 에 Vercel URL 추가
   - 예: `https://your-app.vercel.app`
6. **카카오 로그인 → 활성화 OFF** (공유만 쓸 거라 로그인 불필요)

### 2. OG 이미지 추가 (카톡 미리보기 이미지)
- `public/og-image.png` 파일 추가 (1200x630px 권장)
- 없으면 카톡 공유 시 이미지 없이 텍스트만 표시

### 공유 내용
- **제목**: 연애심리연구소 — {분석 유형}
- **설명**: 첫 번째 섹션 제목 + 내용 미리보기
- **버튼**: "나도 분석받기" → 사이트로 이동
