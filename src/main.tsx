import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AppProviders } from './app/providers'
import { router } from './app/router'
import { SplashGate } from './app/SplashGate'
// 글꼴 파일을 npm 패키지로 받아 우리 사이트에서 직접 내보낸다(셀프 호스팅).
// 버린 대안: 구글 폰트나 CDN 주소를 <link>로 걸기 → 남의 서버가 느리거나 막히면 글꼴이 늦게 뜨고,
//           사용자의 접속 정보가 그 서버로 간다. 셀프 호스팅은 우리 배포 서버(Vercel) 한 곳에서 받는다.
// dynamic-subset: 한글 글꼴은 글자가 많아 파일이 크다(수 MB). 92조각으로 나눠 두고,
//                 화면에 실제로 나온 글자가 들어 있는 조각만 브라우저가 받는다.
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
// Nunito는 로고 글자에만 쓰므로 영문(latin) 900(Black) 굵기 하나만 받는다.
import '@fontsource/nunito/latin-900.css'
import './index.css'

// 앱의 시작점. index.html의 <div id="root"> 안에 React 앱을 붙인다.
// AppProviders(로그인 상태 등)가 라우터 바깥을 감싸서, 모든 화면이 로그인 상태를 알 수 있다.
// SplashGate: 로그인 상태를 확인하는 동안 로딩 화면을 보여 주고, 끝나면 라우터(실제 화면)를 그린다.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <SplashGate>
        <RouterProvider router={router} />
      </SplashGate>
    </AppProviders>
  </StrictMode>,
)
