"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";


interface CreateProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateProjectDialog({ isOpen, onClose }: CreateProjectDialogProps) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const createProject = useProjectStore((state) => state.createProject);


    const handleCreate = async () => {
        if (!title) {
            alert("请填写项目标题");
            return;
        }

        setIsCreating(true);
        try {
            await createProject(title, text, true);
            // Get the newly created project
            const currentProject = useProjectStore.getState().currentProject;
            if (currentProject) {
                // Use hash-based routing to match the app's routing structure
                window.location.hash = `#/project/${currentProject.id}`;
            }
            onClose();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.detail || error?.message || "请检查后端连接";
            alert(`创建项目失败: ${errorMessage}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="glass-panel p-8 rounded-2xl w-full max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-display font-bold text-white">创建新项目</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    项目标题
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="输入项目标题..."
                                    className="glass-input w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    脚本内容
                                </label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="粘贴小说或剧本内容..."
                                    rows={10}
                                    className="glass-input w-full resize-none font-mono text-sm"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 glass-button"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={isCreating || !title}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCreating ? "创建中..." : "创建项目"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
