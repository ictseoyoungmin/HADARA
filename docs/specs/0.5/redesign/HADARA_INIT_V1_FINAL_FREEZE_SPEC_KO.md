# HADARA Init v1 최종 설계 사양서

- 문서 ID: `HADARA-INIT-SPEC-V1`
- 문서 상태: **Freeze Candidate**
- 규범 수준: 이 문서에서 `MUST`, `MUST NOT`, `SHOULD`, `MAY`로 표현한 항목은 명시적으로 `[OPEN]`으로 표시되지 않는 한 HADARA Init v1의 구현 계약이다.
- 대상: 일반적인 개인·팀·조직·기업 소프트웨어 프로젝트
- 기준 철학: 단일 lifecycle, Markdown 관찰 가능성, 비파괴적 초기화, 명시적 문서 routing, 최소한의 machine state
- 최종 승인 조건: 문서 말미의 `Freeze 승인 체크리스트`를 모두 승인하면 `Frozen`으로 전환한다.
---

## 0. 문서 사용 방법

이 문서는 `hadara init`의 최종 제품 계약과, init 산출물이 곧바로 의존하는 최소 인접 계약을 함께 정의한다.

다음은 이 문서의 규범 범위에 포함된다.

- `hadara init`의 의미와 CLI 동작
- init preset
- greenfield, brownfield, re-init, upgrade
- init이 생성하는 파일과 폴더
- 각 산출물의 역할, 소유권, writer, reader, upgrade 정책
- `TASK_BOARD.md`의 최소 구조
- `TASK.md`에서 Task Board로 projection되는 최소 필드
- preset 문서가 scaffold인지 generated projection인지에 대한 구분
- session bootstrap reading order
- registered document routing의 최소 모델
- 버전이 있거나 없는 문서의 target 표현
- stale, superseded, archived 문서의 처리 경계
- init plan, apply, transaction, 오류와 report

다음은 이 문서의 범위 밖이다.

- validation 실행기의 상세 구현
- evidence record 전체 schema
- close proof 전체 schema
- HANDOFF 전체 schema
- policy engine의 승인 규칙
- release management
- dashboard, TUI, MCP의 상세 인터페이스
- 외부 문서 검색·다운로드
- 조직 계정 및 중앙 서버 관리

범위 밖인 기능이 이 문서의 산출물과 맞닿는 경우, 이 문서는 필요한 최소 interface만 정의한다.

---

# 1. 문제 정의

과거 HADARA의 init은 버전이 변경될 때마다 profile별 파일 구성과 문서 구조가 달라졌고, 다음 문제가 누적되었다.

- profile 하나가 프로젝트 규모, 기능, 문서 구성, 정책 강도를 동시에 표현했다.
- profile 전환과 scaffold upgrade가 구분되지 않았다.
- 실제 적용이 없는데도 여러 action이 성공한 것처럼 출력될 수 있었다.
- init 산출물의 writer와 소유권이 불명확했다.
- 사람이 작성하는 문서와 HADARA가 생성하는 projection이 섞였다.
- 현재 작업에 관계없는 과거·미래 spec이 agent context에 들어갈 수 있었다.
- runtime 내부 폴더가 미래 사용을 가정해 선제적으로 생성되었다.
- 여러 파일이 같은 current state를 중복 보유했다.
- `Note`, `Status`, `Current`, `Profile` 같은 넓은 의미의 필드가 여러 schema에 반복되었다.

Init v1은 다음 질문에 명시적으로 답해야 한다.

1. 모든 프로젝트가 같은 lifecycle을 사용하는가.
2. preset은 무엇을 결정하고 무엇을 결정하지 않는가.
3. init은 정확히 어떤 파일을 생성하는가.
4. 각 파일은 누가 쓰고 언제 읽는가.
5. optional 문서는 자동 projection인가, 사용자 작성 scaffold인가.
6. Task Board는 어떤 정보를 보유하는가.
7. Task close 결과는 Board에 어떻게 반영되는가.
8. version이 없는 문서를 어떻게 routing하는가.
9. 오래된 문서를 HADARA가 어디까지 관리하는가.
10. 기존 프로젝트에 init을 적용할 때 무엇을 보존하는가.

---

# 2. 제품 원칙

## 2.1 단일 lifecycle

HADARA는 프로젝트의 규모와 조직 형태에 관계없이 하나의 lifecycle을 제공해야 한다.

```text
init
→ task status
→ task create
→ 작업 수행
→ validation / evidence
→ task close
→ 다음 세션에서 재개
```

다음 의미는 preset에 따라 달라져서는 안 된다.

- Task Capsule의 역할
- Task ID 충돌 방지
- evidence append 직렬화
- validation 결과 보존
- close 전 acceptance/evidence 검증
- HANDOFF를 통한 재개
- Task Board와 Task Capsule의 일관성
- non-overwrite
- fail-closed
- unknown option 처리
- init plan과 apply의 구분

## 2.2 Init은 프로젝트 등급을 판정하지 않는다

HADARA는 프로젝트를 개인용, 팀용, 기업용으로 영구 분류하지 않는다.

작은 프로젝트가 커지거나 큰 프로젝트가 축소될 수 있으므로, 프로젝트의 영구 정체성을 단일 profile enum으로 표현해서는 안 된다.

## 2.3 Preset은 초기 구성의 편의 기능이다

Preset은 다음의 초기 조합만 선택한다.

- 활성화할 문서 기능
- 생성할 document pack
- 초기 안내 수준

Preset은 다음을 의미하지 않는다.

- 별도 lifecycle
- 프로젝트의 영구 등급
- release 수준
- 보안 수준 인증
- 기업용 여부의 판정
- 향후 사용 가능한 기능의 제한

## 2.4 Init은 비파괴적이어야 한다

Init과 init upgrade는 사용자 파일을 자동 삭제하거나 전체 덮어쓰기해서는 안 된다.

## 2.5 명시적 상태만 저장한다

다른 source에서 계산 가능한 정보는 persistence schema에 중복 저장하지 않는다.

## 2.6 문서는 필요한 시점에만 읽는다

등록된 모든 문서를 session start에 읽지 않는다. 선택된 task와 reading stage에 따라 문서를 결정한다.

## 2.7 HADARA는 문서 정리를 돕지만 의도를 대신 결정하지 않는다

HADARA는 stale 가능성을 진단하고 archive/supersede 계획을 제시할 수 있다. 그러나 사용자의 문서를 자동 삭제하거나 임의로 폐기하지 않는다.

---

# 3. 핵심 결정 요약

다음 결정은 Init v1에서 고정한다.

| 항목 | 결정 |
|---|---|
| Lifecycle | 모든 preset에서 하나 |
| Profile | 영구 profile 제거 |
| Preset | `minimal`, `standard`, `governed` |
| 기존 `basic` | `minimal` compatibility alias |
| 기본 preset | `standard` |
| Project config | `.hadara/project.json` |
| Document registry | `.hadara/documents.json` |
| Runtime 폴더 | init에서 미생성, 실제 사용 시 lazy creation |
| Current global state file | core init에서 생성하지 않음 |
| Task Board | command-managed Markdown index |
| Generic Note 컬럼 | 사용하지 않음 |
| Close 결과 | 명시적인 `Close Summary`에서 `Result`로 projection |
| Optional preset 문서 | 기본적으로 scaffold-once, 이후 사용자 소유 |
| Generated 문서 | 명확한 machine source가 있는 경우만 |
| Upgrade | schema/template/scaffold 보완만 수행 |
| Preset 전환 | `init upgrade`에서 수행하지 않음 |
| 문서 target | `namespace/id` discriminated reference |
| Versionless 문서 | project target, component target 또는 explicit-only |
| Stale | 저장 status가 아닌 doctor verdict |
| 자동 문서 삭제 | 금지 |
| Nested HADARA root | v1에서 기본 미지원 |
| 외부 URL 문서 | v1 routing 대상에서 제외 |

---

# 4. Preset 모델

## 4.1 Preset의 생명주기

Preset은 init plan을 생성할 때만 사용한다.

Init이 완료되면 preset 자체는 runtime authority가 아니다. 프로젝트에는 preset이 펼쳐진 결과만 저장한다.

정보 제공과 migration을 위해 다음 값은 저장할 수 있다.

```json
{
  "presetOrigin": "standard"
}
```

`presetOrigin`은 informational field이며 다음 판단에 사용해서는 안 된다.

- 어떤 파일을 현재 반드시 보유해야 하는지
- 어떤 lifecycle을 사용해야 하는지
- 어떤 정책을 강제해야 하는지
- 현재 프로젝트가 기업용인지

실제 구성은 활성 feature와 document pack이 소유한다.

## 4.2 Minimal preset

대상 예시:

- 개인 실험
- 소형 도구
- 짧은 범위의 오픈소스 작업
- 최소 Task Capsule lifecycle만 필요한 프로젝트

활성 feature:

```text
task-lifecycle
evidence
document-routing
```

document pack:

```text
core
```

## 4.3 Standard preset

대상 예시:

- 일반 개인·팀 프로젝트
- 여러 milestone을 가진 제품
- 프로젝트 소개와 구조 문서가 필요한 프로젝트

활성 feature:

```text
task-lifecycle
evidence
document-routing
project-documentation
```

document pack:

```text
core
project
```

## 4.4 Governed preset

대상 예시:

- 여러 팀이 참여하는 프로젝트
- 보안·운영·책임 문서가 필요한 프로젝트
- 기업 또는 규제 환경을 고려하는 프로젝트

활성 feature:

```text
task-lifecycle
evidence
document-routing
project-documentation
governance-documentation
```

document pack:

```text
core
project
governance
```

### 중요 제한

Init v1의 `governed`는 governance 문서 scaffold를 제공한다는 뜻이다.

다음을 의미하지 않는다.

- 승인 workflow가 구현됨
- 조직 권한 모델이 구현됨
- 보안 인증을 충족함
- release gate가 자동 강제됨

정책 엔진은 별도 사양에서 정의한다.

## 4.5 Project growth

프로젝트의 성장은 profile 전환이 아니라 구성의 명시적 확장으로 처리한다.

```text
minimal
→ project document pack 추가
→ governance document pack 추가
→ 후속 policy capability 추가
```

정확한 mutation command 이름은 별도 구성 관리 사양에서 정한다. Init v1은 preset switch 명령을 제공하지 않는다.

---

# 5. Init 산출물 구조

## 5.1 Core scaffold

모든 preset은 다음 core scaffold를 공유해야 한다.

```text
project-root/
├─ AGENTS.md
├─ .gitignore
├─ .hadara/
│  ├─ project.json
│  ├─ documents.json
│  └─ context/
│     └─ READ_MAP.md
├─ docs/
│  ├─ HADARA_WORKFLOW.md
│  └─ TASK_BOARD.md
└─ tasks/
```

## 5.2 Standard 추가 scaffold

```text
docs/
└─ PROJECT_OVERVIEW.md
```

## 5.3 Governed 추가 scaffold

```text
docs/
├─ PROJECT_OVERVIEW.md
├─ ARCHITECTURE.md
├─ SECURITY.md
└─ GOVERNANCE.md
```

## 5.4 Init에서 생성하지 않는 항목

```text
tasks/T-*/
tasks/*/TASK.md
tasks/*/HANDOFF.md
tasks/*/evidence.jsonl

.hadara/local/
.hadara/local/locks/
.hadara/local/journals/
.hadara/local/cache/

.hadara/state/current.json
.hadara/scaffold.json
.hadara/docs-registry.json

docs/PROJECT_STATE.md
docs/AGENT_HANDOFF.md
docs/RELEASE_READINESS.md
docs/VALIDATION.md
docs/EVIDENCE.md
```

이 목록은 신규 Init v1 기준이다. 기존 프로젝트 migration에서는 legacy artifact를 보존·격리할 수 있다.

---

# 6. Artifact 관리 분류

Init artifact는 다음 관리 유형 중 정확히 하나를 가져야 한다.

## 6.1 `hadara-managed`

HADARA가 문서 전체를 소유한다.

- 사용자는 직접 편집하지 않는다.
- upgrade가 전체 파일을 교체할 수 있다.
- 사용자 프로젝트의 사실이나 의도를 저장하지 않는다.

예:

```text
docs/HADARA_WORKFLOW.md
```

## 6.2 `mixed-managed-block`

HADARA managed block과 사용자 영역이 공존한다.

- upgrade는 managed block만 갱신한다.
- 사용자 영역은 보존한다.
- managed marker 손상 시 fail-closed한다.

예:

```text
AGENTS.md
```

## 6.3 `command-managed`

파일 내용이 lifecycle command에 의해 관리된다.

- 사용자는 command-owned 영역을 직접 수정하지 않는다.
- schema migration은 가능하다.
- 다른 canonical source와 consistency를 검사한다.

예:

```text
docs/TASK_BOARD.md
.hadara/project.json
.hadara/documents.json
```

## 6.4 `scaffold-once`

Init은 초기 골격만 만든다.

- 생성 후 본문은 사용자가 소유한다.
- upgrade는 전체 내용을 변경하지 않는다.
- 존재·등록·routing metadata만 검사할 수 있다.
- 자동 projection으로 재생성하지 않는다.

예:

```text
docs/PROJECT_OVERVIEW.md
docs/ARCHITECTURE.md
docs/SECURITY.md
docs/GOVERNANCE.md
```

## 6.5 `generated-projection`

명시적인 machine source에서 재생성 가능하다.

- 사람이 직접 편집하지 않는다.
- source가 없거나 invalid하면 재생성하지 않는다.
- drift 검사를 수행할 수 있다.

예:

```text
.hadara/context/READ_MAP.md
```

## 6.6 `runtime-internal`

실행 중 내부적으로만 사용한다.

- session reading 대상이 아니다.
- document registry에 등록하지 않는다.
- 기본적으로 Git 추적 대상이 아니다.
- 필요 시 lazy creation한다.

예:

```text
.hadara/local/locks/
.hadara/local/journals/
.hadara/local/cache/
```

---

# 7. Core artifact manifest

| Path | 관리 유형 | 주요 owner | Writer | 기본 Reader | 생성 | Upgrade |
|---|---|---|---|---|---|---|
| `AGENTS.md` | mixed-managed-block | HADARA + 사용자 | init/upgrade + 사용자 | 모든 새 agent session | eager | managed block만 갱신 |
| `docs/HADARA_WORKFLOW.md` | hadara-managed | HADARA | init/upgrade | 모든 새 agent session | eager | template 교체 가능 |
| `docs/TASK_BOARD.md` | command-managed | task lifecycle | task create/close/cancel/migrate | task status, agent, 사용자 | eager | row 보존 구조 migration |
| `.hadara/project.json` | command-managed | configuration subsystem | init/upgrade/config mutation | HADARA commands | eager | schema migration |
| `.hadara/documents.json` | command-managed | document routing subsystem | init/docs commands/upgrade | task status/docs resolver | eager | schema migration |
| `.hadara/context/READ_MAP.md` | generated-projection | document routing subsystem | init/docs sync/upgrade | 사람·agent fallback | eager | 재생성 |
| `.gitignore` | mixed append | 사용자 | init/upgrade + 사용자 | Git | eager patch | 필요한 line만 보완 |
| `tasks/` | directory root | task lifecycle | init/task create | task commands | eager | 보존 |

## 7.1 Preset artifact manifest

| Path | Minimal | Standard | Governed | 관리 유형 |
|---|---:|---:|---:|---|
| Core artifact 전체 | O | O | O | manifest 기준 |
| `docs/PROJECT_OVERVIEW.md` | X | O | O | scaffold-once |
| `docs/ARCHITECTURE.md` | X | X | O | scaffold-once |
| `docs/SECURITY.md` | X | X | O | scaffold-once |
| `docs/GOVERNANCE.md` | X | X | O | scaffold-once |

---

# 8. `AGENTS.md` 계약

## 8.1 역할

`AGENTS.md`는 agent session bootstrap contract다. 

다음을 포함해야 한다.

- HADARA 프로젝트임을 선언
- 필수 reading order
- primary lifecycle command
- selected task 범위 우선 원칙
- registered document routing 원칙
- command-managed 파일 직접 편집 금지
- unregistered 문서를 자동 authority로 사용하지 않는 원칙

다음을 포함해서는 안 된다.

- 전체 CLI reference
- 현재 active task 상세
- 프로젝트 architecture 전체
- task history
- release history
- 모든 optional 문서 목록

## 8.2 Managed block

기존 `AGENTS.md`가 있을 수 있으므로 전체 파일을 HADARA가 소유해서는 안 된다.

권장 구조:

```markdown
# AGENTS.md

<!-- hadara:managed:start bootstrap -->
HADARA bootstrap contract
<!-- hadara:managed:end bootstrap -->

## Project Instructions

사용자 또는 프로젝트가 자유롭게 작성하는 영역
```

규칙:

- 기존 파일을 덮어쓰지 않는다.
- marker가 없으면 brownfield adoption plan에서 삽입을 제안한다.
- marker가 중복되거나 손상되면 conflict로 보고한다.
- 사용자 영역은 upgrade가 변경하지 않는다.
- managed block 내용은 짧고 안정적으로 유지한다.

---

# 9. `HADARA_WORKFLOW.md` 계약

## 9.1 역할

HADARA lifecycle의 사람이 읽는 정본 설명이다.

포함 범위:

- task status
- task create
- validation/evidence
- task close
- HANDOFF
- session resume
- 주요 파일 소유권
- 직접 편집 금지 영역

프로젝트의 현재 상태, roadmap, release 상태를 저장하지 않는다.

## 9.2 소유권

전체 파일은 HADARA managed template이다.

프로젝트별 확장 설명은 별도 사용자 문서에 작성해야 한다.

## 9.3 Session reading

Init v1에서는 사용자의 요구에 따라 다음을 고정한다.

```text
새 agent session은 AGENTS.md와 HADARA_WORKFLOW.md를 반드시 읽는다.
```

문서는 반복 읽기 비용을 줄이기 위해 짧고 안정적이어야 한다.

권장 최대 길이:

```text
AGENTS.md managed block: 150줄 이하
HADARA_WORKFLOW.md: 250줄 이하
```

---

# 10. `TASK_BOARD.md` 인접 계약

`TASK_BOARD.md`는 init이 생성하므로 최소 구조와 후속 writer를 Init v1에서 고정한다.

## 10.1 역할

```text
Task Capsule의 사람이 읽는 index
```

Task Board는 다음이 아니다.

- Task contract
- evidence 저장소
- validation log
- roadmap 자동 추론기
- global current state
- 상세 handoff 문서

## 10.2 최소 구조

```markdown
# Task Board

| ID | Title | Status | Targets | Result | Capsule |
|---|---|---|---|---|---|
```

## 10.3 컬럼 계약

### `ID`

- source: task create
- immutable
- 예: `T-0001`

### `Title`

- source: Task contract
- task create 시 projection
- 이후 명시적 rename operation이 없으면 immutable

### `Status`

최소 허용값:

```text
Draft
In Progress
Done
Cancelled
```

정확한 state transition은 Task Lifecycle 사양이 소유한다.

Init v1은 다음 consistency만 요구한다.

- `Done`은 valid close 이후에만 기록할 수 있다.
- `Cancelled`는 명시적 cancel operation 이후에만 기록할 수 있다.
- Task Board row를 직접 편집해 status를 바꾸어서는 안 된다.

### `Targets`

- source: Task contract의 명시적 targets
- target이 없으면 `project`
- 여러 target은 canonical compact form으로 연결

예:

```text
release:0.1.0
component:api
release:0.3.0; component:authentication
project
```

### `Capsule`

- source: task create
- project root 기준 상대 경로
- 일반적으로 immutable

### `Result`

- source: valid task close의 명시적 Close Summary
- close 전에는 `-`
- 상세 evidence나 긴 설명을 저장하지 않음
- 한 줄 plain text projection
- 권장 최대 길이: 160 Unicode code points

## 10.4 Generic `Note` 금지

Task Board v1에는 범용 `Note` 컬럼을 두지 않는다.

이유:

- 작업 배경, 진행 메모, 완료 결과가 섞일 수 있다.
- writer가 불명확하다.
- close가 자유 형식 문장을 추론하게 된다.
- stale note가 현재 상태처럼 보일 수 있다.

## 10.5 Close Summary source

Task close는 `TASK.md`의 임의 note를 추론해서는 안 된다.

Task contract에는 명시적인 완료 요약 영역이 있어야 한다.

권장 Markdown interface:

```markdown
## Close Summary

Init upgrade와 preset 전환을 분리하고 정확한 dry-run 출력 계약을 추가했다.
```

규칙:

- `Close Summary`는 선택적이다.
- 없으면 Board의 `Result`는 `-`로 유지한다.
- 향후 governed policy가 required로 만들 수 있으나 Init v1에서는 필수가 아니다.
- task close는 exact section을 읽고 한 줄로 normalization한다.
- 일반 `Notes`, 작업 로그, HANDOFF prose에서 자동 추출하지 않는다.
- Board에 기록한 Result는 source task와 source hash를 close record에서 추적해야 한다. close record 형식은 별도 사양이다.

---

# 11. `project.json` 계약

## 11.1 역할

프로젝트의 정적 HADARA 구성만 저장한다.

예시:

```json
{
  "schemaVersion": "hadara.project.v1",
  "projectId": "example-project",
  "lifecycleVersion": "1",
  "presetOrigin": "standard",
  "features": [
    "task-lifecycle",
    "evidence",
    "document-routing",
    "project-documentation"
  ],
  "documentPacks": [
    "core",
    "project"
  ]
}
```

## 11.2 포함 금지

다음을 저장해서는 안 된다.

- active task
- latest completed task
- next work
- evidence outcome
- validation result
- release readiness
- runtime lock
- current process
- generated display text
- stale document verdict

## 11.3 Field 규칙

### `projectId`

- 프로젝트 내부 안정 식별자
- 파일 경로나 package name에 자동 종속되지 않음
- init 시 생성 또는 사용자가 지정
- 이후 자동 변경 금지

### `lifecycleVersion`

- HADARA package version과 구분
- Task Capsule lifecycle 계약의 major compatibility 수준

### `presetOrigin`

- informational
- runtime decision에 사용 금지

### `features`

- 실제 활성화된 기능 목록
- preset expansion 결과
- v1에서 정의되지 않은 feature를 임의로 허용하지 않음

### `documentPacks`

- 실제 설치된 document pack 목록
- 파일 존재 여부와 일치해야 함

---

# 12. Document registry 계약

## 12.1 파일

```text
.hadara/documents.json
```

## 12.2 역할

- HADARA routing 대상으로 등록된 문서 목록
- 경로, 관리 방식, 상태, 읽기 정책, target metadata
- 문서 내용 자체는 저장하지 않음

## 12.3 최소 schema

```json
{
  "schemaVersion": "hadara.documents.v1",
  "documents": [
    {
      "id": "spec-0.1.0",
      "path": "docs/specs/0.1.0.md",
      "management": "user-authored",
      "status": "active",
      "readPolicy": "on-target",
      "appliesTo": [
        {
          "namespace": "release",
          "id": "0.1.0"
        }
      ]
    }
  ]
}
```

## 12.4 필드

### `id`

- 프로젝트 내부 안정 문서 ID
- path가 바뀌어도 유지
- case-sensitive
- trim 후 빈 문자열 금지
- 중복 금지

### `path`

- project root 기준 상대 경로
- root 외부 traversal 금지
- absolute path 금지
- v1에서는 local file만 지원

### `management`

허용값:

```text
hadara-managed
user-authored
mixed-managed-block
generated-projection
external-reference
```

`external-reference`는 v1에서 metadata 보존만 허용하며 자동 읽기·fetch는 지원하지 않는다.

### `status`

허용값:

```text
draft
active
superseded
archived
```

### `readPolicy`

허용값:

```text
session-start
on-target
on-task-explicit
explicit-only
```

### `appliesTo`

`TargetRef` 목록.

- `on-target`이면 최소 하나 필요
- `session-start`, `on-task-explicit`, `explicit-only`에서는 생략 가능
- v1 자동 routing은 exact target match만 지원

### `supersedes`

이 문서가 대체하는 이전 document ID 목록.

- 자기 자신 참조 금지
- cycle 금지
- 존재하지 않는 ID 참조 금지

---

# 13. TargetRef 계약

## 13.1 목적

`kind/value`처럼 의미가 바뀌는 넓은 필드를 사용하지 않는다.

다음 discriminated reference를 사용한다.

```ts
type TargetRef =
  | { namespace: "project" }
  | { namespace: "release"; id: string }
  | { namespace: "milestone"; id: string }
  | { namespace: "component"; id: string }
  | { namespace: "task"; id: string };
```

## 13.2 Namespace 의미

### `project`

프로젝트 전체에 적용한다.

`id`를 가지면 안 된다.

예:

```json
{"namespace": "project"}
```

### `release`

특정 release 식별자에 적용한다.

예:

```json
{"namespace": "release", "id": "0.1.0"}
```

`id`는 semver로 자동 해석하지 않는다. 프로젝트가 선택한 canonical opaque identifier다.

따라서 다음은 자동으로 같은 값으로 처리되지 않는다.

```text
0.1.0
v0.1.0
release-0.1.0
```

프로젝트는 하나의 canonical 표기를 선택해야 한다.

### `milestone`

버전이 아닌 milestone 기반 작업에 사용한다.

예:

```json
{"namespace": "milestone", "id": "M1"}
```

### `component`

특정 subsystem 또는 component에 적용한다.

예:

```json
{"namespace": "component", "id": "api"}
```

### `task`

특정 Task Capsule에만 적용한다.

예:

```json
{"namespace": "task", "id": "T-0012"}
```

## 13.3 버전 없는 문서

버전 없는 문서는 다음 중 하나로 표현한다.

### 프로젝트 전체 문서

```json
{
  "readPolicy": "on-target",
  "appliesTo": [
    {"namespace": "project"}
  ]
}
```

모든 task는 implicit project target을 가진 것으로 처리하므로 자동 후보가 된다.

### Component 문서

```json
{
  "readPolicy": "on-target",
  "appliesTo": [
    {"namespace": "component", "id": "api"}
  ]
}
```

### 특정 target 없이 필요할 때만 읽는 문서

```json
{
  "readPolicy": "explicit-only"
}
```

따라서 `id/value`가 없다고 버전이 없는 문서를 표현하지 못하는 문제가 발생하지 않는다.

## 13.4 Task targets

Task는 명시적인 target을 0개 이상 가질 수 있다.

```yaml
targets:
  - namespace: release
    id: 0.3.0
  - namespace: component
    id: authentication
```

명시적 target이 없어도 resolver는 implicit project target을 추가한다.

## 13.5 자동 match 규칙

v1에서는 다음만 지원한다.

```text
document.appliesTo 중 하나가
task의 explicit targets 또는 implicit project target과
namespace/id exact match하면 후보가 된다.
```

복합 AND 조건, version range, wildcard, glob, semantic version comparison은 지원하지 않는다.

복잡한 문서 선택은 Task의 `requiredDocuments`로 명시한다.

---

# 14. Task document routing 인접 계약

## 14.1 Task interface

Task contract는 최소한 다음 routing interface를 제공해야 한다.

```yaml
targets:
  - namespace: release
    id: 0.1.0

requiredDocuments:
  - spec-0.1.0
```

Task 전체 schema는 별도 사양에서 정의한다.

## 14.2 문서 선택 순서

Task가 선택되면 resolver는 다음 순서로 문서를 구성한다.

1. `session-start` 문서
2. Task의 `requiredDocuments`
3. `on-target`이며 exact match하는 active 문서
4. Task Capsule의 `TASK.md`
5. resume 상황이면 `HANDOFF.md`

구현상 출력 순서는 deterministic해야 한다.

권장 정렬:

```text
session-start registry order
→ requiredDocuments 선언 순서
→ on-target document ID 오름차순
→ Task Capsule local documents
```

## 14.3 Status별 처리

### `active`

자동 routing과 explicit routing 모두 허용한다.

### `draft`

자동 `on-target` routing에서는 제외한다.

Task `requiredDocuments`에 명시되어 있으면 포함하고 warning을 출력한다.

### `superseded`

자동 routing에서는 제외한다.

Task `requiredDocuments`에 명시되어 있으면 포함하고 historical warning을 출력한다.

### `archived`

자동 routing에서는 제외한다.

Task `requiredDocuments`에 명시되어 있으면 포함할 수 있으나 strong warning을 출력한다.

## 14.4 누락과 충돌

### required document ID 없음

`task status`는 blocker를 반환해야 한다.

### document path 없음

`task status`는 blocker를 반환해야 한다.

### 중복 document ID

registry invalid이며 resolver를 실행하지 않는다.

### 여러 active 문서가 같은 target과 match

모두 포함한다. 같은 target이라는 이유만으로 conflict로 판단하지 않는다.

### 같은 path를 여러 document ID가 참조

registry invalid로 처리한다.

---

# 15. `READ_MAP.md` 계약

## 15.1 역할

- document registry와 bootstrap routing을 사람이 읽을 수 있게 보여주는 projection
- routing debug와 fallback 용도
- 현재 task의 동적 상태를 저장하지 않음

## 15.2 Source

```text
.hadara/project.json
.hadara/documents.json
core artifact manifest
```

## 15.3 소유권

generated projection이며 직접 편집하지 않는다.

## 15.4 기본 내용

```markdown
# HADARA Read Map

## Session Start
1. AGENTS.md
2. docs/HADARA_WORKFLOW.md
3. hadara task status --json

## Task Selection
- selected TASK.md
- requiredDocuments
- active exact-target documents
- HANDOFF.md when resuming

## Explicit Only
- draft, superseded, archived, and explicit-only documents
```

---

# 16. Session bootstrap reading contract

새 agent session은 다음을 반드시 수행한다.

```text
1. AGENTS.md 읽기
2. docs/HADARA_WORKFLOW.md 읽기
3. hadara task status --json 실행
4. task status가 선택한 Task와 문서 읽기
```

`TASK_BOARD.md`와 `READ_MAP.md`는 다음 상황에서 직접 읽는다.

- task status를 실행할 수 없음
- routing 결과를 검토해야 함
- 사람이 전체 task index를 확인함
- drift/debug가 필요함

즉 `TASK_BOARD.md`와 `READ_MAP.md`는 관찰 가능한 Markdown fallback이지만, 모든 agent가 매 session 전문을 반드시 읽어야 하는 문서는 아니다.

---

# 17. Optional preset 문서 소유권

## 17.1 Scaffold-once 원칙

다음 문서는 자동 projection이 아니다.

```text
PROJECT_OVERVIEW.md
ARCHITECTURE.md
SECURITY.md
GOVERNANCE.md
```

Init은 제목, 목적, 권장 섹션, 작성 안내만 제공한다.

생성 후:

- 사용자 또는 agent가 자율적으로 작성한다.
- HADARA upgrade는 본문을 덮어쓰지 않는다.
- HADARA는 등록 상태, 경로, target, stale candidate만 검사한다.
- 문서 내용의 정확성을 HADARA가 자동 보증하지 않는다.
- 문서를 다른 canonical source에서 자동 재생성하지 않는다.

## 17.2 문서별 기본 routing

### `PROJECT_OVERVIEW.md`

```text
readPolicy: session-start
target: project
```

단, 문서가 비어 있는 scaffold 상태라면 session-start routing에서 제외하고 warning만 제공할 수 있다.

### `ARCHITECTURE.md`

```text
readPolicy: on-task-explicit
```

Task가 관련 architecture 문서를 requiredDocuments로 지정하거나 사용자가 명시적으로 요청할 때 읽는다.

프로젝트 규모가 커져 architecture 문서를 항상 읽어야 한다면 registry policy를 명시적으로 변경한다.

### `SECURITY.md`

```text
readPolicy: on-task-explicit
```

보안 관련 task가 requiredDocuments로 지정한다.

### `GOVERNANCE.md`

```text
readPolicy: explicit-only
```

승인·책임·운영 규칙이 필요한 작업에서 명시적으로 읽는다.

## 17.3 빈 scaffold 처리

문서가 템플릿 placeholder만 포함하고 실질 내용이 없는 경우, HADARA는 다음 verdict를 낼 수 있다.

```text
uninitialized-scaffold
```

이는 stored status가 아니라 doctor verdict다.

---

# 18. Stale 문서 관리

## 18.1 Stored status

```text
draft
active
superseded
archived
```

## 18.2 Calculated verdict

```text
fresh
stale-candidate
missing
conflicting
uninitialized-scaffold
unknown
```

## 18.3 HADARA가 할 수 있는 것

- path 존재 검사
- registry 충돌 검사
- removed command/schema reference 진단
- supersedes cycle 검사
- current target과 무관한 문서 자동 제외
- archive/supersede 계획 생성
- 해당 문서를 참조하는 Task 검사
- 사용자 승인 후 status 변경

## 18.4 HADARA가 하지 않는 것

- 자동 문서 삭제
- 사용자 의도 추론 후 자동 supersede
- 등록되지 않은 문서 자동 등록
- 문서 내용을 자동으로 새 버전으로 변환
- Git history만으로 active authority 결정
- future spec을 자동 활성화

---

# 19. Greenfield init

## 19.1 Project mode 판정

다음 조건을 모두 만족하면 greenfield로 볼 수 있다.

- target root가 존재하거나 생성 가능
- HADARA artifact가 없음
- 보호해야 할 기존 project file이 거의 없음
- 충돌 경로가 없음

정확한 empty threshold는 구현이 일관되게 정의해야 한다. 소스코드 또는 기존 문서가 있으면 brownfield로 분류하는 것이 안전하다.

## 19.2 Human interactive CLI

```bash
hadara init
hadara init --preset minimal
hadara init --preset standard
hadara init --preset governed
```

greenfield interactive 환경에서는 plan을 출력하고 사용자 확인 후 같은 process에서 apply할 수 있다.

## 19.3 Agent/non-interactive CLI

다음 조건에서는 two-step apply가 필수다.

- `--json`
- non-interactive terminal
- agent execution
- CI

```bash
hadara init --preset standard --json
hadara init --execute --plan-hash sha256:... --json
```

---

# 20. Brownfield adoption

## 20.1 기본 동작

기존 프로젝트에서는 `hadara init`이 자동 write하지 않고 adoption plan을 생성해야 한다.

검사 대상:

- 기존 `AGENTS.md`
- `.gitignore`
- `docs/`
- `tasks/`
- 기존 HADARA artifact
- 동일 경로 파일
- managed marker 충돌
- Git root
- ancestor HADARA root

## 20.2 명령

```bash
hadara init --adopt --json
hadara init --adopt --execute --plan-hash sha256:... --json
```

## 20.3 원칙

- 기존 파일 전체 덮어쓰기 금지
- 기존 AGENTS.md는 managed block 삽입 계획만 제시
- 기존 사용자 문서를 자동 등록하지 않음
- 문서 등록 후보는 suggestion으로만 제공
- 구조 충돌은 fail-closed
- source file hash가 plan 이후 변하면 stale plan으로 거부

---

# 21. Re-init

이미 `.hadara/project.json`이 존재하면 프로젝트는 initialized 상태다.

## 21.1 동일 구성

```bash
hadara init
```

결과:

```text
no-op
reason=already-initialized
applied=0
```

## 21.2 기존 프로젝트에서 preset 지정

```bash
hadara init --preset governed
```

Preset은 init-time convenience이므로 기존 프로젝트 구성 변경에 사용할 수 없다.

오류:

```text
INIT_PRESET_REQUIRES_NEW_PROJECT
```

구성을 확장하려면 별도 configuration mutation을 사용해야 한다.

## 21.3 반쪽 설치

`project.json`은 있으나 core artifact 일부가 누락된 경우 `init`은 자동 복구하지 않는다.

다음을 안내한다.

```bash
hadara init upgrade
```

---

# 22. Init upgrade

## 22.1 역할

`hadara init upgrade`는 다음만 수행한다.

- `project.json` schema migration
- `documents.json` schema migration
- 누락 core artifact 보완
- HADARA managed template 갱신
- AGENTS managed block 갱신
- generated projection 재생성
- `.gitignore` 필요한 line 보완
- deprecated artifact migration plan
- artifact manifest consistency 복구

## 22.2 수행 금지

- preset 변경
- feature 자동 추가·제거
- document pack 자동 제거
- 사용자 작성 문서 전체 변경
- optional 문서 삭제
- policy 완화·강화
- future spec 활성화

## 22.3 명령

```bash
hadara init upgrade --json
hadara init upgrade --execute --plan-hash sha256:... --json
```

다음은 허용하지 않는다.

```bash
hadara init upgrade --profile basic
hadara init upgrade --preset minimal
```

오류:

```text
INIT_CONFIGURATION_CHANGE_UNSUPPORTED
```

---

# 23. Init plan

## 23.1 Plan schema

```json
{
  "schemaVersion": "hadara.init.plan.v1",
  "operation": "init",
  "projectMode": "brownfield",
  "preset": "standard",
  "actions": [
    {
      "path": "AGENTS.md",
      "kind": "insert-managed-block",
      "management": "mixed-managed-block",
      "reason": "HADARA session bootstrap contract를 추가합니다.",
      "beforeHash": "sha256:..."
    }
  ],
  "summary": {
    "create": 5,
    "updateManaged": 1,
    "append": 1,
    "register": 0,
    "migrate": 0,
    "preserve": 4,
    "skip": 0,
    "conflict": 0,
    "delete": 0
  },
  "planHash": "sha256:..."
}
```

## 23.2 Action kind

```text
create
insert-managed-block
update-managed-block
replace-hadara-managed
append-line
register
migrate
regenerate
preserve
skip
conflict
```

Init v1 plan에는 destructive `delete` action을 포함해서는 안 된다.

## 23.3 Plan hash

다음에 의존해야 한다.

- normalized action list
- source file hashes
- target paths
- package/lifecycle version
- preset expansion
- artifact manifest version

---

# 24. Apply transaction

Apply는 다음을 만족해야 한다.

1. project-level init lock 획득
2. plan hash 검증
3. source hash 재검증
4. path safety 검증
5. 임시 파일 생성
6. schema 및 content 검증
7. atomic 또는 recoverable write
8. registry와 projection consistency 검증
9. 완료 report 생성
10. lock 해제

실패 시:

- 부분 성공을 전체 성공으로 보고하지 않는다.
- 적용된 action과 실패한 action을 구분한다.
- 가능한 경우 rollback한다.
- recovery instruction을 제공한다.
- `passed`를 출력하지 않는다.

구체적인 lock 파일명과 journal format은 runtime transaction 사양이 소유한다. Init은 동시 실행 직렬화와 recoverability만 요구한다.

---

# 25. Runtime 폴더

Init은 다음 폴더를 선제 생성하지 않는다.

```text
.hadara/local/locks/
.hadara/local/journals/
.hadara/local/cache/
```

각 subsystem의 최초 writer가 필요할 때 생성한다.

원칙:

- `.hadara/local/`은 Git ignore 대상
- document registry 등록 금지
- agent reading 금지
- 사용자가 직접 관리하는 primary UX가 아님
- runtime artifact가 없어도 project가 invalid하지 않음

기존 `.hadara/lock` 등 legacy runtime path의 migration은 별도 migration 사양에서 정의한다.

---

# 26. CLI 출력

## 26.1 금지 출력

```text
passed | init.upgrade | 11 actions | 0 issues
```

실제 적용, 계획, 기존 파일을 구분할 수 없으므로 금지한다.

## 26.2 Dry-run

```text
dry-run | init | preset=standard | project=brownfield
create=5 update-managed=1 append=1 preserve=4 conflict=0 applied=0
plan-hash=sha256:...
```

## 26.3 Applied

```text
applied | init | preset=standard
created=5 updated-managed=1 appended=1 registered=0 failed=0
```

## 26.4 No-op

```text
no-op | init
created=0 updated=0 existing=8 applied=0
reason=already-initialized
```

---

# 27. JSON report

```json
{
  "schemaVersion": "hadara.init.report.v1",
  "ok": true,
  "operation": "init",
  "mode": "dry-run",
  "projectMode": "brownfield",
  "preset": "standard",
  "summary": {
    "planned": 7,
    "created": 0,
    "updated": 0,
    "appended": 0,
    "preserved": 4,
    "conflicts": 0,
    "applied": 0
  },
  "planHash": "sha256:...",
  "issues": []
}
```

Raw internal config와 transaction journal을 report에 그대로 노출하지 않는다.

---

# 28. 오류 계약

필수 오류 코드:

```text
CLI_UNKNOWN_OPTION
INIT_PRESET_UNKNOWN
INIT_PRESET_REQUIRES_NEW_PROJECT
INIT_ALREADY_INITIALIZED
INIT_NESTED_PROJECT_UNSUPPORTED
INIT_CONFLICT
INIT_PLAN_STALE
INIT_PLAN_HASH_MISMATCH
INIT_CONFIGURATION_CHANGE_UNSUPPORTED
INIT_MANAGED_BLOCK_MALFORMED
INIT_PARTIAL_APPLY
INIT_PROJECT_CONFIG_INVALID
INIT_DOCUMENT_REGISTRY_INVALID
INIT_PATH_OUTSIDE_ROOT
INIT_SYMLINK_ESCAPE
```

예:

```bash
hadara init --excute
```

```json
{
  "ok": false,
  "issue": {
    "code": "CLI_UNKNOWN_OPTION",
    "option": "--excute",
    "suggestion": "--execute"
  }
}
```

---

# 29. Project root와 monorepo

## 29.1 v1 기본 규칙

Init v1은 하나의 Git repository 안에 하나의 HADARA project root만 지원한다.

- Git root 또는 사용자가 명시한 standalone root에 init
- ancestor에 `.hadara/project.json`이 있으면 nested init 거부
- descendant HADARA project가 있으면 root init 시 conflict 보고
- monorepo는 root-level HADARA project 하나로 운영

오류:

```text
INIT_NESTED_PROJECT_UNSUPPORTED
```

## 29.2 `[OPEN-MONOREPO-01]` 향후 확장

논의가 필요한 항목:

- workspace root/member 모델
- package별 Task Board
- root document routing과 member routing
- cross-package task
- nested locks와 Task ID namespace

권장 기본안:

```text
v1에서는 지원하지 않고 별도 workspace 사양으로 연기한다.
```

이 OPEN 항목은 Init v1 freeze를 차단하지 않는다.

---

# 30. 외부 문서

## 30.1 v1

자동 routing은 project root 내부 local file만 지원한다.

URL, Google Docs, GitHub issue, external wiki는 자동 fetch하지 않는다.

`external-reference` metadata는 저장할 수 있으나 기본 reading resolver에 포함하지 않는다.

## 30.2 `[OPEN-EXTERNAL-DOC-01]` 향후 확장

논의가 필요한 항목:

- connector identity
- immutable revision pinning
- offline fallback
- external content hash
- access failure
- privacy와 permission
- stale detection

권장 기본안:

```text
v1에서는 explicit human/agent action으로만 사용한다.
```

이 OPEN 항목은 Init v1 freeze를 차단하지 않는다.

---

# 31. Governed policy

## 31.1 v1

`governed` preset은 governance 관련 문서 scaffold만 제공한다.

approval, role, release gate, policy enforcement는 구현하지 않는다.

## 31.2 `[OPEN-POLICY-01]` 후속 설계

논의가 필요한 항목:

- approval actor
- required approval 조건
- policy evidence
- organization role
- override와 waiver
- audit retention
- CI enforcement

권장 기본안:

```text
정책 엔진이 설계되기 전까지 project.json에 의미 없는 policy enum을 추가하지 않는다.
```

이 OPEN 항목은 Init v1 freeze를 차단하지 않는다.

---

# 32. Legacy migration 경계

이 문서의 신규 scaffold는 과거 artifact를 생성하지 않는다.

Legacy migration 대상 예:

```text
.hadara/scaffold.json
.hadara/docs-registry.json
.hadara/state/current.json
docs/PROJECT_STATE.md
docs/AGENT_HANDOFF.md
profile: basic|standard|governed
```

원칙:

- 즉시 삭제하지 않음
- 새 config와 registry로 변환 가능한 값만 migration
- old profile은 `presetOrigin` 또는 migration note로만 보존
- compatibility artifact는 primary reading graph에서 제외
- 사용자가 승인하기 전 사용자 문서를 삭제하지 않음
- exact mapping은 별도 `HADARA_INIT_LEGACY_MIGRATION_SPEC`에서 정의

이 문서는 legacy artifact의 구체적인 field-by-field mapping을 freeze하지 않는다.

---

# 33. 스키마 최소화

Init v1 persistence schema:

```text
hadara.project.v1
hadara.documents.v1
```

CLI 계약:

```text
hadara.init.plan.v1
hadara.init.report.v1
```

다음 persistence schema는 만들지 않는다.

- preset execution history
- init action history snapshot
- current task state
- current release state
- duplicated scaffold file list
- READ_MAP JSON
- stale verdict store
- active reading session state

새 field 추가 조건:

1. producer가 명확함
2. consumer가 명확함
3. 다른 field에서 계산 불가능
4. 장기 저장 이유가 있음
5. migration 책임이 정의됨

---

# 34. Acceptance Criteria

## Init core

- `INIT-AC-001`: 모든 preset이 동일한 lifecycle을 설치한다.
- `INIT-AC-002`: preset은 runtime profile authority가 아니다.
- `INIT-AC-003`: core artifact마다 owner, writer, reader, upgrade policy가 정의된다.
- `INIT-AC-004`: 기존 사용자 파일을 전체 덮어쓰거나 삭제하지 않는다.
- `INIT-AC-005`: greenfield와 brownfield를 구분한다.
- `INIT-AC-006`: agent/non-interactive apply는 plan hash를 요구한다.
- `INIT-AC-007`: unknown option을 fail-closed한다.
- `INIT-AC-008`: 실제 적용이 없으면 `applied=0`이다.
- `INIT-AC-009`: `init upgrade`가 preset 또는 feature를 변경하지 않는다.
- `INIT-AC-010`: runtime 디렉터리를 lazy creation한다.

## Artifact ownership

- `INIT-AC-011`: AGENTS user area를 upgrade가 보존한다.
- `INIT-AC-012`: HADARA_WORKFLOW은 project state를 저장하지 않는다.
- `INIT-AC-013`: optional preset 문서는 scaffold-once다.
- `INIT-AC-014`: READ_MAP은 registry에서 재생성 가능하다.
- `INIT-AC-015`: TASK_BOARD row는 command가 관리한다.

## Task Board adjacency

- `INIT-AC-016`: Task Board에 generic Note가 없다.
- `INIT-AC-017`: Result는 명시적 Close Summary에서만 생성한다.
- `INIT-AC-018`: Close Summary가 없어도 Init v1 기본 close 정책은 이를 blocker로 삼지 않는다.
- `INIT-AC-019`: Done은 valid close 없이 기록할 수 없다.
- `INIT-AC-020`: Target은 canonical compact form으로 projection된다.

## Document routing

- `INIT-AC-021`: release `0.1.0` task는 명시적 요구 없이 `0.3.0` 문서를 읽지 않는다.
- `INIT-AC-022`: project-target 문서는 모든 task의 implicit project target과 match할 수 있다.
- `INIT-AC-023`: draft/superseded/archived 문서는 자동 on-target routing에서 제외한다.
- `INIT-AC-024`: required document 누락은 blocker다.
- `INIT-AC-025`: 등록되지 않은 문서는 자동으로 읽거나 수정하지 않는다.
- `INIT-AC-026`: stale-candidate는 자동 archive를 의미하지 않는다.

## Safety

- `INIT-AC-027`: root 외부 path에 쓰지 않는다.
- `INIT-AC-028`: symlink escape를 거부한다.
- `INIT-AC-029`: stale plan을 실행하지 않는다.
- `INIT-AC-030`: partial apply를 성공으로 보고하지 않는다.

---

# 35. 필수 테스트 시나리오

## Preset

1. minimal fresh init
2. standard fresh init
3. governed fresh init
4. 세 preset의 lifecycle artifact 동일성
5. document pack 차이
6. `basic` compatibility alias
7. unknown preset

## Greenfield/Brownfield

1. 빈 Git repository
2. 소스 파일이 있는 기존 프로젝트
3. 기존 AGENTS.md
4. 기존 `.gitignore`
5. 동일 경로 user document
6. managed marker 손상
7. plan 이후 파일 변경
8. re-init no-op
9. 반쪽 설치 후 upgrade 안내

## Task Board

1. 빈 board 생성
2. task create row
3. 여러 target rendering
4. close summary 없는 close
5. close summary 있는 close
6. invalid close에서 Done 미기록
7. direct row drift 탐지

## Document routing

1. project-target 문서
2. release `0.1.0` 문서
3. release `0.3.0` 문서
4. component 문서
5. target 없는 task
6. 다중 target task
7. explicit required draft
8. explicit required superseded
9. explicit required archived
10. required missing ID
11. missing path
12. duplicate ID
13. duplicate path
14. supersedes cycle
15. unregistered document

## Transaction

1. 두 init process 동시 실행
2. permission failure
3. temp write failure
4. plan hash mismatch
5. source hash mismatch
6. partial apply recovery report

## Path

1. `..` traversal
2. absolute path
3. symlink escape
4. ancestor HADARA root
5. descendant HADARA root
6. case-insensitive path collision

---

# 36. 구현 마일스톤

## INIT-M0 — Specification Freeze

산출물:

- 이 문서 승인
- artifact manifest 승인
- Task Board 인접 계약 승인
- target/document routing 최소 계약 승인

코드 변경 없음.

## INIT-M1 — Characterization

- 기존 profile no-op/misleading output 재현
- unknown option 무시 재현
- 기존 non-overwrite 보장 수집
- legacy artifact inventory

## INIT-M2 — Schema and planner

- `hadara.project.v1`
- `hadara.documents.v1`
- artifact manifest
- preset expansion 단일 source
- init plan/report schema
- path safety

## INIT-M3 — Greenfield/Brownfield apply

- mixed block writer
- scaffold writer
- managed template writer
- projection generator
- transaction/recovery

## INIT-M4 — Task Board bootstrap

- Board schema
- row writer interface
- Close Summary → Result projection interface
- consistency check

Task lifecycle 전체 재설계는 이 milestone 범위 밖이다.

## INIT-M5 — Document routing bootstrap

- TargetRef
- exact matching
- requiredDocuments
- status별 routing
- READ_MAP projection
- stale candidate 기본 진단

## INIT-M6 — Legacy migration

별도 migration spec에 따라 수행한다.

## INIT-M7 — Installed product dogfood

배포 방식에 맞는 isolated install 환경에서 다음을 검증한다.

- 세 preset
- brownfield adoption
- no-op
- upgrade
- task create/status/close 연계
- document routing
- concurrency
- package file list

구체적인 npm command는 HADARA 구현 저장소의 release tooling이 소유하며 제품 사양에는 포함하지 않는다.

---

# 37. OPEN 항목 요약

다음 항목은 더 넓은 subsystem과 얽혀 있어 Init v1에서 의도적으로 제한하거나 연기한다.

| ID | 항목 | v1 기본안 | Freeze 차단 |
|---|---|---|---:|
| `OPEN-MONOREPO-01` | nested/workspace HADARA root | Git repo당 하나 | 아니오 |
| `OPEN-EXTERNAL-DOC-01` | URL/connector 문서 | 자동 routing 미지원 | 아니오 |
| `OPEN-POLICY-01` | governed approval engine | 문서 scaffold만 제공 | 아니오 |
| `OPEN-LEGACY-01` | old artifact field mapping | 별도 migration spec | 신규 init은 아니오 |
| `OPEN-CONFIG-CLI-01` | feature/document pack mutation command 이름 | 별도 config spec | 아니오 |

이 OPEN 항목은 신규 Init v1의 구현 freeze를 막지 않는다. 해당 기능을 구현하려면 별도 사양을 먼저 freeze해야 한다.

---

# 38. Freeze 승인 체크리스트

다음 결정을 승인하면 문서 상태를 `Frozen`으로 전환할 수 있다.

## 제품 모델

- [x] lifecycle은 하나로 통일한다.
- [x] profile은 영구 상태로 사용하지 않는다.
- [x] `minimal`, `standard`, `governed`를 init preset으로 사용한다.
- [x] 기본 preset은 `standard`다.
- [x] governed v1은 governance 문서 scaffold만 제공한다.

## Core scaffold

- [x] `.hadara/project.json`을 정적 구성 canon으로 사용한다.
- [x] `.hadara/documents.json`을 document routing registry로 사용한다.
- [x] `current.json`은 신규 core init에서 생성하지 않는다.
- [x] runtime 폴더는 lazy creation한다.
- [x] `READ_MAP.md`는 generated projection이다.

## 문서 ownership

- [x] AGENTS.md는 mixed managed block이다.
- [x] HADARA_WORKFLOW.md는 HADARA-managed template이다.
- [x] preset optional 문서는 scaffold-once이며 이후 사용자 소유다.
- [x] TASK_BOARD.md는 command-managed다.
- [x] unregistered 문서는 기본 routing 대상이 아니다.

## Task Board

- [x] 컬럼은 `ID | Title | Status | Targets | Capsule | Result`다.
- [x] generic Note 컬럼을 사용하지 않는다.
- [x] `Result`는 명시적 `Close Summary`에서만 projection한다.
- [x] Close Summary는 v1에서 optional이다.
- [x] Done은 valid close 이후에만 기록한다.

## Target/routing

- [x] `kind/value` 대신 `namespace/id` TargetRef를 사용한다.
- [x] project target은 id를 가지지 않는다.
- [x] release ID는 opaque exact identifier다.
- [x] v1은 exact target match만 지원한다.
- [x] 복잡한 선택은 requiredDocuments로 명시한다.
- [x] stale은 stored status가 아닌 calculated verdict다.

## Init/upgrade

- [x] brownfield는 plan/apply 방식이다.
- [x] agent/non-interactive apply는 plan hash를 요구한다.
- [x] re-init에 preset을 사용하지 않는다.
- [x] init upgrade는 preset/feature 전환을 수행하지 않는다.
- [x] unknown option은 fail-closed한다.
- [x] apply, existing, planned, no-op을 출력에서 구분한다.

---


# 39. 최종 규범 요약

```text
HADARA Init v1은 하나의 Task Capsule lifecycle을 설치한다.

Preset은 신규 프로젝트의 초기 document pack을 선택하는 편의 기능이며
프로젝트의 영구 profile이나 등급이 아니다.

Init은 core config, document registry, bootstrap 문서, Task Board와 tasks root를
비파괴적으로 생성한다.

AGENTS.md는 mixed ownership,
HADARA_WORKFLOW.md는 HADARA managed,
TASK_BOARD.md는 command managed,
preset optional 문서는 scaffold-once,
READ_MAP.md는 generated projection이다.

Task Board에는 generic Note를 저장하지 않는다.
Task close 결과는 명시적인 Close Summary만 Result로 projection한다.

문서는 TargetRef와 requiredDocuments를 통해 필요한 시점에만 읽는다.
release ID는 semver로 추론하지 않는 exact opaque identifier다.
버전 없는 문서는 project/component target 또는 explicit-only로 표현한다.

Stale 문서는 HADARA가 진단하지만 자동 삭제하지 않는다.

Init upgrade는 schema와 managed artifact를 갱신할 뿐
preset, feature, 문서 pack 또는 정책을 임의로 바꾸지 않는다.

모든 write는 비파괴적 plan, source hash, plan hash, 직렬화와
정확한 applied report를 사용한다.
```
