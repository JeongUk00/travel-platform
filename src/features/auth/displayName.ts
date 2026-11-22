import type { User } from '@supabase/supabase-js'

// 화면에 보여줄 사용자 이름을 정한다. 우선순위: 이메일 → 공급자가 준 이름 → '나'
//
// 왜 따로 함수로 뺐나?
//   메뉴뿐 아니라 나중에 "동행자 목록", "누가 결제했는지" 등 여러 화면에서 같은 규칙이 필요하다.
//   규칙을 한 곳에 두면, 바꿀 때 이 파일만 고치면 된다.
//
// 🐛 처음 버전의 버그 (2026-11-23 카카오 테스트에서 발견)
//   처음엔 `user.email ?? user_metadata.name ?? '나'`로 썼다.
//   그런데 카카오로 이메일 없이 로그인하면 Supabase는 email을 undefined가 아니라 빈 문자열("")로 준다.
//   `??`는 null과 undefined일 때만 다음 값으로 넘어가므로, ""에서 멈춰서 **빈 이름이 표시**됐다.
//   `||`는 ""(빈 문자열)도 "값 없음"으로 보고 다음으로 넘어간다. 그래서 여기서는 `||`가 맞다.
//   (반대로 0이나 ""가 "의미 있는 값"인 경우엔 `??`를 써야 한다. 숫자 0명, 빈 메모 등)
export function getDisplayName(user: User | null): string {
  if (!user) return ''
  const meta = user.user_metadata ?? {}
  return (
    user.email ||
    // 공급자마다 이름을 담는 칸 이름이 조금씩 달라서 흔한 이름들을 차례로 본다.
    meta.name ||
    meta.full_name ||
    meta.nickname ||
    meta.preferred_username ||
    meta.user_name ||
    '나'
  )
}
