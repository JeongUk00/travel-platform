// 네이버 사용자 정보를 Supabase가 읽을 수 있는 모양으로 바꿔 주는 "통역" 함수 (Supabase Edge Function)
//
// 왜 필요한가? (2026-11-24 네이버 로그인 테스트에서 "error missing provider id" 발생)
//   Supabase는 사용자 정보 응답의 **맨 바깥**에서 사용자 id(`sub`)를 찾는다. (OIDC 표준 모양)
//   그런데 네이버는 정보를 `response` 안에 한 번 더 감싸서 준다.
//     네이버:   { "resultcode": "00", "message": "success", "response": { "id": "...", "nickname": "..." } }
//     Supabase: { "sub": "...", "nickname": "..." } 를 기대
//   Supabase 대시보드에는 이 모양을 바꿔 줄 설정 칸(attribute mapping)이 없어서,
//   중간에서 모양만 바꿔 주는 함수를 두고, 대시보드의 UserInfo URL을 네이버 대신 이 함수로 바꾼다.
//
// 흐름: Supabase Auth → (네이버 access token을 들고) 이 함수 → 네이버 /v1/nid/me → 모양 바꿔서 → Supabase Auth
//
// 왜 Edge Function인가? (버린 대안)
//   - 브라우저(우리 앱)에서 바꾸기: 불가능. 이 요청은 Supabase 서버끼리 주고받아서 브라우저를 거치지 않는다.
//   - Vercel 서버 함수: 가능하지만, 로그인 관련 서버 코드는 Supabase 한 곳에 모아 두는 편이 관리하기 쉽다.
//
// 보안: 이 함수는 비밀 값(Client Secret 등)을 전혀 쓰지 않는다.
//   받은 access token을 네이버에 그대로 전달할 뿐이라, 토큰이 없거나 틀리면 네이버가 거절한다.
//   그래서 Supabase 로그인 검사(verify_jwt) 없이 공개로 배포한다.
//   (Supabase Auth가 이 함수를 부를 때는 Supabase 로그인 토큰이 아니라 "네이버" 토큰을 들고 오기 때문에,
//    검사를 켜 두면 오히려 모든 요청이 막힌다)

const NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me'

// 네이버 응답 중 우리가 쓰는 칸만 적어 둔 타입. (네이버 개발자 문서의 "네이버 회원 프로필 조회 API")
type NaverProfile = {
  id: string
  nickname?: string
  name?: string
  email?: string
  profile_image?: string
}

type NaverMeResponse = {
  resultcode: string
  message: string
  response?: NaverProfile
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  // Supabase Auth는 "Authorization: Bearer <네이버 access token>" 헤더를 붙여서 부른다.
  const authorization = req.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return json({ error: 'missing_token' }, 401)
  }

  const naverRes = await fetch(NAVER_USERINFO_URL, { headers: { Authorization: authorization } })
  if (!naverRes.ok) {
    // 토큰이 만료됐거나 틀린 경우 등. 네이버가 준 상태 코드를 그대로 돌려줘서 원인을 숨기지 않는다.
    return json({ error: 'naver_request_failed', status: naverRes.status }, naverRes.status)
  }

  const body = (await naverRes.json()) as NaverMeResponse
  // resultcode '00'이 성공. HTTP 200인데도 실패를 resultcode로 알려 주는 경우가 있어서 따로 본다.
  const profile = body.response
  if (body.resultcode !== '00' || !profile?.id) {
    return json({ error: 'naver_invalid_response', message: body.message }, 502)
  }

  // OIDC 표준 이름(sub, email, name, picture …)으로 바꿔서 맨 바깥에 놓는다.
  return json({
    sub: profile.id,
    // 이메일은 사용자가 동의하지 않으면 없다. (대시보드에서 "Allow users without email"을 켜 둔 이유)
    email: profile.email,
    // email_verified를 false로 두는 이유:
    //   네이버의 "연락처 이메일"은 사용자가 직접 적은 연락용 주소라, 그 주소의 주인인지 확인된 값이 아니다.
    //   true로 두면 Supabase가 같은 이메일의 기존 계정과 자동으로 연결할 수 있는데,
    //   남의 이메일을 적어 둔 네이버 계정으로 그 사람의 노트립 계정에 들어가는 문제가 생길 수 있다.
    email_verified: false,
    name: profile.name ?? profile.nickname,
    nickname: profile.nickname,
    picture: profile.profile_image,
  })
})
