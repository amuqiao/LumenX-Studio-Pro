"use client";

import { Play, Pause, SkipBack, SkipForward, Scissors, Layers } from "lucide-react";
import { useState } from "react";

export default function Timeline() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="h-64 bg-black/60 backdrop-blur-xl border-t border-glass-border flex flex-col">
            {/* Toolbar */}
            <div className="h-12 border-b border-glass-border flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                    >
                        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <div className="flex items-center gap-2 text-gray-400">
                        <button className="hover:text-white"><SkipBack size={16} /></button>
                        <button className="hover:text-white"><SkipForward size={16} /></button>
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-2" />
                    <div className="font-mono text-xs text-primary">00:00:00:00</div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/5 rounded text-gray-400 hover:text-white">
                        <Scissors size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded text-gray-400 hover:text-white">
                        <Layers size={16} />
                    </button>
                </div>
            </div>

            {/* Tracks */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 relative">
                {/* Time Ruler */}
                <div className="h-6 border-b border-white/5 flex items-end pb-1 px-2 mb-2">
                    <div className="flex justify-between w-full text-[10px] font-mono text-gray-500">
                        <span>00:00</span>
                        <span>00:15</span>
                        <span>00:30</span>
                        <span>00:45</span>
                        <span>01:00</span>
                    </div>
                </div>

                {/* Video Track */}
                <div className="h-16 bg-white/5 rounded-lg relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-gray-500 pointer-events-none">Video 1</div>
                    <div className="absolute left-10 top-1 bottom-1 w-32 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center text-xs text-blue-200">
                        Scene 1
                    </div>
                    <div className="absolute left-44 top-1 bottom-1 w-48 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center text-xs text-blue-200">
                        Scene 2
                    </div>
                </div>

                {/* Audio Track */}
                <div className="h-12 bg-white/5 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center px-2 text-xs font-medium text-gray-500 pointer-events-none">Audio 1</div>
                    <div className="absolute left-10 top-1 bottom-1 w-80 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center text-xs text-green-200">
                        Background Music
                    </div>
                </div>

                {/* Playhead */}
                <div className="absolute top-0 bottom-0 left-[150px] w-px bg-red-500 z-10 pointer-events-none">
                    <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rotate-45" />
                </div>
            </div>
        </div>
    );
}
