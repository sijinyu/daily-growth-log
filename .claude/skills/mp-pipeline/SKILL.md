---
name: mp-pipeline
description: >
  Full feature development pipeline: grill-me → to-prd → to-issues → tdd.
  Orchestrates the complete Matt Pocock workflow in one command.
  Use when user says "파이프라인", "pipeline", "풀 워크플로우", "기능 개발 시작",
  "feature pipeline", or wants end-to-end feature development from idea to code.
---

# Feature Development Pipeline

One command to go from idea to implemented, tested code. Each phase feeds the next automatically.

## Pipeline Phases

```
Phase 1: GRILL    →  의도 정렬, 결정 트리 해소
Phase 2: PRD      →  요구사항 문서화
Phase 3: ISSUES   →  vertical slice 이슈 분해
Phase 4: TDD      →  이슈별 red-green-refactor 구현
         ↓ (버그 발생 시)
      DIAGNOSE    →  구조적 디버깅
         ↓ (주기적)
   ARCHITECTURE   →  deepening opportunity 탐색
```

## Process

### Phase 1 — GRILL (의도 정렬)

사용자의 아이디어/요구사항을 결정 트리로 끝까지 인터뷰합니다.

**실행 내용:**
1. 사용자에게 구현하려는 기능이 무엇인지 물어봅니다
2. 각 결정 분기를 하나씩 걸어가며 인터뷰합니다
3. 코드베이스를 탐색하여 답할 수 있는 질문은 직접 확인합니다
4. 모든 분기가 해소될 때까지 계속합니다

**완료 기준:**
- [ ] 기능의 범위(scope)가 명확함
- [ ] 모든 결정 분기가 해소됨
- [ ] 기술적 제약사항 확인됨
- [ ] 사용자가 "다음 단계로" 승인

**전환:** "인터뷰가 완료되었습니다. PRD 작성으로 넘어갈까요?"

---

### Phase 2 — PRD (요구사항 문서화)

Phase 1에서 합의한 내용을 PRD로 합성합니다.

**실행 내용:**
1. Phase 1 대화 컨텍스트를 기반으로 PRD 작성 (추가 인터뷰 없이)
2. 코드베이스 탐색하여 현재 상태 파악
3. 주요 모듈 스케치 — deep module 추출 기회 탐색
4. PRD 템플릿으로 작성:
   - Problem Statement
   - Solution
   - User Stories (최대한 많이)
   - Implementation Decisions
   - Testing Decisions
   - Out of Scope
5. 사용자 검토 후 이슈 트래커에 발행

**완료 기준:**
- [ ] PRD가 Phase 1 합의 내용을 빠짐없이 반영
- [ ] 사용자가 PRD 내용 승인
- [ ] 이슈 트래커에 발행됨 (또는 로컬 파일로 저장)

**전환:** "PRD가 발행되었습니다. 이슈 분해로 넘어갈까요?"

---

### Phase 3 — ISSUES (이슈 분해)

PRD를 독립적으로 작업 가능한 vertical slice 이슈들로 분해합니다.

**실행 내용:**
1. PRD를 기반으로 tracer bullet 이슈 도출
2. 각 이슈는 모든 레이어를 관통하는 얇은 vertical slice
3. HITL(사람 필요) vs AFK(에이전트 가능) 분류
4. 의존성 순서 배치
5. 사용자에게 제시하고 퀴즈:
   - 세분화 수준이 적절한가?
   - 의존성 관계가 맞는가?
   - 합치거나 나눌 이슈가 있는가?
6. 승인 후 이슈 트래커에 발행

**이슈 본문 템플릿:**
```markdown
## What to build
[end-to-end 동작 설명]

## Acceptance criteria
- [ ] 기준 1
- [ ] 기준 2

## Blocked by
- 의존 이슈 (없으면 "None - can start immediately")
```

**완료 기준:**
- [ ] 모든 이슈가 독립적으로 검증 가능
- [ ] 의존성 순서대로 발행됨
- [ ] 사용자가 분해 결과 승인

**전환:** "이슈 N개가 발행되었습니다. 첫 번째 이슈부터 TDD로 구현할까요?"

---

### Phase 4 — TDD (구현)

이슈를 하나씩 red-green-refactor로 구현합니다.

**이슈당 실행 내용:**

1. **Planning**: 인터페이스 확인, 테스트할 동작 우선순위 결정
2. **Tracer Bullet**: 테스트 1개 작성(RED) → 최소 구현(GREEN)
3. **Incremental Loop**: 나머지 동작도 1개씩 RED→GREEN 반복
4. **Refactor**: 모든 테스트 통과 후 리팩터링

**핵심 규칙:**
- 한 번에 테스트 1개만
- 테스트는 동작(behavior)을 검증, 구현(implementation)을 검증하지 않음
- RED 상태에서 절대 리팩터링하지 않음
- horizontal slice (테스트 먼저 다 쓰고 구현) 금지 → vertical slice만

**이슈 완료 시:**
- [ ] 모든 테스트 통과
- [ ] 코드가 acceptance criteria 충족
- [ ] "다음 이슈로 넘어갈까요?" 확인

**버그 발생 시:** `/mp-diagnose` 워크플로우로 전환
- Phase 1: 피드백 루프 구축
- Phase 2: 재현
- Phase 3: 가설 3-5개
- Phase 4: 계측
- Phase 5: 수정 + 회귀 테스트
- Phase 6: 정리

---

## Phase 전환 규칙

1. **각 Phase 완료 시 반드시 사용자 확인**을 받고 다음으로 진행
2. 사용자가 "건너뛰기"를 요청하면 해당 Phase를 skip 가능
3. 사용자가 "이전 단계로"를 요청하면 되돌아갈 수 있음
4. 어느 Phase에서든 `/mp-diagnose`로 디버깅 전환 가능
5. 파이프라인 진행 상황을 항상 표시:

```
[Phase 1: GRILL] ✓ → [Phase 2: PRD] ✓ → [Phase 3: ISSUES] ► → [Phase 4: TDD] ○
```

## 시작 프롬프트

파이프라인을 시작할 때 다음과 같이 인사합니다:

```
Feature Development Pipeline을 시작합니다.

[Phase 1: GRILL] ► → [Phase 2: PRD] ○ → [Phase 3: ISSUES] ○ → [Phase 4: TDD] ○

어떤 기능을 구현하고 싶으신가요? 아이디어, 기획서, 또는 간단한 설명이면 충분합니다.
```

## 중간 진입

파이프라인의 중간 단계부터 시작할 수도 있습니다:
- PRD가 이미 있으면 → Phase 3 (ISSUES)부터
- 이슈가 이미 있으면 → Phase 4 (TDD)부터
- 사용자가 단계를 지정하면 해당 단계부터 시작

## 참고 스킬

이 파이프라인은 내부적으로 다음 스킬들의 원칙을 따릅니다:
- `/mp-grill-me` — Phase 1 인터뷰 방법론
- `/mp-to-prd` — Phase 2 PRD 템플릿 및 작성법
- `/mp-to-issues` — Phase 3 vertical slice 분해법
- `/mp-tdd` — Phase 4 TDD 워크플로우
- `/mp-diagnose` — 버그 발생 시 디버깅 루프
