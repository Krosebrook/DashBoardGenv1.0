
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnhanceType } from '../components/drawer/EnhancePanel';
import { GenerationSettings } from '../types';

/**
 * Reads a file and returns its base64 representation (without metadata prefix).
 * Used for uploading files to the AI model for analysis.
 */
export const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Helper to get MIME type from file or extension.
 */
const getMimeType = (file: File): string => {
    if (file.type) return file.type;
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'md': return 'text/markdown';
        case 'csv': return 'text/csv';
        case 'json': return 'application/json';
        case 'pdf': return 'application/pdf';
        case 'txt': return 'text/plain';
        default: return 'text/plain';
    }
};

/**
 * Selects the appropriate Gemini model based on task complexity.
 */
export const getEnhancementModel = (type: EnhanceType): string => {
    const proModels: EnhanceType[] = [
        'persona', 
        'file-populate', 
        'a11y', 
        'responsive', 
        'tailwind', 
        'charts', 
        'enhance-code',
        'ux-audit'
    ];
    return proModels.includes(type) ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
};

/**
 * Constructs the multimodal parts for enhancement requests.
 */
export const buildEnhancementParts = async (
    type: EnhanceType, 
    currentHtml: string, 
    file?: File
): Promise<any[]> => {
    let enhancementPrompt = '';
    
    if (type === 'file-populate' && file) {
        const base64Data = await readFileAsBase64(file);
        const mimeType = getMimeType(file);
        
        enhancementPrompt = `
            You are a Senior Data Architect. I have provided a source document (${file.name}).
            TASK: Hydrate the provided dashboard HTML with high-fidelity data extracted from this file.
            1. ANALYZE: Map the file's data (metrics, users, logs, rows) to the UI components.
            2. INJECT: Replace all static mock data and placeholders with real values from the document.
            3. AGGREGATE: If the file is a long list, calculate relevant KPIs (totals, averages, trends) and update the KPI cards.
            4. VISUALIZE: Update chart datasets and labels to match the file data.
            5. FORMAT: Return ONLY the complete, production-ready, standalone raw HTML.
        `;

        return [
            { inlineData: { data: base64Data, mimeType } },
            { text: enhancementPrompt },
            { text: `Existing Dashboard Code:\n${currentHtml}` }
        ];
    }

    switch (type) {
        case 'persona':
            enhancementPrompt = `
                You are a Principal Product Designer. Elevate this dashboard with a cohesive Brand Persona & Identity.
                1. BRANDING: Invent a sophisticated company name and logo (SVG or professional CSS logo).
                2. USERPERSONAS: Replace generic users with realistic, high-fidelity profiles. Use roles like "Principal Architect", "Director of Ops", etc.
                3. AVATARS: Use high-quality professional portraits from Unsplash (e.g., https://images.unsplash.com/photo-[ID] or reliable placeholders).
                4. COPY: Rewrite all text to use professional, industry-specific terminology.
                Return ONLY updated raw HTML.
            `;
            break;
        case 'a11y':
            enhancementPrompt = `
                You are a Staff Accessibility Engineer. Retrofit this dashboard to meet strict WCAG 2.1 AA standards.
                
                CRITICAL REQUIREMENTS:
                1. SEMANTICS: Replace <div> soup with semantic tags (<main>, <nav>, <article>, <header>, <aside>) where appropriate.
                2. ARIA: Ensure every interactive element (button, input, toggle) has a valid 'aria-label' or 'aria-labelledby'.
                3. CONTRAST: Enforce a minimum 4.5:1 contrast ratio for all text. Darken light gray text if necessary.
                4. FOCUS: Ensure all interactive elements have visible focus states (e.g., outline: 2px solid blue).
                5. HIERARCHY: Verify heading levels (h1 -> h2 -> h3) are logical and not skipped.
                6. IMAGES: Add descriptive 'alt' text to meaningful images and 'alt=""' to decorative ones.
                7. FORMS: Ensure every <input> has a linked <label>.
                
                OUTPUT: Return ONLY the repaired, valid raw HTML.
            `;
            break;
        case 'responsive':
            enhancementPrompt = `
                You are a Mobile-First UX Architect. Refine the dashboard for professional responsiveness.
                1. FLUIDITY: Use CSS Grid and Flexbox with smart wrap/stack behaviors.
                2. VIEWPORTS: Implement breakpoints for Mobile (375px), Tablet (768px), and Desktop (1280px+).
                3. TYPOGRAPHY: Use fluid font sizes (clamp() or media queries) for readability on small screens.
                4. NAVIGATION: Convert top/side nav to a mobile-friendly hamburger menu or bottom bar on Mobile.
                5. DENSITY: Adjust padding and chart dimensions for touch-friendly targets (44px min).
                Return ONLY updated raw HTML.
            `;
            break;
        case 'dummy':
            enhancementPrompt = `
                You are a Data Visualization Specialist. Inject high-signal, realistic dummy data.
                1. METRICS: Use realistic figures for KPIs (e.g., $124.5k Revenue, 98.2% Uptime).
                2. TABLES: Populate with 12+ rows of diverse, formatted business data (dates, status badges, currency).
                3. TRENDS: Ensure metrics show a logical story (e.g., "up 12.4% MoM").
                4. IMAGES: Use high-quality placeholders: https://picsum.photos/seed/[id]/400/300.
                Return ONLY updated raw HTML.
            `;
            break;
        case 'tailwind':
            enhancementPrompt = `
                You are a Tailwind CSS Expert. Refactor this code to use Tailwind utilities exclusively.
                CRITICAL INSTRUCTIONS:
                1. REMOVE ALL <style> tags and inline style attributes.
                2. REPLACE all CSS with Tailwind classes (e.g., 'display: flex' -> 'flex', 'color: red' -> 'text-red-500').
                3. USE arbitrary values (e.g., 'w-[500px]', 'bg-[#123456]') to maintain exact pixel/color precision.
                4. ENSURE responsive prefixes are preserved if present.
                5. RETURN the complete HTML with <script src="https://cdn.tailwindcss.com"></script> in the head.
                
                Goal: 100% Visual Parity, 0% Custom CSS.
                Return ONLY standalone raw HTML.
            `;
            break;
        case 'charts':
            enhancementPrompt = `
                You are a Data Viz Engineer. Inject interactive Chart.js visualizations.
                1. SCAN: Identify lists of numbers or tables that represent time-series or distributions.
                2. INJECT: Add Chart.js <canvas> elements in place of static placeholders.
                3. SCRIPT: Add a <script> block to initialize charts with the page's data. Use professional themes (Monochrome or Cyberpunk).
                Return ONLY standalone HTML with Chart.js CDN in <head>.
            `;
            break;
        case 'enhance-code':
            enhancementPrompt = `
                Perform a Staff-Level code refactor and visual polish.
                1. STRUCTURE: Organize the HTML/CSS for maximum modularity.
                2. INTERACTIVITY: Add hover states, smooth transitions, and micro-interactions.
                3. POLISH: Refine borders, shadows, and spacing to a "Linear/Stripe" quality bar.
                4. CHARTS: Automatically add data viz if it improves the UX.
                Return ONLY standalone raw HTML.
            `;
            break;
        case 'ux-audit':
            enhancementPrompt = `
                You are a Lead UX Researcher. Conduct a usability audit and immediately apply fixes.
                1. ANALYZE: Identify friction points, confusing layouts, poor affordances, or layout shifts.
                2. HEURISTICS: Apply Nielsen's 10 Usability Heuristics (e.g., Visibility of system status, User control).
                3. ACTION: Fix the code to resolve these issues. Improve error states, empty states, and button placement.
                4. FEEDBACK: Add tooltips or micro-copy to guide the user where necessary.
                Return ONLY the upgraded, production-ready HTML.
            `;
            break;
        case 'format':
            enhancementPrompt = 'Prettify and organize the code for high readability. Add clear section comments. Return ONLY cleaned HTML.';
            break;
        default:
            enhancementPrompt = 'Improve the visual and structural quality of this dashboard. Return ONLY raw HTML.';
    }

    return [{ text: `${enhancementPrompt}\n\nExisting Code:\n${currentHtml}` }];
};

/**
 * Constructs multimodal parts for initial generation.
 */
export const buildGenerationParts = async (
    prompt: string, 
    style: string, 
    settings: GenerationSettings,
    image?: File,
    dataFile?: File
): Promise<any[]> => {
    const enhancements = [];
    if (settings.autoA11y) enhancements.push("- Strict WCAG 2.1 compliance (ARIA, semantics, contrast).");
    if (settings.autoCharts) enhancements.push("- Interactive Chart.js visualizations for all numerical data.");
    if (settings.autoPersonas) enhancements.push("- Deep brand identity: unique naming, professional personas, and SVG logos.");
    
    const parts: any[] = [];

    // Data File handling
    if (dataFile) {
        const base64Data = await readFileAsBase64(dataFile);
        const mimeType = getMimeType(dataFile);
        parts.push({ inlineData: { data: base64Data, mimeType } });
        parts.push({ text: `
            CONTEXT: I have provided a data file (${dataFile.name}) containing the source data for this dashboard.
            INSTRUCTION: Your primary task is to visualize THIS specific data. 
            - Extract key metrics and show them as KPI cards.
            - Visualize trends and distributions using Chart.js.
            - Create detailed data tables for the records.
        ` });
    }

    // Image handling
    if (image) {
        const base64Data = await readFileAsBase64(image);
        parts.push({ inlineData: { data: base64Data, mimeType: image.type || 'image/png' } });
        parts.push({ text: "CONTEXT: Use this image as the visual reference for the layout and style." });
    }

    const textPrompt = `
        You are a Staff Frontend Architect. Create a world-class, production-ready dashboard for: "${prompt}".
        STYLE CONCEPT: ${style}.
        FRAMEWORK: ${settings.framework} with utility patterns.
        DATA CONTEXT: ${settings.dataContext || "High-fidelity enterprise data."}
        ${enhancements.length > 0 ? `\nCORE REQUIREMENTS:\n${enhancements.join('\n')}` : ""}
        
        DESIGN PRINCIPLES:
        - Information density without clutter.
        - Intentional hierarchy and scanability.
        - Interactive elements (hover, active states).
        - Responsive from 375px to 2560px.
        
        Return ONLY standalone raw HTML.
    `;
    parts.push({ text: textPrompt });

    return parts;
};

/**
 * Generates the prompt for iterative refinements.
 */
export const getIterationPrompt = (instruction: string, currentHtml: string): string => {
    return `
        Senior Frontend Engineer. Modify this dashboard based on: "${instruction}".
        Current Code:
        ${currentHtml}
        Maintain the existing design language, layout principles, and component hierarchy.
        Return ONLY the complete updated raw HTML.
    `;
};

/**
 * Prompt to extract a component in various frameworks.
 */
export const extractComponentPrompt = (html: string, framework: string): string => {
    const specs = {
        'React': 'React functional component (TSX). Use lucide-react for icons. No import React.',
        'Vue': 'Vue 3 Single File Component (<script setup>). Use lucide-vue-next.',
        'Svelte': 'Svelte 4 component. Use lucide-svelte.',
        'Angular': 'Angular standalone component (TS). Inline template and styles.',
        'HTML': 'Clean HTML/CSS snippet.'
    };
    
    const spec = specs[framework as keyof typeof specs] || specs['React'];

    return `
        You are a Senior Frontend Engineer. Convert the provided HTML/CSS artifact into a ${framework} component.
        
        SPECIFICATION: ${spec}
        
        INSTRUCTIONS:
        1. Identify the main widget or layout in the HTML.
        2. Refactor into idiomatic ${framework} code.
        3. Use Tailwind CSS for styling (convert custom CSS to arbitrary values if needed).
        4. If external libraries (like Chart.js) are used, mock the data or use a framework-specific wrapper if obvious, otherwise keep as DOM operations.
        
        SOURCE HTML:
        ${html}
        
        OUTPUT FORMAT:
        Return ONLY the raw code. No markdown code blocks.
    `;
};
