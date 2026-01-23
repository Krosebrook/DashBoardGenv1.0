
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { LayoutOption, Artifact } from '../../types';
import { ExpandIcon } from '../Icons';

interface LayoutsPanelProps {
    layouts: LayoutOption[];
    focusedArtifact: Artifact | null;
    onApply: (layout: LayoutOption) => void;
    onPreview: (e: React.MouseEvent, layout: LayoutOption, html: string) => void;
}

const LayoutsPanel: React.FC<LayoutsPanelProps> = ({ layouts, focusedArtifact, onApply, onPreview }) => {

    /**
     * Staff-grade content extraction.
     * We don't just want the body; we want to preserve the designer's intent
     * while stripping away any previously applied layout wrappers.
     */
    const baseContent = useMemo(() => {
        const rawHtml = focusedArtifact ? (focusedArtifact.originalHtml || focusedArtifact.html) : '';
        if (!rawHtml) return null;

        // Strip previous layout containers to prevent nesting recursion
        let cleanHtml = rawHtml.replace(/<div class="layout-container">([\s\S]*?)<\/div>(?=\s*<\/body>|\s*<script|$)/gim, '$1');

        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
        const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gim;
        
        const scripts = (cleanHtml.match(scriptRegex) || []).join('\n');
        const styles = (cleanHtml.match(styleRegex) || []).join('\n');

        const bodyContent = cleanHtml
            .replace(/<!DOCTYPE html>/gi, '')
            .replace(/<html\b[^>]*>/gi, '')
            .replace(/<\/html>/gi, '')
            .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
            .replace(/<body\b[^>]*>/gi, '')
            .replace(/<\/body>/gi, '')
            .replace(scriptRegex, '')
            .replace(styleRegex, '');

        return { bodyContent, scripts, styles };
    }, [focusedArtifact]);

    /**
     * Staff Designer Preview Strategy:
     * Instead of a generic scale, we calculate precise scaling per layout.
     * We also simulate high-fidelity browser environments for the thumbnails.
     */
    const getPreviewHtml = (layout: LayoutOption) => {
        // Fallback for empty state or generic previews
        if (!baseContent) {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { margin: 0; padding: 0; overflow: hidden; background: #09090b; display: flex; align-items: center; justify-content: center; height: 100vh; }
                        .preview-scaler { transform: scale(0.6); transform-origin: center; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
                    </style>
                </head>
                <body>
                    <div class="preview-scaler">${layout.previewHtml}</div>
                </body>
                </html>
            `;
        }

        const { bodyContent, scripts, styles } = baseContent;
        const isDefault = layout.name === "Standard Sidebar";
        const isMobile = layout.name === "Mobile Stack";

        // Precise simulation parameters
        const SIM_WIDTH = isMobile ? 375 : 1280;
        const SIM_HEIGHT = isMobile ? 812 : 800;
        
        // Target container in drawer is approx 180px wide. 
        // 180 / 1280 = 0.14 scale for desktop.
        // 180 / 375 = 0.48 scale for mobile.
        const targetScale = 180 / SIM_WIDTH;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                ${styles}
                <style>
                    body { 
                        margin: 0; padding: 0; overflow: hidden; background: #18181b; 
                        font-family: 'Inter', sans-serif; height: 100vh;
                        display: flex; align-items: center; justify-content: center;
                    }
                    .preview-scaler { 
                        width: ${SIM_WIDTH}px; 
                        height: ${SIM_HEIGHT}px; 
                        transform: scale(${targetScale}); 
                        transform-origin: center; 
                        pointer-events: none;
                        background: #fff;
                        box-shadow: 0 0 40px rgba(0,0,0,0.5);
                        border-radius: ${isMobile ? '40px' : '8px'};
                        overflow: hidden;
                        position: relative;
                    }
                    ${isMobile ? `
                        .preview-scaler::after {
                            content: ""; position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
                            width: 100px; height: 25px; background: #000; border-radius: 20px; z-index: 100;
                        }
                    ` : ''}
                    ::-webkit-scrollbar { width: 0px; background: transparent; }
                    ${!isDefault ? layout.css : ''}
                </style>
            </head>
            <body>
                <div class="preview-scaler">
                    ${!isDefault ? `<div class="layout-container">${bodyContent}</div>` : bodyContent}
                </div>
                ${scripts}
            </body>
            </html>
        `;
    };

    return (
        <div className="sexy-grid">
            {layouts.map((lo, i) => {
                const previewHtml = getPreviewHtml(lo);
                return (
                    <div key={i} className="sexy-card" onClick={() => onApply(lo)}>
                        <button className="expand-btn" onClick={(e) => onPreview(e, lo, previewHtml)} title="Full Preview">
                            <ExpandIcon />
                        </button>
                        <div className="sexy-preview">
                            <iframe 
                                srcDoc={previewHtml} 
                                title={`${lo.name} Preview`} 
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
                );
            })}
        </div>
    );
};

export default LayoutsPanel;
