# Student AI OS

학생이 어떤 AI를 사용하든 학습 기록, 복습 일정, 약점 분석, 부모 리포트를 하나로 연결하는 학생용 AI 학습 운영체제 프로젝트다.

## 현재 상태

- 신규 프로젝트 문서 셋업 완료
- 아직 앱 스캐폴드와 런타임 코드는 없음
- 다음 단계에서 MVP 범위 확정 후 worktree 기반 구현 예정

## 왜 이 프로젝트를 하는가

현재 학생들은 여러 AI를 따로 사용하면서 학습 흐름이 끊긴다. 이 프로젝트는 여러 AI를 학생 중심 학습 시스템으로 연결해 장기적인 성적 향상 루프를 만드는 것을 목표로 한다.

## 핵심 컨셉

- AI Router: 과목/질문에 맞는 AI 자동 선택
- Student Memory: 학생별 질문/약점/복습 기록 유지
- Learning Engine: 계획 → 질문 → 채점 → 복습 흐름 연결
- Parent Report: 학부모가 확인할 수 있는 학습 요약 제공

## 현재 폴더 구조

```text
.
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ src/
├─ tests/
├─ public/
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

- MVP 기능명세 세분화
- 기술 스택 선택
- 첫 번째 구현 TASK 작성
- worktree 생성 후 Codex 실행
