import React from 'react';
import { APP_VERSION } from './types';
import { TactileBackground } from './TactileBackground';

export const AtlasBackground: React.FC = () => {
  return <TactileBackground />;
};

export const AtlasFooter: React.FC<{ compact?: boolean; onOpenErrorLogger?: () => void; errorCount?: number }> = ({ 
  onOpenErrorLogger,
  errorCount = 0 
}) => {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-[250] bg-[#12060E]/95 backdrop-blur-xl border-t border-[#3D1629]/60 px-6 py-2.5 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#8A6D7B] select-none pointer-events-auto">
      {/* Left: Official Brand & Creator Credits */}
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

      {/* Right: Diagnostics & App Semantic Version */}
      <div className="flex items-center gap-3">
        {onOpenErrorLogger && (
          <button
            onClick={onOpenErrorLogger}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] transition-all ${
              errorCount > 0 
                ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse font-bold' 
                : 'bg-[#180B16] text-[#8A6D7B] border-[#3D1629] hover:text-[#FAF5F0]'
            }`}
          >
            <span>🛠️</span>
            <span>Logs</span>
            {errorCount > 0 && <span className="text-[9px]">({errorCount})</span>}
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest text-[#8A6D7B] text-[10px]">Comic Studio</span>
          <span aria-hidden="true" className="text-[#3D1629]">·</span>
          <span className="text-[10px] font-mono text-[#DF9D64] bg-[#2A0E20] px-2.5 py-0.5 rounded-full border border-[#3D1629] font-semibold">
            {APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
};
