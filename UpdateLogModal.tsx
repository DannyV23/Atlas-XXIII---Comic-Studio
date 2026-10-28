import React from 'react';
import { UPDATE_LOGS } from './updateLogs';
import { AtlasLogo } from './AtlasLogo';

interface UpdateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateLogModal: React.FC<UpdateLogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-[#0E070C]/95 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-12 pb-20 sm:pb-28 space-y-8">
        
        {/* Navigation / Close */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="bg-[#180813] hover:bg-[#2A0E20] border border-[#3D1629] hover:border-[#C68B59] px-4 py-2 rounded-full text-xs font-mono inline-flex items-center gap-2 text-[#C68B59] hover:text-[#DF9D64] transition-all cursor-pointer"
          >
            <span>←</span>
            <span>Back to Studio</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#180813] hover:bg-[#2A0E20] border border-[#3D1629] text-[#8A6D7B] hover:text-[#FAF5F0] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-start gap-4 border-b border-[#3D1629]/40 pb-6 sm:pb-8">
          <div className="flex items-center gap-3">
            <AtlasLogo size="sm" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#DF9D64] bg-[#2A0E20] px-3 py-1 rounded-full border border-[#3D1629]">
              Comic Studio Ledger
            </span>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#FAF5F0]">
              Update Log & Version History
            </h1>
            <p className="text-xs sm:text-sm text-[#EADDE2]/80 leading-relaxed font-sans">
              A chronological record of new studio capabilities, story drafting engines, model updates, and refinements across Comic Studio.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6 sm:space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-5 before:w-0.5 before:bg-[#3D1629]/40">
          {UPDATE_LOGS.map((entry) => (
            <article key={entry.version} className="relative pl-8 sm:pl-12 group">
              {/* Timeline Pip */}
              <div
                className={`absolute left-1.5 sm:left-3.5 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  entry.isLatest
                    ? 'bg-[#DF9D64] border-[#FAF5F0] shadow-[0_0_14px_#DF9D64]'
                    : 'bg-[#180813] border-[#3D1629] group-hover:border-[#C68B59]'
                }`}
              >
                {entry.isLatest && <div className="w-1.5 h-1.5 rounded-full bg-[#12060C]" />}
              </div>

              {/* Entry Card */}
              <div
                className={`p-5 sm:p-7 rounded-2xl bg-[#150711] border border-[#3D1629] space-y-4 transition-all ${
                  entry.isLatest
                    ? 'shadow-[0_12px_36px_rgba(198,139,89,0.12)] border-[#C68B59]/40'
                    : 'hover:border-[#C68B59]/30'
                }`}
              >
                {/* Entry Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${
                        entry.isLatest
                          ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C]'
                          : 'bg-[#2A0E20] text-[#DF9D64] border border-[#3D1629]'
                      }`}
                    >
                      {entry.version}
                    </span>

                    {entry.isLatest && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#DF9D64] bg-[#2A0E20] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-[#3D1629]">
                        <span>✨</span>
                        <span>Current Live</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A6D7B] bg-[#140712] px-2.5 py-0.5 rounded-full border border-[#3D1629]/50">
                      {entry.type === 'major' ? 'Major Release' : 'Patch Update'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#8A6D7B]">
                    <span className="text-[#C68B59]">⏱</span>
                    <span>{entry.date}</span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="space-y-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-[#FAF5F0] tracking-tight">
                    {entry.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#EADDE2]/80 leading-relaxed font-sans">
                    {entry.summary}
                  </p>
                </div>

                {/* Changes List */}
                <div className="pt-2 border-t border-[#3D1629]/30">
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#C68B59] mb-3">
                    Modifications & Additions
                  </h3>
                  <ul className="space-y-2">
                    {entry.changes.map((change, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#EADDE2]/90 leading-relaxed">
                        <span className="text-[#DF9D64] font-bold">✓</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
