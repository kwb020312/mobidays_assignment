# AI 도구 활용 내역

## 사용 도구

| 도구                          | 용도                                       |
| ----------------------------- | ------------------------------------------ |
| Claude Code (claude-opus-4-5) | 코드 생성, 아키텍처 설계, 디버깅, 리팩토링 |

---

## 활용 기록

### 2026-04-03: 프로젝트 초기 설정

**프롬프트:**

```
TypeScript 기반 최신 Next.js 환경 구축해줘. 스타일링은 Tailwind CSS 사용할거야.
- App Router 기반
- src 디렉토리 구조
- ESLint 포함
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
db.json 스키마를 분석하고:
1. Campaign, DailyStat 타입 정의 생성
2. fetch 기반 타입 안전한 API wrapper 구현
3. json-server와 Next.js 동시 실행 스크립트 설정
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

### 2026-04-03: 파생 지표 계산 유틸리티 구현

**프롬프트:**

```
REQUIREMENTS.md 2.3 파생 지표 계산 요구사항 기반으로:
1. Division by Zero 방지 (CTR, CPC 계산 시 분모가 0인 경우)
2. Null Safety (conversionsValue가 null인 경우)
3. 데이터 정규화 (문자열, NaN, 음수 처리)
위 예외 상황을 처리하는 metrics.ts 유틸리티 구현
```

**AI 작업 내용:**

- 안전한 나눗셈 함수(`safeDivide`) 구현 - 0으로 나누기 방지
- 숫자 정규화 함수(`normalizeNumber`) 구현 - 문자열, NaN, 음수 처리
- 파생 지표 계산 함수 구현 (CTR, CPC, ROAS)

**의사결정:**

- 데이터 예외 상황을 고려한 방어적 프로그래밍 적용
- 각 함수를 독립적으로 설계하여 재사용성 확보

**수정 사항:**

- AI가 제안한 복잡한 타입 정의 및 UI 포맷터 코드 제거
- 유지보수 및 확장 가능성을 고려하여 핵심 유틸리티 함수만 남기고 간결하게 정리
- 계산 함수의 인터페이스를 단순화하여 사용 편의성 개선

---

### 2026-04-06: 타입 시스템 모듈화 리팩토링

**프롬프트:**

```
현재 types/index.ts 단일 파일 구조의 문제점:
- 캠페인, 필터, 공통 타입이 혼재
- 파일이 커지면 관리 어려움

도메인별로 분리해줘:
- common.ts: Platform, CampaignStatus, 레이블 상수
- campaign.ts: Campaign, DailyStat 인터페이스
- filter.ts: DateRange, FilterState
```

**AI 작업 내용:**

- 단일 `types/index.ts` 파일을 도메인별 모듈로 분리
- `common.ts`: 공통 타입(Platform, CampaignStatus) 및 상수 정의
- `campaign.ts`: 캠페인 관련 타입(Campaign, DailyStat, Database)
- `filter.ts`: 필터 관련 타입(DateRange, FilterState)
- API 모듈의 import 경로 업데이트

**의사결정:**

- 단일 파일 대신 도메인별 분리로 코드 응집도 향상
- 상수(STATUS_LABELS, PLATFORM_LABELS 등)를 타입과 함께 배치하여 연관성 유지
- 필터 타입을 별도 모듈로 분리하여 UI 레이어와의 결합도 최소화

**수정 사항:**

- AI가 제안한 단일 파일 구조 대신 유지보수성과 확장성을 고려하여 도메인별 모듈 분리 구조로 재설계
- 불필요한 re-export 패턴 제거하고 명시적 import 경로 사용으로 의존성 명확화

---

### 2026-04-06: 글로벌 필터 컴포넌트 구현 (3.1)

**프롬프트:**

```
REQUIREMENTS.md 3.1 글로벌 필터 구현:
- 집행 기간: DateRangePicker (초기값 당월 1일~말일)
- 상태: 다중 선택 (진행중/일시중지/종료, 초기값 전체)
- 매체: 다중 선택 (Google/Meta/Naver, 초기값 전체)
- 초기화 버튼
- 필터 변경 시 하단 차트/테이블 실시간 동기화

UI는 Shadcn-ui + Tailwind CSS로 전문적이고 현대적으로 구현
```

**AI 작업 내용:**

- Zustand 기반 필터 상태 관리 스토어 구현
- DateRangePicker 컴포넌트 (react-day-picker + 한국어 로케일)
- MultiSelect 컴포넌트 (다중 선택 드롭다운)
- GlobalFilter 컴포넌트 (집행기간, 상태, 매체 필터 + 초기화)
- 메인 페이지 대시보드 레이아웃 구성

**의사결정:**

- Context API 대신 Zustand 채택 (불필요한 리렌더링 방지, 간결한 코드)
- 배열 대신 Set 자료구조 사용 (has() O(1) 조회, 의미적 명확성)
- 빈 Set = 전체 선택 규칙으로 초기값 처리 단순화

**수정 사항:**

- AI가 제안한 Context + useCallback/useMemo 구조를 Zustand로 변경 (리렌더링 최적화)
- 배열 기반 상태를 Set 자료구조로 변경 (has() O(1) 조회 성능, 중복 방지, 의미적 명확성)
- 삼항 연산자 중첩 제거하고 가독성 높은 조건부 렌더링으로 수정
- renderTriggerContent 같은 내부 함수 분리 패턴 제거, return문 내 직접 렌더링으로 변경
- 파일명 kebab-case에서 PascalCase로 변경 (DateRangePicker.tsx)

---

### 2026-04-06: Feature-based 아키텍처 리팩터링

**프롬프트:**

```
REQUIREMENTS.md 5.2 평가 항목 "폴더 구조 및 아키텍처" 기준으로 현재 구조 분석:

현재 문제점:
- 기술 기반 분류 (components/, stores/, types/)
- 필터 관련 코드가 3개 폴더에 분산
- 기능 추가 시 여러 폴더 수정 필요
- 규모 커지면 관리 어려움

Feature-based 구조로 리팩터링:
- shared/: 도메인 무관 공유 자원
- entities/: 도메인 엔티티 (데이터 중심)
- features/: 기능 단위 모듈 (UI + 로직 응집)
```

**AI 작업 내용:**

- 기존 기술 기반 구조를 Feature-based 구조로 전환
- shared/: 도메인 무관 공유 자원 (ui, lib, api, types)
- entities/: 도메인 엔티티 (campaign, daily-stat)
- features/: 기능 단위 모듈 (filter - store, types, ui 응집)
- 각 모듈별 index.ts로 Public API 명확화

**의사결정:**

- Feature-Sliced Design 패턴 일부 적용 (shared → entities → features 계층)
- 기능 삭제 시 폴더 단위 제거 가능하도록 응집도 최대화
- 상대 경로 대신 @/ alias로 import 명확화

**수정 사항:**

- (없음 - 사용자 제안 구조대로 구현)

---

### 2026-04-06: DateRangePicker UX 개선

**프롬프트:**

```
DateRangePicker 년도 선택 UX 개선:
- 현재 문제: 화살표로 월 단위 이동만 가능 → 2002년 선택 시 24번 클릭 필요
- 요구사항: 년/월 드롭다운으로 직접 선택 가능하게

추가 이슈:
- range 모드에서 시작일 2000년 선택 시 종료일 캘린더도 2000년으로 따라감
- 값(2026년)과 UI(2000년)가 불일치
- 해결방안: 시작일/종료일 독립 캘린더로 분리
```

**AI 작업 내용:**

- react-day-picker `captionLayout="dropdown"` 옵션 추가로 년/월 드롭다운 활성화
- range 모드에서 두 캘린더 연동 문제 발견 후, 시작일/종료일 독립 캘린더로 분리
- 커링 함수 `handleSelect("from" | "to")` 패턴으로 핸들러 통합

**의사결정:**

- react-day-picker range 모드는 두 캘린더가 연속 월로 연동되는 게 기본 동작이라 간단히 해결 불가
- 시작일/종료일 분리 방식이 각 캘린더 독립 동작 + 선택 날짜 월 표시로 UX 개선
- `startMonth`/`endMonth`로 2000~2030년 범위 제한

**수정 사항:**

- AI가 제안한 두 개의 핸들러 함수(`handleFromSelect`, `handleToSelect`)를 커링 함수 하나로 통합

---

### 2026-04-06: 일별 추이 차트 구현 (3.2)

**프롬프트:**

```
REQUIREMENTS.md 3.2 일별 추이 차트 구현:
- 필터링된 캠페인의 일별 데이터 시각화
- X축(날짜), Y축(수치), 범례(Legend) 필수
- 메트릭 토글: 노출수/클릭수 초기 활성화, 최소 1개 선택 유지
- 호버 시 툴팁 표시

기술 스택:
- shadcn-ui chart 컴포넌트 + recharts 기반
- 기존 Feature-based 아키텍처 유지 (features/dailyTrendChart)
- 글로벌 필터 store(Zustand)와 실시간 연동
```

**AI 작업 내용:**

- recharts 패키지 및 shadcn-ui chart 컴포넌트 설치
- `features/dailyTrendChart` 모듈 생성 (Feature-based 구조)
  - `types.ts`: DailyMetric, AggregatedDailyStat 타입 정의
  - `hooks/useFilteredDailyStats.ts`: 필터링된 데이터 집계 훅
  - `ui/MetricToggle.tsx`: 메트릭 토글 버튼 컴포넌트
  - `ui/DailyTrendChart.tsx`: 라인 차트 메인 컴포넌트
- 글로벌 필터 연동 (Zustand store 구독)
- 데이터 전처리 (날짜 정규화, null safety, Division by Zero 방지)

**의사결정:**

- shadcn-ui chart + recharts 조합 (일관된 디자인 시스템, 충분한 커스터마이징)
- LineChart 선택 (일별 추이 시각화에 적합)
- Set 자료구조 기반 메트릭 토글 (O(1) 조회, 필터와 일관성)

**수정 사항:**

- AI가 제안한 폴더명 `daily-trend-chart`를 `dailyTrendChart` (카멜케이스)로 변경
- useMemo/useCallback 제거 (React Compiler 1.0이 자동 처리)
- useState 초기화 구문 간소화 (`() => new Set()` → `new Set()`)
- selectEffectiveStatus/Platform 반환 타입을 배열에서 Set으로 변경 (`.includes()` → `.has()` O(1) 조회)
- filteredCampaignIds도 Set으로 변경하여 일관된 O(1) 조회 적용

---

### 2026-04-06: API 엔드포인트 수정 및 Null Safety 강화

**프롬프트:**

```
dailyStatApi에서 404 에러 발생 원인 분석:
- campaigns는 정상 동작하는데 dailyStats만 404
- REQUIREMENTS.md의 Null Safety 평가 포인트 대응 필요
```

**AI 작업 내용:**

- db.json 키(`daily_stats`)와 API 호출(`/dailyStats`) 불일치 발견 및 수정
- `normalizeDate` 함수 Null Safety 강화 (null/undefined 입력 처리)
- 범용 유틸 함수(`normalizeDate`, `normalizeNumber`)를 `@/shared/lib`로 이동

**의사결정:**

- json-server는 db.json 키를 엔드포인트로 사용 → API 코드 수정이 적절
- 데이터 전처리 함수는 여러 feature에서 재사용 가능 → shared 레이어 배치

**수정 사항:**

- AI가 생성한 로컬 유틸 함수를 shared 모듈로 이동 제안 (코드 중복 방지 및 일관성 확보)

---

### 2026-04-06: 데이터 패칭 전략 검토 (SSR vs CSR, React Query)

**프롬프트:**

```
현재 useEffect + useState 기반 CSR 데이터 패칭 구조에 대해:
1. SSR로 변경하는 것이 적절한지 검토
2. React Query 도입 필요성 검토
REQUIREMENTS.md 요구사항 기준으로 판단
```

**AI 작업 내용:**

- REQUIREMENTS.md 요구사항 기반 아키텍처 분석
- CSR vs SSR, React Query 도입 여부 트레이드오프 검토

**의사결정:**

- **CSR 유지**: 실시간 필터 동기화, 클라이언트 메모리 상태 병합(신규 등록), SEO 불필요
- **React Query 미도입**: 단일 초기 fetch, 서버 동기화 없음, 현재 구조로 충분

**수정 사항:**

- (없음 - 기존 구조가 요구사항에 적합하다고 판단하여 유지)

---

### 2026-04-06: 일별 추이 차트 렌더링 버그 수정

**프롬프트:**

```
일별 추이 차트(LineChart)가 렌더링되지 않는 이슈 디버깅 요청
- 데이터 패칭 성공, 값도 정상 반환
- 차트 영역만 빈 화면으로 표시
```

**AI 작업 내용:**

- ChartContainer, useFilteredDailyStats, types.ts 등 관련 코드 분석
- globals.css의 CSS 변수 정의 확인
- 두 가지 근본 원인 발견 및 수정:
  1. `ChartContainer` 기본 클래스의 `aspect-video`와 명시적 높이 `h-[300px]` 충돌
  2. CSS 색상 함수 불일치 (`hsl(var(--chart-1))` vs 실제 값 `oklch(...)`)

**의사결정:**

- AI의 초기 진단(aspect-video 충돌)만으로 문제 해결되지 않아 추가 분석 진행
- CSS 변수 체인을 끝까지 추적하여 `hsl()` 래퍼와 `oklch()` 값의 불일치 발견
- shadcn-ui chart 컴포넌트가 oklch 색상 체계를 사용하므로 hsl 래퍼 제거가 적절

**수정 사항:**

- AI의 1차 수정안(aspect-auto 추가)이 부분적 해결에 그쳐, CSS 변수 체인 전체를 재검토하여 근본 원인 도출
- 두 가지 수정사항 모두 적용하여 문제 해결:
  - `DailyTrendChart.tsx`: `className="aspect-auto h-[300px] w-full"` 추가
  - `types.ts`: `hsl(var(--chart-N))` → `var(--chart-N)` 으로 변경

---

### 2026-04-06: 일별 추이 차트 아키텍처 개선 및 UX 최적화

**프롬프트:**

```
일별 추이 차트의 관심사 분리 및 시각적 명확성 개선:
1. UI 컴포넌트 내 유틸리티 함수를 lib 레이어로 분리하여 테스트 용이성 확보
2. 듀얼 Y축 구현으로 노출수/클릭수 스케일 독립 표시 (데이터 왜곡 방지)
3. 각 축의 범주 라벨링 및 조회 기간 명시로 차트 가독성 향상
4. 불필요한 메트릭(전환수, 비용) 제거로 핵심 지표 집중
```

**AI 작업 내용:**

- `lib/formatters.ts` 모듈 분리 (formatNumber, formatXAxisDate, formatTooltipDate, formatDateRange)
- Recharts 듀얼 Y축 구현 (yAxisId="left" 노출수, yAxisId="right" 클릭수)
- Y축 Label 컴포넌트 추가로 각 축의 메트릭 명시
- CardDescription에 조회 기간 표시 (글로벌 필터 dateRange 연동)
- types.ts, useFilteredDailyStats.ts에서 conversions/cost 필드 제거

**의사결정:**

- 포맷터 함수를 lib 레이어로 분리하여 단위 테스트 가능하고 재사용 가능한 구조로 개선
- 노출수와 클릭수는 스케일 차이가 커서 단일 Y축 사용 시 작은 값이 시각적으로 무의미해지는 문제 → 듀얼 Y축으로 각 메트릭의 추이를 명확히 표현
- 요구사항 3.2 기준 핵심 지표(노출수, 클릭수)에 집중하여 차트 복잡도 감소

**수정 사항:**

- AI 초기 구현에서 단일 Y축으로 제안했으나, 데이터 시각화 관점에서 스케일 차이로 인한 정보 손실 문제를 제기하여 듀얼 Y축 구조로 재설계
- 조회 기간 미표시로 인한 사용자 혼란 가능성을 지적하여 CardDescription 추가

---

### 2026-04-06: 차트 색상 시스템 개선

**프롬프트:**

```
현재 차트 색상(--chart-1 ~ --chart-5)이 무채색(oklch chroma=0)으로 설정되어 있어
시각적 구분이 불가능한 문제 해결:
- 노출수 라인이 배경과 거의 구분되지 않음
- 다중 라인 차트에서 범례와 라인 매칭 어려움
색각 접근성과 명도 대비를 고려한 색상 팔레트로 재설계
```

**AI 작업 내용:**

- globals.css의 --chart-1 ~ --chart-5 CSS 변수를 유채색으로 변경
- 라이트/다크 모드 각각에 대해 명도 조정된 색상 적용
- oklch 색공간 활용으로 지각적으로 균등한 색상 간격 유지

**의사결정:**

- oklch 색공간 유지 (Tailwind CSS 4 기본 색상 체계와 일관성)
- 파란색-주황색 조합을 주요 색상으로 배치 (색각 이상자도 구분 가능한 보색 대비)
- 다크 모드에서 약간 높은 명도(lightness) 적용으로 가독성 확보

**수정 사항:**

- Shadcn-ui 기본 생성 색상이 무채색(grayscale)으로 설정된 문제 발견
- 데이터 시각화 목적에 맞지 않는 기본값을 실무에서 사용 가능한 색상 팔레트로 전면 교체

---

### 2026-04-06: 날짜 프리셋 버튼 및 상수 모듈화

**프롬프트:**

```
DateRangePicker에 빠른 선택 프리셋 추가:
- 오늘, 이번 주, 이번 달, 최근 3개월
- 1월 ~ 12월 (올해 기준)
- 버튼 그룹 형태로 필터 아래 배치
```

**AI 작업 내용:**

- `DatePresets.tsx` 컴포넌트 생성 (date-fns 기반 날짜 범위 계산)
- DATE_PRESETS: 상대적 기간 (오늘, 이번 주, 이번 달, 최근 3개월)
- MONTH_PRESETS: 월별 선택 (1월~12월)
- GlobalFilter 하단에 "빠른 선택:" 버튼 그룹 배치
- `constants/` 폴더 생성 및 STATUS_OPTIONS, PLATFORM_OPTIONS 분리

**의사결정:**

- 프리셋 UI를 드롭다운/캘린더 사이드바 대신 버튼 그룹으로 선택 (사용자 요청)
- date-fns 함수 활용으로 상대적 날짜 계산 (startOfWeek, subMonths 등)
- 프리셋 로직을 별도 컴포넌트로 분리하여 GlobalFilter 간결화
- 필터 옵션 상수를 constants 폴더로 분리하여 관심사 분리

**수정 사항:**

- AI가 constants.ts 단일 파일로 제안했으나, 사용자 요청에 따라 constants/ 폴더 구조로 변경

---

### 2026-04-06: 캠페인 관리 테이블 구현 (3.3)

**프롬프트:**

```
REQUIREMENTS.md 3.3 캠페인 관리 테이블 구현:
- 컬럼: 캠페인명, 상태, 매체, 집행기간, 총 집행금액, CTR, CPC, ROAS
- 정렬: 집행기간, 총 집행금액, CTR, CPC, ROAS 오름차순/내림차순
- 검색: 캠페인명 실시간 검색 (테이블에만 적용), 검색 결과/전체 건수 표시
- 페이지네이션: 10건/페이지
- 일괄 상태 변경: 체크박스 선택 → 드롭다운 상태 변경

기존 Feature-based 아키텍처 유지, 글로벌 필터와 실시간 연동
```

**AI 작업 내용:**

- `shared/ui` 컴포넌트 추가 (Table, Select, Input)
- `shared/stores/dataStore.ts` 생성 (API 데이터 중앙 관리)
- `shared/providers/DataProvider.tsx` 생성 (앱 초기화 시 데이터 로드)
- `features/campaignTable` 모듈 생성
  - `types.ts`: CampaignTableRow, SortState 타입 정의
  - `lib/calculations.ts`: 집계 메트릭 및 파생 지표 계산
  - `hooks/useFilteredCampaigns.ts`: 필터링 + 지표 계산 훅
  - `ui/CampaignTable.tsx`: 테이블 메인 컴포넌트
  - `constants/index.ts`: 상태 배지 색상 매핑

**의사결정:**

- Zustand 기반 데이터 스토어로 API 호출 중앙화 (여러 컴포넌트에서 중복 fetch 방지)
- `table-fixed` + 퍼센테이지 너비로 정렬 시 레이아웃 안정성 확보
- lucide-react 아이콘 + CSS rotate로 정렬 방향 표시 (아이콘 교체 대신 회전)

**수정 사항:**

- **데이터 패칭 구조 전면 재설계**: AI가 제안한 각 훅에서 개별 API 호출 구조를 "스토어에 한 번 저장 후 재사용" 구조로 변경. 불필요한 중복 fetch 제거 및 성능 최적화
- **계산 함수 위치 조정**: AI가 `entities/dailyStat/lib.ts`에 배치한 CTR/CPC/ROAS 계산 함수를 `features/campaignTable/lib`로 이동. 해당 함수들이 테이블에서만 사용되므로 피처 단위 관리가 적절
- **포매터 함수 공유화**: AI가 피처 내부에 생성한 formatters를 `shared/lib`로 이동. 여러 피처에서 재사용 가능한 범용 함수임을 지적
- **useMemo 전면 제거**: React Compiler 1.0 도입으로 자동 메모이제이션되므로 수동 useMemo 불필요
- **정렬 아이콘 구현 수정**: AI가 제안한 `ArrowUpDown` 아이콘은 대칭이라 180도 회전해도 시각적 차이 없음 → `ArrowUp` 아이콘으로 변경하고 고정 크기 컨테이너로 감싸 회전 시 레이아웃 흔들림 방지
- **테이블 레이아웃 안정화**: 정렬 변경 시 컬럼 너비가 데이터에 따라 변동하는 문제 → `table-fixed` + 퍼센테이지 너비 지정으로 해결
- **Null Safety 보완**: `row.name?.toLowerCase()` 옵셔널 체이닝 추가 (db.json에 name이 null인 데이터 존재)

---

### 2026-04-06: 캠페인 테이블 UX 개선

**프롬프트:**

```
1. 캠페인 컬럼 ellipsis 적용, 줄바꿈 금지 및 hover 시 tooltip 표시
2. 테이블 내 CLS 개선 - 검색 결과가 적거나 마지막 페이지일 때 레이아웃 흔들림 방지
3. 페이지네이션 하단 고정 - 테이블 행 수에 따라 위치 변하지 않도록
4. 컬럼 헤더와 셀 정렬 일치 - 숫자 컬럼 헤더/셀 모두 오른쪽 정렬
```

**AI 작업 내용:**

- 캠페인명 셀에 `truncate` 클래스 적용 (overflow-hidden + text-ellipsis + whitespace-nowrap)
- `title` 속성으로 hover 시 브라우저 기본 tooltip 표시
- 테이블 영역에 `min-h-[540px]` 최소 높이 적용 (10행 기준)
- flex 컨테이너 + `mt-auto`로 페이지네이션 하단 고정
- 페이지네이션 조건부 렌더링을 `invisible` 클래스로 변경 (공간 유지)
- `renderSortableHeader`에 `align` 파라미터 추가
- 숫자 컬럼(총 집행금액, CTR, CPC, ROAS) 헤더에 `text-right` 적용

**의사결정:**

- 커스텀 tooltip 컴포넌트 대신 네이티브 `title` 속성 사용 (단순성, 접근성)
- 고정 행 높이 대신 최소 컨테이너 높이 방식 선택 (사용자 피드백 반영)
- 조건부 렌더링 제거 대신 `invisible` 클래스 사용으로 DOM 구조 유지하며 CLS 방지

**수정 사항:**

- AI가 제안한 테이블 행 고정 높이(`h-[52px]`) 방식을 사용자 요청에 따라 제거
- 컨테이너 레벨 최소 높이 + flex 레이아웃 조합으로 대안 구현

---

### 2026-04-06: 캠페인 등록 모달 구현 (3.4)

**프롬프트:**

```
REQUIREMENTS.md 3.4 캠페인 등록 모달 구현:
- 입력 필드: 캠페인명, 광고 매체, 예산, 집행 금액, 시작일, 종료일
- 유효성 검사: RHF(React Hook Form) + Zod 조합
- 자동 설정: 상태는 active 고정, ID는 자동 생성
- 등록 성공 시 목록과 차트에 즉시 반영
- 테이블에서 없는 지표는 `-`로 표시
```

**AI 작업 내용:**

- `react-hook-form`, `@hookform/resolvers`, `zod` 패키지 설치
- `shared/ui`에 Dialog, Label 컴포넌트 추가 (shadcn-ui 기반)
- `features/campaignTable/schema.ts` 생성 (Zod 스키마 정의)
  - 캠페인명: 2~100자
  - 광고 매체: Google/Meta/Naver enum
  - 예산: 100원 ~ 10억원 정수
  - 집행 금액: 0원 ~ 예산 이하 정수
  - 시작일/종료일: 필수, 종료일 >= 시작일 refine 검증
- `CampaignRegistrationModal.tsx` 구현 (RHF + zodResolver 연동)
- 달력에 년도/월 드롭다운 추가 (`captionLayout="dropdown"`)
- `CampaignTable` 헤더에 등록 버튼 배치

**의사결정:**

- RHF + Zod 조합 선택 (비제어 컴포넌트 기반 성능 최적화, 타입 안정성)
- 신규 캠페인은 dailyStats가 없어 지표 0 또는 `-` 표시 (요구사항 명시)
- 입력받은 집행 금액은 validation 용도로만 사용 (실제 지표는 dailyStats 합산)

**수정 사항:**

- Zod v4 문법 변경으로 `required_error`, `invalid_type_error` 대신 `message` 사용
- `MAX_BUDGET`, `MIN_BUDGET` 상수를 `constants/` 폴더로 분리 (사용자 요청)
- 달력 범위 상수를 `shared/constants/calendar.ts`로 분리하여 공용화 (사용자 요청)
- 신규 캠페인이 목록 앞쪽에 추가되도록 `addCampaign` 로직 수정 (`[campaign, ...state.campaigns]`)
- `formatCurrency`에 0일 때 `-` 반환 로직 추가 (총 집행금액 포맷 동기화)

---

### 2026-04-07: 플랫폼별 성과 차트 구현 (4.1 선택 과제)

**프롬프트:**

```
REQUIREMENTS.md 4.1 플랫폼별 성과 차트(Donut) 구현:
- 메트릭 토글: 비용 / 노출수 / 클릭수 / 전환수 (기본값: 비용)
- 차트: 플랫폼별(Google / Meta / Naver) 비중 표시
- 메트릭 수치와 비중(%) 동시 표기
- 차트 클릭 시 글로벌 필터와 양방향 연동
```

**AI 작업 내용:**

- `features/platformChart` 모듈 생성 (Feature-based 구조)
  - `types/index.ts`: PlatformMetric, PlatformStat 타입 정의
  - `constants/index.ts`: 메트릭 옵션, 플랫폼 색상, 차트 설정
  - `hooks/usePlatformStats.ts`: 플랫폼별 데이터 집계 훅
  - `ui/PlatformMetricToggle.tsx`: 메트릭 선택 토글
  - `ui/PlatformChart.tsx`: Recharts PieChart 기반 Donut 차트
- 공통 캠페인 필터링 유틸 함수 분리 (`shared/lib/campaignFilter.ts`)
  - `getFilteredCampaignIds()`: 필터 조건에 맞는 캠페인 ID Set 반환
  - `getFilteredCampaigns()`: 필터 조건에 맞는 캠페인 배열 반환
  - `filterDailyStatsByDate()`: 날짜 범위 필터링
  - `getFilteredDailyStats()`: 캠페인 ID + 날짜 범위 필터링
- 기존 `useFilteredDailyStats`, `useFilteredCampaigns` 훅 리팩토링 (공통 유틸 사용)
- 대시보드 레이아웃 변경 (일별 추이 차트 | 플랫폼 차트 2열 배치)

**의사결정:**

- Recharts PieChart + innerRadius로 Donut 차트 구현 (기존 차트 라이브러리 일관성)
- 양방향 필터 연동은 Zustand `togglePlatform` 재활용 (새 로직 불필요)
- 캠페인 필터링 로직이 3개 훅에서 중복되어 공통 유틸로 분리 (DRY 원칙)
- `isPlatformSelected` 헬퍼 함수로 opacity 삼항연산자 가독성 개선

**수정 사항:**

- AI가 제안한 `useMemo` 제거 (React Compiler 1.0 자동 메모이제이션)
- 상수를 `types.ts`에서 `constants/index.ts`로 분리 (사용자 요청)
- 파일명 `campaign-filter.ts`를 `campaignFilter.ts`로 camelCase 변경 (사용자 요청)
- `chartConfig`를 컴포넌트 내부에서 상수로 분리 (사용자 요청)
- opacity 삼항연산자를 `isSelected` 변수로 분리하여 유지보수성 개선 (사용자 요청)
- 툴팁에 플랫폼별 색상 인디케이터 및 퍼센테이지 추가 (사용자 요청)
- `types.ts`를 `types/index.ts` 폴더 구조로 변경 (다른 폴더들과 일관성 유지, 사용자 요청)

---

<!-- AI_LOG_MARKER: 새 기록은 이 위에 추가됩니다 -->
