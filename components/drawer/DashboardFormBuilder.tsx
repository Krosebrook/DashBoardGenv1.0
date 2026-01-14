/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface DashboardFormBuilderProps {
    onGenerate: (specs: DashboardSpecs) => void;
    isGenerating?: boolean;
}

export interface DashboardSpecs {
    name: string;
    category: string;
    metrics: MetricSpec[];
    charts: ChartSpec[];
    tables: boolean;
    colorScheme: string;
    layout: string;
}

interface MetricSpec {
    id: string;
    label: string;
    value: string;
}

interface ChartSpec {
    id: string;
    type: string;
    title: string;
}

export default function DashboardFormBuilder({ onGenerate, isGenerating }: DashboardFormBuilderProps) {
    const [specs, setSpecs] = useState<DashboardSpecs>({
        name: 'My Dashboard',
        category: 'analytics',
        metrics: [{ id: '1', label: 'Total Users', value: '1,234' }],
        charts: [{ id: '1', type: 'line', title: 'Growth Over Time' }],
        tables: true,
        colorScheme: 'professional',
        layout: 'sidebar'
    });

    const categories = [
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'saas', label: 'SaaS', icon: '💼' },
        { id: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
        { id: 'crm', label: 'CRM', icon: '👥' },
        { id: 'admin', label: 'Admin', icon: '⚙️' },
        { id: 'iot', label: 'IoT', icon: '🔌' }
    ];

    const colorSchemes = [
        { id: 'professional', label: 'Professional', colors: '#1e293b, #3b82f6' },
        { id: 'dark', label: 'Dark Mode', colors: '#0a0e27, #00ff88' },
        { id: 'vibrant', label: 'Vibrant', colors: '#667eea, #764ba2' },
        { id: 'minimal', label: 'Minimal', colors: '#ffffff, #000000' }
    ];

    const chartTypes = [
        { id: 'line', label: 'Line Chart', icon: '📈' },
        { id: 'bar', label: 'Bar Chart', icon: '📊' },
        { id: 'pie', label: 'Pie Chart', icon: '🥧' },
        { id: 'area', label: 'Area Chart', icon: '🌊' }
    ];

    const addMetric = () => {
        setSpecs({
            ...specs,
            metrics: [...specs.metrics, { id: Date.now().toString(), label: '', value: '' }]
        });
    };

    const updateMetric = (id: string, field: 'label' | 'value', value: string) => {
        setSpecs({
            ...specs,
            metrics: specs.metrics.map(m => m.id === id ? { ...m, [field]: value } : m)
        });
    };

    const removeMetric = (id: string) => {
        setSpecs({
            ...specs,
            metrics: specs.metrics.filter(m => m.id !== id)
        });
    };

    const addChart = () => {
        setSpecs({
            ...specs,
            charts: [...specs.charts, { id: Date.now().toString(), type: 'line', title: '' }]
        });
    };

    const updateChart = (id: string, field: 'type' | 'title', value: string) => {
        setSpecs({
            ...specs,
            charts: specs.charts.map(c => c.id === id ? { ...c, [field]: value } : c)
        });
    };

    const removeChart = (id: string) => {
        setSpecs({
            ...specs,
            charts: specs.charts.filter(c => c.id !== id)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(specs);
    };

    return (
        <form className="form-builder" onSubmit={handleSubmit}>
            <p className="panel-description">
                Fill out this form to specify exactly what you want in your dashboard. We'll generate it for you.
            </p>

            <div className="form-section">
                <label className="form-label">Dashboard Name</label>
                <input
                    type="text"
                    className="form-input"
                    value={specs.name}
                    onChange={(e) => setSpecs({ ...specs, name: e.target.value })}
                    placeholder="e.g., Sales Analytics Dashboard"
                    required
                />
            </div>

            <div className="form-section">
                <label className="form-label">Category</label>
                <div className="category-grid">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`category-option ${specs.category === cat.id ? 'selected' : ''}`}
                            onClick={() => setSpecs({ ...specs, category: cat.id })}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <label className="form-label">Key Metrics</label>
                    <button type="button" className="add-btn" onClick={addMetric}>+ Add Metric</button>
                </div>
                {specs.metrics.map(metric => (
                    <div key={metric.id} className="metric-item">
                        <input
                            type="text"
                            className="form-input small"
                            placeholder="Metric Label (e.g., Revenue)"
                            value={metric.label}
                            onChange={(e) => updateMetric(metric.id, 'label', e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-input small"
                            placeholder="Sample Value (e.g., $125K)"
                            value={metric.value}
                            onChange={(e) => updateMetric(metric.id, 'value', e.target.value)}
                        />
                        <button type="button" className="remove-btn" onClick={() => removeMetric(metric.id)}>×</button>
                    </div>
                ))}
            </div>

            <div className="form-section">
                <div className="section-header">
                    <label className="form-label">Charts</label>
                    <button type="button" className="add-btn" onClick={addChart}>+ Add Chart</button>
                </div>
                {specs.charts.map(chart => (
                    <div key={chart.id} className="chart-item">
                        <select
                            className="form-select"
                            value={chart.type}
                            onChange={(e) => updateChart(chart.id, 'type', e.target.value)}
                        >
                            {chartTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="form-input small"
                            placeholder="Chart Title"
                            value={chart.title}
                            onChange={(e) => updateChart(chart.id, 'title', e.target.value)}
                        />
                        <button type="button" className="remove-btn" onClick={() => removeChart(chart.id)}>×</button>
                    </div>
                ))}
            </div>

            <div className="form-section">
                <label className="form-label">
                    <input
                        type="checkbox"
                        checked={specs.tables}
                        onChange={(e) => setSpecs({ ...specs, tables: e.target.checked })}
                    />
                    <span>Include Data Tables</span>
                </label>
            </div>

            <div className="form-section">
                <label className="form-label">Color Scheme</label>
                <div className="color-schemes">
                    {colorSchemes.map(scheme => (
                        <button
                            key={scheme.id}
                            type="button"
                            className={`color-scheme-option ${specs.colorScheme === scheme.id ? 'selected' : ''}`}
                            onClick={() => setSpecs({ ...specs, colorScheme: scheme.id })}
                        >
                            <div className="color-preview" style={{ background: `linear-gradient(135deg, ${scheme.colors})` }}></div>
                            <span>{scheme.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-section">
                <label className="form-label">Layout</label>
                <div className="layout-options">
                    <button
                        type="button"
                        className={`layout-option ${specs.layout === 'sidebar' ? 'selected' : ''}`}
                        onClick={() => setSpecs({ ...specs, layout: 'sidebar' })}
                    >
                        Sidebar
                    </button>
                    <button
                        type="button"
                        className={`layout-option ${specs.layout === 'topnav' ? 'selected' : ''}`}
                        onClick={() => setSpecs({ ...specs, layout: 'topnav' })}
                    >
                        Top Nav
                    </button>
                </div>
            </div>

            <button type="submit" className="generate-btn" disabled={isGenerating}>
                {isGenerating ? '✨ Generating...' : '✨ Generate Dashboard'}
            </button>
        </form>
    );
}
