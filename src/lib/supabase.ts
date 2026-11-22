import { createClient } from '@supabase/supabase-js'

// Supabase(우리 앱의 백엔드)에 연결하는 객체를 만든다.
//
// 왜 이 파일 하나에서만 만드나?
//   createClient를 여러 곳에서 부르면 로그인 상태를 기억하는 객체가 여러 개 생겨서
//   "여기서는 로그인됐는데 저기서는 안 된" 것처럼 상태가 어긋날 수 있다.
//   그래서 앱 전체가 이 파일의 `supabase` 하나만 가져다 쓴다. (싱글톤 패턴)
//
// 왜 주소와 키를 코드에 직접 쓰지 않고 import.meta.env에서 읽나?
//   1) 개발용, 배포용 Supabase 프로젝트를 나눌 때 코드를 고치지 않고 값만 바꾸면 된다.
//   2) 키를 Git 기록에 남기지 않는 습관을 들이기 위해서다.
//   값은 내 컴퓨터에서는 .env.local 파일, 배포 사이트에서는 Vercel 설정 화면에 넣는다.
//   Vite는 이름이 VITE_로 시작하는 변수만 앱 코드에 넣어 준다. (실수로 비밀 값이 새는 것을 막는 장치)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 값이 비어 있으면 앱이 이상하게 동작하다가 엉뚱한 곳에서 오류가 난다.
// 시작하자마자 원인을 분명히 알려 주고 멈추는 편이 디버깅하기 쉽다. (fail fast)
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase 환경 변수가 없습니다. .env.example을 참고해 .env.local 파일을 만들어 주세요.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
