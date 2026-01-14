# Contributing to DashGen

Thank you for your interest in contributing to DashGen! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Security](#security)

---

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

---

## How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report:**
- Check the [existing issues](https://github.com/Krosebrook/DashBoardGenv1.0/issues) to avoid duplicates
- Verify the bug with the latest version
- Collect information about the bug (browser, OS, steps to reproduce)

**How to submit a bug report:**
1. Use a clear, descriptive title
2. Describe the exact steps to reproduce
3. Provide specific examples (code snippets, screenshots)
4. Describe the expected vs actual behavior
5. Include environment details (browser version, OS, etc.)

### Suggesting Enhancements

**Before submitting an enhancement:**
- Check the [roadmap](./PRD.md) to see if it's already planned
- Search existing issues to avoid duplicates
- Consider if it fits the project's scope and goals

**How to suggest an enhancement:**
1. Use a clear, descriptive title
2. Provide a detailed description of the enhancement
3. Explain why this enhancement would be useful
4. Provide examples or mockups if applicable

### Contributing Code

**Types of contributions we welcome:**
- Bug fixes
- New features (aligned with roadmap)
- Performance improvements
- Accessibility improvements
- Documentation improvements
- Test coverage improvements
- Security enhancements

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- Git
- Google Gemini API key

### Setup Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/DashBoardGenv1.0.git
cd DashBoardGenv1.0

# 3. Add upstream remote
git remote add upstream https://github.com/Krosebrook/DashBoardGenv1.0.git

# 4. Install dependencies
npm install

# 5. Create environment file
cp .env.example .env.local
# Add your GEMINI_API_KEY

# 6. Start development server
npm run dev

# 7. Create a feature branch
git checkout -b feature/your-feature-name
```

### Development Workflow

```bash
# Keep your fork up to date
git fetch upstream
git merge upstream/main

# Make your changes
# ... edit files ...

# Run linters and tests
npm run lint
npm run type-check
npm run test

# Commit your changes (see commit guidelines below)
git add .
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` type - use `unknown` or proper types
- Document complex functions with JSDoc comments

**Example:**
```typescript
/**
 * Generates a dashboard from a user prompt
 * @param prompt - The user's natural language prompt
 * @param settings - Generation settings (framework, data context, etc.)
 * @returns A promise that resolves to the generated artifact
 */
async function generateDashboard(
  prompt: string,
  settings: GenerationSettings
): Promise<Artifact> {
  // Implementation
}
```

### React

- Use functional components with hooks
- Avoid class components
- Use meaningful component names (PascalCase)
- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks

**Example:**
```typescript
// Good
export default function ArtifactCard({ artifact }: ArtifactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // ...
}

// Avoid
export default function Component1(props: any) {
  // ...
}
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ArtifactCard.tsx` |
| Hooks | camelCase with `use` prefix | `useHistory.ts` |
| Utilities | camelCase | `generateId.ts` |
| Types/Interfaces | PascalCase | `interface Artifact {}` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Functions | camelCase | `sanitizeHTML()` |
| Files | kebab-case or PascalCase | `artifact-card.tsx` or `ArtifactCard.tsx` |

### Code Style

- **Indentation:** 2 spaces
- **Quotes:** Single quotes for strings (except JSX attributes)
- **Semicolons:** Use them
- **Line Length:** Max 100 characters
- **Trailing Commas:** Use them in multi-line objects/arrays

**Configure your editor:**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### File Organization

```typescript
// 1. Imports (grouped)
import React, { useState, useEffect } from 'react'; // React
import { Artifact, Session } from './types';        // Local types
import { generateId } from './utils';               // Local utils
import ArtifactCard from './components/ArtifactCard'; // Components

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Constants
const MAX_ARTIFACTS = 50;

// 4. Component
export default function Component({ prop }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    // ...
  );
}

// 5. Helper functions (if not exported)
function helperFunction() {
  // ...
}
```

### Comments

- Write self-documenting code (clear names, small functions)
- Comment **why**, not **what**
- Use JSDoc for exported functions and types
- Remove commented-out code before committing

**Good:**
```typescript
// Retry with exponential backoff to handle transient API failures
await retry(generateDashboard, { maxRetries: 3 });
```

**Avoid:**
```typescript
// Loop through artifacts
for (const artifact of artifacts) {
  // ...
}
```

### Testing

- Write tests for new features
- Maintain or improve test coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

**Example:**
```typescript
describe('generateDashboard', () => {
  it('should generate a valid artifact from a prompt', async () => {
    // Arrange
    const prompt = 'Create a sales dashboard';
    const settings = { framework: 'tailwind' };
    
    // Act
    const artifact = await generateDashboard(prompt, settings);
    
    // Assert
    expect(artifact).toBeDefined();
    expect(artifact.html).toContain('<div');
    expect(artifact.status).toBe('complete');
  });
});
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console.log or debugger statements
- [ ] Documentation updated (if applicable)
- [ ] Security scan passes (no new vulnerabilities)

### PR Guidelines

1. **Title:** Use conventional commits format
   - `feat: add dashboard export feature`
   - `fix: resolve generation timeout issue`
   - `docs: update API documentation`

2. **Description:** Provide context
   - What problem does this solve?
   - What changes were made?
   - Any breaking changes?
   - Screenshots (for UI changes)

3. **Size:** Keep PRs focused and reasonably sized
   - < 400 lines changed (ideal)
   - One feature/fix per PR
   - Split large changes into multiple PRs

4. **Testing:** Describe how you tested
   - Manual testing steps
   - Automated test coverage
   - Browser/device testing

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests you ran and how to reproduce

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for hard-to-understand areas
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings
- [ ] Security scan passes

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process

1. **Automated Checks:** CI pipeline must pass
2. **Code Review:** At least one maintainer approval required
3. **Testing:** Reviewer will test changes
4. **Merge:** Squash and merge (default)

---

## Issue Guidelines

### Issue Types

**Bug Report:**
- Use `bug` label
- Include reproduction steps
- Provide environment details
- Expected vs actual behavior

**Feature Request:**
- Use `enhancement` label
- Explain the problem to solve
- Describe proposed solution
- Consider alternatives

**Documentation:**
- Use `documentation` label
- Specify what's missing/unclear
- Suggest improvements

**Security:**
- **DO NOT** open public issues for security vulnerabilities
- Email: security@dashgen.app
- See [SECURITY.md](./SECURITY.md)

### Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention is needed |
| `question` | Further information is requested |
| `wontfix` | This will not be worked on |
| `duplicate` | Issue already exists |
| `invalid` | Invalid issue |

---

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

**Email:** security@dashgen.app

**Include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

See [SECURITY.md](./SECURITY.md) for more details.

### Security Best Practices

- Never commit secrets or API keys
- Validate all user inputs
- Sanitize generated HTML
- Use parameterized queries (future)
- Follow OWASP guidelines
- Keep dependencies updated

---

## Commit Guidelines

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, no code change)
- `refactor`: Code refactoring (no functionality change)
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependency updates, etc.)
- `ci`: CI/CD changes
- `revert`: Revert a previous commit

### Examples

```bash
# Feature
feat: add dashboard export functionality
feat(ui): add dark mode toggle

# Bug fix
fix: resolve generation timeout issue
fix(api): handle rate limit errors gracefully

# Documentation
docs: update contributing guidelines
docs(readme): add troubleshooting section

# Chore
chore: update dependencies
chore(deps): bump react version to 19.0.1
```

### Breaking Changes

```bash
feat!: change API response format

BREAKING CHANGE: API response now includes metadata field
```

---

## Getting Help

- **Documentation:** [docs/](./docs/)
- **Discussions:** [GitHub Discussions](https://github.com/Krosebrook/DashBoardGenv1.0/discussions)
- **Discord:** [Join our server](https://discord.gg/dashgen) (coming soon)

---

## Recognition

Contributors will be recognized in:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Release notes
- Project website (coming soon)

---

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

**Thank you for contributing to DashGen! 🎉**
