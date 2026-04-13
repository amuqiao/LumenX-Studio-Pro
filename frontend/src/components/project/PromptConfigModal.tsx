"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, RotateCcw, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { api } from '@/lib/api';

interface PromptConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PromptDefaults {
    storyboard_polish: string;
    video_polish: string;
    r2v_polish: string;
}

const SECTIONS = [
    {
        key: 'storyboard_polish' as const,
        label: 'Storyboard Polish (Prompt C)',
        description: 'System prompt for storyboard/image prompt polishing. Placeholders: {ASSETS} (asset context), {DRAFT} (user draft prompt).',
    },
    {
        key: 'video_polish' as const,
        label: 'Video I2V Polish (Prompt D)',
        description: 'System prompt for Image-to-Video prompt polishing. No dynamic placeholders needed.',
    },
    {
        key: 'r2v_polish' as const,
        label: 'Video R2V Polish (Prompt E)',
        description: 'System prompt for Reference-to-Video prompt polishing. Placeholder: {SLOTS} (character slot context).',
    },
];

export default function PromptConfigModal({ isOpen, onClose }: PromptConfigModalProps) {
    const currentProject = useProjectStore((state) => state.currentProject);
    const updateProject = useProjectStore((state) => state.updateProject);

    const [config, setConfig] = useState({ storyboard_polish: '', video_polish: '', r2v_polish: '' });
    const [defaults, setDefaults] = useState<PromptDefaults | null>(null);
    const [expandedDefault, setExpandedDefault] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && currentProject) {
            setIsLoading(true);
            setLoadError(null);
            setExpandedDefault(null);
            api.getPromptConfig(currentProject.id)
                .then((data) => {
                    setConfig(data.prompt_config);
                    setDefaults(data.defaults);
                })
                .catch((err) => {
                    console.error("Failed to load prompt config:", err);
                    setLoadError("Failed to load prompt configuration. Please try again.");
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, currentProject?.id]);

    const handleSave = async () => {
        if (!currentProject) return;
        setIsSaving(true);
        try {
            const result = await api.updatePromptConfig(currentProject.id, config);
            updateProject(currentProject.id, { prompt_config: result.prompt_config });
            onClose();
        } catch (error) {
            console.error("Failed to save prompt config:", error);
            alert("Failed to save prompt configuration");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = (key: keyof PromptDefaults) => {
        setConfig(prev => ({ ...prev, [key]: '' }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <FileText size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Prompt Configuration</h2>
                                <p className="text-xs text-gray-400">Customize system prompts for AI polish stages</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={24} className="animate-spin text-purple-400" />
                                <span className="ml-2 text-gray-400">Loading configuration...</span>
                            </div>
                        ) : loadError ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-300">
                                {loadError}
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300">
                                    Leave a field empty to use the system default prompt. Custom prompts completely replace the default for that stage.
                                </div>

                                {SECTIONS.map((section) => (
                                    <div key={section.key} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{section.label}</h3>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{section.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleReset(section.key)}
                                                disabled={!config[section.key]}
                                                className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <RotateCcw size={10} /> Reset to default
                                            </button>
                                        </div>

                                        <textarea
                                            value={config[section.key]}
                                            onChange={(e) => setConfig(prev => ({ ...prev, [section.key]: e.target.value }))}
                                            placeholder={defaults ? defaults[section.key].slice(0, 150) + '...' : 'Loading default...'}
                                            className="w-full h-32 bg-black/30 border border-white/10 rounded-lg p-3 text-xs text-gray-300 resize-y focus:outline-none focus:border-purple-500/50 font-mono placeholder-gray-600"
                                        />

                                        {/* Expandable default prompt viewer */}
                                        {defaults && (
                                            <div>
                                                <button
                                                    onClick={() => setExpandedDefault(expandedDefault === section.key ? null : section.key)}
                                                    className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
                                                >
                                                    {expandedDefault === section.key ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                                    View full default prompt
                                                </button>
                                                {expandedDefault === section.key && (
                                                    <pre className="mt-2 bg-black/40 border border-white/5 rounded-lg p-3 text-[10px] text-gray-500 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap font-mono">{defaults[section.key]}</pre>
                                                )}
                                            </div>
                                        )}

                                        {section.key !== 'r2v_polish' && (
                                            <div className="border-b border-white/5" />
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading || !!loadError}
                            className="px-6 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving && <Loader2 size={14} className="animate-spin" />}
                            Save
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
