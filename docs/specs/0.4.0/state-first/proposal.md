# HADARA 재설계 제안: State-First Architecture

- 작성일: 2026-07-05
- 작성 근거:
  1. **실사용**: Forecast Pet 게임 프로젝트(M0~M8, Task Capsule 9개 T-0001~T-0009)를 hadara 0.4.0 위에서 완주한 세션의 실제 마찰 기록
  2. **소스 분석**: `F:\NowWorking\HADARA-dev` (TypeScript ~51,800 LOC) 및 설치 배포본(`hadara@0.4.0` dist) 코드 확인
  3. **저자 백로그 교차검증**: `known_issue_or_idea.log`의 15개 항목과의 대조
- 상태: 제안 초안. 기존 0.4 프로토콜과의 마이그레이션 경로 포함.

---

## 0. 한 문장 요약

> **"에이전트가 마크다운 문서를 쓰고 CLI가 채점하는 도구"에서
> "에이전트가 구조화된 상태를 조작하고 CLI가 문서를 렌더링해주는 도구"로 뒤집는다.**

이미 HADARA 안에 정답 패턴이 존재한다. `evidence.jsonl`(append-only canonical) + `EVIDENCE.md`(생성된 projection, slot 마커) 구조가 그것이다. 이 패턴을 evidence 한 곳에만 두지 말고 **모든 상태로 일반화**하는 것이 이 제안의 전부다.

---

## 1. 현재 아키텍처 진단 (사실 기반)

### 1.1 규모와 형태

| 항목 | 수치 | 출처 |
|---|---|---|
| src 전체 | ~51,800 LOC | `src/` 집계 |
| 최대 모듈 | `src/services/` 22,043 LOC / 58파일 | 실질 비즈니스 로직의 43%가 한 디렉터리에 집중 |
| CLI 커맨드 | 90개 / 12 families | `src/services/capability-registry.ts` (2,540 LOC 단일 파일) |
| 출력 스키마 | JSON Schema 85개 | `src/schemas/*.json` |
| 테스트 | 151개 `*.test.ts` | `tests/unit`, `tests/contract`, `tests/harness` |

### 1.2 핵심 문제 A — Markdown이 데이터베이스다

Task Capsule의 canonical 상태는 `tasks/T-*/TASK.md`의 **마크다운 테이블 그 자체**다.

- 파싱: `src/services/markdown-table.ts` — AST 없이 `|` 스플릿 + 정규식 섹션 슬라이스
- 검증: `src/harness/validate.ts` 한 파일에 **컨트롤드 토큰 셋 ~16개** (`RISK_STATE_TOKENS`, `SOURCE_DOCUMENT_ROLE_TOKENS`, `ACCEPTANCE_*`, `VALIDATION_*` 등)
- 별도로 `src/services/docs-registry.ts`에 **또 다른 vocab 7종** (`DOCS_REGISTER_ALLOWED_VALUES`) — 두 파일이 각자 enum을 소유, 공유 소스 없음

**실사용에서의 증상:**
- 에이전트가 산문으로 `Resolved`라고 썼다가 finalize 단계에서야 `Closed`여야 한다고 거부됨 (`HARNESS_TASK_RISK_STATE_INVALID_TOKEN`). 허용값을 사전에 조회할 방법이 없어 9개 태스크 내내 "틀리고 → 에러 메시지로 배우는" 루프 반복
- `Inputs/Constraints`의 Role/State 토큰도 동일 (`constrains`는 안 되고 `constraint`여야 함 — 에러 후에야 인지)
- 저자 자신의 known_issue #1: "**/compact 후 캡슐 마크다운 정합성이 깨진다**" — 상태가 산문 속에 있으므로 컨텍스트 압축이 곧 상태 파괴가 되는 구조적 문제

### 1.3 핵심 문제 B — 같은 사실이 N곳에 존재한다

"M3 완료" 하나가 다음 다섯 곳에 수동 반영되어야 했다:

1. `tasks/T-0004/TASK.md` (Status, History)
2. `docs/TASK_BOARD.md` (CLI가 자동 갱신 — 유일하게 자동)
3. `docs/PROJECT_STATE.md` (수동)
4. `docs/AGENT_HANDOFF.md` (수동, 아래 1.4 참조)
5. `docs/DEVELOPMENT_SLICES.md` (수동 — CLI는 이 파일을 `rows: 0`으로 파싱 실패)

저자 known_issue #9("수동 폴더 삭제 후 캡슐 넘버링이 1 어긋남 — 사이드 JSON 스토어 의심")는 이미 마크다운과 숨은 상태 간 이중화가 드리프트를 만들고 있다는 자체 증언이다.

### 1.4 핵심 문제 C — `handoff update` 사건 해부

실사용에서 가장 큰 시간을 잃은 버그. 원인이 이번 소스 분석으로 완전히 규명됨:

- **설치된 0.4.0 배포본** `dist/handoff/handoff.js`: `handoff.update`가 **하드코딩된 템플릿 문자열로 파일 전체를 `fs.writeFileSync`** 한다. 사용자가 만든 문서 구조(managed section 포함)를 통째로 날린다.
- 더 나쁜 것: 그 템플릿에 **HADARA 자기 프로젝트의 내용이 유출**되어 있다 — "Do Not Change Without Updating Tests: ProviderClient contract, Policy decision matrix, Task Capsule file contract, Portable/project store boundary"는 HADARA 내부 아키텍처 관심사인데 모든 사용자 프로젝트의 핸드오프에 그대로 박힌다.
- **개발 저장소(F:\)에는 이 writer가 없다.** `src/cli/handoff.ts`는 `suggest`(read-only, `--execute` 시 `HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED`)와 `stale-problems`만 구현. 즉 문제를 인지하고 dev에서 제거했지만, **배포본과 개발 저장소가 드리프트**된 상태로 릴리스가 나가 있다.

교훈 세 가지: (a) 공유 문서에 대한 전체-파일 재생성 writer는 금지되어야 하고, (b) 템플릿에 프로젝트 고유 내용이 들어가지 못하게 하는 구조가 필요하며, (c) dist/dev 드리프트를 막는 릴리스 게이트가 필요하다.

### 1.5 핵심 문제 D — 커맨드 표면 90개 + 이중 레지스트리

- 디스패치는 `src/cli/main.ts`의 수기 `switch(command)`, 각 핸들러는 자체 문자열 매칭
- 선언적 레지스트리(`capability-registry.ts`, 90 entries)는 **디스패처가 아니라 메타데이터 문서** — 둘이 독립적으로 유지되므로 그 자체가 드리프트 소스
- 실사용에서 12 families 중 실제로 쓴 것은 3~4개 family, ~12개 커맨드. 나머지 78개는 표면적만 넓힘

### 1.6 핵심 문제 E — 의례(ceremony)의 고정 비용

finalize 파이프라인(`src/task/task-finalize.ts`: finish → ready → close → audit-close, planHash 게이트)은 내부 설계는 견고하나, 표면에서는 **9개 태스크 모두 동일한 왕복**이었다:

```
dry-run 호출 → blocked(항상: TASK_BOARD 미갱신이 원인, finish가 해결할 것) 확인
→ planHash 복사 → execute 호출 → closed-valid
```

blocked가 "execute가 자동으로 풀 문제"를 미리 보여주는 것에 불과한 경우에도 2회 왕복 + 해시 복사가 강제된다. 저자 known_issue #6("캡슐이 너무 작고 토큰 낭비가 심함")과 같은 방향의 문제 — **의례 비용이 캡슐 단위 비용을 키워서, 적정 캡슐 크기를 왜곡**한다.

### 1.7 잘 설계된 것 (유지 대상)

| 자산 | 위치 | 평가 |
|---|---|---|
| **evidence.jsonl + EVIDENCE.md projection** | `src/evidence/` | append-only canonical + 생성된 뷰 + slot 마커. **본 제안의 원형** |
| **validation run** | `src/services/validation-run.ts` | `spawnSync` 실제 실행 → exit 분류(Passed/Failed/Blocked) → evidence 기록 → TASK.md 행 갱신. 실사용 만족도 최고 |
| **planHash/beforeHash 패턴의 의도** | task-finalize, docs.patch | stale-write 방지라는 목표는 옳음 (표면만 과함) |
| **정책/권한 계층** | `src/policy/` (command-risk, permission-matrix, preflight) | 에이전트 셸 실행 거버넌스로서 독립적 가치 |
| **85개 출력 JSON Schema** | `src/schemas/` | 계약 기반 출력. 입력에도 같은 규율을 적용하면 됨 |
| **write boundary 타입** (`read-only`/`task-local`/`evidence-append`/`shared-doc-write`) | 전반 | 그대로 계승 |

---

## 2. 설계 원칙

1. **Single Source of Truth**: 모든 canonical 상태는 구조화 저장소 한 곳. 마크다운은 전부 projection.
2. **Write-time validation**: 잘못된 입력은 저장 시점에 허용값 목록과 함께 즉시 거부. finalize에서 처음 알게 되는 검증은 0건이어야 한다.
3. **Ceremony는 위험에 비례**: 검사는 전부 유지하되, 왕복 횟수는 실제 위험(파괴적 쓰기)에만 비례시킨다.
4. **에이전트가 1차 사용자**: 모든 커맨드는 `--json`이 기본. 사람용 표현(마크다운/TUI/대시보드)은 같은 상태의 다른 렌더링.
5. **자기 자신에게 배신당하지 않기**: 템플릿에 프로젝트 고유 내용 금지, dist/dev 드리프트 릴리스 게이트, 레지스트리=디스패처 단일화.

---

## 3. 목표 아키텍처

### 3.1 상태 저장소: `.hadara/state/`

```
.hadara/
├─ state/
│  ├─ project.json          # 프로젝트 메타, phase, active task
│  ├─ slices.json           # 마일스톤/백로그 (일급 객체, §7)
│  ├─ tasks/
│  │  └─ T-0004.json        # 태스크 캡슐 전체 상태 (아래 스키마)
│  ├─ docs-registry.json    # (기존 유지, state로 이동)
│  └─ vocab.json            # 모든 컨트롤드 enum의 단일 소스 (§8)
├─ evidence/
│  └─ T-0004.jsonl          # 기존 evidence.jsonl 그대로 (이미 정답)
└─ context/                 # (기존 유지)
```

**태스크 상태 스키마 (요지):**

```jsonc
{
  "schemaVersion": "hadara.taskState.v1",
  "id": "T-0004",
  "rev": 17,                        // 낙관적 동시성 제어 (§5)
  "title": "M3: ForecastEngine v0.1",
  "status": "done",                 // vocab.json#task.status
  "slice": "M3",                    // slices.json 참조
  "goal": { "text": "...", "notes": "..." },
  "scope": { "in": ["..."], "out": ["..."] },
  "plan": [ { "id": 1, "action": "...", "status": "done" } ],
  "acceptance": [
    {
      "id": "AC-1",
      "criterion": "Each forecaster matches its documented formula",
      "state": "met",               // write-time 검증
      "evidence": ["ev:T-0004:1e681dce..."],   // §6에서 자동 연결
      "ref": "05_MODEL_TRAINING_SPEC.md#6"
    }
  ],
  "validation": [ { "check": "...", "gate": true, "result": "passed", "evidence": ["..."] } ],
  "sources": [ { "path": "...", "role": "constraint", "state": "approved", "notes": "..." } ],
  "changes": [ { "area": "...", "summary": "..." } ],
  "risks": [ { "id": "RF-1", "kind": "follow-up", "state": "open", "summary": "...", "link": "..." } ],
  "history": [ { "at": "2026-07-04T13:42:58Z", "state": "done", "note": "...", "by": "agent" } ],
  "close": { "state": "closed-valid", "proofEvidence": "ev:...", "closedAt": "..." }
}
```

### 3.2 Projection 렌더러

기존 `EVIDENCE.md` projection 파이프라인(`evidence-summary.ts`의 slot 채우기)을 일반화한 `hadara render`가 상태 변경 시 자동 실행:

```
.hadara/state/*  ──render──▶  tasks/T-0004/TASK.md      (사람이 읽는 뷰)
                              tasks/T-0004/HANDOFF.md
                              docs/TASK_BOARD.md
                              docs/PROJECT_STATE.md
                              docs/AGENT_HANDOFF.md
                              docs/DEVELOPMENT_SLICES.md
```

- 렌더된 파일 머리에 `<!-- generated by hadara render; edit via hadara CLI -->` 1줄
- **managed section 마커, before-hash 패치, 소유권 규칙(agent는 이 열만/CLI는 저 열만) 전부 폐기** — 파일 전체가 생성물이므로 소유권 문제가 구조적으로 소멸
- git diff 친화성은 유지됨 (렌더 출력은 안정 정렬된 plain markdown)
- 사람이 파일을 직접 고치면? `hadara doctor`가 projection 해시 불일치를 감지하고 "state에 반영하거나(`hadara import`) 재렌더로 버리거나" 선택지 제시. `/compact`로 문서가 깨져도(known_issue #1) **상태는 무손상, 재렌더 한 방으로 복구**

### 3.3 해소되는 문제 매핑

| 1장의 문제 | 해소 방식 |
|---|---|
| A. Markdown-as-DB, 사후 토큰 린트 | 상태 쓰기 시점 스키마 검증. `markdown-table.ts` 파서는 마이그레이션 임포터로 강등 |
| B. 5중 수동 동기화 | 상태 1회 변경 → 뷰 5개 자동 재렌더 |
| C. handoff 클로버링 | AGENT_HANDOFF.md 자체가 projection. writer가 존재하지 않음 |
| D. 커맨드 90개 | §4에서 ~25개로 축소 |
| E. finalize 의례 | §5에서 rev 기반 CAS로 대체 |
| known_issue #1 (/compact 깨짐) | 상태 무손상 + 재렌더 복구 |
| known_issue #9 (넘버링 드리프트) | 사이드 스토어가 아니라 유일 스토어가 됨 |
| known_issue #3/#12 (큰그림 유실) | §9 `brief` |

---

## 4. 커맨드 표면: 90 → ~25

레지스트리가 곧 디스패처가 되도록 단일화한다 (`capability-registry.ts`의 entry에 handler를 직접 바인딩). 커맨드 정의가 한 곳에만 존재하므로 main.ts switch와의 드리프트가 불가능해진다.

### 4.1 새 표면 (제안)

```bash
# ── 세션/조망 ──────────────────────────────
hadara brief [T-XXXX]          # 세션 시작 단일 진입점 (§9)
hadara doctor                  # init doctor + docs doctor + projection 드리프트 통합

# ── 슬라이스/백로그 (§7) ────────────────────
hadara slice add|list|set

# ── 태스크 라이프사이클 ─────────────────────
hadara task create [--slice M3]
hadara task set T-X --status|--goal|--scope-in|...   # write-time 검증
hadara task plan add|done T-X ...
hadara task ac add|set T-X ...
hadara task risk add|set T-X ...
hadara task note T-X "..."                            # 자유 산문은 note로
hadara task close T-X [--force-rev N]                 # §5, 원자적
hadara task status [T-X]

# ── 증거/검증 ──────────────────────────────
hadara verify T-X [--ac AC-1] -- <command>            # §6 (validation run 계승+확장)
hadara evidence add|summary T-X ...

# ── 문서/렌더 ──────────────────────────────
hadara docs register|set|list ...                     # set = 기존 항목 수정 경로 (신설)
hadara render [--check]                               # 수동 재렌더 / CI 드리프트 검사

# ── 스키마/어휘 ─────────────────────────────
hadara schema [task.risk.state]                       # §8, 모든 enum 사전 조회

# ── 기존 유지 (독립 가치) ────────────────────
hadara policy ... / mcp serve / tui / dashboard / release ...
```

### 4.2 흡수/폐기되는 것

| 기존 (90개 중) | 처리 |
|---|---|
| `task finish/ready/close/audit-close/finalize` 5종 | `task close` 1개로 흡수 (내부 파이프라인은 유지) |
| `handoff update/suggest/stale-problems` | 폐기 — AGENT_HANDOFF.md는 projection. 사람 판단이 필요한 next-step 텍스트는 `task note`/`project.json`의 필드 |
| `docs patch/managed list/managed explain/mark` | 폐기(managed section 자체가 사라짐) / `docs set`으로 통합 |
| `context pack/slice` 계열 | `brief`의 pointers 필드로 흡수. 정밀 슬라이스는 에이전트 자체 파일 도구가 이미 잘함 |
| `protocol remediate/migrate` | `migrate` 1개 유지 (0.4→0.5 임포터, §10) |
| 진단 계열 다수 (`proof status`, `debt`, `ci`, ...) | `doctor` 산하 서브커맨드로 정리 |

---

## 5. 라이프사이클: planHash 의례 → rev 기반 CAS

### 5.1 현행 유지되는 것

finish→ready→close→audit-close 4단계 검사 로직, write boundary 타입, close proof의 evidence-append — 전부 유지. 바뀌는 것은 **표면의 왕복 프로토콜**뿐이다.

### 5.2 새 프로토콜

```bash
$ hadara task close T-0004
# 내부: state rev 스냅샷(17) → 4단계 검사 실행
#   - 전부 통과 & rev 불변 → close proof 기록, status=done, 렌더 → "closed-valid" (1회 호출 끝)
#   - 블로커 발견 → 아무것도 쓰지 않고 블로커 목록만 출력 (기존 dry-run과 동일한 정보)
#   - 검사 도중 rev 변경 감지 → 중단 + 재시도 안내 (기존 planHash mismatch와 동등한 안전성)
```

- 낙관적 동시성(rev compare-and-swap)이 planHash가 막던 "검토 시점과 실행 시점 사이의 드리프트"를 동일하게 막는다. 차이는 **깨끗한 경로가 1회 호출**이라는 것.
- 해시 왕복 의례는 진짜 파괴적 작업에만 잔존: `protocol migrate`, `docs archive --execute` 등.
- 부수 효과: 캡슐당 고정 의례 비용이 줄어 known_issue #6(캡슐 크기 왜곡)의 압력이 낮아진다.

---

## 6. Acceptance ↔ Evidence 자동 연결: `hadara verify`

실사용에서 최고 평가를 받은 `validation run`을 계승하되, evidence ID를 사람이 AC 행에 복사하던 마지막 수작업을 없앤다.

```bash
$ hadara verify T-0004 --ac AC-1 -- godot --headless --script res://tests/test_m3.gd
# 1. spawnSync 실행 (기존 validation-run.ts 그대로)
# 2. exit code → passed/failed/blocked 분류 (기존 execution-semantics 그대로)
# 3. evidence 기록 (기존 그대로)
# 4. [신규] state의 acceptance[AC-1].state = met/failed + evidence 연결
# 5. [신규] TASK.md 재렌더
```

- `--ac` 없이 쓰면 기존 `--check` 동작과 동일 (validation 행만)
- close 조건 "모든 gate AC가 met + 모든 gate validation이 passed"가 **자동으로 집계 가능**해짐 → §5의 1회 close가 성립하는 기반
- 기존 기능인 "재실행 성공 시 이전 failed evidence 자동 resolve"도 그대로 계승

---

## 7. Slice(마일스톤/백로그)를 일급 객체로

현행 `docs/DEVELOPMENT_SLICES.md`는 CLI가 특정 테이블 헤더(`| Order | Slice | Capsule | Purpose | Done Evidence |`)를 요구하면서도 실제로는 파싱에 실패한다(`rows: 0`). 파일 규약 대신 상태 객체로:

```bash
hadara slice add M3 "ForecastEngine v0.1" --depends M2 \
  --accept "No NaNs; ensemble weights normalize" --source "docs/spec/.../05_MODEL_TRAINING_SPEC.md"
hadara task create --slice M3        # slice의 accept가 AC 초안으로 자동 유입
hadara brief                          # 의존성 그래프 기반 next-work 추천 포함
```

- 실사용에서 매 마일스톤 반복된 "이전 캡슐 닫기 → 새 캡슐 만들기 → 스펙에서 AC 다시 옮겨적기 → SLICES 표 수동 갱신" 루프가 커맨드 2개로 준다.
- task close 시 해당 slice 상태 자동 갱신, DEVELOPMENT_SLICES.md는 projection으로 자동 생성.

---

## 8. 어휘(vocab) 단일 소스와 `hadara schema`

- `harness/validate.ts`의 ~16개 토큰셋 + `docs-registry.ts`의 7개 vocab을 `.hadara/state/vocab.json`(패키지 기본값 + 프로젝트 오버라이드 불가 필드 구분)으로 통합. 두 모듈 모두 이 파일을 import.
- 조회 커맨드:

```bash
$ hadara schema task.risk.state
{ "allowed": ["open","accepted","mitigated","deferred","closed","superseded","rejected"] }
```

- 모든 `set/add` 커맨드의 거부 에러에 허용값 목록을 반드시 포함 (현행 harness 에러는 finalize 시점에만, 일부만 노출).
- MCP tool schema(`src/mcp/tool-schemas.ts`)도 같은 소스에서 생성 → 에이전트가 도구 스키마만 보고도 올바른 값을 쓴다.

---

## 9. `hadara brief` — 세션 시작 단일 진입점

known_issue #3/#12("새 세션이 마지막 캡슐 핸드오프만 따라가고 큰 그림을 놓친다")의 직접 해법. 현행 "필수 문서 4~5개를 읽어라"(AGENTS.md Required Reading) 모델을 호출 1회로 압축:

```bash
$ hadara brief --json
{
  "project": { "name": "...", "phase": "...", "goalSummary": "..." },   # 큰 그림 (프로젝트 목표 요약이 상태에 존재)
  "slices": { "done": ["M0","M1"], "active": "M2", "next": "M3" },
  "activeTask": { "id": "T-0003", "goal": "...", "openAcceptance": [...], "failingValidation": [...] },
  "warnings": [ "M2 test는 자체 상태 리셋 필요 (T-0003 RF-1)" ],        # carry-forward
  "knownProblems": [...],
  "pointers": { "specs": ["docs/spec/...#7"], "recentEvidence": [...] },
  "nextActions": [ { "command": "hadara verify T-0003 ...", "reason": "..." } ]
}
```

- `session start`, `task status`(select-work 모드), `context pack`, AGENT_HANDOFF 읽기를 대체.
- "큰 그림" 필드(프로젝트 목표, slice 전체 지도)가 항상 포함되므로 마지막 캡슐 터널비전이 구조적으로 방지됨.

---

## 10. 마이그레이션 전략 (0.4 → 제안안)

기존 사용자를 깨지 않는 것이 조건. 다행히 **기존 마크다운 파서가 곧 임포터**다.

1. `hadara migrate --to 0.5` (dry-run 기본):
   - 기존 `tasks/T-*/TASK.md`를 현행 `markdown-table.ts` + `harness/validate.ts`로 파싱 → `.hadara/state/tasks/*.json` 생성
   - 파싱 불가/토큰 위반 행은 보고서로 나열, `--interactive`로 수정 유도
   - evidence.jsonl은 무변환 (이미 canonical)
   - 완료 후 전 문서 재렌더 → git diff로 마이그레이션 결과 검토 가능
2. 과도기 호환: 렌더 출력이 기존 문서 구조와 최대한 동형이 되도록 유지(기존 사람 독자의 연속성).
3. 기존 90 커맨드는 1개 마이너 버전 동안 deprecation 별칭으로 유지 (`task finalize` → "use `task close`" 안내 후 위임).

---

## 11. 구현 로드맵

| Phase | 내용 | 재사용 |
|---|---|---|
| **P0 즉시 (0.4.x 패치)** | ① 배포본 `handoff.update`의 전체-파일 writer 제거(또는 dev와 동일하게 suggest-only로) ② 템플릿에서 HADARA 자기 프로젝트 내용 제거 ③ dist/dev 드리프트 릴리스 게이트(패키지 스모크에 커맨드 표면 diff 추가 — `package-smoke.ts` 확장) ④ 모든 토큰 거부 에러에 허용값 포함 ⑤ `docs register`에 update 경로 추가 | 기존 코드 소폭 수정 |
| **P1 상태 코어** | `.hadara/state/` 스토어 + rev CAS + `vocab.json` 통합 + `task set/ac/risk/plan` write-time 검증 + `migrate` 임포터 | `markdown-table.ts`(임포터), `harness/validate.ts`(검증 로직을 스키마로 이식) |
| **P2 렌더 파이프라인** | `hadara render` + 5대 문서 projection + managed-section/docs.patch 폐기 + `doctor` 드리프트 검사 | `evidence-summary.ts`의 slot 렌더 패턴 일반화 |
| **P3 라이프사이클/UX** | `task close`(CAS) + `verify --ac` + `slice` + `brief` + 커맨드 표면 축소(레지스트리=디스패처) | `task-finalize.ts` 4단계 로직, `validation-run.ts`, `capability-registry.ts` |
| **P4 정리** | `services/` 22k 모놀리스를 state/render/lifecycle/evidence/policy 경계로 분해, MCP tool schema를 vocab에서 생성 | — |

P0는 이번 실사용에서 실제 피해를 만든 항목의 응급 처치로, 아키텍처 변경 없이 가능하다.

---

## 12. 리스크와 반론 검토

| 리스크 | 완화 |
|---|---|
| "마크다운이 canonical이어야 사람이 git에서 바로 읽는다"는 기존 철학과 충돌 | projection도 커밋되는 plain markdown이므로 git 가독성은 동일. 잃는 것은 "사람이 파일을 직접 고쳐서 상태를 바꾸는" 경로뿐인데, 이는 doctor+import로 대체 |
| 상태 JSON과 렌더 파일의 이중 커밋으로 diff 노이즈 | 렌더 출력 안정 정렬 + 상태 파일은 키 정렬 고정. 실질 diff는 오히려 감소 (현행은 같은 변경이 5개 문서에 흩어짐) |
| 마이그레이션 실패 케이스 (자유 산문이 많은 기존 캡슐) | 산문은 `note`/`text` 필드로 무손실 수용. 구조화 실패 행만 인터랙티브 처리 |
| 에이전트가 `task set`류 세분 커맨드를 여러 번 호출하는 비용 | `task set T-X --from-file contract.json`으로 일괄 패치 허용 (JSON Merge Patch) |
| 90→25 축소로 기존 스크립트 파손 | 1 마이너 버전 deprecation 별칭 (§10) |

---

## 부록 A. 실사용 세션 사건 로그 (근거 데이터)

| 사건 | 태스크 | 결과 |
|---|---|---|
| `handoff update`가 커스텀 AGENT_HANDOFF.md를 제네릭 템플릿으로 클로버 | T-0001, T-0002 | 2회 수동 복구 후 커맨드 사용 포기, 이후 7개 태스크는 파일 직접 작성 |
| `docs register --kind` 허용값을 몰라 9회 시행착오 (`design-spec`, `specification`, ... → `spec`) | 부트스트랩 | enum 사전 조회 수단 부재 확인 |
| 스펙 문서 15개 일괄 등록 후 `DOC_CANONICAL_CONFLICT` 15건 — canonical 중복을 등록 시점에 경고하지 않음 | 부트스트랩 | `docs mark`로 정정 시도 → canonical→reference 전환 불허 → **registry JSON 수동 편집**으로 우회 |
| `Resolved` 토큰 거부 (`Closed`여야 함) — finalize 시점에 발견 | T-0003 | 사후 린트 문제의 전형 |
| `Inputs/Constraints` role 토큰 `constrains` 거부 (`constraint`여야 함) — finalize 시점에 발견 | T-0001 | 〃 |
| finalize dry-run→execute 2회 왕복이 9개 태스크 전부에서 동일 반복 | 전체 | 의례 고정비용 |
| `DEVELOPMENT_SLICES.md`를 CLI가 요구했으나(`TASK_NEXT_DEVELOPMENT_SLICES_MISSING`) 작성 후에도 `rows: 0`으로 파싱 실패 | 부트스트랩 | 파일 규약 기반 통합의 취약성 |
| `validation run`은 9개 태스크 × 4~6회 = 총 45회 사용, 마찰 0건 | 전체 | **유지해야 할 코어 가치의 증거** |

## 부록 B. 참조한 소스 위치

- 상태/파싱: `src/task/task-capsule.ts`, `src/services/markdown-table.ts`, `src/harness/validate.ts`
- 라이프사이클: `src/task/task-finalize.ts`, `task-finish.ts`, `task-ready.ts`, `task-close.ts`
- 핸드오프: `src/cli/handoff.ts`, `src/handoff/handoff-suggestion.ts` (dev) vs `dist/handoff/handoff.js` (설치본 0.4.0)
- 증거: `src/evidence/*`, `src/services/validation-run.ts`, `src/services/evidence-summary.ts`
- 문서 거버넌스: `src/services/docs-registry.ts`, `docs-cleanup.ts`, `managed-sections.ts`
- 커맨드 표면: `src/cli/main.ts`, `src/services/capability-registry.ts`
- 저자 백로그: `known_issue_or_idea.log` (15항목)
