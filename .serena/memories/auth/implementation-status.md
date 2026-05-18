# Issue #3 인증 구현 상태

## 완료 (2026-05-16)
- 57 tests, 14 files 전부 통과
- pnpm build 성공

## 파일 목록

### 신규 (20개)
- `src/test/mocks/supabase.ts` — mock 팩토리 (createMockSession, createMockAuthUser, createMockSupabaseClient)
- `src/test/helpers/renderWithProviders.tsx` — QueryClient + Jotai + MemoryRouter 래핑
- `src/lib/auth.ts` — signInWithOAuth, signOut, getSession
- `src/lib/userProfile.ts` — fetchUserProfile, createUserProfile
- `src/stores/auth.ts` — sessionAtom, currentUserAtom, authLoadingAtom, authStatusAtom(파생)
- `src/hooks/useAuth.ts` — status, session, user, signIn, handleSignOut
- `src/hooks/useUserProfile.ts` — TanStack Query 프로필 hook (profile, createProfile, isCreating)
- `src/hooks/useAuthInitializer.ts` — getSession + onAuthStateChange + fetchUserProfile
- `src/components/auth/AuthGuard.tsx` — 3상태 라우트 보호
- `src/components/auth/OAuthButtons.tsx` — 카카오(#FEE500)/구글 버튼
- `src/components/auth/NicknameForm.tsx` — 2-10자 검증, trim
- `src/pages/NicknamePage.tsx` — NicknameForm + useUserProfile.createProfile
- 테스트 파일 8개 (`__tests__/` 디렉토리)

### 수정 (6개)
- `src/test/setup.ts` — vi.mock('@/lib/supabase') 전역 추가
- `src/App.tsx` — JotaiProvider + AuthInitializer 래핑
- `src/routes/index.tsx` — AuthGuard, /onboarding/nickname, /auth/callback, routeConfig export
- `src/pages/OnboardingPage.tsx` — OAuthButtons 추가
- `src/pages/SettingsPage.tsx` — useAuth().handleSignOut 로그아웃 버튼
- `tsconfig.app.json` — 테스트 파일 빌드 exclude

## HITL 남은 작업
1. 카카오 개발자 콘솔: REST API 키 + Client Secret + Redirect URI
2. Google Cloud Console: OAuth 클라이언트 ID/Secret + 리디렉션 URI
3. Supabase 대시보드: Provider 활성화 + 키 입력 + Redirect URL
4. Redirect URI: `https://eoqezhflnjrddiooytel.supabase.co/auth/v1/callback`

## 주의사항
- Node 22+ 필수 (nvm use 22)
- @rolldown/binding-darwin-arm64 명시 설치 필요
- users 테이블은 nickname NOT NULL → OAuth 후 닉네임 수집 필요 (DB 트리거 불가)
