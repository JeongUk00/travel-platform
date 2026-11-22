import { useContext } from 'react'
import { AuthContext } from './AuthContext'

// 어느 화면에서든 `const { user, loading } = useAuth()`로 로그인 상태를 꺼내 쓰는 훅.
//
// 왜 useContext(AuthContext)를 화면에서 바로 쓰지 않고 한 번 감싸나?
//   1) AuthProvider 밖에서 쓰는 실수를 여기서 한 번에 잡아 분명한 오류를 낸다.
//   2) 화면 코드는 "Context로 구현했다"는 사실을 몰라도 된다. 나중에 구현을 바꿔도 화면은 그대로다.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 쓸 수 있습니다.')
  }
  return context
}
