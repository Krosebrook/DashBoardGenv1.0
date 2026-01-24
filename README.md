
# DashGen Pro

**Enterprise AI Dashboard Generator**  
*Vision-to-Code • Voice Input • Multimodal Data Hydration*

DashGen Pro is a production-grade React application that uses Google's Gemini 3 models to generate, refine, and deploy high-fidelity HTML/CSS/JS dashboards. It functions as an autonomous frontend architect, capable of taking vague concepts, hand-drawn sketches, or raw CSV data and converting them into fully interactive, responsive, and accessible UI artifacts.

---

## 🚀 Features

*   **Multimodal Input**: Generate dashboards from text prompts, voice commands, image mockups (Vision-to-Code), or data files (CSV, JSON, PDF).
*   **Live Iteration**: Edit code manually or simply tell the AI: *"Make the charts dark mode"* or *"Fix the mobile layout"*.
*   **Safe Sandboxing**: All generated code runs in isolated `<iframe>` environments with secure communication channels.
*   **Asset Management**: Persistent library for logos and UI references (IndexedDB).
*   **Session Portability**: Import/Export full session history to JSON for backup or sharing.
*   **Cloud Export**: One-click deployment to StackBlitz.
*   **Pro Enhancements**:
    *   **Auto-A11y**: Automated WCAG 2.1 fixes.
    *   **Tailwind Refactor**: Convert custom CSS to utility classes.
    *   **Component Extraction**: Extract clean React (TSX) components from raw HTML.

---

## 🛠️ Setup & Running

This project is designed to run in a browser-based Node environment (like StackBlitz, Replit, or local Vite).

### Prerequisites
*   Node.js 18+
*   A Google AI Studio API Key (`GEMINI_API_KEY`)

### Local Development
1.  Clone the repository.
2.  Install dependencies (if using a bundler): `npm install`
3.  Set your API key in the environment or directly in the code (for local testing only).
4.  Serve the root directory: `npx serve .`

**Note:** The provided code uses ES Modules via `esm.sh` imports, so no build step is strictly required if serving standard static files, though a bundler is recommended for production.

---

## 🏗️ Architecture

### Core Module (`index.tsx`)
The central nervous system of the app. It manages:
*   **Session State**: `useHistory` hook for undo/redo.
*   **AI Orchestration**: Direct calls to `@google/genai` SDK.
*   **UI Layout**: Managing the SideDrawer, Action Bar, and Stage.

### Rendering Engine (`components/ArtifactCard.tsx`)
Renders generated HTML in a sandboxed iframe.
*   **Injection**: Automatically injects Tailwind CDN, Chart.js, and FontAwesome.
*   **Communication**: `postMessage` bridge for "Inspector Mode" (clicking elements inside the iframe) and error reporting.

### Prompt Engineering (`utils/aiHelpers.ts`)
Contains the "Persona" logic.
*   **Enhancement Personas**: "Staff Accessibility Engineer", "Tailwind Expert", "Data Architect".
*   **Multimodal Assembly**: Converts Files/Images to Base64 for Gemini `inlineData` parts.

### Persistence (`utils/storage.ts` & `utils/assetStore.ts`)
*   **Sessions**: `localStorage` (Text/JSON data).
*   **Assets**: `IndexedDB` (Binary image data) to avoid quota limits.

---

## 📖 Runbook / Troubleshooting

### "Runtime Error" Toast appears
*   **Cause**: The AI generated invalid JavaScript (e.g., accessing a null DOM element).
*   **Fix**: Click the **"Auto-Fix"** button in the toast. This sends the error stack trace back to Gemini, which usually corrects the code immediately.

### Voice Input not working
*   **Cause**: Browser permission denied or HTTP origin (Speech API requires HTTPS or localhost).
*   **Fix**: Check browser permissions. Ensure you are on `localhost` or `https`.

### Assets not saving
*   **Cause**: IndexedDB quota exceeded (rare) or Incognito mode.
*   **Fix**: Clear old assets or switch to a normal browsing tab.

---

## 📜 Changelog

### v2.0.0 (Current)
*   **New**: Asset Manager with IndexedDB persistence.
*   **New**: Session Export/Import (JSON).
*   **Refactor**: Replaced regex HTML parsing with `DOMParser` for stability.
*   **Fix**: Optimized Voice Recognition lifecycle to prevent thrashing.
*   **Fix**: Iframe scroll jumping issues resolved.
*   **Feature**: "Extract Component" now converts HTML to React TSX.

### v1.0.0
*   Initial Release with Text-to-UI and Vision-to-UI capabilities.
