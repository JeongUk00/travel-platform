// 여행 목록 화면 (주소: /)
// 지금은 자리만 잡아 둔 빈 화면이다. 2단계에서 Supabase의 trips 테이블을 읽어 목록을 그린다.
//
// 폴더 위치: features/trips/pages/
//   - features/trips/ : "여행" 기능에 관한 것은 전부 여기 (설계 문서 3절)
//   - pages/          : 주소 하나에 대응하는 "화면 단위" 컴포넌트.
//                       화면 안의 작은 조각(카드, 버튼)은 나중에 components/에 둔다.
export function TripListPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">노트립</h1>
      <p className="mt-2 text-slate-500">여행 목록이 들어갈 자리</p>
    </section>
  )
}
