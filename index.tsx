
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
                I have provided a source document. Analyze its contents (text, metrics, tables, statistics).
                Inject this real-world data into the following dashboard HTML, replacing all generic placeholders, "Lorem Ipsum", or generic numbers.
                Ensure metrics are mapped to relevant KPI cards, tables are populated with extracted rows, and chart data reflects the trends in the document.
                Return ONLY the complete updated raw HTML.
            `;
            parts = [filePart, { text: enhancementPrompt }, { text: `Existing Code:\n${artifact.html}` }];
        } else {
            if (type === 'persona') {
                enhancementPrompt = `
                    You are a world-class Branding and UX Content Strategist. Your task is to inject a high-fidelity brand identity and realistic, diverse user personas into this dashboard. 
                    
                    1. Brand Identity: Invent a professional company name, a mission statement, and replace all 'Logo' or 'Company' placeholders with this cohesive identity.
                    
                    2. User Personas: Generate highly realistic, diverse, and professional user names and roles (e.g., 'Lead Data Scientist', 'VP of Logistics', 'Chief Strategy Officer'). Inject these into any 'User Profile', 'Assigned To', or 'Team' sections.
                    
                    3. Professional Portraits: Replace all empty, generic, or SVG user avatars with high-quality, professional photography URLs from Unsplash (e.g., 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200' for a profile shot). Ensure the URLs are valid and diverse.
                    
                    4. Professional Copy: Replace all 'Lorem Ipsum', 'Test Data', or generic strings with contextually accurate, professional domain content that matches the dashboard theme.
                    
                    Return ONLY the complete updated raw HTML.
                `;
            } else if (type === 'a11y') {
                enhancementPrompt = `
                    You are an expert Accessibility (A11y) Engineer specializing in WCAG 2.1 AA/AAA standards. 
                    Audit and fix this dashboard HTML:
                    1. Contrast: Adjust CSS colors if necessary to ensure all text meets AA/AAA contrast requirements.
                    2. Semantics: Refactor elements to use proper HTML5 semantic tags (<main>, <nav>, <aside>, <section>, <header>, <footer>).
                    3. ARIA: Add comprehensive aria-labels, roles, and states to all interactive components (buttons, links, inputs).
                    4. Focus: Ensure a logical tab order and highly visible focus states for keyboard navigation.
                    5. Alt Text: Add descriptive alt text to all images.
                    Return ONLY the complete fixed raw HTML.
                `;
            } else if (type === 'format') {
                enhancementPrompt = 'Prettify and format the code for high readability. Ensure standard indentation and clean organization of CSS and JS. Return ONLY cleaned HTML.';
            } else if (type === 'dummy') {
                enhancementPrompt = 'Identify the domain of this dashboard. Inject high-fidelity, realistic business KPIs and at least 10 rows of varied data into tables. Ensure trends and numbers are consistent and look like live analytics. Return ONLY updated HTML.';
            } else if (type === 'content') {
                enhancementPrompt = 'Visual Storytelling: Scan the dashboard for image placeholders and replace them with beautiful, high-resolution photography from Unsplash that matches the professional context. Return ONLY updated HTML.';
            } else if (type === 'responsive') {
                enhancementPrompt = `
                    You are a world-class Responsive Design Expert. Refine the provided dashboard for perfect viewing on Mobile (Portrait/Landscape), Tablet, and Ultra-wide Desktop. 
                    1. Grids: Implement fluid CSS Grid or Flexbox layouts that stack gracefully.
                    2. Navigation: Ensure sidebars collapse into a drawer or hamburger menu for mobile devices.
                    3. Touch Targets: Ensure all buttons and links are at least 44x44px on mobile.
                    4. Typography: Use responsive font sizing (e.g., clamp() or media queries).
                    Return ONLY the complete updated raw HTML.
                `;
            } else if (type === 'tailwind') {
                enhancementPrompt = `
                    Senior Frontend Engineer. Refactor this entire dashboard to use Tailwind CSS utility classes exclusively. 
                    1. Extraction: Move all styles from <style> blocks into utility classes on the HTML elements.
                    2. CDN: Ensure the Tailwind CDN script is correctly included in the <head>.
                    3. Professional Scale: Use Tailwind's standard spacing, shadow, and color scales for a polished look.
                    Return ONLY the complete updated raw HTML.
                `;
            } else if (type === 'charts') {
                enhancementPrompt = `
                    Identify data-heavy areas, static graphs, or KPI cards in the dashboard.
                    1. Injection: Add the Chart.js CDN script to the <head>.
                    2. Widgets: Inject canvas elements and specialized <script> blocks to initialize interactive, animated charts (Line, Bar, or Doughnut) using the dashboard's current data context.
                    3. Styling: Ensure chart colors match the dashboard's design system.
                    Return ONLY the complete updated raw HTML.
                `;
            }
            
            parts = [{ text: `${enhancementPrompt}\n\nExisting Code:\n${artifact.html}` }];
        }

        const response = await ai.models.generateContent({
             model: (type === 'persona' || type === 'file-populate' || type === 'a11y' || type === 'responsive' || type === 'tailwind' || type === 'charts') ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
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

  const handleIterate = async () => {
      if (focusedArtifactIndex === null || currentSessionIndex === -1 || !iterationInput.trim() || isLoading) return;
      const instruction = iterationInput.trim();
      setIterationInput('');
      setIsLoading(true);

      try {
          const ai = getAiClient();
          const currentSession = sessions[currentSessionIndex];
          const artifact = currentSession.artifacts[focusedArtifactIndex];

          const prompt = `Senior Frontend Engineer. Modify the following dashboard interface.\nExisting Code:\n${artifact.html}\nUser Request: "${instruction}"\nPerform the requested changes while strictly adhering to the current design language, layout principles, and component hierarchy. Return ONLY the complete updated raw HTML.`;
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
            - Realistic dummy metrics
            Return ONLY standalone raw HTML.`;

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
