import React, { useState } from 'react';
import { QuotaInfo } from './QuotaInfo';
import { ImageModel, AppLanguage, UI_LABELS } from './types';
import { AtlasBackground, AtlasFooter } from './AtlasBackgroundAndFooter';

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
    onChangeApiKey, 
    imageModel, 
    onImageModelChange, 
    appLanguage, 
    onAppLanguageChange 
}) => {
    const [showQuota, setShowQuota] = useState(false);
    const isFlash = imageModel === 'gemini-3.1-flash-lite-image';
    const labels = UI_LABELS[appLanguage];

    return (
        <div className="fixed inset-0 bg-[#0E070C] text-[#FAF5F0] flex flex-col items-center justify-center z-[300] overflow-hidden select-none">
            <AtlasBackground />
            {showQuota && <QuotaInfo onClose={() => setShowQuota(false)} />}

            {/* TOP BAR: Controls */}
            <div className="fixed top-6 inset-x-6 z-50 flex items-center justify-between pointer-events-auto">
                {/* AI Model Track Toggle */}
                <div className="flex items-center gap-1.5 bg-[#13060E] border border-[#3D1629] p-1.5 rounded-full shadow-lg">
                    <span className="text-[10px] font-bold text-[#8A6D7B] uppercase px-3 font-sans">Model:</span>
                    <button 
                        onClick={() => onImageModelChange('gemini-nano-banana-2.1')} 
                        className={`text-xs px-4 py-1.5 font-bold rounded-full transition-all font-sans ${
                            !isFlash 
                                ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] shadow-[0_0_15px_rgba(198,139,89,0.3)]' 
                                : 'text-[#8A6D7B] hover:text-[#EADDE2]'
                        }`}
                    >
                        NANO BANANA 2.1 (HQ)
                    </button>
                    <button 
                        onClick={() => onImageModelChange('gemini-3.1-flash-lite-image')} 
                        className={`text-xs px-4 py-1.5 font-bold rounded-full transition-all font-sans ${
                            isFlash 
                                ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] shadow-[0_0_15px_rgba(198,139,89,0.3)]' 
                                : 'text-[#8A6D7B] hover:text-[#EADDE2]'
                        }`}
                    >
                        FLASH LITE (FAST)
                    </button>
                </div>

                {/* App Language Selector */}
                <div className="flex items-center gap-1.5 bg-[#13060E] border border-[#3D1629] p-1.5 rounded-full shadow-lg">
                    <button 
                        onClick={() => onAppLanguageChange('en')} 
                        className={`text-xs px-3.5 py-1.5 font-bold rounded-full transition-all font-sans ${
                            appLanguage === 'en' 
                                ? 'bg-[#3D1629] text-[#FAF5F0] border border-[#C68B59]/40' 
                                : 'text-[#8A6D7B] hover:text-[#EADDE2]'
                        }`}
                    >
                        ENGLISH
                    </button>
                    <button 
                        onClick={() => onAppLanguageChange('esp')} 
                        className={`text-xs px-3.5 py-1.5 font-bold rounded-full transition-all font-sans ${
                            appLanguage === 'esp' 
                                ? 'bg-[#3D1629] text-[#DF9E65] border border-[#C68B59]/40' 
                                : 'text-[#8A6D7B] hover:text-[#EADDE2]'
                        }`}
                    >
                        ESPAÑOL
                    </button>
                </div>
            </div>

            {/* HERO CENTER STAGE */}
            <div className="relative z-10 text-center px-8 py-12 max-w-4xl w-full flex flex-col items-center">
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2.5 bg-[#2A0E20] border border-[#3D1629] px-5 py-2 rounded-full text-xs font-bold text-[#DF9E65] tracking-[0.2em] uppercase mb-8 shadow-lg font-cinzel">
                    <span className="w-2 h-2 rounded-full bg-[#C68B59] animate-pulse" />
                    ATLAS XXIII STUDIO
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl text-[#FAF5F0] font-cinzel-dec font-bold tracking-wider mb-12 drop-shadow-[0_4px_35px_rgba(0,0,0,0.9)]">
                    COMIC STUDIO
                </h1>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    {/* Start Fresh */}
                    <button 
                        onClick={onNew}
                        className="group relative bg-[#150711]/95 backdrop-blur-xl border border-[#3D1629] hover:border-[#C68B59] p-8 rounded-[28px] transition-all duration-300 shadow-2xl hover:shadow-[0_0_35px_rgba(198,139,89,0.25)] hover:-translate-y-1 flex flex-col items-center text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#1B0A16] border border-[#3D1629] group-hover:border-[#DF9E65] flex items-center justify-center text-2xl mb-4 transition-all group-hover:scale-105 shadow-inner">
                            ✨
                        </div>
                        <h2 className="font-cinzel font-bold text-xl text-[#FAF5F0] mb-2 tracking-wide">{labels.newUniverse}</h2>
                        <p className="font-inter text-xs text-[#8A6D7B] font-medium leading-relaxed">{labels.createScratch}</p>
                    </button>

                    {/* Resume Work */}
                    <button 
                        onClick={onContinue}
                        className="group relative bg-[#150711]/95 backdrop-blur-xl border border-[#3D1629] hover:border-[#C68B59] p-8 rounded-[28px] transition-all duration-300 shadow-2xl hover:shadow-[0_0_35px_rgba(198,139,89,0.25)] hover:-translate-y-1 flex flex-col items-center text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#1B0A16] border border-[#3D1629] group-hover:border-[#DF9E65] flex items-center justify-center text-2xl mb-4 transition-all group-hover:scale-105 shadow-inner">
                            📂
                        </div>
                        <h2 className="font-cinzel font-bold text-xl text-[#DF9E65] mb-2 tracking-wide">{labels.continueSaga}</h2>
                        <p className="font-inter text-xs text-[#8A6D7B] font-medium leading-relaxed">{labels.uploadRestore}</p>
                    </button>
                </div>

                {/* System Info Toggle */}
                <button 
                    onClick={() => setShowQuota(true)}
                    className="mt-10 text-[#8A6D7B] hover:text-[#C68B59] text-xs font-semibold tracking-wider transition-colors font-mono uppercase border-b border-transparent hover:border-[#C68B59] pb-0.5"
                >
                    API Usage & Specifications
                </button>
            </div>

            <AtlasFooter />
        </div>
    );
};