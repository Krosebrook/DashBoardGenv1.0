
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';

/**
 * Supported enhancement types for the AI modification workflow.
 * - 'enhance-code': General structural optimization.
 * - 'dummy': Inject realistic placeholder data.
 * - 'file-populate': Inject data from an uploaded file (CSV, JSON, PDF, etc.).
 * - 'persona': Inject brand identity and user personas.
 * - 'a11y': Fix accessibility issues (WCAG).
 * - 'responsive': Fix mobile/tablet layout issues.
 * - 'tailwind': Convert custom CSS to Tailwind utility classes.
 * - 'format': Prettify code.
 * - 'charts': Inject Chart.js visualizations.
 * - 'content': (Deprecated/Legacy) Update content images.
 */
export type EnhanceType = 'a11y' | 'format' | 'dummy' | 'responsive' | 'tailwind' | 'charts' | 'content' | 'file-populate' | 'persona' | 'enhance-code';

interface EnhancePanelProps {
    /** Callback triggered when a user selects an enhancement option. */
    onEnhance: (type: EnhanceType, file?: File) => void;
}

/**
 * EnhancePanel provides a list of AI-powered actions to modify the currently focused artifact.
 * It includes options for technical refactoring, content injection, and visual improvements.
 */
const EnhancePanel: React.FC<EnhancePanelProps> = ({ onEnhance }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onEnhance('file-populate', file);
            // Reset input value to allow the same file to be selected again if needed
            e.target.value = '';
        }
    };

    return (
        <div className="enhance-panel">
            <div className="enhance-section-label">AI Engineering Core</div>
            <button className="enhance-option" style={{ border: '1px solid #6366f166', background: 'rgba(99, 102, 241, 0.05)' }} onClick={() => onEnhance('enhance-code')}>
                <span className="icon">✨</span>
                <div className="text">
                    <strong style={{ color: '#818cf8' }}>Deep Enhance Code</strong>
                    <span>Full architectural audit to optimize structure and interactivity.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('dummy')}>
                <span className="icon">🔢</span>
                <div className="text">
                    <strong>Smart Dummy Data</strong>
                    <span>Inject realistic names, descriptions, and figures from your domain.</span>
                </div>
            </button>
            
            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Data & Content</div>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".txt,.pdf,.csv,.json,.md"
                onChange={handleFileChange}
            />
            <button className="enhance-option" onClick={handleFileClick} style={{ border: '1px solid #3b82f644', background: 'rgba(59, 130, 246, 0.05)' }}>
                <span className="icon">📄</span>
                <div className="text">
                    <strong style={{ color: '#3b82f6' }}>File Populate</strong>
                    <span>Upload a document (txt, pdf, csv, json, md) to inject real data into your artifact.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('persona')}>
                <span className="icon">👤</span>
                <div className="text">
                    <strong>Persona & Identity</strong>
                    <span>Generate and inject realistic user personas, professional portraits, and brand identity elements.</span>
                </div>
            </button>

            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Technical Refinement</div>
            <button className="enhance-option" onClick={() => onEnhance('a11y')}>
                <span className="icon">♿</span>
                <div className="text">
                    <strong>Fix Accessibility</strong>
                    <span>Optimize ARIA labels, contrast, and semantic tags for WCAG standards.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('responsive')}>
                <span className="icon">📱</span>
                <div className="text">
                    <strong>Mobile Optimization</strong>
                    <span>Refine CSS and layout to be perfectly responsive across all breakpoints (Mobile, Tablet, Desktop).</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('tailwind')}>
                <span className="icon">🌊</span>
                <div className="text">
                    <strong>Utility Refactor</strong>
                    <span>Rewrite all custom CSS using Tailwind CSS utility classes exclusively.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('format')}>
                <span className="icon">📝</span>
                <div className="text">
                    <strong>Prettify</strong>
                    <span>Format and clean the code for maximum developer readability.</span>
                </div>
            </button>

            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Visual Intelligence</div>
            <button className="enhance-option" onClick={() => onEnhance('charts')} style={{ border: '1px solid #10b98144', background: 'rgba(16, 185, 129, 0.05)' }}>
                <span className="icon">📈</span>
                <div className="text">
                    <strong style={{ color: '#10b981' }}>Interactive Charts</strong>
                    <span>Automatically identify data-heavy areas and inject Chart.js canvas elements with live rendering scripts.</span>
                </div>
            </button>
        </div>
    );
};

export default EnhancePanel;
