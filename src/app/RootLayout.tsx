import { NavLink, Outlet } from 'react-router'

// 모든 화면이 공유하는 바깥 틀(레이아웃).
// <Outlet />은 "지금 주소에 맞는 자식 화면이 들어갈 자리"다.
// 주소가 바뀌면 Outlet 안만 바뀌고, 바깥 틀은 그대로 유지된다. (페이지 전체를 새로 받지 않음)
//
// ⚠️ 아래 nav는 화면 이동을 확인하기 위한 임시 메뉴다.
//    실제 메뉴 모양(하단 탭바 등)은 디자인을 받으면 교체한다.
export function RootLayout() {
  return (
    <div className="min-h-dvh bg-slate-50">
      <nav className="flex gap-4 border-b border-slate-200 bg-white px-6 py-3 text-sm">
        {/* <a href> 대신 NavLink를 쓰는 이유:
            <a>는 클릭하면 서버에서 페이지를 통째로 다시 받는다(느리고, 앱 상태가 초기화됨).
            NavLink는 주소만 바꾸고 화면은 React가 그 자리에서 바꾼다.
            또 지금 주소와 같은 링크에는 isActive가 true가 되어 "현재 위치" 표시를 할 수 있다. */}
        {[
          { to: '/', label: '여행 목록' },
          { to: '/trips/sample-trip', label: '여행 상세(예시)' },
          { to: '/login', label: '로그인' },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end // "/"가 모든 주소의 앞부분이라 항상 활성화되는 것을 막는다 (정확히 같을 때만 활성)
            className={({ isActive }) =>
              isActive ? 'font-bold text-sky-700' : 'text-slate-500'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
