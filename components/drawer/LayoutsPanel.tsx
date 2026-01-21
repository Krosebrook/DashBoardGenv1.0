
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutOption, Artifact } from '../../types';
import { ExpandIcon } from '../Icons';

interface LayoutsPanelProps {
    layouts: LayoutOption[];
    focusedArtifact: Artifact | null;
    onApply: (layout: LayoutOption) => void;
    onPreview: (e: React.MouseEvent, layout: LayoutOption) => void;
}

const LayoutsPanel: React.FC<LayoutsPanelProps> = ({ layouts, focusedArtifact, onApply, onPreview }) => {

    const getPreviewHtml = (layout: LayoutOption) => {
        // Use the focused artifact's code if available, otherwise fall back to the layout's static skeleton
        const baseHtml = focusedArtifact ? (focusedArtifact.originalHtml || focusedArtifact.html) : layout.previewHtml;

        // Extract internal scripts and styles to ensure interactivity in preview (e.g. Chart.js initialization)
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        
        let scripts = '';
        let styles = '';
        let match;
        
        while ((match = scriptRegex.exec(baseHtml)) !== null) scripts += match[0] + '\n';
        while ((match = styleRegex.exec(baseHtml)) !== null) styles += match[0] + '\n';

        // Strip structural tags for embedding
        let content = baseHtml
            .replace(/<!DOCTYPE html>/i, '')
            .replace(/<html[^>]*>/i, '')
            .replace(/<\/html>/i, '')
            .replace(/<head[^>]*>[\s\S]*?<\/head>/i, '')
            .replace(/<body[^>]*>/i, '')
            .replace(/<\/body>/i, '')
            .replace(scriptRegex, '')
            .replace(styleRegex, '');

        const isDefault = layout.name === "Standard Sidebar";

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <!-- External dependencies from the original head -->
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                ${styles}
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; background: transparent; font-family: 'Inter', sans-serif; }
                    /* Scale content down slightly for the card preview */
                    .preview-scaler { transform: scale(0.95); transform-origin: top left; width: 105.2%; height: 105.2%; }
                    ::-webkit-scrollbar { width: 0px; background: transparent; }
                    ${!isDefault ? layout.css : ''}
                </style>
            </head>
            <body>
                <div class="preview-scaler">
                    ${!isDefault ? `<div class="layout-container">${content}</div>` : content}
                </div>
                ${scripts}
            </body>
            </html>
        `;
    };

    return (
        <div className="sexy-grid">
            {layouts.map((lo, i) => (
                <div key={i} className="sexy-card" onClick={() => onApply(lo)}>
                    <button className="expand-btn" onClick={(e) => onPreview(e, lo)} title="Full Preview">
                        <ExpandIcon />
                    </button>
                    <div className="sexy-preview">
                        <iframe 
                            srcDoc={getPreviewHtml(lo)} 
                            title={lo.name} 
                            loading="lazy" 
                            sandbox="allow-scripts allow-same-origin"
                        />
                        <div className="preview-overlay-click"></div>
                    </div>
                    <div className="sexy-label">
                        {lo.name}
                        {focusedArtifact && <span className="live-badge">Live View</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LayoutsPanel;
