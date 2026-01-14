# DashGen Developer Guide

## Table of Contents
1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Code Style & Standards](#code-style--standards)
5. [Testing](#testing)
6. [Building & Deployment](#building--deployment)
7. [Contributing](#contributing)

## Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Krosebrook/DashBoardGenv1.0.git
   cd DashBoardGenv1.0
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   - Navigate to `http://localhost:5173`
   - Hot module replacement (HMR) is enabled

### Recommended VS Code Extensions

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Enhanced TS support
- **Vite**: Better Vite integration

## Project Structure

```
DashBoardGenv1.0/
├── components/              # React components
│   ├── drawer/             # Side drawer panel components
│   │   ├── ImportPanel.tsx
│   │   ├── TemplatesPanel.tsx
│   │   ├── ExportPanel.tsx
│   │   ├── DashboardFormBuilder.tsx
│   │   ├── ProjectsPanel.tsx
│   │   ├── EnhancePanel.tsx
│   │   ├── VariationsPanel.tsx
│   │   ├── LayoutsPanel.tsx
│   │   ├── HistoryPanel.tsx
│   │   └── SettingsPanel.tsx
│   ├── ArtifactCard.tsx    # Dashboard card component
│   ├── CodeEditor.tsx      # Code editing interface
│   ├── ConfirmationModal.tsx
│   ├── PreviewModal.tsx
│   ├── SideDrawer.tsx
│   ├── DottedGlowBackground.tsx
│   └── Icons.tsx           # SVG icon components
├── hooks/                  # Custom React hooks
│   └── useHistory.ts       # Undo/redo functionality
├── utils/                  # Utility functions
│   └── storage.ts          # LocalStorage operations
├── constants/              # Constants and config
│   └── templates.ts        # Dashboard templates
├── types.ts               # TypeScript type definitions
├── constants.ts           # App-level constants
├── utils.ts               # General utilities
├── index.tsx              # Main app entry point
├── index.css              # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies & scripts
├── USER_GUIDE.md          # User documentation
├── API_DOCUMENTATION.md   # API reference
└── README.md              # Project overview
```

### Key Files

- **index.tsx**: Main application component with state management
- **types.ts**: All TypeScript interfaces and types
- **constants.ts**: Layout options and placeholder prompts
- **constants/templates.ts**: Pre-built dashboard templates
- **utils/storage.ts**: LocalStorage CRUD operations
- **hooks/useHistory.ts**: Undo/redo state management

## Development Workflow

### Creating New Features

1. **Plan the feature**:
   - Identify requirements
   - Design component structure
   - Define types/interfaces

2. **Create types** (if needed):
   ```typescript
   // types.ts
   export interface MyFeature {
     id: string;
     name: string;
     // ... other properties
   }
   ```

3. **Create component**:
   ```typescript
   // components/drawer/MyFeaturePanel.tsx
   import React, { useState } from 'react';
   
   interface MyFeaturePanelProps {
     onAction: (data: any) => void;
   }
   
   export default function MyFeaturePanel({ onAction }: MyFeaturePanelProps) {
     // Component logic
     return <div>...</div>;
   }
   ```

4. **Add styles**:
   ```css
   /* index.css */
   .my-feature-panel {
     /* styles */
   }
   ```

5. **Integrate in main app**:
   ```typescript
   // index.tsx
   import MyFeaturePanel from './components/drawer/MyFeaturePanel';
   
   // Add to drawer modes
   mode: '...' | 'my-feature' | null;
   
   // Add handler
   const handleShowMyFeature = () => setDrawerState({ 
     isOpen: true, 
     mode: 'my-feature', 
     title: 'My Feature' 
   });
   
   // Render in drawer
   {drawerState.mode === 'my-feature' && (
     <MyFeaturePanel onAction={handleMyFeatureAction} />
   )}
   ```

6. **Test the feature**:
   - Manual testing in development
   - Check all edge cases
   - Verify mobile responsiveness

### Adding New Icons

```typescript
// components/Icons.tsx
export const MyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="..."/>
    </svg>
);
```

### Adding Dashboard Templates

```typescript
// constants/templates.ts
{
  id: 'unique-id',
  name: 'Template Name',
  category: 'analytics', // or other category
  description: 'Brief description',
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <style>
    /* Template styles */
  </style>
</head>
<body>
  <!-- Template content -->
</body>
</html>`
}
```

### State Management

DashGen uses React hooks for state management:

- **useState**: Component-local state
- **useCallback**: Memoized callbacks
- **useEffect**: Side effects
- **useRef**: DOM refs and mutable values
- **Custom hook (useHistory)**: Undo/redo functionality

#### useHistory Hook

```typescript
const { 
  state,      // Current state
  set,        // Update state
  undo,       // Undo last change
  redo,       // Redo undone change
  canUndo,    // Boolean: can undo
  canRedo     // Boolean: can redo
} = useHistory<Session[]>(initialSessions);
```

### Working with AI Responses

#### Streaming Response Pattern

```typescript
const responseStream = await ai.models.generateContentStream({
  model: 'gemini-3-flash-preview',
  contents: [{ parts: [{ text: prompt }], role: 'user' }]
});

let accumulated = '';
for await (const chunk of responseStream) {
  if (typeof chunk.text === 'string') {
    accumulated += chunk.text;
    // Update state with partial content
    updateState(accumulated);
  }
}

// Clean up response
const final = accumulated.replace(/```html|```/g, '').trim();
```

#### Error Handling Pattern

```typescript
try {
  const ai = getAiClient();
  const response = await ai.models.generateContent({...});
  // Process response
} catch (e: any) {
  console.error('Generation failed:', e);
  setError('Failed to generate. Please try again.');
} finally {
  setLoading(false);
}
```

## Code Style & Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all props and data structures
- Avoid `any` type when possible
- Use type inference where appropriate

**Example**:
```typescript
// Good
interface CardProps {
  title: string;
  onClick: () => void;
}

// Avoid
function Card(props: any) { }
```

### React Components

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and small
- Use descriptive names

**Component Template**:
```typescript
import React, { useState } from 'react';

interface MyComponentProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MyComponent({ value, onChange }: MyComponentProps) {
  const [localState, setLocalState] = useState('');
  
  return (
    <div className="my-component">
      {/* Component JSX */}
    </div>
  );
}
```

### CSS

- Use CSS custom properties (variables) for theming
- Follow BEM-like naming for classes
- Keep styles scoped to components
- Use mobile-first responsive design

**Example**:
```css
.my-component {
  background: var(--app-bg);
  padding: 16px;
}

.my-component__header {
  font-size: 1.2rem;
  font-weight: 600;
}

.my-component__item {
  padding: 8px;
}

.my-component__item--active {
  background: var(--accent-bg);
}
```

### File Naming

- Components: PascalCase (e.g., `ArtifactCard.tsx`)
- Utilities: camelCase (e.g., `storage.ts`)
- Constants: camelCase (e.g., `templates.ts`)
- Types file: lowercase (e.g., `types.ts`)

### Import Order

```typescript
// 1. External libraries
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// 2. Types
import { Session, Artifact } from './types';

// 3. Constants
import { LAYOUT_OPTIONS } from './constants';

// 4. Utilities
import { generateId } from './utils';

// 5. Components
import ArtifactCard from './components/ArtifactCard';

// 6. Styles (if not in JSX)
import './styles.css';
```

## Testing

### Manual Testing Checklist

For each feature:

- [ ] Functionality works as expected
- [ ] Edge cases handled
- [ ] Error states displayed properly
- [ ] Loading states shown
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Accessibility (screen reader friendly)
- [ ] Browser compatibility (Chrome, Firefox, Safari)

### Testing New Features

1. **Happy path**: Test normal usage
2. **Edge cases**: Empty states, max values, special characters
3. **Error handling**: Network errors, API failures
4. **Performance**: Large datasets, rapid interactions
5. **Accessibility**: Keyboard only, screen reader

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Building & Deployment

### Development Build

```bash
npm run dev
```

- Fast HMR updates
- Source maps enabled
- Development warnings active

### Production Build

```bash
npm run build
```

Output in `dist/` directory:
- `dist/index.html` - Entry HTML
- `dist/assets/` - Bundled JS/CSS

### Build Analysis

```bash
npm run build -- --mode analyze
```

### Preview Production Build

```bash
npm run preview
```

### Deployment

#### Static Hosting (Recommended)

Deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Deploy `dist/` to `gh-pages` branch
- **AWS S3**: Upload `dist/` contents

#### Environment Variables

For production, set:
```
VITE_GEMINI_API_KEY=your_production_key
```

Note: Vite exposes env vars prefixed with `VITE_`

## Contributing

### Git Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "feat: Add my feature"
   ```

3. **Push and create PR**:
   ```bash
   git push origin feature/my-feature
   ```

### Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples**:
```
feat: Add export to React component format
fix: Resolve template preview rendering issue
docs: Update user guide with new features
refactor: Extract dashboard generation logic
```

### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Screenshots**: For UI changes
- **Testing**: Describe testing done
- **Breaking changes**: Clearly marked

### Code Review Process

1. Self-review your changes
2. Ensure all tests pass
3. Request review from maintainers
4. Address feedback
5. Merge when approved

## Troubleshooting

### Common Development Issues

**Port already in use**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill
```

**Stale cache**:
```bash
rm -rf node_modules/.vite
npm run dev
```

**TypeScript errors**:
```bash
# Restart TS server in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

**Build fails**:
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google Gemini AI Docs](https://ai.google.dev/docs)

---

For feature usage, see [User Guide](./USER_GUIDE.md).  
For API reference, see [API Documentation](./API_DOCUMENTATION.md).
