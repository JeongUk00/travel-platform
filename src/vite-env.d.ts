/// <reference types="vite/client" />

// import.meta.env에 어떤 환경 변수가 있는지 TypeScript에게 알려 주는 파일.
// 이게 없으면 import.meta.env.VITE_SUPABASE_URL의 타입을 몰라서 자동 완성이 안 되고,
// 변수 이름을 잘못 써도(VITE_SUPABSE_URL처럼) 오류로 잡아 주지 않는다.
// .d.ts = 실제 코드 없이 "타입 정보만" 담는 파일이다.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
