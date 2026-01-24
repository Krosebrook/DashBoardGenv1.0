
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';

// Imported from types in parent scope or defined here for UI structure
export type EnhanceType = 'a11y' | 'format' | 'dummy' | 'responsive' | 'tailwind' | 'charts' | 'content' | 'file-populate' | 'persona' | 'enhance-code' | 'ux-audit';

interface EnhancePanelProps {
    onEnhance: (type: EnhanceType, file?: File) => void;
}

const ENHANCE_SECTIONS = [
    {
        title: "Principal Engineering",
        items: [
            { id: 'enhance-code', label: 'Deep Refactor', desc: 'Optimize structure, logic, and visual polish for production.', icon: '✨', variant: 'purple' },
            { id: 'a11y', label: 'Fix Accessibility', desc: 'Auto-fix ARIA labels, contrast, and semantic tags to meet WCAG 2.1 AA standards.', icon: '♿' },
            { id: 'responsive', label: 'Mobile Optimization', desc: 'Refine the CSS and layout to be perfectly responsive across all breakpoints (Mobile, Tablet, Desktop).', icon: '📱' },
            { id: 'tailwind', label: 'Utility Refactor', desc: 'Rewrite all custom CSS using Tailwind CSS utility classes exclusively.', icon: '🌊', variant: 'cyan' },
            { id: 'format', label: 'Prettify Code', desc: 'Clean, format, and comment for developer handoff.', icon: '📝' }
        ]
    },
    {
        title: "Intelligence & Data",
        items: [
            { id: 'ux-audit', label: 'Automated UX Audit', desc: 'AI Persona agents test the UI for friction points and apply usability fixes immediately.', icon: '🕵️‍♂️', variant: 'blue' },
            { id: 'file-populate', label: 'File Populate', desc: 'Allows users to upload a file (txt, pdf, csv, json, md) and injects its data into the dashboard artifact.', icon: '📄', variant: 'blue' },
            { id: 'dummy', label: 'Smart Dummy Data', desc: 'Generate realistic business metrics, users, and datasets.', icon: '🔢', variant: 'green' },
            { id: 'persona', label: 'Persona & Identity', desc: 'Generate and inject realistic user personas, professional portraits from Unsplash, and relevant brand identity elements.', icon: '👤' },
            { id: 'charts', label: 'Interactive Charts', desc: 'Automatically identify data-heavy areas and inject Chart.js canvas elements with live rendering scripts.', icon: '📈' }
        ]
    }
] as const;

const EnhancePanel: React.FC<EnhancePanelProps> = ({ onEnhance }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onEnhance('file-populate', file);
            e.target.value = '';
        }
    };

    const handleOptionClick = (id: string) => {
        if (id === 'file-populate') {
            fileInputRef.current?.click();
        } else {
            onEnhance(id as EnhanceType);
        }
    };

    return (
        <div className="enhance-panel">
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".txt,.pdf,.csv,.json,.md"
                onChange={handleFileChange}
            />
            
            {ENHANCE_SECTIONS.map((section, idx) => (
                <div key={idx}>
                    <div className="enhance-section-label" style={idx > 0 ? { marginTop: '24px' } : {}}>
                        {section.title}
                    </div>
                    {section.items.map((item) => (
                        <button 
                            key={item.id} 
                            className={`enhance-option ${item.variant || ''}`} 
                            onClick={() => handleOptionClick(item.id)}
                            style={{ marginTop: '12px' }}
                        >
                            <span className="icon">{item.icon}</span>
                            <div className="text">
                                <strong>{item.label}</strong>
                                <span>{item.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default EnhancePanel;
