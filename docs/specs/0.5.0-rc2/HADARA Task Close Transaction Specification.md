# HADARA Task Close Transaction Specification

> **Status:** Normative design baseline
> **Updated:** 2026-07-28
> **Release alignment:** HADARA 0.5.0 stable task-close transaction
> **Scope:** `task close` transaction only
> **Supersedes:** 별도 0.5.1 release boundary로 작성된 Task Close Transaction Development Plan과 bookkeeping 중심 내부 설계

---

## 1. 목적

HADARA는 Task Capsule을 한 번의 명령으로 안전하게 닫을 수 있어야 한다.

```bash
hadara task close --task T-XXXX --json
```

`task close`는 단순히 상태 필드를 `Done`으로 변경하는 command가 아니다. 다음 작업을 하나의 복구 가능한 transaction으로 수행한다.

```text
close eligibility 평가
→ close source snapshot 고정
→ 전체 guarded write set 계산
→ stale snapshot 재검증
→ lifecycle-owned writes 적용
→ 실제 최종 상태 재검증
→ close proof를 물리적으로 마지막에 append
→ closed-valid 확정
```

이 transaction은 다음 속성을 만족해야 한다.

* 단일 command happy path
* fixed lock ordering
* explicit close-source integrity
* deterministic guarded writes
* physical proof-last
* idempotent retry
* partial-execution recovery
* duplicate proof 방지
* blocked close의 zero lifecycle mutation
* progress reporting과 durable journal 분리
* installed-package fault dogfood 가능

---

## 2. 핵심 결정

### 2.1 `task close`가 유일한 primary close command다

다음 command를 public close workflow로 제공하거나 복원하지 않는다.

```text
task ready
task finish
task finalize
task close-write-sync
task audit-close
task complete
task lifecycle
```

Close audit 기능이 내부 또는 read-only compatibility API로 존재할 수는 있지만, 사용자가 여러 lifecycle command를 조합하도록 안내하지 않는다.

### 2.2 `bookkeeping`은 transaction phase가 아니다

`task close`에는 별도의 bookkeeping domain, schema, report 또는 command가 필요하지 않다.

기존 bookkeeping이 수행하던 필수 기능은 다음 두 개의 transaction primitive로 축소한다.

```text
guarded write planner
guarded write executor
```

따라서 다음과 같은 별도 개념을 사용하지 않는다.

```text
sync required
sync satisfied
sync blocked
hadara.task.close_plan.v1#guarded-write-set
task.close-plan.guard-writes
```

대신 close plan이 적용할 명시적인 write set을 가진다.

```ts
interface TaskCloseWritePlan {
  writes: GuardedCloseWrite[];
  writeSetHash: string;
}
```

### 2.3 Close proof는 물리적으로 마지막 mutation이다

Close proof는 virtual 또는 예정된 최종 상태를 승인하는 intent가 아니다.

Close proof의 의미는 다음과 같다.

> 이 proof가 append된 시점에 모든 close-owned write가 실제 filesystem에 적용됐고, 실제 최종 close source가 재검증됐으며, 해당 task는 closed-valid 조건을 충족했다.

따라서 다음 순서는 허용하지 않는다.

```text
close proof append
→ lifecycle writes
→ proof audit
```

필수 순서는 다음이다.

```text
lifecycle writes
→ actual final-state verification
→ close proof append
```

앞선 write 또는 final verification이 실패하면 valid close proof가 존재해서는 안 된다.

---

## 3. 범위

### 3.1 포함

* `task close` direct happy path
* `task close --dry-run`
* reviewed plan hash execution
* lock coordination
* source snapshot과 revalidation
* guarded write planning
* guarded write execution
* close operation journal
* partial execution reconciliation
* physical proof-last append
* identical retry no-op
* close transaction report/schema
* concurrency 및 fault-injection tests

### 3.2 제외

* 일반적인 project completion
* release promotion 자동화
* continuation backlog 정책 자체
* 문서 registry 정리
* advisory 문서의 포괄적 갱신
* remote distributed transaction
* background recovery daemon
* 사용자가 수동으로 여러 close 단계를 조합하는 workflow
* task close와 무관한 lifecycle command refactor

Project current-state, continuation 또는 handoff projection은 **명시적으로 close-owned required projection으로 지정된 경우에만** guarded write set에 포함한다.

---

## 4. Public command contract

### 4.1 Primary happy path

```bash
hadara task close --task T-XXXX --json
```

Command 내부에서 다음 절차를 자동 수행한다.

```text
review
→ plan hash 생성
→ snapshot 재검증
→ execute
→ proof append
```

사용자는 정상 close에서 plan hash를 직접 복사하거나 다시 전달하지 않는다.

### 4.2 Dry-run

```bash
hadara task close \
  --task T-XXXX \
  --dry-run \
  --json
```

Dry-run은 다음을 수행한다.

* close eligibility 평가
* close basis snapshot 생성
* guarded write set 계산
* plan hash 계산
* 예상 final state 계산
* blockers와 recovery action 반환

Dry-run은 다음을 수행하지 않는다.

* lifecycle write
* evidence append
* operation marker persistence
* close proof append

### 4.3 Reviewed execution

```bash
hadara task close \
  --task T-XXXX \
  --execute \
  --plan-hash <hash> \
  --json
```

이 mode는 CI preview, debugging 또는 명시적 reviewed execution을 위한 secondary route다.

전달된 plan hash가 현재 source snapshot 및 write set에서 다시 계산한 hash와 다르면 첫 lifecycle mutation 전에 중단한다.

### 4.4 Public result contract

`ok`만으로 close 성공 여부를 판단해서는 안 된다.

최종 verdict는 최소 다음 필드를 사용한다.

```ts
interface TaskCloseCompactReport {
  schemaVersion: string;
  command: 'task.close';
  ok: boolean;
  taskId: string;
  closeState:
    | 'not-closed'
    | 'closed-valid'
    | 'close-evidence-found-invalid'
    | 'close-evidence-malformed';
  health:
    | 'ok'
    | 'blocked'
    | 'recovery-required';
  terminal: boolean;
  summary: string;
  primaryNextAction?: TaskLifecycleNextAction;
}
```

---

## 5. Transaction invariants

모든 `task close` 구현은 다음 invariant를 지켜야 한다.

### I-1. One-command close

정상적인 사용자는 하나의 `task close` invocation만으로 closed-valid에 도달한다.

### I-2. Fixed lock order

Close route에서 동일 lock을 다른 순서로 획득해서는 안 된다.

```text
project lifecycle
→ Task Board
→ task-scoped
→ evidence append
```

Release는 역순으로 한다.

### I-3. Complete plan before mutation

첫 lifecycle mutation 전에 전체 guarded write set이 계산돼 있어야 한다.

### I-4. Source integrity

State file의 `rev`는 generic state concurrency에 사용할 수 있으나 close-source integrity를 대체하지 않는다.

Close integrity는 explicit content snapshot과 content hash로 보장한다.

### I-5. Intent before partial execution

첫 lifecycle write 전에 복구 가능한 operation intent가 durable하게 기록돼 있어야 한다.

### I-6. Guard every write

각 write는 expected existence와 before hash를 검증한 뒤에만 실행한다.

### I-7. Physical proof-last

Close proof는 모든 write와 final verification이 성공한 뒤에만 append한다.

### I-8. No duplicate proof

동일한 close operation retry는 기존 valid close proof를 반환하고 새 proof를 append하지 않는다.

### I-9. Deterministic recovery

중단된 operation은 실제 파일 hash와 evidence idempotency key를 통해 재구성할 수 있어야 한다.

### I-10. Progress is not persistence

CLI progress 또는 UI event는 operation marker write나 `fsync`를 발생시키지 않는다.

### I-11. Canonical locality

Canonical close proof는 Task Capsule에 남는다.

Central operation state는 복구를 위한 machine-owned state이며 canonical task evidence를 대체하지 않는다.

---

## 6. 용어

### Close basis

Task를 닫아도 된다는 판단을 정당화하는 입력 source 집합이다.

Close transaction이 직접 변경하는 status field나 generated projection은 close basis에서 분리한다.

### Close basis snapshot

Close basis의 path, existence, role, content hash를 고정한 snapshot이다.

### Write target snapshot

Close transaction이 변경할 파일의 mutation 이전 상태다.

### Guarded close write

Expected before state와 intended after state가 명시된 하나의 write다.

### Write set

한 close transaction이 수행할 모든 guarded close write의 ordered collection이다.

### Final source snapshot

Write 적용 후 실제 filesystem을 다시 읽어 생성한 최종 snapshot이다.

### Close proof

Final source snapshot 검증 이후 append되는 canonical closure evidence다.

### Operation journal

Partial execution을 탐지하고 재개하기 위한 machine-owned durable state다.

---

## 7. Safety domains

| Domain                 | Mechanism                              | 보호 대상                              | 대체할 수 없는 것                     |
| ---------------------- | -------------------------------------- | ---------------------------------- | ------------------------------ |
| State concurrency      | State `rev` + compare-and-swap         | `.hadara/state/*.json` lost update | Close source content integrity |
| Close integrity        | Explicit content-hash snapshot         | Task closure를 정당화한 source          | Generic state CAS              |
| Write integrity        | Expected existence + before/after hash | Lifecycle file mutation            | Evidence serialization         |
| Evidence serialization | Task evidence append lock              | Append race와 duplicate record      | Project/Task Board ordering    |
| Recovery               | Durable operation journal              | Partial execution과 retry           | Canonical close proof          |

---

## 8. Close source model

### 8.1 Close basis snapshot

다음 source가 기본 close basis가 된다.

* Task Capsule contract
* required validation/evidence records
* acceptance criteria 상태
* Task Board의 task identity와 capsule path
* task contract가 명시한 required projection
* capsule이 explicit close source로 지정한 파일

다음은 기본적으로 advisory다.

* project handoff
* general roadmap
* development slices
* release state
* broader known problems
* task가 명시적으로 요구하지 않은 문서

Advisory source는 close contract가 required로 승격한 경우에만 close basis에 포함한다.

### 8.2 Snapshot unit

```ts
interface CloseSourceUnit {
  role: string;
  path: string;
  exists: boolean;
  contentHash: string;
}
```

Hash input에는 다음이 포함돼야 한다.

```text
source role
normalized project-relative path
existence bit
exact content hash
```

Absolute machine-local path, timestamp, process ID, temporary directory는 hash에 포함하지 않는다.

### 8.3 Aggregate close source hash

```text
closeBasisHash =
  hash(sorted normalized CloseSourceUnit entries)
```

`closeBasisHash`는 close-owned status mutation 전후에도 operation identity가 불필요하게 바뀌지 않도록 close basis만을 대상으로 한다. `finalSourceHash`는 lifecycle-owned writes 적용 뒤 close proof 직전에 다시 계산한 실제 최종 source hash다.

---

## 9. Guarded write set

### 9.1 Write 대상

Close write set은 필요한 lifecycle-owned mutation만 포함한다.

예:

* Task Capsule machine-owned status
* Task status history
* Task Board task status
* Task Board capsule identity/path correction
* 명시적으로 close-owned로 지정된 current-state projection

다음 항목은 자동으로 포함하지 않는다.

* 일반적인 roadmap
* DEVELOPMENT_SLICES
* advisory project 문서
* unrelated handoff
* broad release notes
* close contract에 없는 임의 documentation cleanup

### 9.2 Write schema

```ts
interface GuardedCloseWrite {
  sequence: number;
  role: string;
  path: string;

  expectedBeforeExists: boolean;
  expectedBeforeHash: string;

  afterHash: string;
  contentAfter?: string;
  preparedContentRef?: string;
}
```

`path`는 normalized project-relative path여야 한다.

Project root를 탈출하는 경로, root 밖을 가리키는 resolved path 또는 허용되지 않은 symlink target은 거부한다.

### 9.3 Deterministic order

Write 순서는 plan 생성 시 고정한다.

동일한 source 상태에서는 write order와 write set hash가 동일해야 한다.

```text
writeSetHash =
  hash(ordered guarded write descriptors)
```

### 9.4 Plan hash

```text
planHash =
  hash(
    close contract version
    + taskId
    + closeBasisHash
    + writeSetHash
    + intendedFinalState
    + required lock order
    + proof contract version
  )
```

다음은 plan hash에서 제외한다.

* 생성 시각
* operation ID
* process ID
* absolute path
* progress message
* machine-local temporary path

---

## 10. Readiness와 eligibility

Readiness evaluation은 read-only 판단이다.

별도의 `ready` mutation phase 또는 public command를 두지 않는다.

Preflight는 다음을 판단한다.

```text
task contract가 해석 가능한가
required evidence가 존재하는가
acceptance가 충족됐는가
close source가 malformed 상태가 아닌가
write set을 안전하게 계산할 수 있는가
기존 recovery operation과 충돌하지 않는가
```

Preflight가 blocked이면 다음을 보장한다.

```text
lifecycle write = 0
close proof append = 0
canonical evidence mutation = 0
```

Compatibility를 위해 readiness evidence record가 필요한 경우 다음 규칙을 적용한다.

* readiness evidence는 terminal close proof가 아니다.
* final-state verification 이후 final evidence bundle에서 append한다.
* close proof보다 먼저 append한다.
* 독립적인 idempotency key를 가진다.
* readiness evidence append 후 close proof append 전에 중단되면 operation은 `proof-pending`으로 남는다.
* retry는 readiness evidence를 중복 append하지 않고 close proof를 이어서 append한다.

---

## 11. Transaction state machine

### 11.1 Transient report phase

`preflight`는 public execution report에서 사용할 수 있지만 operation marker를 반드시 생성하지는 않는다.

### 11.2 Persisted operation phase

```ts
type CloseOperationPhase =
  | 'planned'
  | 'applying'
  | 'verifying'
  | 'proof-pending'
  | 'closed-valid'
  | 'blocked'
  | 'recovery-required';
```

### 11.3 Legal transitions

```text
preflight
  → blocked
  → planned
  → recovery-required

planned
  → applying
  → blocked
  → recovery-required

applying
  → verifying
  → recovery-required

verifying
  → proof-pending
  → recovery-required

proof-pending
  → closed-valid
  → recovery-required

closed-valid
  → closed-valid

recovery-required
  → applying
  → verifying
  → proof-pending
  → blocked
```

`closed-valid → applying`은 허용하지 않는다.

이미 closed-valid인 identical retry는 기존 결과를 반환하는 no-op이다.

---

## 12. Operation identity

Operation idempotency와 reviewed plan identity를 구분한다.

### 12.1 Idempotency key

```text
idempotencyKey =
  hash(taskId + closeBasisHash + intendedFinalState)
```

### 12.2 Plan hash

`planHash`는 정확한 source snapshot과 write set을 검증하는 stale-plan identity다.

따라서 두 값의 역할은 다르다.

```text
idempotencyKey
  동일한 closure intent와 retry를 식별

planHash
  정확히 같은 reviewed execution plan인지 검증
```

---

## 13. Persisted operation schema

Persisted operation schema는 현재 schema의 breaking 여부에 따라 version을 증가시킨다.

최소 contract는 다음을 포함한다.

```ts
interface CloseOperation {
  schemaVersion: string;

  operationId: string;
  taskId: string;
  idempotencyKey: string;

  intendedFinalState: 'closed-valid';

  phase: CloseOperationPhase;

  closeBasisHash: string;
  planHash: string;
  writeSetHash: string;

  lockOrder: [
    'project-lifecycle',
    'task-board',
    'task-scoped',
    'evidence-append'
  ];

  expectedWrites: GuardedCloseWrite[];

  attempts: CloseOperationAttempt[];

  finalSourceHash?: string;

  proof?: {
    idempotencyKey: string;
    outcome:
      | 'pending'
      | 'appended'
      | 'existing-noop';
  };

  createdAt: string;
  updatedAt: string;
}
```

### 13.1 Attempt schema

```ts
interface CloseOperationAttempt {
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;

  startPhase: CloseOperationPhase;
  terminalPhase?: CloseOperationPhase;

  journal: CloseJournalEntry[];

  mutationSummary: {
    plannedMutationSteps: number;
    executedMutationSteps: number;

    plannedFileWrites: number;
    executedFileWrites: number;

    evidenceAppends: number;
    recoveredWrites: number;

    closeProofAppended: boolean;
    idempotentNoop: boolean;
  };
}
```

동일 idempotency key와 동일 plan hash retry는:

```text
operationId 유지
attemptNumber 증가
기존 attempts 보존
새 attempt journal 생성
```

---

## 14. Progress와 durable journal 분리

### 14.1 Progress event

```ts
interface TaskCloseProgressEvent {
  step:
    | 'preflight'
    | 'plan'
    | 'apply-writes'
    | 'verify-final-state'
    | 'append-proof'
    | 'cleanup';

  phase:
    | 'start'
    | 'satisfied'
    | 'executed'
    | 'blocked';

  summary: string;
  ok?: boolean;
}
```

Progress event는 다음만 담당한다.

* CLI stderr 표시
* UI observation
* test observation
* telemetry

Progress event 자체는 operation marker persistence를 발생시키지 않는다.

### 14.2 Journal boundary

Durable journal은 semantic recovery boundary에서만 갱신한다.

권장 clean-path marker sequence:

```text
1. operation-prepared
   phase=applying
   전체 expectedWrites 포함

2. writes-applied
   phase=verifying
   실제 write outcome 포함

3. proof-intent
   phase=proof-pending
   finalSourceHash와 proof idempotency key 포함

4. operation-terminal
   phase=closed-valid
```

그 후 terminal marker를 durable하게 정리한다.

### 14.3 Persistence budget

Clean close 기준:

```text
operation marker content writes <= 4
durable marker cleanup <= 1
read-only progress marker writes = 0
```

다음 방식은 금지한다.

```text
progress event마다 marker rewrite
read-only readiness마다 fsync
audit event마다 fsync
refresh마다 marker rewrite
내용이 동일한 marker 반복 저장
각 write file마다 operation marker fsync
```

Target file 자체의 durability를 위한 file/directory fsync는 marker persistence budget과 별도로 취급한다.

---

## 15. Transaction algorithm

```text
1. fixed-order locks 획득

2. 기존 operation marker 조회

3. 이전 partial operation이 있으면 reconcile

4. close eligibility 평가

5. close basis snapshot 생성

6. 전체 guarded write set 계산

7. closeBasisHash, writeSetHash, planHash 계산

8. reviewed plan hash 검증

9. 모든 close basis source 재조회 및 revalidate

10. operation-prepared durable persist
    - expectedWrites 전체 포함
    - phase=applying

11. 각 guarded write 실행
    - expected existence 검증
    - before hash 검증
    - temp content 준비
    - file fsync
    - atomic rename
    - parent directory fsync

12. writes-applied durable persist
    - phase=verifying
    - 실제 write outcome 포함

13. 실제 final source를 filesystem에서 다시 읽음

14. intended final state와 actual final source 검증

15. finalSourceHash 계산

16. proof-intent durable persist
    - phase=proof-pending
    - proof idempotency key
    - finalSourceHash

17. optional readiness evidence append
    - existing idempotent record 재사용

18. close proof append
    - existing valid proof면 no-op

19. operation closed-valid durable persist

20. terminal operation marker durable cleanup

21. locks 역순 release
```

Close proof append 이전에 하나라도 실패하면 valid close proof를 생성하지 않는다.

---

## 16. Guarded write execution

### 16.1 실행 전 검증

각 write 전에 다음을 검사한다.

```text
resolved path가 project root 내부인가
현재 existence가 expectedBeforeExists와 같은가
현재 content hash가 expectedBeforeHash와 같은가
```

하나라도 불일치하면 해당 write를 수행하지 않는다.

### 16.2 Atomic write

Text file write의 기본 순서는 다음과 같다.

```text
root-confined temp file 작성
→ temp file fsync
→ before state 재확인
→ atomic rename
→ parent directory fsync
```

### 16.3 전체 filesystem atomicity를 가정하지 않는다

여러 파일을 변경하는 close transaction은 단일 filesystem transaction이 아니다.

따라서 일부 rename 이후 프로세스가 종료될 수 있다.

이 상황은 rollback 성공을 전제로 하지 않고 operation journal과 before/after hash reconciliation으로 해결한다.

Rollback은 best-effort 최적화일 수 있지만 correctness 근거가 되어서는 안 된다.

---

## 17. Final-state verification

모든 guarded write 이후 실제 filesystem을 다시 읽는다.

Final verification은 virtual state 또는 cached plan object를 사용해서는 안 된다.

검증 대상은 최소 다음을 포함한다.

* 각 write target의 실제 after hash
* Task Capsule의 실제 final lifecycle state
* Task Board의 실제 task state
* required close projection의 실제 상태
* close basis source가 transaction 중 허용되지 않게 변경되지 않았는지 여부
* intended final state가 `closed-valid` 조건을 만족하는지 여부

검증에 실패하면:

```text
close proof append 금지
operation phase = recovery-required
recovery details 반환
```

---

## 18. Close proof semantics

Close proof는 기존 0.4.x proof model을 유지하며 필요한 필드를 additive하게 확장한다.

최소한 다음 내용을 증명할 수 있어야 한다.

```ts
interface TaskCloseProof {
  taskId: string;

  idempotencyKey: string;
  operationId: string;

  closeBasisHash: string;
  finalSourceHash: string;

  planHash: string;
  writeSetHash: string;

  intendedFinalState: 'closed-valid';

  validationSummary: unknown;
  createdAt: string;
}
```

### 18.1 Proof append 조건

다음 조건이 모두 참이어야 한다.

```text
모든 guarded write 성공
모든 target actual hash가 expected after hash와 일치
final source snapshot 생성 성공
final source verification 성공
proof intent durable persist 성공
```

### 18.2 Duplicate prevention

동일 proof idempotency key가 이미 존재하면:

```text
새 proof append 금지
기존 valid proof 반환
proof outcome = existing-noop
closeState = closed-valid
```

동일 key의 malformed 또는 conflicting proof가 존재하면:

```text
closeState = close-evidence-malformed 또는 invalid
health = recovery-required
새 proof append 금지
```

---

## 19. Recovery reconciliation

Operation marker에 non-terminal operation이 존재하면 새 execution 전에 실제 상태를 조사한다.

### 19.1 Write reconciliation

각 expected write를 다음과 같이 분류한다.

```text
before
  actual hash == expectedBeforeHash

after
  actual hash == afterHash

conflict
  actual hash가 before/after 어느 쪽도 아님

missing-conflict
  existence가 before/after expectation 어느 쪽과도 맞지 않음
```

### 19.2 자동 resume 가능한 상태

다음 조건이면 같은 `task close` command가 자동으로 재개할 수 있다.

```text
모든 write가 before
```

결과:

```text
apply-writes부터 재개
```

다음 조건도 자동 재개할 수 있다.

```text
write order 기준으로 prefix는 after
나머지는 before
conflict 없음
close basis가 여전히 유효
```

결과:

```text
남은 write부터 재개
```

다음 조건이면 verification 또는 proof 단계부터 재개한다.

```text
모든 write가 after
close proof 없음
```

결과:

```text
final verification
→ proof append
```

### 19.3 Recovery-required 상태

다음은 자동 mutation을 중단한다.

```text
non-prefix partial write
unknown/conflicting hash
close basis 변경
stale plan과 applied write가 동시에 존재
malformed operation marker
동일 idempotency key의 conflicting proof
expected write path가 root 밖으로 resolve
```

Public report는 machine-owned recovery action 하나를 primary action으로 제공해야 한다.

사용자에게 TASK.md, Task Board 또는 operation marker를 수동 편집하도록 지시하지 않는다.

### 19.4 Proof append 이후 terminal persist 실패

Close proof는 append됐지만 terminal marker 갱신 전에 중단된 경우:

```text
retry가 동일 valid proof 탐지
→ closed-valid existing result로 확정
→ stale operation marker 정리
```

중복 proof를 append하지 않는다.

---

## 20. Blocked close contract

Preflight blocked close는 다음을 반환한다.

```text
health = blocked
terminal = true
closeState = not-closed
lifecycle writes = 0
evidence appends = 0
primaryNextAction = 정확히 하나
```

여러 diagnostic을 반환할 수 있으나 primary recovery action은 하나여야 한다.

예:

```text
필수 validation 실행
malformed evidence 수정
Task Board duplicate identity 해결
stale reviewed plan 재생성
active recovery operation 재개
```

---

## 21. Write summary contract

`executedWrites`처럼 의미가 불명확한 필드를 사용하지 않는다.

```ts
interface TaskCloseWriteSummary {
  plannedMutationSteps: number;
  executedMutationSteps: number;

  plannedFileWrites: number;
  executedFileWrites: number;

  evidenceAppends: number;

  closeProofAppended: boolean;
  idempotentNoop: boolean;
}
```

`executedFileWrites`는 실제 target file write 수다.

Mutation step 수를 file write 수로 보고하지 않는다.

---

## 22. Recovery report

```ts
interface TaskCloseRecoveryReport {
  required: boolean;

  operationId?: string;
  phase?: CloseOperationPhase;

  resumable: boolean;

  completedWrites: string[];
  pendingWrites: string[];
  conflictingWrites: string[];

  primaryAction?: TaskLifecycleNextAction;
}
```

Public compact output에는 machine-local absolute path를 포함하지 않는다.

경로가 필요하면 normalized project-relative path만 제공한다.

---

## 23. Schema requirements

Close operation 및 report schema는 TypeScript contract와 일치해야 한다.

Full transaction report에서는 최소 다음을 required로 둔다.

```text
terminal
operatorGuidance
transaction.lockOrder
transaction.locks
writeSummary
recovery
```

Count field는 모두 다음 제한을 사용한다.

```json
{
  "type": "integer",
  "minimum": 0
}
```

적용 대상:

```text
attemptNumber
plannedMutationSteps
executedMutationSteps
plannedFileWrites
executedFileWrites
evidenceAppends
recoveredWrites
durableWrites
fileFsyncs
directoryFsyncs
```

Core operation, attempt, write, proof object를 임의의 loose object로 검증하지 않는다.

`additionalProperties: true`를 core contract 검증 회피 용도로 사용하지 않는다.

Close plan은 독립 schema로 등록하고 public report에서 `$ref`로 연결한다.

---

## 24. Reference implementation structure

권장 구조:

```text
src/task/close/
├── index.ts
├── types.ts
├── locks.ts
├── source.ts
├── snapshot.ts
├── plan.ts
├── writes.ts
├── journal.ts
├── execute.ts
├── proof.ts
└── audit.ts
```

### `index.ts`

Public facade.

### `types.ts`

Close transaction, plan, source, write, operation, attempt, journal type.

### `locks.ts`

Fixed-order lock coordinator.

### `source.ts`

Required close source selection.

### `snapshot.ts`

Close basis, write target, final source snapshot과 hash.

### `plan.ts`

Read-only eligibility, guarded write plan, plan hash.

### `writes.ts`

Guarded write planning support와 execution.

기존 close write-sync helper의 필요한 before/after hash, root confinement, temp write, rename 로직은 이곳으로 이동한다.

### `journal.ts`

Operation marker persistence, attempts, reconciliation, terminal cleanup.

### `execute.ts`

Transaction orchestration만 담당한다.

### `proof.ts`

Readiness evidence compatibility와 physical proof-last append.

### `audit.ts`

기존 proof currentness에 대한 read-only audit.

`execute.ts`에 모든 구현을 합치지 않는다.

---

## 25. Fault-injection seam

Production CLI에 노출되지 않는 internal hook을 제공한다.

```ts
interface TaskCloseFaultHooks {
  afterLocksAcquired?: () => void;
  afterPlanCreated?: () => void;
  afterOperationPrepared?: () => void;

  beforeWrite?: (
    index: number,
    write: GuardedCloseWrite
  ) => void;

  afterWrite?: (
    index: number,
    write: GuardedCloseWrite
  ) => void;

  afterWritesPersisted?: () => void;
  beforeFinalVerification?: () => void;
  afterFinalVerification?: () => void;

  afterProofIntent?: () => void;
  afterReadinessEvidenceAppend?: () => void;
  afterCloseProofAppend?: () => void;

  beforeTerminalCleanup?: () => void;
}
```

Hook exception은 실제 process interruption과 동일한 durable state를 남겨야 한다.

---

## 26. 필수 fault matrix

### Locking

* project lifecycle lock timeout
* Task Board lock timeout
* task-scoped lock timeout
* evidence append lock timeout
* lock 획득 중 process interruption
* lock 순서 위반 검출

### Snapshot

* snapshot 직후 close source 변경
* plan hash 생성 후 close source 변경
* path existence 변경
* Task Board identity/path 변경
* explicit required source 변경

### Guarded writes

각 planned write에 대해:

* write 직전 interruption
* temp file write 실패
* temp file fsync 실패
* rename 직전 interruption
* rename 직후 interruption
* directory fsync 실패
* expected before hash mismatch
* target path conflict
* project root escape

### Partial execution

* 첫 write 후 interruption
* 중간 write 후 interruption
* 마지막 write 후 journal update 전 interruption
* prefix partial state
* non-prefix partial state
* all-after operation marker
* unknown/conflicting target hash

### Final verification

* final source mismatch
* final target hash mismatch
* verification 직전 source mutation
* verification 직후, proof intent 전 interruption

### Evidence

* readiness evidence append 실패
* readiness append 후 proof 전 interruption
* close proof append 실패
* proof append 성공 후 operation terminal persist 전 interruption
* duplicate identical retry
* conflicting duplicate idempotency key
* malformed existing proof

### Journal

* initial operation persist 실패
* marker temp write 실패
* marker fsync 실패
* marker rename 실패
* marker directory fsync 실패
* malformed marker
* stale plan marker
* terminal cleanup 실패

---

## 27. Validation gates

| Gate                | Required proof                                                      |
| ------------------- | ------------------------------------------------------------------- |
| Clean close         | 하나의 primary command로 closed-valid에 도달한다.                            |
| Blocked close       | Lifecycle write와 evidence append가 모두 0이다.                           |
| Race                | Close source 또는 before hash 변경 시 첫 unsafe mutation 전에 중단한다.         |
| Physical proof-last | 이전 write 또는 final verification 실패 시 valid close proof가 존재하지 않는다.    |
| Idempotency         | Identical retry가 file/evidence mutation 없는 existing-result no-op이다. |
| Partial recovery    | Deterministic prefix partial execution을 같은 command가 재개한다.           |
| Conflict recovery   | Unknown/non-prefix state가 explicit recovery-required로 중단된다.         |
| Proof pending       | 모든 write 완료 후 proof append 실패를 같은 command가 재개한다.                    |
| Locality            | Canonical proof는 Task Capsule에 있고 operation state는 rebuildable이다.   |
| Locking             | 모든 close route가 동일 lock order를 사용한다.                                |
| Performance         | Progress event가 operation marker persistence를 발생시키지 않는다.            |
| Installed dogfood   | 설치된 package에서 clean, blocked, race, retry, partial recovery가 통과한다.  |

---

## 28. Deterministic performance tests

Unit test에서 절대 실행 시간에 강하게 의존하지 않는다.

다음 count를 검증한다.

```text
operation marker content write count
operation marker file fsync count
operation marker directory fsync count
target file write count
read-only progress persistence count
unchanged marker write skip count
```

Clean close:

```text
marker content writes <= 4
marker cleanup <= 1
read-only progress persistence = 0
close proof append = 1
```

Identical closed-valid retry:

```text
executedMutationSteps = 0
executedFileWrites = 0
evidenceAppends = 0
closeProofAppended = false
idempotentNoop = true
```

Dry-run:

```text
operation marker writes = 0
target file writes = 0
evidence appends = 0
```

Blocked preflight:

```text
target file writes = 0
evidence appends = 0
```

---

## 29. Acceptance criteria

| ID    | Criterion                                                                   |
| ----- | --------------------------------------------------------------------------- |
| AC-1  | `task close --task T-XXXX --json` 하나로 clean close가 완료된다.                    |
| AC-2  | Normal happy path에서 caller-supplied plan hash가 필요하지 않다.                     |
| AC-3  | Public close workflow에 별도 ready, finish, finalize, bookkeeping command가 없다. |
| AC-4  | legacy `bookkeeping`이 phase, schema, report 또는 command로 존재하지 않는다.                  |
| AC-5  | 첫 lifecycle mutation 전에 전체 guarded write set이 계산된다.                         |
| AC-6  | 모든 close route가 fixed lock order를 따른다.                                      |
| AC-7  | Close basis가 mutation 직전에 content hash로 재검증된다.                              |
| AC-8  | 각 write가 expected existence와 before hash로 보호된다.                             |
| AC-9  | Close proof가 실제 모든 write와 final verification 이후에 append된다.                  |
| AC-10 | 이전 write 또는 verification 실패 시 valid close proof가 존재하지 않는다.                  |
| AC-11 | 동일 retry가 기존 valid proof를 반환하고 duplicate proof를 생성하지 않는다.                   |
| AC-12 | Prefix partial write는 동일 close command가 자동으로 재개한다.                          |
| AC-13 | Conflict 또는 non-prefix partial state는 recovery-required로 fail closed한다.     |
| AC-14 | Progress event와 durable journal persistence가 분리된다.                          |
| AC-15 | Clean close operation marker content write가 4회 이하이다.                        |
| AC-16 | Report가 mutation step, file write, evidence append 수를 구분한다.                 |
| AC-17 | Full report schema가 operation, attempts, writes, recovery를 엄격히 검증한다.        |
| AC-18 | Canonical close evidence가 Task Capsule에 유지된다.                               |
| AC-19 | Installed package에서 concurrency와 fault matrix dogfood가 통과한다.                |
| AC-20 | Recovery가 deterministic하지 않으면 close route를 stable primary로 promotion하지 않는다. |

---

## 30. 금지 사항

다음 방식으로 acceptance를 충족한 것으로 간주하지 않는다.

```text
fsync 전체 제거
operation journal 제거
atomic rename 제거
close proof를 write보다 먼저 append
virtual final state만 검증하고 proof 생성
모든 partial state를 수동 수정으로 넘김
duplicate proof append 후 audit로만 걸러냄
timeout 증가만으로 close 성능 문제 해결
progress event 수만 줄이고 persistence 결합 유지
모든 close source를 state rev 하나로 대체
legacy bookkeeping을 이름만 writes로 변경하고 기존 과도한 책임 유지
advisory 문서를 무조건 close write set에 포함
schema를 loose object로 만들어 검증 회피
legacy close command를 co-primary route로 복원
```

---

## 31. Promotion과 rollback

Stable promotion은 clean path 성공만으로 결정하지 않는다.

다음 installed-package dogfood가 모두 필요하다.

```text
clean
blocked
lock contention
source race
guarded-write mismatch
prefix partial recovery
conflicting partial recovery
proof append failure
duplicate retry
terminal cleanup recovery
```

Recovery가 deterministic하지 않거나 physical proof-last를 보장할 수 없다면:

```text
task close engine을 internal/experimental 상태로 유지
stable primary close로 promotion하지 않음
split primary close guidance를 문서화하지 않음
```

Rollback 시 canonical task evidence와 task facts를 제거하거나 덮어쓰지 않는다.

Operation marker와 central recovery state는 rebuildable machine-owned state로 취급한다.

---

## 32. 완료 보고 형식

Implementation 완료 보고에는 다음을 포함한다.

1. 변경 파일 목록
2. 기존 bookkeeping 책임의 이동 또는 제거 내역
3. 최종 close transaction sequence
4. close basis와 write target 정의
5. guarded write set 예시
6. operation state machine
7. marker persistence count
8. physical proof-last 검증 결과
9. partial recovery matrix 결과
10. identical retry 결과
11. full/focused/installed-package validation 결과
12. 남아 있는 task-close risk

---

## 33. 최종 완료 정의

`task close`는 다음 조건을 모두 만족할 때 완료된 것으로 본다.

> 사용자는 하나의 command로 Task Capsule을 닫을 수 있다. Engine은 첫 mutation 전에 전체 write set과 close basis를 고정하고, 모든 write를 before hash로 보호하며, 실제 최종 filesystem 상태를 재검증한 뒤 close proof를 물리적으로 마지막에 append한다. 어느 write boundary에서 중단되더라도 같은 command가 operation journal과 before/after hash를 이용해 안전하게 재개하거나 명시적인 recovery-required 상태로 중단해야 하며, 동일 retry는 lifecycle file과 canonical evidence를 다시 변경하지 않아야 한다.
