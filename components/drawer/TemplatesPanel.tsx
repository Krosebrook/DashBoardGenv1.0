/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DashboardTemplate } from '../../constants/templates';

interface TemplatesPanelProps {
    templates: DashboardTemplate[];
    onSelectTemplate: (template: DashboardTemplate) => void;
    onPreview: (item: { html: string; name: string }) => void;
}

export default function TemplatesPanel({ templates, onSelectTemplate, onPreview }: TemplatesPanelProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All Templates', icon: '📊' },
        { id: 'saas', label: 'SaaS', icon: '💼' },
        { id: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
        { id: 'crm', label: 'CRM', icon: '👥' },
        { id: 'admin', label: 'Admin', icon: '⚙️' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'iot', label: 'IoT', icon: '🔌' }
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    return (
        <div className="templates-panel">
            <p className="panel-description">
                Choose from pre-built dashboard templates to get started quickly. Customize after selection.
            </p>

            <div className="category-filters">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        <span className="category-icon">{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            <div className="templates-grid">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="template-card">
                        <div className="template-preview">
                            <iframe
                                srcDoc={template.html}
                                title={template.name}
                                sandbox="allow-same-origin"
                            />
                        </div>
                        <div className="template-info">
                            <h3>{template.name}</h3>
                            <p>{template.description}</p>
                            <div className="template-actions">
                                <button
                                    className="template-preview-btn"
                                    onClick={() => onPreview({ html: template.html, name: template.name })}
                                >
                                    👁️ Preview
                                </button>
                                <button
                                    className="template-use-btn"
                                    onClick={() => onSelectTemplate(template)}
                                >
                                    Use Template
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="no-templates">
                    <p>No templates found in this category.</p>
                </div>
            )}
        </div>
    );
}
