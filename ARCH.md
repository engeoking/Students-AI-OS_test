# ARCH.md

## 제품 방향

Student AI OS는 단순 챗봇이 아니라 학생 프로필, AI 라우팅, 학습 메모리, 복습 엔진, 부모 리포트를 묶는 운영체제형 서비스로 설계한다.

## 초기 기술 스택 가정

- 프론트엔드: Next.js App Router + TypeScript
- 스타일: Tailwind CSS
- 테스트: Vitest + React Testing Library
- 상태: React local state + 온보딩 프로필 localStorage
- 데이터: `src/lib/mock-data.ts` fixture

1차 검증용 MVP에서는 서버, 인증, 실제 AI 계층, 운영 데이터 저장소를 만들지 않는다.

## 폴더 구조

```text
.
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ src/
│  ├─ app/
│  │  ├─ onboarding/
│  │  ├─ study/
│  │  ├─ review/
│  │  └─ parent-report/
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

## 핵심 시스템 구성

1. Student Profile
   - 학년, 과목 목표, 최근 점수, 시험 일정, 학습 선호
2. AI Router
   - 질문 의도/과목 기반 mock AI 라벨 선택
3. Memory Engine
   - 질문 기록, 약점 개념, 복습 상태를 fixture와 화면 state로 표현
4. Learning Engine
   - 질문 입력 후 mock 답변과 복습 항목 생성
5. Parent Reporting
   - fixture 기반 학습 요약과 추천 액션 표시

## 데이터 저장 방식

- 1차 MVP는 mock fixture와 localStorage만 사용한다.
- 온보딩 프로필 수정값은 브라우저 localStorage에 저장한다.
- 학생 프로필, 학습 세션, 복습 일정, 리포트 이력을 구조화 저장
- 대화 원문은 필요한 최소 범위만 저장하고 개인정보 최소화 원칙 적용
- AI 모델별 원시 응답보다 학생 중심 요약/태그 데이터를 우선 저장

## 인증/권한

- 학생 계정
- 학부모 조회 권한
- 운영자 권한

세부 정책은 MVP 범위 확정 후 정의한다.

## 배포 방식

- 초기에는 단일 웹 앱 + API 서비스 구조를 우선 검토
- 대규모 확장 전까지는 단순 배포/운영 구조 유지

## 보안 고려사항

- API 키, 토큰, 비밀번호, 개인정보, `.env` 값은 코드나 문서에 저장하지 않는다.
- 학생 데이터는 최소 수집 원칙을 적용한다.
- 외부 AI 연동 시 환경변수 이름만 문서화한다.
- 학부모/학생 데이터 접근 권한을 분리한다.

## 확장 가능성

- 과목별 특화 학습 플로우 추가
- 학원/학교 B2B 대시보드 확장
- 시험 특화 국가별 버전 분화
- 하드웨어/NFC 진입점 연동
