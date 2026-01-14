/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

type EnhanceType = 'a11y' | 'format' | 'dummy' | 'responsive' | 'tailwind' | 'charts' | 'content';

interface EnhancePanelProps {
    onEnhance: (type: EnhanceType) => void;
}

const EnhancePanel: React.FC<EnhancePanelProps> = ({ onEnhance }) => {
    return (
        <div className="enhance-panel">
            <button className="enhance-option" onClick={() => onEnhance('charts')}>
                <span className="icon">📊</span>
                <div className="text"><strong>Inject Charts</strong><span>Add interactive Chart.js visualizations.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('dummy')}>
                <span className="icon">🔢</span>
                <div className="text"><strong>Populate Metrics</strong><span>Real-world KPIs, tables & data.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('content')}>
                <span className="icon">🖼️</span>
                <div className="text"><strong>Inject Real Content</strong><span>Names, descriptions & Unsplash images.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('a11y')}>
                <span className="icon">♿</span>
                <div className="text"><strong>Fix Accessibility (WCAG)</strong><span>Improve ARIA, contrast & semantics.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('responsive')}>
                <span className="icon">📱</span>
                <div className="text"><strong>Responsive Fix</strong><span>Mobile-friendly grids & flex.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('tailwind')}>
                <span className="icon">🌊</span>
                <div className="text"><strong>Convert to Tailwind</strong><span>Clean utility classes.</span></div>
            </button>
            <button className="enhance-option" onClick={() => onEnhance('format')}>
                <span className="icon">📝</span>
                <div className="text"><strong>Prettify Code</strong><span>Clean formatting & indentation.</span></div>
            </button>
        </div>
    );
};

export default EnhancePanel;