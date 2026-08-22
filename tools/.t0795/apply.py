from pathlib import Path

def one(text, old, new, label):
    n=text.count(old)
    if n != 1: raise SystemExit(f'{label}: expected 1 match, got {n}')
    return text.replace(old,new,1)

p=Path('scripts/release/manual-publish-rc.sh'); s=p.read_text()
s=one(s,'OPERATOR_COMMIT=""\nREINVOKE_ARGS=()\n','OPERATOR_COMMIT=""\nEXPECTED_TAG_COMMIT=""\nPARTIAL_NPM_BOUND_REPORT=""\nPARTIAL_NPM_EVIDENCE_ID=""\nREINVOKE_ARGS=()\n','globals')
s=one(s,'--github-only     Resume a prior run whose npm publication report exists; verify retained\n                  artifact bytes and source lineage, then create only the GitHub Release draft.\n','--github-only     Resume from canonical byte-bound npm publication evidence; verify exact\n                  retained artifact bytes/source lineage, then create only the GitHub Release draft.\n','help')

needle='ensure_gh_auth() {'
tagfn=r'''verify_or_create_release_tag() {
local tag="$1" expected="$2" local_target="" remote_lines remote_direct remote_peeled remote_target
[[ -n "${expected}" ]] || { echo "Expected release tag commit is missing."; exit 1; }
if git rev-parse -q --verify "refs/tags/${tag}" >/dev/null; then
  local_target="$(git rev-list -n 1 "${tag}")"
  [[ "${local_target}" == "${expected}" ]] || { echo "Local release tag ${tag} points to ${local_target}, expected artifact source commit ${expected}."; exit 1; }
fi
remote_lines="$(git ls-remote "${GIT_REMOTE_URL}" "refs/tags/${tag}" "refs/tags/${tag}^{}" || true)"
remote_direct="$(printf '%s\n' "${remote_lines}" | awk -v ref="refs/tags/${tag}" '$2 == ref { print $1; exit }')"
remote_peeled="$(printf '%s\n' "${remote_lines}" | awk -v ref="refs/tags/${tag}^{}" '$2 == ref { print $1; exit }')"
remote_target="${remote_peeled:-${remote_direct}}"
[[ -z "${remote_target}" || "${remote_target}" == "${expected}" ]] || { echo "Remote release tag ${tag} on ${GIT_REMOTE_URL} points to ${remote_target}, expected artifact source commit ${expected}."; exit 1; }
if [[ -z "${local_target}" ]]; then git tag -a "${tag}" "${expected}" -m "HADARA ${VERSION}"; fi
if [[ -z "${remote_target}" ]]; then
  git push "${GIT_REMOTE_URL}" "${tag}"
  remote_lines="$(git ls-remote "${GIT_REMOTE_URL}" "refs/tags/${tag}" "refs/tags/${tag}^{}" || true)"
  remote_direct="$(printf '%s\n' "${remote_lines}" | awk -v ref="refs/tags/${tag}" '$2 == ref { print $1; exit }')"
  remote_peeled="$(printf '%s\n' "${remote_lines}" | awk -v ref="refs/tags/${tag}^{}" '$2 == ref { print $1; exit }')"
  remote_target="${remote_peeled:-${remote_direct}}"
  [[ "${remote_target}" == "${expected}" ]] || { echo "Pushed release tag ${tag} does not resolve to expected artifact source commit ${expected}."; exit 1; }
fi
}

ensure_gh_auth() {'''
s=one(s,needle,tagfn,'tag helper')

start=s.index('load_partial_npm_publication() {'); end=s.index('\ncreate_github_release_draft() {',start)
newload=r'''load_partial_npm_publication() {
[[ -n "${RETAINED_ARTIFACT_DIR}" ]] || { echo "--github-only requires --retained-artifact-dir."; exit 1; }
RETAINED_ARTIFACT_DIR="$(cd "${RETAINED_ARTIFACT_DIR}" && pwd)"
if [[ -z "${RETAINED_ARTIFACT_REPORT}" ]]; then RETAINED_ARTIFACT_REPORT="${RETAINED_ARTIFACT_DIR}/release-artifact-report.json"; fi
TARBALL="${RETAINED_ARTIFACT_DIR}/${PACKAGE_NAME}-${VERSION}.tgz"
CHECKSUM_FILE="${TARBALL}.sha256"; MANIFEST_FILE="${TARBALL}.manifest.json"
LINEAGE="$(read_artifact_lineage "${RETAINED_ARTIFACT_REPORT}" "${TARBALL}" "${CHECKSUM_FILE}" "${MANIFEST_FILE}")"
IFS=$'\t' read -r ARTIFACT_SOURCE_COMMIT ARTIFACT_RELEASE_INPUT_HASH <<< "${LINEAGE}"
EXPECTED_TAG_COMMIT="${ARTIFACT_SOURCE_COMMIT}"
verify_checksum "${CHECKSUM_FILE}"; verify_tarball_package_metadata "${TARBALL}" "${PACKAGE_NAME}" "${VERSION}"
RECOVERY_LINE="$(node scripts/release/verify-recovery-evidence.mjs resolve-npm "${TASK_CAPSULE_DIR}/evidence.jsonl" "${TASK_CAPSULE_DIR}" "operator-publication:npm:${TASK_ID}:${VERSION}" "${PARTIAL_NPM_REPORT}" "${TARBALL}" "${CHECKSUM_FILE}" "${MANIFEST_FILE}" "${TASK_ID}" "${PACKAGE_NAME}" "${VERSION}" "${ARTIFACT_SOURCE_COMMIT}" "${ARTIFACT_RELEASE_INPUT_HASH}" "${GITHUB_REPO}" "${GIT_REMOTE_URL}")"
IFS=$'\t' read -r PARTIAL_NPM_BOUND_REPORT PARTIAL_NPM_EVIDENCE_ID PUBLISHED_VERSION PRIOR_REGISTRY PRIOR_NPM_TAG DIST_TAGS_BEFORE_JSON DIST_TAGS_AFTER_JSON <<< "${RECOVERY_LINE}"
if [[ "${REGISTRY_EXPLICIT}" == "true" && "${REGISTRY}" != "${PRIOR_REGISTRY}" ]]; then echo "Refusing GitHub-only resume: prior npm registry ${PRIOR_REGISTRY} differs from requested ${REGISTRY}."; exit 1; fi
if [[ "${NPM_TAG_EXPLICIT}" == "true" && "${NPM_TAG}" != "${PRIOR_NPM_TAG}" ]]; then echo "Refusing GitHub-only resume: prior npm dist-tag ${PRIOR_NPM_TAG} differs from requested ${NPM_TAG}."; exit 1; fi
REGISTRY="${PRIOR_REGISTRY}"; NPM_TAG="${PRIOR_NPM_TAG}"
set +e; OBSERVED_NPM_VERSION="$(npm view "${PACKAGE_NAME}@${VERSION}" version --registry="${REGISTRY}" 2>/dev/null)"; NPM_VIEW_STATUS=$?; set -e
[[ "${NPM_VIEW_STATUS}" -eq 0 && "${OBSERVED_NPM_VERSION}" == "${VERSION}" ]] || { echo "The prior npm publication cannot be verified."; exit 1; }
OPERATOR_COMMIT="$(git rev-parse HEAD)"
echo "Verified canonical npm publication evidence: ${PARTIAL_NPM_EVIDENCE_ID} -> ${PARTIAL_NPM_BOUND_REPORT}"
echo "Verified retained artifact bytes match the npm publication report."
}'''
s=s[:start]+newload+s[end:]

oldtag='''if git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null; then
echo "Git tag already exists locally: ${TAG}"
else
git tag -a "${TAG}" -m "HADARA ${VERSION}"
fi

REMOTE_TAG="$(git ls-remote "${GIT_REMOTE_URL}" "refs/tags/${TAG}" || true)"
if [[ -n "${REMOTE_TAG}" ]]; then
echo "Git tag already exists on configured remote ${GIT_REMOTE_URL}: ${TAG}"
else
git push "${GIT_REMOTE_URL}" "${TAG}"
fi
'''
s=one(s,oldtag,'verify_or_create_release_tag "${TAG}" "${EXPECTED_TAG_COMMIT}"\n','tag call')

oldpre='''GIT_STATUS="$(git status --porcelain)"
PARTIAL_NPM_REPORT="${TASK_CAPSULE_DIR}/artifacts/operator-publication/${VERSION}-npm-publication-report.json"
if [[ "${GITHUB_ONLY}" == "true" && ! -f "${PARTIAL_NPM_REPORT}" ]]; then
echo "GitHub-only resume requires the prior npm publication report: ${PARTIAL_NPM_REPORT}"
exit 1
fi
if [[ "${GITHUB_ONLY}" != "true" && "${MODE}" == "execute" && -f "${PARTIAL_NPM_REPORT}" ]]; then
echo "A prior npm publication report exists: ${PARTIAL_NPM_REPORT}"
echo "Resume the GitHub mutation without republishing npm:"
echo "  bash scripts/release/manual-publish-rc.sh ${TASK_ID} --github-only --retained-artifact-dir <retained-artifact-dir> --github-repo ${GITHUB_REPO} --git-remote-url ${GIT_REMOTE_URL}"
exit 1
fi
'''
newpre='''GIT_STATUS="$(git status --porcelain)"
PARTIAL_NPM_REPORT="${TASK_CAPSULE_DIR}/artifacts/operator-publication/${VERSION}-npm-publication-report.json"
if [[ "${GITHUB_ONLY}" != "true" && "${MODE}" == "execute" && -f "${PARTIAL_NPM_REPORT}" ]]; then
  echo "A prior npm publication report exists; use --github-only instead of republishing npm."; exit 1
fi
'''
s=one(s,oldpre,newpre,'preflight')
oldbranch='''if [[ "${GITHUB_ONLY}" == "true" ]]; then
if [[ -n "${GIT_STATUS}" ]] && ! dirty_paths_are_release_outputs_only "${GIT_STATUS}"; then
echo "Git worktree contains changes outside the retained publication evidence and cannot be resumed safely."
echo "${GIT_STATUS}"
exit 1
fi
load_partial_npm_publication
create_github_release_draft
exit 0
fi
'''
newbranch='''if [[ "${GITHUB_ONLY}" == "true" ]]; then
if [[ -n "${GIT_STATUS}" ]] && ! dirty_paths_are_release_outputs_only "${GIT_STATUS}"; then echo "Git worktree contains unsafe changes."; echo "${GIT_STATUS}"; exit 1; fi
node scripts/release/verify-recovery-evidence.mjs assert-github-absent "${TASK_CAPSULE_DIR}/evidence.jsonl" "operator-publication:github:${TASK_ID}:${VERSION}"
load_partial_npm_publication
create_github_release_draft
exit 0
fi
'''
s=one(s,oldbranch,newbranch,'github-only branch')
s=one(s,"IFS=$'\\t' read -r ARTIFACT_SOURCE_COMMIT ARTIFACT_RELEASE_INPUT_HASH <<< \"${LINEAGE}\"\necho \"Retained artifact directory: ${RETAINED_ARTIFACT_DIR}\"\n","IFS=$'\\t' read -r ARTIFACT_SOURCE_COMMIT ARTIFACT_RELEASE_INPUT_HASH <<< \"${LINEAGE}\"\nEXPECTED_TAG_COMMIT=\"${ARTIFACT_SOURCE_COMMIT}\"\necho \"Retained artifact directory: ${RETAINED_ARTIFACT_DIR}\"\n",'retained tag')
s=one(s,"IFS=$'\\t' read -r ARTIFACT_SOURCE_COMMIT ARTIFACT_RELEASE_INPUT_HASH <<< \"${LINEAGE}\"\necho \"Generated tarball: ${TARBALL}\"\n","IFS=$'\\t' read -r ARTIFACT_SOURCE_COMMIT ARTIFACT_RELEASE_INPUT_HASH <<< \"${LINEAGE}\"\nEXPECTED_TAG_COMMIT=\"${ARTIFACT_SOURCE_COMMIT}\"\necho \"Generated tarball: ${TARBALL}\"\n",'generated tag')
p.write_text(s)

# Adapt existing fixture to emit byte-bound evidence and new wording.
tp=Path('tests/unit/manual-publish-script.test.ts'); t=tp.read_text()
t=t.replace("Verified prior npm publication report","Verified canonical npm publication evidence")
t=t.replace("    expect(script).toContain('operator-publication:github:${TASK_ID}:${VERSION}');\n","    expect(script).toContain('operator-publication:github:${TASK_ID}:${VERSION}');\n    expect(script).toContain('verify-recovery-evidence.mjs');\n    expect(script).toContain('verify_or_create_release_tag()');\n")
old="    fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), `const fs = require('node:fs');\\nif (process.argv[2] === 'version') console.log('0.5.0-rc.6');\\nif (process.argv[2] === 'evidence' && process.env.EVIDENCE_LOG) fs.appendFileSync(process.env.EVIDENCE_LOG, JSON.stringify(process.argv.slice(2)) + '\\\\n');\\n`);\n"
new="    fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), `const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');\\nif(process.argv[2]==='version')console.log('0.5.0-rc.6');\\nif(process.argv[2]==='evidence'&&process.argv[3]==='add-command'){const a=process.argv.slice(4),v=f=>{const i=a.indexOf(f);return i<0?undefined:a[i+1]},task=v('--task'),src=v('--artifact-file'),key=v('--idempotency-key');if(process.env.EVIDENCE_LOG)fs.appendFileSync(process.env.EVIDENCE_LOG,JSON.stringify(process.argv.slice(2))+'\\\\n');if(task&&src&&key){const td=path.join('tasks',fs.readdirSync('tasks').find(n=>n.startsWith(task+'-'))),dir=path.join(td,'artifacts','command-log');fs.mkdirSync(dir,{recursive:true});const dst=path.join(dir,path.basename(src)),b=fs.readFileSync(src);fs.writeFileSync(dst,b);const rel=path.relative(td,dst).split(path.sep).join('/'),sha='sha256:'+crypto.createHash('sha256').update(b).digest('hex'),r={schemaVersion:'hadara.evidence.v2',id:'ev:'+task+':fixture',taskId:task,visibility:'public',outcome:'passed',idempotencyKey:key,artifacts:[{path:rel,sha256:sha,byteLength:b.length}]};fs.appendFileSync(path.join(td,'evidence.jsonl'),JSON.stringify(r)+'\\\\n')}}}\\n`);\n"
if old not in t: raise SystemExit('fixture cli needle missing')
t=t.replace(old,new,1); tp.write_text(t)
print('patched')
