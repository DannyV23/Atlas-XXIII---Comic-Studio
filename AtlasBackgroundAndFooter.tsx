import React from 'react';
import { APP_VERSION } from './types';

export const AtlasBackground: React.FC = () => {
  return (
    <>
      {/* Dynamic Dual-Orb Ambient Lighting */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#8B2956]/20 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#C68B59]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Tactile Debossed Background Visual Motif */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
        <div className="absolute top-[-50px] right-[-50px] w-[420px] h-[420px] flex items-center justify-center">
          {/* Concentric debossed rings sinking into a core well */}
          <div className="w-[380px] h-[380px] rounded-full bg-[#180B16] debossed-plum-ring flex items-center justify-center">
            <div className="w-[280px] h-[280px] rounded-full bg-[#150711] debossed-plum-circle flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full bg-[#120810] debossed-plum-circle flex items-center justify-center">
                {/* Glowing warm bronze disc */}
                <div className="w-10 h-10 rounded-full bg-[#D49A5A] shadow-[0_0_25px_#D49A5A]" />
              </div>
            </div>
          </div>
        </div>

        {/* Organic diagonal leaf capsule plates */}
        <div className="absolute bottom-10 left-[-40px] w-64 h-32 bg-[#180B16] debossed-plum-ring rounded-[120px_0px_120px_0px] transform -rotate-12" />
        <div className="absolute top-1/3 left-10 w-48 h-24 bg-[#180B16] debossed-plum-circle rounded-[0px_120px_0px_120px] opacity-40" />
      </div>
    </>
  );
};

export const AtlasFooter: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [isExpanded, setIsExpanded] = React.useState(!compact);

  return (
    <footer className="fixed bottom-4 left-6 z-[250] transition-all duration-300 font-sans pointer-events-auto">
      {isExpanded ? (
        <div className="flex items-center gap-3 bg-[#150711]/90 backdrop-blur-xl border border-[#3D1629] px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-xs animate-in fade-in slide-in-from-bottom-2">
          {/* Creator Attribution */}
          <div className="text-[#8A6D7B] font-medium tracking-wide flex items-center gap-1.5">
            <span className="font-cinzel text-[#DF9E65] font-bold">ATLAS XXIII</span>
            <span className="text-[#3D1629]">•</span>
            <span>Designed by</span>
            <a
              href="https://www.instagram.com/dannyvain/"
              target="_blank"
              rel="noreferrer"
              className="text-[#EADDE2] font-semibold hover:text-[#DF9E65] transition-colors underline decoration-[#3D1629] underline-offset-4"
            >
              Danny Vain
            </a>
          </div>

          {/* Version Badge */}
          <div className="bg-[#2A0E20] border border-[#3D1629] px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#DF9E65] tracking-wider">
            {APP_VERSION}
          </div>

          {/* Minimize Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="text-[#8A6D7B] hover:text-[#FAF5F0] p-0.5 ml-1 transition-colors rounded-full"
            title="Collapse footer"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-[#150711]/80 hover:bg-[#1B0A16] backdrop-blur-md border border-[#3D1629] hover:border-[#C68B59]/60 px-3 py-1.5 rounded-full shadow-lg text-[11px] font-mono text-[#DF9E65] transition-all hover:scale-105"
          title="Expand studio footer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C68B59] animate-pulse" />
          <span className="font-cinzel font-bold">ATLAS XXIII</span>
          <span className="text-[#8A6D7B] text-[10px]">· {APP_VERSION}</span>
        </button>
      )}
    </footer>
  );
};
