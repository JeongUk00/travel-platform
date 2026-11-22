import { Link } from 'react-router'

// 없는 주소로 들어왔을 때 보여줄 화면. (router.tsx의 path: '*')
// 특정 기능에 속하지 않아서 features/가 아니라 app/에 둔다.
export function NotFoundPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-slate-500">주소가 잘못되었거나 삭제된 페이지예요.</p>
      <Link to="/" className="mt-4 inline-block text-sky-700 underline">
        처음으로 돌아가기
      </Link>
    </section>
  )
}
