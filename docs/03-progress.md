# 03. 진행 기록

> 노트북과 데스크탑을 오가며 작업하므로, 어디까지 했는지를 여기에 남긴다.
> 새 기기에서 시작할 때 이 파일부터 읽는다.

## 현재 위치: 0단계 (세팅) 완료 → 1단계 (로그인) 준비

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

## 기기 간 이동 시 주의
- 프로젝트는 USB에 있어서 두 기기가 같은 파일을 쓴다. 그래도 Git과 GitHub를 쓰는 이유:
  - **백업**: USB는 분실, 고장, 안전 제거 없이 뽑았을 때의 파일 손상 위험이 있다.
  - **되돌리기**: 커밋 단위로 이전 상태로 돌아갈 수 있다.
  - **배포**: Vercel은 GitHub 저장소에 push할 때 자동 배포한다.
  - **포트폴리오**: 채용 담당자는 GitHub의 커밋 기록으로 작업 과정을 본다.
- USB를 뽑을 때는 개발 서버를 끄고 "하드웨어 안전 제거"를 한다.
- `node_modules/`, `dist/`는 Git에 올리지 않는다(`.gitignore`). USB 안에는 남아 있으므로 같은 OS(Windows)끼리는 그대로 쓰면 된다. 다른 OS에서 열면 `npm install`을 다시 실행한다.
