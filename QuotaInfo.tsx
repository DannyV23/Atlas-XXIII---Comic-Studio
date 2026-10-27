import React from 'react';

interface QuotaInfoProps {
    onClose: () => void;
}

export const QuotaInfo: React.FC<QuotaInfoProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0E070C]/90 backdrop-blur-xl p-4 animate-in fade-in duration-200 font-sans">
            <div className="relative max-w-2xl w-full bg-[#150711]/95 border border-[#3D1629] rounded-[28px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 overflow-hidden text-[#EADDE2]">
                
                <div className="flex items-start gap-4 mb-6 border-b border-[#3D1629] pb-6">
                    <div className="w-12 h-12 rounded-full bg-[#2A0E20] border border-[#3D1629] flex items-center justify-center text-2xl shrink-0">
                        ⚡
                    </div>
                    <div>
                        <h2 className="text-2xl font-cinzel font-bold text-[#FAF5F0] tracking-wider mb-1">
                            API Specifications & Limits
                        </h2>
                        <p className="text-xs font-semibold text-[#8A6D7B] uppercase tracking-wider">Operational Guidelines for Atlas XXIII Studio</p>
                    </div>
                </div>

                <div className="space-y-6 text-sm leading-relaxed">
                    <div className="bg-[#1B0A16] border border-[#3D1629] rounded-2xl p-5">
                        <h3 className="text-[#DF9E65] font-bold uppercase mb-2 text-xs tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#DF9E65] rounded-full animate-pulse" />
                            Gemini 3 Pro & Nano Banana 2.1 Synthesis
                        </h3>
                        <p className="text-[#EADDE2] text-xs leading-relaxed">
                            Comic generation requires high-resolution image synthesis and multi-part visual reference processing. The backend server manages API keys and request orchestration automatically.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#3D1629] p-4 rounded-2xl bg-[#13060E]">
                            <h4 className="text-[#FAF5F0] font-bold text-xs uppercase tracking-wider border-b border-[#3D1629] pb-2 mb-2">High Resolution Mode</h4>
                            <ul className="list-disc list-inside text-[#8A6D7B] text-xs space-y-1">
                                <li>Model: <strong className="text-[#EADDE2]">Nano Banana 2.1</strong></li>
                                <li>Supports 1K, 2K & 4K fidelity</li>
                                <li>Multi-character reference consistency</li>
                                <li>Enhanced prompt lab execution</li>
                            </ul>
                        </div>
                        <div className="border border-[#3D1629] p-4 rounded-2xl bg-[#13060E]">
                            <h4 className="text-[#DF9E65] font-bold text-xs uppercase tracking-wider border-b border-[#3D1629] pb-2 mb-2">Fast Generation Mode</h4>
                            <ul className="list-disc list-inside text-[#8A6D7B] text-xs space-y-1">
                                <li>Model: <strong className="text-[#EADDE2]">Flash Lite</strong></li>
                                <li>Low-latency response</li>
                                <li>Rapid layout drafting & testing</li>
                                <li>Optimized for speed</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-[#2A0E20]/60 border border-[#3D1629] rounded-2xl p-4">
                        <h4 className="text-[#DF9E65] font-bold text-xs uppercase tracking-wider mb-2">Error Handling Protocols</h4>
                        <ul className="text-[#EADDE2] text-xs space-y-2">
                            <li>
                                <strong className="text-[#FAF5F0]">Server Busyness (503):</strong> Automatically retries request.
                            </li>
                            <li>
                                <strong className="text-[#FAF5F0]">Safety Block:</strong> Adjust prompt wording or character sheet complexity if safety filters trigger.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold text-xs px-8 py-3 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(198,139,89,0.3)] hover:brightness-110 active:scale-95 transition-all"
                    >
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
};
