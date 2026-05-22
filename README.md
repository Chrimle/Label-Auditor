# Label Auditor

Reusable GitHub Action Workflow, for auditing Pull Request labels.

## Features

List of features...

### Check Required Labels are applied
> Will fail the check if the PR does not have at least one required label.

Configurable via `required-labels`, as a comma-separated list.

### Check Sub-set of Labels also have SemVer Labels applied
> Will fail the check if the PR has a label lacking the required corresponding SemVer-label.
>
> Example: `bug`-label requires a SemVer-label (`Major`/`Minor`/`Patch`).

Configurable via `semver-required-labels`, as a comma-separated list.

### Configure SemVer-labels
> Allows customization of the SemVer-labels.
> 
> **Default**: `MAJOR`, `MINOR` and `PATCH`.

Configurable via `semver-labels`, as a comma-separated list.
