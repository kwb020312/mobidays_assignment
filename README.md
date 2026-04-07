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

| 요구사항 | Next.js 기능 활용 여부 |
|----------|------------------------|
| json-server 기반 API | 빌드 타임 데이터 없음 → **SSG 불가** |
| 실시간 필터/차트 동기화 | 클라이언트 상태 기반 → **SSR 이점 없음** |
| 캠페인 등록 후 즉시 반영 | 클라이언트 상태 관리 필수 |
| 단일 페이지 대시보드 | 복잡한 라우팅 불필요 |
| SEO | 내부 도구로 **불필요** |

```
[빌드 타임]     json-server 미실행 → SSG/ISR 불가
[런타임 SSR]    필터 변경마다 재계산 필요 → SSR 이점 상쇄
[결론]          순수 CSR이 적합
```

#### Vite 선택 이유

| 선택 이유 | 트레이드오프 |
|-----------|-------------|
| 빠른 HMR과 개발 서버 시작 속도 | Next.js 대비 생태계 규모 작음 |
| 필요한 기능만 포함하여 번들 크기 최적화 | 서버 사이드 기능 필요 시 별도 구성 필요 |
| 설정이 간단하고 직관적 | - |

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
     dateRange, status, platform, // ...
     setDateRange, setStatus, setPlatform, // ...
   });

   // dateRange만 변경되어도 status, platform을 구독하는
   // 모든 컴포넌트가 리렌더링됨
   ```

#### Zustand 선택 이유

| 선택 이유 | 트레이드오프 |
|-----------|-------------|
| **선택적 구독**: 필요한 상태만 구독하여 불필요한 리렌더링 방지 | Provider 패턴이 아니라 React 외부 상태라는 점 |
| **단일 스토어 + 다중 슬라이스**: Provider 중첩 없이 관심사 분리 가능 | DevTools가 Redux만큼 강력하지 않음 |
| **간결한 API**: 보일러플레이트 최소화 | - |
| **번들 크기**: ~1KB로 Context 대비 추가 비용 미미 | - |

```typescript
// Zustand: 필요한 상태만 선택적으로 구독
const dateRange = useFilterStore((state) => state.dateRange);  // dateRange 변경 시만 리렌더링
const status = useFilterStore((state) => state.status);        // status 변경 시만 리렌더링
```

### 차트: Recharts

| 선택 이유 | 트레이드오프 |
|-----------|-------------|
| React 친화적인 선언적 API | D3.js 대비 커스터마이징 자유도 낮음 |
| SVG 기반으로 반응형 지원 우수 | 대용량 데이터(10만+ 포인트) 시 Canvas 기반 대비 성능 저하 |
| 타입스크립트 지원 우수 | - |

### 폼 관리: React Hook Form + Zod

| 선택 이유 | 트레이드오프 |
|-----------|-------------|
| 비제어 컴포넌트 기반으로 리렌더링 최소화 | 제어 컴포넌트 기반 라이브러리(Formik) 대비 직관성 떨어질 수 있음 |
| Zod 스키마로 런타임 + 타입 검증 통합 | Yup 대비 번들 크기 약간 큼 |
| 복잡한 유효성 검사 로직을 스키마로 분리하여 관리 용이 | - |

### 스타일링: Tailwind CSS 4

| 선택 이유 | 트레이드오프 |
|-----------|-------------|
| 유틸리티 클래스로 빠른 개발 속도 | 초기 학습 시 클래스명 암기 필요 |
| CSS-in-JS 대비 런타임 오버헤드 없음 | HTML에 클래스가 많아질 수 있음 |
| Vite 플러그인으로 간편한 통합 | - |

### API 모킹: json-server

| 선택 이유 | 트레이드오프 |
|-----------|-------------|
| 설정 없이 즉시 REST API 생성 | 복잡한 비즈니스 로직 구현 어려움 |
| db.json 원본 유지 요구사항 충족 | 프로덕션 환경에서는 사용 불가 |
| 개발 중 실제 HTTP 요청/응답 흐름 테스트 가능 | - |

---

## 폴더 구조 및 아키텍처

### Feature-Sliced Design (FSD) 아키텍처 채택

대시보드 애플리케이션의 특성상 여러 독립적인 기능(필터, 차트, 테이블)이 서로 연동되어야 합니다. FSD 아키텍처를 채택하여 기능 단위로 코드를 분리하면서도, 공유 레이어를 통해 일관된 상태 관리와 UI를 유지했습니다.

```
src/
├── main.tsx                      # 애플리케이션 진입점
├── App.tsx                       # 루트 컴포넌트
├── styles/
│   └── globals.css              # 전역 스타일 (Tailwind)
│
├── entities/                     # 비즈니스 엔티티 (도메인 모델)
│   ├── campaign/                # 캠페인 엔티티
│   │   ├── api.ts              # API 호출 함수
│   │   ├── types.ts            # 타입 정의
│   │   └── index.ts            # 배럴 파일
│   └── dailyStat/               # 일별 통계 엔티티
│       ├── api.ts
│       ├── types.ts
│       └── index.ts
│
├── features/                     # 기능 모듈 (사용자 상호작용 단위)
│   ├── filter/                  # 글로벌 필터 기능
│   │   ├── ui/                 # UI 컴포넌트
│   │   │   ├── GlobalFilter.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── DatePresets.tsx
│   │   │   └── MultiSelect.tsx
│   │   ├── store.ts            # 필터 상태 (Zustand)
│   │   ├── constants/          # 필터 옵션 상수
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── dailyTrendChart/         # 일별 추이 차트 기능
│   │   ├── ui/
│   │   │   ├── DailyTrendChart.tsx
│   │   │   └── MetricToggle.tsx
│   │   ├── hooks/              # 필터링된 데이터 훅
│   │   ├── lib/                # 포맷팅 유틸
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── campaignTable/           # 캠페인 테이블 기능
│       ├── ui/
│       │   ├── CampaignTable.tsx
│       │   └── CampaignRegistrationModal.tsx
│       ├── hooks/
│       │   └── useFilteredCampaigns.ts
│       ├── lib/
│       │   └── calculations.ts  # 파생 지표 계산 (CTR, CPC, ROAS)
│       ├── schema.ts           # Zod 유효성 검사 스키마
│       ├── constants/
│       ├── types.ts
│       └── index.ts
│
└── shared/                       # 공유 리소스
    ├── ui/                      # 공통 UI 컴포넌트
    ├── api/
    │   └── client.ts           # API 클라이언트
    ├── stores/
    │   └── dataStore.ts        # 전역 데이터 스토어
    ├── providers/
    │   └── DataProvider.tsx    # 데이터 초기화 프로바이더
    ├── lib/
    │   ├── utils.ts            # 유틸리티 (cn 함수 등)
    │   └── formatters.ts       # 데이터 포맷팅 함수
    ├── constants/
    └── types/                   # 공통 타입 정의
```

### 레이어별 역할과 의존성 규칙

```
App → features → entities → shared
      ↓
      shared (직접 참조 가능)
```

| 레이어 | 역할 | 의존 가능 레이어 |
|--------|------|------------------|
| `App` | 페이지 조합 | features, shared |
| `features` | 사용자 기능, 비즈니스 로직 | entities, shared |
| `entities` | 도메인 모델, API | shared |
| `shared` | 재사용 가능한 유틸리티 | 없음 |

### 이 구조를 선택한 이유

1. **기능 단위 응집성**: 필터, 차트, 테이블 각각이 독립적인 폴더에 UI, 로직, 타입이 함께 위치하여 관련 코드를 찾기 쉽습니다.

2. **확장성**: 새로운 차트(플랫폼별 성과, 캠페인 랭킹 등)를 추가할 때 `features/` 아래에 새 폴더만 생성하면 됩니다.

3. **의존성 명확화**: 레이어 간 단방향 의존성으로 순환 참조를 방지하고, 변경 영향 범위를 예측할 수 있습니다.

---

## 컴포넌트 설계

### 1. 상태 관리 전략

#### 전역 상태 vs 지역 상태 분리

```
전역 상태 (Zustand)
├── dataStore: 서버 데이터 (campaigns, dailyStats)
└── filterStore: 필터 조건 (dateRange, status, platform)

지역 상태 (useState)
├── 테이블: 검색어, 정렬, 페이지네이션, 선택된 행
├── 차트: 선택된 메트릭
└── 모달: open/close 상태, 폼 입력값
```

**선택 기준**: 여러 컴포넌트에서 공유되는 상태(필터, 데이터)만 전역으로, UI 상태는 해당 컴포넌트에 국한하여 불필요한 리렌더링을 방지했습니다.

#### 선택적 구독으로 리렌더링 최적화

```typescript
// 필요한 상태만 선택적으로 구독
const campaigns = useDataStore((state) => state.campaigns);
const dateRange = useFilterStore((state) => state.dateRange);

// Selector를 통한 파생 상태 계산
const effectiveStatus = useFilterStore(selectEffectiveStatus);
```

### 2. 데이터 흐름

```
[API] → [dataStore] → [Custom Hooks] → [UI Components]
                ↑
         [filterStore] ─────────────────┘
```

1. **DataProvider**: 앱 마운트 시 API에서 데이터 로드 → dataStore 저장
2. **filterStore**: 사용자 필터 조건 관리
3. **Custom Hooks**: 두 store를 조합하여 필터링된 데이터 계산
4. **UI Components**: 훅에서 받은 데이터 렌더링

### 3. 데이터 전처리 및 예외 처리

#### Null Safety 처리

```typescript
// 숫자 정규화: null, undefined, NaN → 0
export function normalizeNumber(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 0;
  }
  return value;
}

// 날짜 정규화: 다양한 포맷 통일 (YYYY/MM/DD → YYYY-MM-DD)
export function normalizeDate(date: string | null | undefined): string | null {
  if (!date) return null;
  return date.replace(/\//g, "-");
}
```

#### Division by Zero 방지

```typescript
// 파생 지표 계산 시 안전한 나눗셈
function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return numerator / denominator;
}

// CTR (%) = (클릭수 / 노출수) × 100
export function calculateCTR(clicks: number, impressions: number): number | null {
  const result = safeDivide(clicks, impressions);
  if (result === null) return null;
  return result * 100;
}
```

**UI 표시**: 계산 불가 시 `-`로 표시하여 사용자에게 명확히 전달합니다.

### 4. 재사용 가능한 컴포넌트 패턴

#### Custom Hook으로 비즈니스 로직 분리

```typescript
// useFilteredCampaigns: 필터링 + 지표 계산 로직 캡슐화
export function useFilteredCampaigns() {
  const campaigns = useDataStore((state) => state.campaigns);
  const dailyStats = useDataStore((state) => state.dailyStats);
  const dateRange = useFilterStore((state) => state.dateRange);
  // ... 필터링 및 계산 로직

  return { data: tableData, isLoading, error, isEmpty };
}
```

**장점**: UI 컴포넌트는 렌더링에만 집중하고, 데이터 처리 로직은 훅에서 관리하여 테스트 및 재사용이 용이합니다.

### 5. 폼 유효성 검사

#### Zod 스키마로 선언적 검증

```typescript
export const campaignFormSchema = z
  .object({
    name: z.string().min(2, "캠페인명은 2자 이상이어야 합니다")
                    .max(100, "캠페인명은 100자 이하여야 합니다"),
    budget: z.number().int("정수로 입력해주세요")
                      .min(100, "최소 100원 이상")
                      .max(1_000_000_000, "최대 10억 원"),
    // ...
  })
  // 크로스 필드 검증: 집행 금액 ≤ 예산
  .refine((data) => data.cost <= data.budget, {
    message: "집행 금액은 예산을 초과할 수 없습니다",
    path: ["cost"],
  });
```

**장점**:
- 타입 추론 자동화 (`z.infer<typeof schema>`)
- 복잡한 크로스 필드 검증을 스키마 레벨에서 처리
- 에러 메시지 한글화로 사용자 경험 향상

---

## 구현 기능

### 필수 요구사항

- [x] **글로벌 필터**: 집행 기간, 상태, 매체 필터 (AND 조합, 초기화)
- [x] **일별 추이 차트**: 노출수/클릭수 토글, 툴팁, 범례
- [x] **캠페인 관리 테이블**: 정렬, 검색, 페이지네이션, 일괄 상태 변경
- [x] **캠페인 등록 모달**: 유효성 검사, 등록 후 즉시 반영

### 선택 요구사항 (가산점)

- [ ] 플랫폼별 성과 차트 (Donut)
- [ ] 캠페인 랭킹 Top3 (Bar)
