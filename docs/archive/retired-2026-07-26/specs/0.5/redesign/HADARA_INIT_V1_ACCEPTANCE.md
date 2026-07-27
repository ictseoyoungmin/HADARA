# HADARA Init v1 Acceptance

- 문서 ID: `HADARA-INIT-V1-ACCEPTANCE`
- 문서 상태: **Frozen Acceptance Contract**
- 기준 사양: `HADARA-INIT-SPEC-V1`
- 기준 파일: `HADARA_INIT_V1_FINAL_FREEZE_SPEC_KO.md`
- 적용 대상: HADARA Init v1 구현, migration adapter, installed package
- 설명 언어: 한국어
- 목적: Init v1 구현이 승인된 사양을 실제로 만족하는지 반복 가능하고 증거 기반으로 검증한다.

---

## 0. 문서 목적

이 문서는 `HADARA-INIT-SPEC-V1`의 구현 완료 여부를 판정하는 acceptance contract다.

다음을 제공한다.

- 요구사항 영역별 acceptance 항목
- 각 항목의 검증 방법
- 기대 결과와 실패 조건
- 필수 evidence
- greenfield, brownfield, re-init, upgrade 시나리오
- preset과 artifact ownership 검증
- Task Board와 close projection 검증
- TargetRef와 document routing 검증
- transaction, concurrency, path safety 검증
- CLI plain/JSON contract 검증
- installed package 수준의 end-to-end 검증
- 사양 요구사항과 테스트 간 traceability

이 문서는 구현 방법을 강제하지 않는다. 단, 외부 관찰 결과와 저장 artifact는 이 문서의 판정 기준을 만족해야 한다.

---

# 1. 판정 언어

## 1.1 결과 상태

각 acceptance 항목은 다음 중 하나로 판정한다.

```text
passed
failed
blocked
not-applicable
```

### `passed`

모든 검증 단계가 기대 결과와 일치하고 필수 증거가 존재한다.

### `failed`

하나 이상의 필수 기대 결과가 충족되지 않는다.

### `blocked`

환경 또는 선행 구현 부재로 검증할 수 없다.

`blocked`는 성공으로 간주하지 않는다.

### `not-applicable`

사양에서 명시적으로 v1 범위 밖이거나 현재 배포 형태에 적용되지 않는다.

`not-applicable`에는 사유가 필요하다.

## 1.2 중요도

```text
P0 = 제품 계약 또는 데이터 안전성 위반
P1 = 핵심 기능 또는 routing/ownership 위반
P2 = 출력, 관찰성, 진단 품질 위반
P3 = 비차단 개선 사항
```

## 1.3 최종 승인 조건

Init v1은 다음 조건을 모두 만족해야 acceptance를 통과한다.

- 모든 P0 항목이 `passed`
- 모든 P1 항목이 `passed`
- P2 실패가 0개이거나 승인된 waiver가 존재
- `blocked` 항목이 0개
- required scenario가 모두 실행됨
- installed package end-to-end가 통과함
- acceptance evidence가 task close 이후에도 재검증 가능함
- source tree test와 installed artifact test가 모두 통과함
- 승인되지 않은 schema, command, artifact가 추가되지 않음

---

# 2. Evidence 요구사항

## 2.1 각 테스트 결과에 필요한 정보

각 테스트는 최소한 다음 정보를 남겨야 한다.

```text
testId
requirementIds
environment
command 또는 실행 방법
fixture
exitCode
stdout
stderr
artifactDiff
result
failureReason
timestamp
implementationRevision
packageVersion
```

## 2.2 Artifact evidence

파일 생성·수정 검증에는 다음 중 필요한 항목을 보존한다.

- init 전후 파일 tree
- 파일 checksum
- managed block diff
- 사용자 영역 checksum
- JSON schema validation 결과
- Task Board row diff
- document registry diff
- runtime directory 존재 여부
- `.gitignore` diff
- plan hash와 apply report

## 2.3 동시성 evidence

동시성 검증에는 다음을 보존한다.

- 두 process의 시작 시각
- 종료 시각
- exit code
- lock 획득 또는 대기 결과
- 최종 artifact checksum
- duplicate write 여부
- partial apply 여부
- recovery report

## 2.4 Evidence 신뢰성

다음은 단독 acceptance evidence로 충분하지 않다.

- agent의 자연어 주장
- test command 없이 작성된 `passed`
- 최종 파일만 있고 이전 상태가 없는 경우
- stdout 일부만 잘라낸 결과
- source tree에서만 통과하고 installed package에서는 실행하지 않은 결과

---

# 3. 검증 환경 매트릭스

## 3.1 필수 환경

최소 다음 환경을 포함한다.

| 환경 ID | 요구 사항 |
|---|---|
| `ENV-CS` | case-sensitive filesystem |
| `ENV-CI` | case-insensitive filesystem |
| `ENV-INT` | interactive terminal |
| `ENV-NONINT` | non-interactive 또는 `--json` 실행 |
| `ENV-GIT` | 기존 Git repository |
| `ENV-NOGIT` | Git이 없는 standalone directory |
| `ENV-SYMLINK` | symlink 검증이 가능한 환경 |
| `ENV-INSTALLED` | package를 isolated install한 환경 |

하나의 실제 환경이 여러 환경 ID를 동시에 충족할 수 있다.

## 3.2 권장 운영체제

다음 조합을 권장한다.

```text
Linux
Windows
macOS 또는 다른 case-insensitive POSIX 환경
```

운영체제 자체가 acceptance 조건은 아니지만, case sensitivity와 path semantics의 차이는 반드시 검증한다.

## 3.3 Test fixture 원칙

각 시나리오는 독립된 새 임시 디렉터리에서 실행해야 한다.

- 이전 테스트의 artifact 재사용 금지
- 임시 경로는 테스트 종료 후 보존 또는 archive 가능
- random path만 사용하지 말고 재현 가능한 fixture 이름도 기록
- test fixture 자체의 초기 checksum을 기록

---

# 4. Acceptance 영역 A — 제품 모델과 Preset

## A-001 단일 lifecycle

- 중요도: P0
- 사양 추적: `INIT-AC-001`

### 검증

각 preset으로 fresh init한다.

```bash
hadara init --preset minimal
hadara init --preset standard
hadara init --preset governed
```

생성된 core lifecycle artifact와 lifecycle version을 비교한다.

### 기대 결과

세 preset은 다음 항목에서 동일하다.

- `AGENTS.md` HADARA managed block의 lifecycle 의미
- `docs/HADARA_WORKFLOW.md`
- `docs/TASK_BOARD.md` 구조
- `.hadara/project.json`의 `lifecycleVersion`
- `.hadara/documents.json` core document entries
- `tasks/` root
- task create/status/close semantics

Preset별 차이는 optional scaffold와 expanded feature/document pack에만 존재한다.

### 필수 증거

- 세 파일 tree
- core artifact checksum 또는 semantic diff
- project config 비교
- lifecycle command smoke 결과

### 실패 조건

- preset별 Task Board schema가 다름
- preset별 close semantics가 다름
- governed에서만 evidence가 생성됨
- minimal에서 task lifecycle 일부가 누락됨

---

## A-002 Preset 비영구성

- 중요도: P0
- 사양 추적: `INIT-AC-002`

### 검증

init 후 `project.json`을 읽고 runtime command 동작을 비교한다.

### 기대 결과

- `presetOrigin`은 저장될 수 있다.
- command routing과 lifecycle 판단은 `presetOrigin`에 의존하지 않는다.
- 실제 구성은 `features`와 `documentPacks`로 표현된다.
- `presetOrigin`을 변경해도 runtime behavior가 자동 변경되어서는 안 된다.

### 실패 조건

- `presetOrigin=governed`라는 이유만으로 승인 기능이 자동 강제됨
- presetOrigin만 바꿨는데 optional 문서가 자동 생성/삭제됨
- task status가 presetOrigin에 따라 다른 schema를 출력함

---

## A-003 Preset expansion 단일 source

- 중요도: P1

### 검증

다음 source가 동일한 preset expansion을 사용하는지 검사한다.

- init planner
- CLI help
- generated documentation
- test fixture
- project config result

### 기대 결과

`minimal`, `standard`, `governed` mapping이 하나의 canonical definition에서 파생된다.

### 실패 조건

- help에는 문서가 있다고 쓰였지만 실제 init에서 생성되지 않음
- planner와 apply의 feature 목록이 다름
- test fixture에만 별도 hardcoded mapping이 있음

---

## A-004 기본 preset

- 중요도: P1

### 검증

```bash
hadara init
```

을 preset 없이 실행한다.

### 기대 결과

`standard` preset과 동일한 plan 또는 apply 결과를 낸다.

### 필수 증거

- report의 `preset=standard`
- explicit standard 실행과 artifact semantic comparison

---

## A-005 `basic` compatibility alias

- 중요도: P2

### 검증

```bash
hadara init --profile basic
```

또는 지원하기로 한 compatibility syntax를 실행한다.

### 기대 결과

- `minimal`로 canonicalize된다.
- deprecation warning이 명확하다.
- 생성 결과는 `--preset minimal`과 같다.

### 실패 조건

- 별도 basic lifecycle이 생성됨
- warning 없이 영구 profile로 저장됨

---

## A-006 Governed 의미 제한

- 중요도: P1

### 검증

governed init 후 command와 config를 검사한다.

### 기대 결과

- governance 관련 scaffold가 생성된다.
- 승인 engine, organization role, release gate가 자동으로 활성화되지 않는다.
- 정의되지 않은 policy enum을 project config에 저장하지 않는다.

### 실패 조건

- governed라는 이유만으로 task close가 미설계 승인 workflow를 요구함
- 존재하지 않는 organization actor가 schema에 필수로 들어감

---

# 5. Acceptance 영역 B — Core scaffold와 Artifact manifest

## B-001 Core artifact 완전성

- 중요도: P0
- 사양 추적: `INIT-AC-003`

### 검증

모든 preset의 fresh init tree를 artifact manifest와 비교한다.

### 기대 core tree

```text
AGENTS.md
.gitignore
.hadara/project.json
.hadara/documents.json
.hadara/context/READ_MAP.md
docs/HADARA_WORKFLOW.md
docs/TASK_BOARD.md
tasks/
```

### 실패 조건

- 필수 파일 누락
- manifest에 없는 canonical state file 생성
- preset에 따라 core path가 달라짐

---

## B-002 불필요 artifact 미생성

- 중요도: P1

### 검증

fresh init 직후 tree를 검사한다.

### 생성되면 안 되는 항목

```text
.hadara/state/current.json
.hadara/scaffold.json
.hadara/docs-registry.json
.hadara/local/
docs/PROJECT_STATE.md
docs/AGENT_HANDOFF.md
docs/RELEASE_READINESS.md
docs/VALIDATION.md
docs/EVIDENCE.md
tasks/T-*/
```

### 실패 조건

하나라도 신규 core init에서 자동 생성됨.

---

## B-003 Runtime directory lazy creation

- 중요도: P1
- 사양 추적: `INIT-AC-010`

### 검증

1. fresh init 직후 `.hadara/local/` 부재 확인
2. lock을 요구하는 첫 write 실행
3. 필요한 runtime path 생성 확인

### 기대 결과

- init만으로 runtime 폴더가 생기지 않는다.
- 최초 writer가 필요한 최소 폴더만 만든다.
- runtime path는 Git ignore 대상이다.
- runtime path는 documents registry에 없다.

---

## B-004 `.gitignore` 비파괴 patch

- 중요도: P0

### 검증

기존 `.gitignore`에 사용자 내용과 다양한 줄바꿈 형식을 넣고 adoption을 실행한다.

### 기대 결과

- 기존 줄 보존
- `.hadara/local/` line만 필요한 경우 추가
- 중복 line 생성 금지
- 전체 파일 재정렬 금지
- 실행 전 plan에 action 표시

---

## B-005 `tasks/` root

- 중요도: P1

### 검증

fresh init 후 `tasks/`를 검사한다.

### 기대 결과

- root만 존재
- 예제 task 미생성
- `.gitkeep` 사용은 구현 선택이지만 task로 오인될 파일은 없어야 함
- task create가 최초 Capsule을 생성할 수 있음

---

# 6. Acceptance 영역 C — Artifact 소유권과 Upgrade

## C-001 `AGENTS.md` mixed ownership

- 중요도: P0
- 사양 추적: `INIT-AC-011`

### 검증 시나리오

1. 기존 AGENTS.md 없이 init
2. 사용자 내용이 있는 기존 AGENTS.md adoption
3. 정상 managed block upgrade
4. malformed marker upgrade
5. 사용자 영역 checksum 비교

### 기대 결과

- HADARA block과 사용자 영역이 구분됨
- 기존 사용자 영역 보존
- upgrade는 managed block만 수정
- malformed block은 conflict
- 전체 파일 교체 금지

### 실패 조건

- 사용자 지침 유실
- managed block 밖의 내용 변경
- marker 손상을 자동으로 추측 복구

---

## C-002 `HADARA_WORKFLOW.md` HADARA-managed

- 중요도: P1
- 사양 추적: `INIT-AC-012`

### 검증

- fresh init template 확인
- upgrade 시 template 갱신
- project state/active task 포함 여부 검사

### 기대 결과

- lifecycle 설명만 포함
- active task, current release, next work 없음
- user project truth를 canonical하게 저장하지 않음

---

## C-003 Optional 문서 scaffold-once

- 중요도: P0
- 사양 추적: `INIT-AC-013`

### 대상

```text
PROJECT_OVERVIEW.md
ARCHITECTURE.md
SECURITY.md
GOVERNANCE.md
```

### 검증

1. preset에서 scaffold 생성
2. 사용자 본문 작성
3. init upgrade 실행
4. checksum과 diff 검사

### 기대 결과

- 사용자 본문 완전 보존
- upgrade가 template placeholder를 재삽입하지 않음
- 자동 projection으로 덮어쓰지 않음
- registry metadata만 검증 가능

---

## C-004 `READ_MAP.md` projection

- 중요도: P1
- 사양 추적: `INIT-AC-014`

### 검증

1. registry 변경 전 READ_MAP 생성
2. document entry 추가
3. docs sync 또는 upgrade 실행
4. deterministic regeneration 확인

### 기대 결과

- source는 project/documents config
- 직접 편집한 drift를 검출하거나 재생성
- 같은 source에서 byte 또는 semantic deterministic 결과
- 현재 task dynamic state 저장 금지

---

## C-005 `TASK_BOARD.md` command ownership

- 중요도: P0
- 사양 추적: `INIT-AC-015`

### 검증

- task create
- task close
- task cancel
- direct row edit 후 consistency 검사

### 기대 결과

- lifecycle command만 row 상태를 변경
- 직접 수정 drift를 검출
- schema migration이 row data를 보존
- user prose를 task row에 임의 삽입하지 않음

---

## C-006 Project config ownership

- 중요도: P0

### 검증

project.json의 writer와 field를 검사한다.

### 기대 결과

- config command/init/upgrade만 write
- active task, validation, evidence, release status 없음
- schema validation 통과
- unknown field 정책이 일관적

---

## C-007 Documents registry ownership

- 중요도: P0

### 검증

- init
- document register
- status update
- path move operation
- malformed manual edit

### 기대 결과

- docs subsystem만 canonical write
- malformed registry는 fail-closed
- resolver가 invalid registry를 무시하고 계속 진행하지 않음

---

# 7. Acceptance 영역 D — Task Board와 Close projection

## D-001 Board schema

- 중요도: P0
- 사양 추적: `INIT-AC-015`, `INIT-AC-016`

### 기대 header

```markdown
| ID | Title | Status | Targets | Capsule | Result |
```

### 검증

fresh init의 Board header와 parser schema를 비교한다.

### 실패 조건

- generic Note 컬럼 존재
- profile별 컬럼 차이
- parser와 template 불일치

---

## D-002 Task create projection

- 중요도: P0

### Given

Task contract:

```yaml
id: T-0001
title: Init contract
targets:
  - namespace: release
    id: 0.1.0
  - namespace: component
    id: init
```

### When

task create 완료

### Then

Board row:

```text
ID=T-0001
Title=Init contract
Status=Draft 또는 lifecycle이 정한 초기 상태
Targets=release:0.1.0; component:init
Capsule=실제 상대 경로
Result=-
```

### 실패 조건

- Title/Target을 자유 prose로 재해석
- absolute Capsule path 기록
- Result에 task note 복사

---

## D-003 Valid close만 Done 기록

- 중요도: P0
- 사양 추적: `INIT-AC-019`

### 검증

1. acceptance/evidence 부족 상태에서 close
2. valid close
3. Board 상태 비교

### 기대 결과

- invalid close는 Done 미기록
- valid close만 Done
- close failure 후 partial Board update 없음

---

## D-004 Close Summary → Result

- 중요도: P0
- 사양 추적: `INIT-AC-017`

### Given

```markdown
## Close Summary

Init upgrade와 preset 전환을 분리했다.
```

### When

valid task close

### Then

Board Result는 normalization된 한 줄이어야 한다.

```text
Init upgrade와 preset 전환을 분리했다.
```

### 검증 세부

- 줄바꿈 normalization
- Markdown formatting 제거 정책
- 160 Unicode code points 제한
- source task 추적 가능
- close record에 source hash 존재

### 실패 조건

- 일반 Notes에서 추출
- agent가 요약을 새로 생성
- evidence body를 Result에 복사
- 160자 초과를 무제한 저장
- close 전에 Result 기록

---

## D-005 Close Summary 없음

- 중요도: P1
- 사양 추적: `INIT-AC-018`

### 기대 결과

- close의 다른 조건이 충족되면 close 가능
- Board Result는 `-`
- warning은 허용하지만 blocker가 아님

---

## D-006 Generic Note 비존재

- 중요도: P1
- 사양 추적: `INIT-AC-016`

### 검증

다음을 검색한다.

- Task Board schema
- Board writer
- init template
- close projection
- JSON report

### 기대 결과

Task Board를 위한 범용 `note` source가 없다.

Task contract 내부에 자유 메모 영역이 존재하는 것은 허용하지만 Board에 자동 projection되지 않는다.

---

## D-007 Target compact rendering

- 중요도: P1
- 사양 추적: `INIT-AC-020`

### 입력과 기대값

| 입력 | Board Targets |
|---|---|
| targets 없음 | `project` |
| project | `project` |
| release 0.1.0 | `release:0.1.0` |
| component api | `component:api` |
| release + component | `release:0.3.0; component:authentication` |

### 요구사항

- deterministic order
- newline 없음
- opaque ID 보존
- `v0.1.0`을 `0.1.0`으로 자동 변환하지 않음

---

# 8. Acceptance 영역 E — Project configuration

## E-001 Project schema

- 중요도: P0

### 필수 최소 필드

```text
schemaVersion
projectId
lifecycleVersion
presetOrigin
features
documentPacks
```

### 검증

JSON Schema validator와 runtime parser 모두 통과해야 한다.

### 실패 조건

- 서로 다른 validator 결과
- 저장 후 재읽기에서 필드 유실
- preset별 다른 schema version

---

## E-002 금지 필드

- 중요도: P0
- 사양 추적: `INIT-AC-014`

### project.json에 없어야 하는 정보

```text
activeTask
latestCompletedTask
nextWork
validationResult
evidenceOutcome
releaseReadiness
runtimeLock
currentProcess
displayText
staleVerdict
```

동의어 형태로 우회 저장하는 것도 실패다.

---

## E-003 Stable project ID

- 중요도: P1

### 검증

- init 후 directory rename
- package name 변경
- upgrade

### 기대 결과

`projectId` 자동 변경 없음.

---

## E-004 Feature/document pack consistency

- 중요도: P1

### 검증

- preset별 config
- actual file tree
- document registry

### 기대 결과

- installed document pack과 files 일치
- 없는 pack을 config에 기록하지 않음
- file만 있고 pack이 누락되는 drift 검출

---

# 9. Acceptance 영역 F — Document registry와 TargetRef

## F-001 Registry schema

- 중요도: P0

### 필수 지원 필드

```text
schemaVersion
documents[].id
documents[].path
documents[].management
documents[].status
documents[].readPolicy
documents[].appliesTo
documents[].supersedes
```

조건부 필드는 schema에서 명확히 표현되어야 한다.

---

## F-002 Document ID 안정성

- 중요도: P1

### 검증

문서 path rename operation 후 registry 확인.

### 기대 결과

- ID 유지
- path만 변경
- duplicate ID 거부
- 빈 ID 거부
- trim/case 규칙 일관적

---

## F-003 Path 안전성

- 중요도: P0
- 사양 추적: `INIT-AC-027`, `INIT-AC-028`

### 거부 대상

```text
../outside.md
/absolute/path.md
C:\absolute\path.md
symlink를 통한 root 외부 path
```

### 기대 결과

명시적 오류와 non-zero exit.

---

## F-004 Management enum

- 중요도: P1

### 허용값

```text
hadara-managed
user-authored
mixed-managed-block
generated-projection
external-reference
```

### 검증

각 preset artifact가 올바른 management로 등록되었는지 검사한다.

---

## F-005 Status enum

- 중요도: P1

### 허용값

```text
draft
active
superseded
archived
```

`stale`을 저장 status로 허용하면 실패다.

---

## F-006 Read policy enum

- 중요도: P1

### 허용값

```text
session-start
on-target
on-task-explicit
explicit-only
```

### 조건 검증

- `on-target`은 appliesTo가 필요
- `explicit-only`는 appliesTo 없이 허용
- invalid 조합 거부

---

## F-007 TargetRef discriminated union

- 중요도: P0

### 허용 구조

```json
{"namespace":"project"}
{"namespace":"release","id":"0.1.0"}
{"namespace":"milestone","id":"M1"}
{"namespace":"component","id":"api"}
{"namespace":"task","id":"T-0012"}
```

### 거부 구조

```json
{"namespace":"project","id":"x"}
{"namespace":"release"}
{"kind":"release","value":"0.1.0"}
{"namespace":"unknown","id":"x"}
```

---

## F-008 Opaque exact ID

- 중요도: P1

### 검증

다음 문서를 각각 등록한다.

```text
release:0.1.0
release:v0.1.0
release:release-0.1.0
```

### 기대 결과

세 ID는 서로 다른 값이다.

semver normalization, range comparison, prefix 제거가 없어야 한다.

---

## F-009 Versionless 문서

- 중요도: P0
- 사양 추적: `INIT-AC-022`

### 시나리오

#### 프로젝트 전체

```json
{"namespace":"project"}
```

모든 task의 implicit project target과 match.

#### Component 문서

```json
{"namespace":"component","id":"api"}
```

api target task에서만 match.

#### Explicit-only 문서

appliesTo 없이 explicit request 때만 사용.

### 실패 조건

- version이 없다는 이유로 등록 불가
- project document를 특정 release에만 잘못 연결
- explicit-only가 자동으로 읽힘

---

## F-010 Supersedes integrity

- 중요도: P1

### 검증

- self reference
- missing ID
- A→B→A cycle
- normal A supersedes B

### 기대 결과

앞의 세 오류는 registry invalid. 정상 관계만 허용.

---

## F-011 Duplicate path

- 중요도: P0

같은 local path를 여러 ID가 참조하면 registry invalid여야 한다.

---

# 10. Acceptance 영역 G — Document routing

## G-001 Session-start routing

- 중요도: P0

### 기대 문서

- `AGENTS.md`
- `docs/HADARA_WORKFLOW.md`
- registry의 `session-start` active 문서
- 이후 `hadara task status --json`

### 실패 조건

- 모든 등록 문서를 session-start에 포함
- archived 문서 자동 포함
- user-unregistered 문서 자동 포함

---

## G-002 Release isolation

- 중요도: P0
- 사양 추적: `INIT-AC-021`

### Given

등록 문서:

```text
spec-0.1.0 → release:0.1.0
spec-0.3.0 → release:0.3.0
```

Task target:

```text
release:0.1.0
```

### Then

자동 routing 결과에 `spec-0.1.0`만 포함.

`spec-0.3.0`은 requiredDocuments 또는 explicit request가 없으면 제외.

---

## G-003 Reverse release isolation

- 중요도: P0

0.3.0 task에서 0.1.0 spec 자동 제외.

---

## G-004 Target 없는 Task

- 중요도: P1

### 기대 결과

- implicit `project` target 적용
- project-target active 문서만 자동 match
- release/component 문서 자동 제외
- requiredDocuments는 별도 포함

---

## G-005 다중 target Task

- 중요도: P1

Task:

```yaml
targets:
  - namespace: release
    id: 0.3.0
  - namespace: component
    id: authentication
```

### 기대 결과

두 exact target에 match하는 active 문서가 모두 후보가 된다.

AND 조건으로 오해하면 실패다.

---

## G-006 Required documents 우선

- 중요도: P0

### 검증

requiredDocuments에 on-target mismatch 문서를 명시한다.

### 기대 결과

- 명시적 required document는 포함
- target mismatch warning은 허용
- 누락 ID/path는 blocker

---

## G-007 Draft required document

- 중요도: P1

### 기대 결과

- 자동 on-target에는 제외
- requiredDocuments에 명시되면 포함
- warning 반환

---

## G-008 Superseded required document

- 중요도: P1

명시적 required이면 historical warning과 함께 포함.

자동 routing에서는 제외.

---

## G-009 Archived required document

- 중요도: P1

명시적 required이면 strong warning과 함께 포함 가능.

자동 routing에서는 제외.

---

## G-010 Missing required ID

- 중요도: P0
- 사양 추적: `INIT-AC-024`

### 기대 결과

`task status` blocker, non-success status, 문제 document ID 표시.

---

## G-011 Missing document path

- 중요도: P0

registry entry는 있으나 path가 없으면 blocker.

---

## G-012 Deterministic order

- 중요도: P1

동일 input으로 여러 번 resolver를 실행한다.

### 기대 순서

```text
session-start registry order
→ requiredDocuments 선언 순서
→ on-target ID 오름차순
→ Task Capsule local docs
```

동일 input에서 order가 달라지면 실패.

---

## G-013 Unregistered document isolation

- 중요도: P0
- 사양 추적: `INIT-AC-025`

프로젝트에 새 Markdown 파일을 추가한다.

### 기대 결과

- 자동 routing에 포함되지 않음
- HADARA가 수정하지 않음
- register suggestion은 허용

---

## G-014 Stale candidate 비파괴성

- 중요도: P0
- 사양 추적: `INIT-AC-026`

stale candidate 진단을 발생시킨다.

### 기대 결과

- stored status 자동 변경 없음
- 파일 삭제 없음
- archive/supersede 계획만 제안 가능

---

# 11. Acceptance 영역 H — Preset optional documents

## H-001 Standard scaffold

- 중요도: P1

Standard에서 `PROJECT_OVERVIEW.md` 생성.

Architecture/Security/Governance는 미생성.

---

## H-002 Governed scaffold

- 중요도: P1

Governed에서 다음 생성.

```text
PROJECT_OVERVIEW.md
ARCHITECTURE.md
SECURITY.md
GOVERNANCE.md
```

---

## H-003 Minimal scaffold

- 중요도: P1

Minimal에서 optional preset 문서 미생성.

---

## H-004 문서 기본 routing

- 중요도: P1

### 기본값

| 문서 | Read policy |
|---|---|
| PROJECT_OVERVIEW | session-start |
| ARCHITECTURE | on-task-explicit |
| SECURITY | on-task-explicit |
| GOVERNANCE | explicit-only |

### 검증

registry와 resolver 결과 비교.

---

## H-005 빈 scaffold 판정

- 중요도: P2

Placeholder만 있는 문서는 `uninitialized-scaffold` verdict 가능.

Stored status를 자동 archived/draft로 바꾸면 실패.

---

# 12. Acceptance 영역 I — Greenfield Init

## I-001 Greenfield dry-run

- 중요도: P0

### When

non-interactive 또는 `--json`:

```bash
hadara init --preset standard --json
```

### Then

- 파일 write 없음
- plan 반환
- `applied=0`
- plan hash 존재
- action별 path/kind/reason 존재

---

## I-002 Greenfield apply

- 중요도: P0

```bash
hadara init --execute --plan-hash <hash> --json
```

### 기대 결과

- plan과 동일한 artifact 생성
- report의 created/updated 수 정확
- schema validation 통과
- runtime folder 미생성

---

## I-003 Interactive confirmation

- 중요도: P2

interactive terminal에서는 plan 확인 후 같은 process에서 apply할 수 있다.

사용자 거부 시 applied=0.

---

## I-004 Plan/apply 일치

- 중요도: P0

planned create path와 실제 create path가 정확히 일치해야 한다.

숨겨진 추가 write가 있으면 실패.

---

# 13. Acceptance 영역 J — Brownfield Adoption

## J-001 Brownfield 자동 write 금지

- 중요도: P0
- 사양 추적: `INIT-AC-005`

기존 source/docs가 있는 프로젝트에서:

```bash
hadara init --adopt --json
```

### 기대 결과

- dry-run plan
- source files 변경 없음
- conflict/preserve/action 표시

---

## J-002 Existing AGENTS adoption

- 중요도: P0

기존 사용자 AGENTS.md가 있을 때 managed block 삽입 plan만 생성.

전체 교체 금지.

---

## J-003 Existing `.gitignore`

- 중요도: P0

필요 line append만 계획.

---

## J-004 Existing conflicting path

- 중요도: P0

예: 사용자가 이미 `docs/TASK_BOARD.md`를 다른 구조로 사용.

### 기대 결과

- conflict
- 자동 overwrite 금지
- explicit migration/adoption decision 필요

---

## J-005 Unregistered document suggestions

- 중요도: P1

기존 docs를 자동 등록하지 않음.

suggestion 목록은 허용.

---

## J-006 Source change after plan

- 중요도: P0
- 사양 추적: `INIT-AC-029`

plan 후 AGENTS.md 수정, 이후 apply.

### 기대 결과

`INIT_PLAN_STALE`, write 없음.

---

# 14. Acceptance 영역 K — Re-init

## K-001 Already initialized no-op

- 중요도: P0

```bash
hadara init --json
```

### 기대 결과

```text
reason=already-initialized
applied=0
```

기존 artifact checksum 불변.

---

## K-002 Re-init preset 거부

- 중요도: P0

```bash
hadara init --preset governed
```

이미 initialized 상태에서 실행.

### 기대 결과

`INIT_PRESET_REQUIRES_NEW_PROJECT`.

feature/document pack 자동 확장 금지.

---

## K-003 Partial installation

- 중요도: P1

project.json은 있지만 core file 하나가 누락됨.

### 기대 결과

- plain init은 자동 복구하지 않음
- upgrade 안내
- 명확한 diagnostic

---

# 15. Acceptance 영역 L — Init Upgrade

## L-001 Upgrade dry-run

- 중요도: P0

### 기대 결과

- plan 생성
- apply 없음
- preset 인자 없음
- user-authored files preserve

---

## L-002 Missing core artifact 복구

- 중요도: P0

core artifact 하나를 제거한 후 upgrade.

### 기대 결과

- missing core artifact create plan
- 다른 파일 불필요 변경 없음

---

## L-003 Managed template update

- 중요도: P1

old HADARA_WORKFLOW template을 upgrade.

### 기대 결과

HADARA-managed file만 갱신.

---

## L-004 Managed block update

- 중요도: P0

old AGENTS block + user section fixture.

### 기대 결과

block만 갱신, user section checksum 불변.

---

## L-005 Projection regeneration

- 중요도: P1

READ_MAP drift 후 upgrade.

### 기대 결과

registry 기준 재생성.

---

## L-006 Upgrade configuration 변경 금지

- 중요도: P0
- 사양 추적: `INIT-AC-009`

### 명령

```bash
hadara init upgrade --preset minimal
hadara init upgrade --profile basic
```

### 기대 결과

`INIT_CONFIGURATION_CHANGE_UNSUPPORTED`.

---

## L-007 Optional 문서 보존

- 중요도: P0

사용자 작성 Architecture/Security/Governance를 upgrade.

### 기대 결과

byte 또는 semantic content 보존.

---

# 16. Acceptance 영역 M — Planner와 Report

## M-001 Action kind 제한

- 중요도: P1

허용값:

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

Init v1에서 destructive delete action이 나오면 실패.

---

## M-002 Plan summary 정확성

- 중요도: P0

summary count와 actions를 계산해 비교한다.

불일치하면 실패.

---

## M-003 Plan hash 안정성

- 중요도: P0

동일 filesystem/input으로 plan 두 번 생성.

### 기대 결과

동일 hash.

Source file 또는 action이 바뀌면 hash 변경.

---

## M-004 Plain dry-run 출력

- 중요도: P2

필수 표현:

```text
dry-run
preset
project mode
create/update/preserve/conflict
applied=0
plan hash
```

---

## M-005 Plain applied 출력

- 중요도: P2

created/updated/appended/failed가 실제 결과와 일치.

---

## M-006 No-op 출력

- 중요도: P2

`N actions` 같은 모호한 표현 대신 applied=0과 이유 명시.

---

## M-007 JSON report 안정성

- 중요도: P1

- schemaVersion 존재
- mode 구분
- projectMode 구분
- summary 정확
- issues 구조화
- internal journal/raw config 미노출

---

# 17. Acceptance 영역 N — Transaction과 동시성

## N-001 Project-level 직렬화

- 중요도: P0

동일 root에 두 init apply를 동시에 실행한다.

### 기대 결과

- 하나가 lock을 획득
- 다른 하나는 대기, no-op 또는 stale plan 실패
- corrupted partial artifact 없음
- duplicate managed block 없음

---

## N-002 Plan hash mismatch

- 중요도: P0

잘못된 hash로 apply.

### 기대 결과

`INIT_PLAN_HASH_MISMATCH`, write 없음.

---

## N-003 Permission failure

- 중요도: P0
- 사양 추적: `INIT-AC-030`

중간 path를 read-only로 설정.

### 기대 결과

- 전체 성공 보고 금지
- partial apply report
- 가능하면 rollback
- recovery instruction
- success exit code 금지

---

## N-004 Process crash recovery

- 중요도: P0

write 중 강제 종료 fixture.

### 기대 결과

- 다음 실행에서 incomplete transaction 감지
- corrupted canonical file을 정상으로 취급하지 않음
- recovery 또는 safe retry 가능

구체적인 journal format은 구현 선택이다.

---

## N-005 Duplicate runtime artifact 방지

- 중요도: P1

동시 write 후 lock/journal/cache garbage 상태 검사.

정상 cleanup 또는 명확한 stale artifact diagnostic 필요.

---

# 18. Acceptance 영역 O — CLI 오류

## O-001 Unknown option fail-closed

- 중요도: P0
- 사양 추적: `INIT-AC-007`

```bash
hadara init --excute
```

### 기대 결과

- non-zero
- `CLI_UNKNOWN_OPTION`
- `--execute` suggestion
- write 없음

---

## O-002 Unknown preset

- 중요도: P1

```bash
hadara init --preset enterprise
```

### 기대 결과

`INIT_PRESET_UNKNOWN`, 허용 preset 목록.

---

## O-003 Invalid project config

- 중요도: P0

malformed project.json.

### 기대 결과

`INIT_PROJECT_CONFIG_INVALID`, 자동 무시/덮어쓰기 금지.

---

## O-004 Invalid documents registry

- 중요도: P0

duplicate ID 또는 invalid TargetRef.

### 기대 결과

`INIT_DOCUMENT_REGISTRY_INVALID`, resolver/apply 중단.

---

## O-005 Malformed managed block

- 중요도: P0

AGENTS marker 손상.

### 기대 결과

`INIT_MANAGED_BLOCK_MALFORMED`, user file 자동 수정 금지.

---

# 19. Acceptance 영역 P — Path와 Project root

## P-001 Root 외부 write 금지

- 중요도: P0

`../` path fixture.

### 기대 결과

`INIT_PATH_OUTSIDE_ROOT`.

---

## P-002 Symlink escape

- 중요도: P0

root 내부 symlink가 외부 path를 가리킴.

### 기대 결과

`INIT_SYMLINK_ESCAPE`.

---

## P-003 Ancestor HADARA root

- 중요도: P0

부모 directory에 `.hadara/project.json` 존재.

### 기대 결과

`INIT_NESTED_PROJECT_UNSUPPORTED`.

---

## P-004 Descendant HADARA root

- 중요도: P1

하위 directory에 HADARA project 존재한 상태에서 root init.

### 기대 결과

conflict 또는 nested unsupported. 자동 병합 금지.

---

## P-005 Case-insensitive collision

- 중요도: P0

예:

```text
docs/task_board.md
docs/TASK_BOARD.md
```

case-insensitive filesystem에서 collision 감지.

---

## P-006 Standalone non-Git root

- 중요도: P1

Git이 없는 디렉터리에서 init.

### 기대 결과

v1이 허용하는 standalone root라면 정상 동작.

Git 전용 기능을 암묵적으로 요구하면 실패.

---

# 20. Acceptance 영역 Q — Session bootstrap

## Q-001 AGENTS bootstrap content

- 중요도: P1

다음을 포함해야 한다.

- HADARA project 선언
- HADARA_WORKFLOW 읽기
- task status 실행
- selected task 범위
- registered docs 원칙
- command-managed 직접 수정 금지

---

## Q-002 Workflow 필수 읽기

- 중요도: P1

새 agent session contract에서 `HADARA_WORKFLOW.md`를 필수 reading으로 안내.

---

## Q-003 Task status 중심 진입

- 중요도: P0

bootstrap이 project-global 자동 router 대신 `hadara task status --json`을 primary ingress로 안내.

---

## Q-004 Fallback Markdown

- 중요도: P1

task status를 실행할 수 없는 경우 TASK_BOARD와 READ_MAP을 통해 사람이 현재 구조를 이해할 수 있어야 한다.

---

# 21. Acceptance 영역 R — Stale와 문서 lifecycle

## R-001 Stored status와 verdict 분리

- 중요도: P0

`stale-candidate`가 documents.json status enum에 저장되지 않아야 한다.

---

## R-002 Missing document

- 중요도: P1

active entry path 제거.

### 기대 결과

`missing` verdict.

자동 registry entry 삭제 금지.

---

## R-003 Uninitialized scaffold

- 중요도: P2

placeholder-only optional document.

### 기대 결과

`uninitialized-scaffold` verdict 가능.

stored status 자동 변경 없음.

---

## R-004 Archive/supersede 사용자 승인

- 중요도: P0

doctor 실행만으로 status가 바뀌지 않는다.

별도 explicit mutation 없이 archive/supersede 금지.

---

# 22. Acceptance 영역 S — Schema 최소화

## S-001 Persistence schema 수

- 중요도: P1

Init v1 신규 canonical persistence schema:

```text
hadara.project.v1
hadara.documents.v1
```

불필요한 init action history, read session state, current state schema 추가 여부 검사.

---

## S-002 Report/plan schema 분리

- 중요도: P1

```text
hadara.init.plan.v1
hadara.init.report.v1
```

Persistence와 report가 같은 schema를 공유하지 않아야 한다.

---

## S-003 중복 field 검사

- 중요도: P1

다음 정보가 여러 canonical 파일에 중복 저장되지 않는지 검사한다.

- preset authority
- active task
- document status
- target
- lifecycle version
- current release

---

## S-004 Field producer/consumer

- 중요도: P1

모든 project/documents schema field에 producer와 consumer가 문서화되어야 한다.

consumer가 없는 field는 acceptance 실패 또는 제거 대상이다.

---

# 23. End-to-End 시나리오

## E2E-001 Minimal 개인 프로젝트

### Given

빈 standalone project.

### When

1. minimal init plan
2. apply
3. task create
4. task status
5. validation/evidence
6. valid close
7. 새 session task status

### Then

- core lifecycle 완전 동작
- optional project/governance 문서 없음
- Result projection 동작
- 재개 가능
- current.json 없이 동작

---

## E2E-002 Standard 장기 프로젝트

### Given

빈 Git repository.

### When

standard init 후 PROJECT_OVERVIEW 작성, release 0.1.0 spec 등록, task 생성.

### Then

- project overview session-start
- spec 0.1.0 on-target
- unrelated future spec 제외
- user-authored overview는 upgrade 후 보존

---

## E2E-003 Governed 기업형 시작

### Given

빈 Git repository.

### When

governed init.

### Then

- architecture/security/governance scaffold 생성
- lifecycle은 minimal/standard와 동일
- 미설계 approval engine 없음
- 문서는 사용자 소유
- 기본 routing policy 일치

---

## E2E-004 개인 프로젝트 성장

### Given

minimal로 시작한 initialized project.

### When

`hadara init --preset governed` 실행.

### Then

- preset 전환으로 처리하지 않음
- `INIT_PRESET_REQUIRES_NEW_PROJECT`
- 기존 lifecycle/artifact 변경 없음
- 별도 config/document pack mutation 필요하다는 안내

---

## E2E-005 Brownfield adoption

### Given

기존 AGENTS.md, `.gitignore`, docs, source code가 있는 프로젝트.

### When

adoption plan과 apply.

### Then

- 사용자 파일 보존
- managed block만 삽입
- existing docs 자동 등록 없음
- conflicts 명시
- core scaffold 안전 생성

---

## E2E-006 Release 문서 격리

### Given

0.1.0, 0.3.0 spec 동시 등록.

### When

0.1.0 task status 후 0.3.0 task status.

### Then

각 task는 자신의 exact release 문서만 자동 선택.

---

## E2E-007 Migration task

### Given

Task targets:

```yaml
targets:
  - namespace: release
    id: 0.3.0
requiredDocuments:
  - spec-0.3.0
  - migration-0.1-to-0.3
  - spec-0.1.0
```

### Then

과거 spec은 required로 명시되었기 때문에 포함.

자동으로 모든 과거 release 문서를 읽지는 않음.

---

## E2E-008 Target 없는 유지보수 Task

### Given

CI cleanup task, targets 없음.

### Then

- implicit project target
- release docs 제외
- project docs 포함 가능
- requiredDocuments만 추가 포함

---

## E2E-009 Superseded 문서 참조

### Given

old spec이 superseded이며 Task가 명시적으로 required.

### Then

- 문서 포함
- historical warning
- 자동으로 new spec을 대체 삽입하지 않음
- close 시 warning trace 가능

---

## E2E-010 Init upgrade

### Given

사용자가 수정한 PROJECT_OVERVIEW/ARCHITECTURE와 old managed template.

### When

upgrade plan/apply.

### Then

- user-authored 문서 보존
- workflow와 AGENTS block만 갱신
- READ_MAP 재생성
- preset/feature 변화 없음

---

## E2E-011 Concurrent init

### Given

동일 brownfield root와 동일 plan.

### When

두 agent가 동시에 apply.

### Then

- canonical artifact corruption 없음
- duplicate block 없음
- 한 process만 apply하거나 다른 process가 stale/no-op
- 결과 evidence가 명확

---

## E2E-012 Partial failure

### Given

특정 artifact write permission 실패.

### When

init apply.

### Then

- 전체 성공 보고 금지
- partial action report
- rollback 또는 recovery 안내
- 다음 실행에서 안전하게 복구 가능

---

## E2E-013 Installed package

### Given

source repository 외부의 isolated directory.

### When

배포 artifact를 설치하고 E2E-001, E2E-002, E2E-005 일부를 실행.

### Then

source-only dependency 없이 동작.

package에 필요한 templates/schema가 포함됨.

---

# 24. Regression 시나리오

## REG-001 Profile downgrade 오표시

### Given

standard project.

### When

legacy 형태:

```bash
hadara init upgrade --profile basic
```

### Then

- 변경된 것처럼 보고하지 않음
- 명시적 unsupported 오류
- applied=0

---

## REG-002 `--excute` 오타

조용히 dry-run 또는 success 처리하면 실패.

---

## REG-003 N actions 오표시

기존 파일만 있는 no-op에서 action 수로 변경을 암시하면 실패.

---

## REG-004 current.json dependency

current.json 없이 init 후 task lifecycle이 동작해야 한다.

---

## REG-005 Optional 문서 덮어쓰기

upgrade가 사용자 Architecture를 덮어쓰면 실패.

---

## REG-006 모든 spec 자동 읽기

0.1.0 task에서 0.3.0 spec이 자동 선택되면 실패.

---

## REG-007 Board Note 추론

TASK.md 자유 Notes를 Board Result로 자동 복사하면 실패.

---

# 25. 비기능 Acceptance

## NF-001 Determinism

동일 input과 filesystem에서 plan, routing 결과, projection order가 동일해야 한다.

## NF-002 Idempotency

동일 apply 이후 재실행은 no-op이거나 안전한 deterministic 결과여야 한다.

## NF-003 Observability

사람은 다음만으로 init 상태를 이해할 수 있어야 한다.

- CLI report
- file tree
- AGENTS/HADARA_WORKFLOW
- TASK_BOARD
- READ_MAP

## NF-004 Local-first

Init과 local document routing은 네트워크 없이 동작해야 한다.

## NF-005 Performance

구체적인 시간 SLA는 이 사양에서 고정하지 않는다.

다만 작은 일반 프로젝트의 init plan이 project 전체 binary/content를 무차별적으로 읽어서는 안 된다.

## NF-006 Privacy

Unregistered document 본문을 자동 수집하거나 report에 노출하지 않는다.

## NF-007 Compatibility isolation

Legacy adapter가 신규 core schema에 불필요한 compatibility field를 추가해서는 안 된다.

---

# 26. Requirement Traceability Matrix

| Spec Acceptance | Primary tests |
|---|---|
| `INIT-AC-001` | A-001, E2E-001~003 |
| `INIT-AC-002` | A-002, E2E-004 |
| `INIT-AC-003` | B-001, C-001~007 |
| `INIT-AC-004` | B-004, C-001, J-001~004 |
| `INIT-AC-005` | I-001~004, J-001~006 |
| `INIT-AC-006` | I-001~002, M-003 |
| `INIT-AC-007` | O-001, REG-002 |
| `INIT-AC-008` | I-001, K-001, M-004~006 |
| `INIT-AC-009` | L-006, REG-001 |
| `INIT-AC-010` | B-003 |
| `INIT-AC-011` | C-001, J-002, L-004 |
| `INIT-AC-012` | C-002 |
| `INIT-AC-013` | C-003, H-001~003, L-007 |
| `INIT-AC-014` | C-004, L-005 |
| `INIT-AC-015` | C-005, D-001~007 |
| `INIT-AC-016` | D-001, D-006, REG-007 |
| `INIT-AC-017` | D-004 |
| `INIT-AC-018` | D-005 |
| `INIT-AC-019` | D-003 |
| `INIT-AC-020` | D-007 |
| `INIT-AC-021` | G-002, G-003, E2E-006 |
| `INIT-AC-022` | F-009, G-004 |
| `INIT-AC-023` | G-007~009 |
| `INIT-AC-024` | G-010, G-011 |
| `INIT-AC-025` | G-013, J-005 |
| `INIT-AC-026` | G-014, R-001~004 |
| `INIT-AC-027` | F-003, P-001 |
| `INIT-AC-028` | F-003, P-002 |
| `INIT-AC-029` | J-006, N-002 |
| `INIT-AC-030` | N-003, N-004, E2E-012 |

---

# 27. Test 실행 순서

권장 순서:

```text
Phase 1: Schema/static contract
→ A, B, C, E, F, S

Phase 2: Planner/report
→ I, M, O

Phase 3: Filesystem mutation
→ J, K, L, P

Phase 4: Adjacent lifecycle
→ D, G, H, Q, R

Phase 5: Safety
→ N

Phase 6: End-to-end
→ E2E

Phase 7: Regression
→ REG

Phase 8: Installed artifact
→ E2E-013
```

P0 실패가 발생하면 후속 destructive scenario를 중단하고 원인을 수정한다.

---

# 28. Acceptance 결과 보고 형식

권장 Markdown summary:

```markdown
# HADARA Init v1 Acceptance Result

- Revision:
- Package:
- Date:
- Environments:

## Summary

| Priority | Passed | Failed | Blocked | N/A |
|---|---:|---:|---:|---:|
| P0 |  |  |  |  |
| P1 |  |  |  |  |
| P2 |  |  |  |  |

## Failed / Blocked

| Test ID | Result | Reason | Evidence |
|---|---|---|---|

## Scenario Results

| Scenario | Result | Evidence |
|---|---|---|

## Final Decision

`accepted | rejected`
```

권장 machine-readable summary:

```json
{
  "schemaVersion": "hadara.acceptance.result.v1",
  "spec": "HADARA-INIT-SPEC-V1",
  "revision": "<commit>",
  "result": "accepted",
  "counts": {
    "passed": 0,
    "failed": 0,
    "blocked": 0,
    "notApplicable": 0
  },
  "tests": []
}
```

Machine-readable result schema는 acceptance tooling을 구현할 때 별도 승인할 수 있다. 이 파일 자체가 새로운 Init persistence schema가 되어서는 안 된다.

---

# 29. Waiver 정책

P0와 P1에는 waiver를 허용하지 않는 것을 기본으로 한다.

P2 waiver는 다음을 모두 포함해야 한다.

- test ID
- 미충족 요구사항
- 사용자 영향
- 임시 완화
- 제거 목표 milestone
- 승인자
- 만료 조건

만료 없는 waiver는 허용하지 않는다.

---

# 30. Release gate

Init v1 구현은 다음을 만족하기 전 release candidate로 승격할 수 없다.

- P0/P1 전부 passed
- source test passed
- installed package E2E passed
- 세 preset fresh init passed
- brownfield adoption passed
- upgrade preservation passed
- document routing release isolation passed
- concurrent init passed
- partial failure recovery passed
- regression scenarios passed
- package file list에서 legacy/developer-only artifact 누출 없음

---

# 31. 최종 Acceptance 체크리스트

## 제품 계약

- [ ] 단일 lifecycle
- [ ] preset 비영구성
- [ ] 기본 standard preset
- [ ] governed 의미 제한
- [ ] preset expansion 단일 source

## Artifact

- [ ] core scaffold 정확
- [ ] 금지 artifact 미생성
- [ ] runtime lazy creation
- [ ] `.gitignore` 비파괴
- [ ] optional scaffold 정확

## Ownership

- [ ] AGENTS mixed block
- [ ] workflow HADARA-managed
- [ ] optional docs user-authored
- [ ] READ_MAP projection
- [ ] TASK_BOARD command-managed
- [ ] project/documents JSON command-managed

## Task Board

- [ ] 정확한 header
- [ ] generic Note 없음
- [ ] valid close만 Done
- [ ] Close Summary만 Result source
- [ ] Close Summary 없음 허용
- [ ] target compact rendering

## Routing

- [ ] TargetRef union
- [ ] versionless document 지원
- [ ] exact ID match
- [ ] 0.1.0/0.3.0 격리
- [ ] target 없는 task
- [ ] 다중 target task
- [ ] required document blocker
- [ ] draft/superseded/archived 정책
- [ ] unregistered document 격리

## Init operation

- [ ] greenfield plan/apply
- [ ] brownfield adoption
- [ ] re-init no-op
- [ ] preset re-init 거부
- [ ] upgrade 범위 제한
- [ ] accurate plain/JSON report

## Safety

- [ ] unknown option fail-closed
- [ ] path traversal 거부
- [ ] symlink escape 거부
- [ ] nested root 거부
- [ ] case collision
- [ ] concurrent apply
- [ ] stale plan
- [ ] partial apply recovery

## End-to-end

- [ ] minimal
- [ ] standard
- [ ] governed
- [ ] brownfield
- [ ] release isolation
- [ ] migration task
- [ ] target 없는 task
- [ ] installed package

---

# 32. 최종 판정 규칙

다음 조건을 모두 만족하면 `HADARA Init v1 Accepted`로 판정한다.

```text
P0 failed = 0
P1 failed = 0
blocked = 0
required E2E passed
installed package passed
unapproved artifact/schema/command additions = 0
```

판정 문구:

```text
HADARA Init v1 구현은 HADARA-INIT-SPEC-V1과
HADARA-INIT-V1-ACCEPTANCE의 모든 필수 계약을 만족한다.
```

하나라도 만족하지 못하면 release 또는 다음 lifecycle milestone로 진행하지 않는다.
