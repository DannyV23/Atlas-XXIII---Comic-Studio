import React, { ErrorInfo, ReactNode } from 'react';
import { logError } from './ErrorLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(
      `Unhandled React Exception: ${error.name}`,
      error.message,
      'ErrorBoundary',
      error.stack || errorInfo.componentStack || undefined
    );
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0E070C] text-[#FAF5F0] p-6 sm:p-12 flex flex-col justify-center items-center font-sans select-none">
          <div className="max-w-2xl w-full bg-[#150711] border border-[#DF9E65]/50 rounded-[28px] p-8 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A0E20] border border-[#DF9E65] text-xs font-mono text-[#DF9E65] mb-4">
              <span>⚠️</span>
              <span>ATLAS XXIII · COMIC STUDIO DIAGNOSTIC</span>
            </div>

            <h1 className="text-2xl font-bold text-[#FAF5F0] mb-2 font-mono">
              Studio Runtime Exception
            </h1>

            <p className="text-xs text-[#EADDE2] mb-4 leading-relaxed">
              Comic Studio encountered an unexpected runtime rendering error. The diagnostic traceback has been captured below:
            </p>

            <div className="bg-[#0A0307] border border-[#3D1629] rounded-2xl p-4 mb-6 overflow-x-auto text-xs text-rose-300 font-mono">
              <p className="font-bold mb-2">
                {this.state.error?.name}: {this.state.error?.message}
              </p>
              <pre className="text-[10px] text-[#A88B97] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {this.state.error?.stack}
              </pre>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all font-mono"
              >
                Reload Window
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('cbs_active_session');
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase bg-[#180813] border border-[#3D1629] text-[#FAF5F0] hover:border-[#C68B59] cursor-pointer transition-all font-mono"
              >
                Clear Temp Session & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
