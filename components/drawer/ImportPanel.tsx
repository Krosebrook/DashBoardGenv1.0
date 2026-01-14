/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UploadIcon } from '../Icons';

interface ImportPanelProps {
    onImport: (html: string, fileName: string) => void;
}

export default function ImportPanel({ onImport }: ImportPanelProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setError('');
        if (file.type === 'text/html' || file.name.endsWith('.html')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setPreviewHtml(content);
                setFileName(file.name);
            };
            reader.readAsText(file);
        } else {
            setError('Please upload an HTML file (.html)');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleImportClick = () => {
        if (previewHtml) {
            onImport(previewHtml, fileName);
            setPreviewHtml('');
            setFileName('');
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="import-panel">
            <p className="panel-description">
                Upload an existing HTML dashboard file to edit, enhance, or generate variations.
            </p>

            {error && (
                <div className="import-error">
                    ⚠️ {error}
                </div>
            )}
            
            <div 
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <UploadIcon />
                <h3>Drop your HTML file here</h3>
                <p>or</p>
                <button className="browse-btn" onClick={handleBrowseClick}>
                    Browse Files
                </button>
                <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".html,text/html"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>

            {previewHtml && (
                <div className="import-preview">
                    <h3>Preview: {fileName}</h3>
                    <div className="preview-info">
                        <span>Size: {(previewHtml.length / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="preview-iframe-container">
                        <iframe 
                            srcDoc={previewHtml}
                            title="Import Preview"
                            sandbox="allow-same-origin"
                        />
                    </div>
                    <button className="import-confirm-btn" onClick={handleImportClick}>
                        Import Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
