# TASK.md

## 현재 작업명

Student AI 반응형 웹 MVP 1차 구현

## 작업 분류

- 신규 프로젝트
- 문서 단계에서 구현 단계로 전환하는 첫 작업

## 목표

Student AI OS의 핵심 가설을 빠르게 검증할 수 있는 반응형 웹 MVP를 만든다. 이번 단계에서는 실제 다중 AI 연동이나 운영 배포보다, 학생 프로필 → 학습 허브 → 복습 큐 → 부모 리포트까지 이어지는 핵심 사용자 흐름을 브라우저에서 확인 가능하게 만드는 데 집중한다.

## 포함 범위

- 프로젝트를 실제 웹 앱 개발이 가능한 형태로 스캐폴딩
- 반응형 UI 구현 (모바일 우선, 데스크톱 대응)
- 아래 4개 핵심 화면 구현
  1. 학생 온보딩/프로필 입력
  2. 학습 허브(질문 입력 + AI 응답 mock + 추천 모델 표시)
  3. 복습 큐/오답·약점 화면
  4. 부모 요약 리포트 화면
- 로컬 mock 데이터 또는 간단한 로컬 저장 기반 상태 관리
- 최소 테스트 및 `npm run check` 가능한 검증 구조 마련
- README 업데이트

## 제외 범위

- 실제 OpenAI/Claude/Qwen 등 외부 AI API 연동
- 로그인/회원가입/실제 권한 시스템
- 결제
- School Dashboard
- Smart Pen / NFC / 하드웨어
- 프로덕션 배포 자동화
- 서버리스/백엔드 인프라 고도화

## 완료 기준

- [x] `/home/merlin/worktrees/studentAI/task-001-responsive-mvp`에서 작업한다.
- [x] 웹 앱이 로컬에서 실행된다.
- [x] 모바일 폭과 데스크톱 폭 모두에서 레이아웃이 무너지지 않는다.
- [x] 학생 프로필, 학습 허브, 복습 큐, 부모 리포트 화면이 연결된다.
- [x] 실제 AI 대신 mock 로직으로도 제품 흐름이 이해된다.
- [x] `npm run check`가 통과한다.
- [x] 변경 파일, 실행 명령, 테스트 결과, 리스크를 보고할 수 있다.

## 구현 메모

- 1차 구현 브랜치: `task-001-responsive-mvp`
- 작업 worktree: `/home/merlin/worktrees/studentAI/task-001-responsive-mvp`
- 실제 AI API, 인증, 결제, School Dashboard, Smart Pen은 구현하지 않았다.
- mock 데이터는 `src/lib/mock-data.ts`, mock 라우팅/복습 생성 로직은 `src/lib/student-os.ts`에 모았다.

## 권장 기술 방향

- 프레임워크: Next.js + TypeScript
- 스타일: Tailwind CSS
- 테스트: Vitest + React Testing Library
- 상태: local state 또는 간단한 store
- 데이터: mock fixtures 또는 localStorage

구체 구현은 Codex가 실제 스캐폴드와 검증 편의성을 고려해 최소 복잡도로 확정한다.

## 테스트 기준

- `npm install` 또는 이에 준하는 의존성 설치 완료
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check`
- 필요 시 핵심 컴포넌트/화면 최소 회귀 테스트 추가

## UI/제품 요구사항

- 첫 인상은 교육용 SaaS처럼 깔끔하고 신뢰감 있게 만든다.
- 반응형은 모바일 우선으로 설계한다.
- 더미 데이터라도 학생의 목표/점수/시험일까지 남은 기간/취약 과목/복습 상태가 드러나야 한다.
- 학습 허브는 “질문 → 추천 AI → 답변 요약 → 복습 생성” 흐름이 보여야 한다.
- 부모 리포트는 학습시간, 질문 수, 취약 개념, 추천 액션을 카드 형태로 보여준다.

## 다음 작업 후보

1. mock 기반 MVP 사용성 점검
2. 실제 AI API 1종 연동
3. 학생 데이터 모델 정교화
4. 학부모 리포트 심화
5. 인증/권한 구조 설계

## Codex 작업 지시

- 먼저 `AGENTS.md`, `SPEC.md`, `ARCH.md`, `TASK.md`, `README.md`를 읽는다.
- 프로젝트가 git 저장소가 아니면 초기화 후 문서 파일 기준 첫 커밋을 만든다.
- 그 다음 branch/worktree 기반으로 작업 공간을 만든다.
- 구현은 worktree에서만 진행한다.
- 테스트가 없으면 최소 회귀 테스트를 추가한다.
- 완료 전 반드시 `npm run check`를 통과시킨다.
- 마지막 보고에는 변경 파일, 실행 명령, 테스트 결과, 남은 리스크, 승인 필요 항목을 포함한다.
