#!/usr/bin/env bash
set -euo pipefail

TASK_ID=""
MODE="dry-run"
CREATE_GITHUB_DRAFT="false"
REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org}"
PACKAGE_NAME="hadara"
DIST_DIR="dist-release"
PACKAGE_SMOKE_TIMEOUT="${PACKAGE_SMOKE_TIMEOUT:-300}"
NPM_TAG="${NPM_TAG:-}"
GITHUB_RELEASE_NOTE=""
GITHUB_TOKEN_ENV=""
APPROVAL_ACTOR="${HADARA_RELEASE_APPROVAL_ACTOR:-local-operator}"
APPROVAL_REASON="${HADARA_RELEASE_APPROVAL_REASON:-Manual approval-gated npm publish for current package version}"

usage() {
cat <<'EOF'
Usage:
scripts/release/manual-publish-rc.sh TASK_ID [options]

Options:
--execute          Allow actual npm publish after interactive confirmation.
--github-draft    After npm publish succeeds, create a GitHub Release draft with assets.
                  Publishing that draft publicly remains a separate gh release edit command.
--github-release-note <path>
                   Markdown file to use as the GitHub Release draft notes.
--github-token-env <name>
                   Environment variable name containing a GitHub token for gh auth.
--approval-actor <name>
                   Approval actor recorded in HADARA publish dry-run gates.
--approval-reason <text>
                   Approval reason recorded in HADARA publish dry-run gates.
--registry <url>  npm registry URL. Default: https://registry.npmjs.org
--dist-dir <dir>  Release artifact output directory. Default: dist-release
--package <name>  npm package name. Default: hadara
--npm-tag <tag>   npm dist-tag for publish. Default: next for rc versions, latest otherwise.
-h, --help         Show this help.

Environment:
PACKAGE_SMOKE_TIMEOUT
                   Timeout in seconds for `hadara smoke package --execute`.
                   Default: 300.

Examples:

# login
npm login
or
npm login --registry=https://registry.npmjs.org --auth-type=legacy
or
npm config set //registry.npmjs.org/:_authToken "$NPM_TOKEN"
npm whoami --registry=https://registry.npmjs.org
and
gh auth login

# Safe default: validation + artifact + npm publish dry-run only.

scripts/release/manual-publish-rc.sh T-0579

# Actual npm publish after typing "publish".

scripts/release/manual-publish-rc.sh T-0579 --execute

# Actual npm publish, then GitHub Release draft after typing "github-draft".

scripts/release/manual-publish-rc.sh T-0579 --execute --github-draft \
  --github-release-note tasks/T-0579-v0-4-4-rc-0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md

# Publish a reviewed GitHub Release draft publicly.

gh release edit v$(node -p "require('./package.json').version") --repo ictseoyoungmin/HADARA --draft=false
EOF
}

if [[ $# -gt 0 && "$1" != --* ]]; then
TASK_ID="$1"
shift
fi

while [[ $# -gt 0 ]]; do
case "$1" in
--execute)
MODE="execute"
shift
;;
--github-draft)
CREATE_GITHUB_DRAFT="true"
shift
;;
--github-release-note)
GITHUB_RELEASE_NOTE="${2:-}"
[[ -n "${GITHUB_RELEASE_NOTE}" ]] || { echo "--github-release-note requires a value"; exit 1; }
shift 2
;;
--github-token-env)
GITHUB_TOKEN_ENV="${2:-}"
[[ -n "${GITHUB_TOKEN_ENV}" ]] || { echo "--github-token-env requires a value"; exit 1; }
shift 2
;;
--approval-actor)
APPROVAL_ACTOR="${2:-}"
[[ -n "${APPROVAL_ACTOR}" ]] || { echo "--approval-actor requires a value"; exit 1; }
shift 2
;;
--approval-reason)
APPROVAL_REASON="${2:-}"
[[ -n "${APPROVAL_REASON}" ]] || { echo "--approval-reason requires a value"; exit 1; }
shift 2
;;
--registry)
REGISTRY="${2:-}"
[[ -n "${REGISTRY}" ]] || { echo "--registry requires a value"; exit 1; }
shift 2
;;
--dist-dir)
DIST_DIR="${2:-}"
[[ -n "${DIST_DIR}" ]] || { echo "--dist-dir requires a value"; exit 1; }
shift 2
;;
--package)
PACKAGE_NAME="${2:-}"
[[ -n "${PACKAGE_NAME}" ]] || { echo "--package requires a value"; exit 1; }
shift 2
;;
--npm-tag)
NPM_TAG="${2:-}"
[[ -n "${NPM_TAG}" ]] || { echo "--npm-tag requires a value"; exit 1; }
shift 2
;;
-h|--help)
usage
exit 0
;;
*)
echo "Unknown argument: $1"
usage
exit 1
;;
esac
done

if [[ -z "${TASK_ID}" ]]; then
echo "TASK_ID is required."
usage
exit 1
fi

require_cmd() {
command -v "$1" >/dev/null 2>&1 || {
echo "Required command not found: $1"
exit 1
}
}

detect_hadara_cmd() {
if [[ -f "dist/cli/main.js" ]]; then
HADARA_CMD=(node dist/cli/main.js)
elif command -v hadara >/dev/null 2>&1; then
HADARA_CMD=(hadara)
else
echo "hadara command not found and dist/cli/main.js does not exist."
echo "Run npm run build, install/link hadara, or run this script from the HADARA repo root."
exit 1
fi
}

run_hadara() {
"${HADARA_CMD[@]}" "$@"
}

verify_checksum() {
local checksum_file="$1"
local checksum_dir
local checksum_base

checksum_dir="$(dirname "${checksum_file}")"
checksum_base="$(basename "${checksum_file}")"

if command -v sha256sum >/dev/null 2>&1; then
(cd "${checksum_dir}" && sha256sum -c "${checksum_base}")
elif command -v shasum >/dev/null 2>&1; then
(cd "${checksum_dir}" && shasum -a 256 -c "${checksum_base}")
else
echo "Warning: neither sha256sum nor shasum is available; skipping checksum verification."
fi
}

npm_local_file_arg() {
local file_path="$1"

case "${file_path}" in
/*|./*|../*)
printf '%s\n' "${file_path}"
;;
*)
printf './%s\n' "${file_path}"
;;
esac
}

default_npm_tag_for_version() {
local version="$1"

case "${version}" in
*-rc.*)
printf 'next\n'
;;
*)
printf 'latest\n'
;;
esac
}

resolve_task_capsule_dir() {
local matches=()
shopt -s nullglob
matches=(tasks/"${TASK_ID}"-*)
shopt -u nullglob

if [[ "${#matches[@]}" -ne 1 ]]; then
echo "Expected exactly one task capsule directory for ${TASK_ID}; found ${#matches[@]}."
printf '  %s\n' "${matches[@]}"
exit 1
fi

TASK_CAPSULE_DIR="${matches[0]}"
}

verify_release_task_matches_version() {
if [[ ! -f "${TASK_CAPSULE_DIR}/TASK.md" ]]; then
echo "Task capsule is missing TASK.md: ${TASK_CAPSULE_DIR}"
exit 1
fi

if ! grep -Fq "${VERSION}" "${TASK_CAPSULE_DIR}/TASK.md"; then
echo "Task ${TASK_ID} does not appear to be the release capsule for ${PACKAGE_NAME}@${VERSION}."
echo "Task capsule: ${TASK_CAPSULE_DIR}"
echo "Use the current release-readiness task for this package version."
exit 1
fi
}

dirty_paths_are_release_outputs_only() {
local status_lines="$1"
local line
local path

while IFS= read -r line; do
[[ -n "${line}" ]] || continue
path="${line:3}"
case "${path}" in
"${DIST_DIR}"|"${DIST_DIR}"/*|\
"${TASK_CAPSULE_DIR}/EVIDENCE.md"|\
"${TASK_CAPSULE_DIR}/evidence.jsonl"|\
"${TASK_CAPSULE_DIR}/artifacts"|\
"${TASK_CAPSULE_DIR}/artifacts"/*)
;;
*)
return 1
;;
esac
done <<< "${status_lines}"

return 0
}

cleanup_release_dry_run_outputs() {
local status_lines

status_lines="$(git status --porcelain)"
if [[ -z "${status_lines}" ]]; then
return
fi

if ! dirty_paths_are_release_outputs_only "${status_lines}"; then
echo "Git worktree has changes outside release dry-run outputs."
echo "${status_lines}"
exit 1
fi

echo "Cleaning release dry-run outputs so the publish clone stays reusable..."
git checkout -- "${TASK_CAPSULE_DIR}/EVIDENCE.md" "${TASK_CAPSULE_DIR}/evidence.jsonl"
git clean -fd -- "${DIST_DIR}" "${TASK_CAPSULE_DIR}/artifacts" >/dev/null

status_lines="$(git status --porcelain)"
if [[ -n "${status_lines}" ]]; then
echo "Git worktree is still dirty after release dry-run cleanup."
echo "${status_lines}"
exit 1
fi
}

verify_tarball_package_metadata() {
local tarball="$1"
local expected_name="$2"
local expected_version="$3"

node - "${tarball}" "${expected_name}" "${expected_version}" <<'NODE'
const { execFileSync } = require('node:child_process');

const [tarball, expectedName, expectedVersion] = process.argv.slice(2);
const raw = execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' });
const parsed = JSON.parse(raw);
const issues = [];

if (parsed.name !== expectedName) issues.push(`name expected ${expectedName}, got ${parsed.name}`);
if (parsed.version !== expectedVersion) issues.push(`version expected ${expectedVersion}, got ${parsed.version}`);
if (typeof parsed.description !== 'string' || !parsed.description.includes('Local-first evidence control plane')) {
  issues.push('description is missing the release discovery wording');
}
for (const keyword of ['ai', 'agent', 'coding-agent', 'developer-tools', 'hadara']) {
  if (!Array.isArray(parsed.keywords) || !parsed.keywords.includes(keyword)) {
    issues.push(`keywords missing ${keyword}`);
  }
}
if (!parsed.repository || parsed.repository.type !== 'git' || typeof parsed.repository.url !== 'string') {
  issues.push('repository metadata is missing');
}
if (typeof parsed.homepage !== 'string' || parsed.homepage.length === 0) issues.push('homepage metadata is missing');
if (!parsed.bugs || typeof parsed.bugs.url !== 'string') issues.push('bugs metadata is missing');

if (issues.length > 0) {
  console.error('Release tarball package.json metadata validation failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Release tarball package metadata verified: ${parsed.name}@${parsed.version}`);
NODE
}

ensure_gh_auth() {
if gh auth status >/dev/null 2>&1; then
return
fi

if [[ -n "${GITHUB_TOKEN_ENV}" ]]; then
local token_value="${!GITHUB_TOKEN_ENV:-}"
if [[ -z "${token_value}" ]]; then
echo "GitHub token environment variable is empty or unset: ${GITHUB_TOKEN_ENV}"
exit 1
fi
printf '%s' "${token_value}" | gh auth login --with-token
return
fi

echo "GitHub CLI is not authenticated."
echo "Run gh auth login first, set GH_TOKEN for gh, or pass --github-token-env <ENV_NAME>."
exit 1
}

echo "== HADARA manual npm publish flow =="
echo "Task: ${TASK_ID}"
echo "Mode: ${MODE}"
echo "GitHub Release draft: ${CREATE_GITHUB_DRAFT}"
echo "GitHub Release note: ${GITHUB_RELEASE_NOTE:-<default inline note>}"
echo "GitHub token env: ${GITHUB_TOKEN_ENV:-<gh existing auth or GH_TOKEN>}"
echo "Registry: ${REGISTRY}"
echo "Package: ${PACKAGE_NAME}"
echo "Dist dir: ${DIST_DIR}"
echo "Package smoke timeout: ${PACKAGE_SMOKE_TIMEOUT}s"
echo "Approval actor: ${APPROVAL_ACTOR}"
echo "Approval reason: ${APPROVAL_REASON}"
echo

echo "== 0. Preflight =="
require_cmd npm
require_cmd node
require_cmd git
detect_hadara_cmd
VERSION="$(node -p "require('./package.json').version")"
if [[ -z "${NPM_TAG}" ]]; then
NPM_TAG="$(default_npm_tag_for_version "${VERSION}")"
fi
echo "npm tag: ${NPM_TAG}"
PACKAGE_JSON_NAME="$(node -p "require('./package.json').name")"
PACKAGE_PRIVATE="$(node -p "String(require('./package.json').private)")"
resolve_task_capsule_dir
verify_release_task_matches_version

if [[ "${CREATE_GITHUB_DRAFT}" == "true" ]]; then
require_cmd gh
if [[ -n "${GITHUB_RELEASE_NOTE}" && ! -f "${GITHUB_RELEASE_NOTE}" ]]; then
echo "GitHub Release note file not found: ${GITHUB_RELEASE_NOTE}"
exit 1
fi
fi

echo "HADARA command: ${HADARA_CMD[*]}"
echo "Task capsule: ${TASK_CAPSULE_DIR}"

GIT_STATUS="$(git status --porcelain)"
if [[ -n "${GIT_STATUS}" ]]; then
cleanup_release_dry_run_outputs
GIT_STATUS="$(git status --porcelain)"
fi

if [[ -n "${GIT_STATUS}" ]]; then
echo "Git worktree must be clean before manual publish."
echo "${GIT_STATUS}"
exit 1
fi

npm whoami --registry="${REGISTRY}" >/dev/null
echo "npm user: $(npm whoami --registry="${REGISTRY}")"

if [[ "${PACKAGE_JSON_NAME}" != "${PACKAGE_NAME}" ]]; then
echo "package.json name (${PACKAGE_JSON_NAME}) does not match expected package (${PACKAGE_NAME})."
exit 1
fi

echo "package version: ${VERSION}"
echo "package private: ${PACKAGE_PRIVATE}"

echo
echo "== 1. Final local validation =="
npm run check

echo
echo "== 2. Build release artifact =="
rm -rf "${DIST_DIR}"
mkdir -p "${DIST_DIR}"

run_hadara release artifact --execute --json --output "${DIST_DIR}" --attach-evidence --task "${TASK_ID}"

TARBALL="$(ls -1t "${DIST_DIR}"/*.tgz 2>/dev/null | head -n 1 || true)"
if [[ -z "${TARBALL}" ]]; then
echo "No .tgz tarball found in ${DIST_DIR}"
exit 1
fi

CHECKSUM_FILE="${TARBALL}.sha256"
MANIFEST_FILE="${TARBALL}.manifest.json"
NPM_TARBALL="$(npm_local_file_arg "${TARBALL}")"

echo "Generated tarball: ${TARBALL}"

if [[ -f "${CHECKSUM_FILE}" ]]; then
echo "Checking checksum: ${CHECKSUM_FILE}"
verify_checksum "${CHECKSUM_FILE}"
else
echo "Checksum file not found: ${CHECKSUM_FILE}"
exit 1
fi

if [[ ! -f "${MANIFEST_FILE}" ]]; then
echo "Manifest file not found: ${MANIFEST_FILE}"
exit 1
fi

echo "Manifest file: ${MANIFEST_FILE}"
verify_tarball_package_metadata "${TARBALL}" "${PACKAGE_NAME}" "${VERSION}"

echo
echo "== 3. Fresh release evidence =="
run_hadara smoke package --execute --attach-evidence --task "${TASK_ID}" --timeout "${PACKAGE_SMOKE_TIMEOUT}" --json
run_hadara smoke clean-checkout --execute --attach-evidence --task "${TASK_ID}" --json

echo
echo "== 4. Final HADARA gates =="
run_hadara release gate --mode strict --json
run_hadara release dry-run --json
run_hadara release publish --mode dry-run \
  --approval-actor "${APPROVAL_ACTOR}" \
  --approval-reason "${APPROVAL_REASON}" \
  --json

echo
echo "== 5. User-only pre-publish checks =="

set +e
NPM_VERSION_OUTPUT="$(npm view "${PACKAGE_NAME}@${VERSION}" version --registry="${REGISTRY}" 2>&1)"
NPM_VERSION_STATUS=$?
set -e

if [[ "${NPM_VERSION_STATUS}" -eq 0 ]]; then
echo "This exact npm version already exists:"
echo "${NPM_VERSION_OUTPUT}"
echo "Stop. npm package versions are immutable."
exit 1
else
echo "This exact package version does not appear to exist on npm."
echo "npm view output:"
echo "${NPM_VERSION_OUTPUT}"
fi

echo
echo "Dry-run inspect the exact tarball that would be published:"
npm publish "${NPM_TARBALL}" --dry-run --registry="${REGISTRY}" --tag="${NPM_TAG}"

if [[ "${MODE}" != "execute" ]]; then
cleanup_release_dry_run_outputs
echo
echo "============================================================"
echo "DRY-RUN COMPLETED"
echo "No npm publish, git tag push, or GitHub Release was created."
echo
echo "To publish through this helper, re-run:"
echo "  $0 ${TASK_ID} --execute"
echo
echo "To publish and then create a GitHub Release draft:"
echo "  $0 ${TASK_ID} --execute --github-draft"
echo
echo "After reviewing a GitHub draft, publish it publicly with:"
echo "  gh release edit v${VERSION} --repo ictseoyoungmin/HADARA --draft=false"
echo "============================================================"
exit 0
fi

echo
echo "============================================================"
echo "READY FOR REAL NPM PUBLISH"
echo "Tarball: ${TARBALL}"
echo "Registry: ${REGISTRY}"
echo "npm tag: ${NPM_TAG}"
echo
echo "This next command will publish to npm:"
echo
echo "  npm publish ${NPM_TARBALL} --registry=${REGISTRY} --tag=${NPM_TAG}"
echo
echo "Type exactly: publish"
echo "============================================================"
read -r CONFIRM

if [[ "${CONFIRM}" != "publish" ]]; then
echo "Publish cancelled."
exit 1
fi

npm publish "${NPM_TARBALL}" --registry="${REGISTRY}" --tag="${NPM_TAG}"

echo
echo "npm publish completed."

PUBLISHED_VERSION=""
for attempt in 1 2 3 4 5 6 7 8 9 10; do
set +e
PUBLISHED_VERSION="$(npm view "${PACKAGE_NAME}@${VERSION}" version --registry="${REGISTRY}" 2>/dev/null)"
NPM_VIEW_STATUS=$?
set -e
if [[ "${NPM_VIEW_STATUS}" -eq 0 && "${PUBLISHED_VERSION}" == "${VERSION}" ]]; then
break
fi
if [[ "${attempt}" -lt 10 ]]; then
echo "npm view has not observed ${PACKAGE_NAME}@${VERSION} yet; retrying (${attempt}/10)."
sleep 10
fi
done

if [[ "${PUBLISHED_VERSION}" != "${VERSION}" ]]; then
echo "npm view verification failed after publish."
echo "Expected: ${VERSION}"
echo "Actual: ${PUBLISHED_VERSION:-<not found>}"
exit 1
fi

echo "npm view verified: ${PACKAGE_NAME}@${PUBLISHED_VERSION}"
run_hadara evidence add-command \
  --task "${TASK_ID}" \
  --summary "Published ${PACKAGE_NAME}@${VERSION} to npm and verified npm view returned ${PUBLISHED_VERSION}; GitHub Release draft requested: ${CREATE_GITHUB_DRAFT}." \
  --result passed \
  --json

if [[ "${CREATE_GITHUB_DRAFT}" != "true" ]]; then
echo
echo "Skipping GitHub Release draft."
echo "Re-run with --execute --github-draft if you want to create a draft release."
echo "If a reviewed draft already exists, publish it publicly with:"
echo "  gh release edit v${VERSION} --repo ictseoyoungmin/HADARA --draft=false"
exit 0
fi

echo
echo "== 6. Optional GitHub Release draft =="

ensure_gh_auth

TAG="v${VERSION}"

echo "Version: ${VERSION}"
echo "Tag: ${TAG}"

if [[ ! -f "${TARBALL}" || ! -f "${CHECKSUM_FILE}" || ! -f "${MANIFEST_FILE}" ]]; then
echo "One or more release assets are missing:"
echo "  ${TARBALL}"
echo "  ${CHECKSUM_FILE}"
echo "  ${MANIFEST_FILE}"
exit 1
fi

echo
echo "============================================================"
echo "READY FOR GITHUB RELEASE DRAFT"
echo "This will:"
echo "  - create local tag if missing: ${TAG}"
echo "  - push tag to origin if missing remotely"
echo "  - create a GitHub Release draft"
echo "  - attach tarball, checksum, and manifest"
echo
echo "Type exactly: github-draft"
echo "============================================================"
read -r GITHUB_CONFIRM

if [[ "${GITHUB_CONFIRM}" != "github-draft" ]]; then
echo "GitHub Release draft cancelled."
exit 0
fi

if git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null; then
echo "Git tag already exists locally: ${TAG}"
else
git tag -a "${TAG}" -m "HADARA ${VERSION}"
fi

REMOTE_TAG="$(git ls-remote --tags origin "refs/tags/${TAG}" || true)"
if [[ -n "${REMOTE_TAG}" ]]; then
echo "Git tag already exists on origin: ${TAG}"
else
git push origin "${TAG}"
fi

echo
echo "Creating GitHub Release draft with release assets..."
GH_RELEASE_NOTE_ARGS=(--notes "HADARA ${VERSION} release. See attached tarball, checksum, and manifest.")
if [[ -n "${GITHUB_RELEASE_NOTE}" ]]; then
GH_RELEASE_NOTE_ARGS=(--notes-file "${GITHUB_RELEASE_NOTE}")
fi

gh release create "${TAG}" \
  "${TARBALL}" \
  "${CHECKSUM_FILE}" \
  "${MANIFEST_FILE}" \
  --title "HADARA ${VERSION}" \
  "${GH_RELEASE_NOTE_ARGS[@]}" \
  --draft \
  --verify-tag

echo
echo "GitHub Release draft created."
echo "Review it in GitHub UI, then publish the draft manually if everything is correct:"
echo "  gh release edit ${TAG} --repo ictseoyoungmin/HADARA --draft=false"
run_hadara evidence add-command \
  --task "${TASK_ID}" \
  --summary "Created GitHub Release draft ${TAG} with tarball, checksum, and manifest assets after npm publish." \
  --result passed \
  --json
