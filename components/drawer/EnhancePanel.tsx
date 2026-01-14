/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';

export type EnhanceType = 'a11y' | 'format' | 'dummy' | 'responsive' | 'tailwind' | 'charts' | 'content' | 'file-populate' | 'persona';

interface EnhancePanelProps {
    onEnhance: (type: EnhanceType, file?: File) => void;
}

const EnhancePanel: React.FC<EnhancePanelProps> = ({ onEnhance }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onEnhance('file-populate', file);
            // Reset input so the same file can be picked again if needed
            e.target.value = '';
        }
    };

    return (
        <div className="enhance-panel">
            <div className="enhance-section-label">Data & Branding</div>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".txt,.pdf,.csv,.json,.md"
                onChange={handleFileChange}
            />
            <button className="enhance-option" onClick={handleFileClick}>
                <span className="icon">📄</span>
                <div className="text"><strong>Populate from File</strong><span>Analyze docs/CSVs and inject real data.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('persona')}>
                <span className="icon">👤</span>
                <div className="text"><strong>Realistic Dummy Data</strong><span>Inject user names, high-fidelity roles, and portraits.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('dummy')}>
                <span className="icon">🔢</span>
                <div className="text"><strong>Smart Metrics</strong><span>Populate realistic KPIs and business data.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('content')}>
                <span className="icon">🖼️</span>
                <div className="text"><strong>Inject Real Images</strong><span>Replace placeholders with Unsplash photography.</span></div>
            </button>

            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Engineering & UX</div>
            <button className="enhance-option" onClick={() => onEnhance('a11y')}>
                <span className="icon">♿</span>
                <div className="text"><strong>Fix Accessibility (WCAG)</strong><span>Audit ARIA, contrast, and semantic structure.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('charts')}>
                <span className="icon">📊</span>
                <div className="text"><strong>Interactive Charts</strong><span>Add live Chart.js visualizations.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('responsive')}>
                <span className="icon">📱</span>
                <div className="text"><strong>Mobile Optimization</strong><span>Ensure perfect grids across breakpoints.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('tailwind')}>
                <span className="icon">🌊</span>
                <div className="text"><strong>Utility Refactor</strong><span>Convert custom CSS to Tailwind classes.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('format')}>
                <span className="icon">📝</span>
                <div className="text"><strong>Prettify Code</strong><span>Clean up formatting and indentation.</span></div>
            </button>
        </div>
    );
};

export default EnhancePanel;