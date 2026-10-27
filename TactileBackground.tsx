import React from 'react';

/**
 * Atlas XXIII — Tactile Background Visual Motif Component
 * Deep dark obsidian plum/burgundy with debossed geometric relief and glowing bronze core.
 */
export const TactileBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35 select-none">
      {/* Dynamic Dual-Orb Ambient Lighting */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#8B2956]/20 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#C68B59]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Right Grid Cluster */}
      <div className="absolute -top-10 -right-10 w-[520px] md:w-[680px] h-[520px] md:h-[680px] flex flex-col justify-between">
        {/* Top Row: Leaf Shape + Top Right Circle */}
        <div className="flex items-center justify-end gap-6 pr-8">
          <div className="w-64 md:w-80 h-32 md:h-40 bg-[#180B16] rounded-[120px_0px_120px_0px] debossed-plum-ring flex items-center justify-center">
            <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-[#120810] debossed-plum-circle" />
          </div>

          <div className="w-36 md:w-44 h-36 md:h-44 rounded-full bg-[#180B16] debossed-plum-circle flex items-center justify-center">
            <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-[#120810] debossed-plum-ring" />
          </div>
        </div>

        {/* Center Row: Leaf + Concentric Circle with Bronze Dot */}
        <div className="flex items-center justify-end gap-6">
          <div className="w-64 md:w-80 h-32 md:h-40 bg-[#180B16] rounded-[0px_120px_0px_120px] debossed-plum-ring flex items-center justify-center">
            <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-[#120810] debossed-plum-circle" />
          </div>

          <div className="w-80 md:w-[380px] h-80 md:h-[380px] rounded-full bg-[#180B16] debossed-plum-circle flex items-center justify-center">
            <div className="w-56 md:w-72 h-56 md:h-72 rounded-full bg-[#180B16] debossed-plum-ring flex items-center justify-center">
              <div className="w-36 md:w-48 h-36 md:h-48 rounded-full bg-[#120810] debossed-plum-circle flex items-center justify-center">
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#D49A5A] shadow-[0_0_25px_#D49A5A] border border-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Quarter Arch + Semi-Circle Arch */}
        <div className="flex items-center justify-end gap-6 pr-12">
          <div className="w-32 md:w-40 h-32 md:h-40 bg-[#180B16] rounded-tl-[160px] debossed-plum-ring" />
          <div className="w-64 md:w-72 h-32 md:h-36 bg-[#180B16] rounded-b-[140px] debossed-plum-ring flex items-center justify-center">
            <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-[#120810] debossed-plum-circle" />
          </div>
        </div>
      </div>

      {/* Secondary Bottom Left Cluster for Balance */}
      <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] hidden lg:block opacity-75">
        <div className="w-72 h-36 bg-[#180B16] rounded-[120px_0px_120px_0px] debossed-plum-ring flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-[#120810] debossed-plum-circle" />
        </div>
        <div className="w-80 h-80 rounded-full bg-[#180B16] debossed-plum-circle flex items-center justify-center">
          <div className="w-56 h-56 rounded-full bg-[#180B16] debossed-plum-ring flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#D49A5A]/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
