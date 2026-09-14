# GitHub Actions VS Code Snippets

A curated collection of Visual Studio Code snippets that speed up writing GitHub Actions and workflow YAML files. These snippets provide ready-made templates, property options, and placeholders so you can create valid, consistent CI/CD configurations quickly.

## Contents

- `./.vscode/github-actions.code-snippets` — VS Code snippet definitions.

## Quick start

1. Copy (or symlink) `./.vscode/github-actions.code-snippets` into your project's `.vscode/` folder.
2. Reload VS Code (Command Palette → "Developer: Reload Window").
3. Open a `.yml` or `.yaml` file and start typing a snippet prefix (for example `gha-`) or press `Ctrl+Space` to view completions.

   Notes
   - Snippets are scoped for YAML. Ensure the current file language in VS Code is set to YAML if suggestions don't appear.
   - Recommended extensions (see `.vscode/extensions.json`): `ms-vscode.vscode-github-actions`, `redhat.vscode-yaml`.

## Available snippets

Use a snippet `prefix` in a YAML file, then tab through its placeholders. Workflow fragments include the indentation needed for the location named in their description.

### Workflows and triggers

- `gha-workflow` — Language-neutral workflow boilerplate.
- `gha-workflow-node-ci` — Node.js CI with dependency caching and concurrency.
- `gha-reusable-workflow` — Reusable workflow with a typed input and secret.
- `gha-reusable-workflow-output` — `workflow_call` output mapped from a job output.
- `gha-workflow-trigger-push-pr` — Push and pull-request branch/path filters under `on`.
- `gha-workflow-trigger-dispatch` — Manual trigger with a choice input under `on`.
- `gha-workflow-trigger-schedule` — Cron trigger with an IANA timezone under `on`.

### Workflow controls and jobs

- `gha-workflow-permissions` — Least-privilege job-level `GITHUB_TOKEN` permissions.
- `gha-workflow-permissions-oidc` — Job-level permissions for OIDC authentication.
- `gha-workflow-concurrency` — Workflow/ref concurrency group.
- `gha-workflow-defaults-run` — Default shell and working directory.
- `gha-workflow-job` — Job fragment for an existing `jobs` map.
- `gha-workflow-job-call` — Reusable-workflow caller.
- `gha-workflow-job-needs` — Dependent job.
- `gha-workflow-job-self-hosted` — Self-hosted job routed by OS and architecture labels.
- `gha-workflow-job-container` — Ubuntu job that runs inside a container.
- `gha-workflow-job-matrix-node` — Node.js operating-system/version matrix.
- `gha-workflow-jobs-output` — Producer and consumer jobs connected by an output.
- `gha-workflow-job-environment` — Deployment environment and concurrency.
- `gha-workflow-job-service` — Health-checked service container.

### Workflow steps

- `gha-workflow-job-step-run` — `run` step with condition, shell, working directory, and environment.
- `gha-workflow-job-step-uses` — Generic `uses` step.
- `gha-workflow-job-step-uses-pinned` — Action step pinned to an immutable commit SHA.
- `gha-workflow-step-checkout` — Repository checkout with explicit credential handling.
- `gha-workflow-step-setup-node` — Node.js setup with package-manager caching.
- `gha-workflow-step-cache` — Content-keyed dependency or build cache.
- `gha-workflow-step-upload-artifact` — Artifact upload.
- `gha-workflow-step-download-artifact` — Artifact download.
- `gha-workflow-step-output` — Set a step output with `$GITHUB_OUTPUT`.
- `gha-workflow-step-env` — Set an environment variable with `$GITHUB_ENV`.
- `gha-workflow-step-summary` — Append Markdown to `$GITHUB_STEP_SUMMARY`.

### Custom actions

- `gha-composite-action` — Composite action with a linked input and output.
- `gha-action-input` — Input declaration for an action metadata file.
- `gha-action-output` — Output declaration for a JavaScript or Docker action.
- `gha-composite-action-output` — Composite output mapped from a step output.
- `gha-composite-action-step-run` — Composite-action `run` step.
- `gha-composite-action-step-uses` — Composite-action `uses` step.
- `gha-docker-action` — Docker action with an input passed as an argument.
- `gha-node-action` — JavaScript action using the Node 24 runtime.
- `gha-node-action-hooks` — Conditional pre/post scripts for a JavaScript action.
- `gha-action-branding` — GitHub-supported Marketplace colors and icons.
- `gha-action-step-env` — Common GitHub contexts mapped to custom environment names.

## Example — create a CI workflow

1. Create `.github/workflows/ci.yml`.
2. In VS Code, open it, type `gha-workflow-node-ci`, accept the snippet, then fill placeholders.

   Snippet expansion example (illustrative):

   ```yaml
   name: Node.js CI

   on:
     push:
     pull_request:

   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: true

   jobs:
     test:
       runs-on: ubuntu-latest
       timeout-minutes: 30
       permissions:
         contents: read
       steps:
         - name: Checkout repository
           uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1

         - name: Set up Node.js
           uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
           with:
             node-version: '24'
             cache: npm

         - name: Install dependencies
           run: npm ci

         - name: Test
           run: npm test
   ```

## Validate the snippets

The dependency-free validator checks strict JSON parsing, required fields, unique prefixes, placeholder numbering, full-SHA action pinning across repository text files, branding options, composite-action output wiring, and README coverage:

```bash
node .github/scripts/validate-snippets.mjs
```

A non-zero exit code identifies an invalid or inconsistent snippet.

## Documentation baseline

The templates follow GitHub's workflow syntax, action metadata syntax, workflow-command guidance, and secure-use recommendations. Every `actions/*` reference is pinned to the full commit SHA of a named release, with the release version retained in a comment for maintainability.

The defaults target GitHub.com and runners compatible with Node.js 24 actions. GitHub Enterprise Server and older self-hosted runners may require different action versions.

- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Metadata syntax reference](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)
- [Using self-hosted runners in a workflow](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/use-in-a-workflow)
- [OpenID Connect reference](https://docs.github.com/en/actions/reference/security/oidc)
- [Workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands)
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` for details. Quick guidelines:

- Use the `gha-` prefix for new snippets.
- Keep snippet bodies valid YAML where applicable.
- Add clear descriptions and set snippet scope to `yaml` when relevant.
- Update `README.md` when adding or changing public snippets.

## Testing changes

- Run `node .github/scripts/validate-snippets.mjs` locally.
- Open a branch and create a Pull Request — the repository CI will validate the snippets file.

## License

This project is licensed under the Apache License, Version 2.0. See the `LICENSE` file for details.

## Feedback

Open an issue or pull request with suggestions, fixes, or new snippets.
