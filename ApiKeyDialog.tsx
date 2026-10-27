
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-[#0E070C]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-[#150711] border border-[#3D1629] rounded-2xl shadow-[0_0_50px_rgba(198,139,89,0.2)] p-6 overflow-hidden text-[#FAF5F0]">
        <div className="p-2 relative">
            <h2 className="font-sans font-bold text-3xl text-[#FAF5F0] mb-2 uppercase tracking-wide">
              Access Required
            </h2>
            
            <p className="font-sans font-bold text-[#8A6D7B] mb-6 uppercase tracking-widest text-xs border-b border-[#3D1629] pb-4">
                Atlas XXIII • Studio Authorization
            </p>

            <p className="font-sans text-[#EADDE2] mb-6 leading-relaxed text-sm">
              To operate <strong>Comic Studio</strong>, server-side API keys are managed seamlessly. 
              <br/><br/>
              <span className="text-[#DF9E65] font-bold">NOTE:</span> High-fidelity image and video generation utilize Gemini 3.8 Flash, Nano Banana 2.1, and Veo models.
            </p>

            <div className="bg-[#1B0A16] border border-[#3D1629] p-4 mb-8 rounded-xl flex items-center gap-3">
                 <span className="text-2xl">✨</span>
                 <div>
                     <a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noreferrer" className="text-[#C68B59] hover:text-[#FAF5F0] underline font-bold text-xs font-sans uppercase">Gemini Developer Documentation &rarr;</a>
                     <p className="text-[10px] text-[#8A6D7B] font-sans">Powered by Google GenAI Server API.</p>
                 </div>
            </div>

            <button 
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-sans font-bold text-sm py-4 rounded-full hover:brightness-110 uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(198,139,89,0.3)] active:scale-95"
            >
              Continue to Studio
            </button>
        </div>
      </div>
    </div>
  );
};
