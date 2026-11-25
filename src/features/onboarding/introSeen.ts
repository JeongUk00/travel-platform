// 소개 화면을 "봤는지"를 이 기기(브라우저)에 기억해 두는 파일.
// (2026-11-25 결정: 소개 화면은 처음 한 번 + 로그인 안 된 사람에게만)
//
// 왜 localStorage인가?
//   - 브라우저를 껐다 켜도 남아 있어서 "처음 한 번"을 기억할 수 있다. (sessionStorage는 탭을 닫으면 사라짐)
//   - 로그인하기 전의 일이라 서버(Supabase)에 사용자별로 저장할 수가 없다. 아직 누군지 모르기 때문이다.
//   - 그래서 "기기마다 한 번"이 된다. 새 폰에서 열면 다시 보인다. 소개 화면에는 그 정도면 충분하다.
//
// 왜 try/catch로 감싸나?
//   사파리 개인정보 보호 모드나 저장 공간이 막힌 환경에서는 localStorage에 접근만 해도 오류가 난다.
//   소개 화면 기억은 "있으면 좋은" 기능이라, 실패해도 앱이 멈추면 안 된다.
//   읽기에 실패하면 "안 봤다"로 보고 소개 화면을 한 번 더 보여 줄 뿐이다.

// 키 이름에 앱 이름과 버전(v1)을 붙인다.
// 같은 주소(도메인)를 쓰는 다른 코드와 겹치지 않게 하고, 나중에 소개 화면을 새로 만들어
// 모두에게 다시 보여 주고 싶으면 v2로 바꾸기만 하면 된다.
const STORAGE_KEY = 'note-trip:intro-seen:v1'

export function hasSeenIntro(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function markIntroSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // 저장에 실패해도 할 수 있는 일이 없다. 다음에 소개 화면이 한 번 더 보일 뿐이다.
  }
}
