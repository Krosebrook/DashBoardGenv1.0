# DashGen User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Generating Dashboards](#generating-dashboards)
4. [Feature Guide](#feature-guide)
5. [Tips & Best Practices](#tips--best-practices)

## Introduction

DashGen is an AI-powered dashboard generator that creates professional, production-ready dashboard UIs in seconds. Whether you need analytics dashboards, admin panels, or monitoring interfaces, DashGen makes it easy to create, customize, and export beautiful dashboards.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Krosebrook/DashBoardGenv1.0.git
   cd DashBoardGenv1.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your API key:
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key: `GEMINI_API_KEY=your_api_key_here`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## Generating Dashboards

### Method 1: AI Generation (Text Prompt)

1. **Type a description** in the input field:
   - Example: "SaaS Analytics Dashboard with MRR & Churn charts"
   - Example: "E-commerce Admin Panel with orders table"

2. **Press Enter** or click the send button

3. **Wait for generation** - DashGen will create 3 different design concepts

4. **Select your favorite** - Click on any dashboard to focus and customize

### Method 2: Form Builder

1. **Click "Form Builder"** on the empty state

2. **Fill out the form**:
   - **Dashboard Name**: Give your dashboard a name
   - **Category**: Choose from Analytics, SaaS, E-commerce, CRM, Admin, or IoT
   - **Key Metrics**: Add metrics like "Total Users: 1,234"
   - **Charts**: Specify chart types and titles
   - **Data Tables**: Toggle to include/exclude tables
   - **Color Scheme**: Select from Professional, Dark Mode, Vibrant, or Minimal
   - **Layout**: Choose Sidebar or Top Navigation

3. **Click "Generate Dashboard"** - Your custom dashboard will be created

### Method 3: Template Library

1. **Click "Browse Templates"** on the empty state

2. **Filter by category** - Use category buttons to narrow down options

3. **Preview templates** - Click the preview button to see full-size

4. **Select a template** - Click "Use Template" to start customizing

### Method 4: Import Existing Dashboard

1. **Click the Upload icon** in the global controls

2. **Drag & drop** an HTML file or click "Browse Files"

3. **Preview** your imported dashboard

4. **Click "Import Dashboard"** - Now you can enhance and modify it

## Feature Guide

### 1. Upload/Import Dashboard

**Purpose**: Import existing HTML dashboard files to edit and enhance

**How to use**:
- Click the Upload icon (⬆️) in the top-left controls
- Drag and drop an HTML file or browse to select one
- Preview the dashboard before importing
- Click "Import Dashboard" to add it to your workspace

**Use cases**:
- Migrate existing dashboards to DashGen
- Enhance legacy dashboards with AI
- Start with a custom base template

### 2. Template Library

**Purpose**: Quick-start with pre-built professional templates

**How to use**:
- Click "Browse Templates" on the empty state
- Filter templates by category (SaaS, E-commerce, CRM, etc.)
- Preview templates before selection
- Click "Use Template" to start customizing

**Available templates**:
- **SaaS Analytics**: MRR tracking, user growth, churn rates
- **E-commerce Admin**: Orders, products, revenue tracking
- **CRM Dashboard**: Deals, pipeline, customer activity
- **Server Monitoring**: Real-time server metrics and logs

### 3. Export Multiple Formats

**Purpose**: Export your dashboard in different formats for various use cases

**How to use**:
1. Focus on a dashboard (click to select it)
2. Click "Export" in the action bar
3. Choose your format:
   - **HTML**: Standalone file ready to deploy
   - **React Component**: JSX for React applications
   - **JSON Config**: Configuration for API integration
4. Copy to clipboard or download the file

**Format details**:
- **HTML**: Complete file with inline CSS, ready for any web server
- **React**: Converted JSX component with styles, import into React apps
- **JSON**: Dashboard configuration with metadata and structure

### 4. Dashboard Form Builder

**Purpose**: Specify exact requirements through an interactive form

**How to use**:
1. Click "Form Builder" to open the specification form
2. Configure your dashboard:
   - Name and category
   - Add metrics (label + sample value)
   - Add charts (type + title)
   - Choose color scheme and layout
3. Click "Generate Dashboard"
4. AI creates a custom dashboard matching your specifications

**Pro tips**:
- Add realistic sample values for metrics
- Use descriptive chart titles
- Mix different chart types for variety
- Choose color schemes that match your brand

### 5. Project Manager

**Purpose**: Organize, search, and manage your dashboard projects

**How to use**:
- Click the Folder icon (📁) in global controls
- **Search**: Type to search by project name
- **Tag filtering**: Click tags to filter projects
- **Edit projects**: Click ✏️ to rename and add tags
- **Delete projects**: Click 🗑️ to remove projects

**Organization tips**:
- Use descriptive project names
- Add relevant tags like "client", "analytics", "production"
- Group related dashboards with consistent tags
- Regularly clean up old test projects

### Additional Features

#### Variations
Generate multiple design variations of your current dashboard:
1. Focus on a dashboard
2. Click "Variations" in the action bar
3. Wait for AI to generate 3 radical design concepts
4. Select one to replace your current dashboard

#### Layouts
Apply different layout templates:
1. Focus on a dashboard
2. Click "Layouts" in the action bar
3. Preview layouts (Standard Sidebar, Top Nav, Glass Command, etc.)
4. Click to apply or preview

#### Enhance
Improve your dashboard with enhancements:
- **Accessibility**: Add ARIA labels, improve contrast
- **Format**: Clean and prettify code
- **Content**: Replace Lorem Ipsum with realistic data
- **Responsive**: Make mobile-friendly
- **Charts**: Add interactive Chart.js visualizations
- **Tailwind**: Convert to Tailwind CSS

#### Code Editor
Edit source code directly:
1. Focus on a dashboard
2. Click "Code" in the action bar
3. Edit HTML/CSS in the code editor
4. Click "Save Changes"

#### Refine Dashboard
Iterate on your dashboard with natural language:
1. Focus on a dashboard
2. Type refinements in the bottom input
   - Example: "Add a dark mode toggle"
   - Example: "Make the sidebar collapsible"
3. Press Enter or click send
4. AI updates your dashboard

## Tips & Best Practices

### For Best Results

1. **Be specific in prompts**
   - ❌ "Make a dashboard"
   - ✅ "SaaS analytics dashboard with MRR, churn rate, and user growth charts"

2. **Use the Form Builder for precise requirements**
   - When you know exactly what metrics and charts you need
   - For client projects with specific requirements

3. **Start with templates**
   - Faster than generating from scratch
   - Good base for customization
   - Learn from pre-built examples

4. **Iterate gradually**
   - Make small refinements one at a time
   - Test after each change
   - Use undo/redo (Ctrl/Cmd + Z)

5. **Organize with Projects Manager**
   - Name projects clearly
   - Use tags consistently
   - Archive completed projects

### Common Workflows

**Quick Prototype**:
1. Browse Templates → Select closest match
2. Refine with natural language
3. Export as HTML

**Client Dashboard**:
1. Form Builder → Specify exact requirements
2. Enhance → Add real data and polish
3. Variations → Show client options
4. Export → Deliver in required format

**Personal Project**:
1. AI Generation → Create from prompt
2. Layouts → Try different styles
3. Code Editor → Fine-tune details
4. Projects → Save with tags

### Keyboard Shortcuts

- **Enter**: Send message / refine dashboard
- **Tab**: Auto-complete placeholder prompt
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Arrow keys**: Navigate between dashboards

### Performance Tips

- Keep browser updated for best performance
- Generate one dashboard at a time
- Clear old projects regularly
- Use search instead of scrolling through many projects

### Troubleshooting

**Dashboard not generating?**
- Check your API key is set correctly
- Ensure you have internet connection
- Try a simpler prompt first

**Dashboard looks broken?**
- Click "Format" in Enhance panel
- Try a different layout
- Edit code to fix specific issues

**Features not working?**
- Refresh the page
- Clear browser cache
- Check console for errors

## Need Help?

- Check the [API Documentation](./API_DOCUMENTATION.md) for technical details
- Review the [Developer Guide](./DEVELOPER_GUIDE.md) for customization
- Report issues on GitHub
- Submit feature requests

---

Happy dashboard building! 🎨✨
