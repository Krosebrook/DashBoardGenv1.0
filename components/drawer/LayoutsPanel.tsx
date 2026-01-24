
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { LayoutOption, Artifact } from '../../types';
import { ExpandIcon } from '../Icons';
import { extractBodyContent } from '../../utils/htmlParser';

interface LayoutsPanelProps {
    layouts: LayoutOption[];
    focusedArtifact: Artifact | null;
    onApply: (layout: LayoutOption) => void;
    onPreview: (e: React.MouseEvent, layout: LayoutOption, html: string) => void;
}

const LayoutsPanel: React.FC<LayoutsPanelProps> = ({ layouts, focusedArtifact, onApply, onPreview }) => {

    const baseContent = useMemo(() => {
        const rawHtml = focusedArtifact ? (focusedArtifact.originalHtml || focusedArtifact.html) : '';
        return extractBodyContent(rawHtml);
    }, [focusedArtifact]);

    const getPreviewHtml = (layout: LayoutOption) => {
        if (!baseContent.body) {
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

        const { body, scripts, styles } = baseContent;
        const isDefault = layout.name === "Standard Sidebar";
        const isMobile = layout.name === "Mobile Stack";

        const SIM_WIDTH = isMobile ? 375 : 1280;
        const SIM_HEIGHT = isMobile ? 812 : 800;
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
                    ${!isDefault ? `<div class="layout-container">${body}</div>` : body}
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
