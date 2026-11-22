import type { Session, User } from '@supabase/supabase-js'
import { createContext } from 'react'

// 앱 전체가 공유하는 "로그인 상태"의 모양.
//   session : Supabase가 준 로그인 정보 (토큰 포함). 로그인 안 했으면 null
//   user    : 로그인한 사람 정보 (id, email 등). session 안에 있는 것을 꺼내 쓰기 편하게 따로 둠
//   loading : 앱이 막 켜져서 "로그인했었나?"를 아직 확인 중인지
//             이게 없으면 확인이 끝나기 전 아주 잠깐 "로그인 안 함"으로 보여서 로그인 화면으로 튕긴다.
export type AuthState = {
  session: Session | null
  user: User | null
  loading: boolean
}

// Context = 컴포넌트 트리 전체에 값을 "방송"하는 통로.
// props로 화면마다 한 단계씩 넘겨주지 않아도(prop drilling), 어느 화면에서든 꺼내 쓸 수 있다.
// 기본값 null: Provider 밖에서 쓰면 null이 나와서 실수를 바로 알 수 있다 (useAuth에서 검사).
//
// 왜 Provider 컴포넌트와 파일을 나눴나?
//   React의 빠른 새로고침(HMR)은 "컴포넌트만 내보내는 파일"에서 가장 잘 동작한다.
//   그래서 Context 객체와 타입은 이 파일에, 컴포넌트(AuthProvider)는 다른 파일에 둔다.
export const AuthContext = createContext<AuthState | null>(null)
