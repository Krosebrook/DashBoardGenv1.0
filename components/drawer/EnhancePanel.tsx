
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
            <div className="enhance-section-label">Identity & Branding</div>
            <button className="enhance-option" onClick={() => onEnhance('persona')}>
                <span className="icon">👤</span>
                <div className="text">
                    <strong>Persona & Identity</strong>
                    <span>Generate realistic users, professional portraits, and brand identity elements.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('content')}>
                <span className="icon">🖼️</span>
                <div className="text">
                    <strong>Inject High-End Media</strong>
                    <span>Replace placeholders with curated photography from Unsplash.</span>
                </div>
            </button>

            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Data Intelligence</div>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".txt,.pdf,.csv,.json,.md"
                onChange={handleFileChange}
            />
            <button className="enhance-option" onClick={handleFileClick}>
                <span className="icon">📄</span>
                <div className="text">
                    <strong>File Populate</strong>
                    <span>Extract metrics from documents or CSVs to fill your dashboard.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('dummy')}>
                <span className="icon">🔢</span>
                <div className="text">
                    <strong>Smart Dummy Data</strong>
                    <span>Populate realistic KPIs, trends, and data tables instantly.</span>
                </div>
            </button>

            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Engineering Refinement</div>
            <button className="enhance-option" onClick={() => onEnhance('a11y')}>
                <span className="icon">♿</span>
                <div className="text">
                    <strong>A11y Fix (WCAG 2.1)</strong>
                    <span>Audit and fix ARIA, contrast, and semantic structure.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('charts')}>
                <span className="icon">📊</span>
                <div className="text">
                    <strong>Interactive Charts</strong>
                    <span>Identify data areas and inject live Chart.js visualizations.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('responsive')}>
                <span className="icon">📱</span>
                <div className="text">
                    <strong>Mobile Optimization</strong>
                    <span>Refine layout and grids for perfect responsiveness across all devices.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('tailwind')}>
                <span className="icon">🌊</span>
                <div className="text">
                    <strong>Utility Refactor</strong>
                    <span>Rewrite all custom CSS into clean Tailwind utility classes.</span>
                </div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('format')}>
                <span className="icon">📝</span>
                <div className="text">
                    <strong>Prettify Source</strong>
                    <span>Clean up indentation and code formatting for developer handoff.</span>
                </div>
            </button>
        </div>
    );
};

export default EnhancePanel;
