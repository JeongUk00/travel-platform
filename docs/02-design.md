# 02. 기술 설계서

> `01-requirements.md`의 요구사항을 **어떻게** 만들지 정리한 문서.

> 모든 선택에는 "왜"를 함께 적는다. 면접에서 "왜 이 기술을 썼나요?"라는 질문에 그대로 답할 수 있게 하기 위해서다.

---

## 1. 전체 구조

```
┌─────────────────────────────┐
│  사용자 폰 (브라우저 / 앱)     │
│  ┌───────────────────────┐  │
│  │ React 화면 (PWA)       │  │  ← 우리가 만드는 프론트엔드
│  │ Service Worker(오프라인)│  │
│  └──────────┬────────────┘  │
└─────────────┼───────────────┘
              │ HTTPS
┌─────────────▼───────────────┐
│  Supabase (무료 요금제)       │  ← 서버를 직접 만들지 않고 빌려 씀
│  - Auth: 로그인              │
│  - Postgres DB: 데이터 저장   │
│  - Realtime: 실시간 동기화    │
│  - Edge Functions: AI 호출   │
└─────────────────────────────┘
```

나중에 앱으로 낼 때는 **같은 React 코드**를 Capacitor로 감싸면 된다. 위젯만 네이티브 코드가 따로 필요하다(7절 참고).

---

## 2. 기술 스택과 선택 이유

| 영역 | 선택 | 왜 이걸 골랐나 | 대안과 버린 이유 |
|---|---|---|---|
| 언어 | **TypeScript** | 타입 덕분에 실수를 컴파일 단계에서 잡는다. 채용 공고 대부분이 요구한다 | JavaScript: 배우기는 쉽지만 규모가 커지면 버그가 늘어난다 |
| UI | **React** | 국내 프론트엔드 채용 수요 1위. Capacitor와 궁합이 좋다 | Vue: 좋지만 국내 수요가 적다 |
| 빌드 도구 | **Vite** | 빠르고 설정이 단순하다. 정적 파일로 빌드되어 Capacitor에 바로 넣을 수 있다 | Next.js: 서버 기능이 강점인데 앱으로 감쌀 때 그 강점을 못 쓰고 설정만 복잡해진다 |
| PWA | **vite-plugin-pwa** | manifest와 Service Worker를 자동 생성해 준다 | 직접 작성: 원리 학습용으로 한 번 들여다볼 예정 |
| 라우팅 | **React Router** | 사실상 표준 | – |
| 서버 상태 | **TanStack Query** | 서버 데이터의 캐싱, 재요청, 로딩 상태를 대신 관리한다. 실무에서 많이 쓴다 | useEffect + useState로 직접 처리: 코드가 길어지고 버그가 생기기 쉽다 |
| 스타일 | **Tailwind CSS** | 빠르게 만들 수 있고 채용 시장에서 흔하다 | CSS Modules: 괜찮지만 작성량이 많다 |
| 백엔드 | **Supabase** | 무료로 DB, 로그인, 실시간 기능을 한 번에 제공한다. 진짜 SQL(Postgres)을 쓰므로 DB 공부도 된다 | Firebase: NoSQL이라 정산처럼 관계가 복잡한 데이터에 불리하다. 직접 서버 구축: 호스팅 비용이 들고 범위가 너무 커진다 |
| 지도 | **Leaflet (react-leaflet) + OpenStreetMap** | 무료이고 API 키가 필요 없다. 구조가 단순해 원리를 이해하기 좋다 | Google Maps: 무료 한도를 넘으면 과금되고 카드 등록이 필요하다. 카카오맵: 해외 지도가 약하다 |
| 장소 검색 | **Nominatim (OSM)** | 무료 | Google Places: 유료. 초당 1회 제한이 있어 입력 지연(debounce) 처리를 함께 배운다 |
| 세계지도 색칠 | **국가 경계 GeoJSON + Leaflet** | 나라별 도형에 색만 칠하면 된다 | – |
| 배포 | **Vercel** | 무료이고 GitHub에 push하면 자동 배포된다. HTTPS 기본 제공(PWA 필수 조건) | Netlify, Cloudflare Pages도 가능 |
| 앱 전환 | **Capacitor** | 웹 코드를 그대로 앱으로 감싼다 | React Native: 코드를 거의 새로 짜야 한다 |

> ⚠️ Supabase 무료 프로젝트는 **1주일간 요청이 없으면 일시정지**된다. 대시보드에서 다시 켜면 되므로 개발 단계에서는 문제없다.

---

## 3. 폴더 구조

**기능(feature) 단위**로 나눈다. "이 기능을 고치려면 이 폴더만 보면 된다"가 목표다.

```
관광플랫폼/
├── docs/                    # 기획, 설계 문서 (지금 이 파일)
├── public/                  # 아이콘, 국가 GeoJSON 등 그대로 복사되는 파일
├── supabase/
│   ├── migrations/          # DB 테이블을 만드는 SQL (버전 관리됨)
│   └── functions/           # Edge Function (AI 추천 등 서버 코드)
├── src/
│   ├── main.tsx             # 앱 시작점: React를 화면에 붙인다
│   ├── app/
│   │   ├── router.tsx       # URL과 페이지 연결
│   │   └── providers.tsx    # 로그인, Query 등 앱 전체에 필요한 감싸개
│   ├── features/            # ★ 기능별 폴더
│   │   ├── auth/            #   로그인, 탈퇴
│   │   ├── trips/           #   여행 생성, 초대, 확정
│   │   ├── itinerary/       #   날짜별 일정, 동선 지도
│   │   ├── settlement/      #   지출, 정산 계산
│   │   ├── worldmap/        #   세계지도, 방문 국가, 추천
│   │   └── today/           #   "오늘" 홈 화면
│   ├── components/          # 여러 기능에서 함께 쓰는 버튼, 모달 등
│   ├── lib/
│   │   ├── supabase.ts      # Supabase 연결 객체 (한 곳에서만 생성)
│   │   └── platform/        # ★ 기기 기능(위치, 공유, 알림)을 감싸는 층
│   └── types/               # DB 타입 (Supabase가 자동 생성)
└── package.json
```

각 `features/xxx/` 안에는 보통 이렇게 들어간다.
```
features/settlement/
├── api.ts            # Supabase에 데이터를 읽고 쓰는 함수
├── hooks.ts          # TanStack Query로 api.ts를 감싼 훅 (useExpenses 등)
├── calculate.ts      # 정산 계산 로직 (화면과 무관한 순수 함수 → 테스트 쉬움)
├── calculate.test.ts # 계산 로직 테스트
└── components/       # 이 기능 전용 화면 조각
```

**왜 이렇게 나누나**
- `api.ts`(데이터를 어떻게 가져오는지), `calculate.ts`(무엇을 계산하는지), `components/`(어떻게 보여주는지)를 분리하면 하나를 바꿔도 다른 것이 깨지지 않는다. 이것이 **관심사의 분리**다.
- `lib/platform/`이 PWA에서 앱으로 갈 때의 핵심이다. 예를 들어 위치 정보는 웹에서는 `navigator.geolocation`, 앱에서는 Capacitor 플러그인을 쓴다. 화면 코드는 `getCurrentPosition()`만 부르고, 실제로 무엇을 쓸지는 이 폴더가 결정한다. 앱 전환 시 이 폴더만 고치면 된다.

---

## 4. 데이터 모델 (DB 테이블)

```
profiles ─────────┐
 id (= 로그인 유저) │
 nickname          │
                   │ 1:N
trip_members ◄─────┘           visited_countries
 trip_id ──┐                    user_id
 user_id   │                    country_code (KR, JP...)
 role      │ (owner / editor)
           │
trips ◄────┘
 id, title, start_date, end_date
 status (planning / confirmed)   ← "픽스" 기능
 invite_code                     ← 초대 링크용
 base_currency (KRW)
   │
   ├── itinerary_items           ← 일정
   │    id, trip_id, day (날짜), position (순서)
   │    place_name, lat, lng, start_time, memo
   │
   └── expenses                  ← 지출
        id, trip_id, paid_by (user_id)
        title, amount, currency, spent_at
          │
          └── expense_shares     ← 이 지출을 누가 나눠 내는지
               expense_id, user_id, share_amount
```

**설계 포인트**
- **여행과 사람이 다대다 관계**라서 `trip_members`라는 중간 테이블을 둔다. 한 사람은 여러 여행에, 한 여행에는 여러 사람이 속한다.
- **금액은 정수**(원 단위, 센트 단위)로 저장한다. 소수(float)는 0.1 + 0.2 = 0.30000000000000004 같은 오차가 생겨 돈 계산에 쓰면 안 된다.
- **권한은 DB가 직접 검사**한다(Supabase의 RLS, Row Level Security). "이 여행의 멤버만 이 일정을 읽을 수 있다"를 SQL 규칙으로 걸어 두면, 프론트엔드 코드에 실수가 있어도 남의 여행이 보이지 않는다. 면접 단골 주제인 "보안을 어디서 책임지나"에 대한 답이다.

---

## 5. 핵심 로직 미리 보기

### 정산: 최소 송금 계산 (B-3)
1. 사람마다 **순잔액**을 구한다. (내가 낸 돈 − 내가 부담할 돈)
   - 양수면 받을 사람, 음수면 보낼 사람
2. 가장 많이 받을 사람과 가장 많이 보낼 사람을 짝지어 둘 중 작은 금액만큼 송금 처리한다.
3. 모든 잔액이 0이 될 때까지 반복한다.

화면과 상관없는 순수 함수라 `calculate.test.ts`로 테스트를 먼저 작성하기 좋다. 포트폴리오에서 "테스트 코드를 작성했다"고 말할 수 있는 부분이다.

### "앱 열자마자 오늘 동선" (D-1)
- 첫 화면(`/`)에서 **오늘 날짜가 기간에 포함된 여행**이 있으면 `today` 화면을 보여주고, 없으면 여행 목록을 보여준다.
- Service Worker와 TanStack Query 캐시로 마지막 데이터를 먼저 그리고, 네트워크 응답이 오면 갱신한다. 이 전략을 stale-while-revalidate라고 한다.

### 나라 추천 (C-2 → C-3)
- **1단계 (무료)**: 질문 5개(휴양/도시, 예산, 비행시간, 음식, 기후) → 나라별 점수표와 비교 → 상위 3개 추천. 규칙 기반이다.
- **2단계 (AI)**: 같은 답변을 AI에게 보내 추천 이유까지 생성한다. **API 키는 절대 프론트엔드에 넣지 않는다.** 브라우저 코드는 누구나 볼 수 있기 때문이다. 반드시 Supabase Edge Function을 거쳐 호출한다.

---

## 6. 개발 단계 (로드맵)

| 단계 | 내용 | 배우는 것 | 요구사항 |
|---|---|---|---|
| **0. 세팅** | Vite+React+TS 프로젝트, Tailwind, PWA 설정, Vercel 배포 | 프로젝트 구조, 빌드, 배포, manifest, Service Worker | – |
| **1. 로그인** | Supabase 연결, 소셜 로그인, 탈퇴 | 인증 흐름, OAuth, 환경변수 | Z-1, Z-2 |
| **2. 여행·일정** | 여행 CRUD, 날짜별 일정, 지도에 동선 표시 | DB 설계, RLS, TanStack Query, 지도 | A-1, A-2, A-6 |
| **3. 공유·확정** | 초대 링크, 멤버, 확정 상태 | 권한 설계, 다대다 관계 | A-3, A-5 |
| **4. 오늘 화면** | 홈 = 오늘 동선, 오프라인 캐시 | 캐싱 전략, Service Worker | D-1, D-2 |
| **5. 정산** | 지출 기록, 분배, 최소 송금 계산 | 알고리즘, 단위 테스트 | B-1~B-3 |
| **6. 세계지도** | 방문 국가 색칠, 규칙 기반 추천 | GeoJSON, 데이터 시각화 | C-1, C-2 |
| **7. 실시간·환율** | 동시 편집 반영, 통화 환산 | WebSocket(Realtime), 외부 API | A-4, B-4 |
| **8. 앱 출시** | Capacitor 전환, Google Play → App Store, 위젯 | 네이티브 빌드, 스토어 심사 | D-3 |
| **9. 확장** | AI 추천, 숙소, 커뮤니티 | – | C-3, E-1, E-2 |

**0~5단계가 MVP**다. 여기까지 완성되면 PWA로 공개하고 여자친구와 실제 여행에서 써 보는 것이 목표다.

---

## 7. 위젯에 대한 현실적인 설명 (D-3)

- **PWA로는 홈 화면 위젯을 만들 수 없다.** 브라우저가 그 기능을 제공하지 않는다.
- 위젯은 OS 고유 기술로 만들어야 한다.
  - iOS: Swift + WidgetKit (Mac 필요)
  - Android: Kotlin + App Widget
- 그래서 8단계(Capacitor 앱 전환) 이후에 진행한다. 지금 할 수 있는 준비는 **"오늘 일정 요약" 데이터 형태를 미리 정해 두는 것**이다. 그러면 위젯은 그 데이터를 받아 그리기만 하면 된다.
- PWA 단계에서의 대안은 다음과 같다.
  - 홈 화면 아이콘을 누르면 바로 오늘 화면 (D-1)
  - 아이콘 길게 누르기 메뉴의 "오늘 일정" 바로가기 (manifest의 shortcuts, 안드로이드)

---

## 8. 앱 스토어 출시 체크리스트 (미리 지켜 둘 것)

- [ ] 회원 탈퇴 기능 (1단계에서 구현)
- [ ] 개인정보처리방침 페이지
- [ ] 소셜 로그인을 넣으면 Apple 로그인도 추가 (App Store 출시 시)
- [ ] 기기 기능은 `lib/platform/`을 통해서만 호출
- [ ] 웹을 감싸기만 한 앱으로 보이지 않도록 오프라인, 위치, 알림 같은 앱다운 기능 확보
