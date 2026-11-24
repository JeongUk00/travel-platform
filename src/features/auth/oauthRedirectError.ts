// 소셜 로그인(OAuth)이 실패했을 때 Supabase가 주소에 붙여 보내는 오류를 붙잡아 두는 파일.
//
// 왜 필요한가? (2026-11-24 네이버 로그인 테스트에서 발견)
//   Supabase는 로그인에 실패하면 우리 앱 주소에 `?error=...&error_description=...`를 붙여 돌려보낸다.
//   (흐름에 따라 `#error=...`처럼 주소 뒤쪽 해시에 붙기도 해서 둘 다 본다)
//   그런데 돌아오는 곳이 보호된 화면(`/`)이면 RequireAuth가 곧바로 `/login`으로 보내고,
//   그때 주소에 붙어 있던 오류가 사라진다. 사용자 눈에는 "버튼을 눌렀더니 화면이 새로고침됨"으로만 보인다.
//
// 왜 컴포넌트 안이 아니라 파일 맨 위(모듈이 처음 실행될 때)에서 읽나?
//   이 코드는 앱이 시작될 때 React가 화면을 그리기 **전에** 한 번 실행된다.
//   라우터가 주소를 바꾸기 전이므로, 원래 주소를 확실하게 읽을 수 있다.
//   컴포넌트(LoginPage) 안에서 읽으면 이미 주소가 `/login`으로 바뀐 뒤라 늦다.
//
// 버린 대안: 소셜 로그인 후 돌아올 주소를 항상 `/login`으로 바꾸기.
//   오류는 남지만, 성공했을 때 "원래 가려던 주소"를 따로 넘겨야 해서 흐름이 복잡해진다.
//   지금 문제는 "오류가 보이지 않는 것" 하나이므로 그 부분만 고친다.

function readOAuthError(): string | null {
  const query = new URLSearchParams(window.location.search)
  // 해시는 '#error=...' 꼴이라 앞의 '#'을 떼고 같은 방식으로 읽는다.
  const hash = new URLSearchParams(window.location.hash.slice(1))

  const error = query.get('error') ?? hash.get('error')
  if (!error) return null

  const description = query.get('error_description') ?? hash.get('error_description')
  // 원인을 찾을 수 있도록 원문을 콘솔에 남긴다. 화면에는 사용자가 읽을 문장만 보여준다.
  console.error('[auth] OAuth 로그인 실패:', error, description)
  return description ?? error
}

let pendingError = readOAuthError()

// 읽기와 비우기를 나눈 이유:
//   처음엔 "꺼내면서 비우는" 함수 하나로 만들려 했다. 그런데 개발 모드의 React StrictMode는
//   useState의 초기값 함수를 일부러 두 번 실행한다(부작용이 있는 코드를 찾아내려고).
//   그러면 두 번째 실행 때는 이미 비워져서 오류가 사라질 수 있다.
//   그래서 화면을 그릴 때는 읽기만 하고(부작용 없음), 화면이 뜬 뒤(useEffect)에 비운다.
export function peekOAuthRedirectError(): string | null {
  return pendingError
}

// 비운 뒤에는 다른 화면에 갔다가 로그인 화면에 다시 와도 옛 오류가 또 보이지 않는다.
export function clearOAuthRedirectError() {
  pendingError = null
}
