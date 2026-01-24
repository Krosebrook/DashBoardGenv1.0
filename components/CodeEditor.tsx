
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ReactIcon, ThinkingIcon } from './Icons';
import { GoogleGenAI } from '@google/genai';
import { extractComponentPrompt } from '../utils/aiHelpers';

interface CodeEditorProps {
    initialValue: string;
    onSave: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onSave }) => {
    const [value, setValue] = useState(initialValue);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractedCode, setExtractedCode] = useState<string | null>(null);
    const [targetFramework, setTargetFramework] = useState<string>('React');
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    // Sync local state if prop changes
    useEffect(() => {
        setValue(initialValue);
        setExtractedCode(null);
    }, [initialValue]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            setValue(newValue);
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                }
            }, 0);
        } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            onSave(value);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleExtractComponent = async () => {
        setIsExtracting(true);
        try {
             const apiKey = process.env.API_KEY;
             if (!apiKey) throw new Error("API_KEY is not configured.");
             const ai = new GoogleGenAI({ apiKey });
             const prompt = extractComponentPrompt(value, targetFramework);
             
             const response = await ai.models.generateContent({
                 model: 'gemini-3-flash-preview',
                 contents: [{ role: 'user', parts: [{ text: prompt }] }]
             });

             const code = response.text?.replace(/```[a-z]*|```/g, '').trim();
             if (code) setExtractedCode(code);

        } catch (e) {
            console.error("Extraction failed", e);
        } finally {
            setIsExtracting(false);
        }
    };

    const lineCount = value.split('\n').length;
    const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

    if (extractedCode) {
        return (
            <div className="code-editor-container">
                <div className="code-editor-toolbar">
                    <span className="editor-lang" style={{color: '#61dafb'}}>{targetFramework} Component</span>
                    <div style={{display:'flex', gap: '8px'}}>
                        <button className="editor-save-btn" onClick={() => navigator.clipboard.writeText(extractedCode)} style={{background: '#333'}}>
                            Copy Code
                        </button>
                        <button className="editor-save-btn" onClick={() => setExtractedCode(null)}>
                            Back to HTML
                        </button>
                    </div>
                </div>
                <div className="code-editor-wrapper">
                     <textarea
                        className="code-textarea"
                        value={extractedCode}
                        readOnly
                        style={{ color: '#a5b3ce' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="code-editor-container">
            <div className="code-editor-toolbar">
                <span className="editor-lang">HTML/CSS Source</span>
                <div style={{display:'flex', gap: '8px', alignItems: 'center'}}>
                    <select 
                        value={targetFramework}
                        onChange={(e) => setTargetFramework(e.target.value)}
                        style={{
                            background: '#2d3748', border: '1px solid #4a5568', color: '#fff',
                            borderRadius: '6px', padding: '6px', fontSize: '0.8rem', cursor: 'pointer'
                        }}
                    >
                        <option value="React">React (TSX)</option>
                        <option value="Vue">Vue 3</option>
                        <option value="Svelte">Svelte</option>
                        <option value="Angular">Angular</option>
                    </select>
                    <button 
                        className="editor-save-btn" 
                        onClick={handleExtractComponent} 
                        disabled={isExtracting}
                        style={{background: '#2d3748', border: '1px solid #4a5568'}}
                        title={`Convert to ${targetFramework} Component`}
                    >
                        {isExtracting ? <ThinkingIcon /> : <ReactIcon />} {isExtracting ? 'Converting...' : 'Extract'}
                    </button>
                    <button className="editor-save-btn" onClick={() => onSave(value)}>
                        Apply Changes (Cmd+S)
                    </button>
                </div>
            </div>
            <div className="code-editor-wrapper">
                <div className="line-numbers" ref={lineNumbersRef}>
                    {lines.map((line) => (
                        <div key={line} className="line-number">{line}</div>
                    ))}
                </div>
                <textarea
                    ref={textareaRef}
                    className="code-textarea"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                />
            </div>
        </div>
    );
};

export default CodeEditor;
