/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DownloadIcon } from '../Icons';

interface ExportPanelProps {
    currentHtml: string;
    dashboardName: string;
}

export default function ExportPanel({ currentHtml, dashboardName }: ExportPanelProps) {
    const [selectedFormat, setSelectedFormat] = useState<'html' | 'react' | 'json'>('html');
    const [copySuccess, setCopySuccess] = useState<string>('');

    const convertToReact = (html: string): string => {
        // Extract styles and body content
        const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        
        const styles = styleMatch ? styleMatch[1] : '';
        const bodyContent = bodyMatch ? bodyMatch[1] : html;

        // Simple conversion for export display only (not executed)
        // This is safe as the output is only shown in a code preview, not rendered as HTML
        // Convert HTML attributes to JSX and remove comments
        let jsxContent = bodyContent
            .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
            .replace(/class=/g, 'className=')
            .replace(/for=/g, 'htmlFor=')
            .trim();

        return `import React from 'react';

export default function Dashboard() {
  return (
    <>
      <style>{\`
${styles}
      \`}</style>
      ${jsxContent}
    </>
  );
}`;
    };

    const convertToJson = (html: string): string => {
        // Extract key information for configuration
        const config = {
            name: dashboardName,
            version: '1.0.0',
            description: 'Dashboard configuration',
            timestamp: new Date().toISOString(),
            html: html,
            metadata: {
                framework: 'html',
                responsive: true,
                darkMode: false
            },
            components: extractComponents(html)
        };

        return JSON.stringify(config, null, 2);
    };

    const extractComponents = (html: string): any[] => {
        const components: any[] = [];
        
        // Simple extraction of common dashboard elements
        if (html.includes('sidebar') || html.includes('nav')) {
            components.push({ type: 'sidebar', found: true });
        }
        if (html.includes('stat') || html.includes('metric')) {
            components.push({ type: 'metrics', found: true });
        }
        if (html.includes('table')) {
            components.push({ type: 'table', found: true });
        }
        if (html.includes('chart') || html.includes('Chart')) {
            components.push({ type: 'charts', found: true });
        }

        return components;
    };

    const getExportContent = (): string => {
        switch (selectedFormat) {
            case 'html':
                return currentHtml;
            case 'react':
                return convertToReact(currentHtml);
            case 'json':
                return convertToJson(currentHtml);
            default:
                return currentHtml;
        }
    };

    const getFileExtension = (): string => {
        switch (selectedFormat) {
            case 'html':
                return 'html';
            case 'react':
                return 'jsx';
            case 'json':
                return 'json';
            default:
                return 'html';
        }
    };

    const handleDownload = () => {
        const content = getExportContent();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dashboardName}.${getFileExtension()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        const content = getExportContent();
        navigator.clipboard.writeText(content).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const formatOptions = [
        {
            id: 'html',
            name: 'HTML',
            icon: '📄',
            description: 'Standalone HTML file with inline CSS'
        },
        {
            id: 'react',
            name: 'React Component',
            icon: '⚛️',
            description: 'React JSX component with styles'
        },
        {
            id: 'json',
            name: 'JSON Config',
            icon: '📋',
            description: 'Dashboard configuration as JSON'
        }
    ];

    return (
        <div className="export-panel">
            <p className="panel-description">
                Export your dashboard in multiple formats for different use cases.
            </p>

            <div className="format-options">
                {formatOptions.map(format => (
                    <button
                        key={format.id}
                        className={`format-option ${selectedFormat === format.id ? 'selected' : ''}`}
                        onClick={() => setSelectedFormat(format.id as any)}
                    >
                        <span className="format-icon">{format.icon}</span>
                        <div className="format-details">
                            <div className="format-name">{format.name}</div>
                            <div className="format-desc">{format.description}</div>
                        </div>
                        {selectedFormat === format.id && (
                            <span className="format-check">✓</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="code-preview">
                <div className="preview-header">
                    <span>Preview</span>
                    <span className="file-name">{dashboardName}.{getFileExtension()}</span>
                </div>
                <pre className="code-content">
                    <code>{getExportContent()}</code>
                </pre>
            </div>

            <div className="export-actions">
                <button className="export-action-btn copy-btn" onClick={handleCopy}>
                    📋 {copySuccess || 'Copy to Clipboard'}
                </button>
                <button className="export-action-btn download-btn" onClick={handleDownload}>
                    <DownloadIcon /> Download File
                </button>
            </div>

            <div className="export-tips">
                <h4>💡 Tips</h4>
                <ul>
                    <li><strong>HTML:</strong> Ready to deploy - just upload to any web server</li>
                    <li><strong>React:</strong> Import into your React app and customize further. Note: Complex HTML may require manual JSX adjustments.</li>
                    <li><strong>JSON:</strong> Use for configuration management or API integration</li>
                </ul>
            </div>
        </div>
    );
}
