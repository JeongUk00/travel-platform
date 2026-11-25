import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Vite 설정 파일. 빌드할 때 어떤 플러그인을 거칠지 정한다.
// - react(): JSX를 브라우저가 읽을 수 있는 JS로 바꾸고, 개발 중 화면을 새로고침 없이 갱신(HMR)한다.
// - tailwindcss(): 소스 코드에서 실제로 쓴 Tailwind 클래스만 찾아 CSS로 만들어 준다.
//   PostCSS 설정 파일을 따로 두는 예전 방식 대신 Vite 플러그인을 쓰는 이유는
//   설정 파일이 하나 줄고, Vite 빌드 과정에 직접 붙어서 더 빠르기 때문이다.
// - VitePWA(): 빌드할 때 PWA에 필요한 두 가지를 만들어 준다.
//   1) manifest.webmanifest : "이 웹사이트는 설치할 수 있는 앱이다"라는 신분증 (이름, 아이콘, 색)
//   2) sw.js (Service Worker) : 앱 파일을 폰에 저장해 두고, 인터넷이 없어도 앱이 열리게 하는 대리인
//   자세한 설명: docs/learning/02-pwa.md
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 새 버전을 배포하면, 앱을 열 때 Service Worker가 뒤에서 새 파일을 받아 묻지 않고 바로 교체한다.
      // (sw.js에 skipWaiting, clientsClaim이 들어감)
      // 단, 지금 열려 있는 화면은 이미 옛 코드로 떠 있으므로 새 버전은 "다음에 열 때" 보인다.
      // 화면을 즉시 새로고침하려면 virtual:pwa-register로 직접 등록해야 하는데, 지금은 필요 없어 쓰지 않는다.
      // 나중에 일정 입력 폼이 생기면 "새 버전이 있어요, 새로고침할까요?"라고 묻는 'prompt' 방식을 검토한다.
      registerType: 'autoUpdate',

      manifest: {
        name: '노트립', // 설치 화면, 앱 전환 화면에 보이는 전체 이름 (영문명 Note-Trip은 스토어 출시 때 사용)
        short_name: '노트립', // 홈 화면 아이콘 아래에 보이는 짧은 이름 (길면 잘리는데 세 글자라 그대로 씀)
        description: '여행 일정, 동선, 정산을 함께 정리하는 앱',
        lang: 'ko',
        start_url: '/', // 홈 화면 아이콘을 눌렀을 때 처음 여는 주소
        display: 'standalone', // 주소창 없이 앱처럼 전체 화면으로 연다 (핵심 설정)
        theme_color: '#2c4388', // 상단 상태 표시줄 색 (아이콘 그라데이션의 위쪽 남색)
        // 홈 화면 앱을 켜는 순간 안드로이드가 직접 그리는 시작 화면의 배경(아이콘 + 이름).
        // 그다음 우리 로딩 화면(SplashScreen, 남색 그라데이션)이 이어지므로, 같은 남색으로 맞춰
        // "흰 화면 → 남색 화면"으로 번쩍이지 않게 한다. (예전 값 #f8fafc는 로딩 화면이 없을 때 기준)
        background_color: '#2c4388',
        // 아이콘은 pwa-assets.config.ts로 생성한 파일들이다 (npm run generate-pwa-assets).
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable', // 안드로이드가 원, 둥근 사각형 등 자기 모양으로 잘라 쓰는 아이콘
          },
        ],
      },

      workbox: {
        // Service Worker가 미리 폰에 저장해 둘(precache) 파일 종류.
        // 기본값은 js, css, html뿐이라 아이콘도 오프라인에서 보이도록 이미지 확장자를 추가한다.
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // 아이콘 원본(1024px, 약 240KB)은 아이콘을 만들 때만 쓰므로 폰에 미리 저장할 필요가 없다.
        globIgnores: ['**/app-icon.png'],
      },
    }),
  ],
})
