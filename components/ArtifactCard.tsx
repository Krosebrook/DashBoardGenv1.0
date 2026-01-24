
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Artifact } from '../types';
import { DesktopIcon, TabletIcon, MobileIcon } from './Icons';

interface ArtifactCardProps {
    artifact: Artifact;
    isFocused: boolean;
    isDiffMode?: boolean;
    isInspectMode?: boolean;
    onClick: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const ArtifactCard = React.memo(({ 
    artifact, 
    isFocused, 
    isDiffMode = false,
    isInspectMode = false,
    onClick 
}: ArtifactCardProps) => {
    const codeRef = useRef<HTMLPreElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
    const [showBefore, setShowBefore] = useState(false);

    // Auto-scroll logic for this specific card
    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
    }, [artifact.html]);

    // Reset to desktop when focus is lost or artifact changes
    useEffect(() => {
        if (!isFocused) {
            setDeviceMode('desktop');
            setShowBefore(false);
        }
    }, [isFocused]);

    // Inject Inspector & Error Handling Scripts
    const displayHtml = useMemo(() => {
        const baseHtml = (isDiffMode && showBefore && artifact.originalHtml) 
            ? artifact.originalHtml 
            : artifact.html;
        
        if (!baseHtml) return '';

        // Script to handle inspector hover/click and error reporting
        const injection = `
            <script>
                window.__INSPECT_MODE__ = ${isInspectMode};

                // --- Error Reporting ---
                window.onerror = function(msg, source, lineno, colno, error) {
                    window.parent.postMessage({ type: 'RUNTIME_ERROR', error: msg, source: source }, '*');
                };

                // --- Inspector Mode ---
                document.addEventListener('mouseover', (e) => {
                    if (!window.__INSPECT_MODE__) return;
                    e.stopPropagation();
                    e.target.style.outline = '2px solid #3b82f6';
                    e.target.style.cursor = 'crosshair';
                });

                document.addEventListener('mouseout', (e) => {
                    if (!window.__INSPECT_MODE__) return;
                    e.stopPropagation();
                    e.target.style.outline = '';
                    e.target.style.cursor = '';
                });

                document.addEventListener('click', (e) => {
                    if (!window.__INSPECT_MODE__) return;
                    e.preventDefault();
                    e.stopPropagation();
                    // Send the outerHTML of the selected element
                    window.parent.postMessage({ 
                        type: 'ELEMENT_SELECTED', 
                        html: e.target.outerHTML,
                        tagName: e.target.tagName.toLowerCase()
                    }, '*');
                });
                
                // --- Message Listener to Toggle Mode Dynamically ---
                window.addEventListener('message', (event) => {
                    if (event.data.type === 'TOGGLE_INSPECT') {
                        window.__INSPECT_MODE__ = event.data.value;
                    }
                });
            </script>
            <style>
                ${isInspectMode ? '* { cursor: crosshair !important; }' : ''}
            </style>
        `;

        // Inject before closing body tag or at end if missing
        if (baseHtml.includes('</body>')) {
            return baseHtml.replace('</body>', `${injection}</body>`);
        } else {
            return baseHtml + injection;
        }
    }, [artifact.html, artifact.originalHtml, isDiffMode, showBefore, isInspectMode]);

    // Send dynamic update to iframe if mode changes to avoid full reload
    useEffect(() => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'TOGGLE_INSPECT', value: isInspectMode }, '*');
        }
    }, [isInspectMode]);

    const isBlurring = artifact.status === 'streaming';

    return (
        <div 
            className={`artifact-card ${isFocused ? 'focused' : ''} ${isBlurring ? 'generating' : ''} ${isDiffMode ? 'diff-view' : ''}`}
            onClick={onClick}
        >
            <div className="artifact-header">
                <span className="artifact-style-tag">
                    {isDiffMode ? (showBefore ? 'ORIGINAL VERSION' : 'NEW VERSION') : artifact.styleName}
                </span>
                
                {isFocused && (
                    <div className="header-controls" onClick={(e) => e.stopPropagation()}>
                        {isDiffMode && artifact.originalHtml && (
                            <button 
                                className={`diff-toggle-btn ${showBefore ? 'active' : ''}`}
                                onClick={() => setShowBefore(!showBefore)}
                            >
                                {showBefore ? 'Show New' : 'Compare Original'}
                            </button>
                        )}
                        <div className="device-toggles">
                            <button 
                                className={`device-btn ${deviceMode === 'mobile' ? 'active' : ''}`} 
                                onClick={() => setDeviceMode('mobile')}
                                title="Mobile View (375px)"
                            ><MobileIcon /></button>
                            <button 
                                className={`device-btn ${deviceMode === 'tablet' ? 'active' : ''}`} 
                                onClick={() => setDeviceMode('tablet')}
                                title="Tablet View (768px)"
                            ><TabletIcon /></button>
                            <button 
                                className={`device-btn ${deviceMode === 'desktop' ? 'active' : ''}`} 
                                onClick={() => setDeviceMode('desktop')}
                                title="Desktop View (Full)"
                            ><DesktopIcon /></button>
                        </div>
                    </div>
                )}
            </div>
            <div className={`artifact-card-inner mode-${deviceMode}`}>
                {isBlurring && (
                    <div className="generating-overlay">
                        <pre ref={codeRef} className="code-stream-preview">
                            {artifact.html}
                        </pre>
                    </div>
                )}
                <div className="iframe-wrapper">
                    <iframe 
                        ref={iframeRef}
                        key={`${artifact.id}-${showBefore}`} // Remount on major content switch, but not inspect toggle
                        srcDoc={displayHtml} 
                        title={artifact.id} 
                        sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin"
                        className="artifact-iframe"
                    />
                </div>
            </div>
        </div>
    );
});

export default ArtifactCard;
