import { useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../features/auth/useAuth'
import { SplashScreen } from '../features/onboarding/components/SplashScreen'

// 로딩 화면을 "최소 이 시간"만큼은 보여 준다. (2026-11-25 결정: 0.5~1초)
// 왜 최소 시간이 필요한가?
//   로그인 상태 확인은 빠르면 0.05초 만에 끝난다. 그러면 로딩 화면이 "번쩍"하고 사라져서
//   오히려 화면이 깜빡이는 것처럼 보인다. 그래서 짧더라도 로고를 알아볼 만큼은 보여 준다.
// 왜 1~2초를 일부러 붙잡지 않나? (처음 디자인 의도)
//   앱을 열 때마다 기다리게 되어, 자주 쓰는 사람일수록 답답하다.
//   "할 일이 있는 동안 보여 주고, 너무 짧으면 조금만 늘린다"가 이 컴포넌트의 규칙이다.
const SPLASH_MIN_MS = 800

// 앱이 켜질 때 한 번, 로그인 상태 확인이 끝날 때까지 로딩 화면을 보여 주는 "문".
// main.tsx에서 라우터 바깥을 감싼다.
//
// 왜 라우터 바깥인가? (버린 대안: 화면(라우트)마다 로딩 처리)
//   로딩 화면은 "어느 주소로 들어왔든" 앱을 켤 때 한 번 나와야 한다.
//   주소별로 처리하면 여행 링크로 바로 들어온 경우 등을 빠뜨리기 쉽다.
//   또 확인이 끝난 뒤에 라우터를 그리므로, 그 안의 화면들은 "확인 중" 상태를 신경 쓰지 않아도 된다.
export function SplashGate({ children }: { children: ReactNode }) {
  const { loading } = useAuth()
  const [minTimePassed, setMinTimePassed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), SPLASH_MIN_MS)
    // 정리 함수: 시간이 되기 전에 이 컴포넌트가 사라지면 타이머도 취소한다.
    return () => clearTimeout(timer)
  }, [])

  // 두 조건이 모두 끝나야 넘어간다.
  //   - 확인이 0.1초에 끝나도 → 0.8초까지 로딩 화면
  //   - 확인이 3초 걸려도(느린 인터넷) → 3초 동안 로딩 화면 (빈 화면이나 잘못된 화면 대신)
  if (loading || !minTimePassed) {
    return <SplashScreen />
  }

  return children
}
