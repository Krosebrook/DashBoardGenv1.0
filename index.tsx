
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Vibe coded by ammaar@google.com

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

import { Artifact, Session, GenerationSettings } from './types';
import { INITIAL_PLACEHOLDERS, LAYOUT_OPTIONS } from './constants';
import { generateId } from './utils';
import { useHistory } from './hooks/useHistory';
import { loadSessions, saveSessions, clearSessions } from './utils/storage';
import { 
    buildEnhancementParts, 
    getEnhancementModel, 
    buildGenerationParts,
    getIterationPrompt 
} from './utils/aiHelpers';

// Components
import AuroraBackground from './components/AuroraBackground';
import NoiseOverlay from './components/NoiseOverlay';
import ArtifactCard from './components/ArtifactCard';
import SideDrawer from './components/SideDrawer';
import CodeEditor from './components/CodeEditor';
import ConfirmationModal from './components/ConfirmationModal';
import PreviewModal from './components/PreviewModal';

// Drawer Panels
import HistoryPanel from './components/drawer/HistoryPanel';
import SettingsPanel from './components/drawer/SettingsPanel';
import EnhancePanel, { EnhanceType } from './components/drawer/EnhancePanel';
import LayoutsPanel from './components/drawer/LayoutsPanel';

// Icons
import { 
    ThinkingIcon, CodeIcon, SparklesIcon, ArrowLeftIcon, 
    ArrowUpIcon, GridIcon, LayoutIcon, 
    UndoIcon, RedoIcon, SettingsIcon, WandIcon, ImageIcon, 
    CloseIcon, MicIcon, ZapIcon, DiffIcon, HistoryIcon, PaperclipIcon
} from './components/Icons';

function App() {
  // --- Global State & History ---
  const { 
      state: sessions, 
      set: setSessions, 
      undo, redo, canUndo, canRedo 
  } = useHistory<Session[]>(loadSessions());

  const [currentSessionIndex, setCurrentSessionIndex] = useState<number>(() => {
      const loaded = loadSessions();
      return loaded.length > 0 ? loaded.length - 1 : -1;
  });

  // --- UI State ---
  const [focusedArtifactIndex, setFocusedArtifactIndex] = useState<number | null>(null);
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedDataFile, setSelectedDataFile] = useState<File | null>(null);
  const [iterationInput, setIterationInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  
  const [settings, setSettings] = useState<GenerationSettings>(() => {
      const saved = localStorage.getItem('dashgen_settings');
      if (saved) return JSON.parse(saved);
      return {
          framework: 'vanilla',
          dataContext: '',
          autoA11y: false,
          autoCharts: true,
          autoPersonas: true
      };
  });

  useEffect(() => {
      localStorage.setItem('dashgen_settings', JSON.stringify(settings));
  }, [settings]);
  
  const [drawerState, setDrawerState] = useState<{
      isOpen: boolean;
      mode: 'code' | 'layouts' | 'settings' | 'enhance' | 'history' | null;
      title: string;
      data: any;
  }>({ isOpen: false, mode: null, title: '', data: null });

  const [previewItem, setPreviewItem] = useState<{html: string, name: string} | null>(null);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const iterationInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dataInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // --- Helpers ---
  const getAiClient = useCallback(() => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY is not configured.");
      return new GoogleGenAI({ apiKey });
  }, []);

  // --- Voice Input ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (focusedArtifactIndex !== null) {
            setIterationInput(transcript);
        } else {
            setInputValue(transcript);
        }
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [focusedArtifactIndex]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // --- Effects ---
  useEffect(() => {
      const handler = setTimeout(() => saveSessions(sessions), 1000); 
      return () => clearTimeout(handler);
  }, [sessions]);

  useEffect(() => {
      if (!isLoading && !selectedImage && !isListening && !selectedDataFile) {
          if (focusedArtifactIndex !== null) iterationInputRef.current?.focus();
          else inputRef.current?.focus();
      }
  }, [isLoading, selectedImage, isListening, focusedArtifactIndex, selectedDataFile]);

  useEffect(() => {
      const interval = setInterval(() => {
          setPlaceholderIndex(prev => (prev + 1) % INITIAL_PLACEHOLDERS.length);
      }, 3000);
      return () => clearInterval(interval);
  }, []);

  // --- Actions ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setSelectedImage(e.target.files[0]);
          inputRef.current?.focus();
      }
  };

  const handleDataSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setSelectedDataFile(e.target.files[0]);
          inputRef.current?.focus();
      }
  };

  const jumpToSession = useCallback((index: number) => {
      setCurrentSessionIndex(index);
      setFocusedArtifactIndex(null);
      setDrawerState(s => ({ ...s, isOpen: false }));
  }, []);

  const handleEnhance = async (type: EnhanceType, file?: File) => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1) return;
    setIsLoading(true);
    setDrawerState(s => ({ ...s, isOpen: false }));
    
    try {
        const ai = getAiClient();
        const currentSession = sessions[currentSessionIndex];
        const artifact = currentSession.artifacts[focusedArtifactIndex];
        
        const parts = await buildEnhancementParts(type, artifact.html, file);
        const model = getEnhancementModel(type);

        const response = await ai.models.generateContent({
             model,
             contents: [{ role: 'user', parts }]
        });
        
        const newHtml = response.text?.replace(/```html|```/g, '').trim() || artifact.html;
        
        setSessions(prev => prev.map((sess, i) => 
            i === currentSessionIndex ? {
                ...sess,
                artifacts: sess.artifacts.map((art, j) => 
                    j === focusedArtifactIndex ? { 
                        ...art, 
                        originalHtml: art.html,
                        html: newHtml, 
                        status: 'complete' 
                    } : art
                )
            } : sess
        ));
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleGenerateVariations = async () => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1 || isLoading) return;
    const currentSession = sessions[currentSessionIndex];
    const sourceArtifact = currentSession.artifacts[focusedArtifactIndex];
    
    setIsLoading(true);
    setFocusedArtifactIndex(null);

    try {
        const ai = getAiClient();
        const variationIds = [generateId(), generateId()];
        const newPlaceholders: Artifact[] = variationIds.map((id, i) => ({
            id,
            styleName: `Variation ${i + 1}`,
            html: '',
            status: 'streaming'
        }));

        setSessions(prev => prev.map((s, i) => i === currentSessionIndex ? {
            ...s,
            artifacts: [...s.artifacts, ...newPlaceholders]
        } : s));

        const generateVar = async (id: string, style: string) => {
            const prompt = `You are a Principal UI Engineer. 
            TASK: Create a distinct, high-fidelity variation of the dashboard provided below.
            
            DESIGN DIRECTION: ${style}
            
            INSTRUCTIONS:
            1. RETAIN: All data points, charts, and structural hierarchy.
            2. EVOLVE: The visual language (typography, spacing, corner radius, shadows, color palette).
            3. POLISH: Ensure WCAG AA contrast and professional "Dribbble-ready" aesthetics.
            4. OUTPUT: Return ONLY the raw HTML code (no markdown).

            CONTEXT: "${currentSession.prompt}"
            
            BASE CODE:
            ${sourceArtifact.html}`;

            const stream = await ai.models.generateContentStream({
                model: 'gemini-3-pro-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });

            let acc = '';
            for await (const chunk of stream) {
                if (chunk.text) {
                    acc += chunk.text;
                    setSessions(prev => prev.map(s => s.id === currentSession.id ? {
                        ...s,
                        artifacts: s.artifacts.map(a => a.id === id ? { ...a, html: acc } : a)
                    } : s));
                }
            }
            const final = acc.replace(/```html|```/g, '').trim();
            setSessions(prev => prev.map(s => s.id === currentSession.id ? {
                ...s,
                artifacts: s.artifacts.map(a => a.id === id ? { ...a, html: final, status: 'complete' } : a)
            } : s));
        };

        // Use distinct, high-value themes
        await Promise.all([
            generateVar(variationIds[0], "Modern Minimalist (Clean, Airy, Inter font, Soft Shadows)"),
            generateVar(variationIds[1], "Futuristic Cyberpunk (Dark, Neon Accents, Mono font, Glassmorphism)")
        ]);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleIterate = async () => {
      if (focusedArtifactIndex === null || currentSessionIndex === -1 || !iterationInput.trim() || isLoading) return;
      const instruction = iterationInput.trim();
      setIterationInput('');
      setIsLoading(true);

      try {
          const ai = getAiClient();
          const currentSession = sessions[currentSessionIndex];
          const artifact = currentSession.artifacts[focusedArtifactIndex];
          const prompt = getIterationPrompt(instruction, artifact.html);

          const responseStream = await ai.models.generateContentStream({
              model: 'gemini-3-pro-preview',
              contents: [{ role: 'user', parts: [{ text: prompt }] }]
          });

          let acc = '';
          for await (const chunk of responseStream) {
              if (chunk.text) {
                  acc += chunk.text;
                  setSessions(prev => prev.map(s => s.id === currentSession.id ? {
                      ...s,
                      artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, html: acc, status: 'streaming' } : a)
                  } : s));
              }
          }
          
          const final = acc.replace(/```html|```/g, '').trim();
          setSessions(prev => prev.map(s => s.id === currentSession.id ? {
              ...s,
              artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, originalHtml: a.html, html: final, status: 'complete' } : a)
          } : s));
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleSendMessage = useCallback(async (manualPrompt?: string) => {
    const promptToUse = manualPrompt || inputValue;
    const trimmed = promptToUse.trim();
    const hasImage = !!selectedImage;
    const hasData = !!selectedDataFile;

    if ((!trimmed && !hasImage && !hasData) || isLoading) return;
    
    if (!manualPrompt) {
        setInputValue('');
        setSelectedImage(null);
        setSelectedDataFile(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (dataInputRef.current) dataInputRef.current.value = '';
    }

    setIsLoading(true);
    const sessionId = generateId();
    const placeholderArtifacts: Artifact[] = Array(3).fill(null).map((_, i) => ({
        id: `${sessionId}_${i}`,
        styleName: 'Designing...',
        html: '',
        status: 'streaming',
    }));

    let sessionPrompt = trimmed;
    if (hasImage) sessionPrompt = `Vision Clone + "${trimmed}"`;
    if (hasData) sessionPrompt = `Data Viz (${selectedDataFile?.name}) + "${trimmed}"`;

    const newSession: Session = {
        id: sessionId,
        prompt: sessionPrompt,
        timestamp: Date.now(),
        artifacts: placeholderArtifacts
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionIndex(prev => prev + 1); 
    setFocusedArtifactIndex(null); 

    try {
        const ai = getAiClient();
        let styles = (hasImage || hasData) 
            ? ["Exact Representation", "Modern Refinement", "Dark Theme variant"] 
            : ["Concept Alpha", "Concept Beta", "Concept Gamma"];

        if (!hasImage && !hasData) {
            const stylePrompt = `Generate 3 distinct UI concept names for: "${trimmed}". JSON array of strings only.`;
            const styleRes = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [{ role: 'user', parts: [{ text: stylePrompt }] }]
            });
            try {
                const parsed = JSON.parse(styleRes.text?.match(/\[[\s\S]*\]/)?.[0] || '[]');
                if (Array.isArray(parsed) && parsed.length === 3) styles = parsed;
            } catch(e) {}
        }

        setSessions(prev => prev.map(s => s.id === sessionId ? {
            ...s,
            artifacts: s.artifacts.map((art, i) => ({ ...art, styleName: styles[i] }))
        } : s));

        const generate = async (artifact: Artifact, style: string) => {
            // Updated to pass selectedDataFile
            const parts = await buildGenerationParts(
                trimmed, 
                style, 
                settings, 
                hasImage ? selectedImage! : undefined,
                hasData ? selectedDataFile! : undefined
            );
            // Use Pro model if we have data or image for higher fidelity/reasoning
            const model = (hasImage || hasData) ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

            const stream = await ai.models.generateContentStream({ model, contents: [{ parts, role: "user" }] });
            let acc = '';
            for await (const chunk of stream) {
                if (chunk.text) {
                    acc += chunk.text;
                    setSessions(prev => prev.map(s => s.id === sessionId ? {
                        ...s,
                        artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, html: acc } : a)
                    } : s));
                }
            }
            const final = acc.replace(/```html|```/g, '').trim();
            setSessions(prev => prev.map(s => s.id === sessionId ? {
                ...s,
                artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, html: final, status: 'complete' } : a)
            } : s));
        };

        await Promise.all(placeholderArtifacts.map((art, i) => generate(art, styles[i])));
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [inputValue, selectedImage, selectedDataFile, isLoading, settings, getAiClient, setSessions]);

  const handleExportToStackBlitz = () => {
    if (focusedArtifactIndex === null || !currentSession) return;
    const artifact = currentSession.artifacts[focusedArtifactIndex];
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://stackblitz.com/run?file=index.html';
    form.target = '_blank';

    const files: Record<string, string> = {
        'index.html': artifact.html,
        'package.json': JSON.stringify({ name: "dashgen-export", dependencies: {}, scripts: { start: "serve ." } })
    };

    Object.entries(files).forEach(([name, content]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `project[files][${name}]`;
        input.value = content;
        form.appendChild(input);
    });

    const titleInput = document.createElement('input');
    titleInput.type = 'hidden';
    titleInput.name = 'project[title]';
    titleInput.value = `DashGen: ${currentSession.prompt.substring(0, 30)}...`;
    form.appendChild(titleInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const hasStarted = sessions.length > 0 || isLoading;
  const currentSession = sessions[currentSessionIndex];

  return (
    <>
        <ConfirmationModal
            isOpen={isConfirmingClear}
            title="Wipe Workspace?"
            message="This will permanently delete all session history and artifacts. Are you sure?"
            confirmText="Wipe Everything" cancelText="Keep it"
            onConfirm={() => { clearSessions(); setSessions([]); setCurrentSessionIndex(-1); setFocusedArtifactIndex(null); setDrawerState(s => ({...s, isOpen: false})); setIsConfirmingClear(false); }}
            onCancel={() => setIsConfirmingClear(false)}
        />

        <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />

        {focusedArtifactIndex !== null && (
            <button className="floating-back-btn" onClick={() => {setFocusedArtifactIndex(null); setIsDiffMode(false);}} title="Back to Grid">
                <ArrowLeftIcon /> <span>Back</span>
            </button>
        )}

        <div className="global-controls">
            <button className="icon-btn" onClick={() => setDrawerState({ isOpen: true, mode: 'history', title: 'History', data: null })}><HistoryIcon /></button>
            <div className="divider"></div>
            <button className="icon-btn" disabled={!canUndo} onClick={undo}><UndoIcon /></button>
            <button className="icon-btn" disabled={!canRedo} onClick={redo}><RedoIcon /></button>
            <div className="divider"></div>
            <button className="icon-btn" onClick={() => setDrawerState({ isOpen: true, mode: 'settings', title: 'Settings', data: null })}><SettingsIcon /></button>
        </div>

        <SideDrawer 
            isOpen={drawerState.isOpen} 
            onClose={() => setDrawerState(s => ({...s, isOpen: false}))} 
            title={drawerState.title} 
            position={drawerState.mode === 'history' ? 'left' : 'right'}
        >
            {drawerState.mode === 'history' && <HistoryPanel sessions={sessions} currentSessionIndex={currentSessionIndex} onJumpToSession={jumpToSession} onDeleteSession={(id, e) => { e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== id)); }} />}
            {drawerState.mode === 'settings' && <SettingsPanel settings={settings} onSettingsChange={setSettings} onClearHistoryRequest={() => setIsConfirmingClear(true)} />}
            {drawerState.mode === 'enhance' && <EnhancePanel onEnhance={handleEnhance} />}
            {drawerState.mode === 'code' && <CodeEditor initialValue={drawerState.data} onSave={(v) => {
                setSessions(prev => prev.map((sess, i) => i === currentSessionIndex ? { ...sess, artifacts: sess.artifacts.map((art, j) => j === focusedArtifactIndex ? { ...art, html: v } : art) } : sess));
            }} />}
            {drawerState.mode === 'layouts' && <LayoutsPanel layouts={LAYOUT_OPTIONS} focusedArtifact={currentSession?.artifacts[focusedArtifactIndex!] || null} onApply={(lo) => {
                if (focusedArtifactIndex === null) return;
                const art = currentSession.artifacts[focusedArtifactIndex];
                const base = art.originalHtml || art.html;
                
                const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
                const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gim;
                const scripts = (base.match(scriptRegex) || []).join('\n');
                const styles = (base.match(styleRegex) || []).join('\n');
                const bodyContent = base
                    .replace(/<!DOCTYPE html>/gi, '')
                    .replace(/<html\b[^>]*>/gi, '')
                    .replace(/<\/html>/gi, '')
                    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
                    .replace(/<body\b[^>]*>/gi, '')
                    .replace(/<\/body>/gi, '')
                    .replace(scriptRegex, '')
                    .replace(styleRegex, '');

                const wrapped = lo.name === "Standard Sidebar" 
                    ? base 
                    : `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <script src="https://cdn.tailwindcss.com"></script>
                            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                            ${styles}
                            <style>${lo.css}</style>
                        </head>
                        <body>
                            <div class="layout-container">${bodyContent}</div>
                            ${scripts}
                        </body>
                        </html>
                    `;
                
                setSessions(prev => prev.map((s, i) => i === currentSessionIndex ? { ...s, artifacts: s.artifacts.map((a, j) => j === focusedArtifactIndex ? { ...a, html: wrapped, originalHtml: base, status: 'complete' } : a) } : s));
                setDrawerState(s => ({...s, isOpen: false}));
            }} onPreview={(e, lo, html) => {
                e.stopPropagation();
                setPreviewItem({ name: lo.name, html });
            }} />}
        </SideDrawer>

        <div className="immersive-app">
            <AuroraBackground opacity={0.4} speed="medium" showGrain={true} />
            <NoiseOverlay opacity={0.06} blendMode="soft-light" />
            
            <div className={`stage-container ${focusedArtifactIndex !== null ? 'mode-focus' : 'mode-split'}`}>
                 {!hasStarted && (
                     <div className="empty-state">
                         <div className="empty-content">
                             <h1>DashGen</h1>
                             <p>Pro-grade Dashboards from Vision, Voice, or Text</p>
                             <div className="quick-start-wrapper">
                                <button className="surprise-button" onClick={() => handleSendMessage(INITIAL_PLACEHOLDERS[placeholderIndex])} disabled={isLoading}>
                                    <SparklesIcon /> Quick Start
                                </button>
                             </div>
                         </div>
                     </div>
                 )}
                {sessions.map((session, sIndex) => (
                    <div key={session.id} className={`session-group ${sIndex === currentSessionIndex ? 'active-session' : (sIndex < currentSessionIndex ? 'past-session' : 'future-session')}`}>
                        <div className="artifact-grid">
                            {session.artifacts.map((artifact, aIndex) => (
                                <ArtifactCard key={artifact.id} artifact={artifact} isFocused={focusedArtifactIndex === aIndex} isDiffMode={isDiffMode} onClick={() => setFocusedArtifactIndex(aIndex)} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className={`action-bar ${focusedArtifactIndex !== null ? 'visible' : ''}`}>
                 <div className="iteration-chat-container">
                    <div className={`iteration-wrapper ${isLoading ? 'loading' : ''} ${isListening ? 'listening' : ''}`}>
                        <button className={`mic-btn ${isListening ? 'active' : ''}`} onClick={toggleListening}>
                            <MicIcon />
                        </button>
                        <input 
                            ref={iterationInputRef}
                            type="text" 
                            placeholder={isListening ? "Listening..." : "Tell AI what to refine..."} 
                            value={iterationInput} 
                            onChange={(e) => setIterationInput(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleIterate()} 
                            disabled={isLoading} 
                        />
                        <button className="iteration-send-btn" onClick={handleIterate} disabled={isLoading || !iterationInput.trim()}>
                            {isLoading ? <ThinkingIcon /> : <ArrowUpIcon />}
                        </button>
                    </div>
                 </div>
                 <div className="action-buttons">
                    <button onClick={handleGenerateVariations} className="variations-btn-pulse" title="Generate Style Variations" aria-label="Generate Variations"><SparklesIcon /> Generate Variations</button>
                    <button onClick={() => {setFocusedArtifactIndex(null); setIsDiffMode(false);}} title="Back to Grid"><GridIcon /> Grid</button>
                    <button onClick={() => setIsDiffMode(!isDiffMode)} className={isDiffMode ? 'active' : ''} title="Compare Versions"><DiffIcon /> Comparison</button>
                    <button onClick={() => setDrawerState({ isOpen: true, mode: 'enhance', title: 'AI Enhancements', data: null })} title="AI Refinements"><WandIcon /> AI Enhancements</button>
                    <button onClick={() => setDrawerState({ isOpen: true, mode: 'layouts', title: 'Layout Templates', data: null })} title="Switch Layouts"><LayoutIcon /> Layouts</button>
                    <button onClick={handleExportToStackBlitz} title="Open in Cloud IDE"><ZapIcon /> Cloud Export</button>
                    <button onClick={() => setDrawerState({ isOpen: true, mode: 'code', title: 'Direct Code Edit', data: currentSession?.artifacts[focusedArtifactIndex!].html })} title="Direct Editor"><CodeIcon /> Editor</button>
                 </div>
            </div>

            <div className={`floating-input-container ${focusedArtifactIndex !== null ? 'hidden' : ''} ${!hasStarted ? 'centered' : ''}`}>
                <div className="floating-input-stack">
                    {selectedImage && (
                        <div className="image-preview-pill">
                            <span>Image Attached</span>
                            <button onClick={() => setSelectedImage(null)}><CloseIcon /></button>
                        </div>
                    )}
                    {selectedDataFile && (
                        <div className="image-preview-pill" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                            <span>Data: {selectedDataFile.name}</span>
                            <button onClick={() => setSelectedDataFile(null)}><CloseIcon /></button>
                        </div>
                    )}
                    <div className={`input-wrapper ${isLoading ? 'loading' : ''} ${isListening ? 'listening' : ''}`}>
                        <input type="file" accept="image/*" ref={imageInputRef} style={{ display: 'none' }} onChange={handleImageSelect} />
                        <input type="file" accept=".csv,.json,.txt,.md,.pdf" ref={dataInputRef} style={{ display: 'none' }} onChange={handleDataSelect} />
                        
                        <button className="upload-btn" onClick={() => imageInputRef.current?.click()} title="Vision-to-Code">
                            <ImageIcon />
                        </button>
                        <button className="upload-btn" onClick={() => dataInputRef.current?.click()} title="Attach Data Source (CSV/JSON/PDF)">
                            <PaperclipIcon />
                        </button>
                        <button className={`mic-btn ${isListening ? 'active' : ''}`} onClick={toggleListening} title="Voice Prompt">
                            <MicIcon />
                        </button>
                        <input 
                            ref={inputRef} 
                            type="text" 
                            placeholder={isListening ? "Listening..." : (selectedImage ? "Describe changes..." : (selectedDataFile ? "Visualize this data..." : INITIAL_PLACEHOLDERS[placeholderIndex]))} 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                        />
                        <button className="send-button" onClick={() => handleSendMessage()} disabled={isLoading || (!inputValue.trim() && !selectedImage && !selectedDataFile)}>
                            <ArrowUpIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
