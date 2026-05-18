# CLAUDE.md — Daily Growth Log (하루한줄)

## 프로젝트 개요
매일 한 줄(60자) 성장 기록 + 감정 추적 커뮤니티 SaaS. 1인 기업, 앱 출시 목표.
- 핵심 피봇: "한 일" + "느낀 감정" 두 축 기록 (메타센싱 트렌드 반영)
- "어떤 활동이 나를 행복하게 하는가" 인사이트 제공이 차별점

## 기술 스택
- React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v4
- Jotai (client state) + TanStack Query (server state)
- Supabase (PostgreSQL + Auth + Realtime + Storage)
- Auth: 카카오 + 구글 OAuth
- Test: Vitest + Testing Library
- Deploy: PWA → 추후 React Native 전환

## 명령어
```bash
pnpm dev          # 개발 서버 (localhost:3000)
pnpm build        # 빌드
pnpm test         # 테스트
pnpm test:watch   # 테스트 워치
pnpm lint         # ESLint
pnpm format       # Prettier
```

## Supabase
- URL: https://eoqezhflnjrddiooytel.supabase.co
- Region: Tokyo
- 테이블: users, posts, cheers, activities, reports, invite_codes
- Storage: post-images (5MB, 이미지만)
- 마이그레이션: supabase/migrations/

## 핵심 기획
- 레벨별 기능 해금: Lv.1 텍스트 → Lv.2 응원(🌱) → Lv.3 이미지 → Lv.4 초대코드 → Lv.5 프로필테마
- 레벨: 씨앗(0)→새싹(50)→줄기(120)→꽃봉오리(250)→꽃(500)→나무(900)
- 초대제: 오픈가입 → 하이브리드(100+유저) → 초대제(1000+유저)
- 글 수정 불가, 삭제만. 자정까지만 기록 가능. 하루 1개.
- 자기 자신과만 비교, 타인 경쟁 X
- 디자인: calm, minimal, emotional. Primary #4A7C59 (그린), BG #FAFAF7

## 프로젝트 구조
```
src/
├── components/
│   ├── auth/       # AuthGuard, OAuthButtons, NicknameForm
│   └── layout/     # AppLayout, BottomNav
├── pages/          # HomePage, WritePage, ProfilePage, LeaderboardPage,
│                   # OnboardingPage, SettingsPage, NicknamePage
├── hooks/          # useAuth, useUserProfile, useAuthInitializer
├── stores/         # Jotai atoms (auth.ts)
├── lib/            # supabase.ts, queryClient.ts, database.types.ts, auth.ts, userProfile.ts
├── routes/         # React Router 설정 (routeConfig export)
└── test/
    ├── setup.ts            # jest-dom + 전역 Supabase mock
    ├── mocks/supabase.ts   # Supabase mock 팩토리
    └── helpers/renderWithProviders.tsx
```

## 인증 아키텍처 (Issue #3 — 코드 구현 완료)

### 3가지 인증 상태
| 상태 | authStatusAtom | 라우트 |
|------|---------------|--------|
| 미인증 | `unauthenticated` | → `/onboarding` (OAuth 버튼) |
| 인증됨, 프로필 없음 | `needs_profile` | → `/onboarding/nickname` (닉네임 폼) |
| 완전 인증 | `authenticated` | → `/` (홈, AuthGuard 통과) |

### 레이어 구조
- **lib/auth.ts** — 순수 함수: signInWithOAuth, signOut, getSession
- **lib/userProfile.ts** — 순수 함수: fetchUserProfile, createUserProfile
- **stores/auth.ts** — Jotai atoms: sessionAtom, currentUserAtom, authLoadingAtom, authStatusAtom(파생)
- **hooks/useAuth.ts** — 인증 convenience hook (status, signIn, handleSignOut)
- **hooks/useUserProfile.ts** — TanStack Query 기반 프로필 CRUD hook
- **hooks/useAuthInitializer.ts** — 앱 시작 시 세션 복원 + onAuthStateChange 리스너
- **components/auth/AuthGuard.tsx** — authStatus 기반 라우트 보호 (Navigate)
- **components/auth/OAuthButtons.tsx** — 카카오/구글 로그인 버튼
- **components/auth/NicknameForm.tsx** — 닉네임 입력 (2-10자 검증)

### App.tsx Provider 순서
`JotaiProvider` → `QueryClientProvider` → `AuthInitializer` → `RouterProvider`

### HITL 남은 작업 (코드 외)
- 카카오 개발자 콘솔: REST API 키 + Client Secret 발급, Redirect URI 등록
- Google Cloud Console: OAuth 클라이언트 ID/Secret 발급, 리디렉션 URI 등록
- Supabase 대시보드: Kakao/Google Provider 활성화 + 키 입력, Redirect URL 등록
- Redirect URI (공통): `https://eoqezhflnjrddiooytel.supabase.co/auth/v1/callback`
- Supabase Site URL: `http://localhost:3000` (개발), Redirect URLs: `http://localhost:3000/auth/callback`

## GitHub Issues 진행 상태
- #1 프로젝트 초기 세팅 ✅
- #2 Supabase 스키마 & RLS ✅
- #3 인증 (카카오+구글) ✅ 코드 완료, 커밋 완료 (HITL: OAuth 콘솔 설정 필요)
- #4~#15 대기 (기획 재검토 후 PRD 갱신 예정)

## 개발 파이프라인
### 1차 파이프라인 (완료)
Phase 1 GRILL ✓ → Phase 2 PRD ✓ → Phase 3 ISSUES ✓ → Phase 4 TDD ✓ (#3 완료)

### 2차 파이프라인 (진행 중 — 기획 재검토)
Phase 1 GRILL 🔄 진행 중 → Phase 2 PRD → Phase 3 ISSUES → Phase 4 TRIAGE → Phase 5 TDD → Phase 6 REVIEW

#### GRILL 진행 상황
- **Branch 1 (경쟁 환경)**: 기존 차별점 약함 (D) — 그로우(50만+), 투두메이트(200만+) 대비 킬러 차별점 부족
- **Branch 2 (메타센싱 반영)**: 방향 C 선택 — "성장 + 감정 통합"
  - 기록 = "한 일(60자)" + "느낀 감정(아이콘)" 두 축
  - 감정 패턴 분석 → "어떤 활동이 나를 행복하게 하는가" 인사이트
  - 그로우·Daylio 어디에도 없는 독자 포지션
- **Branch 3~**: 세부 설계 미결 (다음 세션에서 계속)
  - 감정 아이콘 세트 설계
  - 감정 리포트 형태
  - Posts 테이블 스키마 변경 (emotion 컬럼 추가)
  - 기존 PRD 어디까지 유지할지

- PRD: ./PRD.md (갱신 예정)
- 마케팅 전략: MVP 완성 후 별도 Phase

## 코딩 규칙
- @ path alias 사용 (e.g. @/lib/supabase)
- any 타입 금지
- 컴포넌트 150줄 초과 시 분리
- inline style 금지, Tailwind utility class 사용
- handler 네이밍: handle{Target}{EventName}
- 커밋: [FEAT], [FIX], [REFACTOR] 등 prefix
- 한국어 커뮤니케이션

## 테스트 패턴
- 전역 Supabase mock: `src/test/setup.ts`에서 `vi.mock('@/lib/supabase')` (실제 API 호출 차단)
- 공통 렌더 유틸: `renderWithProviders` (QueryClient + Jotai + MemoryRouter 래핑)
- Jotai 상태 주입: `initialAtomValues` 옵션으로 테스트별 atom 값 설정
- 테스트 파일은 빌드 제외: `tsconfig.app.json`의 `exclude`에 `__tests__`, `*.test.*`, `src/test/**`

## 환경 요구사항
- Node.js 22+ 필수 (Vite 8 + rolldown이 `node:util.styleText` 배열 포맷 사용)
- `source "$HOME/.nvm/nvm.sh" && nvm use 22` 후 명령어 실행
- `@rolldown/binding-darwin-arm64` devDependency로 명시 설치됨 (pnpm optional dep 이슈 대응)
