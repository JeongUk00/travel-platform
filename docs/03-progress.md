# 03. 진행 기록

> 노트북과 데스크탑을 오가며 작업하므로, 어디까지 했는지를 여기에 남긴다.
> 새 기기에서 시작할 때 이 파일부터 읽는다.

## 현재 위치: 0단계 (세팅) 진행 중

### 0단계 체크리스트
- [x] Vite + React + TypeScript 프로젝트 생성, 기본 템플릿 정리
- [x] 린터 oxlint 설정 (`npm run lint`)
- [x] Tailwind CSS 연결 (`@tailwindcss/vite` 플러그인)
- [x] 첫 커밋
- [ ] GitHub 저장소 연결 & push (백업, 배포, 포트폴리오)
- [ ] PWA 설정 (`vite-plugin-pwa`: manifest, 아이콘, Service Worker)
- [ ] Vercel 배포 → 폰에서 "홈 화면에 추가" 테스트

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

## 기기 간 이동 시 주의
- 프로젝트는 USB에 있어서 두 기기가 같은 파일을 쓴다. 그래도 Git과 GitHub를 쓰는 이유:
  - **백업**: USB는 분실, 고장, 안전 제거 없이 뽑았을 때의 파일 손상 위험이 있다.
  - **되돌리기**: 커밋 단위로 이전 상태로 돌아갈 수 있다.
  - **배포**: Vercel은 GitHub 저장소에 push할 때 자동 배포한다.
  - **포트폴리오**: 채용 담당자는 GitHub의 커밋 기록으로 작업 과정을 본다.
- USB를 뽑을 때는 개발 서버를 끄고 "하드웨어 안전 제거"를 한다.
- `node_modules/`, `dist/`는 Git에 올리지 않는다(`.gitignore`). USB 안에는 남아 있으므로 같은 OS(Windows)끼리는 그대로 쓰면 된다. 다른 OS에서 열면 `npm install`을 다시 실행한다.
