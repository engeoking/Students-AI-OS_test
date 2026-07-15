# Student AI Responsive Web MVP - Codex CLI 지시서

아래 내용을 Codex CLI에 그대로 전달해서 실행해.

---

너는 개발팀장 Codex CLI다.
작업 목적은 Student AI OS의 1차 검증용 반응형 웹 MVP를 만드는 것이다.

반드시 아래 회사 운영 규칙을 따른다.
1. 전역 규칙 먼저 읽기
   - `~/.codex/AGENTS.md`
   - `/home/merlin/hq/company-os.md`
2. 프로젝트 규칙 먼저 읽기
   - `/home/merlin/projects/studentAI/AGENTS.md`
   - `/home/merlin/projects/studentAI/SPEC.md`
   - `/home/merlin/projects/studentAI/ARCH.md`
   - `/home/merlin/projects/studentAI/TASK.md`
   - `/home/merlin/projects/studentAI/README.md`
3. 본 프로젝트에서 바로 대규모 수정하지 말고 branch/worktree에서 먼저 작업
4. 테스트 통과 전 완료 보고 금지
5. 마지막 보고에는 변경 파일, 실행 명령, 테스트 결과, 남은 리스크, 승인 필요 항목 포함

작업 분류:
- 신규 프로젝트의 첫 구현 작업

작업 경로:
- 본 프로젝트: `/home/merlin/projects/studentAI`
- 작업 worktree: `/home/merlin/worktrees/studentAI/task-001-responsive-mvp`
- 브랜치명 권장: `task-001-responsive-mvp`

중요 전제:
- 현재 `/home/merlin/projects/studentAI`는 문서만 있는 초기 상태일 수 있다.
- git 저장소가 아니면 먼저 git init 하고 현재 문서 파일 기준 초기 커밋을 만든 뒤 worktree를 생성하라.
- worktree를 만들 수 없는 상태면 그 원인을 해결한 뒤 진행하라.

목표:
Student AI OS의 핵심 흐름을 브라우저에서 검증 가능한 반응형 웹 MVP를 구현한다.
이번 단계에서는 실제 AI API 연동 없이 mock 데이터와 mock 응답으로 제품 경험을 보여주는 것이 목적이다.

반드시 구현할 핵심 사용자 흐름:
1. 학생 온보딩/프로필 입력
   - 학년
   - 목표 과목
   - 최근 점수
   - 시험일까지 남은 일수
   - 취약 과목/취약 단원
2. 학습 허브
   - 학생이 질문 입력
   - 질문 유형에 따라 추천 AI 라벨 표시 예: Math Tutor / English Coach / Coding Mentor
   - mock 답변 표시
   - 답변 이후 복습 항목이 생성되는 흐름 표시
3. 복습 큐
   - 오늘 복습
   - 내일 복습
   - 7일 후 복습
   - 시험 전 최종 복습
   - 취약 개념/오답 개념 카드 표시
4. 부모 리포트
   - 오늘 공부 시간
   - 질문 수
   - 취약 개념
   - 추천 액션
   - 최근 학습 추이 요약

제품 요구사항:
- 모바일 우선 반응형 웹으로 구현
- 데스크톱에서도 레이아웃이 자연스럽게 확장되어야 함
- 첫 인상은 깔끔한 교육 SaaS 느낌
- 실제 운영 서비스처럼 보이되 복잡성은 최소화
- 더미 데이터라도 학생 성장을 관리하는 OS 느낌이 보여야 함

기술 방향:
- Next.js + TypeScript 사용 권장
- Tailwind CSS 사용 권장
- 테스트는 Vitest + React Testing Library 권장
- 상태 관리는 최소 복잡도 원칙으로 선택
- localStorage 또는 mock fixture 사용 가능
- YAGNI: 서버, 인증, 실AI연동, 결제는 이번 작업에서 하지 말 것

필수 산출물:
- 실행 가능한 웹 앱
- 반응형 주요 화면 4종
- 프로젝트 구조 정리
- 최소 테스트
- `npm run check` 가능한 스크립트 구성
- 업데이트된 `README.md`
- 필요하면 `SPEC.md`/`ARCH.md`에 구현 기준 최소 업데이트

권장 라우트 또는 화면 구조 예시:
- `/` : 제품 소개 + 현재 학생 요약 + 핵심 이동 CTA
- `/onboarding` : 학생 프로필 입력 또는 수정
- `/study` : 학습 허브
- `/review` : 복습 큐
- `/parent-report` : 부모 리포트

최소 데이터 모델 예시:
- studentProfile
  - name
  - grade
  - targetSubjects
  - recentScores
  - examDate
  - weakTopics
  - preferredStudyTime
- studySession
  - question
  - subject
  - recommendedAi
  - summary
  - createdReviewItems
- reviewItem
  - topic
  - dueBucket: today | tomorrow | in7days | beforeExam
  - status
- parentSummary
  - studyMinutes
  - questionCount
  - weakConcepts
  - recommendedAction

UI 우선순위:
1. 레이아웃 안정성
2. 핵심 흐름 연결감
3. 정보 구조 명확성
4. 테스트
5. 시각 polish

작업 방식:
1. 문서 읽기
2. git 저장소 초기화 여부 확인
3. 필요 시 초기 커밋 생성
4. branch/worktree 생성
5. worktree에서 앱 스캐폴드
6. 핵심 화면 구현
7. mock 데이터 연결
8. 테스트 추가
9. `npm run check` 통과
10. 최종 보고

검증 기준:
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check`

완료 보고 형식:
1. 작업 요약
2. 변경 파일
3. 실행 명령
4. 테스트 결과
5. 남은 리스크
6. 승인 필요 항목

중요 금지사항:
- 실제 AI API 키 요구하지 말 것
- `.env`에 민감정보 쓰지 말 것
- 본 프로젝트 루트에서 바로 대규모 구현하지 말 것
- TASK 범위 밖 기능 추가하지 말 것
- Smart Pen, School Dashboard, 결제, 인증까지 확장하지 말 것

구현 품질 기준:
- 읽기 쉬운 컴포넌트 구조
- 과한 추상화 금지
- mock 데이터는 한 곳에 모아서 관리
- 모바일/데스크톱에서 모두 usable 해야 함
- 테스트 없는 핵심 로직이 남지 않게 할 것

시작해.
끝까지 구현하고 검증까지 완료한 뒤 보고해.
