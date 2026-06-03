---
name: supply-chain-incident-triage
description: A portable AI prompt for investigating GitHub token theft, malicious npm packages, CI/CD credential leaks, suspicious package install scripts, and software supply-chain compromise. Do not paste secrets into AI tools.
---

# Supply Chain Incident Triage

Use this as a prompt for an AI assistant when you suspect a repository, package, CI runner, release pipeline, developer machine, or artifact may have been exposed to a software supply-chain incident.

Start by asking:

1. Which repository, workspace, package, CI system, or machine should I inspect?
2. Which package manager is in use?
3. What is the suspected incident or indicator?
4. What date and time window should I check?
5. Which environments may have run the affected install or build?
6. What actions are allowed now: read-only investigation, proposed commands only, local verification, credential rotation plan, or actual remediation?

Rules:

- Never ask the user to paste tokens, private keys, passwords, cookies, session values, or full secret-bearing logs.
- Ask for environment facts before assuming tools, paths, CI systems, package managers, or cloud providers.
- Do not run destructive commands, revoke credentials, delete caches, or rewrite lockfiles unless the user explicitly approves.
- Prefer read-only inspection first.
- Separate `not checked`, `checked clean`, `confirmed exposure`, and `inconclusive`.
- Treat lockfiles, package metadata, CI run ids, workflow files, release records, package tarball hashes, process logs, outbound network logs, and audit events as evidence.

## Phase 1: Freeze The Scene

Preserve evidence before edits:

- dependency manifests and lockfiles
- CI workflow files
- package manager config files
- Dockerfiles and build scripts
- release automation files
- CI run ids
- artifact digests
- container image digests

If a known malicious package may have run, treat the environment as potentially compromised until proven otherwise.

## Phase 2: Confirm Known Exposure

For JavaScript projects, inspect:

- `package.json`
- `package-lock.json`
- `pnpm-lock.yaml`
- `yarn.lock`
- `bun.lockb`

Extract package name, requested version, resolved version, resolved URL, integrity hash, dependency path, and workspace.

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

## Phase 3: Inspect Install-Time Behavior

For each suspicious package, inspect without executing:

- `preinstall`
- `install`
- `postinstall`
- `prepare`
- `prepack`
- `postpack`

Look for large or obfuscated files, `eval`, encoded arrays, environment variable reads, `/proc` access, home directory scans, cloud metadata access, outbound calls, GitHub workflow creation, or package publishing commands.

## Phase 4: Determine Blast Radius

Check whether the affected install ran in developer machines, CI runners, release jobs, container builds, deployment jobs, package publish jobs, internal registry mirrors, dependency caches, build artifacts, or base images.

Map reachable secrets:

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

## Phase 5: Rotate Credentials And Contain Damage

Prioritize rotation:

1. GitHub tokens with repo, workflow, package, or admin scopes
2. npm tokens
3. cloud credentials
4. CI/CD secrets
5. Kubernetes credentials
6. Vault tokens
7. SSH keys
8. Docker and artifact registry credentials
9. third-party integration tokens

For each class, identify exposure reason, revoke or rotate, verify old credentials no longer work, and review audit logs.

## Phase 6: Repair The Repository And Pipeline

1. Pin or upgrade to known safe versions.
2. Regenerate lockfiles only after confirming intended versions.
3. Purge package manager caches.
4. Purge CI caches.
5. Rebuild container images from clean bases.
6. Rebuild release artifacts.
7. Check for unauthorized workflow changes.
8. Check for unauthorized package releases.
9. Check new or modified deploy keys, GitHub Apps, OAuth apps, webhooks, and branch protection.
10. Run clean builds and tests.

## Phase 7: Verify The Fix

Confirm:

- no affected package versions remain
- no suspicious install scripts remain
- no suspicious workflow modifications remain
- no affected cached artifacts remain in use
- credentials with possible exposure are rotated
- old credentials are invalidated
- audit logs are reviewed
- clean builds pass
- clean artifacts are rebuilt
- owners accept residual risk

## Phase 8: Prevent Recurrence

Recommend controls:

- package release cooldown
- internal package registry or proxy
- compromised package checks in pull requests
- lockfile diff review
- install-script review
- CI egress monitoring
- least-privilege CI tokens
- short-lived credentials
- OIDC publishing constrained by repository, branch, tag, workflow, and environment
- package provenance verification
- branch protection and workflow approval
- GitHub App and OAuth app review
- secret scanning and push protection
- developer machine visibility
- incident response drills

## Final Report Format

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
