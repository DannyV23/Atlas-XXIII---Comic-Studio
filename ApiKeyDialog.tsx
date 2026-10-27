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

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-[#0E070C]/90 backdrop-blur-md p-4 animate-in fade-in duration-300 font-sans">
      <div className="relative max-w-lg w-full bg-[#150711] border border-[#3D1629] rounded-[28px] shadow-[0_0_50px_rgba(198,139,89,0.2)] p-8 overflow-hidden text-[#FAF5F0]">
        <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C68B59] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#C68B59] uppercase">
                Atlas XXIII Suite Authorization
              </span>
            </div>

            <h2 className="font-mono font-bold text-2xl text-[#FAF5F0] mb-3 uppercase tracking-wide">
              Gemini Session Key
            </h2>

            <p className="text-[#EADDE2] mb-6 leading-relaxed text-xs">
              To author stories and synthesize comic panels in <strong>Comic Studio</strong>, enter your Gemini API key below. High-fidelity rendering utilizes Gemini 3.8 Flash and Flagship Nano Banana 2.1 models.
            </p>

            <div className="mb-6 space-y-2">
              <div className="relative">
                <input
                  type={isRevealed ? "text" : "password"}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste Gemini API key (AIzaSy...)"
                  className="w-full bg-[#12060E] border border-[#3D1629] focus:border-[#C68B59] rounded-xl px-3 py-2.5 text-xs text-[#FAF5F0] placeholder-[#8A6D7B] font-mono outline-none pr-14"
                />
                <button
                  type="button"
                  onClick={() => setIsRevealed(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8A6D7B] hover:text-[#FAF5F0] font-mono"
                >
                  {isRevealed ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="bg-[#1B0A16] border border-[#3D1629] p-3.5 mb-6 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">✨</span>
                <div>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#DF9E65] hover:text-[#FAF5F0] underline font-bold text-[11px] font-mono uppercase"
                  >
                    Get Free Gemini Key ↗
                  </a>
                  <p className="text-[10px] text-[#8A6D7B]">100% Free quota from Google AI Studio</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-mono font-bold text-xs py-3.5 rounded-full hover:brightness-110 uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(198,139,89,0.3)] active:scale-95"
            >
              {hasExistingKey ? "Continue to Studio" : "Activate & Enter"}
            </button>
        </div>
      </div>
    </div>
  );
};
