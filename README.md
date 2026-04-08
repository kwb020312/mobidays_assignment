# 마케팅 캠페인 대시보드

마케팅 캠페인의 성과를 시각화하고 관리하는 대시보드 애플리케이션입니다.

---

## 구현 완료 현황

### 필수 기능 (3.x)

| 기능                       | 상태 | 주요 구현 내용                                                         |
| -------------------------- | ---- | ---------------------------------------------------------------------- |
| **3.1 글로벌 필터**        | ✅   | 집행 기간(DateRangePicker), 상태/매체 다중 선택, 초기화, 실시간 동기화 |
| **3.2 일별 추이 차트**     | ✅   | 듀얼 Y축 LineChart, 메트릭 토글(노출수/클릭수), 툴팁, 범례             |
| **3.3 캠페인 관리 테이블** | ✅   | 정렬, 검색, 페이지네이션, **일괄 상태 변경**                           |
| **3.4 캠페인 등록 모달**   | ✅   | RHF+Zod 유효성 검사, **등록 후 즉시 반영**                             |

### 선택 기능 (4.x)

| 기능                       | 상태 | 주요 구현 내용                                        |
| -------------------------- | ---- | ----------------------------------------------------- |
| **4.1 플랫폼별 성과 차트** | ✅   | Donut Chart, 메트릭 토글, **글로벌 필터 양방향 연동** |
| **4.2 캠페인 랭킹 Top3**   | ✅   | Bar Chart, **ROAS/CTR 내림차순, CPC 오름차순** 정렬   |

### 추가 구현

| 항목          | 내용                                                      |
| ------------- | --------------------------------------------------------- |
| **테스트**    | 단위 테스트 4개 + E2E 테스트 5개 (Vitest, Playwright)     |
| **UX/접근성** | Toast 알림, Skeleton 로딩, ARIA labels, 키보드 네비게이션 |
| **코드 품질** | ESLint + Prettier + Husky (커밋 전 자동 검사)             |

---

## 실행 방법

### 사전 요구사항

- Node.js 18.17 이상
- npm 9 이상

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Vite + json-server 동시 실행)
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)으로 접속합니다.

> `npm run dev` 실행 시 Vite(포트 5173)와 json-server(포트 4000)가 동시에 실행됩니다.

### 기타 명령어

```bash
npm run build      # 프로덕션 빌드 (테스트 포함)
npm run lint       # ESLint 검사
npm run test       # 단위 테스트
npm run test:e2e   # E2E 테스트
```

---

## 테스트

### 단위 테스트 (Vitest)

핵심 유틸리티 함수와 상태 관리 로직을 검증합니다.

```bash
npm run test           # 실행
npm run test:coverage  # 커버리지 리포트
```

| 테스트 파일           | 검증 내용                                   |
| --------------------- | ------------------------------------------- |
| `metrics.test.ts`     | safeDivide, Division by Zero, Infinity 방지 |
| `formatters.test.ts`  | 숫자/날짜 포맷팅, null 처리                 |
| `dataFilter.test.ts`  | 캠페인 필터링 로직                          |
| `filterStore.test.ts` | Zustand 필터 상태 관리                      |

### E2E 테스트 (Playwright)

사용자 시나리오 기반으로 주요 기능을 검증합니다.

```bash
npm run test:e2e      # 헤드리스 실행
npm run test:e2e:ui   # UI 모드 실행
```

| 테스트 파일                 | 검증 내용                                    |
| --------------------------- | -------------------------------------------- |
| `global-filter.spec.ts`     | 필터 변경 시 차트/테이블 동기화              |
| `daily-trend-chart.spec.ts` | 메트릭 토글, 툴팁 표시                       |
| `campaign-table.spec.ts`    | 정렬, 검색, 페이지네이션, **일괄 상태 변경** |
| `campaign-modal.spec.ts`    | 유효성 검사, **등록 후 즉시 반영**           |
| `platform-chart.spec.ts`    | 필터 연동, **랭킹 정렬 방향** 검증           |

---

## 기술 스택 선택 근거

### 핵심 기술 선택

| 기술                | 선택 이유                                                                                  | 트레이드오프                 |
| ------------------- | ------------------------------------------------------------------------------------------ | ---------------------------- |
| **Vite + React 19** | json-server 기반 API(SSG 불가), 실시간 필터 동기화(SSR 이점 없음), SEO 불필요 → CSR이 적합 | Next.js 대비 SSR/ISR 미지원  |
| **Zustand**         | 선택적 구독으로 리렌더링 최적화, Provider 중첩 없이 관심사 분리                            | React 외부 상태              |
| **React Compiler**  | useMemo/useCallback 자동화, 의존성 배열 오류 방지                                          | 빌드 시간 약간 증가          |
| **Recharts**        | React 친화적 선언적 API, SVG 기반 반응형                                                   | D3.js 대비 커스터마이징 제한 |
| **Zod**             | 폼 검증 + API 응답 정규화 통합, 타입 안전성                                                | 스키마 정의 비용             |

### Next.js에서 Vite로 전환한 이유

초기 Next.js로 시작했으나, 요구사항 분석 후 전환했습니다.

| 요구사항                 | Next.js 기능 활용 여부                   |
| ------------------------ | ---------------------------------------- |
| json-server 기반 API     | 빌드 타임 데이터 없음 → **SSG 불가**     |
| 실시간 필터/차트 동기화  | 클라이언트 상태 기반 → **SSR 이점 없음** |
| 캠페인 등록 후 즉시 반영 | 클라이언트 상태 관리 필수                |
| 단일 페이지 대시보드     | 복잡한 라우팅 불필요                     |

### React Query 미도입 이유

현재 요구사항에서 React Query의 핵심 가치(캐싱, 재검증, 서버 동기화)가 활용되지 않습니다. 앱 마운트 시 전체 데이터를 로드하고, 이후 클라이언트 측 필터링만 수행하는 구조이므로 Zustand로 충분합니다.

### 렌더링 최적화 전략

두 가지 레벨의 최적화를 적용합니다:

1. **Zustand 선택적 구독**: 필요한 상태만 구독하여 해당 컴포넌트만 리렌더링
2. **React Compiler**: 리렌더링 시 변경되지 않은 값/함수 자동 재사용

---

## 폴더 구조 및 아키텍처

### Feature-Sliced Design (FSD) 채택

기능 단위로 코드를 분리하면서 공유 레이어를 통해 일관된 상태 관리를 유지합니다.

```
src/
├── app/                    # 앱 설정 (providers)
├── entities/               # 도메인 모델
│   ├── campaign/           # API, 스키마, 스토어
│   └── dailyStat/
├── features/               # 기능 모듈 (UI + 로직 응집)
│   ├── filter/             # 글로벌 필터
│   ├── dailyTrendChart/    # 일별 추이 차트
│   ├── platformChart/      # 플랫폼별 성과 (선택)
│   ├── campaignRanking/    # 캠페인 랭킹 (선택)
│   └── campaignTable/      # 캠페인 테이블 + 등록 모달
└── shared/                 # 공유 리소스
    ├── ui/                 # 공통 UI 컴포넌트
    ├── stores/             # filterStore (cross-cutting)
    └── lib/                # 유틸리티
```

### 레이어 의존성 규칙

```
app → features → entities → shared
      (위에서 아래로만 참조, features 간 상호 참조 금지)
```

| 레이어     | 역할             | 참조 가능         |
| ---------- | ---------------- | ----------------- |
| `app`      | 페이지 조합      | features, shared  |
| `features` | 사용자 기능      | entities, shared  |
| `entities` | 도메인 모델, API | shared            |
| `shared`   | 재사용 유틸리티  | 외부 라이브러리만 |

### filterStore를 shared에 배치한 이유

5개 feature(filter, dailyTrendChart, platformChart, campaignRanking, campaignTable)가 모두 필터 상태를 참조합니다. FSD에서 **cross-cutting concern**은 shared 레이어에 배치하는 것이 원칙입니다.

---

## 컴포넌트 설계

### 데이터 흐름

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌─────────────┐
│ json-server │ ──→ │ entities/*/store │ ──→ │  Custom Hooks   │ ──→ │ UI Component│
│   (API)     │     │  (원본 데이터)    │     │ (필터링+계산)    │     │  (렌더링)   │
└─────────────┘     └──────────────────┘     └─────────────────┘     └─────────────┘
                            ↑                        ↑
                            │         ┌──────────────┘
                            │         │
                    ┌─────────────────────────┐
                    │ shared/stores/filterStore │
                    │     (필터 조건)          │
                    └─────────────────────────┘
```

1. **DataProvider**: 앱 마운트 시 API에서 데이터 로드 → entities store에 저장
2. **filterStore**: 사용자 필터 조건 관리
3. **Custom Hooks**: entities store + filterStore 조합하여 필터링된 데이터 계산
4. **UI Components**: 훅에서 받은 데이터 렌더링만 담당

### 관심사 분리 (SRP)

각 모듈이 하나의 책임만 가지도록 분리했습니다.

```
GlobalFilter.tsx      → 필터 UI 렌더링
filterStore.ts        → 필터 상태 관리
useFilteredCampaigns  → 필터 + 데이터 조합 로직
CampaignTable.tsx     → 테이블 UI 렌더링
```

### 데이터 전처리 (Zod 스키마)

API 응답을 받는 시점에 Zod 스키마로 정규화하여, 비즈니스 로직에서는 정규화된 데이터를 신뢰합니다.

```typescript
// entities/dailyStat/schema.ts - API 레이어에서 한 번만 정규화
const dailyStatSchema = z.object({
  cost: z.number().nullable().transform(normalizeNumber), // null → 0
  date: z.string().nullable().transform(normalizeDate), // 날짜 형식 통일
});

// 비즈니스 로직에서는 방어 코드 없이 사용
const totalCost = stats.reduce((sum, s) => sum + s.cost, 0);
```

**처리하는 예외 상황:**

- **Division by Zero**: `safeDivide()` 함수로 분모 0 및 Infinity 방지
- **Null Safety**: 숫자 null → 0, 문자열 null → 기본값 변환
- **데이터 정규화**: 날짜 형식 통일 (`2024/01/01` → `2024-01-01`)

### Custom Hook 패턴

UI와 로직을 분리하여 테스트 용이성과 재사용성을 확보합니다.

```typescript
// features/campaignTable/hooks/useFilteredCampaigns.ts
export function useFilteredCampaigns() {
  // 1. 여러 store에서 데이터 수집
  const campaigns = useCampaignStore((state) => state.campaigns);
  const dateRange = useFilterStore((state) => state.dateRange);

  // 2. 필터링 + 지표 계산
  const tableData = getFilteredCampaigns({ campaigns, dateRange, ... })
    .map(campaign => ({ ...campaign, ctr: calculateCTR(...) }));

  // 3. UI에 필요한 상태만 반환
  return { data: tableData, isLoading, isEmpty };
}
```

---

## AI 활용

본 프로젝트는 AI 도구를 적극 활용하여 개발되었습니다. 상세한 활용 내역은 **[AI_USAGE.md](./AI_USAGE.md)** 를 참조해주세요.

| 항목          | 내용                                              |
| ------------- | ------------------------------------------------- |
| **사용 도구** | Claude Code (claude-opus-4-5)                     |
| **활용 범위** | 아키텍처 설계, 코드 생성, 디버깅, 리팩토링        |
| **문서화**    | 프롬프트, 의사결정 과정, AI 결과물 수정 사례 기록 |
