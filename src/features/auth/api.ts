import type { AuthError } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

// 로그인 관련해서 Supabase와 직접 대화하는 함수들을 모아 둔 파일.
// 화면(LoginPage)은 supabase를 직접 부르지 않고 이 함수들만 쓴다.
// → 화면은 "무엇을 할지"만, 이 파일은 "어떻게 서버와 대화할지"만 책임진다. (관심사의 분리, 설계 문서 3절)
// → 카카오, 구글, 네이버 로그인 함수도 나중에 이 파일에 추가된다.

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(toKoreanMessage(error))
  // 성공하면 아무것도 돌려주지 않는다. 로그인 상태는 AuthProvider가 onAuthStateChange로 알아서 받는다.
}

// 반환값: 메일 인증이 필요한지 여부
//   Supabase는 기본적으로 "가입 확인 메일"의 링크를 눌러야 가입이 완료된다.
//   이때는 가입 직후 session이 비어 있으므로, 화면에 "메일을 확인해 주세요"를 보여줘야 한다.
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // 확인 메일의 링크를 누르면 돌아올 주소. 지금 열려 있는 사이트(로컬이면 localhost, 배포면 vercel 주소)로 돌아오게 한다.
    // (이 주소는 Supabase 대시보드의 Redirect URLs에 등록되어 있어야 허용된다)
    options: { emailRedirectTo: window.location.origin },
  })
  if (error) throw new Error(toKoreanMessage(error))
  return { needsEmailConfirmation: data.session === null }
}

// 우리가 지원하는 소셜 로그인 공급자.
// 문자열 대신 유니언 타입으로 정해 두면 'googel' 같은 오타를 TypeScript가 잡아 준다.
// 'custom:naver': 네이버는 Supabase 기본 지원이 아니라서, 대시보드의 Custom Providers에 직접 등록했다.
//   `custom:` 접두사는 Supabase의 약속이다. supabase-js의 Provider 타입도 `custom:${string}`을 받는다.
export type SocialProvider = 'google' | 'kakao' | 'custom:naver'

// 소셜 로그인(OAuth) 시작. 구글이든 카카오든 흐름이 똑같아서 함수 하나로 처리한다.
//   (처음엔 signInWithGoogle로 만들었다가, 카카오를 추가하면서 거의 똑같은 함수가 두 개 생기는 걸 보고 합쳤다.
//    "같은 코드가 두 번 나오면 그때 공통으로 묶는다"는 원칙. 처음부터 억지로 일반화하지 않는다)
// 이 함수는 "로그인 결과"를 돌려주지 않는다. 대신 브라우저가 공급자 로그인 페이지로 **떠난다.**
//   1) 우리 앱 → 2) 구글/카카오 로그인 화면 → 3) Supabase 서버(/auth/v1/callback)
//   → 4) redirectTo로 지정한 우리 앱 주소로 돌아옴 (주소에 로그인 정보가 붙어 있음)
//   → 5) supabase-js가 주소에서 로그인 정보를 읽어 세션 저장 → AuthProvider가 알림 받음
//
// redirectPath: 로그인 후 돌아올 화면. RequireAuth가 기억해 둔 "원래 가려던 주소"를 넘긴다.
//   (이 주소는 Supabase 대시보드의 Redirect URLs에 허용되어 있어야 한다. `/**` 와일드카드로 등록)
export async function signInWithSocial(provider: SocialProvider, redirectPath: string) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin + redirectPath },
  })
  if (error) throw new Error(toKoreanMessage(error))
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(toKoreanMessage(error))
}

// Supabase가 주는 영어 오류를 사용자가 이해할 수 있는 한국어로 바꾼다.
// error.message(영어 문장)로 비교하지 않고 error.code(고정된 식별자)로 비교하는 이유:
//   문장은 라이브러리 버전에 따라 바뀔 수 있지만, 코드는 약속된 값이라 잘 바뀌지 않는다.
function toKoreanMessage(error: AuthError): string {
  switch (error.code) {
    case 'invalid_credentials':
      // 보안상 "이메일이 없음"과 "비밀번호가 틀림"을 구분해서 알려 주지 않는다.
      // 구분해 주면 공격자가 어떤 이메일이 가입되어 있는지 알아낼 수 있기 때문이다.
      return '이메일 또는 비밀번호가 올바르지 않아요.'
    case 'email_not_confirmed':
      return '가입 확인 메일의 링크를 먼저 눌러 주세요.'
    case 'user_already_exists':
    case 'email_exists':
      return '이미 가입된 이메일이에요. 로그인해 주세요.'
    case 'weak_password':
      return '비밀번호가 너무 약해요. 6자 이상으로 정해 주세요.'
    case 'email_address_invalid':
      return '이메일 주소 형식을 확인해 주세요.'
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.'
    default:
      // 예상하지 못한 오류는 원문도 함께 남겨 디버깅할 수 있게 한다.
      console.error('[auth]', error.code, error.message)
      return '문제가 생겼어요. 잠시 후 다시 시도해 주세요.'
  }
}
