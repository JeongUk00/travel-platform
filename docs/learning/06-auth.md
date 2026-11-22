# 학습 06. 로그인 상태 관리와 이메일 로그인

> 순서: ① 무엇인가 → ② 없으면 무슨 문제 → ③ 우리 프로젝트의 어디에 있나 → 확인 질문

---

## 1. 인증과 인가

| | 인증 (Authentication) | 인가 (Authorization) |
|---|---|---|
| 질문 | **"너 누구야?"** | **"너 이거 해도 돼?"** |
| 예 | 이메일과 비밀번호가 맞는지 확인 | 이 여행의 멤버라서 일정을 볼 수 있는지 확인 |
| 우리 프로젝트 | Supabase Auth (이번 작업) | DB의 RLS (2단계에서 테이블 만들 때) |

면접 단골 질문이다. 로그인은 **인증**이고, "내 여행만 보인다"는 **인가**다.

---

## 2. 세션: 로그인했다는 증표

**① 무엇인가**
로그인에 성공하면 Supabase가 **세션**을 준다. 세션 안에는 "이 사람은 누구다"를 증명하는 **토큰(JWT)**이 들어 있다. 앱은 이후 Supabase에 요청할 때마다 이 토큰을 같이 보내고, Supabase는 토큰을 보고 누가 요청했는지 안다.

- 세션은 브라우저 저장소(localStorage)에 저장된다 → **새로고침하거나 앱을 껐다 켜도 로그인이 유지된다.**
- 토큰은 1시간 정도면 만료되지만, supabase-js가 **알아서 새 토큰으로 갱신**한다.

**② 없으면?**: 화면을 옮길 때마다, 요청할 때마다 비밀번호를 다시 보내야 한다.

**③ 우리 프로젝트에서**: 로그인 방식(이메일, 카카오, 구글, 네이버)이 무엇이든 **결과는 똑같은 세션**이다. 그래서 아래의 상태 관리 코드는 로그인 방식이 늘어나도 바뀌지 않는다.

---

## 3. React Context: 앱 전체에 로그인 상태 나눠 주기

**① 무엇인가**
컴포넌트 트리 전체에 값을 **방송**하는 통로. Provider로 감싼 안쪽이라면 어느 화면에서든 꺼내 쓸 수 있다.

**② 없으면?**
로그인 정보를 `App → Layout → Page → Card → Button`처럼 props로 한 단계씩 넘겨야 한다. 중간 컴포넌트는 쓰지도 않는 값을 넘겨주기만 한다. 이걸 **prop drilling**이라고 한다.

**③ 우리 프로젝트에서**

| 파일 | 역할 |
|---|---|
| `features/auth/AuthContext.ts` | 로그인 상태의 **모양**(`session`, `user`, `loading`)과 Context 객체 |
| `features/auth/AuthProvider.tsx` | 로그인 상태를 **관리**하고 앱 전체에 나눠 줌 |
| `features/auth/useAuth.ts` | 화면에서 `const { user } = useAuth()`로 **꺼내 쓰는** 훅 |
| `app/providers.tsx` | 앱 전체를 감싸는 Provider 모음 (다음에 TanStack Query도 여기에) |

**AuthProvider의 핵심: `onAuthStateChange`**
```ts
supabase.auth.onAuthStateChange((_event, newSession) => {
  setSession(newSession)
  setLoading(false)
})
```
Supabase에 "로그인 상태가 바뀌면 알려 줘"라고 **구독**을 건다.
- 구독하자마자 한 번 → 저장된 세션이 있는지 (새로고침해도 로그인 유지)
- 로그인, 로그아웃, 토큰 갱신, **다른 탭에서 로그아웃**했을 때도 알려 준다.
- **버린 대안**: `getSession()`으로 한 번만 읽기. 이후 바뀌는 상태를 놓친다.
- 컴포넌트가 사라질 때 `subscription.unsubscribe()`로 구독을 끊는다. 안 끊으면 구독이 쌓여 메모리가 샌다.

**왜 `loading`이 따로 있나?**
앱이 막 켜졌을 때는 "로그인했었나?"를 확인하는 데 아주 잠깐 시간이 걸린다. `loading` 없이 `session === null`만 보면, **이미 로그인한 사람도 새로고침할 때마다 로그인 화면으로 튕긴다.**

**왜 파일을 3개로 나눴나?**
React의 빠른 새로고침(HMR)은 "컴포넌트만 내보내는 파일"에서 가장 잘 동작한다. 그래서 Context 객체와 훅을 컴포넌트 파일과 분리했다. 린터 규칙(`react/only-export-components`)도 이걸 검사한다.

---

## 4. 보호된 라우트 (RequireAuth)

**① 무엇인가**: 로그인해야 볼 수 있는 화면 앞에 세우는 문지기. `features/auth/components/RequireAuth.tsx`

```ts
if (loading) return <p>확인 중…</p>
if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
return <Outlet />
```

- **`router.tsx`에서 path 없는 라우트로 끼워 넣었다.** 그 안의 화면(여행 목록, 여행 상세)은 전부 자동으로 보호된다. 화면마다 검사 코드를 넣을 필요가 없다.
- **`state.from`**: 원래 가려던 주소를 들고 로그인 화면으로 간다. 로그인이 끝나면 그 화면으로 돌아간다. (카톡으로 받은 여행 링크 → 로그인 → 바로 그 여행)
- **`replace`**: 방문 기록을 교체한다. 안 그러면 로그인 화면에서 뒤로 가기를 눌렀을 때 보호된 화면 → 다시 로그인 화면으로 튕기는 반복이 생긴다.

### ⚠️ 이건 보안 장치가 아니다
프론트엔드 코드는 사용자 폰에서 돌아가므로 **사용자가 마음대로 고칠 수 있다.** RequireAuth는 우회할 수 있다.
진짜로 남의 데이터를 못 보게 막는 것은 **DB의 RLS(인가)**다. RequireAuth의 목적은 "로그인 안 한 사람에게 빈 화면 대신 로그인 화면을 보여주는" **사용자 경험**이다.
→ 면접 포인트: **"프론트엔드 검사는 UX, 보안은 서버(DB)에서"**

---

## 5. 이메일 로그인 화면과 api.ts

| 파일 | 역할 |
|---|---|
| `features/auth/api.ts` | Supabase와 대화 (`signInWithEmail`, `signUpWithEmail`, `signOut`) + 오류를 한국어로 |
| `features/auth/pages/LoginPage.tsx` | 화면 (입력, 버튼, 오류 표시) |

**왜 나눴나?** 화면은 "무엇을 할지", api.ts는 "서버와 어떻게 대화할지"만 책임진다. 카카오, 구글, 네이버 함수도 api.ts에 추가되고, 화면은 버튼만 늘어난다. (관심사의 분리)

**작은 설계 포인트들**
- **로그인 성공 후 `navigate()`를 직접 부르지 않는다.** 로그인 → AuthProvider가 세션을 받음 → LoginPage가 다시 그려지면서 `session`이 있으니 `<Navigate>`로 이동. **상태가 바뀌면 화면이 따라간다**(선언형).
- **오류는 `error.code`로 구분한다.** 영어 문장(`message`)은 버전에 따라 바뀔 수 있지만, 코드는 약속된 값이다.
- **"이메일이 없음"과 "비밀번호 틀림"을 구분해서 알려 주지 않는다.** 구분해 주면 공격자가 어떤 이메일이 가입되어 있는지 알아낼 수 있다.
- **처리 중에는 버튼을 막는다.** 여러 번 눌러 요청이 중복으로 가는 것을 막는다.
- `event.preventDefault()`: form은 원래 제출하면 페이지를 새로 불러온다. SPA에서는 막아야 한다.
- `type="email"`, `autoComplete`: 폰에서 알맞은 키보드가 뜨고, 비밀번호 관리자가 값을 채워 줄 수 있다.
- `role="alert"`: 화면 낭독기가 오류를 바로 읽어 준다. (접근성)

**가입 확인 메일**
Supabase는 기본적으로 가입 후 **확인 메일의 링크를 눌러야** 가입이 끝난다. 그 전에는 세션이 없으므로 `data.session === null`이면 "메일을 확인해 주세요"를 보여준다.
링크를 누르면 돌아올 주소는 `emailRedirectTo: window.location.origin`(지금 열린 사이트)이고, Supabase 대시보드의 **Redirect URLs**에 등록되어 있어야 허용된다.

---

## 6. 알아 둘 것: 번들 크기

supabase-js가 실제로 쓰이기 시작하면서 JS 파일이 약 100KB → **157KB**(gzip)로 커졌다. 로그인 화면에 필요한 만큼은 감수할 크기다. 화면이 더 늘어나면 코드 분할(lazy loading)을 검토한다.

---

## 확인 질문

1. 인증과 인가의 차이는? 우리 프로젝트에서 각각 무엇이 담당하나?
2. React Context가 해결하는 문제(prop drilling)는 무엇인가?
3. AuthProvider에서 `loading` 상태가 없으면 어떤 문제가 생기나?
4. RequireAuth가 있는데도 "보안 장치가 아니다"라고 하는 이유는? 진짜 보안은 어디서 하나?
5. 로그인 오류 메시지에서 "이메일이 없음"과 "비밀번호 틀림"을 구분하지 않는 이유는?

---

## 내 답 (직접 작성)

1.
2.
3.
4.
5.
