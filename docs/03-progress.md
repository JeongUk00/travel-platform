# 03. 진행 기록

> 노트북과 데스크탑을 오가며 작업하므로, 어디까지 했는지를 여기에 남긴다.
> 새 기기에서 시작할 때 이 파일부터 읽는다.

## 현재 위치: 1단계 (로그인) 기능 완료 → 로그인 화면 디자인 대기

배포 주소: https://travel-platform-sigma.vercel.app/

### 0단계 체크리스트
- [x] Vite + React + TypeScript 프로젝트 생성, 기본 템플릿 정리
- [x] 린터 oxlint 설정 (`npm run lint`)
- [x] Tailwind CSS 연결 (`@tailwindcss/vite` 플러그인)
- [x] 첫 커밋
- [x] GitHub 저장소 연결 & push (https://github.com/JeongUk00/travel-platform)
- [x] PWA 설정 (`vite-plugin-pwa`: manifest, 아이콘, Service Worker)
- [x] Vercel 배포 (push하면 자동 배포)
- [x] 폰에서 "홈 화면에 추가" 테스트 (정욱 폰, 여자친구 폰 모두 정상, 이름 "노트립" 표시)

## 작업 일지

### 2026-11-16 (데스크탑)
- Vite + React + TS 템플릿으로 프로젝트 생성. 샘플 코드를 지우고 `App.tsx`에 확인용 화면만 남김.
- ESLint 대신 oxlint 설정 (Rust로 작성되어 훨씬 빠르고 설정이 단순함).

### 2026-11-21 (노트북)
- Tailwind CSS v4 설치. `vite.config.ts`에 플러그인 추가, `src/index.css`에 `@import 'tailwindcss'` 한 줄 추가.
  - v4는 `tailwind.config.js`, `postcss.config.js`가 필요 없다. 설정 파일이 줄어든 만큼 이해할 것도 줄었다.
  - 확인: 빌드 결과 CSS가 0KB → 약 6.8KB로 늘었고, 실제로 쓴 클래스(`min-h-dvh` 등)만 들어갔다.
- `.claude/launch.json` 추가: Claude 앱에서 개발 서버(`npm run dev`)를 띄우는 설정.
- 노트북에 `safe.directory` 설정 후 첫 커밋. (데스크탑은 아직 설정 안 함)
- `.gitattributes`로 줄바꿈을 LF로 통일.
- GitHub 연결. GitHub에서 저장소를 만들 때 README가 함께 생성돼 기록이 둘로 갈라졌고, merge로 합쳤다.
  - rebase를 먼저 시도했지만, Claude 앱이 열어 둔 `.claude/` 폴더를 Git이 다시 쓰지 못해 중단됐다. 그래서 rebase를 취소하고, 폴더를 건드리지 않는 merge로 바꿨다.
  - 교훈: 이미 로컬에 커밋이 있으면 GitHub 저장소는 README 없이 빈 저장소로 만든다.
- AI 활용을 숨기지 않고 공개하기로 결정. README에 프로젝트 소개와 "AI 활용 방식"을 작성했다.
- 0단계 도구(React, TS, Vite, 린터, Tailwind)를 모른 채 넘어왔다는 점을 깨닫고, `docs/learning/01-project-setup.md` 학습 노트를 만들었다.
  - 확인 질문에 답하고 검토받음 (학습 노트 맨 아래).

### 2026-11-21 (노트북, 이어서)
- PWA 설정: `vite-plugin-pwa`로 manifest와 Service Worker 자동 생성.
- 앱 아이콘: Vite 로고를 위치 핀 + 동선 그림(`public/favicon.svg`)으로 교체하고, `@vite-pwa/assets-generator`로 크기별 PNG 생성 (`npm run generate-pwa-assets`).
- 확인: `npm run preview`에서 Service Worker `activated`, 캐시 12개 파일, **서버를 꺼도 화면이 뜨는 것**(오프라인)까지 확인.
- `npm audit` 경고 4건(moderate): `vite-plugin-pwa` → `workbox-build` → `glob`, `minimatch`. **빌드할 때만 쓰는 개발 도구**라 사용자에게 배포되는 코드에는 포함되지 않는다. `npm audit fix --force`는 플러그인을 구버전(1.1.0)으로 내려 오히려 Vite 8과 호환이 깨지므로 하지 않았다. 플러그인 업데이트 때 다시 확인한다.
- 학습 노트 `docs/learning/02-pwa.md` 작성.
  - 확인 질문에 답하고 검토받음. 4번(dev와 preview 차이)과 5번(maskable 여백)은 다시 정리하기.
- 협업 방식 결정: 여자친구가 기획과 Figma 디자인을 맡는다. 협업 문서는 노션에 두고, 원본은 `docs/collab/notion-page.md`.
  - 할 일: 협업 페이지를 노션에 붙여 넣고 여자친구에게 공유.
- Vercel 배포. GitHub 저장소를 연결해 push하면 자동 배포되도록 설정.
  - 첫 배포가 끝나지 않는 문제: 로그에 `Network: use --host to expose`(개발/미리보기 서버 메시지)가 떠 있었다. Build Command가 서버를 켜는 명령으로 잡혀 있던 것으로 보고, `npm run build`로 바로잡아 해결.
  - 배포 사이트 확인: HTTPS, Service Worker activated, manifest와 아이콘 정상, `sw.js` 캐시 헤더 `max-age=0, must-revalidate`.
  - 학습 노트 `docs/learning/03-deploy.md` 작성.
- `autoUpdate` 설명 정정: 새로고침은 하지 않고, 새 버전은 "다음에 열 때" 보인다 (빌드 결과물로 확인). `02-pwa.md`에 정정 표시.
- 앱 이름을 **노트립 (Note-Trip)**으로 결정. manifest, 페이지 제목, 화면 제목, README, 협업 페이지 제목에 반영.
  - GitHub 저장소 이름, Vercel 주소, package.json 이름은 `travel-platform` 그대로 둔다 (사용자에게 보이지 않는 내부 이름).
  - 아이콘은 여자친구 디자인을 받으면 `public/favicon.svg` 교체 후 `npm run generate-pwa-assets`. 아이폰은 홈 화면에서 지우고 다시 추가해야 반영됨.
- `03-deploy.md` 확인 질문에 답하고 검토받음. 3번(install, CDN 단계)과 5번(왜 옛 버전에 갇히는지)은 다시 정리하기.
  - **다음 할 일: 여자친구 기획 답변 받기 → 1단계(로그인) 시작. 로그인 화면 디자인이 필요하다.**

### 2026-11-22 (노트북)
- 1단계 준비: 디자인 없이 할 수 있는 Supabase 연결부터 시작.
  - `@supabase/supabase-js` 설치, `src/lib/supabase.ts`(연결 객체 하나), `src/vite-env.d.ts`(환경 변수 타입), `.env.example`(필요한 변수 양식).
  - 학습 노트 `docs/learning/04-supabase.md` 작성.
- Supabase 프로젝트 `note-trip` 생성 (Free, Seoul 리전), `.env.local`에 주소와 publishable key 입력.
  - 연결 테스트: 올바른 키 → 200, 틀린 키 → 401. 앱의 `supabase.ts`로 `trips` 테이블을 조회하자 "테이블 없음"(PGRST205)이 돌아옴 → **연결은 성공**, 테이블은 아직 안 만듦.
  - 현재 로그인 방식은 이메일만 켜져 있음 (구글, 카카오는 꺼짐).
- `04-supabase.md` 확인 질문에 답하고 검토받음. 1번(프론트/백엔드 기준)과 5번(RLS 원리) 다시 정리하기.
  - 화면에서 처음 `supabase`를 쓸 때 Vercel에도 환경 변수를 넣어야 한다.

- 화면 이동 뼈대: React Router 8 설치.
  - `src/app/router.tsx`(주소 ↔ 화면 지도), `RootLayout`(공통 틀 + **임시 메뉴**), `NotFoundPage`, 빈 페이지 3개(`/`, `/trips/:tripId`, `/login`). `App.tsx`는 삭제.
  - `vercel.json`: 주소로 직접 들어와도 404가 안 나게 모든 주소를 `index.html`로(rewrites). 빌드 설정도 코드로 고정.
  - 확인: 메뉴 이동 시 페이지를 다시 받지 않음, 주소 직접 입력, 없는 주소 안내 화면 모두 정상. JS 번들 약 69KB → 100KB(gzip).
  - 설계 문서 폴더 구조에 `pages/` 추가. 학습 노트 `docs/learning/05-routing.md` 작성.
  - 배포 사이트 확인: `/login`, `/trips/osaka-2026`, 없는 주소를 직접 열어도 정상. `sw.js`, manifest, 아이콘은 원래 파일 그대로 나옴.
  - `05-routing.md` 확인 질문에 답하고 검토받음. 3번(Outlet), 4번(:tripId의 뜻), 5번(직접 접속 시 404 이유) 다시 정리하기.
  - 로그인 방식 결정 (여자친구 답변): **이메일, 카카오, 구글, 네이버**.
    - Supabase 기본 지원: 이메일, 구글, 카카오. **네이버는 기본 지원이 없어** "커스텀 OAuth 공급자"로 직접 연결해야 한다 (가장 복잡, 마지막에).
    - 카카오, 구글, 네이버는 각 개발자 사이트에 앱 등록이 필요하다 (직접 해야 함).
    - App Store 출시 때는 소셜 로그인이 있으면 Apple 로그인도 필요 (설계 문서 8절).
- **앱 아이콘을 여자친구 디자인으로 교체** (남색 그라데이션 + 흰 문서 + 비행기).
  - 원본 `public/app-icon.png`. 생성 설정은 여백 없이(`padding: 0`), maskable 아이콘은 `scripts/make-maskable-icon.mjs`로 따로 생성. 상단 바 색 `#2c4388`.
  - 원 모양으로 잘리는 경우까지 이미지로 렌더링해서 확인. 자세한 내용은 `02-pwa.md` 끝의 "추가" 절.
  - 아이폰은 홈 화면에서 지우고 다시 추가해야 새 아이콘이 보인다.

- 이메일 로그인은 **비밀번호 방식**으로 결정.
- 로그인 상태 관리 + 이메일 로그인 구현.
  - `AuthContext`/`AuthProvider`/`useAuth`(onAuthStateChange 구독), `app/providers.tsx`, `RequireAuth`(보호된 라우트), `auth/api.ts`(로그인, 가입, 로그아웃, 한국어 오류), 로그인/가입 화면(임시 디자인), 메뉴에 이메일과 로그아웃.
  - 확인: 로그아웃 상태로 `/trips/osaka-2026` 접속 → `/login`으로 이동하며 원래 주소 기억. 틀린 비밀번호 → "이메일 또는 비밀번호가 올바르지 않아요." 표시. JS 번들 약 157KB(gzip).
  - Supabase URL 설정: Site URL = 배포 주소, Redirect URLs = 배포 주소 + `http://localhost:5173`.
  - 정욱 이메일로 실제 가입(확인 메일) → 로그인 테스트 완료.
  - Vercel 환경 변수 2개 추가 (타입 Config: 브라우저로 나가는 공개 값이라 Secret으로 숨길 이유가 없음). `VITE_` + `key` 이름 경고는 값이 `sb_publishable_`임을 확인하고 Mark as Safe.
  - 학습 노트 `docs/learning/06-auth.md` 작성.
- 06-auth.md 확인 질문에 답하고 검토받음. 단답형이 어렵다는 피드백 → **앞으로 확인 질문은 객관식**(CLAUDE.md에 규칙 추가). 06에 객관식 복습 3문제 추가.
- 구글 로그인 코드: `api.ts`에 `signInWithGoogle(redirectPath)`, 로그인 화면에 "Google로 계속하기" 버튼(임시). 학습 노트 `07-oauth.md`.
  - Google Cloud 프로젝트 `note-trip`, OAuth 클라이언트 `note-trip-web (Supabase)` 생성 (웹 애플리케이션, 리디렉션 URI = Supabase `/auth/v1/callback`). 테스트 사용자에 정욱, 여자친구 추가.
  - Supabase에 Google 공급자 켜고 Client ID/Secret 입력. **Secret은 Supabase에만** 보관 (저장소, Vercel, 노션에 두지 않음).
  - Redirect URLs를 `https://travel-platform-sigma.vercel.app/**`, `http://localhost:5173/**`로 변경.
  - **구글 로그인 테스트 완료.**
  - 06-auth.md 객관식 복습 3문제 모두 정답.
  - 07-oauth.md 객관식 5문제 모두 정답.
- 카카오 로그인 코드: `signInWithGoogle` → `signInWithSocial(provider)`로 합침, 로그인 화면에 카카오 버튼(맨 위, #FEE500), 메뉴는 이메일이 없으면 이름 표시. 학습 노트는 `07-oauth.md` 끝에 추가(객관식 3문제).
  - 카카오 설정: 앱 `노트립`, 카카오 로그인 ON, 리다이렉트 URI = Supabase callback, Client Secret 활성화(Supabase에만 보관). 동의항목: 닉네임(필수), 프로필 사진(선택), 이메일(선택). OpenID Connect는 OFF(지금 방식엔 불필요, 앱 출시 때 재검토).
  - 첫 테스트에서 **KOE205**: Supabase가 이메일(account_email)을 항상 요청하는데 동의항목에 없어서. → 본인 인증 후 **개인 개발자 비즈 앱 전환**(사업자등록번호 불필요) → 이메일 동의항목 켬 → 로그인 성공.
  - Supabase "Allow users without an email"은 ON 유지 (이메일 없는 카카오 계정 대비).
  - 🐛 (고침, 확인 완료) 로그인 후 메뉴에 이름이 안 보임: 이메일이 없으면 Supabase가 email을 빈 문자열("")로 주는데 `??`는 빈 문자열에서 멈춤 → `||`로 바꾸고 `features/auth/displayName.ts`로 분리.
  - **카카오 로그인 완료.** 다음 할 일: 07-oauth.md Q6~Q8 답하기 → 네이버 로그인.
  - 📌 나중에: 카카오 **연결 해제 웹훅** 처리 (회원 탈퇴 기능 Z-2 만들 때, Edge Function 필요).

### 2026-11-23 (데스크탑)
- 데스크탑에 `safe.directory` 설정. 이 컴퓨터에서는 USB가 **E 드라이브**로 잡혀서 `E:/관광플랫폼`으로 등록했다.
- `07-oauth.md` Q6~Q8 모두 정답. 오답이 너무 쉬웠던 점을 보완하려고 보충 문제 S1~S3(그럴듯한 오답 포함)을 추가했다.
  - S1~S3 모두 정답 (2026-11-24). 정답이 모두 ②였던 출제 실수를 발견해, CLAUDE.md에 "정답 위치 섞기" 규칙을 추가했다.
  - **다음 할 일: 네이버 로그인(커스텀 OAuth 공급자).**

### 2026-11-24 (데스크탑)
- 네이버 로그인 작업 시작.
  - 네이버는 Supabase 기본 공급자가 아니어서 대시보드 Custom Providers에 OAuth2로 등록했다. 코드에서는 `custom:naver`로 부르고, 로그인 화면에 네이버 버튼(임시 디자인)을 달았다. 네이버가 localhost에서 시작한 로그인을 막아서 배포 사이트에서 테스트한다.
  - 🐛 소셜 로그인이 실패해도 화면에는 이유가 안 보이던 문제를 고쳤다(`oauthRedirectError.ts`). 오류 내용을 앱이 시작할 때 읽어 두고 로그인 화면에 보여 준다.
  - 테스트에서 "missing provider id" 오류가 났다. 네이버는 사용자 id를 `response` 안에 감싸서 주는데, Supabase는 맨 바깥의 `sub`를 찾기 때문이다. → 모양만 바꿔 주는 Edge Function `supabase/functions/naver-userinfo`를 만들었다. 비밀 값은 쓰지 않는다.
  - `supabase/.temp/`(이 기기의 CLI 캐시, 연결된 프로젝트 정보)는 `.gitignore`에 넣었다.
  - **다음 할 일:** 함수 배포 상태 확인 → 대시보드의 네이버 UserInfo URL을 이 함수 주소로 바꾸고 다시 테스트.

### 2026-11-25 (노트북)
- 함수 배포 확인: 토큰 없이 부르면 함수가 직접 `missing_token`(401)으로 답하고(`verify_jwt = false` 적용됨), 가짜 토큰이면 네이버의 거절(401)을 그대로 전한다.
- 대시보드 네이버 설정 수정: Userinfo URL을 함수 주소로 바꿨다. 수동 설정인데도 필수인 Issuer URL은 네이버 공개 설정 문서(`/.well-known/openid-configuration`)에서 확인해 `https://nid.naver.com`을 넣었다. JWKS URI는 404가 나던 `/.well-known/jwks.json`을 `https://nid.naver.com/oauth2/jwks`로 고쳤다.
- 노트북 크롬에 Service Worker가 저장한 옛 버전(11-22 뼈대)이 떠서 `Ctrl + Shift + R`로 해결했다. 서버에는 최신 버전이 있었다.
- **네이버 로그인 성공.** 메뉴에 네이버 이름이 보인다. → 로그인 방식 4개(이메일, 구글, 카카오, 네이버) 모두 완료.
- `07-oauth.md`에 네이버 내용과 객관식 Q9~Q13 추가.
  - **다음 할 일:** Q9~Q13 답하기 → 로그인 화면 디자인 받기(지금 버튼은 임시 디자인).
  - 📌 나중에: 새 버전 안내(`vite-plugin-pwa`의 `prompt` 모드) 검토. 옛 버전에 갇히는 문제를 실제로 겪었다.
- 피그마 "UI/UX" 페이지의 "회원가입" 레이어 확인: 로딩 → 소개 → 회원가입, 화면 3개. 결정한 것:
  - 로딩 화면: 로그인 상태를 확인하는 동안만 보여 주고, 최소 0.5~1초.
  - 소개 화면: 처음 한 번 + 로그인 안 된 사람에게만.
  - "이미 가입했어요!" → 이메일 로그인 화면. 이메일 가입·로그인 화면 디자인은 아직 없음(빈 프레임).
  - 소셜 버튼은 각 회사 가이드를 따른다. 확인 결과(2026-11-25): 카카오는 노란 배경(#FEE500)과 검은 말풍선이 의무이고 문구는 "카카오 로그인"으로 정해져 있다. 네이버는 녹색(#03A94D) 배경을 권장한다(지금 코드의 #03C75A는 옛 색). 흰 배경도 허용하지만, 다른 버튼에 색이 있으면 흰 배경을 쓰지 말라고 한다. 문구는 바꿀 수 있다. 구글은 흰 배경 + 회색 테두리(#747775)가 맞고, 문구 번역을 허용한다.

## 기기 간 이동 시 주의
- 프로젝트는 USB에 있어서 두 기기가 같은 파일을 쓴다. 그래도 Git과 GitHub를 쓰는 이유:
  - **백업**: USB는 분실, 고장, 안전 제거 없이 뽑았을 때의 파일 손상 위험이 있다.
  - **되돌리기**: 커밋 단위로 이전 상태로 돌아갈 수 있다.
  - **배포**: Vercel은 GitHub 저장소에 push할 때 자동 배포한다.
  - **포트폴리오**: 채용 담당자는 GitHub의 커밋 기록으로 작업 과정을 본다.
- USB 드라이브 문자는 기기마다 다를 수 있다 (노트북 D, 데스크탑 E). `safe.directory`는 그 기기에서 보이는 경로로 등록한다.
- USB를 뽑을 때는 개발 서버를 끄고 "하드웨어 안전 제거"를 한다.
- `node_modules/`, `dist/`는 Git에 올리지 않는다(`.gitignore`). USB 안에는 남아 있으므로 같은 OS(Windows)끼리는 그대로 쓰면 된다. 다른 OS에서 열면 `npm install`을 다시 실행한다.
