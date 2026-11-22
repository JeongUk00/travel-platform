import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

// PWA 아이콘 생성 설정.
// public/app-icon.png(디자이너가 준 1024×1024 원본) 하나로, 기기별로 필요한 아이콘을 자동으로 만든다.
//   - pwa-64x64.png, pwa-192x192.png, pwa-512x512.png : 안드로이드 홈 화면, 설치 화면용
//   - maskable-icon-512x512.png : 안드로이드가 원, 둥근 사각형 등으로 잘라 쓰는 아이콘
//   - apple-touch-icon-180x180.png : 아이폰 홈 화면용
//   - favicon.ico : 브라우저 탭
// 원본을 바꾸면 `npm run generate-pwa-assets`만 다시 실행하면 된다.
// (생성된 파일은 원본과 같은 폴더(public/)에 만들어진다. 그래서 원본도 public/에 둔다.)
//
// padding: 0 인 이유
//   이 원본은 배경(그라데이션)이 가장자리까지 꽉 찬 디자인이다.
//   기본 설정처럼 여백을 넣으면 여백이 단색으로 채워져서 그라데이션과 색이 어긋난 띠가 생긴다.
//   대신 안드로이드가 원 모양으로 자르면 문서 모양의 모서리가 살짝 잘릴 수 있다. (생성 후 직접 확인함)
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, padding: 0 },
    apple: { ...minimal2023Preset.apple, padding: 0 },
  },
  images: ['public/app-icon.png'],
})
