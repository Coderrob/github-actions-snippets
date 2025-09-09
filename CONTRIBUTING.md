# Contributing to GitHub Actions VS Code Snippets

Thank you for your interest in contributing to this repository! We welcome contributions from the community to improve and expand the collection of GitHub Actions snippets.

## How to Contribute

1. **Fork the Repository**: Click the "Fork" button at the top right of this page to create your own copy of the repository.

2. **Clone Your Fork**: Clone your forked repository to your local machine.

   ```bash
   git clone https://github.com/your-username/github-action-snippets.git
   cd github-action-snippets
   ```

3. **Create a Branch**: Create a new branch for your changes.

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**: Edit the `.vscode/github-actions.code-snippets` file to add or modify snippets. Ensure that:
   - Snippets follow the existing format and naming conventions.
   - Prefixes are unique and descriptive (e.g., `gha-`).
   - Descriptions are clear and concise.
   - Bodies are valid YAML where applicable.

5. **Test Your Changes**:
   - Install the snippets in your VS Code.
   - Test the snippets in a `.yml` file to ensure they work as expected.

6. **Update Documentation**: If adding new snippets, update the `README.md` file to include the new snippets in the "Available Snippets" section.

7. **Commit Your Changes**: Commit your changes with a descriptive message.

   ```bash
   git add .
   git commit -m "Add new snippet for [feature]"
   ```

8. **Push to Your Fork**: Push your changes to your forked repository.

   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create a Pull Request**: Go to the original repository and click "New Pull Request". Provide a clear description of your changes.

## Guidelines

- **Code Style**: Follow the existing code style in the snippets file.
- **YAML Validation**: Ensure that snippet bodies produce valid YAML when expanded.
- **Prefixes**: Use the `gha-` prefix for all snippets to avoid conflicts.
- **Scope**: Set the scope to `yaml,github-actions-workflow` for relevant snippets.
- **Testing**: Test snippets in VS Code to confirm they expand correctly and include all necessary placeholders.

## Reporting Issues

If you find a bug or have a suggestion, please open an issue on GitHub. Provide as much detail as possible, including:

- Steps to reproduce the issue.
- Expected behavior.
- Actual behavior.
- Screenshots if applicable.

## License

By contributing to this repository, you agree that your contributions will be licensed under the Apache License 2.0.
