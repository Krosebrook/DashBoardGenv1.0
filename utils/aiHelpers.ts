
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnhanceType } from '../components/drawer/EnhancePanel';
import { GenerationSettings } from '../types';

/**
 * Reads a file and returns its base64 representation (without metadata prefix).
 */
export const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Split to get only the base64 data
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Selects the appropriate Gemini model based on the complexity of the task.
 */
export const getEnhancementModel = (type: EnhanceType): string => {
    const proModels: EnhanceType[] = [
        'persona', 
        'file-populate', 
        'a11y', 
        'responsive', 
        'tailwind', 
        'charts', 
        'enhance-code'
    ];
    return proModels.includes(type) ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
};

/**
 * Constructs the multimodal parts for the enhancement request.
 */
export const buildEnhancementParts = async (
    type: EnhanceType, 
    currentHtml: string, 
    file?: File
): Promise<any[]> => {
    let enhancementPrompt = '';
    
    // File Population Strategy
    if (type === 'file-populate' && file) {
        const base64Data = await readFileAsBase64(file);
        
        enhancementPrompt = `
            You are an Expert Data Hydrator. I have provided a source document. 
            1. ANALYZE: Extract all relevant metrics, KPIs, table rows, and statistical trends from the provided document.
            2. INJECT: Map this real-world data into the existing dashboard HTML:
               - Replace "Lorem Ipsum", generic numbers, and "Placeholder" strings with data from the document.
               - Populate data tables with extracted rows.
               - Ensure chart labels and values reflect the document's content.
            3. ACCURACY: Maintain the existing UI structure, styles, and logic.
            Return ONLY the complete updated raw HTML.
        `;

        return [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type || 'text/plain'
                }
            },
            { text: enhancementPrompt },
            { text: `Existing Code:\n${currentHtml}` }
        ];
    }

    // Standard Enhancement Strategies
    switch (type) {
        case 'persona':
            enhancementPrompt = `
                You are a world-class Branding and UX Content Strategist. Your task is to inject a high-fidelity brand identity and realistic, diverse user personas into this dashboard. 
                1. Brand Identity: Invent a professional company name, a mission statement, and replace all 'Logo' or 'Company' placeholders with this cohesive identity.
                2. User Personas: Generate highly realistic, diverse, and professional user names and roles. Inject these into any 'User Profile', 'Assigned To', or 'Team' sections.
                3. Professional Portraits: Replace generic avatars with high-quality, professional photography URLs from Unsplash.
                4. Professional Copy: Replace all 'Lorem Ipsum', 'Test Data', or generic strings with contextually accurate, professional domain content.
                Return ONLY the complete updated raw HTML.
            `;
            break;
        case 'a11y':
            enhancementPrompt = `
                You are an expert Accessibility (A11y) Engineer specializing in WCAG 2.1 AA/AAA standards. 
                Audit and fix this dashboard HTML:
                1. Contrast: Adjust CSS colors to ensure AA/AAA compliance.
                2. Semantics: Refactor elements to use proper HTML5 semantic tags.
                3. ARIA: Add descriptive aria-labels, roles, and states.
                4. Focus: Ensure logical tab order and visible focus states.
                Return ONLY the complete fixed raw HTML.
            `;
            break;
        case 'format':
            enhancementPrompt = 'Prettify and format the code for high readability. Ensure standard indentation and clean organization of CSS and JS. Return ONLY cleaned HTML.';
            break;
        case 'dummy':
            enhancementPrompt = 'Identify the domain of this dashboard. Inject high-fidelity, realistic business KPIs and at least 10 rows of varied data into tables. Ensure trends and numbers are consistent and look like live analytics. Return ONLY updated HTML.';
            break;
        case 'content':
            enhancementPrompt = 'Visual Storytelling: Scan the dashboard for image placeholders and replace them with beautiful, high-resolution photography from Unsplash that matches the professional context. Return ONLY updated HTML.';
            break;
        case 'responsive':
            enhancementPrompt = `
                You are a world-class Responsive Design Expert. Refine the provided dashboard for perfect viewing on Mobile, Tablet, and Desktop. 
                1. Grids: Implement fluid CSS Grid or Flexbox layouts that stack gracefully.
                2. Navigation: Ensure sidebars collapse into a drawer or hamburger menu for mobile.
                3. Touch Targets: Ensure all buttons and links are at least 44x44px on mobile.
                Return ONLY the complete updated raw HTML.
            `;
            break;
        case 'tailwind':
            enhancementPrompt = `
                You are a Senior Principal Frontend Engineer. Your task is to refactor this entire dashboard to use Tailwind CSS utility classes exclusively.
                1. COMPLETE EXTRACTION: Parse all CSS within <style> tags and move them into Tailwind utility classes directly on the HTML elements.
                2. REMOVAL: Delete the original <style> blocks after the conversion is complete to ensure no redundancy.
                3. CDN INTEGRATION: Ensure the script <script src="https://cdn.tailwindcss.com"></script> is in the <head>.
                4. ARBITRARY VALUES: For complex or specific CSS values that don't fit the standard Tailwind scale (e.g. specific colors or dimensions), use Tailwind's arbitrary value syntax: e.g. bg-[#1a2b3c] or h-[123px].
                5. RESPONSIVE & STATES: Map all media queries to Tailwind prefixes (md:, lg:, etc.) and pseudo-states to (hover:, focus:, active:).
                Return ONLY the complete, cleaned, and updated raw HTML.
            `;
            break;
        case 'charts':
            enhancementPrompt = `
                You are a World-Class Data Visualization Engineer.
                Your mission: Transform static data sections into live, interactive Chart.js visualizations.
                1. IDENTIFICATION: Scan the dashboard for data-heavy sections (HTML tables, numeric grids, KPI lists, static graphs).
                2. INJECTION:
                   - Add the Chart.js CDN script (<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>) to the <head>.
                   - Replace identified static areas with <canvas> elements.
                3. LIVE RENDERING:
                   - Insert a <script> block that initializes these charts with realistic, trend-aligned data.
                   - Implement beautiful, responsive configurations (smooth animations, custom tooltips, theme-consistent colors).
                Return ONLY the complete updated raw HTML.
            `;
            break;
        case 'enhance-code':
            enhancementPrompt = `
                You are a Senior Principal Frontend Engineer. Your task is to perform a deep "Enhance Code" operation.
                1. Analysis: Scan the artifact for data-heavy areas, generic patterns, and inefficient layout logic.
                2. Intelligence: Inject Chart.js and replace static data tables or lists with animated, interactive canvas charts.
                3. Refinement: Improve naming conventions, optimize CSS performance, and ensure the resulting code is of production-grade quality.
                Return ONLY the complete updated raw HTML.
            `;
            break;
        default:
            enhancementPrompt = 'Improve the code quality and visual polish of this dashboard. Return ONLY the complete updated raw HTML.';
    }

    return [{ text: `${enhancementPrompt}\n\nExisting Code:\n${currentHtml}` }];
};

/**
 * Generates the prompt for creating new dashboard artifacts.
 */
export const getGenerationPrompt = (prompt: string, style: string, settings: GenerationSettings): string => {
    const frameworkContext = settings.framework !== 'vanilla' 
        ? `Using ${settings.framework} for component patterns.` 
        : "Using vanilla HTML/CSS.";
        
    return `Expert Frontend Developer. Create a high-fidelity, polished dashboard for: "${prompt}". 
    Style Concept: ${style}. 
    Framework Context: ${frameworkContext}
    Include: 
    - Sidebar and Top Navigation
    - KPI cards with icons
    - A professional data table
    - Realistic dummy metrics
    Return ONLY standalone raw HTML.`;
};

/**
 * Generates the prompt for iterative refinements.
 */
export const getIterationPrompt = (instruction: string, currentHtml: string): string => {
    return `Senior Frontend Engineer. Modify the following dashboard interface.
    Existing Code:
    ${currentHtml}
    User Request: "${instruction}"
    Perform the requested changes while strictly adhering to the current design language, layout principles, and component hierarchy. Return ONLY the complete updated raw HTML.`;
};
