import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite 설정 파일. 빌드할 때 어떤 플러그인을 거칠지 정한다.
// - react(): JSX를 브라우저가 읽을 수 있는 JS로 바꾸고, 개발 중 화면을 새로고침 없이 갱신(HMR)한다.
// - tailwindcss(): 소스 코드에서 실제로 쓴 Tailwind 클래스만 찾아 CSS로 만들어 준다.
//   PostCSS 설정 파일을 따로 두는 예전 방식 대신 Vite 플러그인을 쓰는 이유는
//   설정 파일이 하나 줄고, Vite 빌드 과정에 직접 붙어서 더 빠르기 때문이다.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
