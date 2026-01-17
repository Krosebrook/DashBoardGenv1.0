
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
    getGenerationPrompt, 
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
    ArrowUpIcon, GridIcon, LayoutIcon, DownloadIcon, 
    CopyIcon, HistoryIcon, UndoIcon, RedoIcon, 
    SettingsIcon, WandIcon, RefreshIcon 
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
  const [inputValue, setInputValue] = useState<string>('');
  const [iterationInput, setIterationInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
      framework: 'vanilla',
      dataContext: '',
      autoA11y: false
  });
  
  // Drawer State
  const [drawerState, setDrawerState] = useState<{
      isOpen: boolean;
      mode: 'code' | 'layouts' | 'settings' | 'enhance' | 'history' | null;
      title: string;
      data: any;
  }>({ isOpen: false, mode: null, title: '', data: null });

  // Preview & Copy State
  const [previewItem, setPreviewItem] = useState<{html: string, name: string} | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copy Code');

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const getAiClient = useCallback(() => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY is not configured.");
      return new GoogleGenAI({ apiKey });
  }, []);

  // --- Effects ---
  
  // Auto-save sessions
  useEffect(() => {
      const handler = setTimeout(() => saveSessions(sessions), 1000); 
      return () => clearTimeout(handler);
  }, [sessions]);

  // Focus input on idle
  useEffect(() => {
      if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  // Global Keyboard Shortcuts
  useEffect(() => {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
              e.preventDefault();
              if (e.shiftKey) { if (canRedo) redo(); } else { if (canUndo) undo(); }
          }
      };
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Rotate Placeholders
  useEffect(() => {
      const interval = setInterval(() => {
          setPlaceholderIndex(prev => (prev + 1) % INITIAL_PLACEHOLDERS.length);
      }, 3000);
      return () => clearInterval(interval);
  }, []);

  // --- AI Actions ---

  const handleEnhance = async (type: EnhanceType, file?: File) => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1) return;
    setIsLoading(true);
    setDrawerState(s => ({ ...s, isOpen: false }));
    
    try {
        const ai = getAiClient();
        const currentSession = sessions[currentSessionIndex];
        const artifact = currentSession.artifacts[focusedArtifactIndex];
        
        // Use helper to construct multimodal request
        const parts = await buildEnhancementParts(type, artifact.html, file);
        const model = getEnhancementModel(type);

        const response = await ai.models.generateContent({
             model,
             contents: [{ role: 'user', parts }]
        });
        
        const newHtml = response.text?.replace(/```html|```/g, '').trim() || artifact.html;
        
        // Update state
        setSessions(prev => prev.map((sess, i) => 
            i === currentSessionIndex ? {
                ...sess,
                artifacts: sess.artifacts.map((art, j) => 
                    j === focusedArtifactIndex ? { 
                        ...art, 
                        html: newHtml, 
                        originalHtml: newHtml, // Update original reference for layouts
                        status: 'complete' 
                    } : art
                )
            } : sess
        ));
    } catch (e) {
        console.error("Enhance failed", e);
    } finally {
        setIsLoading(false);
    }
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

          // Stream handling
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
              artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, html: final, status: 'complete' } : a)
          } : s));
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleRefresh = async () => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1 || isLoading) return;
    
    // Setup for regeneration
    const currentSession = sessions[currentSessionIndex];
    const artifact = currentSession.artifacts[focusedArtifactIndex];
    setIsLoading(true);
    
    // Clear current artifact to show streaming state
    setSessions(prev => prev.map((sess, i) => i === currentSessionIndex ? {
        ...sess,
        artifacts: sess.artifacts.map((art, j) => j === focusedArtifactIndex ? { ...art, html: '', status: 'streaming' } : art)
    } : sess));

    try {
        const ai = getAiClient();
        const prompt = `Regenerate this Dashboard UI fresh based on: "${currentSession.prompt}". Concept: ${artifact.styleName}. Return raw HTML only.`;
        
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        
        let acc = '';
        for await (const chunk of responseStream) {
            if (chunk.text) {
                acc += chunk.text;
                setSessions(prev => prev.map(s => s.id === currentSession.id ? {
                    ...s,
                    artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, html: acc } : a)
                } : s));
            }
        }
        
        const final = acc.replace(/```html|```/g, '').trim();
        setSessions(prev => prev.map(s => s.id === currentSession.id ? {
            ...s,
            artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, html: final, status: 'complete' } : a)
        } : s));
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleSendMessage = useCallback(async (manualPrompt?: string) => {
    const promptToUse = manualPrompt || inputValue;
    const trimmed = promptToUse.trim();
    if (!trimmed || isLoading) return;
    if (!manualPrompt) setInputValue('');

    setIsLoading(true);
    const sessionId = generateId();
    
    // Initialize placeholders
    const placeholderArtifacts: Artifact[] = Array(3).fill(null).map((_, i) => ({
        id: `${sessionId}_${i}`,
        styleName: 'Designing...',
        html: '',
        status: 'streaming',
    }));

    const newSession: Session = {
        id: sessionId,
        prompt: trimmed,
        timestamp: Date.now(),
        artifacts: placeholderArtifacts
    };

    // Optimistic UI Update
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionIndex(prev => prev + 1); 
    setFocusedArtifactIndex(null); 

    try {
        const ai = getAiClient();
        
        // 1. Generate Concepts (Styles)
        const stylePrompt = `Generate 3 distinct UI concept names for a dashboard based on: "${trimmed}". Concepts should be unique (e.g. "Glassmorphism", "Bento Grid", "High-Contrast Enterprise"). Return ONLY a raw JSON array of 3 strings.`;
        const styleRes = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { role: 'user', parts: [{ text: stylePrompt }] }
        });

        let styles: string[] = ["Concept Alpha", "Concept Beta", "Concept Gamma"];
        try {
            const parsedStyles = JSON.parse(styleRes.text?.match(/\[[\s\S]*\]/)?.[0] || '[]');
            if (Array.isArray(parsedStyles) && parsedStyles.length === 3) {
                styles = parsedStyles;
            }
        } catch(e) {}

        // Update styles in state
        setSessions(prev => prev.map(s => s.id === sessionId ? {
            ...s,
            artifacts: s.artifacts.map((art, i) => ({ ...art, styleName: styles[i] }))
        } : s));

        // 2. Parallel Generation of Dashboards
        const generate = async (artifact: Artifact, style: string) => {
            const p = getGenerationPrompt(trimmed, style, settings);

            const stream = await ai.models.generateContentStream({
                model: 'gemini-3-flash-preview',
                contents: [{ parts: [{ text: p }], role: "user" }],
            });
            
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
  }, [inputValue, isLoading, settings, getAiClient, setSessions]);

  // --- Layout & Session Management ---
  
  const handleApplyLayout = (lo: any) => {
    if (focusedArtifactIndex === null) return;
    const currentSession = sessions[currentSessionIndex];
    const artifact = currentSession.artifacts[focusedArtifactIndex];
    
    const base = artifact.originalHtml || artifact.html;
    const wrapped = lo.name === "Standard Sidebar" ? base : `<style>${lo.css}</style><div class="layout-container">${base}</div>`;
    
    setSessions(prev => prev.map((s, i) => i === currentSessionIndex ? { 
        ...s, 
        artifacts: s.artifacts.map((a, j) => j === focusedArtifactIndex ? { 
            ...a, 
            html: wrapped, 
            originalHtml: base, 
            status: 'complete' 
        } : a) 
    } : s));
    setDrawerState(s => ({...s, isOpen: false}));
  };

  const jumpToSession = (index: number) => {
    setCurrentSessionIndex(index);
    setFocusedArtifactIndex(null);
    setDrawerState(s => ({ ...s, isOpen: false }));
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSessions(prev => {
          const filtered = prev.filter(s => s.id !== id);
          if (filtered.length === 0) setCurrentSessionIndex(-1);
          else if (currentSessionIndex >= filtered.length) setCurrentSessionIndex(filtered.length - 1);
          return filtered;
      });
  };

  const confirmClearHistory = () => {
    clearSessions();
    setSessions([]);
    setCurrentSessionIndex(-1);
    setFocusedArtifactIndex(null);
    setDrawerState(s => ({...s, isOpen: false}));
    setIsConfirmingClear(false);
  };

  // --- Render ---

  const hasStarted = sessions.length > 0 || isLoading;
  const currentSession = sessions[currentSessionIndex];
  const focusedArtifact = (currentSession && focusedArtifactIndex !== null) 
      ? currentSession.artifacts[focusedArtifactIndex] 
      : null;

  return (
    <>
        <ConfirmationModal
            isOpen={isConfirmingClear}
            title="Clear All History?"
            message="This will permanently delete all your generated dashboards. This action cannot be undone."
            confirmText="Delete Everything" cancelText="Cancel"
            onConfirm={confirmClearHistory} onCancel={() => setIsConfirmingClear(false)}
        />

        <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />

        {focusedArtifactIndex !== null && (
            <button className="floating-back-btn" onClick={() => setFocusedArtifactIndex(null)} title="Back to Grid">
                <ArrowLeftIcon /> <span>Back</span>
            </button>
        )}

        <div className="global-controls">
            <button className="icon-btn" onClick={() => setDrawerState({ isOpen: true, mode: 'history', title: 'History', data: null })} title="History"><HistoryIcon /></button>
            <div className="divider"></div>
            <button className="icon-btn" disabled={!canUndo} onClick={undo} title="Undo"><UndoIcon /></button>
            <button className="icon-btn" disabled={!canRedo} onClick={redo} title="Redo"><RedoIcon /></button>
            <div className="divider"></div>
            <button className="icon-btn" onClick={() => setDrawerState({ isOpen: true, mode: 'settings', title: 'Settings', data: null })} title="Settings"><SettingsIcon /></button>
        </div>

        <SideDrawer 
            isOpen={drawerState.isOpen} 
            onClose={() => setDrawerState(s => ({...s, isOpen: false}))} 
            title={drawerState.title} 
            position={drawerState.mode === 'history' ? 'left' : 'right'}
        >
            {drawerState.mode === 'history' && <HistoryPanel sessions={sessions} currentSessionIndex={currentSessionIndex} onJumpToSession={jumpToSession} onDeleteSession={handleDeleteSession} />}
            {drawerState.mode === 'settings' && <SettingsPanel settings={settings} onSettingsChange={setSettings} onClearHistoryRequest={() => setIsConfirmingClear(true)} />}
            {drawerState.mode === 'enhance' && <EnhancePanel onEnhance={handleEnhance} />}
            {drawerState.mode === 'code' && <CodeEditor initialValue={drawerState.data} onSave={(v) => {
                setSessions(prev => prev.map((sess, i) => i === currentSessionIndex ? { ...sess, artifacts: sess.artifacts.map((art, j) => j === focusedArtifactIndex ? { ...art, html: v } : art) } : sess));
            }} />}
            {drawerState.mode === 'layouts' && <LayoutsPanel layouts={LAYOUT_OPTIONS} focusedArtifact={focusedArtifact} onApply={handleApplyLayout} onPreview={(e, lo) => {
                e.stopPropagation();
                const base = focusedArtifact?.originalHtml || focusedArtifact?.html || '';
                const wrapped = lo.name === "Standard Sidebar" ? base : `<style>${lo.css}</style><div class="layout-container">${base}</div>`;
                setPreviewItem({ name: lo.name, html: wrapped });
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
                             <p>Generate high-fidelity dashboards instantly</p>
                             <button className="surprise-button" onClick={() => handleSendMessage(INITIAL_PLACEHOLDERS[placeholderIndex])} disabled={isLoading}><SparklesIcon /> Surprise Me</button>
                         </div>
                     </div>
                 )}
                {sessions.map((session, sIndex) => (
                    <div key={session.id} className={`session-group ${sIndex === currentSessionIndex ? 'active-session' : (sIndex < currentSessionIndex ? 'past-session' : 'future-session')}`}>
                        <div className="artifact-grid" ref={sIndex === currentSessionIndex ? gridScrollRef : null}>
                            {session.artifacts.map((artifact, aIndex) => (
                                <ArtifactCard key={artifact.id} artifact={artifact} isFocused={focusedArtifactIndex === aIndex} onClick={() => setFocusedArtifactIndex(aIndex)} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className={`action-bar ${focusedArtifactIndex !== null ? 'visible' : ''}`}>
                 <div className="iteration-chat-container">
                    <div className={`iteration-wrapper ${isLoading ? 'loading' : ''}`}>
                        <input type="text" placeholder="Refine dashboard..." value={iterationInput} onChange={(e) => setIterationInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleIterate()} disabled={isLoading} />
                        <button className="iteration-send-btn" onClick={handleIterate} disabled={isLoading || !iterationInput.trim()}>
                            {isLoading ? <ThinkingIcon /> : <ArrowUpIcon />}
                        </button>
                    </div>
                 </div>
                 <div className="action-buttons">
                    <button onClick={() => setFocusedArtifactIndex(null)}><GridIcon /> Grid</button>
                    <button onClick={handleRefresh} disabled={isLoading}><RefreshIcon /> Refresh</button>
                    <button onClick={() => setDrawerState({ isOpen: true, mode: 'enhance', title: 'Enhance', data: null })}><WandIcon /> Enhance</button>
                    <button onClick={() => setDrawerState({ isOpen: true, mode: 'layouts', title: 'Layouts', data: null })}><LayoutIcon /> Layouts</button>
                    <button onClick={() => {
                         const s = sessions[currentSessionIndex];
                         if (s && focusedArtifactIndex !== null) {
                             setDrawerState({ isOpen: true, mode: 'code', title: 'Edit Source', data: s.artifacts[focusedArtifactIndex].html });
                         }
                    }}><CodeIcon /> Code</button>
                    <button onClick={() => {
                        if (focusedArtifactIndex === null) return;
                        navigator.clipboard.writeText(sessions[currentSessionIndex].artifacts[focusedArtifactIndex].html).then(() => {
                            setCopyButtonText('Copied!');
                            setTimeout(() => setCopyButtonText('Copy Code'), 2000);
                        });
                    }}><CopyIcon /> {copyButtonText}</button>
                    <button onClick={() => {
                        if (focusedArtifactIndex === null) return;
                        const art = sessions[currentSessionIndex].artifacts[focusedArtifactIndex];
                        const blob = new Blob([art.html], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = `dashboard-${art.id}.html`; a.click();
                        URL.revokeObjectURL(url);
                    }}><DownloadIcon /> Save</button>
                 </div>
            </div>

            <div className={`floating-input-container ${focusedArtifactIndex !== null ? 'hidden' : ''}`}>
                <div className={`input-wrapper ${isLoading ? 'loading' : ''}`}>
                    <input ref={inputRef} type="text" placeholder={INITIAL_PLACEHOLDERS[placeholderIndex]} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <button className="send-button" onClick={() => handleSendMessage()} disabled={isLoading || !inputValue.trim()}><ArrowUpIcon /></button>
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
