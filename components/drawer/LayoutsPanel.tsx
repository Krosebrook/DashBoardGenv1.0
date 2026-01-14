
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

        // --- Robust HTML Parsing for Previews ---
        
        let styleContent = '';
        let headContent = '';
        let bodyContent = baseHtml;
        let bodyAttrs = '';

        // 1. Extract content from <style> tags
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let match;
        while ((match = styleRegex.exec(baseHtml)) !== null) {
            styleContent += match[1] + '\n';
        }

        // 2. Extract content from <head> (keeping scripts/links but removing styles)
        const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
        const headMatch = headRegex.exec(baseHtml);
        if (headMatch) {
            headContent = headMatch[1].replace(styleRegex, '');
        }

        // 3. Extract content from <body> tags including attributes (classes, styles)
        const bodyRegex = /<body([^>]*)>([\s\S]*?)<\/body>/i;
        const bodyMatch = bodyRegex.exec(baseHtml);
        
        if (bodyMatch) {
            bodyAttrs = bodyMatch[1];
            bodyContent = bodyMatch[2];
        } else {
            // Fallback: strip structural tags
            bodyContent = baseHtml.replace(styleRegex, '')
                                  .replace(headRegex, '')
                                  .replace(/<!DOCTYPE html>/i, '')
                                  .replace(/<html[^>]*>/i, '')
                                  .replace(/<\/html>/i, '');
        }

        // 4. Construct the clean preview document
        // We ensure body has overflow: hidden to prevent scrollbars in thumbnails.
        // We wrap content in .layout-container to support layout CSS scoping.
        return `
            <!DOCTYPE html>
            <html>
            <head>
                ${headContent}
                <style>
                    /* Reset & Base Preview Styles */
                    body { margin: 0; padding: 0; overflow: hidden; }
                    /* Scrollbar hiding for cleaner thumbnails */
                    ::-webkit-scrollbar { width: 0px; background: transparent; }
                    
                    /* Extracted Artifact Styles */
                    ${styleContent}

                    /* Layout Styles */
                    ${layout.css}
                </style>
            </head>
            <body ${bodyAttrs}>
                <div class="layout-container">
                    ${bodyContent}
                </div>
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
                        {/* Overlay to prevent iframe interaction so the click event bubbles to the card */}
                        <div className="preview-overlay-click"></div>
                    </div>
                    <div className="sexy-label">
                        {lo.name}
                        {focusedArtifact && <span className="live-badge">Live</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LayoutsPanel;
