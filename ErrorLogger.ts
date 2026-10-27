export interface StudioLogEntry {
  id: string;
  timestamp: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  context?: string;
  rawStack?: string;
}

type LogListener = (logs: StudioLogEntry[]) => void;

class StudioLogger {
  private logs: StudioLogEntry[] = [];
  private listeners: Set<LogListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('atlas_comic_studio_logs');
        if (saved) {
          this.logs = JSON.parse(saved);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }

  public log(entry: Omit<StudioLogEntry, 'id' | 'timestamp'>): StudioLogEntry {
    const fullEntry: StudioLogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };

    this.logs.unshift(fullEntry);
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(0, 50);
    }

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('atlas_comic_studio_logs', JSON.stringify(this.logs));
      } catch (e) {
        // quota ignore
      }
    }

    console.error(`[Atlas Studio ${entry.severity.toUpperCase()}][${entry.context || 'General'}]: ${entry.title}`, entry.message);
    this.notify();
    return fullEntry;
  }

  public getLogs(): StudioLogEntry[] {
    return [...this.logs];
  }

  public clear(): void {
    this.logs = [];
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('atlas_comic_studio_logs');
    }
    this.notify();
  }

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener([...this.logs]);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const current = [...this.logs];
    this.listeners.forEach((fn) => fn(current));
  }
}

export const studioLogger = new StudioLogger();

export const logError = (title: string, message: string, context?: string, rawStack?: string) => {
  return studioLogger.log({
    severity: 'error',
    title,
    message,
    context,
    rawStack,
  });
};

export const logWarning = (title: string, message: string, context?: string) => {
  return studioLogger.log({
    severity: 'warning',
    title,
    message,
    context,
  });
};

export const logInfo = (title: string, message: string, context?: string) => {
  return studioLogger.log({
    severity: 'info',
    title,
    message,
    context,
  });
};
