/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const APP_VERSION = "v2.0.2";

export const MAX_STORY_PAGES = 20; 
export const INITIAL_TOTAL_PAGES = 2; 
export const INITIAL_PAGES = 2;
export const GATE_PAGE = 999; 
export const BATCH_SIZE = 1; 

export const GENRES = [
  "Classic Horror", 
  "Superhero Action", 
  "Dark Sci-Fi", 
  "High Fantasy", 
  "Neon Noir Detective", 
  "Wasteland Apocalypse", 
  "Lighthearted Comedy", 
  "Teen Drama / Slice of Life", 
  "Custom"
];

export const CLOTHING_PRESETS: Record<string, string[]> = {
    "Classic Horror": ["Victorian Suit/Dress", "Tattered Survivor Gear", "1920s Detective Coat", "Nightgown/Pajamas", "Priest/Nun Habit"],
    "Superhero Action": ["Spandex & Cape", "High-Tech Power Armor", "Tactical Stealth Suit", "Leather Biker Gear", "Civilian Disguise"],
    "Dark Sci-Fi": ["Cybernetic Space Suit", "Chrome Plated Armor", "Gritty Dystopian Rags", "Lab Coat & Goggles", "Neon Streetwear"],
    "High Fantasy": ["Plate Armor & Cape", "Wizard Robes", "Leather Ranger Tunic", "Royal Finery", "Peasant Rags"],
    "Neon Noir Detective": ["Trenchcoat & Fedora", "Cyber-Enhanced Suit", "Femme Fatale Dress", "Police Uniform", "Club Wear"],
    "Wasteland Apocalypse": ["Scavenger Armor", "Hazmat Suit", "Road Warrior Leather", "Camouflage Fatigues", "Rags & Bandages"],
    "Lighthearted Comedy": ["Casual T-Shirt & Jeans", "School Uniform", "Office Business Casual", "Wacky Costume", "Summer Vacation Wear"],
    "Teen Drama / Slice of Life": ["Trendy School Outfit", "Varsity Jacket", "Prom Dress/Tux", "Summer Beach Wear", "Part-time Job Uniform"],
    "Custom": ["Custom Style"]
};

export const PLOT_OPTIONS: Record<string, string[]> = {
    "Classic Horror": ["The Ancestral Curse", "The Cabin in the Woods", "The Psychological Experiment", "The Monster from the Deep"],
    "Superhero Action": ["The City Under Siege", "The Nemesis Returns", "The Lost Power Source", "The Secret Identity Crisis"],
    "Dark Sci-Fi": ["The AI Uprising", "The Space Station Mystery", "The Time Loop", "The Genetic Experiment"],
    "High Fantasy": ["The Dragon's Gold", "The Corrupt Kingdom", "The Ancient Artifact", "The Dark Sorcerer"],
    "Neon Noir Detective": ["The Missing Android", "The Corporate Conspiracy", "The Midnight Murder", "The Blackmail Ring"],
    "Wasteland Apocalypse": ["The Water Wars", "The Mutant Stronghold", "The Last Sanctuary", "The Supply Run"],
    "Lighthearted Comedy": ["The Misunderstanding", "The Big Date", "The School Play", "The Prank War"],
    "Teen Drama / Slice of Life": ["The Rumor Mill", "The Big Game", "The Summer Festival", "The Band Breakup"],
    "Custom": ["Custom Plot"]
};

export const LAYOUT_STYLES = [
    "Uniform Grid",
    "Vertical Stack (Top to Bottom)",
    "Horizontal Stack (Left to Right)",
    "Asymmetric / Dynamic",
    "Cinematic Widescreen",
    "Diagonal Split",
    "Inset Panels",
    "Broken Glass / Shattered",
    "Manga Style (Right to Left flow)"
];

export const COVER_LAYOUT_STYLES = [
    "Action Poster (Main Character Focus)",
    "Ensemble Cast (Group Shot)",
    "Minimalist / Negative Space",
    "Cinematic Wide Shot",
    "Close-Up Portrait",
    "Abstract / Symbolic",
    "Split Screen Duel"
];

export const TITLE_STYLES = [
    "Classic Comic (Bold, Drop Shadow)",
    "Modern Minimalist (Clean Sans)",
    "Gothic / Horror (Spiky, Bleeding)",
    "Sci-Fi (Neon, Digital)",
    "Handwritten / Indie",
    "Blockbuster (Metallic, 3D)"
];

export const CAST_ROLES = ["Hero", "Co-Star", "Villain", "Supporting Character", "Background Character", "Pet/Creature", "Henchman", "Mentor", "Rival"];

export const TONES = [
    "ACTION-HEAVY (Short, punchy dialogue. Focus on kinetics.)",
    "INNER-MONOLOGUE (Heavy captions revealing thoughts.)",
    "QUIPPY (Characters use humor as a defense mechanism.)",
    "OPERATIC (Grand, dramatic declarations and high stakes.)",
    "CASUAL (Natural dialogue, focus on relationships/gossip.)",
    "WHOLESOME (Warm, gentle, optimistic.)"
];

export const LANGUAGES = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish (Castellano)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'ar-EG', name: 'Arabic (Egypt)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'id-ID', name: 'Indonesian (Indonesia)' },
    { code: 'it-IT', name: 'Italian (Italy)' },
    { code: 'ja-JP', name: 'Japanese (Japan)' },
    { code: 'ko-KR', name: 'Korean (South Korea)' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ru-RU', name: 'Russian (Russia)' },
    { code: 'ua-UA', name: 'Ukrainian (Ukraine)' },
    { code: 'vi-VN', name: 'Vietnamese (Vietnam)' },
    { code: 'zh-CN', name: 'Chinese (China)' }
];

export type ViewMode = 'landing' | 'setup' | 'character-gen' | 'restore' | 'studio';
export type Resolution = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];
export type BorderColor = 'black' | 'white';

export type ImageModel = 
  | 'gemini-nano-banana-2.1' 
  | 'gemini-3.1-flash-lite-image' 
  | 'gemini-3.1-flash-image' 
  | 'gemini-2.5-flash-image' 
  | 'gemini-3-pro-image';

export interface ImageModelOption {
  id: ImageModel;
  label: string;
  badge: string;
  description: string;
}

export const IMAGE_MODEL_OPTIONS: ImageModelOption[] = [
  { id: 'gemini-nano-banana-2.1', label: 'Nano Banana 2.1 Pro', badge: '👑 Flagship', description: 'Maximum character likeness, cinematic panel consistency, and prompt fidelity.' },
  { id: 'gemini-3.1-flash-lite-image', label: 'Nano Banana Lite', badge: '⚡ Free Tier', description: 'Fast generation with zero wait time, optimized for drafting and layout testing.' },
  { id: 'gemini-3.1-flash-image', label: 'Nano Banana 2.0 Pro', badge: '4K Ultra', description: 'High-definition generation with ultra-sharp line art and vivid coloring.' },
  { id: 'gemini-2.5-flash-image', label: 'Nano Banana 1', badge: 'Classic', description: 'Classic balanced image synthesis engine.' },
  { id: 'gemini-3-pro-image', label: 'Nano Banana Pro', badge: 'Creative', description: 'Advanced artistic interpretation and surreal comic covers.' }
];

export type AppLanguage = 'en' | 'esp';

export interface CharacterOverride {
    clothingMode: 'default' | 'custom';
    clothingCustom?: string;
    weaponMode: 'default' | 'none' | 'custom' | 'specific';
    weaponCustom?: string;
    selectedPropId?: string; // ID of the prop from propsList
}

export interface PanelData {
    text: string;
    previousText?: string; // For Undo/Revert functionality
    castIds: string[];
    overrides?: Record<string, CharacterOverride>; // Key is Persona ID
    locationId?: string; // Optional override
}

export interface ComicFace {
  id: string;
  type: 'cover' | 'story' | 'back_cover';
  imageUrl?: string;
  imageHistory?: string[]; // Array of past generated images for Undo/Redo
  historyIndex?: number;   // Current index in history array
  narrative?: Beat;
  panelsData?: PanelData[]; // Persisted editor state for this page
  choices: string[];
  resolvedChoice?: string;
  isLoading: boolean;
  pageIndex?: number;
  isDecisionPage?: boolean;
  isTextless?: boolean; // Cover Only: Hides title/logos
  
  // Layout Props
  panelCount?: number;
  layoutStyle?: string;
  layout?: string; // Legacy prop
  aspectRatio?: AspectRatio;
}

export interface Beat {
  caption?: string;
  dialogue?: string;
  scene: string;
  choices: string[];
  focus_char: 'hero' | 'friend' | 'antagonist' | 'other';
}

export interface Persona {
  id: string;
  base64: string;
  characterSheet?: string; // SPECIFIC GENERATED REFERENCE SHEET
  additionalImages?: string[]; // Array of base64 strings
  desc: string;
  name: string;
  role: string;
  clothing: string;
  weapon?: string;
  abilities?: string;
  personality?: string;
}

export interface Prop {
    id: string;
    name: string;
    type: 'prop' | 'weapon';
    base64?: string;
    description: string;
    ownerId?: string; // Optional: ID of the Persona who owns this
}

export interface LocationRef {
    id: string;
    name: string;
    type: 'image' | 'text';
    base64?: string; // Optional if text
    description?: string; // Optional if image
    analysisMode?: 'architecture' | 'layout' | 'aesthetic';
}

export interface PublisherConfig {
    name: string;
    logoDescription: string;
    logoImage?: string; // Base64 uploaded logo
    mode: 'text' | 'image';
    // New Identity Fields
    titleLogo?: string; // Base64 uploaded Title Art
    titleStyle?: string; 
    titlePlacement?: 'top' | 'bottom';
    subtitleStyle?: string;
}

// UI TRANSLATIONS
export const UI_LABELS = {
    en: {
        newUniverse: "NEW UNIVERSE",
        continueSaga: "CONTINUE SAGA",
        startAdventure: "START ADVENTURE!",
        launching: "LAUNCHING...",
        returnStudio: "RETURN TO STUDIO",
        projectSettings: "PROJECT SETTINGS",
        comicBookStudio: "ATLAS XXIII - COMIC STUDIO",
        startFresh: "Start fresh!",
        resumeWork: "Resume work!",
        createScratch: "Create a brand new story from scratch.",
        uploadRestore: "Upload pages & restore your session.",
        studioEditor: "STUDIO EDITOR",
        imageRefiner: "IMAGE REFINER",
        promptLab: "PROMPT LAB",
        promptDebugger: "PROMPT DEBUGGER",
        pageConfig: "PAGE CONFIG",
        refineStation: "REFINE STUDIO",
        settings: "SETTINGS",
        jumpTo: "JUMP TO:",
        cover: "COVER",
        page: "PAGE",
        newPage: "NEW PAGE",
        status: "STATUS",
        drafting: "DRAFTING",
        inking: "INKING...",
        complete: "COMPLETE",
        edit: "EDIT",
        editSub: "Edit current image",
        upscale: "UPSCALE",
        applyEdit: "APPLY EDIT",
        generatePage: "GENERATE PAGE",
        regenerate: "REGENERATE",
        dlPage: "⬇ IMG", 
        dlMulti: "⬇ MULTI",
        replaceImg: "REPLACE IMG",
        layoutConfig: "Layout Configuration",
        panelCount: "Panel Count",
        visualStyle: "Visual Style",
        locationOverride: "Location Override",
        castInScene: "Cast in Scene",
        poseRef: "Pose & Layout Reference",
        uploadRef: "Upload Ref",
        clear: "Clear",
        model: "Model:",
        borders: "Borders:",
        overlays: "Show Overlays:",
        saveConfig: "Save Config",
        saveProject: "Save Project (.cbs)",
        loadConfig: "Load Config",
        switchKey: "Switch API Key",
        apiQuota: "API Quota Info",
        nuclearReset: "RESET STUDIO",
        enterLab: "ENTER CHARACTER LAB",
        singleSpread: "SINGLE PAGE",
        doubleSpread: "2-PAGE SPREAD",
        recenter: "RECENTER", 
        version: "VERSION",
        targetArea: "Target Area",
        instruction: "Instruction",
        applyUpscale: "APPLY & UPSCALE",
        // Tabs
        tabStory: "STORY",
        tabCast: "CAST",
        tabWorld: "WORLD",
        tabIdentity: "IDENTITY",
        tabSystem: "SYSTEM",
        about: "ABOUT APP",
        // Restore Screen
        restoreSession: "RESTORE SESSION",
        cancelMission: "CANCEL MISSION",
        step1Title: "STEP 1: LOAD BLUEPRINTS",
        uploadJson: "Upload project file (.cbs or .json)",
        clickToSelect: "CLICK TO SELECT FILE",
        editSpecs: "Edit Mission Specs",
        step2Title: "STEP 2: CONFIRM CAST",
        step2Desc: "Review character data. Main profile images are required.",
        step3Title: "STEP 3: COMIC ARCHIVES",
        step3DescFound: "Pages found in save file! They contain images and full studio settings.",
        step3DescUpload: "Upload your generated page images to slot them back into the timeline.",
        coverPage: "COVER PAGE",
        loadedFromFile: "LOADED FROM FILE",
        uploadReady: "UPLOAD READY",
        clickReplace: "Click to replace",
        restoredData: "RESTORED (IMG + DATA)",
        addPageSlot: "ADD PAGE SLOT",
        resumeProduction: "RESUME PRODUCTION",
        waitingData: "WAITING FOR DATA...",
        // Multi Download Modal
        multiDownloadTitle: "MULTI-FORMAT DOWNLOAD",
        formatOptions: "Format Options",
        overlayOptions: "Overlay Options",
        burnOverlays: "Include Badges/Overlays",
        burnOverlaysDesc: "If checked, attempts to include logos/text in output (PDF only).",
        downloadZip: "DOWNLOAD .ZIP",
        downloadPdf: "DOWNLOAD .PDF",
        // Warnings
        charLimitWarn: "⚠️ >5 Characters selected. AI may struggle with likeness.",
        // Prompt Lab
        executePrompt: "EXECUTE PROMPT",
        payloadViewer: "Payload Viewer",
        textPrompt: "Text Prompt",
        addImage: "Add Image",
        removeImage: "Remove",
        errorLogger: "ERROR LOGGER",
        diagnostics: "DIAGNOSTICS"
    },
    esp: {
        newUniverse: "NUEVO UNIVERSO",
        continueSaga: "SEGUIR LA SAGA",
        startAdventure: "¡ARRANCAR!",
        launching: "ARRANCANDO...",
        returnStudio: "VOLVER AL ESTUDIO",
        projectSettings: "AJUSTES DEL PROYECTO",
        comicBookStudio: "ATLAS XXIII - COMIC STUDIO",
        startFresh: "¡Empezar de cero!",
        resumeWork: "¡Seguir currando!",
        createScratch: "Crea una historia nueva desde cero.",
        uploadRestore: "Sube páginas y restaura tu sesión.",
        studioEditor: "EDITOR DE ESTUDIO",
        imageRefiner: "REFINADOR DE IMAGEN",
        promptLab: "LABORATORIO",
        promptDebugger: "DEPURADOR DE PROMPT",
        pageConfig: "CONFIG DE PÁGINA",
        refineStation: "ESTUDIO DE RETOQUE",
        settings: "AJUSTES",
        jumpTo: "IR A:",
        cover: "PORTADA",
        page: "PÁGINA",
        newPage: "NUEVA PÁGINA",
        status: "ESTADO",
        drafting: "BOCETO",
        inking: "ENTINTANDO...",
        complete: "COMPLETO",
        edit: "EDITAR",
        editSub: "Editar imagen actual",
        upscale: "MEJORAR",
        applyEdit: "APLICAR CAMBIO",
        generatePage: "GENERAR PÁGINA",
        regenerate: "REGENERAR",
        dlPage: "⬇ IMG",
        dlMulti: "⬇ MULTI",
        replaceImg: "CAMBIAR IMG",
        layoutConfig: "Configuración de Diseño",
        panelCount: "Nº Paneles",
        visualStyle: "Estilo Visual",
        locationOverride: "Anular Ubicación",
        castInScene: "Elenco en Escena",
        poseRef: "Ref. de Postura y Diseño",
        uploadRef: "Subir Ref",
        clear: "Borrar",
        model: "Modelo:",
        borders: "Bordes:",
        overlays: "Ver Superposiciones:",
        saveConfig: "Guardar Config",
        saveProject: "Guardar Proyecto (.cbs)",
        loadConfig: "Cargar Config",
        switchKey: "Cambiar Clave API",
        apiQuota: "Info Cuota API",
        nuclearReset: "REINICIO TOTAL",
        enterLab: "ENTRAR AL LAB",
        singleSpread: "PÁGINA ÚNICA",
        doubleSpread: "DOBLE PÁGINA",
        recenter: "RECENTRAR",
        version: "VERSIÓN",
        targetArea: "Área Objetivo",
        instruction: "Instrucción",
        applyUpscale: "APLICAR Y MEJORAR",
        tabStory: "HISTORIA",
        tabCast: "ELENCO",
        tabWorld: "MUNDO",
        tabIdentity: "IDENTIDAD",
        tabSystem: "SISTEMA",
        about: "SOBRE LA APP",
        restoreSession: "RESTAURAR SESIÓN",
        cancelMission: "MANDAR A MUDAR",
        step1Title: "PASO 1: PLANOS",
        uploadJson: "Sube el archivo de proyecto (.cbs o .json)",
        clickToSelect: "SELECCIONAR ARCHIVO",
        editSpecs: "Editar Especificaciones",
        step2Title: "PASO 2: ELENCO",
        step2Desc: "Revisa los datos. Las fotos de perfil son obligatorias.",
        step3Title: "PASO 3: ARCHIVOS",
        step3DescFound: "¡Páginas encontradas en el archivo! Contienen imágenes y ajustes.",
        step3DescUpload: "Sube las imágenes generadas para colocarlas en la línea de tiempo.",
        coverPage: "PORTADA",
        loadedFromFile: "CARGADO DEL ARCHIVO",
        uploadReady: "LISTO PARA SUBIR",
        clickReplace: "Clic para reemplazar",
        restoredData: "RESTAURADO (IMG + DATOS)",
        addPageSlot: "AÑADIR HUECO PÁGINA",
        resumeProduction: "REANUDAR LA FAENA",
        waitingData: "ESPERANDO DATOS...",
        multiDownloadTitle: "DESCARGA MULTI-FORMATO",
        formatOptions: "Opciones de Formato",
        overlayOptions: "Opciones de Superposición",
        burnOverlays: "Incluir Insignias",
        burnOverlaysDesc: "Si se marca, intenta incluir logos/texto en la salida (solo PDF).",
        downloadZip: "DESCARGAR .ZIP",
        downloadPdf: "DESCARGAR .PDF",
        charLimitWarn: "⚠️ >5 Personajes. La IA podría sufrir con el parecido.",
        executePrompt: "EJECUTAR PROMPT",
        payloadViewer: "Visor de Carga",
        textPrompt: "Prompt de Texto",
        addImage: "Añadir Imagen",
        removeImage: "Quitar",
        errorLogger: "REGISTRO DE ERRORES",
        diagnostics: "DIAGNÓSTICOS"
    }
};
