import React, { useState } from 'react';
import { APP_VERSION } from './types';
import { TactileBackground } from './TactileBackground';

export const AtlasBackground: React.FC = () => {
  return <TactileBackground />;
};

interface AtlasFooterProps {
  compact?: boolean;
  onOpenErrorLogger?: () => void;
  errorCount?: number;
  sidebarWidth?: number;
  currentView?: string;
}

export const AtlasFooter: React.FC<AtlasFooterProps> = ({ 
  onOpenErrorLogger,
  errorCount = 0,
  sidebarWidth = 450,
  currentView = 'studio'
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // In landing view, Landing already renders its own full editorial relative footer
  if (currentView === 'landing') {
    return null;
  }

  // Dynamic positioning:
  // In studio mode, the footer MUST stop at the left edge of the sidebar so the sidebar's buttons are NEVER blocked!
  // In other modes (setup, restore, etc.), it spans the full width
  const isStudio = currentView === 'studio';
  const rightOffset = isStudio ? `${sidebarWidth}px` : '0px';

  if (isMinimized) {
    return (
      <aside 
        style={{ left: 0, right: rightOffset }}
        aria-label="Status Bar Minimized"
        className="fixed bottom-2.5 z-40 flex justify-between items-center px-4 pointer-events-none select-none transition-all duration-300"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="pointer-events-auto bg-[#13060E]/95 hover:bg-[#1B0A16] backdrop-blur-md border border-[#3D1629] hover:border-[#C68B59] text-[#DF9D64] text-[10px] font-mono px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
          title="Expand Atlas XXIII Footer Credits"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#DF9D64] animate-pulse"></span>
          <span className="font-bold">Atlas XXIII · {APP_VERSION}</span>
          <span className="text-[9px] text-[#8A6D7B]">▲</span>
        </button>

        {onOpenErrorLogger && (
          <button
            onClick={onOpenErrorLogger}
            className={`pointer-events-auto text-[10px] font-mono px-3 py-1.5 rounded-full border shadow-2xl flex items-center gap-1.5 transition-all hover:scale-105 ${
              errorCount > 0 
                ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse font-bold' 
                : 'bg-[#13060E]/95 text-[#8A6D7B] border-[#3D1629] hover:text-[#FAF5F0]'
            }`}
          >
            <span>🛠️ Logs</span>
            {errorCount > 0 && <span className="text-[9px] font-bold">({errorCount})</span>}
          </button>
        )}
      </aside>
    );
  }

  return (
    <footer 
      style={{ left: 0, right: rightOffset }}
      className="fixed bottom-0 z-40 bg-[#12060E]/95 backdrop-blur-xl border-t border-[#3D1629]/60 px-4 md:px-6 py-2 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#8A6D7B] select-none pointer-events-auto transition-all duration-200"
    >
      {/* Left: Official Brand & Creator Credits */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsMinimized(true)}
          className="w-5 h-5 rounded-full bg-[#180B16] hover:bg-[#2A0E20] border border-[#3D1629] text-[#8A6D7B] hover:text-[#DF9D64] flex items-center justify-center text-[8px] mr-1 transition-colors"
          title="Minimize footer bar"
        >
          ▼
        </button>
        <a
          href="https://atlasxxiii.app"
          className="text-[#FAF5F0] hover:text-[#DF9D64] font-semibold transition-colors truncate"
        >
          Atlas XXIII
        </a>
        <span aria-hidden="true" className="text-[#3D1629]">·</span>
        <span className="hidden sm:inline">Created by</span>
        <a
          href="https://www.instagram.com/dannyvain/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#DF9D64] hover:text-[#FAF5F0] transition-colors font-medium underline underline-offset-4 decoration-[#C68B59]/40 truncate"
        >
          Danny Vain
        </a>
      </div>

      {/* Right: Diagnostics & App Semantic Version */}
      <div className="flex items-center gap-2.5">
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
          <span className="uppercase tracking-widest text-[#8A6D7B] text-[10px] hidden sm:inline">Comic Studio</span>
          <span aria-hidden="true" className="text-[#3D1629] hidden sm:inline">·</span>
          <span className="text-[10px] font-mono text-[#DF9D64] bg-[#2A0E20] px-2.5 py-0.5 rounded-full border border-[#3D1629] font-semibold">
            {APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
};
