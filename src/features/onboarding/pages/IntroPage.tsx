import { Navigate, useLocation, useNavigate } from 'react-router'
import plane from '../../../assets/brand/plane.svg'
import { useAuth } from '../../auth/useAuth'
import { markIntroSeen } from '../introSeen'

// 소개 화면 (주소: /welcome)
// 피그마: UI/UX > 회원가입 > 두 번째 "첫 화면" (node 19:757)
// 처음 온, 로그인 안 된 사람에게 한 번 보여 준다. "여행 시작하기"를 누르면 로그인 화면으로 간다.
// 누가 언제 이 화면으로 오는지는 RequireAuth가 정한다.
export function IntroPage() {
  const { session } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // 이미 로그인한 사람이 주소를 직접 쳐서 들어온 경우: 소개할 필요가 없으니 첫 화면으로.
  if (session) {
    return <Navigate to="/" replace />
  }

  function handleStart() {
    // "봤다"는 표시는 화면이 열릴 때가 아니라 버튼을 눌렀을 때 남긴다.
    // 화면만 보고 바로 앱을 닫은 사람에게는 다음에 한 번 더 보여 주는 게 자연스럽기 때문이다.
    markIntroSeen()
    // state를 그대로 넘긴다: RequireAuth가 들려 보낸 "원래 가려던 주소(from)"를 로그인 화면까지 전달해야
    // 로그인 후 그 화면으로 돌아갈 수 있다. (카톡으로 받은 여행 링크 → 소개 → 로그인 → 그 여행)
    // replace: 로그인 화면에서 뒤로 가기를 눌렀을 때 소개 화면이 또 나오지 않게 한다.
    navigate('/login', { replace: true, state: location.state })
  }

  return (
    // min-h-dvh: 화면 높이만큼. dvh는 폰 주소창이 나타나고 사라질 때도 실제 보이는 높이에 맞춘다.
    // 피그마 프레임(393×852) 기준 위치를 화면 높이 비율로 옮겼다.
    //   글 묶음 위쪽 178px → 21dvh, 버튼 아래쪽 163px → 19dvh
    //   (픽셀로 고정하면 키가 작은 폰에서는 버튼이 화면 밖으로 밀리고, 큰 폰에서는 아래가 휑하다)
    <main className="flex min-h-dvh flex-col items-center bg-linear-to-b from-brand-700 to-brand-900 px-4 pt-[21dvh] pb-[19dvh] text-center text-white">
      {/* 피그마: Pretendard Medium, 문단 사이 67px, 자간 -2%
          gap-[min(67px,7.9dvh)]: 문단 사이는 피그마 높이(852px)에서 67px이고, 키가 작은 폰에서는 비율대로 줄인다.
          mb-7: 아래 버튼과 최소 28px은 띄운다. 처음엔 이 둘이 없어서 360×640 화면에서 글과 버튼이 붙어 버렸다. */}
      <div className="mb-7 flex flex-col items-center gap-[min(67px,7.9dvh)] font-medium">
        <p className="text-[31.034px] leading-normal tracking-[-0.6207px]">
          <strong className="font-bold">복잡한 여행 계획</strong>,
          <br />
          그동안 짜기 힘드셨죠?
        </p>
        <p className="text-[27.737px] leading-normal tracking-[-0.5547px]">
          걱정마세요
          <br />
          이제 <strong className="font-bold">Note-Trip</strong>이 도와드려요!
        </p>
        <p className="text-[27.737px] leading-normal tracking-[-0.5547px]">
          우리 이제 함께
          <br />
          <strong className="font-bold">여행 계획을 짜볼까요?</strong>
        </p>
      </div>

      {/* mt-auto: 남는 세로 공간을 모두 위쪽 여백으로 써서 버튼을 아래로 민다.
          피그마: 흰 배경 318×50, 모서리 12.7px, 비행기 아이콘 + Pretendard Bold 19.6px 검정 */}
      <button
        type="button"
        onClick={handleStart}
        className="mt-auto flex h-[50px] w-full max-w-[318px] items-center justify-center gap-[9px] rounded-[12.703px] bg-white text-[19.574px] font-bold tracking-[-0.3915px] text-black"
      >
        {/* 장식용 그림이라 alt를 비운다. 버튼의 뜻은 글자("여행 시작하기")가 이미 전한다. */}
        <img src={plane} alt="" />
        여행 시작하기
      </button>
    </main>
  )
}
