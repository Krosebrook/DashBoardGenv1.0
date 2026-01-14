/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Session } from '../../types';
import { FolderIcon, TagIcon, TrashIcon } from '../Icons';

interface ProjectsPanelProps {
    sessions: Session[];
    currentSessionIndex: number;
    onJumpToSession: (index: number) => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
    onUpdateSession: (id: string, updates: { name?: string; tags?: string[] }) => void;
}

export default function ProjectsPanel({ 
    sessions, 
    currentSessionIndex, 
    onJumpToSession, 
    onDeleteSession,
    onUpdateSession 
}: ProjectsPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [editingSession, setEditingSession] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editTags, setEditTags] = useState('');

    // Extract all unique tags from sessions
    const allTags = Array.from(
        new Set(
            sessions
                .flatMap(s => (s as any).tags || [])
                .filter(Boolean)
        )
    );

    // Filter sessions by search and tag
    const filteredSessions = sessions.filter(session => {
        const matchesSearch = !searchQuery || 
            session.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ((session as any).name || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = !selectedTag || 
            ((session as any).tags || []).includes(selectedTag);

        return matchesSearch && matchesTag;
    });

    const handleStartEdit = (session: Session) => {
        setEditingSession(session.id);
        setEditName((session as any).name || session.prompt);
        setEditTags(((session as any).tags || []).join(', '));
    };

    const handleSaveEdit = (sessionId: string) => {
        const tags = editTags
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
        
        onUpdateSession(sessionId, {
            name: editName,
            tags: tags
        });
        
        setEditingSession(null);
    };

    const handleCancelEdit = () => {
        setEditingSession(null);
        setEditName('');
        setEditTags('');
    };

    const getSessionName = (session: Session): string => {
        return (session as any).name || session.prompt;
    };

    const getSessionTags = (session: Session): string[] => {
        return (session as any).tags || [];
    };

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="projects-panel">
            <div className="projects-header">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {allTags.length > 0 && (
                <div className="tags-filter">
                    <button
                        className={`tag-filter-btn ${selectedTag === null ? 'active' : ''}`}
                        onClick={() => setSelectedTag(null)}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
                            onClick={() => setSelectedTag(tag)}
                        >
                            <TagIcon /> {tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="projects-list">
                {filteredSessions.length === 0 ? (
                    <div className="no-projects">
                        <p>No projects found</p>
                    </div>
                ) : (
                    filteredSessions.map((session, index) => {
                        const actualIndex = sessions.indexOf(session);
                        const isEditing = editingSession === session.id;
                        const sessionName = getSessionName(session);
                        const sessionTags = getSessionTags(session);

                        return (
                            <div
                                key={session.id}
                                className={`project-item ${actualIndex === currentSessionIndex ? 'active' : ''}`}
                            >
                                {isEditing ? (
                                    <div className="project-edit-form">
                                        <input
                                            type="text"
                                            className="edit-input"
                                            placeholder="Project name"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="edit-input"
                                            placeholder="Tags (comma-separated)"
                                            value={editTags}
                                            onChange={(e) => setEditTags(e.target.value)}
                                        />
                                        <div className="edit-actions">
                                            <button 
                                                className="save-btn"
                                                onClick={() => handleSaveEdit(session.id)}
                                            >
                                                Save
                                            </button>
                                            <button 
                                                className="cancel-btn"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div 
                                            className="project-content"
                                            onClick={() => onJumpToSession(actualIndex)}
                                        >
                                            <div className="project-icon">
                                                <FolderIcon />
                                            </div>
                                            <div className="project-info">
                                                <div className="project-name">{sessionName}</div>
                                                <div className="project-meta">
                                                    <span className="project-date">{formatDate(session.timestamp)}</span>
                                                    {sessionTags.length > 0 && (
                                                        <div className="project-tags">
                                                            {sessionTags.map(tag => (
                                                                <span key={tag} className="project-tag">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="project-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStartEdit(session);
                                                }}
                                                title="Edit project"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => onDeleteSession(session.id, e)}
                                                title="Delete project"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="projects-footer">
                <div className="project-count">
                    {filteredSessions.length} of {sessions.length} projects
                </div>
            </div>
        </div>
    );
}
