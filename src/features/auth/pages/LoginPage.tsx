import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../api'
import { useAuth } from '../useAuth'

// 로그인 화면 (주소: /login)
// 지금은 이메일 + 비밀번호만. 카카오, 구글, 네이버 버튼은 순서대로 추가한다.
// ⚠️ 모양은 기능 확인용 임시 디자인이다. 디자인을 받으면 교체한다.
type Mode = 'signIn' | 'signUp'

export function LoginPage() {
  const { session, loading } = useAuth()
  const location = useLocation()
  // RequireAuth가 들려 보낸 "원래 가려던 주소". 없으면 첫 화면으로.
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [mode, setMode] = useState<Mode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // 이미 로그인한 상태면 이 화면을 보여줄 이유가 없다.
  // 로그인에 성공했을 때도 여기로 온다: 로그인 → AuthProvider가 session을 받음 → 이 화면이 다시 그려짐 → 이동
  // (그래서 로그인 성공 후 navigate()를 직접 부르지 않는다. 상태가 바뀌면 화면이 따라간다)
  if (!loading && session) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // form은 기본적으로 제출하면 페이지를 새로 불러온다(옛날 웹 방식). SPA에서는 막아야 한다.
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'signIn') {
        await signInWithEmail(email, password)
      } else {
        const { needsEmailConfirmation } = await signUpWithEmail(email, password)
        if (needsEmailConfirmation) {
          setNotice(`${email}로 가입 확인 메일을 보냈어요. 메일의 링크를 누르면 가입이 완료돼요.`)
          setMode('signIn')
          setPassword('')
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '문제가 생겼어요.')
    } finally {
      // 성공하든 실패하든 버튼을 다시 누를 수 있게 한다. finally는 둘 다의 경우에 실행된다.
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setSubmitting(true)
    setError(null)
    try {
      // 성공하면 이 페이지를 떠나 구글로 이동하므로, 아래 finally에서 버튼을 다시 켜지 않는다.
      // (돌아오기 전에 버튼이 다시 눌리는 것을 막기 위해)
      await signInWithGoogle(from)
    } catch (e) {
      setError(e instanceof Error ? e.message : '문제가 생겼어요.')
      setSubmitting(false)
    }
  }

  const isSignIn = mode === 'signIn'

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-slate-900">{isSignIn ? '로그인' : '회원가입'}</h1>

      {/* 소셜 로그인은 가입과 로그인이 따로 없다. 처음이면 자동으로 가입된다.
          그래서 모드(로그인/가입)와 상관없이 항상 보여준다.
          ⚠️ 임시 버튼. 정식 디자인에서는 구글의 버튼 디자인 가이드(로고, 문구)를 따라야 한다. */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="mt-6 w-full rounded border border-slate-300 bg-white py-2 font-semibold text-slate-800 disabled:opacity-50"
      >
        Google로 계속하기
      </button>

      <p className="mt-6 text-center text-xs text-slate-400">또는 이메일로</p>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          이메일
          {/* type="email": 폰에서 @가 있는 키보드가 뜨고, 브라우저가 형식을 먼저 검사한다.
              autoComplete: 브라우저와 비밀번호 관리자가 저장된 값을 채워 줄 수 있게 알려 준다. */}
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-slate-300 bg-white px-3 py-2 text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          비밀번호
          {/* 가입할 땐 new-password(새 비밀번호 추천), 로그인할 땐 current-password(저장된 것 채우기) */}
          <input
            type="password"
            required
            minLength={6}
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-slate-300 bg-white px-3 py-2 text-base"
          />
        </label>

        {/* role="alert": 화면 낭독기(시각장애인용)가 오류를 바로 읽어 준다. (접근성) */}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {notice && <p className="text-sm text-sky-700">{notice}</p>}

        {/* 처리 중에는 버튼을 막는다. 안 그러면 여러 번 눌러 가입 요청이 중복으로 갈 수 있다. */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded bg-slate-900 py-2 font-semibold text-white disabled:opacity-50"
        >
          {submitting ? '처리 중…' : isSignIn ? '로그인' : '가입하기'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(isSignIn ? 'signUp' : 'signIn')
          setError(null)
          setNotice(null)
        }}
        className="mt-4 text-sm text-slate-500 underline"
      >
        {isSignIn ? '처음이신가요? 이메일로 가입하기' : '이미 계정이 있나요? 로그인'}
      </button>
    </section>
  )
}
