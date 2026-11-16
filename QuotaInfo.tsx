import React, { useState, useEffect } from 'react';
import { getActiveApiKey } from './geminiService';

interface QuotaInfoProps {
    onClose: () => void;
}

export const QuotaInfo: React.FC<QuotaInfoProps> = ({ onClose }) => {
    const [apiKeyInput, setApiKeyInput] = useState<string>('');
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [savedMsg, setSavedMsg] = useState<boolean>(false);

    useEffect(() => {
        setApiKeyInput(getActiveApiKey());
    }, []);

    const handleSaveKey = () => {
        const trimmed = apiKeyInput.trim();
        if (!trimmed) return;
        localStorage.setItem('comic_gemini_api_key', trimmed);
        localStorage.setItem('gemini_api_key', trimmed);
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2000);
    };

    const handleClearKey = () => {
        localStorage.removeItem('comic_gemini_api_key');
        localStorage.removeItem('gemini_api_key');
        setApiKeyInput('');
        setSavedMsg(false);
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0E070C]/90 backdrop-blur-xl p-4 animate-in fade-in duration-200 font-sans overflow-y-auto">
            <div className="relative max-w-2xl w-full bg-[#150711]/95 border border-[#3D1629] rounded-[28px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 md:p-8 overflow-hidden text-[#EADDE2] my-auto">
                
                <div className="flex items-start gap-4 mb-5 border-b border-[#3D1629] pb-5">
                    <div className="w-12 h-12 rounded-full bg-[#2A0E20] border border-[#3D1629] flex items-center justify-center text-2xl shrink-0">
                        ⚡
                    </div>
                    <div>
                        <h2 className="text-2xl font-cinzel font-bold text-[#FAF5F0] tracking-wider mb-1">
                            API Key, Specifications &amp; Limits
                        </h2>
                        <p className="text-xs font-semibold text-[#8A6D7B] uppercase tracking-wider">Operational Guidelines for Atlas XXIII Studio</p>
                    </div>
                </div>

                <div className="space-y-5 text-sm leading-relaxed">
                    {/* Direct API Key Input */}
                    <div className="bg-[#1B0A16] border border-[#C68B59]/40 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#DF9E65] uppercase tracking-wider">
                                🔑 Active Gemini Session API Key
                            </span>
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono font-bold text-[#DF9E65] hover:underline"
                            >
                                Get Free Key ↗
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    type={isRevealed ? 'text' : 'password'}
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && apiKeyInput.trim()) handleSaveKey();
                                    }}
                                    placeholder="Paste Gemini API Key (AIzaSy...)"
                                    className="w-full select-text bg-[#12060E] border border-[#3D1629] focus:border-[#C68B59] rounded-xl px-3 py-2 text-xs text-[#FAF5F0] placeholder-[#8A6D7B] font-mono outline-none pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsRevealed(prev => !prev)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8A6D7B] hover:text-[#FAF5F0] font-mono cursor-pointer"
                                >
                                    {isRevealed ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveKey}
                                disabled={!apiKeyInput.trim()}
                                className="btn-studio-bronze text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-40 shrink-0 font-mono uppercase cursor-pointer"
                            >
                                {savedMsg ? 'Saved ✓' : 'Save Key'}
                            </button>
                            {apiKeyInput.trim().length >= 10 && (
                                <button
                                    type="button"
                                    onClick={handleClearKey}
                                    className="px-2.5 py-2 rounded-xl text-xs text-[#8A6D7B] hover:text-rose-400 bg-[#12060E] border border-[#3D1629] transition-colors cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-[#8A6D7B]">
                            Stored locally in your browser (<code className="text-[#EADDE2]">localStorage</code>) and sent directly to Google Gemini API.
                        </p>
                    </div>

                    <div className="bg-[#1B0A16] border border-[#3D1629] rounded-2xl p-4">
                        <h3 className="text-[#DF9E65] font-bold uppercase mb-1.5 text-xs tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#DF9E65] rounded-full animate-pulse" />
                            Gemini 3.8 Flash &amp; Nano Banana 2.1 Synthesis
                        </h3>
                        <p className="text-[#EADDE2] text-xs leading-relaxed">
                            Comic generation uses direct client-side Gemini synthesis for story scripting, multi-character visual reference conditioning, and 4K panel rendering. Free tier keys from Google AI Studio include <strong>15 RPM / 1,500 RPD</strong> at zero cost.
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
