import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AppProviders } from './app/providers'
import { router } from './app/router'
import './index.css'

// 앱의 시작점. index.html의 <div id="root"> 안에 React 앱을 붙인다.
// AppProviders(로그인 상태 등)가 라우터 바깥을 감싸서, 모든 화면이 로그인 상태를 알 수 있다.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
