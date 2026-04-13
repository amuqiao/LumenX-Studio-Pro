"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Grid } from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense } from "react";

function Background() {
    return (
        <>
            <color attach="background" args={["#050508"]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Grid
                infiniteGrid
                fadeDistance={50}
                sectionColor="#646cff"
                cellColor="#ffffff"
                sectionSize={10}
                cellSize={1}
                sectionThickness={1}
                cellThickness={0.5}
            />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
        </>
    );
}

export default function CreativeCanvas() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-background">
            <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
                <Suspense fallback={null}>
                    <Background />
                </Suspense>
            </Canvas>

            {/* Overlay gradient for UI readability */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/20 via-transparent to-background/50" />

            {/* Creative Energy Shader Placeholder - implemented via CSS/Canvas mix */}
            <motion.div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
                animate={{
                    background: [
                        "radial-gradient(circle at 50% 50%, rgba(100, 108, 255, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 60% 40%, rgba(100, 108, 255, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 40% 60%, rgba(100, 108, 255, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 50%, rgba(100, 108, 255, 0.1) 0%, transparent 50%)"
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}
