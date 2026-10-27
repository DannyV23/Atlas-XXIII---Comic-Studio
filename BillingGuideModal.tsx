import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Props {
  isOpen: boolean;
  missingKeyNotice?: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
  onOpenKeyPicker?: () => void;
}

export const BillingGuideModal: React.FC<Props> = ({ 
  isOpen, 
  missingKeyNotice = false,
  onClose, 
  onKeySaved,
  onOpenKeyPicker
}) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [hasExistingKey, setHasExistingKey] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const stored = localStorage.getItem('comic_gemini_api_key') || 
                     localStorage.getItem('persona_gemini_api_key') || 
                     localStorage.getItem('logopro_gemini_api_key') || 
                     localStorage.getItem('gemini_api_key') || '';
      setApiKeyInput(stored);
      setHasExistingKey(Boolean(stored && stored.trim().length >= 10));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (trimmed) {
      localStorage.setItem('comic_gemini_api_key', trimmed);
      localStorage.setItem('gemini_api_key', trimmed);
      setSavedSuccess(true);
      setHasExistingKey(true);
      if (onKeySaved) {
        onKeySaved();
      }
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('comic_gemini_api_key');
    localStorage.removeItem('gemini_api_key');
    setApiKeyInput('');
    setHasExistingKey(false);
    setSavedSuccess(false);
    if (onKeySaved) {
      onKeySaved();
    }
  };

  const isAiStudioEnv = typeof window !== 'undefined' && Boolean((window as any).aistudio?.openSelectKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080206]/85 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#160812] border border-[#C68B59]/30 rounded-3xl w-full max-w-2xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Missing Key Urgent Banner */}
        {missingKeyNotice && (
          <div className="p-4 rounded-2xl bg-[#2A0E20] border border-[#DF9E65]/50 flex items-start gap-3 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B97743] to-[#DF9E65] text-[#12060C] flex items-center justify-center shrink-0 font-bold text-sm shadow-md">
              !
            </div>
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-[#FAF5F0] text-sm mb-0.5">
                Gemini API Key Required for Session
              </h4>
              <p className="text-[#EADDE2] leading-relaxed">
                Comic Studio requires an active Google Gemini API key to synthesize pages, character reference sheets, and inpainting edits. Paste your key below to launch immediately, or follow the guide to grab a <span className="text-[#DF9E65] font-semibold">100% Free API Key</span> in 30 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#3D1629] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C68B59] animate-pulse"></span>
              <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#C68B59]">
                • ATLAS XXIII SUITE · API & BILLING MANAGER
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#FAF5F0] tracking-tight">
              Gemini API Key & Access Guide
            </h2>
            <p className="text-xs text-[#A88B97] mt-0.5">
              Enter your session API key below or generate a free key from Google AI Studio
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#240D1B] hover:bg-[#341327] border border-[#3D1629] flex items-center justify-center text-[#D9C7CE] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Primary Key Management Card */}
        <div className="p-4 md:p-5 rounded-2xl bg-[#1C0A18] border border-[#C68B59]/40 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🔑</span>
              <span className="text-sm font-bold text-[#FAF5F0]">
                {hasExistingKey ? 'Active Session API Key' : 'Connect Gemini API Key'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                hasExistingKey 
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30 font-semibold' 
                  : 'bg-[#2A0E20] text-[#DF9E65] border-[#DF9E65]/30'
              }`}>
                {hasExistingKey ? '● Active & Ready' : '○ Key Required'}
              </span>
            </div>
            {isAiStudioEnv && onOpenKeyPicker && (
              <button 
                onClick={() => {
                  onClose();
                  onOpenKeyPicker();
                }}
                className="text-[10px] bg-gradient-to-r from-[#B97743] to-[#E29E65] text-[#12060C] font-bold px-2.5 py-1 rounded-lg transition-all hover:brightness-110 shadow-sm"
              >
                Select via AI Studio ↗
              </button>
            )}
          </div>

          <p className="text-xs text-[#A88B97] leading-relaxed">
            {hasExistingKey 
              ? "Your API key is active for this session. You can update or clear your key anytime below:"
              : "Paste your Google Gemini API key below to immediately unlock comic page synthesis, character consistency lab, and 4K exports:"}
          </p>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={isRevealed ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setSavedSuccess(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && apiKeyInput.trim()) {
                    handleSaveApiKey();
                  }
                }}
                placeholder="Paste Gemini API key (AIzaSy...)"
                className="w-full bg-[#13070F] border border-[#3D1629] focus:border-[#C68B59] rounded-xl px-3 py-2.5 text-xs text-[#FAF5F0] placeholder-[#8A6D7B] font-mono transition-all pr-14 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsRevealed(prev => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A6D7B] hover:text-[#FAF5F0] text-[11px] font-medium select-none"
              >
                {isRevealed ? "Hide" : "Show"}
              </button>
            </div>
            <button
              onClick={handleSaveApiKey}
              disabled={!apiKeyInput.trim()}
              className="bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] hover:brightness-110 text-[#12060C] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-40 shrink-0"
            >
              {hasExistingKey ? "Update Key" : "Save & Enter"}
            </button>
            {hasExistingKey && (
              <button
                onClick={handleClearApiKey}
                className="px-3 py-2.5 rounded-xl text-xs text-[#8A6D7B] hover:text-rose-400 hover:bg-[#280B1B] border border-[#3D1629] transition-all shrink-0"
                title="Remove saved key from this browser"
              >
                Clear
              </button>
            )}
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-400 font-medium flex items-center gap-2">
              <span>✓</span>
              <span>API key activated! Session ready.</span>
            </div>
          )}
        </div>

        {/* Free Tier Info */}
        <div className="p-4 rounded-2xl bg-[#230D1B] border border-[#C68B59]/25 text-xs text-[#EADDE2] leading-relaxed">
          <p className="font-semibold text-[#FAF5F0] mb-1">
            Free Tier vs. Flagship Nano Banana Models
          </p>
          <p className="text-[#D0BCC5]">
            You can use Comic Studio completely <span className="text-[#DF9E65] font-semibold">free with zero credit cards</span> using Google's official free-tier quota on the <span className="text-[#DF9E65]">Nano Banana Lite</span> (Flash Lite) engine. When you require maximum comic panel fidelity and prompt precision, switch to our flagship <span className="text-[#DF9E65] font-semibold">Nano Banana 2.1 Pro</span>.
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#C68B59] uppercase tracking-wider">
            HOW TO GET YOUR FREE API KEY
          </h3>

          <div className="p-4 rounded-xl bg-[#1D0A18] border border-[#DF9E65]/40 flex gap-3 items-start shadow-md">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B97743] to-[#DF9E65] text-[#12060C] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#FAF5F0]">Generate a 100% Free Gemini API Key</span>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-emerald-950/80 text-emerald-400 rounded-md border border-emerald-500/30 font-bold">
                    Zero Cost · No Credit Card
                  </span>
                </div>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] text-[#DF9E65] hover:underline flex items-center gap-1 font-semibold"
                >
                  Open AI Studio ↗
                </a>
              </div>

              <div className="bg-[#140610] p-3 rounded-lg border border-[#3D1629] text-[11px] text-[#EADDE2] space-y-1.5 leading-relaxed">
                <div className="font-semibold text-[#DF9E65] flex items-center gap-1.5">
                  <span>✦</span> How to generate your free key in 30 seconds:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[#A88B97] pl-1">
                  <li>Visit <span className="text-[#FAF5F0] font-mono">aistudio.google.com/app/apikey</span> and sign in with any Google account.</li>
                  <li>Click the blue <span className="text-[#DF9E65] font-semibold">"Create API Key"</span> button.</li>
                  <li>Select <span className="text-[#FAF5F0] font-semibold">"Create key in new project"</span> (do not link billing to stay 100% free).</li>
                  <li>Copy the generated key (<span className="font-mono text-[10px] text-[#C68B59]">AIzaSy...</span>) and paste it into the input box above.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2 border-t border-[#3D1629]">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-semibold text-[#FAF5F0] bg-[#180813] border border-[#3D1629] hover:border-[#C68B59] transition-all"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
};
