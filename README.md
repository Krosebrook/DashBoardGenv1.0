<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DashGen - AI-Powered Dashboard Generator

An intelligent dashboard generator that creates professional, production-ready dashboard UIs in seconds using AI. Generate, customize, export, and manage your dashboards with ease.

## ✨ Features

### 🚀 Core Features

- **AI-Powered Generation**: Create dashboards from natural language prompts
- **Multiple Generation Methods**:
  - Text prompts for quick generation
  - Interactive form builder for precise specifications
  - Pre-built template library
  - Import existing HTML dashboards

### 🎨 Customization & Enhancement

- **Variations**: Generate multiple design concepts instantly
- **Layout Options**: Apply different layout templates (Sidebar, Top Nav, Glass, Brutalist, etc.)
- **Enhancement Tools**:
  - Accessibility improvements (ARIA labels, WCAG compliance)
  - Code formatting and cleanup
  - Responsive design optimization
  - Content generation with realistic data
  - Chart.js integration
  - Tailwind CSS conversion

### 💾 Export & Management

- **Multi-Format Export**:
  - HTML (standalone file)
  - React Component (JSX)
  - JSON Configuration
- **Project Manager**:
  - Search and filter projects
  - Tag-based organization
  - Rename and categorize dashboards
- **Code Editor**: Edit HTML/CSS directly
- **Real-time Preview**: See changes as they happen

### 🔧 Additional Features

- **Undo/Redo**: Full history with keyboard shortcuts
- **Refine Mode**: Iterate on dashboards with natural language
- **LocalStorage Persistence**: Auto-save your work
- **Responsive Design**: Works on desktop and mobile

## 🎯 Use Cases

- **SaaS Analytics**: MRR tracking, user growth, churn analysis
- **E-commerce Admin**: Orders, inventory, sales metrics
- **CRM Dashboards**: Deals, pipeline, customer activity
- **Server Monitoring**: Real-time metrics, logs, alerts
- **IoT Dashboards**: Device status, sensor data
- **Admin Panels**: User management, system configuration

## 📚 Documentation

- **[User Guide](./USER_GUIDE.md)** - Complete user documentation with tutorials
- **[API Documentation](./API_DOCUMENTATION.md)** - Technical API reference
- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Development setup and contribution guide

## Run Locally

**Prerequisites:**  Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready to deploy to any static hosting service.

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Google Gemini AI** - Dashboard generation
- **Chart.js** - Interactive charts (in generated dashboards)

## 📖 Quick Start Guide

### Generate Your First Dashboard

**Method 1: Text Prompt**
1. Type a description: "SaaS Analytics Dashboard with MRR & Churn"
2. Press Enter
3. Select your favorite from 3 generated concepts

**Method 2: Form Builder**
1. Click "Form Builder"
2. Specify metrics, charts, colors, and layout
3. Click "Generate Dashboard"

**Method 3: Templates**
1. Click "Browse Templates"
2. Select from pre-built dashboards
3. Customize as needed

### Export Your Dashboard

1. Focus on a dashboard (click to select)
2. Click "Export" in the action bar
3. Choose format: HTML, React, or JSON
4. Download or copy to clipboard

## 🎨 Screenshots

### Main Interface
Generate multiple dashboard concepts instantly

### Form Builder
Specify exact requirements through an interactive form

### Template Library
Start from professionally designed templates

### Export Options
Export in HTML, React, or JSON format

## 🤝 Contributing

Contributions are welcome! Please read the [Developer Guide](./DEVELOPER_GUIDE.md) for setup instructions and contribution guidelines.

## 📝 License

Apache-2.0 License - see LICENSE file for details

## 🔗 Links

- **AI Studio App**: https://ai.studio/apps/drive/1_kTqyw0xgKYH1nXdwbvz5TwF6nsTqeu7
- **Documentation**: See USER_GUIDE.md, API_DOCUMENTATION.md, DEVELOPER_GUIDE.md
- **Issues**: Report bugs or request features on GitHub

## ⚡ Performance

- Fast generation (3-5 seconds per dashboard)
- Optimized builds with Vite
- Efficient state management
- LocalStorage for persistence

## 🌟 Acknowledgments

Built with:
- Google Gemini AI for intelligent dashboard generation
- React ecosystem for robust UI development
- Vite for lightning-fast development experience

---

Made with ❤️ by the DashGen team
