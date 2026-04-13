"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, User, Layout, Eye } from "lucide-react";

interface UploadAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    assetType: "character" | "scene" | "prop";
    assetName: string;
    defaultDescription: string;
    scriptId: string;
    onUploadComplete: (updatedScript: any) => void;
}

const UPLOAD_TYPES = {
    character: [
        { id: "full_body", label: "全身图", icon: User, description: "角色全身立绘" },
        { id: "head_shot", label: "头像特写", icon: Eye, description: "角色头像/面部特写" },
        { id: "three_views", label: "三视图", icon: Layout, description: "角色正面/侧面/背面" },
    ],
    scene: [
        { id: "image", label: "场景图", icon: ImageIcon, description: "场景参考图" },
    ],
    prop: [
        { id: "image", label: "道具图", icon: ImageIcon, description: "道具参考图" },
    ],
};

export default function UploadAssetModal({
    isOpen,
    onClose,
    assetId,
    assetType,
    assetName,
    defaultDescription,
    scriptId,
    onUploadComplete,
}: UploadAssetModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadType, setUploadType] = useState<string>(
        assetType === "character" ? "full_body" : "image"
    );
    const [description, setDescription] = useState(defaultDescription);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setError("请选择图片文件");
                return;
            }
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError("文件大小不能超过 10MB");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    }, []);

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("请先选择图片");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Use api.uploadAsset which uses the correct backend API URL
            const { api } = await import("@/lib/api");
            const updatedScript = await api.uploadAsset(
                scriptId,
                assetType,
                assetId,
                selectedFile,
                uploadType,
                description
            );
            onUploadComplete(updatedScript);
            handleClose();
        } catch (err: any) {
            setError(err.message || "上传失败，请重试");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
        setDescription(defaultDescription);
        onClose();
    };

    const uploadTypes = UPLOAD_TYPES[assetType] || [];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">
                            上传资产 - {assetName}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Upload Type Selector (only for Character) */}
                    {assetType === "character" && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-3">
                                选择资产类型
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {uploadTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setUploadType(type.id)}
                                            className={`p-4 rounded-lg border-2 transition-all ${uploadType === type.id
                                                ? "border-primary bg-primary/10"
                                                : "border-white/10 hover:border-white/20"
                                                }`}
                                        >
                                            <Icon
                                                size={24}
                                                className={`mx-auto mb-2 ${uploadType === type.id ? "text-primary" : "text-gray-400"
                                                    }`}
                                            />
                                            <div className="text-sm font-medium text-white">{type.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* File Upload Area */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                            选择图片
                        </label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${previewUrl
                                ? "border-primary bg-primary/5"
                                : "border-white/20 hover:border-white/40"
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            {previewUrl ? (
                                <div className="relative">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-h-48 mx-auto rounded-lg object-contain"
                                    />
                                    <div className="mt-3 text-sm text-gray-400">
                                        点击更换图片
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload size={32} className="mx-auto text-gray-500 mb-3" />
                                    <div className="text-gray-400">拖拽图片到此处或点击选择</div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        支持 JPG、PNG、WebP，最大 10MB
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description Editor */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            角色描述 <span className="text-xs text-gray-500">(用于后续生成)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-primary/50"
                            placeholder="描述角色的外观特征..."
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            💡 请确保描述与上传图片一致，这将用于生成其他类型的资产
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    上传中...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    确认上传
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
