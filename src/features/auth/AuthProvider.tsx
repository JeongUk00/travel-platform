import type { Session } from '@supabase/supabase-js'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../../lib/supabase'
import { AuthContext } from './AuthContext'

// 로그인 상태를 "한 곳에서" 관리하고 앱 전체에 나눠 주는 컴포넌트.
// main.tsx → app/providers.tsx에서 앱 전체를 감싼다.
//
// 로그인 방식(이메일, 카카오, 구글, 네이버)이 무엇이든, 로그인이 끝나면 Supabase는 같은 모양의 "세션"을 준다.
// 그래서 이 파일은 로그인 방식이 늘어나도 바뀌지 않는다.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChange: 로그인 상태가 바뀔 때마다 알려 달라고 Supabase에 "구독"을 건다.
    //   - 구독하자마자 한 번(INITIAL_SESSION): 브라우저에 저장된 세션이 있는지 알려 줌 → 새로고침해도 로그인 유지
    //   - 로그인(SIGNED_IN), 로그아웃(SIGNED_OUT), 토큰 자동 갱신(TOKEN_REFRESHED) 때마다 다시 알려 줌
    //   - 다른 탭에서 로그아웃해도 이 탭에 알려 줌
    // 버린 대안: getSession()으로 한 번만 읽기 → 이후 바뀌는 상태를 놓친다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(false)
    })

    // 정리 함수: 이 컴포넌트가 사라질 때 구독을 끊는다. 안 끊으면 구독이 쌓여 메모리가 샌다.
    // (개발 모드의 StrictMode는 일부러 마운트 → 해제 → 마운트를 해서, 정리를 빠뜨렸는지 확인시켜 준다)
    return () => subscription.unsubscribe()
  }, [])

  // useMemo: session이나 loading이 바뀔 때만 새 객체를 만든다.
  // 매번 새 객체를 만들면, 값이 같아도 이 Context를 쓰는 모든 화면이 쓸데없이 다시 그려진다.
  const value = useMemo(
    () => ({ session, user: session?.user ?? null, loading }),
    [session, loading],
  )

  // React 19부터는 <AuthContext.Provider value> 대신 <AuthContext value>로 쓸 수 있다.
  return <AuthContext value={value}>{children}</AuthContext>
}
