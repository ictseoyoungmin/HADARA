# 0.4.1-rc.0 Scope: State-First 합의분 캡슐 계약

- 상태: 구현 완료 (항목 1~6, T-0497/T-0499/T-0500). 항목 5 AC-6은 부분 상태 — 아래 릴리스 판정 참조.
- 작성일: 2026-07-05
- 상위 문서: `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` (rc0 전체 스코프의 소유자는 FD 큐다)
- 관련 RFC: `docs/specs/0.5/state-first/RFC.md`
- 본 문서의 범위: state-first 리뷰에서 **합의된 6개 항목**을 캡슐 계약 수준(AC/evidence 계획 포함)으로 구체화한다. FD-002(docs.mark-drift), FD-003(Required Reading lifecycle), FD-004(제품 문서 분리), FD-005(DOC_REGISTRY projection)는 이 문서 범위 밖이며 FD 큐대로 별도 진행한다.

---

## 항목 총괄

| # | 항목 | FD 매핑 | 캡슐 크기 | 0.5 RFC와의 관계 |
|---|---|---|---|---|
| 1 | 패키지 스모크 command-surface/dist 드리프트 게이트 | FD-011 | 1 캡슐 | 독립 (사건 재발 방지) |
| 2 | 컨트롤드 토큰 조회/진단 surface 일반화 | FD-006 + FD-009 | 1 캡슐 | 0.5 vocab 통합의 선행 절반 |
| 3 | docs registry 정정 경로 | FD-008 | 1 캡슐 | 독립 |
| 4 | `task finalize --execute --auto` | FD-010 | 1 캡슐 | 0.5 `task close`의 프로토타입 |
| 5 | DEVELOPMENT_SLICES 한정 state/render 프로토타입 | FD-012 | 1~2 캡슐 | **0.5 RFC 채택 게이트** (RFC §9) |
| 6 | 저수준 라이프사이클 커맨드 표면 제거 | FD-013 | 1 캡슐 | 0.5 `task close` 표면 단일화의 선행 정리. **항목 4 착지 후 착수** |

항목 1~5는 상호 독립적으로 릴리스 가능하다. 항목 6은 항목 4에 순서 의존한다 (`--auto`가 저수준 커맨드의 마지막 정당한 일상 용도를 대체한 뒤에 제거해야 "대체 후 제거"가 성립). 5번만 실험적 성격이며, 실패해도 rc0 릴리스를 막지 않는다 (실패 자체가 0.5 RFC에 대한 evidence).

---

## 항목 1 — 패키지 스모크에 command-surface/dist 드리프트 게이트

**동기**: 0.4.0 배포본에 dev 저장소에 없는 `handoff.update` writer가 포함된 채 릴리스됐다 (사건 기록: 0.5 RFC §1.1). T-0496이 그 **사례**를 제거했지만, "배포물과 소스의 커맨드 표면이 다른 채 릴리스되는" **클래스**는 게이트가 없다.

**제안 동작**: 기존 패키지 스모크(`tools/dev-surface/package-smoke.ts`)에 검사 추가 —

1. 빌드된 dist의 실행 가능 커맨드 표면(라우팅 기준)을 열거
2. `capability-registry.ts`의 레지스트리 엔트리와 diff
3. 어느 방향이든 불일치(레지스트리에 없는 실행 가능 커맨드 / 실행 불가능한 레지스트리 엔트리)를 릴리스 블로커로 보고

**Acceptance**:

| ID | Criterion |
|---|---|
| AC-1 | dist에만 존재하는 커맨드(레지스트리 미등록)를 주입한 픽스처에서 스모크가 실패한다 |
| AC-2 | 레지스트리에만 존재하고 라우팅되지 않는 커맨드를 주입한 픽스처에서 스모크가 실패한다 |
| AC-3 | 현재 main의 실제 표면에서 스모크가 통과한다 (기존 불일치가 있다면 이 캡슐에서 정리) |

**Evidence 계획**: 픽스처 기반 focused test 2건 + 실제 패키지 스모크 실행 로그를 `validation run`으로 기록.

**구현 노트 (spike 선행)**: "dist의 실행 가능 커맨드 표면을 라우팅 기준으로 열거"하는 방식은 자명하지 않다 — 현재 레지스트리(`capability-registry.ts`)와 디스패처(`src/cli/main.ts`의 switch + 각 핸들러의 서브커맨드 문자열 매칭)가 분리되어 있어, 디스패처 쪽 표면을 기계적으로 열거할 훅이 없다. 구현 캡슐은 열거 전략 spike(예: 핸들러가 자기 서브커맨드 목록을 export하는 계약 추가 vs. `--help` 출력 파싱 vs. smoke가 레지스트리 전 엔트리를 실제 호출해 라우팅 실패를 잡는 방식)를 첫 Plan 스텝으로 두고, 선택 근거를 evidence로 남긴다.

**Out of scope**: 커맨드 표면 축소/재편 (별도 command-portfolio RFC; 단 항목 6의 라이프사이클 표면 제거는 본 스코프에 포함).

---

## 항목 2 — 컨트롤드 토큰 조회/진단 surface 일반화

**동기**: FD-009 — TASK.md의 Inputs/Constraints role/state, Risks/Follow-ups state 토큰을 finalize 실패로 배운다 (실사용: `constrains`→`constraint`, `Resolved`→`Closed`를 각각 finalize 시점에 발견). FD-006 — T-0494가 `docs.register`에 넣은 "거부 시 허용값+제안 반환" 패턴을 다른 closed-token 커맨드 패밀리로 일반화해야 한다.

**제안 동작** (두 반쪽):

1. **진단 일반화**: `src/harness/validate.ts`의 모든 토큰 검사 이슈에 `allowed: [...]`와 근접 제안을 포함시킨다 (T-0494 패턴의 이식). finalize/status 보고의 해당 이슈가 허용값을 항상 노출
2. **사전 조회**: `hadara schema [<domain>]` — 인자 없으면 도메인 목록, 인자를 주면 해당 토큰셋 반환

```bash
$ hadara schema task.risk.state --json
{ "domain": "task.risk.state", "allowed": ["Open","Accepted","Mitigated","Deferred","Closed","Superseded","Rejected"] }
```

**Acceptance**:

| ID | Criterion |
|---|---|
| AC-1 | `harness/validate.ts`의 전 토큰셋(~16종)에 대해 위반 이슈가 허용값 목록을 포함한다 |
| AC-2 | `hadara schema`가 TASK.md 토큰셋과 docs-registry vocab을 모두 조회 가능하다 (읽기 전용) |
| AC-3 | `schema` 출력과 실제 검증기가 참조하는 토큰셋이 같은 소스에서 나온다 (하드코딩 중복 금지 — 최소한 단일 모듈 export 공유) |

**Evidence 계획**: 토큰셋별 위반 픽스처 테스트 + `hadara schema` 출력 계약 테스트 + 출력 스키마(`hadara.schema.v1`) 추가.

**Out of scope**: vocab.json 파일로의 물리적 통합, 프로젝트별 vocab 오버라이드 (0.5 RFC §6).

**주의**: AC-3의 "같은 소스"는 이 캡슐에서는 TS 모듈 수준 공유로 충분하다. 0.5의 vocab 통합이 이 모듈을 데이터 파일로 옮기는 작업이 된다.

---

## 항목 3 — docs registry 정정 경로

**동기**: FD-008 — canonical→reference 같은 평범한 오기 정정이 CLI로 불가능해 `.hadara/docs-registry.json` 수동 편집으로 우회하게 된다 (실사용: 스펙 15건 일괄 등록 후 `DOC_CANONICAL_CONFLICT` 15건을 수동 편집으로 해소).

**제안 동작** (둘 중 택일은 구현 캡슐에서 결정, 계약은 동일):

- A안: `docs.mark`의 전이 제한을 "cleanup 방향 전용"에서 "가드 있는 임의 전이"로 확장 (`--status <any>` + 전이별 경고/확인)
- B안: `docs.register --force-update`가 기존 엔트리를 dry-run/execute 패턴으로 갱신

공통 계약: dry-run 기본, 실행 시 변경 전/후 필드 diff를 보고에 포함, canonical 충돌이 생기는 전이는 `docs.doctor`가 즉시 잡을 수 있도록 실행 보고에 doctor 재실행 권고 포함.

**Acceptance**:

| ID | Criterion |
|---|---|
| AC-1 | canonical→reference 전이가 CLI만으로 완료된다 (registry 파일 수동 편집 불필요) |
| AC-2 | 잘못된 목표값(미허용 status 등)은 허용값 목록과 함께 거부된다 (항목 2와 일관) |
| AC-3 | 실행 보고에 필드 diff가 포함되고, dry-run은 파일을 쓰지 않는다 |

**Evidence 계획**: 전이 매트릭스 focused test + 실사용 시나리오 재현 테스트(등록 직후 status 정정) + CLI 스모크.

**Out of scope**: registry 위치 이동, 스키마 변경.

---

## 항목 4 — `task finalize --execute --auto`

**동기**: FD-010 — dry-run→plan hash 복사→execute 왕복이 clean 케이스에서도 캡슐당 고정비. 실사용 9캡슐 전부 동일 반복. **안전성 약화 없이 왕복만 줄인다** (0.5 RFC §5.3의 원칙: 해시를 없애는 게 아니라 왕복을 내부화).

**제안 동작**:

```
hadara task finalize --task T-X --execute --auto
# 내부:
#   1. 현행과 동일한 dry-run 평가 (finish/ready/close/audit-close)
#   2. 블로커 존재 → 아무것도 쓰지 않고 dry-run과 동일한 보고로 종료 (exit≠0)
#   3. 블로커 없음 → planHash를 내부에서 계산·보관
#   4. 실행 직전 plan 재계산·재비교 (현행 --plan-hash 검증과 동일 코드 경로)
#   5. 일치 → 실행. 불일치 → 중단 + 현행 mismatch와 동일 보고
```

- `--plan-hash` 명시 경로는 그대로 존속 (외부 리뷰어가 plan을 승인하는 워크플로 유지)
- `--auto`는 `--plan-hash`와 상호 배타

**Acceptance**:

| ID | Criterion |
|---|---|
| AC-1 | clean 캡슐에서 `--auto` 1회 호출로 closed-valid에 도달한다 |
| AC-2 | 블로커가 있는 캡슐에서 `--auto`는 어떤 쓰기도 하지 않고 블로커를 보고한다 |
| AC-3 | 평가와 실행 사이에 close-source가 변경되는 경합 픽스처에서 `--auto`가 중단한다 (현행 planHash mismatch와 동일 보호 수준) |
| AC-4 | 기존 `--plan-hash` 경로의 동작·보고가 회귀 없이 유지된다 |

**Evidence 계획**: AC-3 경합 픽스처 테스트가 핵심 (스냅샷 재검증이 실제로 작동함을 증명). + clean/blocked 경로 focused test + 도그푸딩: 본 스코프의 다른 캡슐들을 `--auto`로 close하고 그 evidence를 이 캡슐에 기록.

**Out of scope**: finish/ready/close/audit 단계 자체의 변경, `task close`로의 표면 개명 (0.5).

---

## 항목 5 — DEVELOPMENT_SLICES 한정 state/render 프로토타입

**동기**: 0.5 state-first RFC의 채택 게이트 (RFC §9). DEVELOPMENT_SLICES가 첫 실험 대상인 이유: (a) 현재도 깨져 있음 — CLI가 파일을 요구하면서 규정 헤더로 작성해도 `rows: 0`으로 파싱 실패, (b) 사람 판단 산문이 없는 순수 구조 데이터, (c) 실패 시 폭발 반경 최소, (d) store→render→lifecycle 연동의 전체 루프를 가장 작게 검증 가능.

**제안 동작**:

1. `.hadara/state/slices.json` — canonical slice 상태 (`hadara.sliceState.v1`: id, title, order, depends, purpose, doneEvidence 요약, capsule 참조, status; aggregate rev 필드 포함)
2. `hadara slice add|set|list` — write-time 검증 (허용 status 토큰은 항목 2의 schema 도메인으로 등록)
3. `hadara render --slices` (또는 slice 쓰기 시 자동) — `docs/DEVELOPMENT_SLICES.md`를 **완전 생성 문서(Tier 1)**로 재생성. 파일 머리에 generated 주석 1줄
4. `hadara migrate slices` — 기존 DEVELOPMENT_SLICES.md 테이블을 임포트 (실패 행 전량 보고)
5. `task status`의 next-work/slice 소비 경로를 slices.json으로 전환 (`rows: 0` 파싱 버그가 자연 해소)
6. `hadara doctor`에 렌더 드리프트 검사 추가: 렌더 파일이 직접 편집된 경우 감지, **조용한 덮어쓰기 금지**, "import 또는 discard" 안내

**Acceptance** (= 0.5 RFC §9의 게이트 지표를 캡슐 AC로 그대로):

| ID | Criterion |
|---|---|
| AC-1 | slice 1회 변경의 git diff가 state+렌더 두 파일의 최소 diff이고, 무변경 재렌더는 diff 0 (안정 렌더) |
| AC-2 | 기존 DEVELOPMENT_SLICES.md → import → render 왕복이 무손실 (필드 단위 비교 테스트) |
| AC-3 | slices.json을 close-source에 추가한 뒤에도 기존 캡슐 finalize/audit-close가 회귀 없이 통과 |
| AC-4 | 렌더 파일 직접 편집 시 doctor가 드리프트를 감지하고, 이후 render가 조용히 덮어쓰지 않는다 (소유권 계약의 테스트 고정) |
| AC-5 | `task status --json`의 next-work projection이 slices.json에서 추천한다 (기존 `TASK_NEXT_DEVELOPMENT_SLICES_MISSING`/`rows: 0` 경로 대체) |
| AC-6 | 도그푸딩 캡슐 2개 이상에서 slice 관련 수동 문서 동기화 0회 달성 (evidence로 기록) |

**Evidence 계획**: AC별 focused test + HADARA-dev 자체 slice(예: 이 rc0 스코프 5개 항목 자체를 slice로 등록)로 도그푸딩 + AC-1의 diff 측정 결과를 evidence 아티팩트로 첨부. **성공/실패 판정 결과를 0.5 RFC §9 게이트의 공식 evidence로 인용한다.**

**Out of scope**: project.json/task state로의 확장 (0.5, 게이트 통과 후), TASK_BOARD의 state화 (2차 후보), Tier 2 hybrid 블록 (0.5).

**실패 시 처리**: rc0 릴리스에서 이 항목만 제외 가능하도록 다른 항목들과 코드 경계를 분리해 구현한다. 실패 지표는 그대로 evidence로 남겨 0.5 RFC 개정/기각의 근거로 쓴다.

**구현 결과 (T-0500)**: AC-1~AC-5는 Met. AC-6(도그푸딩 캡슐 2개 이상에서 slice 관련 수동 문서 동기화 0회)은 **Partial** — 쓰기 경로/소유권 드리프트 가드는 대표 픽스처로 증명됐지만, HADARA-dev 자신은 이번 캡슐에서 slices state를 실제로 채택하지 않았다. 이유: `slice migrate`의 id 도출 규칙(Slice 셀의 첫 토큰, `:`/`|` 앞)은 신규 `id: title` 관례를 전제하는데, HADARA-dev의 실제 414행 `docs/DEVELOPMENT_SLICES.md`는 이 관례 이전 형식(평문 제목)이라 마이그레이션 시 id 충돌이 발생한다(dry-run으로 확인, 실행하지 않음). T-0500 TASK.md RF-1/RF-2에 후속 과제로 기록. Evidence: `ev:T-0500:250d41efcb9d42c19b6dce6c`, `ev:T-0500:525c1b2552ce4726af350b63`.

---

## 항목 6 — 저수준 라이프사이클 커맨드 표면 제거

**동기**: FD-013 — 항목 4의 `--auto`가 착지하면 finalize가 저의례 요구까지 포함해 라이프사이클의 유일한 오케스트레이션 경로가 된다. 그 시점에 `task finish`(task-local write), `task close`(evidence-append)의 standalone 표면은 **finalize의 스냅샷 가드 밖에서 동작하는 비보호 쓰기 경로**로만 남고, `task ready`/`task audit-close`(read-only)는 `task status --detail full` 및 finalize dry-run 보고와 중복된다. 표면 축소는 항목 1의 드리프트 게이트가 검사할 면적도 줄인다. 제거 작업의 모양은 T-0496(handoff update 제거: routing/registry/write-preflight/help/docs/tests)과 동일한 선례를 따른다.

**제거 대상** (5개) — 대체 주체는 **finalize 하나**다: 쓰기 스텝은 finalize execute(`--auto`)의 내부 스텝이, 읽기 스텝은 finalize dry-run의 스텝별 보고(finish/ready/close/audit 각각의 satisfied/required/blocked)가 흡수한다. finalize dry-run은 원래 4단계 전부를 read-only 평가하므로 스텝 단위 진단 정보는 손실되지 않는다.

| 커맨드 | 성격 | 대체 |
|---|---|---|
| `task finish` | task-local write | finalize execute(`--auto`)의 내부 finish 스텝 |
| `task ready` | read-only 진단 | finalize dry-run의 ready 스텝 보고 |
| `task close` | evidence-append | finalize execute의 내부 close 스텝 |
| `task audit-close` | read-only 감사 | finalize dry-run의 audit-close 스텝 보고 |
| `task complete` | read-only 가이드 (finish/ready/close/audit 조합 안내) | 대상 커맨드 소멸로 존재 이유 소멸. 레지스트리에 이미 `deprecatedCandidate` 표시됨 |

보조 표면: "닫을 의도 없이 준비 상태만 확인"하는 일상 진단에는 `task status --task T-X --detail full`이 이미 동일한 done-level 진단 정보를 제공한다 (AC-3이 이 회귀 없음을 고정). 이것은 대체의 본체가 아니라 진단 편의 표면이다 — "finalize dry-run"이라는 동사가 닫을 의도를 함의하므로, 의도 없는 조회 경로가 하나 있는 것이 UX상 유용하다.

**범위**: CLI 라우팅, 커맨드 레지스트리, write-preflight, primary lifecycle/help, 현행 문서, 테스트에서의 제거. **내부 모듈(`task-finish.ts`, `task-ready.ts`, `task-close.ts`, audit 로직)은 finalize 파이프라인의 엔진으로 존속** — 이 캡슐은 표면 제거이지 리팩터가 아니다.

**제거 방식 — T-0496과의 의도적 차이**: handoff update는 고장난 커맨드였으므로 하드 제거가 맞았다. 이 5개는 정상 동작하는 커맨드이므로, 라우팅을 **deprecation stub으로 교체**한다: 호출 시 unknown command가 아니라 구조화된 오류(`code: TASK_LIFECYCLE_COMMAND_REMOVED` + `replacementCommand` 필드)로 실패하며, stub은 최소 한 마이너 버전 유지 후 제거한다. 에이전트가 오류 JSON만 보고 자가 복구할 수 있게 하기 위함이다.

**Acceptance**:

| ID | Criterion |
|---|---|
| AC-1 | 5개 커맨드가 레지스트리/primary lifecycle help/write-preflight에서 제거되고, 호출 시 구조화된 안내 오류로 실패한다 — 오류 페이로드에 `replacementCommand`(예: finish→`task finalize --execute --auto`, ready→`task status --task T-X --detail full`)가 스키마 필드로 포함되며, 출력 스키마(`hadara.commandRemoved.v1` 류)가 추가된다 |
| AC-2 | **복구 경로 완결성**: 부분 실행 후 중단 픽스처(finish 기록 후 close 블로킹 상태의 캡슐)가 finalize 재실행만으로 closed-valid에 도달한다 |
| AC-3 | **필드 수준 패리티** (요약 존재 수준 금지): 동일한 결함 캡슐 픽스처 집합에 대해, `task ready --level done` 보고가 내던 blocker의 code/path/severity 및 acceptance·evidence 분류가 `task status --task T-X --detail full` 보고에 **전부 존재**함을 두 보고의 이슈 집합 비교 테스트로 증명한다 |
| AC-4 | **감사 계약 보존**: close audit verdict(`closed-valid`/`closed-invalid` 등)가 finalize dry-run 보고와 `task status --detail full` 보고 **모두에서 안정된 스키마 필드로 기계 판독 가능**하다. 현행 status detail 보고에 verdict 필드가 없거나 모호하면 **이 캡슐 내 선행 패치**로 먼저 추가한다. 외부 자동화용 마이그레이션 노트(기존 `task audit-close` 소비자가 어느 커맨드의 어느 필드를 읽어야 하는지)를 CLI JSON contract 문서에 포함한다 |
| AC-5 | `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/COMMAND_SURFACE.md`, 워크플로 가이드 등 현행 문서에서 저수준 커맨드 참조가 제거/갱신된다 (historical spec은 제외, T-0496과 동일 기준) |
| AC-6 | 항목 1의 드리프트 게이트가 제거 후 표면(stub 포함)에서 통과한다 |

**Evidence 계획**: 핵심 증명 셋 — ① AC-2의 부분-실행 복구 픽스처 (저수준 커맨드 없이 모든 문서화된 복구 시나리오가 완결됨; 항목 4의 AC-3과 같은 급), ② AC-3의 ready↔status 이슈 집합 패리티 픽스처 (code/path/분류 단위 비교), ③ AC-4의 audit verdict JSON contract 테스트 (finalize dry-run과 status detail 양쪽에서 verdict 필드 계약 검증). + stub 오류 스키마 계약 테스트 + routing/registry/help focused tests + 문서 참조 grep 검증.

**의존성**: 항목 4 Done 이후 착수. `--auto` 부재 상태에서 제거하면 저의례 경로 공백으로 의례가 오히려 증가한다.

**Out of scope**: 내부 라이프사이클 모듈 리팩터, 아래 부록의 여타 compat 후보 제거 (command-portfolio RFC).

**구현 결과 (T-0500)**: AC-1~AC-6 전부 Met. 사용자 지시로 `task lifecycle`을 여섯 번째 제거 대상에 추가(표면 제거에 status/finalize 흡수 포함). Evidence: `ev:T-0500:ef6aa0705a59470099f4de99`(Docker 1033/1033, AC-2/AC-3/AC-4 회귀 테스트 포함), `ev:T-0500:250d41efcb9d42c19b6dce6c`(빌트 CLI 스텁 스모크).

---

## 릴리스 판정

- 항목 1~4, 6: 전부 Done — T-0497(항목 2/3/일부 6 선행), T-0499(항목 1/4), T-0500(항목 6) 완료
- 항목 5: Done 또는 "실패 evidence와 함께 명시적 제외" 중 하나면 rc0 태깅 가능 — 현재 **Partial**: 인프라(AC-1~AC-5)는 Met, 도그푸딩 카운트 지표(AC-6)만 미충족. rc0 태깅 전 다음 중 하나 필요: (a) HADARA-dev 자체를 slices state로 전환해 2개 이상 캡슐에서 실사용 도그푸딩을 완료하거나, (b) AC-6을 명시적으로 "실패 evidence와 함께 제외"로 재분류. 상세는 `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` FD-012 행과 T-0500 TASK.md RF-1/RF-2 참조.
- FD-011/FD-012/FD-013은 `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` Debt Queue에 등록됨; 캡슐 open/close 시 해당 표의 Target/Resolution을 갱신한다 — 셋 다 Done으로 갱신됨(T-0499/T-0500)

---

## 부록: 추가 제거 후보와 처리 상태 (command-portfolio RFC 대상)

레지스트리(`capability-registry.ts`)가 이미 `deprecatedCandidate: true`로 표시한 compat 표면과 중복 표면. T-0528은 이 중 대체가 명확하고 public routing 유지 가치가 낮은 후보를 완전 제거했다.

| 후보 | 상태 | 근거 | 대체 |
|---|---|---|---|
| `task next` | Removed in T-0528 | deprecatedCandidate; `task status`가 select-work를 담당 | `task status` (select-work 모드) |
| `task lifecycle` | Stub retained | deprecatedCandidate; 동일 공지 존재 | `task status --task` |
| `task show` | Removed in T-0528 | deprecatedCandidate ("Compatibility surface") | `task status --task` |
| `evidence collect` | Removed in T-0528 | deprecatedCandidate ("Compatibility surface") | `evidence add-command` / `validation run` |
| `write preflight` | Deferred | deprecatedCandidate ("Compatibility alias") | policy preflight 계열 |
| `policy check-shell` | Deferred | deprecatedCandidate ("Compatibility shell policy check") | policy preflight |
| `ops status` | Removed in T-0528 | deprecatedCandidate ("Compatibility alias") | `status` / `doctor` |
| `package smoke` (reduced) | Stub retained | deprecatedCandidate; canonical surface is `smoke package` | release 패밀리 스모크 |
| `init register-doc` | Removed in T-0528 | `docs register`와 등록 경로 이중화 (docs-governance에 등록 커맨드 2개) | `docs register`로 통합 |
| `handoff stale-problems` | Removed in T-0528 | 니치 read-only 진단 | `status` / manual handoff review |
| `docs archive` | Removed in T-0528 | dry-run 계획 전용 니치 진단 | `docs list` / `docs doctor` |
| `task upgrade-scaffold` | Removed in T-0528 | deprecatedCandidate; `protocol remediate`와 역할 중첩 | `protocol remediate` |
