# 마케팅 캠페인 대시보드

마케팅 캠페인의 성과를 시각화하고 관리하는 대시보드 애플리케이션입니다.

## 실행 방법

### 사전 요구사항

- Node.js 18.17 이상
- npm 9 이상

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (Vite + json-server 동시 실행)
npm run dev
```

개발 서버가 실행되면 브라우저에서 [http://localhost:5173](http://localhost:5173)으로 접속합니다.

> **참고**: `npm run dev` 실행 시 Vite(포트 5173)와 json-server(포트 4000)가 동시에 실행됩니다.

### 개별 실행 (선택)

```bash
# Vite 개발 서버만 실행
npm run dev:client

# json-server만 실행
npm run dev:server

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트 검사
npm run lint
```

---

## 기술 스택 선택 근거

### 빌드 도구: Vite + React 19 (Next.js에서 전환)

#### 전환 배경

초기에는 JD의 "서버 사이드 언어 활용 가능자" 및 Next.js 관련 스펙을 확인하고 Next.js로 프로젝트를 시작했습니다. 그러나 과제를 진행하며 **현재 요구사항에서 Next.js의 핵심 기능이 불필요**함을 인지하고 Vite + React로 전환했습니다.

#### Next.js가 불필요한 이유

| 요구사항                 | Next.js 기능 활용 여부                   |
| ------------------------ | ---------------------------------------- |
| json-server 기반 API     | 빌드 타임 데이터 없음 → **SSG 불가**     |
| 실시간 필터/차트 동기화  | 클라이언트 상태 기반 → **SSR 이점 없음** |
| 캠페인 등록 후 즉시 반영 | 클라이언트 상태 관리 필수                |
| 단일 페이지 대시보드     | 복잡한 라우팅 불필요                     |
| SEO                      | 내부 도구로 **불필요**                   |

```
[빌드 타임]     json-server 미실행 → SSG/ISR 불가
[런타임 SSR]    필터 변경마다 재계산 필요 → SSR 이점 상쇄
[결론]          순수 CSR이 적합
```

#### Vite 선택 이유

| 선택 이유                                                | 트레이드오프 |
| -------------------------------------------------------- | ------------ |
| 빠른 HMR과 번들링 생략을 통한 개발 서버 시작 속도 최적화 | -            |
| 설정이 간단하고 직관적                                   | -            |

**이 전환은 "기술 선택의 재고"를 보여줍니다.** 요구사항에 맞지 않는 기술을 고집하기보다, 분석 후 적합한 도구로 전환하는 것이 올바른 엔지니어링 판단이라고 생각합니다.

### 상태 관리: Zustand (vs Context API)

본 프로젝트는 필터 상태와 서버 데이터가 여러 컴포넌트에서 공유되는 구조입니다. 초기에 React Context API를 검토했으나, 다음 문제점으로 인해 Zustand를 선택했습니다.

#### Context API의 한계

1. **잘게 쪼갠 Context의 유지보수 문제**

   ```tsx
   // Context를 세분화하면 Provider 중첩이 심해짐
   <FilterDateProvider>
     <FilterStatusProvider>
       <FilterPlatformProvider>
         <DataProvider>
           <App />
         </DataProvider>
       </FilterPlatformProvider>
     </FilterStatusProvider>
   </FilterDateProvider>
   ```

   - Provider가 늘어날수록 컴포넌트 트리 파악이 어려워짐
   - 새로운 상태 추가 시 매번 Provider 생성 및 중첩 필요

2. **통합 Context의 리렌더링 문제**

   ```tsx
   // 하나의 Context에 모든 상태를 넣으면
   const FilterContext = createContext({
     dateRange,
     status,
     platform, // ...
     setDateRange,
     setStatus,
     setPlatform, // ...
   });

   // dateRange만 변경되어도 status, platform을 구독하는
   // 모든 컴포넌트가 리렌더링됨
   ```

#### Zustand 선택 이유

| 선택 이유                                                            | 트레이드오프                                  |
| -------------------------------------------------------------------- | --------------------------------------------- |
| **선택적 구독**: 필요한 상태만 구독하여 불필요한 리렌더링 방지       | Provider 패턴이 아니라 React 외부 상태라는 점 |
| **단일 스토어 + 다중 슬라이스**: Provider 중첩 없이 관심사 분리 가능 | DevTools가 Redux만큼 강력하지 않음            |
| **간결한 API**: 보일러플레이트 최소화                                | -                                             |
| **번들 크기**: ~1KB로 Context 대비 추가 비용 미미                    | -                                             |

```typescript
// Zustand: 필요한 상태만 선택적으로 구독
const dateRange = useFilterStore((state) => state.dateRange); // dateRange 변경 시만 리렌더링
const status = useFilterStore((state) => state.status); // status 변경 시만 리렌더링
```

### 서버 상태 관리: React Query 미도입

React Query(TanStack Query)는 서버 상태 관리의 사실상 표준이지만, 본 프로젝트에서는 도입하지 않았습니다.

#### 도입 시 이점이 제한적인 이유

| React Query 기능         | 본 프로젝트 적용 가능성                         |
| ------------------------ | ----------------------------------------------- |
| 캐싱/재검증              | 새로고침 시 초기화 허용 (요구사항) → **불필요** |
| stale-while-revalidate   | 실시간 동기화 없음 → **불필요**                 |
| 중복 요청 방지           | `isInitialized` 플래그로 이미 처리              |
| 로딩/에러 상태           | Zustand에서 동일하게 구현 가능                  |
| 낙관적 업데이트          | 이미 Zustand store에서 구현                     |
| 무한 스크롤/페이지네이션 | 클라이언트 측 페이지네이션으로 충분             |

#### 현재 구조의 적합성

```
[초기 로드]  앱 마운트 시 campaigns, dailyStats 전체 로드
[이후]      클라이언트 측 필터링/집계만 수행
[갱신]      캠페인 등록/수정은 낙관적 업데이트로 즉시 반영
```

이 데이터 흐름에서 React Query의 핵심 가치(서버 상태 동기화)가 활용되지 않습니다. 추가 의존성(~12KB)과 학습 비용 대비 이점이 없어 도입하지 않았습니다.

#### 도입이 필요해지는 시점

- 실시간 데이터 동기화 요구 (폴링, WebSocket)
- 서버 측 페이지네이션/무한 스크롤
- 복잡한 캐시 무효화 로직
- 여러 API 엔드포인트 간 의존성 관리

### 차트: Recharts

| 선택 이유                     | 트레이드오프                                              |
| ----------------------------- | --------------------------------------------------------- |
| React 친화적인 선언적 API     | D3.js 대비 커스터마이징 자유도 낮음                       |
| SVG 기반으로 반응형 지원 우수 | 대용량 데이터(10만+ 포인트) 시 Canvas 기반 대비 성능 저하 |
| 타입스크립트 지원 우수        | -                                                         |

### 스키마 검증: Zod (폼 + API 정규화 통합)

Zod를 폼 검증뿐 아니라 **API 응답 정규화**에도 활용하여 데이터 안전성을 단일 레이어에서 보장합니다.

| 활용 영역                        | 선택 이유                                                                              | 트레이드오프                           |
| -------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------- |
| **폼 검증** (React Hook Form)    | Uncontrolled 방식으로 필드 간 동적 의존성(예산↔집행금액)을 `.refine()`으로 선언적 처리 | Controlled 대비 폼 상태 직접 접근 불편 |
| **API 정규화** (entities 스키마) | API 레이어에서 한 번만 정규화 → 비즈니스 로직에서 방어 코드 불필요                     | 스키마 정의 추가 비용                  |

**API 정규화 없이 직접 구현했다면:**

```typescript
// ❌ 비즈니스 로직 곳곳에서 방어 코드 필요
const cost = typeof stat.cost === "number" ? stat.cost : 0;
const date = stat.date?.replace(/\//g, "-") ?? null;
if (!date) continue;
```

**Zod 스키마로 해결:**

```typescript
// ✅ API 레이어에서 한 번만 정규화, 이후 정규화된 데이터 신뢰
const dailyStatSchema = z.object({
  cost: z.number().nullable().transform(normalizeNumber),
  date: z.string().nullable().transform(normalizeDate),
});
// 비즈니스 로직: stat.cost, stat.date 그대로 사용
```

### 스타일링: Tailwind CSS 4

| 선택 이유                           | 트레이드오프                    |
| ----------------------------------- | ------------------------------- |
| 유틸리티 클래스로 빠른 개발 속도    | 초기 학습 시 클래스명 암기 필요 |
| CSS-in-JS 대비 런타임 오버헤드 없음 | HTML에 클래스가 많아질 수 있음  |
| Vite 플러그인으로 간편한 통합       | -                               |

### API 모킹: json-server

| 선택 이유                                    | 트레이드오프                     |
| -------------------------------------------- | -------------------------------- |
| 설정 없이 즉시 REST API 생성                 | 복잡한 비즈니스 로직 구현 어려움 |
| db.json 원본 유지 요구사항 충족              | 프로덕션 환경에서는 사용 불가    |
| 개발 중 실제 HTTP 요청/응답 흐름 테스트 가능 | -                                |

---

## 폴더 구조 및 아키텍처

### Feature-Sliced Design (FSD) 아키텍처 채택

대시보드 애플리케이션의 특성상 여러 독립적인 기능(필터, 차트, 테이블)이 서로 연동되어야 합니다. FSD 아키텍처를 채택하여 기능 단위로 코드를 분리하면서도, 공유 레이어를 통해 일관된 상태 관리와 UI를 유지했습니다.

```
src/
├── app/                    # 앱 레벨 설정 (providers)
├── entities/               # 도메인 모델 (campaign, dailyStat)
│   └── campaign/
│       ├── api.ts         # API 호출 + 정규화
│       ├── schema.ts      # Zod 정규화 스키마
│       ├── store.ts       # Zustand 상태
│       └── ...
├── features/               # 기능 모듈
│   ├── filter/            # 글로벌 필터
│   ├── dailyTrendChart/   # 일별 추이 차트
│   ├── platformChart/     # 플랫폼별 성과 (선택)
│   ├── campaignRanking/   # 캠페인 랭킹 (선택)
│   └── campaignTable/     # 캠페인 테이블
│       ├── ui/            # UI 컴포넌트
│       ├── hooks/         # 데이터 로직
│       ├── lib/           # 지표 계산 함수
│       └── schema.ts      # Zod 검증 스키마
└── shared/                 # 공유 리소스
    ├── ui/                # 공통 UI
    ├── stores/            # filterStore (cross-cutting)
    ├── lib/               # 유틸리티 (formatters, metrics)
    └── types/
```

> 각 feature는 `ui/`, `hooks/`, `lib/`, `types/` 하위 구조를 가지며, `campaignTable`을 예시로 표기했습니다.

### 레이어별 역할과 의존성 규칙

```
┌─────────────────────────────────────────────────────────────┐
│                         app                                  │
│                    (페이지 조합)                              │
├─────────────────────────────────────────────────────────────┤
│                       features                               │
│    filter │ dailyTrendChart │ platformChart │ campaignTable  │
│                  (사용자 기능 단위)                           │
├─────────────────────────────────────────────────────────────┤
│                       entities                               │
│              campaign │ dailyStat                            │
│                   (도메인 모델)                               │
├─────────────────────────────────────────────────────────────┤
│                        shared                                │
│           ui │ stores │ lib │ types │ api                    │
│                   (공유 리소스)                               │
└─────────────────────────────────────────────────────────────┘

의존 방향: 위 → 아래 (단방향)
※ features는 entities와 shared 모두 직접 참조 가능
※ features 간 상호 참조 금지 (독립성 보장)
```

| 레이어     | 역할                       | 의존 가능 레이어 | 참조 금지          |
| ---------- | -------------------------- | ---------------- | ------------------ |
| `app`      | 페이지 조합                | features, shared | entities 직접 참조 |
| `features` | 사용자 기능, 비즈니스 로직 | entities, shared | 다른 features      |
| `entities` | 도메인 모델, API           | shared           | features, app      |
| `shared`   | 재사용 가능한 유틸리티     | 외부 라이브러리  | 모든 상위 레이어   |

### 의존성 규칙 검증

실제 코드에서 의존성 방향이 지켜지는지 검증한 결과입니다.

| 파일                                                   | import 대상                           | FSD 준수 |
| ------------------------------------------------------ | ------------------------------------- | -------- |
| `features/filter/ui/GlobalFilter.tsx`                  | `@/shared/ui`, `@/shared/stores`      | ✓        |
| `features/platformChart/ui/PlatformChart.tsx`          | `@/shared/*` (entities 미참조)        | ✓        |
| `features/campaignTable/hooks/useFilteredCampaigns.ts` | `@/shared/*`, `@/entities/*`          | ✓        |
| `entities/campaign/store.ts`                           | `@/shared/types`, 로컬 `./api`        | ✓        |
| `shared/lib/dataFilter.ts`                             | `@/shared/types` (상위 레이어 미참조) | ✓        |

### 이 구조를 선택한 이유

#### 1. 기능 단위 응집성

필터, 차트, 테이블 각각이 독립적인 폴더에 UI, 로직, 타입이 함께 위치합니다.

```
features/dailyTrendChart/
├── ui/           ← 이 기능의 UI
├── hooks/        ← 이 기능의 데이터 로직
├── types/        ← 이 기능의 타입
└── index.ts      ← 외부 공개 API
```

**장점**: 일별 추이 차트 수정 시 `features/dailyTrendChart/` 폴더만 확인하면 됩니다.

#### 2. 확장성

새로운 차트(플랫폼별 성과, 캠페인 랭킹)를 추가할 때 기존 코드 수정 없이 `features/` 아래에 새 폴더만 생성했습니다.

```diff
  features/
    ├── filter/
    ├── dailyTrendChart/
+   ├── platformChart/       ← 새 기능 추가
+   ├── campaignRanking/     ← 새 기능 추가
    └── campaignTable/
```

#### 3. feature 간 독립성

각 feature는 다른 feature를 직접 참조하지 않습니다. 대신 `shared/stores/filterStore`를 통해 상태를 공유합니다.

```
[platformChart] ──┐
                  ├──→ [shared/filterStore] ←──┤
[campaignTable] ──┘                            │
                                               │
[filter] ─────────────────────────────────────→┘
```

**장점**: platformChart를 삭제해도 다른 feature에 영향 없음

### filterStore를 shared에 배치한 이유

`filterStore`는 `shared/stores/`에 위치합니다. 이 결정에는 명확한 근거가 있습니다.

#### 문제 상황

필터 상태를 어느 레이어에 둘 것인가?

#### 검토한 대안들

| 대안                               | 장점                       | 단점                                         |
| ---------------------------------- | -------------------------- | -------------------------------------------- |
| `features/filter/store.ts`         | filter 기능과 응집         | 다른 features가 filter를 의존 → **FSD 위반** |
| `app/stores/filterStore.ts`        | 앱 레벨 상태로 명확        | app이 너무 비대해짐, 관심사 분리 약화        |
| **`shared/stores/filterStore.ts`** | 모든 feature에서 접근 가능 | shared가 비즈니스 로직을 가짐 (트레이드오프) |

#### 선택: shared/stores

```typescript
// 5개 feature 모두 filterStore를 참조
features/filter         → shared/stores/filterStore  // 필터 UI
features/dailyTrendChart → shared/stores/filterStore  // 차트 필터링
features/platformChart   → shared/stores/filterStore  // 도넛 차트 연동
features/campaignRanking → shared/stores/filterStore  // 랭킹 필터링
features/campaignTable   → shared/stores/filterStore  // 테이블 필터링
```

FSD에서 **cross-cutting concern**(여러 feature가 공유하는 상태)은 shared 레이어에 배치하는 것이 원칙입니다. filterStore는 5개 feature 모두에서 사용되므로 shared에 위치시켰습니다.

---

## 컴포넌트 설계

### 1. 컴포넌트 분리 기준과 의사결정

#### 단일 책임 원칙(SRP) 적용

각 모듈이 하나의 책임만 가지도록 분리했습니다.

```
GlobalFilter.tsx     → 필터 UI 렌더링만 담당
filterStore.ts       → 필터 상태 관리만 담당
useFilteredCampaigns → 필터 + 데이터 조합 로직만 담당
CampaignTable.tsx    → 테이블 UI 렌더링만 담당
```

**이점**: 필터 UI 변경 시 상태 로직에 영향 없음, 상태 로직 변경 시 UI에 영향 없음

#### 분리 의사결정 사례: MultiSelect 컴포넌트

`MultiSelect`를 `shared/ui`가 아닌 `features/filter/ui`에 배치했습니다.

| 대안                                     | 장점                         | 단점                                                    |
| ---------------------------------------- | ---------------------------- | ------------------------------------------------------- |
| `shared/ui/MultiSelect.tsx`              | 다른 feature에서 재사용 가능 | 범용화하면 props가 복잡해짐 (placeholder, chipStyle 등) |
| **`features/filter/ui/MultiSelect.tsx`** | 필터 전용으로 간결한 API     | 재사용 시 코드 중복 가능                                |

**선택 근거 (YAGNI 원칙)**: 현재 MultiSelect는 필터에서만 사용됩니다. 실제 재사용 필요가 생기면 그때 shared로 이동하고, 지금은 간결함을 우선했습니다.

#### 분리 의사결정 사례: 지표 계산 함수

`calculateCTR`, `calculateROAS` 등 지표 계산 함수의 위치를 결정했습니다.

```
검토 1: shared/lib/metrics.ts        → 모든 feature에서 접근 가능
검토 2: features/campaignTable/lib/  → 테이블 기능에 응집
```

**결론**: 기본 유틸(`safeDivide`)은 `shared/lib/metrics.ts`에, 도메인 특화 계산(`calculateROAS`)은 `features/campaignTable/lib/calculations.ts`에 배치

```typescript
// shared/lib/metrics.ts - 범용 유틸
export function safeDivide(
  numerator: number,
  denominator: number
): number | null;

// features/campaignTable/lib/calculations.ts - 테이블 전용
export function calculateROAS(
  conversionsValue: number,
  cost: number
): number | null;
```

### 2. 데이터 흐름 및 상태 분리

#### 전역 상태 vs 지역 상태

| 구분                | 상태                                  | 사용처                |
| ------------------- | ------------------------------------- | --------------------- |
| **전역** (Zustand)  | campaign/dailyStat store, filterStore | 여러 feature에서 공유 |
| **지역** (useState) | 검색어, 정렬, 페이지, 메트릭 선택     | 해당 컴포넌트 내부    |

**분리 기준**: "이 상태가 변경되면 다른 컴포넌트도 업데이트되어야 하는가?"

#### 데이터 흐름 다이어그램

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌─────────────┐
│  json-server │ ──→ │ entities/*/store │ ──→ │  Custom Hooks   │ ──→ │ UI Component │
│  (API)       │     │ (원본 데이터)     │     │ (필터링+계산)    │     │ (렌더링)     │
└─────────────┘     └──────────────────┘     └─────────────────┘     └─────────────┘
                              ↑                        ↑
                              │         ┌──────────────┘
                              │         │
                    ┌─────────────────────────┐
                    │ shared/stores/filterStore │
                    │ (필터 조건)              │
                    └─────────────────────────┘
```

1. **DataProvider**: 앱 마운트 시 API에서 데이터 로드 → entities store에 저장
2. **filterStore**: 사용자 필터 조건 관리 (shared 레이어)
3. **Custom Hooks**: entities store + filterStore를 조합하여 필터링된 데이터 계산
4. **UI Components**: 훅에서 받은 데이터 렌더링만 담당

### 3. 데이터 전처리 및 예외 처리

#### API 레이어에서 정규화 (Zod 스키마)

API 응답을 받는 시점에 Zod 스키마로 정규화하여, 비즈니스 로직에서는 정규화된 데이터를 신뢰하고 사용합니다.

```typescript
// entities/campaign/schema.ts
export const campaignSchema = z.object({
  name: z.string().nullable().transform((v) => v ?? "(이름 없음)"),
  budget: z.number().nullable().transform(normalizeNumber),
  startDate: z.string().nullable().transform(normalizeDate),
  // ...
});

// 잘못된 platform/status는 필터링 제외 (기본값 대체 X)
platform: z.enum(["Google", "Meta", "Naver"]),
status: z.enum(["active", "paused", "ended"]),
```

#### Division by Zero 및 Infinity 방지

```typescript
function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  const result = numerator / denominator;
  if (!Number.isFinite(result)) return null; // Infinity 방지
  return result;
}
```

**UI 표시**: 계산 불가 시 `-`로 표시하여 사용자에게 명확히 전달합니다.

### 4. 에러 처리 전략

| 에러 유형           | 처리 위치                 | 처리 방식                     |
| ------------------- | ------------------------- | ----------------------------- |
| API 에러 (4xx, 5xx) | `shared/api/client.ts`    | Error throw → store에서 catch |
| 초기 로드 실패      | `DataProvider`            | 에러 UI 표시                  |
| 런타임 에러         | `ErrorBoundary`           | 앱 크래시 방지                |
| 폼 유효성 에러      | `react-hook-form` + `zod` | 필드별 에러 메시지            |

### 5. 재사용 가능한 컴포넌트 패턴

#### Custom Hook으로 UI와 로직 분리

```typescript
// features/campaignTable/hooks/useFilteredCampaigns.ts
export function useFilteredCampaigns() {
  // 1. 여러 store에서 데이터 수집
  const campaigns = useCampaignStore((state) => state.campaigns);
  const dailyStats = useDailyStatStore((state) => state.dailyStats);
  const dateRange = useFilterStore((state) => state.dateRange);

  // 2. 필터링 + 지표 계산 (순수 로직)
  const filteredCampaigns = getFilteredCampaigns({ campaigns, dateRange, ... });
  const tableData = filteredCampaigns.map(campaign => ({
    ...campaign,
    ctr: calculateCTR(...),
    roas: calculateROAS(...),
  }));

  // 3. UI에 필요한 상태만 반환
  return { data: tableData, isLoading, error, isEmpty };
}
```

**이 패턴의 장점**:

| 관점     | 이점                                                   |
| -------- | ------------------------------------------------------ |
| 테스트   | 훅 로직을 독립적으로 테스트 가능 (UI 렌더링 없이)      |
| 재사용   | 같은 데이터가 필요한 다른 컴포넌트에서 훅 재사용       |
| 유지보수 | 필터링 로직 변경 시 훅만 수정, UI 컴포넌트 변경 불필요 |
| 가독성   | UI 컴포넌트가 렌더링에만 집중하여 코드 파악 용이       |

### 6. 폼 유효성 검사

#### Zod 스키마로 선언적 검증

```typescript
export const campaignFormSchema = z
  .object({
    name: z.string().min(2, "캠페인명은 2자 이상이어야 합니다"),
    budget: z.number().int().min(100, "최소 100원 이상"),
    cost: z.number().int().min(0),
    // ...
  })
  // 크로스 필드 검증: 집행 금액 ≤ 예산
  .refine((data) => data.cost <= data.budget, {
    message: "집행 금액은 예산을 초과할 수 없습니다",
    path: ["cost"],
  });
```

---

## 설계 트레이드오프 요약

| 결정 사항        | 선택                            | 트레이드오프                                        |
| ---------------- | ------------------------------- | --------------------------------------------------- |
| 아키텍처         | FSD (Feature-Sliced Design)     | 초기 학습 비용 vs 장기 유지보수성 향상              |
| 상태 관리        | Zustand                         | React 외부 상태 vs 선택적 구독으로 리렌더링 최적화  |
| 서버 상태        | Zustand (React Query 미도입)    | 캐싱/재검증 미지원 vs 현재 요구사항에 적합한 단순성 |
| filterStore 위치 | shared 레이어                   | shared의 비즈니스 로직 vs cross-cutting 상태 공유   |
| MultiSelect 위치 | features/filter 내부            | 재사용성 포기 vs 간결한 API 유지 (YAGNI)            |
| 지표 계산 함수   | shared(범용) + features(도메인) | 분산 배치 vs 적절한 응집도                          |
| 폼 검증          | Zod + React Hook Form           | 추가 의존성 vs 선언적 크로스 필드 검증              |
