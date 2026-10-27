/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

const LOADING_FX = ["POW!", "BAM!", "ZAP!", "KRAK!", "SKREEE!", "WHOOSH!", "THWIP!", "BOOM!"];

export const LoadingFX: React.FC = () => {
    const [particles, setParticles] = useState<{id: number, text: string, x: string, y: string, rot: number, color: string}[]>([]);
    useEffect(() => {
        const interval = setInterval(() => {
            const id = Date.now();
            const text = LOADING_FX[Math.floor(Math.random() * LOADING_FX.length)];
            const x = `${20 + Math.random() * 60}%`;
            const y = `${20 + Math.random() * 60}%`;
            const rot = Math.random() * 60 - 30;
            const colors = ['text-[#DF9E65]', 'text-[#C68B59]', 'text-[#EADDE2]', 'text-orange-400', 'text-[#FAF5F0]'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            setParticles(prev => [...prev, { id, text, x, y, rot, color }].slice(-4));
        }, 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-[#0E070C] overflow-hidden relative border border-[#3D1629]">
            <style>{`
              @keyframes comic-pop {
                  0% { transform: translate(-50%, -50%) scale(0.2) rotate(var(--rot)); opacity: 0; }
                  20% { transform: translate(-50%, -50%) scale(1.5) rotate(var(--rot)); opacity: 1; }
                  40% { transform: translate(-50%, -50%) scale(1.0) rotate(var(--rot)); opacity: 1; }
                  80% { opacity: 1; }
                  100% { transform: translate(-50%, -50%) scale(1.1) rotate(var(--rot)); opacity: 0; }
              }
            `}</style>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1B0A16] to-[#0E070C] opacity-80" />
            {particles.map(p => (
                <div key={p.id} 
                     className={`absolute font-comic text-5xl md:text-7xl font-bold ${p.color} select-none whitespace-nowrap z-10`}
                     style={{ left: p.x, top: p.y, '--rot': `${p.rot}deg`, animation: 'comic-pop 1.8s forwards ease-out', textShadow: '3px 3px 0px #0E070C, 0 0 20px rgba(198,139,89,0.5)' } as React.CSSProperties}>
                    {p.text}
                </div>
            ))}
            <p className="absolute bottom-24 inset-x-0 text-center font-sans font-bold text-xs text-[#8A6D7B] uppercase animate-pulse z-0 tracking-widest">Rendering Page...</p>
        </div>
    );
};
