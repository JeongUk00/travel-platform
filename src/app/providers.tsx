import type { ReactNode } from 'react'
import { AuthProvider } from '../features/auth/AuthProvider'

// 앱 전체를 감싸는 "공급자(Provider)"들을 한곳에 모은다. (설계 문서 3절의 app/providers.tsx)
// 지금은 로그인 상태 하나뿐이지만, 2단계에서 서버 데이터 관리(TanStack Query)가 여기에 추가된다.
// main.tsx에 Provider를 줄줄이 쌓는 대신 이 파일에 모아 두면 순서와 목록을 한눈에 볼 수 있다.
export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
