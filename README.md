# Student AI OS

학생이 어떤 AI를 사용하든 학습 기록, 복습 일정, 약점 분석, 부모 리포트를 하나로 연결하는 학생용 AI 학습 운영체제 프로젝트다.

## 현재 상태

- `task-001-responsive-mvp` 브랜치/worktree에서 1차 반응형 웹 MVP 구현
- Next.js + TypeScript + Tailwind CSS 기반 앱 스캐폴드 완료
- 실제 AI API 없이 mock 데이터와 mock 라우팅으로 핵심 제품 흐름 검증 가능

## 왜 이 프로젝트를 하는가

현재 학생들은 여러 AI를 따로 사용하면서 학습 흐름이 끊긴다. 이 프로젝트는 여러 AI를 학생 중심 학습 시스템으로 연결해 장기적인 성적 향상 루프를 만드는 것을 목표로 한다.

## 핵심 컨셉

- AI Router: 과목/질문에 맞는 AI 자동 선택
- Student Memory: 학생별 질문/약점/복습 기록 유지
- Learning Engine: 계획 → 질문 → 채점 → 복습 흐름 연결
- Parent Report: 학부모가 확인할 수 있는 학습 요약 제공

## 구현된 화면

- `/`: 제품 소개, 현재 학생 요약, 핵심 화면 이동 CTA, 최근 학습 메모리
- `/onboarding`: 학생 프로필 입력/수정, 브라우저 localStorage 저장
- `/study`: 질문 입력, 추천 AI 라벨, mock 답변, 복습 항목 생성
- `/review`: 오늘/내일/7일 후/시험 전 복습 큐
- `/parent-report`: 공부 시간, 질문 수, 취약 개념, 추천 액션, 최근 추이

## 실행 방법

```bash
npm install
npm run dev
```

로컬 기본 주소는 `http://localhost:3000`이다. 다른 프로세스가 3000번 포트를 사용하면 Next.js가 대체 포트를 안내한다.

## 검증 방법

```bash
npm run lint
npm run test
npm run build
npm run check
```

## 현재 폴더 구조

```text
.
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ src/
│  ├─ app/
│  ├─ components/
│  └─ lib/
├─ tests/
├─ public/
├─ package.json
├─ AGENTS.md
├─ SPEC.md
├─ ARCH.md
├─ TASK.md
└─ README.md
```

## 작업 원칙

- 큰 구현은 본 프로젝트가 아니라 `worktrees/studentAI/`에서 먼저 진행한다.
- 테스트 통과 후 승인되면 본 프로젝트에 반영한다.
- 민감정보는 문서/코드에 저장하지 않는다.

## 다음 권장 액션

- 브라우저에서 모바일/데스크톱 UX 점검
- mock 데이터 기반 사용자 인터뷰 또는 1차 검증 진행
- 승인 후 본 프로젝트 `main` 반영 여부 결정
- 다음 작업에서 실제 AI API 1종 연동 여부 검토
