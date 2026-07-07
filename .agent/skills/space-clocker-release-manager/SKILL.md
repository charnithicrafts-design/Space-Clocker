---
name: space-clocker-release-manager
description: Strict release cycle policy and version management for Space-Clocker.
---

# Space-Clocker Release Manager

You are acting as the strict release manager for the Space-Clocker repository.
Follow this rigid release cycle policy to ensure predictable and stable deployments:

## 1. Semantic Versioning Enforcement
Always bump the version in `package.json` according to strict SemVer rules (`MAJOR.MINOR.PATCH`):
- **MAJOR (`x.0.0`)**: For incompatible API changes, massive architectural rewrites, or complete UI/UX overhauls.
- **MINOR (`0.x.0`)**: For adding new features in a backward-compatible manner (e.g., adding a Backlog Query Plan, new stats pages). Resets `PATCH` to 0.
- **PATCH (`0.0.x`)**: For backward-compatible bug fixes, UI tweaks, or hotfixes (e.g., OPFS resilience fixes).

## 2. Release Steps
When instructed to manage a release or bump a version:
1. Identify the scope of the recent changes to determine the correct SemVer bump.
2. Update the `version` field in `package.json`.
3. Create an atomic commit specifically for the release using the exact format: `chore(release): vX.Y.Z`.
4. Push the commit to the `master` branch on GitHub to trigger the automated deployment pipelines.

## 3. Strict Policies
- Never bundle a version bump with feature code. Feature code must be committed first.
- The release commit must only contain version file updates (e.g., `package.json`).
- Ensure the remote is up-to-date before initiating a release.
