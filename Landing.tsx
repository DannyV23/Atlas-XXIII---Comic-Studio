import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageModel, AppLanguage, UI_LABELS, IMAGE_MODEL_OPTIONS, APP_VERSION } from './types';
import { TactileBackground } from './TactileBackground';
import { AtlasLogo } from './AtlasLogo';
import { BillingGuideModal } from './BillingGuideModal';
import { ErrorLoggerModal } from './ErrorLoggerModal';
import { getActiveApiKey, hasValidApiKey } from './geminiService';
import { studioLogger, StudioLogEntry } from './ErrorLogger';

interface LandingProps {
    onNew: () => void;
    onContinue: () => void;
    onChangeApiKey: () => void;
    imageModel: ImageModel;
    onImageModelChange: (model: ImageModel) => void;
    appLanguage: AppLanguage;
    onAppLanguageChange: (lang: AppLanguage) => void;
}

export const Landing: React.FC<LandingProps> = ({ 
    onNew, 
    onContinue, 
    imageModel, 
    onImageModelChange, 
    appLanguage, 
    onAppLanguageChange 
}) => {
    const [hasKey, setHasKey] = useState<boolean>(false);
    const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
    const [isKeyDrawerOpen, setIsKeyDrawerOpen] = useState<boolean>(false);
    const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
    const [isErrorLogOpen, setIsErrorLogOpen] = useState<boolean>(false);
    const [missingKeyPrompt, setMissingKeyPrompt] = useState<boolean>(false);
    const [sessionKeyInput, setSessionKeyInput] = useState<string>('');
    const [showKeyText, setShowKeyText] = useState<boolean>(false);
    const [recentLogs, setRecentLogs] = useState<StudioLogEntry[]>([]);

    const labels = UI_LABELS[appLanguage];

    const refreshKeyStatus = () => {
        const key = getActiveApiKey();
        const valid = key.length >= 10;
        setHasKey(valid);
        setSessionKeyInput(key);
    };

    useEffect(() => {
        refreshKeyStatus();
        const unsub = studioLogger.subscribe((logs) => setRecentLogs(logs));
        return () => unsub();
    }, []);

    const handleSaveSessionKey = () => {
        const trimmed = sessionKeyInput.trim();
        if (!trimmed) return;
        localStorage.setItem('comic_gemini_api_key', trimmed);
        localStorage.setItem('gemini_api_key', trimmed);
        setHasKey(true);
        setIsKeyDrawerOpen(false);
        setMissingKeyPrompt(false);
    };

    const handleClearSessionKey = () => {
        localStorage.removeItem('comic_gemini_api_key');
        localStorage.removeItem('gemini_api_key');
        setSessionKeyInput('');
        setHasKey(false);
    };

    const handleEnter = (action: () => void) => {
        if (!hasValidApiKey()) {
            setMissingKeyPrompt(true);
            setIsGuideOpen(true);
            return;
        }
        action();
    };

    const activeModelOption = IMAGE_MODEL_OPTIONS.find(m => m.id === imageModel) || IMAGE_MODEL_OPTIONS[0];
    const errorCount = recentLogs.filter(l => l.severity === 'error').length;

    return (
        <div className="relative min-h-screen w-full bg-[#0E070C] text-[#FAF5F0] overflow-hidden flex flex-col justify-between select-none font-sans">
            {/* Tactile Background Motif */}
            <TactileBackground />

            {/* Top Navigation Bar */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-wrap items-center justify-between gap-4">
                {/* Left: Brand Mini Insignia */}
                <div className="flex items-center gap-2">
                    <AtlasLogo size="sm" subtitle="" />
                </div>

                {/* Right: Language Selector, Model Engine Pill, API Key Trigger, Guide & Diagnostics */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Language Switcher */}
                    <div className="flex items-center bg-[#13060E] border border-[#3D1629] p-1 rounded-full shadow-md">
                        <button
                            onClick={() => onAppLanguageChange('en')}
                            className={`text-[11px] px-3 py-1 font-bold rounded-full transition-all font-mono ${
                                appLanguage === 'en'
                                    ? 'bg-[#2A0E20] text-[#DF9D64] border border-[#3D1629]'
                                    : 'text-[#8A6D7B] hover:text-[#FAF5F0]'
                            }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => onAppLanguageChange('esp')}
                            className={`text-[11px] px-3 py-1 font-bold rounded-full transition-all font-mono ${
                                appLanguage === 'esp'
                                    ? 'bg-[#2A0E20] text-[#DF9D64] border border-[#3D1629]'
                                    : 'text-[#8A6D7B] hover:text-[#FAF5F0]'
                            }`}
                        >
                            ES
                        </button>
                    </div>

                    {/* Model Tier Quick Trigger */}
                    <button
                        onClick={() => setIsConfigOpen(prev => !prev)}
                        className="text-xs font-medium text-[#FAF5F0] px-3.5 py-1.5 rounded-full border border-[#3D1629] bg-[#180B16]/80 hover:bg-[#230F20] transition-all flex items-center gap-2 backdrop-blur-md shadow-sm font-mono"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D49A5A]" />
                        <span>{activeModelOption.label}</span>
                        <span className="text-[10px] text-[#DF9D64] bg-[#2A0E20] px-1.5 py-0.5 rounded-full border border-[#3D1629]">
                            {activeModelOption.badge}
                        </span>
                    </button>

                    {/* Session API Key Trigger Pill */}
                    <button
                        onClick={() => setIsKeyDrawerOpen(prev => !prev)}
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm font-mono ${
                            hasKey
                                ? 'bg-[#180B16]/90 border-[#3D1629] hover:border-[#C68B59]/60 text-[#FAF5F0] hover:bg-[#230F20]'
                                : 'bg-[#2A0E20] border-[#DF9E65]/50 text-[#DF9E65] hover:bg-[#38132B]'
                        }`}
                        title={hasKey ? 'Session API Key Active — Click to change' : 'Enter Gemini API Key for this session'}
                    >
                        <span className="text-[11px] text-[#C68B59]">🔑</span>
                        <span>{hasKey ? 'Key Active' : 'Enter API Key'}</span>
                        <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-400' : 'bg-[#DF9E65] animate-pulse'}`} />
                    </button>

                    {/* Diagnostic / Error Log Pill */}
                    <button
                        onClick={() => setIsErrorLogOpen(true)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm ${
                            errorCount > 0
                                ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                                : 'bg-[#180B16]/80 border-[#3D1629] hover:border-[#C68B59]/40 text-[#8A6D7B] hover:text-[#FAF5F0]'
                        }`}
                        title="Open Diagnostics and Error Logger"
                    >
                        <span>🛠️</span>
                        <span>Logs</span>
                        {errorCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                                {errorCount}
                            </span>
                        )}
                    </button>

                    {/* API Guide Modal Trigger */}
                    <button
                        onClick={() => {
                            setMissingKeyPrompt(false);
                            setIsGuideOpen(true);
                        }}
                        className="text-xs font-medium text-[#FAF5F0] px-4 py-1.5 rounded-full border border-[#3D1629] bg-[#180B16]/80 hover:bg-[#230F20] transition-all backdrop-blur-md shadow-sm font-mono"
                    >
                        Guide
                    </button>
                </div>
            </header>

            {/* Main Editorial Hero Section */}
            <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center">
                {/* Central Brand Lockup */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 md:mb-12"
                >
                    <AtlasLogo size="xl" subtitle="COMIC STUDIO" />
                </motion.div>

                {/* Sleek Pill Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="flex flex-col items-center justify-center gap-4 w-full"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Primary Action Button: Start Fresh / New Universe */}
                        <button
                            onClick={() => handleEnter(onNew)}
                            className="bg-gradient-to-r from-[#D49A5A] to-[#A66B32] hover:from-[#E2A767] hover:to-[#B5783C] text-[#120810] font-bold text-xs md:text-sm px-9 py-4 rounded-full shadow-[0_0_30px_rgba(212,154,90,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-mono uppercase tracking-wider"
                        >
                            <span>✨</span>
                            <span>{labels.newUniverse}</span>
                        </button>

                        {/* Secondary Action Button: Continue Saga / Restore Session */}
                        <button
                            onClick={() => handleEnter(onContinue)}
                            className="bg-[#180B16] hover:bg-[#230F20] border border-[#3D1629] hover:border-[#D49A5A]/50 text-[#FAF5F0] font-bold text-xs md:text-sm px-9 py-4 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-mono uppercase tracking-wider shadow-inner"
                        >
                            <span>📂</span>
                            <span>{labels.continueSaga}</span>
                        </button>
                    </div>

                    {/* Direct Session API Key Input Drawer */}
                    <AnimatePresence>
                        {(!hasKey || isKeyDrawerOpen) && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                className="mt-4 p-5 bg-[#180B16]/95 border border-[#C68B59]/35 rounded-2xl max-w-md w-full backdrop-blur-xl shadow-2xl text-left space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">🔑</span>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FAF5F0] font-mono">
                                            Gemini Session API Key
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setMissingKeyPrompt(false);
                                                setIsGuideOpen(true);
                                            }}
                                            className="text-[10px] font-semibold text-[#DF9E65] hover:underline font-mono"
                                        >
                                            Get Free Key ↗
                                        </button>
                                        {hasKey && (
                                            <button
                                                onClick={() => setIsKeyDrawerOpen(false)}
                                                className="text-xs text-[#8A6D7B] hover:text-white pl-1"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showKeyText ? 'text' : 'password'}
                                            value={sessionKeyInput}
                                            onChange={(e) => setSessionKeyInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && sessionKeyInput.trim()) {
                                                    handleSaveSessionKey();
                                                }
                                            }}
                                            placeholder="Paste Gemini API Key (AIzaSy...)"
                                            className="w-full bg-[#12060E] border border-[#3D1629] focus:border-[#C68B59] rounded-xl px-3 py-2 text-xs text-[#FAF5F0] placeholder-[#8A6D7B] font-mono outline-none pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowKeyText(prev => !prev)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8A6D7B] hover:text-[#FAF5F0] font-mono"
                                        >
                                            {showKeyText ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleSaveSessionKey}
                                        disabled={!sessionKeyInput.trim()}
                                        className="bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold text-xs px-4 py-2 rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 shrink-0 shadow-sm font-mono uppercase"
                                    >
                                        Activate
                                    </button>
                                    {hasKey && (
                                        <button
                                            onClick={handleClearSessionKey}
                                            className="px-2.5 py-2 rounded-xl text-xs text-[#8A6D7B] hover:text-rose-400 bg-[#12060E] border border-[#3D1629] transition-colors"
                                            title="Clear API Key"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Indicator when key is active and drawer is closed */}
                    {hasKey && !isKeyDrawerOpen && (
                        <div className="flex items-center gap-2 text-[11px] text-emerald-400/90 mt-2 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Active Session Key Ready</span>
                            <span className="text-[#3D1629]">·</span>
                            <button
                                onClick={() => setIsKeyDrawerOpen(true)}
                                className="text-[#C68B59] hover:underline"
                            >
                                Change
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Model Tier Config Overlay */}
                <AnimatePresence>
                    {isConfigOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="mt-6 p-5 bg-[#180B16]/95 border border-[#3D1629] rounded-2xl max-w-xl w-full backdrop-blur-xl shadow-2xl text-left space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-[#3D1629] pb-3">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#D49A5A] font-mono">
                                        Studio Engine Configuration
                                    </span>
                                    <p className="text-[11px] text-[#8A6D7B] mt-0.5">
                                        Select the active Gemini visual synthesis model for story pages and reference sheets.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setIsConfigOpen(false)}
                                    className="text-xs text-[#8A6D7B] hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {IMAGE_MODEL_OPTIONS.map((tier) => (
                                    <button
                                        key={tier.id}
                                        onClick={() => {
                                            onImageModelChange(tier.id);
                                            setIsConfigOpen(false);
                                        }}
                                        className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between gap-1.5 ${
                                            imageModel === tier.id
                                                ? 'bg-[#2B1127] border-[#D49A5A] text-[#FAF5F0] font-bold shadow-md'
                                                : 'bg-[#120810] border-[#3D1629] text-[#A88B97] hover:border-[#D49A5A]/40'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="truncate text-xs font-bold font-mono text-[#FAF5F0]">
                                                {tier.label}
                                            </span>
                                            <span className="text-[10px] text-[#DF9E65] font-mono bg-[#2A0E20] px-1.5 py-0.5 rounded border border-[#3D1629]">
                                                {tier.badge}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-[#8A6D7B] font-sans leading-tight">
                                            {tier.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Unified Atlas XXIII Bottom Panel adhering strictly to Rule 14 */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 border-t border-[#3D1629]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-wider text-[#8A6D7B]">
                <div className="flex items-center gap-2">
                    <a
                        href="https://atlasxxiii.app"
                        className="text-[#FAF5F0] hover:text-[#DF9D64] font-semibold transition-colors"
                    >
                        Atlas XXIII
                    </a>
                    <span aria-hidden="true" className="text-[#3D1629]">·</span>
                    <span>Created by</span>
                    <a
                        href="https://www.instagram.com/dannyvain/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#DF9D64] hover:text-[#FAF5F0] transition-colors font-medium underline underline-offset-4 decoration-[#C68B59]/40"
                    >
                        Danny Vain
                    </a>
                </div>
                <div className="flex items-center gap-2.5 font-mono">
                    <span className="uppercase tracking-widest text-[#8A6D7B] text-[10px]">Comic Studio</span>
                    <span aria-hidden="true" className="text-[#3D1629]">·</span>
                    <span className="text-[10px] font-mono text-[#DF9D64] bg-[#2A0E20] px-2.5 py-0.5 rounded-full border border-[#3D1629] font-semibold">
                        {APP_VERSION}
                    </span>
                </div>
            </footer>

            {/* API Billing Guide Modal */}
            <BillingGuideModal
                isOpen={isGuideOpen}
                missingKeyNotice={missingKeyPrompt}
                onClose={() => {
                    setIsGuideOpen(false);
                    setMissingKeyPrompt(false);
                }}
                onKeySaved={() => {
                    refreshKeyStatus();
                }}
            />

            {/* Error Logger Modal */}
            <ErrorLoggerModal
                isOpen={isErrorLogOpen}
                onClose={() => setIsErrorLogOpen(false)}
            />
        </div>
    );
};
