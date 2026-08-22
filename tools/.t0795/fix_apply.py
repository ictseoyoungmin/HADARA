from pathlib import Path

p = Path('tools/.t0795/apply.py')
s = p.read_text()
marker = '# Adapt existing fixture to emit byte-bound evidence and new wording.\n'
idx = s.index(marker)
new_tail = r'''# Adapt the existing retained-publication fixture without rewriting the fake CLI.
tp=Path('tests/unit/manual-publish-script.test.ts'); t=tp.read_text()
t=t.replace("Verified prior npm publication report","Verified canonical npm publication evidence")
t=t.replace("    expect(script).toContain('git push \\\"${GIT_REMOTE_URL}\\\" \\\"${TAG}\\\"');\n","    expect(script).toContain('git push \\\"${GIT_REMOTE_URL}\\\" \\\"${tag}\\\"');\n")
t=t.replace("    expect(script).toContain('operator-publication:github:${TASK_ID}:${VERSION}');\n","    expect(script).toContain('operator-publication:github:${TASK_ID}:${VERSION}');\n    expect(script).toContain('verify-recovery-evidence.mjs');\n    expect(script).toContain('verify_or_create_release_tag()');\n")

env_anchor="    const env = { ...process.env, PATH: `${bin}:${process.env.PATH ?? ''}`, DEV_SURFACE_LOG: devSurfaceLog, EVIDENCE_LOG: evidenceLog, FAKE_NPM_LOG: npmLog, FAKE_GH_LOG: ghLog };\n"
binder=r'''    const bindCanonicalNpmEvidence = (fixtureRoot: string, reportPath: string) => {
      const taskDir = path.join(fixtureRoot, 'tasks', 'T-0785-fixture');
      const commandLogDir = path.join(taskDir, 'artifacts', 'command-log');
      fs.mkdirSync(commandLogDir, { recursive: true });
      const boundReport = path.join(commandLogDir, path.basename(reportPath));
      const bytes = fs.readFileSync(reportPath);
      fs.writeFileSync(boundReport, bytes);
      const relative = path.relative(taskDir, boundReport).split(path.sep).join('/');
      const evidence = {
        schemaVersion: 'hadara.evidence.v2',
        id: `ev:T-0785:${crypto.randomUUID()}`,
        taskId: 'T-0785',
        visibility: 'public',
        outcome: 'passed',
        idempotencyKey: 'operator-publication:npm:T-0785:0.5.0-rc.6',
        artifacts: [{
          path: relative,
          sha256: `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`,
          byteLength: bytes.length,
        }],
      };
      fs.appendFileSync(path.join(taskDir, 'evidence.jsonl'), `${JSON.stringify(evidence)}\n`);
      return boundReport;
    };
'''
t=one(t,env_anchor,env_anchor+binder,'canonical binder')

npm_anchor="    expect(fs.existsSync(npmOnlyReportPath)).toBe(true);\n"
npm_insert=npm_anchor+"    bindCanonicalNpmEvidence(npmOnlyRoot, npmOnlyReportPath);\n"
t=one(t,npm_anchor,npm_insert,'npm-only bind')

before_recovery="    const npmOnlyLogBeforeRecovery = fs.readFileSync(npmOnlyLog, 'utf8');\n    const npmOnlyRecovery = spawnSync('bash', [scriptPath, 'T-0785', '--github-repo', 'ictseoyoungmin/HADARA', '--git-remote-url', remote, '--retained-artifact-dir', npmOnlyRetained, '--github-only'], {\n"
checks=r'''    const npmOnlyLogBeforeRecovery = fs.readFileSync(npmOnlyLog, 'utf8');
    const sourceReportBytes = fs.readFileSync(npmOnlyReportPath);
    fs.writeFileSync(npmOnlyReportPath, Buffer.from(`${sourceReportBytes.toString('utf8').trim()}\n `));
    const tamperedConvenience = spawnSync('bash', [scriptPath, 'T-0785', '--github-repo', 'ictseoyoungmin/HADARA', '--git-remote-url', remote, '--retained-artifact-dir', npmOnlyRetained, '--github-only'], {
      cwd: npmOnlyRoot,
      env: npmOnlyEnv,
      input: 'github-draft\n',
      encoding: 'utf8'
    });
    expect(tamperedConvenience.status).not.toBe(0);
    expect(tamperedConvenience.stdout + tamperedConvenience.stderr).toContain('convenience npm publication report differs from canonical byte-bound evidence');
    fs.writeFileSync(npmOnlyReportPath, sourceReportBytes);

    const originalManifestBytes = fs.readFileSync(path.join(npmOnlyRetained, 'hadara-0.5.0-rc.6.tgz.manifest.json'));
    const originalArtifactReportBytes = fs.readFileSync(path.join(npmOnlyRetained, 'release-artifact-report.json'));
    const mismatchedManifestPath = path.join(npmOnlyRetained, 'hadara-0.5.0-rc.6.tgz.manifest.json');
    const mismatchedManifest = { ...JSON.parse(originalManifestBytes.toString('utf8')), recoveryMismatch: true };
    fs.writeFileSync(mismatchedManifestPath, `${JSON.stringify(mismatchedManifest)}\n`);
    const mismatchedArtifactReport = JSON.parse(originalArtifactReportBytes.toString('utf8'));
    const manifestArtifact = mismatchedArtifactReport.artifacts.find((artifact: { kind: string }) => artifact.kind === 'manifest');
    manifestArtifact.hash = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(mismatchedManifestPath)).digest('hex')}`;
    manifestArtifact.byteLength = fs.statSync(mismatchedManifestPath).size;
    fs.writeFileSync(path.join(npmOnlyRetained, 'release-artifact-report.json'), `${JSON.stringify(mismatchedArtifactReport)}\n`);
    const mismatchedBytes = spawnSync('bash', [scriptPath, 'T-0785', '--github-repo', 'ictseoyoungmin/HADARA', '--git-remote-url', remote, '--retained-artifact-dir', npmOnlyRetained, '--github-only'], {
      cwd: npmOnlyRoot,
      env: npmOnlyEnv,
      input: 'github-draft\n',
      encoding: 'utf8'
    });
    expect(mismatchedBytes.status).not.toBe(0);
    expect(mismatchedBytes.stdout + mismatchedBytes.stderr).toContain('does not match retained bytes');
    fs.writeFileSync(mismatchedManifestPath, originalManifestBytes);
    fs.writeFileSync(path.join(npmOnlyRetained, 'release-artifact-report.json'), originalArtifactReportBytes);

    execFileSync('git', ['tag', '-a', 'v0.5.0-rc.6', '-m', 'wrong fixture tag'], { cwd: npmOnlyRoot });
    const wrongTagRecovery = spawnSync('bash', [scriptPath, 'T-0785', '--github-repo', 'ictseoyoungmin/HADARA', '--git-remote-url', remote, '--retained-artifact-dir', npmOnlyRetained, '--github-only'], {
      cwd: npmOnlyRoot,
      env: npmOnlyEnv,
      input: 'github-draft\n',
      encoding: 'utf8'
    });
    expect(wrongTagRecovery.status).not.toBe(0);
    expect(wrongTagRecovery.stdout + wrongTagRecovery.stderr).toContain('expected artifact source commit');
    execFileSync('git', ['tag', '-d', 'v0.5.0-rc.6'], { cwd: npmOnlyRoot, stdio: 'ignore' });

    const npmOnlyRecovery = spawnSync('bash', [scriptPath, 'T-0785', '--github-repo', 'ictseoyoungmin/HADARA', '--git-remote-url', remote, '--retained-artifact-dir', npmOnlyRetained, '--github-only'], {
'''
t=one(t,before_recovery,checks,'recovery hardening checks')

failure_old="    expect(fs.existsSync(path.join(failureRoot, 'tasks', 'T-0785-fixture', 'artifacts', 'operator-publication', '0.5.0-rc.6-npm-publication-report.json'))).toBe(true);\n"
failure_new="    const failureNpmReportPath = path.join(failureRoot, 'tasks', 'T-0785-fixture', 'artifacts', 'operator-publication', '0.5.0-rc.6-npm-publication-report.json');\n    expect(fs.existsSync(failureNpmReportPath)).toBe(true);\n    bindCanonicalNpmEvidence(failureRoot, failureNpmReportPath);\n"
t=one(t,failure_old,failure_new,'failure bind')

tp.write_text(t)
print('patched')
'''
p.write_text(s[:idx] + new_tail)
print('apply.py simplified and hardened')
