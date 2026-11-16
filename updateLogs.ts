export interface UpdateLogEntry {
  version: string;
  date: string;
  isLatest?: boolean;
  type: 'major' | 'minor' | 'patch';
  title: string;
  summary: string;
  changes: string[];
}

export const UPDATE_LOGS: UpdateLogEntry[] = [
  {
    version: 'v2.0.3',
    date: '2026-11-16',
    isLatest: true,
    type: 'patch',
    title: 'Expanded 8-Character Reference Limit',
    summary: 'Increased the per-page character reference upload & injection limit from 5 to 8 characters to leverage newer Nano Banana / Gemini models.',
    changes: [
      'Raised character reference injection cap from 5 to 8 characters per page in the synthesis pipeline.',
      'Updated scene cast selection warnings (EN & ES) from >5 to >8 characters.'
    ]
  },
  {
    version: 'v2.0.2',
    date: '2026-11-16',
    type: 'patch',
    title: 'API Key Input, Direct SDK Validation & Unified API Info',
    summary: 'Fixed API key input accessibility, eliminated HTML-as-JSON fallback errors on hosted domains, and unified API quota info directly inside API key dialogs.',
    changes: [
      'Fixed hosted direct-client guard in geminiService.ts so missing keys throw a clear prompt instead of hitting /api/ and parsing HTML as JSON.',
      'Fixed onChangeApiKey wiring in App.tsx and Setup.tsx so Switch API Key opens the key dialog properly.',
      'Added select-text to all API key inputs and embedded API quota/model info directly inside ApiKeyDialog, QuotaInfo, and the Landing key drawer.'
    ]
  },
  {
    version: 'v2.0.1',
    date: '2026-10-28',
    type: 'patch',
    title: 'Interactive Version History & Release Ledger',
    summary: 'Direct access to the comprehensive Comic Studio update ledger and version timeline via the version pill in the application footer and About modal.',
    changes: [
      'Interactive version pill in the application footer and About modal navigating directly to the release ledger.',
      'Comprehensive chronological history of current and previous Comic Studio releases.',
      'Added clean back navigation returning immediately to the studio workspace.',
      'Unified Atlas XXIII Studio Plum & Deep Burgundy design tokens across all version modal views.'
    ]
  },
  {
    version: 'v2.0.0',
    date: '2026-10-28',
    type: 'major',
    title: 'Major Studio Overhaul & Gemini 3.8 Flash Integration',
    summary: 'Sequel release to Comic Book Studio, fully modernized to Atlas XXIII studio aesthetics, Gemini 3.8 Flash, and responsive editor sidebar.',
    changes: [
      'Official launch of Comic Studio as the standalone sequel to Comic Book Studio.',
      'Complete overhaul of editor sidebar and controls adhering to Atlas XXIII Studio Plum aesthetics.',
      'Upgraded intelligence pipeline to Gemini 3.8 Flash and Flagship Imagen 3 / Nano Banana 2.1 engines.',
      'Dynamic collapsible bottom bar responsive to sidebar resizing.',
      'High-resolution multi-aspect layout synthesis and speech bubble generation.'
    ]
  },
  {
    version: 'v1.0.1',
    date: '2026-10-27',
    type: 'patch',
    title: 'Official Insignia & Brand Assets Integration',
    summary: 'Integrated high-fidelity Atlas XXIII Comic Studio vector insignia and brand styling tokens.',
    changes: [
      'Added official Comic Studio emblem with warm bronze gradient and ivory pips.',
      'Harmonized dark obsidian plum canvas and debossed relief styling.',
      'Updated dialogs and prompt lab controls with signature bronze accents.'
    ]
  },
  {
    version: 'v1.0.0',
    date: '2026-10-27',
    type: 'major',
    title: 'Initial Atlas XXIII Comic Studio Release',
    summary: 'First official release under the Atlas XXIII umbrella with cloud deployment on Firebase Hosting.',
    changes: [
      'Initialized Comic Studio core engine with multi-page narrative drafting.',
      'Character lab and consistency reference injection.',
      '4K single and double spread visualizer.',
      'Configured hosting deployment for comic.atlasxxiii.app.'
    ]
  }
];
