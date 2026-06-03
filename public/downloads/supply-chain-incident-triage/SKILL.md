---
name: supply-chain-incident-triage
description: Use when investigating possible exposure to GitHub token theft, malicious npm packages, CI/CD credential leaks, suspicious package install scripts, or software supply-chain compromise. Guides an AI agent through user scoping, evidence collection, exposure verification, blast-radius analysis, credential rotation, remediation, prevention, and reporting. Never ask the user to paste secrets.
---

# Supply Chain Incident Triage

Use this skill when the user suspects a repository, package, CI runner, release pipeline, developer machine, or artifact may have been exposed to a software supply-chain incident.

The goal is not to guess whether the user is safe. The goal is to build an evidence trail, identify exposure, reduce risk quickly, and leave the system harder to compromise next time.

## Operating Rules

- Never ask the user to paste tokens, private keys, passwords, cookies, session values, or full secret-bearing logs.
- Ask for environment facts before assuming tools, paths, CI systems, package managers, or cloud providers.
- Do not run destructive commands, revoke credentials, delete caches, or rewrite lockfiles unless the user explicitly approves.
- Prefer read-only inspection first. Mark every unverified conclusion as `unverified`.
- Separate four states clearly: `not checked`, `checked clean`, `confirmed exposure`, and `inconclusive`.
- Treat lockfiles, package metadata, CI run ids, workflow files, release records, package tarball hashes, process logs, outbound network logs, and audit events as evidence.
- If a host executed a confirmed malicious install script, assume credentials reachable from that process may be compromised until rotation evidence says otherwise.
- When using AI to summarize logs or code, redact secrets first and preserve enough surrounding context for verification.

## Start Here: Questions To Ask First

Ask these questions before inspecting or changing anything. Keep them short and adapt to the user's answers.

1. Which repository, workspace, package, CI system, or machine should I inspect?
2. Which package manager is in use: npm, pnpm, yarn, bun, pip, cargo, go, maven, gradle, or another tool?
3. What is the suspected incident or indicator: package name, version, advisory link, strange install script, leaked token, CI anomaly, or suspicious commit?
4. What date and time window should I check?
5. Which environments may have run the affected install or build: local dev machine, CI, release job, container build, staging, or production?
6. What actions are allowed now: read-only investigation, proposed commands only, local verification, credential rotation plan, or actual remediation?

If the user cannot answer, proceed with a conservative read-only inventory and clearly label the scope as incomplete.

## Phase 1: Freeze The Scene

Objective: prevent new exposure while preserving evidence.

Recommended actions:

1. Ask whether the user wants to pause automatic dependency update jobs and release pipelines for the affected scope.
2. Preserve copies of relevant files before editing:
   - `package.json`
   - `package-lock.json`
   - `pnpm-lock.yaml`
   - `yarn.lock`
   - `bun.lockb`
   - CI workflow files
   - package manager config files
   - Dockerfiles and build scripts
   - release automation files
3. Record identifiers:
   - repo and branch
   - commit SHA
   - CI run id
   - runner image
   - install command
   - package registry URL
   - artifact digest
   - container image digest
4. If a known malicious package may have run, advise the user to treat the environment as potentially compromised and prioritize credential rotation planning.

Output:

```markdown
## Incident Scope

- Repository:
- Package manager:
- Suspected indicator:
- Time window:
- Environments:
- Allowed actions:
- Evidence preserved:
- Scope gaps:
```

## Phase 2: Confirm Known Exposure

Objective: determine whether the repository or environment actually used an affected package, version, artifact, or workflow.

For JavaScript and TypeScript projects:

1. Search dependency manifests:
   - `package.json`
   - workspace manifests
   - `package-lock.json`
   - `pnpm-lock.yaml`
   - `yarn.lock`
   - `bun.lockb`
2. Extract for each hit:
   - package name
   - requested version
   - resolved version
   - resolved URL
   - integrity hash
   - dependency path
   - workspace or package that pulled it in
3. Compare against official advisories, maintainer disclosures, package registry metadata, or trusted incident reports.
4. Do not rely only on direct dependencies. Transitive dependencies can trigger install scripts.

Known Red Hat npm incident indicators from public disclosures on June 1, 2026:

```text
@redhat-cloud-services/chrome: 2.3.1, 2.3.2, 2.3.4
@redhat-cloud-services/compliance-client: 4.0.3, 4.0.4, 4.0.6
@redhat-cloud-services/config-manager-client: 5.0.4, 5.0.5, 5.0.7
@redhat-cloud-services/entitlements-client: 4.0.11, 4.0.12, 4.0.14
@redhat-cloud-services/eslint-config-redhat-cloud-services: 3.2.1, 3.2.2, 3.2.4
@redhat-cloud-services/frontend-components: 7.7.2, 7.7.3, 7.7.5
@redhat-cloud-services/frontend-components-advisor-components: 3.8.2, 3.8.4, 3.8.6
@redhat-cloud-services/frontend-components-config: 6.11.3, 6.11.4, 6.11.6
@redhat-cloud-services/frontend-components-config-utilities: 4.11.2, 4.11.3, 4.11.5
@redhat-cloud-services/frontend-components-notifications: 6.9.2, 6.9.3, 6.9.5
@redhat-cloud-services/frontend-components-remediations: 4.9.2, 4.9.3, 4.9.5
@redhat-cloud-services/frontend-components-testing: 1.2.1, 1.2.2, 1.2.4
@redhat-cloud-services/frontend-components-translations: 4.4.1, 4.4.2, 4.4.4
@redhat-cloud-services/frontend-components-utilities: 7.4.1, 7.4.2, 7.4.4
@redhat-cloud-services/hcc-feo-mcp: 0.3.1, 0.3.2, 0.3.4
@redhat-cloud-services/hcc-kessel-mcp: 0.3.1, 0.3.2, 0.3.4
@redhat-cloud-services/hcc-pf-mcp: 0.6.1, 0.6.2, 0.6.4
@redhat-cloud-services/host-inventory-client: 5.0.3, 5.0.4, 5.0.6
@redhat-cloud-services/insights-client: 4.0.4, 4.0.5, 4.0.7
@redhat-cloud-services/integrations-client: 6.0.4, 6.0.5, 6.0.7
@redhat-cloud-services/javascript-clients-shared: 2.0.8, 2.0.9, 2.0.11
@redhat-cloud-services/notifications-client: 6.1.4, 6.1.5, 6.1.7
@redhat-cloud-services/patch-client: 4.0.4, 4.0.5, 4.0.7
@redhat-cloud-services/quickstarts-client: 4.0.11, 4.0.12, 4.0.14
@redhat-cloud-services/rbac-client: 9.0.3, 9.0.4, 9.0.6
@redhat-cloud-services/remediations-client: 4.0.4, 4.0.5, 4.0.7
@redhat-cloud-services/rule-components: 4.7.2, 4.7.3, 4.7.5
@redhat-cloud-services/sources-client: 3.0.10, 3.0.11, 3.0.13
@redhat-cloud-services/topological-inventory-client: 3.0.10, 3.0.11, 3.0.13
@redhat-cloud-services/tsc-transform-imports: 1.2.2, 1.2.4, 1.2.6
@redhat-cloud-services/types: 3.6.1, 3.6.2, 3.6.4
@redhat-cloud-services/vulnerabilities-client: 2.1.9, 2.1.11
```

Output:

```markdown
## Exposure Table

| Package | Version | Source File | Direct/Transitive | Environment | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
```

## Phase 3: Inspect Install-Time Behavior

Objective: understand what would execute during dependency installation without running suspicious code.

For each suspicious package:

1. Inspect package metadata without executing scripts.
2. Review `scripts` entries:
   - `preinstall`
   - `install`
   - `postinstall`
   - `prepare`
   - `prepack`
   - `postpack`
3. Look for suspicious indicators:
   - unusually large root `index.js`
   - obfuscated JavaScript
   - `eval`, `Function`, encoded arrays, base64 blobs, ROT or Caesar style transforms
   - silent `try/catch`
   - filesystem traversal
   - environment variable reads
   - access to `/proc`, home directories, `.ssh`, `.npmrc`, `.pypirc`, `.netrc`, cloud config directories, kube config, Docker config, or wallet files
   - calls to cloud metadata endpoints
   - outbound network calls during install
   - creation or modification of GitHub workflow files
   - commands that publish packages or alter package metadata
4. Summarize behavior in plain language and cite file paths.

Never execute suspicious package scripts unless the user provides an isolated sandbox and explicitly approves dynamic analysis.

Output:

```markdown
## Install-Time Behavior

- Package:
- Script entry:
- Suspicious files:
- Possible data accessed:
- Possible network destinations:
- Confidence:
- Evidence:
```

## Phase 4: Determine Blast Radius

Objective: identify every place where the suspicious code could have executed and what secrets it could reach.

Check:

1. developer machines that ran install commands
2. CI runners
3. release jobs
4. container image builds
5. deployment jobs
6. package publish jobs
7. internal registry mirrors
8. dependency caches
9. build artifacts and base images

For each environment, map reachable secrets:

- GitHub token
- npm token
- cloud credentials
- Kubernetes config or service account
- Vault token
- SSH private key
- Docker registry credential
- package registry token
- CI/CD secrets
- deployment credentials

Output:

```markdown
## Blast Radius

| Environment | Ran Affected Install | Reachable Secrets | Artifact Risk | Evidence | Priority |
| --- | --- | --- | --- | --- | --- |
```

## Phase 5: Rotate Credentials And Contain Damage

Objective: remove attacker access that may have been obtained from the affected environment.

Prioritize rotation by exposure and privilege:

1. GitHub tokens with repo, workflow, package, or admin scopes
2. npm tokens, especially publish tokens
3. cloud credentials for AWS, GCP, Azure, or other providers
4. CI/CD secrets
5. Kubernetes credentials and service accounts
6. Vault tokens
7. SSH keys
8. Docker and artifact registry credentials
9. third-party integration tokens

For each credential class:

1. identify where it was available
2. revoke or rotate it
3. verify the old credential no longer works
4. search audit logs for use after suspected exposure
5. document owner and completion time

Output:

```markdown
## Rotation Plan

| Credential Class | Owner | Exposure Reason | Action | Verification | Status |
| --- | --- | --- | --- | --- | --- |
```

## Phase 6: Repair The Repository And Pipeline

Objective: remove malicious dependencies, rebuild clean artifacts, and prevent reintroduction.

Recommended actions:

1. Pin or upgrade to known safe versions.
2. Regenerate lockfiles only after confirming intended package versions.
3. Purge package manager caches if they may contain malicious tarballs.
4. Purge CI caches and dependency caches for affected jobs.
5. Rebuild container images from clean bases.
6. Rebuild release artifacts.
7. Check for unauthorized workflow changes.
8. Check for unauthorized package releases.
9. Check for new or modified deploy keys, GitHub Apps, OAuth apps, webhooks, and branch protection changes.
10. Run clean builds and tests.

Output:

```markdown
## Repair Checklist

- [ ] Safe package version selected
- [ ] Lockfile updated
- [ ] Package cache purged
- [ ] CI cache purged
- [ ] Clean image rebuilt
- [ ] Release artifact rebuilt
- [ ] Unauthorized workflow changes checked
- [ ] Token and app authorization checked
- [ ] Clean build verified
```

## Phase 7: Verify The Fix

Objective: prove that the incident response is complete enough to resume normal work.

Verification checklist:

1. no affected package versions remain in lockfiles
2. no suspicious install scripts remain
3. no suspicious workflow modifications remain
4. no affected cached artifacts remain in use
5. credentials with possible exposure are rotated
6. old credentials are invalidated
7. audit logs are reviewed for post-exposure use
8. clean builds pass
9. clean artifacts are deployed or staged
10. owners accept residual risk

Output:

```markdown
## Verification Summary

- Clean lockfile:
- Clean install:
- Clean build:
- Credentials rotated:
- Audit log reviewed:
- Residual risks:
- Recommendation:
```

## Phase 8: Prevent Recurrence

Objective: move from treatment to prevention.

Recommend controls based on the user's environment:

- package release cooldown before accepting newly published versions
- internal package registry or proxy with policy enforcement
- compromised package intelligence checks in pull requests
- lockfile diff review
- install-script review for dependency updates
- CI egress monitoring during dependency install
- least-privilege CI tokens
- short-lived credentials
- OIDC publishing constrained by repository, branch, tag, workflow, and environment
- package provenance verification where available
- branch protection and workflow approval rules
- GitHub App and OAuth app review
- secret scanning and push protection
- developer machine visibility for package installs
- incident response drills using read-only evidence collection

Output:

```markdown
## Prevention Backlog

| Control | Risk Reduced | Owner | Effort | Priority |
| --- | --- | --- | --- | --- |
```

## Final Report Format

Always finish with a short, evidence-backed report.

```markdown
# Supply Chain Incident Triage Report

## Verdict

One of:
- checked clean
- confirmed exposure
- inconclusive
- still investigating

## What Was Checked

## Evidence

## Confirmed Findings

## Unverified Concerns

## Actions Taken

## Actions Still Needed

## Prevention Recommendations

## Notes On Secrets

No full secret values were requested or included.
```
