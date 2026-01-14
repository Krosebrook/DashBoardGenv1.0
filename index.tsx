/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

//Vibe coded by ammaar@google.com

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

import { Artifact, Session, ComponentVariation, LayoutOption, GenerationSettings } from './types';
import { INITIAL_PLACEHOLDERS, LAYOUT_OPTIONS } from './constants';
import { generateId, parseJsonStream } from './utils';
import { useHistory } from './hooks/useHistory';
import { loadSessions, saveSessions, clearSessions } from './utils/storage';

// Components
import DottedGlowBackground from './components/DottedGlowBackground';
import ArtifactCard from './components/ArtifactCard';
import SideDrawer from './components/SideDrawer';
import CodeEditor from './components/CodeEditor';
import ConfirmationModal from './components/ConfirmationModal';
import PreviewModal from './components/PreviewModal';

// Drawer Panels
import HistoryPanel from './components/drawer/HistoryPanel';
import SettingsPanel from './components/drawer/SettingsPanel';
import EnhancePanel, { EnhanceType } from './components/drawer/EnhancePanel';
import VariationsPanel from './components/drawer/VariationsPanel';
import LayoutsPanel from './components/drawer/LayoutsPanel';

import { 
    ThinkingIcon, 
    CodeIcon, 
    SparklesIcon, 
    ArrowLeftIcon, 
    ArrowRightIcon, 
    ArrowUpIcon, 
    GridIcon,
    LayoutIcon,
    DownloadIcon,
    CopyIcon,
    HistoryIcon,
    UndoIcon,
    RedoIcon,
    SettingsIcon,
    WandIcon,
    RefreshIcon
} from './components/Icons';

function App() {
  const { 
      state: sessions, 
      set: setSessions, 
      undo, 
      redo, 
      canUndo, 
      canRedo 
  } = useHistory<Session[]>(loadSessions());

  const [currentSessionIndex, setCurrentSessionIndex] = useState<number>(() => {
      const loaded = loadSessions();
      return loaded.length > 0 ? loaded.length - 1 : -1;
  });
  
  const [focusedArtifactIndex, setFocusedArtifactIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [iterationInput, setIterationInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholders] = useState<string[]>(INITIAL_PLACEHOLDERS);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  
  const [settings, setSettings] = useState<GenerationSettings>({
      framework: 'vanilla',
      dataContext: '',
      autoA11y: false
  });

  const [drawerState, setDrawerState] = useState<{
      isOpen: boolean;
      mode: 'code' | 'variations' | 'layouts' | 'settings' | 'enhance' | 'history' | null;
      title: string;
      data: any;
      error?: string | null;
  }>({ isOpen: false, mode: null, title: '', data: null, error: null });

  const [componentVariations, setComponentVariations] = useState<ComponentVariation[]>([]);
  const [previewItem, setPreviewItem] = useState<{html: string, name: string} | null>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copy Code');

  const inputRef = useRef<HTMLInputElement>(null);
  const iterationInputRef = useRef<HTMLInputElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  useEffect(() => {
      const handler = setTimeout(() => {
          saveSessions(sessions);
      }, 1000); 
      return () => clearTimeout(handler);
  }, [sessions]);

  useEffect(() => {
      if (!isLoading) {
          inputRef.current?.focus();
      }
  }, [isLoading]);

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

  useEffect(() => {
      const interval = setInterval(() => {
          setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
  }, [placeholders.length]);

  // --- Handlers ---

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleIterationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIterationInput(event.target.value);
  };

  const getAiClient = () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY is not configured.");
      return new GoogleGenAI({ apiKey });
  };

  const handleEnhance = async (type: EnhanceType, file?: File) => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1) return;
    setIsLoading(true);
    setDrawerState(s => ({ ...s, isOpen: false }));
    
    try {
        const ai = getAiClient();
        const currentSession = sessions[currentSessionIndex];
        const artifact = currentSession.artifacts[focusedArtifactIndex];
        
        let enhancementPrompt = '';
        let parts: any[] = [];

        if (type === 'file-populate' && file) {
            const getFilePart = async (f: File) => {
                return new Promise<any>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = (reader.result as string).split(',')[1];
                        resolve({
                            inlineData: {
                                data: base64,
                                mimeType: f.type || 'text/plain'
                            }
                        });
                    };
                    reader.readAsDataURL(f);
                });
            };

            const filePart = await getFilePart(file);
            enhancementPrompt = `
                I have uploaded a document. Analyze its contents (text, metrics, tables).
                Inject this real-world data into the provided dashboard HTML to replace all generic placeholders.
                Map the metrics to cards, data to tables, and trends to chart data if applicable.
                Return ONLY the complete updated raw HTML.
            `;
            parts = [filePart, { text: enhancementPrompt }, { text: `Existing Code:\n${artifact.html}` }];
        } else {
            if (type === 'persona') {
                enhancementPrompt = `
                    You are a professional branding and UX content strategist. 
                    Your goal is to inject highly realistic dummy data into this dashboard UI.
                    
                    1. Identity: Generate realistic, diverse, professional user names and roles (e.g. "Senior Strategy Consultant", "Chief Operations Officer"). 
                    2. Avatars: Replace placeholder/empty avatars with high-quality, professional portraits from Unsplash (e.g., using source.unsplash.com/800x800/?portrait,professional).
                    3. Branding: Invent a cohesive company brand name, logo text, and professional mission statements.
                    4. Content: Replace all "Lorem Ipsum" and generic strings with domain-specific, high-value professional copy that fits the dashboard's context.
                    
                    Maintain the existing layout and styles. Return ONLY the complete updated raw HTML.
                `;
            } else if (type === 'a11y') {
                enhancementPrompt = `
                    You are an Accessibility Expert specialized in WCAG 2.1 AA/AAA compliance. 
                    Audit and fix the provided dashboard HTML to ensure it is fully accessible to all users.
                    
                    1. Contrast: Adjust CSS color values to ensure text-to-background contrast ratios meet WCAG standards while preserving the original theme's aesthetic.
                    2. Semantics: Refactor structural elements to use proper HTML5 semantic tags (<main>, <nav>, <aside>, <section>, <header>, <footer>).
                    3. ARIA: Add comprehensive ARIA roles, labels, and aria-describedby attributes to all interactive elements (buttons, links, inputs, modals).
                    4. Images: Ensure all <img> tags have descriptive and meaningful alt text.
                    5. Forms: Ensure all form controls have properly associated <label> elements.
                    6. Keyboard: Ensure a logical tab order and visible focus states.
                    
                    Return ONLY the complete fixed raw HTML.
                `;
            } else if (type === 'format') {
                enhancementPrompt = 'Prettify and format the code for high readability. Ensure standard indentation and clean organization. Return ONLY cleaned HTML.';
            } else if (type === 'dummy') {
                enhancementPrompt = 'Inject high-fidelity, realistic business KPIs and data rows. Ensure numbers look like real analytics (e.g. conversion rates, revenue, churn). Populate tables with at least 8-10 varied rows of content. Return ONLY updated HTML.';
            } else if (type === 'content') {
                enhancementPrompt = 'Visual Storytelling: Replace all generic placeholders and empty images with beautiful, context-relevant photography from Unsplash. Return raw HTML.';
            } else if (type === 'responsive') {
                enhancementPrompt = 'Mobile-First Refinement: Refine the CSS/layout to be perfectly responsive across all breakpoints (Mobile, Tablet, Desktop). Return raw HTML.';
            } else if (type === 'tailwind') {
                enhancementPrompt = 'Utility Refactor: Rewrite all custom CSS using Tailwind CSS utility classes exclusively. Return raw HTML.';
            } else if (type === 'charts') {
                enhancementPrompt = 'Interactive Visualizations: Identify data-heavy areas and inject Chart.js canvas elements with live rendering scripts from CDN. Return raw HTML.';
            }
            
            parts = [{ text: `${enhancementPrompt}\n\nExisting Code:\n${artifact.html}` }];
        }

        const response = await ai.models.generateContent({
             model: (type === 'persona' || type === 'file-populate' || type === 'a11y') ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
             contents: [{ role: 'user', parts }]
        });
        
        const newHtml = response.text?.replace(/```html|```/g, '').trim() || artifact.html;
        
        setSessions(prev => prev.map((sess, i) => 
            i === currentSessionIndex ? {
                ...sess,
                artifacts: sess.artifacts.map((art, j) => 
                    j === focusedArtifactIndex ? { ...art, html: newHtml, originalHtml: newHtml, status: 'complete' } : art
                )
            } : sess
        ));
    } catch (e) {
        console.error("Enhance failed", e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1 || isLoading) return;
    const currentSession = sessions[currentSessionIndex];
    const artifact = currentSession.artifacts[focusedArtifactIndex];
    setIsLoading(true);
    
    setSessions(prev => prev.map((sess, i) => i === currentSessionIndex ? {
        ...sess,
        artifacts: sess.artifacts.map((art, j) => j === focusedArtifactIndex ? { ...art, html: '', status: 'streaming' } : art)
    } : sess));

    try {
        const ai = getAiClient();
        const prompt = `Regenerate this Dashboard UI fresh based on: "${currentSession.prompt}". Theme Concept: ${artifact.styleName}. Return raw HTML only.`;
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

  const handleIterate = async () => {
      if (focusedArtifactIndex === null || currentSessionIndex === -1 || !iterationInput.trim() || isLoading) return;
      const instruction = iterationInput.trim();
      setIterationInput('');
      setIsLoading(true);

      try {
          const ai = getAiClient();
          const currentSession = sessions[currentSessionIndex];
          const artifact = currentSession.artifacts[focusedArtifactIndex];

          const prompt = `Senior Frontend Engineer. Modify the following dashboard interface.\nExisting Code:\n${artifact.html}\nUser Request: "${instruction}"\nPerform the modification while preserving the layout and professional design language. Return only the complete updated raw HTML.`;
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
              artifacts: s.artifacts.map(a => a.id === artifact.id ? { ...a, html: final, status: 'complete' } : a)
          } : s));
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
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

  const handleSendMessage = useCallback(async (manualPrompt?: string) => {
    const promptToUse = manualPrompt || inputValue;
    const trimmed = promptToUse.trim();
    if (!trimmed || isLoading) return;
    if (!manualPrompt) setInputValue('');

    setIsLoading(true);
    const sessionId = generateId();
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

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionIndex(prev => prev + 1); 
    setFocusedArtifactIndex(null); 

    try {
        const ai = getAiClient();
        const stylePrompt = `Generate 3 distinct, high-end UI design concept names for a dashboard dashboard based on: "${trimmed}". Concepts should be descriptive (e.g. "Dark Mode Cyberpunk", "Swiss Minimalist", "Glassmorphic Analytical"). Return ONLY a raw JSON array of 3 strings.`;
        const styleRes = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { role: 'user', parts: [{ text: stylePrompt }] }
        });

        let styles: string[] = ["Modern Dashboard", "Enterprise Grid", "Minimalist Analytics"];
        try {
            const parsedStyles = JSON.parse(styleRes.text?.match(/\[[\s\S]*\]/)?.[0] || '[]');
            if (Array.isArray(parsedStyles) && parsedStyles.length === 3) {
                styles = parsedStyles;
            }
        } catch(e) {}

        setSessions(prev => prev.map(s => s.id === sessionId ? {
            ...s,
            artifacts: s.artifacts.map((art, i) => ({ ...art, styleName: styles[i] }))
        } : s));

        const generate = async (artifact: Artifact, style: string) => {
            const frameworkContext = settings.framework !== 'vanilla' ? `Using ${settings.framework} for component patterns.` : "Using vanilla HTML/CSS.";
            const p = `Expert Frontend Developer. Create a high-fidelity, polished dashboard for: "${trimmed}". 
            Style Concept: ${style}. 
            Framework Context: ${frameworkContext}
            Include: 
            - Sidebar and Top Navigation
            - KPI cards with icons
            - A professional data table
            - Interactive chart area placeholders
            - Realistic dummy metrics
            Return ONLY complete, standalone raw HTML.`;

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
  }, [inputValue, isLoading, settings]);

  const jumpToSession = (index: number) => {
    setCurrentSessionIndex(index);
    setFocusedArtifactIndex(null);
    setDrawerState(s => ({ ...s, isOpen: false }));
  };

  const handleShowCode = () => {
    const s = sessions[currentSessionIndex];
    if (s && focusedArtifactIndex !== null) {
        setDrawerState({ isOpen: true, mode: 'code', title: 'Edit Source', data: s.artifacts[focusedArtifactIndex].html, error: null });
    }
  };

  const handleShowLayouts = () => setDrawerState({ isOpen: true, mode: 'layouts', title: 'Layouts', data: null, error: null });
  const handleShowSettings = () => setDrawerState({ isOpen: true, mode: 'settings', title: 'Settings', data: null, error: null });
  const handleShowEnhance = () => setDrawerState({ isOpen: true, mode: 'enhance', title: 'Enhance', data: null, error: null });
  const handleShowHistory = () => setDrawerState({ isOpen: true, mode: 'history', title: 'History', data: null, error: null });

  const handleDownload = () => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1) return;
    const art = sessions[currentSessionIndex].artifacts[focusedArtifactIndex];
    const blob = new Blob([art.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dashboard-${art.id}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    if (focusedArtifactIndex === null || currentSessionIndex === -1) return;
    const art = sessions[currentSessionIndex].artifacts[focusedArtifactIndex];
    navigator.clipboard.writeText(art.html).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Code'), 2000);
    });
  };

  const hasStarted = sessions.length > 0 || isLoading;
  const currentSession = sessions[currentSessionIndex];
  const focusedArtifact = (currentSession && focusedArtifactIndex !== null) ? currentSession.artifacts[focusedArtifactIndex] : null;

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
            <button className="icon-btn" onClick={handleShowHistory} title="History"><HistoryIcon /></button>
            <div className="divider"></div>
            <button className="icon-btn" disabled={!canUndo} onClick={undo} title="Undo"><UndoIcon /></button>
            <button className="icon-btn" disabled={!canRedo} onClick={redo} title="Redo"><RedoIcon /></button>
            <div className="divider"></div>
            <button className="icon-btn" onClick={handleShowSettings} title="Settings"><SettingsIcon /></button>
        </div>

        <SideDrawer isOpen={drawerState.isOpen} onClose={() => setDrawerState(s => ({...s, isOpen: false}))} title={drawerState.title} position={drawerState.mode === 'history' ? 'left' : 'right'}>
            {drawerState.mode === 'history' && <HistoryPanel sessions={sessions} currentSessionIndex={currentSessionIndex} onJumpToSession={jumpToSession} onDeleteSession={handleDeleteSession} />}
            {drawerState.mode === 'settings' && <SettingsPanel settings={settings} onSettingsChange={setSettings} onClearHistoryRequest={() => setIsConfirmingClear(true)} />}
            {drawerState.mode === 'enhance' && <EnhancePanel onEnhance={handleEnhance} />}
            {drawerState.mode === 'code' && <CodeEditor initialValue={drawerState.data} onSave={(v) => {
                setSessions(prev => prev.map((sess, i) => i === currentSessionIndex ? { ...sess, artifacts: sess.artifacts.map((art, j) => j === focusedArtifactIndex ? { ...art, html: v } : art) } : sess));
            }} />}
            {drawerState.mode === 'layouts' && <LayoutsPanel layouts={LAYOUT_OPTIONS} focusedArtifact={focusedArtifact} onApply={(lo) => {
                if (focusedArtifactIndex === null) return;
                const base = focusedArtifact.originalHtml || focusedArtifact.html;
                const wrapped = lo.name === "Standard Sidebar" ? base : `<style>${lo.css}</style><div class="layout-container">${base}</div>`;
                setSessions(prev => prev.map((s, i) => i === currentSessionIndex ? { ...s, artifacts: s.artifacts.map((a, j) => j === focusedArtifactIndex ? { ...a, html: wrapped, originalHtml: base, status: 'complete' } : a) } : s));
                setDrawerState(s => ({...s, isOpen: false}));
            }} onPreview={(e, lo) => {
                e.stopPropagation();
                const base = focusedArtifact?.originalHtml || focusedArtifact?.html || '';
                const wrapped = lo.name === "Standard Sidebar" ? base : `<style>${lo.css}</style><div class="layout-container">${base}</div>`;
                setPreviewItem({ name: lo.name, html: wrapped });
            }} />}
        </SideDrawer>

        <div className="immersive-app">
            <DottedGlowBackground />
            <div className={`stage-container ${focusedArtifactIndex !== null ? 'mode-focus' : 'mode-split'}`}>
                 {!hasStarted && (
                     <div className="empty-state">
                         <div className="empty-content">
                             <h1>DashGen</h1>
                             <p>Generate high-fidelity dashboards instantly</p>
                             <button className="surprise-button" onClick={() => handleSendMessage(placeholders[placeholderIndex])} disabled={isLoading}><SparklesIcon /> Surprise Me</button>
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
                        <input ref={iterationInputRef} type="text" placeholder="Refine dashboard..." value={iterationInput} onChange={handleIterationInputChange} onKeyDown={(e) => e.key === 'Enter' && handleIterate()} disabled={isLoading} />
                        <button className="iteration-send-btn" onClick={handleIterate} disabled={isLoading || !iterationInput.trim()}>
                            {isLoading ? <ThinkingIcon /> : <ArrowUpIcon />}
                        </button>
                    </div>
                 </div>
                 <div className="action-buttons">
                    <button onClick={() => setFocusedArtifactIndex(null)}><GridIcon /> Grid</button>
                    <button onClick={handleRefresh} disabled={isLoading}><RefreshIcon /> Refresh</button>
                    <button onClick={handleShowEnhance}><WandIcon /> Enhance</button>
                    <button onClick={handleShowLayouts}><LayoutIcon /> Layouts</button>
                    <button onClick={handleShowCode}><CodeIcon /> Code</button>
                    <button onClick={handleCopyCode}><CopyIcon /> {copyButtonText}</button>
                    <button onClick={handleDownload}><DownloadIcon /> Save</button>
                 </div>
            </div>

            <div className={`floating-input-container ${focusedArtifactIndex !== null ? 'hidden' : ''}`}>
                <div className={`input-wrapper ${isLoading ? 'loading' : ''}`}>
                    <input ref={inputRef} type="text" placeholder={placeholders[placeholderIndex]} value={inputValue} onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
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