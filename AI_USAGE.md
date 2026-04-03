# AI 도구 활용 내역

## 사용 도구

| 도구 | 용도 |
|------|------|
| Claude Code (claude-opus-4-5) | 코드 생성, 아키텍처 설계, 디버깅, 리팩토링 |

---

## 활용 기록

### 2026-04-03: 프로젝트 초기 설정

**프롬프트:**
```
typescript 기반 최신 nextjs 환경 구축해줘 스타일링은 tailwindcss쓸거야
```

**AI 작업 내용:**
- Next.js 16.2.2 + React 19 + TypeScript + Tailwind CSS 4 환경 구축
- `create-next-app@latest` 사용하여 App Router 기반 프로젝트 생성

**의사결정:**
- App Router 사용 (Pages Router 대신 최신 패턴 채택)
- src 디렉토리 구조 사용 (코드 정리 용이)
- ESLint 포함 (코드 품질 관리)

**수정 사항:**
- (없음 - 기본 설정 그대로 사용)

---

### 2026-04-03: API 통신 인프라 구축

**프롬프트:**
```
db.json 기반으로 타입 정의 및 API wrapper 함수 구현
```

**AI 작업 내용:**
- TypeScript 타입 정의 생성 (Campaign, DailyStat 인터페이스)
- fetch 기반 API wrapper 함수 구현
- json-server + Next.js 동시 실행 스크립트 설정

**의사결정:**
- 타입 안전한 API 호출을 위해 제네릭 기반 wrapper 함수 설계
- concurrently로 개발 서버 통합 실행

**수정 사항:**
- API wrapper에 공통 에러 핸들링 로직 분리하여 확장 가능한 구조로 개선
- 도메인별 API 함수(campaignApi, dailyStatApi)를 별도 모듈로 분리할 수 있도록 구조 변경

---

<!-- AI_LOG_MARKER: 새 기록은 이 위에 추가됩니다 -->
