# CLAUDE.md — Daily Growth Log (하루한줄)

## 프로젝트 개요
매일 한 줄(60자) 성장 기록 커뮤니티 SaaS. 1인 기업, 앱 출시 목표.

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
├── components/{common,app,layout}/
├── pages/          # HomePage, WritePage, ProfilePage, LeaderboardPage, OnboardingPage, SettingsPage
├── hooks/
├── stores/         # Jotai atoms
├── utils/
├── lib/            # supabase.ts, queryClient.ts, database.types.ts
├── routes/         # React Router 설정
├── assets/{icons,images,animations}/
└── test/           # 테스트 설정
```

## GitHub Issues 진행 상태
- #1 프로젝트 초기 세팅 ✅
- #2 Supabase 스키마 & RLS ✅
- #3 인증 (카카오+구글) ← 다음 작업 (개발자 콘솔 설정 필요)
- #4~#15 대기

## 개발 파이프라인
Phase 1 GRILL ✓ → Phase 2 PRD ✓ → Phase 3 ISSUES ✓ → Phase 4 TDD (진행 중)
- PRD: ./PRD.md
- 마케팅 전략: MVP 완성 후 별도 Phase

## 코딩 규칙
- @ path alias 사용 (e.g. @/lib/supabase)
- any 타입 금지
- 컴포넌트 150줄 초과 시 분리
- inline style 금지, Tailwind utility class 사용
- handler 네이밍: handle{Target}{EventName}
- 커밋: [FEAT], [FIX], [REFACTOR] 등 prefix
- 한국어 커뮤니케이션
