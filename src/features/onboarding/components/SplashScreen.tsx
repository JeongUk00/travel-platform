import logoBg from '../../../assets/brand/logo-bg.svg'
import logoMark from '../../../assets/brand/logo-mark.svg'

// 로딩 화면 (피그마: UI/UX > 회원가입 > 첫 번째 "첫 화면", node 19:172)
// 남색 그라데이션 위에 로고(아이콘 + "Note-Trip")와 아래쪽 작은 글자.
//
// 보여 주는 시점과 시간은 이 컴포넌트가 아니라 app/SplashGate.tsx가 정한다.
// 이 파일은 "어떻게 생겼나"만, SplashGate는 "언제 보이나"만 책임진다. (역할 나누기)
export function SplashScreen() {
  return (
    // fixed inset-0: 화면 전체를 덮는다.
    // bg-linear-to-b from-… to-…: 위(#2c4388)에서 아래(#1a2b5f)로 가는 그라데이션 (피그마 값)
    // role="status" + aria-label: 화면 낭독기에 "불러오는 중"이라는 상태를 알린다. (그림만 있는 화면이라서)
    <div
      role="status"
      aria-label="노트립을 불러오는 중"
      className="fixed inset-0 flex items-center justify-center bg-linear-to-b from-brand-700 to-brand-900"
    >
      {/* 로고: 아이콘과 글자 사이 간격 12.9px (피그마 값) */}
      <div className="flex items-center gap-[12.932px]">
        {/* 아이콘은 피그마에서 받은 SVG 두 장(네모 배경 + 흰 문서 모양)을 겹친 것.
            relative + absolute: 두 그림을 같은 자리에 겹쳐 놓는 방법.
            크기는 SVG 파일 안의 width/height(77.9px, 53.1×63.0px)를 그대로 쓴다. */}
        <div className="relative shrink-0">
          <img src={logoBg} alt="" className="block" />
          <img src={logoMark} alt="" className="absolute top-[7.46px] left-1/2 -translate-x-1/2" />
        </div>
        {/* 로고 글자. 피그마: Nunito Black 50.926px, 자간 -1.0185px(-2%) */}
        <p className="font-logo text-[50.926px] leading-normal font-black tracking-[-1.0185px] text-white">
          Note-Trip
        </p>
      </div>

      {/* 아래쪽 작은 글자. 피그마 기준 화면 아래에서 약 68px 위 */}
      <p className="absolute bottom-[68px] left-1/2 -translate-x-1/2 text-[10.187px] tracking-[-0.2037px] text-white">
        @buducompany.co.kr
      </p>
    </div>
  )
}
