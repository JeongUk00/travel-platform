// 앱의 최상위 화면 컴포넌트.
// 지금은 세팅이 잘 됐는지 확인하는 용도로만 쓴다.
// 다음 단계에서 React Router를 붙이면 이 자리를 라우터가 대신한다 (docs/02-design.md 3절의 app/router.tsx).
//
// className 안의 단어들이 Tailwind 유틸리티 클래스다. 예:
//   min-h-dvh  : 높이를 최소 화면 높이만큼 (dvh = 모바일 주소창 높이 변화까지 반영한 화면 높이)
//   p-6        : 안쪽 여백 1.5rem
//   text-2xl   : 글자 크기
// 모바일 우선 설계라서 기본 클래스는 폰 화면 기준이고, 큰 화면용은 나중에 md: 같은 접두사로 덧붙인다.
function App() {
  return (
    <main className="min-h-dvh bg-slate-50 p-6">
      <h1 className="text-2xl font-bold text-slate-900">노트립</h1>
      <p className="mt-2 text-slate-500">0단계 세팅 중 · Tailwind 연결됨</p>
    </main>
  )
}

export default App
