import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './app/router'
import './index.css'

// 앱의 시작점. index.html의 <div id="root"> 안에 React 앱을 붙인다.
// 예전에는 <App />을 바로 그렸지만, 이제는 라우터가 주소를 보고 어떤 화면을 그릴지 정한다.
// (App.tsx는 router.tsx와 각 페이지 파일로 역할이 옮겨져서 삭제했다.)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
