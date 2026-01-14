# DashGen API Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Types](#core-types)
3. [Components API](#components-api)
4. [Utility Functions](#utility-functions)
5. [Storage API](#storage-api)
6. [AI Integration](#ai-integration)

## Architecture Overview

DashGen is built with:
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Google Gemini AI** - Dashboard generation
- **LocalStorage** - Session persistence

### Project Structure

```
/
├── components/           # React components
│   ├── drawer/          # Side drawer panels
│   ├── ArtifactCard.tsx
│   ├── CodeEditor.tsx
│   ├── Icons.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   └── useHistory.ts
├── utils/               # Utility functions
│   └── storage.ts
├── constants/           # Constants and config
│   └── templates.ts
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants
├── utils.ts            # General utilities
├── index.tsx           # Main app entry
└── index.css           # Global styles
```

## Core Types

### Artifact

Represents a generated dashboard instance.

```typescript
interface Artifact {
  id: string;              // Unique identifier
  styleName: string;       // Display name/theme
  html: string;           // Current HTML content
  originalHtml?: string;  // Original HTML before modifications
  status: 'streaming' | 'complete' | 'error';
}
```

**Example**:
```typescript
const artifact: Artifact = {
  id: 'session_123_0',
  styleName: 'Modern Analytics',
  html: '<!DOCTYPE html>...',
  originalHtml: '<!DOCTYPE html>...',
  status: 'complete'
};
```

### Session

Represents a generation session with multiple artifacts.

```typescript
interface Session {
  id: string;           // Unique session ID
  prompt: string;       // Generation prompt
  timestamp: number;    // Creation timestamp (ms)
  artifacts: Artifact[]; // Generated artifacts (usually 3)
  name?: string;        // Custom project name
  tags?: string[];      // Organization tags
}
```

**Example**:
```typescript
const session: Session = {
  id: 'session_123',
  prompt: 'SaaS Analytics Dashboard',
  timestamp: 1642345678900,
  artifacts: [artifact1, artifact2, artifact3],
  name: 'Client Dashboard - Q1',
  tags: ['client', 'saas', 'analytics']
};
```

### GenerationSettings

Configuration for AI generation.

```typescript
interface GenerationSettings {
  framework: Framework;  // CSS framework
  dataContext: string;   // Data context/description
  autoA11y: boolean;    // Auto accessibility
}

type Framework = 'vanilla' | 'tailwind' | 'react-mui' | 'bootstrap' | 'foundation';
```

### DashboardTemplate

Pre-built dashboard template.

```typescript
interface DashboardTemplate {
  id: string;
  name: string;
  category: 'analytics' | 'ecommerce' | 'saas' | 'admin' | 'crm' | 'iot';
  description: string;
  html: string;
}
```

### DashboardSpecs

Form builder specifications.

```typescript
interface DashboardSpecs {
  name: string;
  category: string;
  metrics: MetricSpec[];
  charts: ChartSpec[];
  tables: boolean;
  colorScheme: string;
  layout: string;
}

interface MetricSpec {
  id: string;
  label: string;
  value: string;
}

interface ChartSpec {
  id: string;
  type: string;  // 'line' | 'bar' | 'pie' | 'area'
  title: string;
}
```

## Components API

### Main Components

#### App
Main application component.

**State**:
- `sessions`: Array of Session objects
- `currentSessionIndex`: Active session index
- `focusedArtifactIndex`: Focused artifact in session
- `settings`: Generation settings
- `drawerState`: Side drawer state and mode

**Key Methods**:
- `handleSendMessage(prompt?: string)`: Generate dashboards from prompt
- `handleGenerateFromForm(specs: DashboardSpecs)`: Generate from form specs
- `handleImportDashboard(html: string, fileName: string)`: Import HTML
- `handleSelectTemplate(template: DashboardTemplate)`: Use template
- `handleUpdateSession(id: string, updates: Partial<Session>)`: Update session

#### ArtifactCard
Displays a generated dashboard artifact.

**Props**:
```typescript
interface ArtifactCardProps {
  artifact: Artifact;
  isFocused: boolean;
  onClick: () => void;
}
```

**Usage**:
```typescript
<ArtifactCard 
  artifact={artifact} 
  isFocused={focusedArtifactIndex === index}
  onClick={() => setFocusedArtifactIndex(index)}
/>
```

### Drawer Panels

#### ImportPanel
Upload and import HTML dashboards.

**Props**:
```typescript
interface ImportPanelProps {
  onImport: (html: string, fileName: string) => void;
}
```

#### TemplatesPanel
Browse and select dashboard templates.

**Props**:
```typescript
interface TemplatesPanelProps {
  templates: DashboardTemplate[];
  onSelectTemplate: (template: DashboardTemplate) => void;
  onPreview: (item: { html: string; name: string }) => void;
}
```

#### ExportPanel
Export dashboards in multiple formats.

**Props**:
```typescript
interface ExportPanelProps {
  currentHtml: string;
  dashboardName: string;
}
```

**Export Formats**:
- **HTML**: Standalone file
- **React**: JSX component
- **JSON**: Configuration object

#### DashboardFormBuilder
Interactive form to specify dashboard requirements.

**Props**:
```typescript
interface DashboardFormBuilderProps {
  onGenerate: (specs: DashboardSpecs) => void;
  isGenerating?: boolean;
}
```

#### ProjectsPanel
Manage, search, and organize projects.

**Props**:
```typescript
interface ProjectsPanelProps {
  sessions: Session[];
  currentSessionIndex: number;
  onJumpToSession: (index: number) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onUpdateSession: (id: string, updates: { name?: string; tags?: string[] }) => void;
}
```

#### CodeEditor
Edit dashboard HTML/CSS directly.

**Props**:
```typescript
interface CodeEditorProps {
  initialValue: string;
  onSave: (code: string) => void;
}
```

## Utility Functions

### generateId()
Generate unique identifiers.

```typescript
function generateId(): string;
```

**Returns**: Timestamp-based unique ID

**Example**:
```typescript
const sessionId = generateId(); // "1642345678900"
```

### parseJsonStream()
Parse streaming JSON responses from AI.

```typescript
async function* parseJsonStream(
  stream: AsyncIterable<any>
): AsyncGenerator<any>;
```

**Usage**:
```typescript
for await (const item of parseJsonStream(responseStream)) {
  console.log(item);
}
```

## Storage API

### loadSessions()
Load sessions from localStorage.

```typescript
function loadSessions(): Session[];
```

**Returns**: Array of saved sessions

### saveSessions()
Save sessions to localStorage.

```typescript
function saveSessions(sessions: Session[]): void;
```

**Parameters**:
- `sessions`: Array of sessions to save

### clearSessions()
Clear all saved sessions.

```typescript
function clearSessions(): void;
```

## AI Integration

### Google Gemini AI

DashGen uses the Google Gemini AI API for dashboard generation.

#### Client Initialization

```typescript
import { GoogleGenAI } from '@google/genai';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY is not configured.");
  return new GoogleGenAI({ apiKey });
};
```

#### Generation Request

```typescript
const ai = getAiClient();

const responseStream = await ai.models.generateContentStream({
  model: 'gemini-3-flash-preview',
  contents: [{ 
    parts: [{ text: prompt }], 
    role: 'user' 
  }],
  config: { 
    temperature: 1.1  // Higher for more creative variations
  }
});
```

#### Streaming Response

```typescript
let accumulatedHtml = '';
for await (const chunk of responseStream) {
  if (typeof chunk.text === 'string') {
    accumulatedHtml += chunk.text;
    // Update UI with partial content
  }
}
```

### Prompt Engineering

#### Dashboard Generation Prompt

```typescript
const prompt = `
You are an expert Frontend Engineer specializing in DASHBOARDS.
Create a complete, high-fidelity DASHBOARD INTERFACE for: "${userPrompt}".
Concept/Style: ${styleInstruction}.
Framework: ${frameworkContext}

Requirements:
1. **Layout**: MUST have a sidebar (navigation) and/or top header, and a main content area.
2. **Components**: Include Stats Cards (KPIs), Data Tables, and placeholders for Charts.
3. **Data**: Use realistic dummy data for the context.
4. **Design**: Modern, clean, professional. Use consistent spacing and typography.
5. **Output**: Return ONLY raw HTML/CSS (and JS if needed). NO markdown blocks.
`.trim();
```

#### Enhancement Prompts

```typescript
// Accessibility
const a11yPrompt = 'Conduct a thorough accessibility audit. Add ARIA labels, ensure WCAG 2.1 AA compliance, use semantic HTML5 tags.';

// Responsive Design
const responsivePrompt = 'Make this dashboard perfectly responsive. Ensure sidebar collapses on mobile with hamburger menu.';

// Add Charts
const chartsPrompt = 'Replace static placeholders with working Chart.js graphs. Load Chart.js from CDN.';
```

### Rate Limits & Best Practices

1. **Debounce requests**: Wait for user to finish typing
2. **Cancel pending requests**: When starting new generation
3. **Handle errors gracefully**: Show user-friendly messages
4. **Cache results**: Save generated HTML to avoid re-generation
5. **Respect API limits**: Don't make rapid-fire requests

## Extending DashGen

### Adding New Templates

1. Create template in `constants/templates.ts`:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  category: 'admin',
  description: 'Description here',
  html: `<!DOCTYPE html>...`
}
```

2. Add to `DASHBOARD_TEMPLATES` array

### Adding New Enhancement Types

1. Add to EnhancePanel options
2. Create prompt in `handleEnhance()`:

```typescript
if (type === 'my-enhancement') {
  enhancementPrompt = 'Your enhancement instructions...';
}
```

### Custom Export Formats

Add to ExportPanel `getExportContent()`:

```typescript
case 'my-format':
  return convertToMyFormat(currentHtml);
```

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

Set in `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

## Error Handling

### Common Errors

**API Key Missing**:
```typescript
if (!apiKey) {
  throw new Error("API_KEY is not configured.");
}
```

**Generation Failed**:
```typescript
try {
  // generation code
} catch (e) {
  console.error("Generation failed", e);
  // Show user-friendly error
}
```

### Best Practices

1. **Try-catch blocks**: Wrap AI calls
2. **User feedback**: Show loading states and errors
3. **Fallback content**: Show placeholder on error
4. **Retry logic**: Allow user to retry failed generations

---

For usage examples, see [User Guide](./USER_GUIDE.md).  
For development setup, see [Developer Guide](./DEVELOPER_GUIDE.md).
