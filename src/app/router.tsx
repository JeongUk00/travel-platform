import { createBrowserRouter } from 'react-router'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { TripDetailPage } from '../features/trips/pages/TripDetailPage'
import { TripListPage } from '../features/trips/pages/TripListPage'
import { NotFoundPage } from './NotFoundPage'
import { RootLayout } from './RootLayout'

// 앱의 "지도": 어떤 주소(URL)일 때 어떤 화면을 보여줄지 한곳에 모아 둔 파일.
// 화면이 늘어나도 이 파일만 보면 앱 전체 구조를 알 수 있다.
//
// 왜 createBrowserRouter(객체로 적는 방식)인가?
//   버린 대안: <BrowserRouter><Routes><Route .../></Routes></BrowserRouter>처럼 JSX로 적는 방식.
//   둘 다 동작하지만, 객체 방식은 라우트 목록이 "데이터"라서 한눈에 보기 쉽고,
//   나중에 "로그인 안 했으면 /login으로 보내기" 같은 공통 처리를 붙이기 편하다.
export const router = createBrowserRouter([
  {
    // 모든 화면이 공유하는 바깥 틀. 자식 화면은 RootLayout 안의 <Outlet /> 자리에 들어간다.
    path: '/',
    Component: RootLayout,
    children: [
      // index: 부모 주소("/") 그대로일 때 보여줄 화면.
      // 나중에(4단계) "여행 중이면 오늘 화면, 아니면 여행 목록"으로 바꾼다. (요구사항 D-1)
      { index: true, Component: TripListPage },
      // :tripId는 "이 자리에 아무 값이나 올 수 있다"는 뜻 (동적 세그먼트).
      // /trips/abc면 tripId = "abc". 여행마다 화면 파일을 따로 만들 필요가 없다.
      { path: 'trips/:tripId', Component: TripDetailPage },
      { path: 'login', Component: LoginPage },
      // *: 위의 어떤 주소에도 해당하지 않을 때. 잘못된 링크를 눌러도 빈 화면 대신 안내를 보여준다.
      { path: '*', Component: NotFoundPage },
    ],
  },
])
