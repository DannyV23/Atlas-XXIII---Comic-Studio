import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { studioLogger, StudioLogEntry } from './ErrorLogger';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ErrorLoggerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<StudioLogEntry[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = studioLogger.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    const text = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.severity.toUpperCase()}] [${l.context || 'General'}] ${l.title}\n${l.message}\n${
            l.rawStack ? l.rawStack + '\n' : ''
          }`
      )
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const errorCount = logs.filter((l) => l.severity === 'error').length;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-[#080206]/85 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#150711] border border-[#3D1629] rounded-[28px] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans text-[#FAF5F0]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#3D1629] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2A0E20] border border-[#3D1629] flex items-center justify-center text-lg">
              🛠️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#FAF5F0] uppercase tracking-wider font-mono">
                  Diagnostic & Error Logger
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  errorCount > 0 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 font-bold animate-pulse' 
                    : 'bg-[#2A0E20] text-[#A88B97] border-[#3D1629]'
                }`}>
                  {logs.length} Entries · {errorCount} Errors
                </span>
              </div>
              <p className="text-[11px] text-[#8A6D7B] mt-0.5">
                Runtime telemetry, API status responses, and model diagnostics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1B0A16] hover:bg-[#280F23] border border-[#3D1629] flex items-center justify-center text-[#8A6D7B] hover:text-[#FAF5F0] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-[#13060E] border-b border-[#3D1629] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#8A6D7B] tracking-wider font-mono">
              Live Session Feed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              disabled={logs.length === 0}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#180813] border border-[#3D1629] hover:border-[#C68B59] text-[#FAF5F0] transition-all disabled:opacity-40"
            >
              {copied ? '✓ Copied' : '📋 Copy All'}
            </button>
            <button
              onClick={() => studioLogger.clear()}
              disabled={logs.length === 0}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#2A0E20] border border-[#3D1629] hover:border-rose-400 text-rose-300 transition-all disabled:opacity-40"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Log List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 custom-scrollbar">
          {logs.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <span className="text-3xl">✨</span>
              <h3 className="text-sm font-bold text-[#FAF5F0]">No Errors Recorded</h3>
              <p className="text-xs text-[#8A6D7B] max-w-sm mx-auto">
                Studio operations are running cleanly. Any model errors, timeout issues, or prompt warnings will appear here.
              </p>
            </div>
          ) : (
            logs.map((log) => {
              const isError = log.severity === 'error';
              const isWarning = log.severity === 'warning';
              const isExpanded = expandedId === log.id;

              return (
                <div
                  key={log.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isError
                      ? 'bg-[#1F0A15]/80 border-rose-900/50 hover:border-rose-700/60'
                      : isWarning
                      ? 'bg-[#21110B]/80 border-amber-900/50 hover:border-amber-700/60'
                      : 'bg-[#180B16] border-[#3D1629] hover:border-[#C68B59]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm mt-0.5">
                        {isError ? '🛑' : isWarning ? '⚠️' : 'ℹ️'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isError
                                ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                                : isWarning
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                                : 'bg-[#2A0E20] text-[#DF9E65] border border-[#3D1629]'
                            }`}
                          >
                            {log.severity}
                          </span>
                          {log.context && (
                            <span className="text-[10px] font-mono text-[#C68B59] bg-[#12060E] px-2 py-0.5 rounded border border-[#3D1629]">
                              {log.context}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-[#8A6D7B]">
                            {log.timestamp}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#FAF5F0] mt-1.5 leading-snug">
                          {log.title}
                        </h4>
                      </div>
                    </div>

                    {log.rawStack && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className="text-[10px] text-[#8A6D7B] hover:text-[#FAF5F0] font-mono underline shrink-0"
                      >
                        {isExpanded ? 'Hide Details' : 'Details'}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#EADDE2] mt-2 whitespace-pre-wrap leading-relaxed bg-[#0E060D]/60 p-2.5 rounded-xl border border-[#3D1629]/40 font-mono text-[11px]">
                    {log.message}
                  </p>

                  <AnimatePresence>
                    {isExpanded && log.rawStack && (
                      <motion.pre
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 p-3 rounded-xl bg-[#080206] text-[10px] font-mono text-rose-300/80 overflow-x-auto border border-rose-900/30 whitespace-pre-wrap"
                      >
                        {log.rawStack}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#13060E] border-t border-[#3D1629] flex justify-between items-center text-xs">
          <span className="text-[10px] text-[#8A6D7B] font-mono">
            Logs are stored locally in this browser session.
          </span>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold text-xs px-6 py-2 rounded-full uppercase tracking-wider transition-all hover:brightness-110 active:scale-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
