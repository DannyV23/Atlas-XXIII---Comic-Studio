import React from 'react';
import { APP_VERSION } from './types';
import { AtlasLogo } from './AtlasLogo';

interface AboutModalProps {
    onClose: () => void;
    onOpenUpdateLogs?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, onOpenUpdateLogs }) => {
    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[#0E070C]/90 backdrop-blur-xl p-6 animate-in fade-in duration-300 font-sans">
            <div className="relative max-w-2xl w-full bg-[#150711]/95 text-[#EADDE2] border border-[#3D1629] rounded-[28px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 overflow-hidden">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-[#8A6D7B] hover:text-[#FAF5F0] text-xl font-bold transition-colors"
                >
                    ✕
                </button>
                
                <div className="flex flex-col items-center text-center mb-6">
                    <AtlasLogo size="md" className="mb-3" />
                    <button
                        type="button"
                        onClick={() => {
                            if (onOpenUpdateLogs) {
                                onClose();
                                onOpenUpdateLogs();
                            }
                        }}
                        className="bg-[#2A0E20] hover:bg-[#38132B] hover:border-[#C68B59] text-[#DF9E65] border border-[#3D1629] px-3.5 py-1 rounded-full font-mono text-xs tracking-widest uppercase font-bold transition-all cursor-pointer hover:scale-105"
                        title="View Comic Studio Release Ledger"
                    >
                        {APP_VERSION}
                    </button>
                </div>

                <div className="space-y-6 text-sm">
                    <div className="bg-[#1B0A16] p-5 rounded-2xl border border-[#3D1629]">
                        <h3 className="font-bold uppercase text-[#DF9E65] text-xs tracking-wider mb-2 font-mono">
                            Studio Architecture
                        </h3>
                        <p className="text-[#EADDE2] text-xs leading-relaxed">
                            Ultra-luxury editorial comic book authoring and illustration suite powered by Gemini 3.8 Flash, Flagship Nano Banana 2.1, and 4K page layout synthesis.
                        </p>
                    </div>

                    <div className="bg-[#1B0A16] p-5 rounded-2xl border border-[#3D1629]">
                        <h3 className="font-bold uppercase text-[#C68B59] text-xs tracking-wider mb-3 font-mono">
                            Core Capabilities
                        </h3>
                        <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-[#8A6D7B] list-disc list-inside">
                            <li>Multi-Panel Layouts & Story Director</li>
                            <li>Character Consistency Lab</li>
                            <li>Prompt Lab & Payload Viewer</li>
                            <li>Image Refiner & Inpainting Studio</li>
                            <li>Prop & Location Armory</li>
                            <li>CBS Archive Save / Restore</li>
                            <li>PDF & ZIP High-Res Export</li>
                            <li>Diagnostic Error Telemetry</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={onClose} 
                        className="bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold text-xs px-8 py-3 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(198,139,89,0.3)] hover:brightness-110 active:scale-95 transition-all font-mono"
                    >
                        Return to Studio
                    </button>
                </div>
            </div>
        </div>
    );
};
