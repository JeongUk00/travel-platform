import { useParams } from 'react-router'

// 여행 상세 화면 (주소: /trips/:tripId)
// 날짜별 일정과 동선 지도가 들어갈 자리. (2단계)
export function TripDetailPage() {
  // 주소의 :tripId 자리에 들어온 값을 꺼낸다. /trips/abc → tripId = "abc"
  // 2단계에서는 이 값으로 Supabase에서 해당 여행 데이터를 불러온다.
  const { tripId } = useParams()

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">여행 상세</h1>
      <p className="mt-2 text-slate-500">
        여행 ID: <code className="rounded bg-slate-200 px-1">{tripId}</code>
      </p>
    </section>
  )
}
