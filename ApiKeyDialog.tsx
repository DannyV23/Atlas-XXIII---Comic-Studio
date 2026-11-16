import React, { useState, useEffect } from 'react';
import { getActiveApiKey } from './geminiService';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [hasExistingKey, setHasExistingKey] = useState<boolean>(false);

  useEffect(() => {
    const key = getActiveApiKey();
    setApiKeyInput(key);
    setHasExistingKey(key.length >= 10);
  }, []);

  const handleSave = () => {
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      localStorage.setItem('comic_gemini_api_key', trimmed);
      localStorage.setItem('gemini_api_key', trimmed);
    }
    onContinue();
  };

  const handleClear = () => {
    localStorage.removeItem('comic_gemini_api_key');
    localStorage.removeItem('gemini_api_key');
    setApiKeyInput('');
    setHasExistingKey(false);
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-[#0E070C]/90 backdrop-blur-md p-4 animate-in fade-in duration-300 font-sans overflow-y-auto">
      <div className="relative max-w-lg w-full bg-[#150711] border border-[#3D1629] rounded-[28px] shadow-[0_0_50px_rgba(198,139,89,0.2)] p-7 overflow-hidden text-[#FAF5F0] my-auto">
        <button
          type="button"
          onClick={onContinue}
          className="absolute top-5 right-5 text-xs text-[#8A6D7B] hover:text-[#FAF5F0] bg-[#1B0A16] border border-[#3D1629] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          title="Close"
        >
          ✕
        </button>
        <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C68B59] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#C68B59] uppercase">
                Atlas XXIII Suite · API Key & Info
              </span>
            </div>

            <h2 className="font-mono font-bold text-2xl text-[#FAF5F0] mb-2 uppercase tracking-wide">
              Gemini Session Key
            </h2>

            <p className="text-[#EADDE2] mb-4 leading-relaxed text-xs">
              Enter your personal Google Gemini API key below. Your key is stored <strong>locally in your browser only</strong> and sent directly to Google&apos;s Gemini API.
            </p>

            <div className="mb-4 space-y-2">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={isRevealed ? "text" : "password"}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && apiKeyInput.trim()) handleSave();
                    }}
                    placeholder="Paste Gemini API key (AIzaSy...)"
                    className="w-full select-text bg-[#12060E] border border-[#3D1629] focus:border-[#C68B59] rounded-xl px-3 py-2.5 text-xs text-[#FAF5F0] placeholder-[#8A6D7B] font-mono outline-none pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setIsRevealed(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8A6D7B] hover:text-[#FAF5F0] font-mono cursor-pointer"
                  >
                    {isRevealed ? "Hide" : "Show"}
                  </button>
                </div>
                {hasExistingKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 rounded-xl text-xs text-[#8A6D7B] hover:text-rose-400 bg-[#12060E] border border-[#3D1629] transition-colors font-mono cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* API Specs & Free Tier Info */}
            <div className="bg-[#1B0A16] border border-[#3D1629] p-3.5 mb-5 rounded-2xl space-y-2 text-[11px]">
              <div className="flex items-center justify-between border-b border-[#3D1629] pb-2">
                <span className="font-mono font-bold text-[#DF9E65] uppercase text-[10px] tracking-wider">
                  ⚡ API Specifications &amp; Free Tier
                </span>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#DF9E65] hover:text-[#FAF5F0] underline font-bold text-[10px] font-mono uppercase"
                >
                  Get Free Key ↗
                </a>
              </div>
              <ul className="text-[#EADDE2] space-y-1 text-[11px] leading-snug">
                <li><strong className="text-[#FAF5F0]">Text &amp; Scripting:</strong> Gemini 3.8 Flash (story pacing, dialogue &amp; prompts).</li>
                <li><strong className="text-[#FAF5F0]">Visual Synthesis:</strong> Nano Banana 2.1 Pro (4K panels) &amp; Flash Lite (free/fast drafts).</li>
                <li><strong className="text-[#FAF5F0]">Free Tier Quota:</strong> 15 Requests/min &amp; 1,500 Requests/day at zero cost via Google AI Studio.</li>
              </ul>
            </div>

            <button 
              type="button"
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-mono font-bold text-xs py-3.5 rounded-full hover:brightness-110 uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(198,139,89,0.3)] active:scale-95 cursor-pointer"
            >
              {hasExistingKey ? "Save & Continue to Studio" : "Activate & Enter"}
            </button>
        </div>
      </div>
    </div>
  );
};
