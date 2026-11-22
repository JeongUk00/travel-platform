import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../useAuth'

// "로그인해야 볼 수 있는 화면"을 지키는 문지기. (보호된 라우트, Protected Route)
// router.tsx에서 보호할 화면들을 이 컴포넌트의 자식으로 넣는다.
//
// ⚠️ 이건 "화면을 숨기는" 장치일 뿐, 보안 장치가 아니다.
//    프론트엔드 코드는 사용자가 마음대로 고칠 수 있으므로 이 검사는 얼마든지 우회할 수 있다.
//    진짜로 남의 데이터를 못 보게 막는 것은 DB의 RLS다. (학습 노트 04, 06 참고)
//    이 컴포넌트의 목적은 "로그인 안 한 사람에게 빈 화면 대신 로그인 화면을 보여주는" 사용자 경험이다.
export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()

  // 아직 "로그인했었나?" 확인 중. 이때 바로 로그인 화면으로 보내면
  // 이미 로그인한 사람도 새로고침할 때마다 로그인 화면이 깜빡 보였다가 돌아온다.
  if (loading) {
    return <p className="text-slate-500">로그인 상태를 확인하는 중…</p>
  }

  if (!session) {
    // replace: 기록을 "교체"한다. 안 그러면 로그인 화면에서 뒤로 가기를 눌렀을 때
    //          다시 보호된 화면 → 다시 로그인 화면으로 튕기는 무한 반복이 생긴다.
    // state.from: 원래 가려던 주소를 들고 간다. 로그인이 끝나면 그 화면으로 돌려보낸다.
    //             (카톡으로 받은 여행 링크 → 로그인 → 바로 그 여행 화면)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
