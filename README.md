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

## Common snippets (overview)

Use the snippet `prefix` in a YAML file to insert each template and tab through placeholders.

- `gha-workflow` — Workflow boilerplate with push/pull_request triggers and a simple build job.
- `gha-workflow-job` — Job skeleton with `runs-on` and common steps.
- `gha-workflow-job-step-run` — `run` step with optional `if`, `env`, `shell`, and `working-directory` placeholders.
- `gha-workflow-job-step-uses` — `uses` step for running an action.
- `gha-composite-action` — Composite Action template (inputs, outputs, steps).
- `gha-composite-action-step-run` — `run` step for composite actions.
- `gha-composite-action-step-uses` — `uses` step for composite actions.
- `gha-docker-action` — Docker-based Action template.
- `gha-node-action` — Node.js Action template (Node 20.x recommended).
- `gha-action-branding` — Insert `branding:` fields (color, icon) for action metadata.
- `gha-action-step-env` — Insert commonly used GitHub Action environment variables for a step.

For a complete list, open `./.vscode/github-actions.code-snippets` and search for `"prefix":` entries.

## Example — create a CI workflow

1. Create `.github/workflows/ci.yml`.
2. In VS Code, open it, type `gha-workflow`, accept the snippet, then fill placeholders.

   Snippet expansion example (illustrative):

   ```yaml
   name: CI

   on:
     push:
     pull_request:

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'

         - name: Install
           run: npm install

         - name: Test
           run: npm test
   ```

## Validate the snippets JSON

The repository includes a GitHub workflow that validates the snippets JSON. Locally you can validate the file with `jq`:

```bash
jq empty .vscode/github-actions.code-snippets
```

A non-zero exit code indicates invalid JSON.

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` for details. Quick guidelines:

- Use the `gha-` prefix for new snippets.
- Keep snippet bodies valid YAML where applicable.
- Add clear descriptions and set snippet scope to `yaml` when relevant.
- Update `README.md` when adding or changing public snippets.

## Testing changes

- Run the `jq` JSON validation locally.
- Open a branch and create a Pull Request — the repository CI will validate the snippets file.

## License

This project is licensed under the Apache License, Version 2.0. See the `LICENSE` file for details.

## Feedback

Open an issue or pull request with suggestions, fixes, or new snippets.
