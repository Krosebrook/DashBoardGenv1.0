
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { GenerationSettings, Session } from '../../types';
import { DownloadIcon } from '../Icons';

interface SettingsPanelProps {
    settings: GenerationSettings;
    onSettingsChange: (newSettings: GenerationSettings) => void;
    onClearHistoryRequest: () => void;
    onImportSessions: (sessions: Session[]) => void;
    onExportSessions: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    settings, 
    onSettingsChange, 
    onClearHistoryRequest,
    onImportSessions,
    onExportSessions
}) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleToggle = (key: keyof GenerationSettings) => {
        onSettingsChange({
            ...settings,
            [key]: !settings[key]
        });
    };

    const handleImportClick = () => fileRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const sessions = JSON.parse(ev.target?.result as string);
                if (Array.isArray(sessions)) {
                    onImportSessions(sessions);
                    alert(`Successfully imported ${sessions.length} sessions.`);
                } else {
                    alert("Invalid session file format.");
                }
            } catch (err) {
                alert("Failed to parse JSON.");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset
    };

    return (
        <div className="settings-panel">
            <div className="enhance-section-label">Framework & Data</div>
            <div className="setting-group">
                <label>CSS Framework</label>
                <select 
                    value={settings.framework} 
                    onChange={(e) => onSettingsChange({ ...settings, framework: e.target.value as any })}
                >
                    <option value="vanilla">Vanilla CSS</option>
                    <option value="tailwind">Tailwind CSS (CDN)</option>
                    <option value="react-mui">React + Material UI (CDN)</option>
                    <option value="bootstrap">Bootstrap 5 (CDN)</option>
                    <option value="foundation">Foundation 6 (CDN)</option>
                </select>
            </div>
            <div className="setting-group">
                <label>Data Context</label>
                <textarea 
                    value={settings.dataContext} 
                    onChange={(e) => onSettingsChange({ ...settings, dataContext: e.target.value })} 
                    placeholder='e.g. Describe your business metrics or JSON structure' 
                    rows={3} 
                />
            </div>

            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Automatic Enhancements</div>
            <div className="settings-toggles-grid">
                <label className="settings-toggle-item">
                    <input 
                        type="checkbox" 
                        checked={settings.autoA11y} 
                        onChange={() => handleToggle('autoA11y')}
                    />
                    <div className="toggle-text">
                        <strong>Auto A11y</strong>
                        <span>Apply WCAG 2.1 accessibility standards.</span>
                    </div>
                </label>
                <label className="settings-toggle-item">
                    <input 
                        type="checkbox" 
                        checked={settings.autoCharts} 
                        onChange={() => handleToggle('autoCharts')}
                    />
                    <div className="toggle-text">
                        <strong>Auto Interactive Charts</strong>
                        <span>Detect data and inject Chart.js.</span>
                    </div>
                </label>
                <label className="settings-toggle-item">
                    <input 
                        type="checkbox" 
                        checked={settings.autoPersonas} 
                        onChange={() => handleToggle('autoPersonas')}
                    />
                    <div className="toggle-text">
                        <strong>Auto Brand Personas</strong>
                        <span>Inject realistic users and company identity.</span>
                    </div>
                </label>
            </div>

            <div className="enhance-section-label" style={{ marginTop: '24px' }}>Data & Backup</div>
            <div className="settings-toggles-grid">
                <button className="settings-toggle-item" onClick={onExportSessions}>
                    <DownloadIcon />
                    <div className="toggle-text">
                        <strong>Export All Sessions</strong>
                        <span>Download JSON backup of your history.</span>
                    </div>
                </button>
                <button className="settings-toggle-item" onClick={handleImportClick}>
                    <div className="icon">📂</div>
                    <div className="toggle-text">
                        <strong>Import Sessions</strong>
                        <span>Restore history from JSON backup.</span>
                    </div>
                    <input 
                        type="file" 
                        ref={fileRef} 
                        style={{display:'none'}} 
                        accept=".json" 
                        onChange={handleFileChange} 
                    />
                </button>
            </div>

            <div className="setting-group danger-zone" style={{ marginTop: '32px' }}>
                <label>Danger Zone</label>
                <button onClick={onClearHistoryRequest} className="clear-history-btn">Clear All History</button>
            </div>
        </div>
    );
};

export default SettingsPanel;
