# Testing Documentation
## DashGen: AI-Powered Dashboard Generator

**Version:** 1.0.0  
**Last Updated:** 2026-01-14

---

## Table of Contents
1. [Testing Strategy](#testing-strategy)
2. [Test Pyramid](#test-pyramid)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Security Testing](#security-testing)
7. [Performance Testing](#performance-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [Running Tests](#running-tests)
10. [Test Coverage](#test-coverage)
11. [CI/CD Integration](#cicd-integration)

---

## Testing Strategy

### Testing Goals

1. **Reliability**: Ensure application works as expected
2. **Security**: Prevent vulnerabilities and exploits
3. **Performance**: Meet performance targets (PWA scores, Core Web Vitals)
4. **Accessibility**: WCAG 2.1 Level AA compliance
5. **Regression Prevention**: Catch breaking changes early

### Testing Principles

- **Test Early, Test Often**: Write tests alongside code
- **Test Pyramid**: More unit tests, fewer E2E tests
- **Fail Fast**: Quick feedback on failures
- **Reproducible**: Tests produce consistent results
- **Independent**: Tests don't depend on each other
- **Maintainable**: Tests are easy to update

---

## Test Pyramid

```
        /\
       /  \
      / E2E \      ← Few (slow, expensive, high-level)
     /--------\
    /Integration\  ← Some (medium speed, moderate coverage)
   /--------------\
  /  Unit Tests    \ ← Many (fast, cheap, low-level)
 /------------------\
```

### Distribution

| Type | Count | Execution Time | Coverage |
|------|-------|----------------|----------|
| **Unit** | 70% | < 1s per test | Functions, components, utilities |
| **Integration** | 20% | < 5s per test | Feature workflows, API interactions |
| **E2E** | 10% | < 30s per test | Critical user journeys |

---

## Unit Testing

### Framework

**Vitest** (recommended) or **Jest**

### Setup

```bash
# Install Vitest
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom

# Configure vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
});
```

### Unit Test Examples

**Test: Utility Function**
```typescript
// utils.test.ts
import { describe, it, expect } from 'vitest';
import { generateId, parseJsonStream } from './utils';

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });
  
  it('should generate valid UUID format', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    expect(id).toMatch(uuidRegex);
  });
});

describe('parseJsonStream', () => {
  it('should parse valid JSON stream', () => {
    const jsonString = '{"name": "Test", "value": 123}';
    const result = parseJsonStream(jsonString);
    
    expect(result).toEqual({ name: 'Test', value: 123 });
  });
  
  it('should handle malformed JSON gracefully', () => {
    const malformedJson = '{invalid json}';
    
    expect(() => parseJsonStream(malformedJson)).toThrow();
  });
});
```

**Test: React Component**
```typescript
// ArtifactCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArtifactCard from './ArtifactCard';

describe('ArtifactCard', () => {
  const mockArtifact = {
    id: 'test-id',
    styleName: 'Modern Dashboard',
    html: '<div>Test Content</div>',
    status: 'complete' as const
  };
  
  it('should render artifact card', () => {
    render(<ArtifactCard artifact={mockArtifact} />);
    
    expect(screen.getByText('Modern Dashboard')).toBeInTheDocument();
  });
  
  it('should call onCopy when copy button is clicked', () => {
    const mockOnCopy = vi.fn();
    render(<ArtifactCard artifact={mockArtifact} onCopy={mockOnCopy} />);
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);
    
    expect(mockOnCopy).toHaveBeenCalledWith(mockArtifact);
  });
  
  it('should show loading state when streaming', () => {
    const streamingArtifact = { ...mockArtifact, status: 'streaming' as const };
    render(<ArtifactCard artifact={streamingArtifact} />);
    
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });
});
```

**Test: Custom Hook**
```typescript
// useHistory.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';

describe('useHistory', () => {
  it('should initialize with initial state', () => {
    const { result } = renderHook(() => useHistory(['initial']));
    
    expect(result.current.currentState).toBe('initial');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
  
  it('should add new state to history', () => {
    const { result } = renderHook(() => useHistory(['initial']));
    
    act(() => {
      result.current.pushState('second');
    });
    
    expect(result.current.currentState).toBe('second');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });
  
  it('should undo to previous state', () => {
    const { result } = renderHook(() => useHistory(['initial']));
    
    act(() => {
      result.current.pushState('second');
      result.current.undo();
    });
    
    expect(result.current.currentState).toBe('initial');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });
});
```

---

## Integration Testing

### Scope

Test integration between:
- Components and hooks
- API calls and state management
- LocalStorage and application state

### Integration Test Examples

**Test: Dashboard Generation Flow**
```typescript
// dashboardGeneration.integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './index';

describe('Dashboard Generation Integration', () => {
  beforeEach(() => {
    // Clear LocalStorage before each test
    localStorage.clear();
    
    // Mock AI API
    vi.mock('@google/genai', () => ({
      GoogleGenAI: vi.fn().mockImplementation(() => ({
        models: {
          generateContentStream: vi.fn().mockResolvedValue({
            stream: async function* () {
              yield { text: '{"html": "<div>Generated Dashboard</div>"}' };
            }
          })
        }
      }))
    }));
  });
  
  it('should generate dashboard from prompt', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Enter prompt
    const promptInput = screen.getByPlaceholderText(/describe your dashboard/i);
    await user.type(promptInput, 'Create a sales dashboard');
    
    // Click generate button
    const generateButton = screen.getByRole('button', { name: /generate/i });
    await user.click(generateButton);
    
    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByText(/generated dashboard/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
  
  it('should save session to LocalStorage', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.type(screen.getByPlaceholderText(/describe/i), 'Test prompt');
    await user.click(screen.getByRole('button', { name: /generate/i }));
    
    await waitFor(() => {
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      expect(sessions).toHaveLength(1);
      expect(sessions[0].prompt).toBe('Test prompt');
    });
  });
});
```

---

## End-to-End Testing

### Framework

**Playwright** (recommended) or **Cypress**

### Setup

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Initialize Playwright
npx playwright install
```

### E2E Test Examples

**Test: Complete User Journey**
```typescript
// e2e/dashboard-generation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Generation E2E', () => {
  test('should generate and export dashboard', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');
    
    // Wait for app to load
    await expect(page.locator('#root')).toBeVisible();
    
    // Enter prompt
    await page.fill('[placeholder*="describe"]', 'Create a sales dashboard with charts');
    
    // Select framework
    await page.selectOption('select#framework', 'tailwind');
    
    // Generate dashboard
    await page.click('button:has-text("Generate")');
    
    // Wait for generation (streaming)
    await expect(page.locator('.artifact-card')).toBeVisible({ timeout: 10000 });
    
    // Verify artifact is displayed
    const artifactCard = page.locator('.artifact-card').first();
    await expect(artifactCard).toContainText('sales dashboard', { ignoreCase: true });
    
    // Copy HTML
    await artifactCard.locator('button:has-text("Copy")').click();
    
    // Verify copy success message
    await expect(page.locator('.toast')).toContainText('Copied');
    
    // Download HTML
    const downloadPromise = page.waitForEvent('download');
    await artifactCard.locator('button:has-text("Download")').click();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/\.html$/);
  });
  
  test('should work offline', async ({ page, context }) => {
    // Go online and cache app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // Reload page
    await page.reload();
    
    // Verify app still loads
    await expect(page.locator('#root')).toBeVisible();
    
    // Verify offline indicator (if implemented)
    // await expect(page.locator('.offline-indicator')).toBeVisible();
  });
});
```

---

## Security Testing

### Automated Security Tests

**Test: XSS Prevention**
```typescript
// security.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeHTML } from './security-utils';

describe('XSS Prevention', () => {
  it('should sanitize script tags', () => {
    const malicious = '<script>alert("XSS")</script><div>Safe content</div>';
    const sanitized = sanitizeHTML(malicious);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Safe content');
  });
  
  it('should remove event handlers', () => {
    const malicious = '<div onclick="alert(1)">Click me</div>';
    const sanitized = sanitizeHTML(malicious);
    
    expect(sanitized).not.toContain('onclick');
  });
});
```

**Test: API Key Protection**
```typescript
// security.test.ts
describe('API Key Protection', () => {
  it('should not expose API key in client bundle', () => {
    const bundle = fs.readFileSync('dist/assets/index.js', 'utf-8');
    
    // Check for Gemini API key pattern
    expect(bundle).not.toMatch(/AIza[0-9A-Za-z_-]{35}/);
  });
});
```

---

## Performance Testing

### Lighthouse CI

```bash
# Install Lighthouse CI
npm install --save-dev @lhci/cli

# Run Lighthouse
lhci autorun --config=lighthouserc.json
```

**lighthouserc.json:**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:pwa": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

### Load Testing (Future)

```bash
# Install k6
npm install --save-dev k6

# Run load test
k6 run load-test.js
```

---

## Accessibility Testing

### Automated Tools

**1. axe-core**
```typescript
// accessibility.test.ts
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from './index';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

**2. Manual Testing Checklist**
- [ ] Keyboard navigation works
- [ ] Screen reader announces all content
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Alt text for images
- [ ] Form inputs have labels

---

## Running Tests

### Commands

```bash
# Run all tests
npm run test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm run test -- ArtifactCard.test.tsx

# Run tests matching pattern
npm run test -- --grep="Dashboard Generation"
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run --dir src",
    "test:integration": "vitest run --dir tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui"
  }
}
```

---

## Test Coverage

### Coverage Targets

| Metric | Target |
|--------|--------|
| **Statements** | ≥ 80% |
| **Branches** | ≥ 75% |
| **Functions** | ≥ 80% |
| **Lines** | ≥ 80% |

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Enforce Coverage

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.ts',
        '*.d.ts'
      ]
    }
  }
});
```

---

## CI/CD Integration

### GitHub Actions

Already configured in `.github/workflows/ci.yml`:

```yaml
test:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm run test -- --coverage
    - uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
```

### Pre-Commit Hooks

```bash
# Install husky
npm install --save-dev husky

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run test:unit"
```

---

## Test Data Management

### Fixtures

```typescript
// fixtures/artifacts.ts
export const mockArtifact = {
  id: 'test-123',
  styleName: 'Modern Dashboard',
  html: '<div>Test Content</div>',
  status: 'complete' as const
};

export const mockSession = {
  id: 'session-123',
  prompt: 'Create a dashboard',
  timestamp: Date.now(),
  artifacts: [mockArtifact]
};
```

### Factories

```typescript
// factories/artifact.factory.ts
export function createMockArtifact(overrides = {}) {
  return {
    id: generateId(),
    styleName: 'Dashboard',
    html: '<div>Generated</div>',
    status: 'complete',
    ...overrides
  };
}
```

---

## Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Descriptive Names**: Test names describe what's being tested
3. **One Assertion**: Each test focuses on one thing
4. **No Test Interdependence**: Tests run independently
5. **Fast Tests**: Unit tests run in milliseconds
6. **Mock External Dependencies**: Don't call real APIs in tests
7. **Clean Up**: Reset state after each test
8. **Test Edge Cases**: Not just happy paths

---

## Resources

- **Vitest**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **Playwright**: https://playwright.dev/
- **axe-core**: https://github.com/dequelabs/axe-core
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci

---

**Document Metadata:**
- **Author:** QA Team
- **Reviewers:** Engineering
- **Next Review:** 2026-02-14
- **Version History:** See CHANGELOG.md
