import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

// PWA 아이콘 생성 설정.
// public/favicon.svg 하나를 원본으로, 기기별로 필요한 PNG 아이콘을 자동으로 만든다.
//   - pwa-64x64.png, pwa-192x192.png, pwa-512x512.png : 안드로이드 홈 화면, 설치 화면용
//   - maskable-icon-512x512.png : 안드로이드가 원, 둥근 사각형 등으로 잘라 쓰는 아이콘 (가장자리에 여백 포함)
//   - apple-touch-icon-180x180.png : 아이폰 홈 화면용 (iOS는 SVG 아이콘을 지원하지 않음)
// 크기를 손으로 하나씩 만들면 원본을 바꿀 때마다 다시 해야 하므로, 명령 한 번(npm run generate-pwa-assets)으로 만든다.

// 아이콘 배경색. 여백을 흰색으로 채우면 폰이 아이콘을 동그랗게 자를 때 흰 테두리가 보이므로 같은 파란색으로 채운다.
const background = '#0284c7'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background } },
  },
  images: ['public/favicon.svg'],
})
