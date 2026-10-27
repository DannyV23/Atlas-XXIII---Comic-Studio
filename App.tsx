
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { MAX_STORY_PAGES, INITIAL_TOTAL_PAGES, GENRES, TONES, LANGUAGES, PLOT_OPTIONS, ComicFace, Beat, Persona, PublisherConfig, CLOTHING_PRESETS, CAST_ROLES, ViewMode, LocationRef, Resolution, AspectRatio, PanelData, LAYOUT_STYLES, COVER_LAYOUT_STYLES, BorderColor, Prop, ImageModel, AppLanguage, UI_LABELS, APP_VERSION, TITLE_STYLES } from './types';
import { Setup } from './Setup';
import { Book } from './Book';
import { useApiKey } from './useApiKey';
import { ApiKeyDialog } from './ApiKeyDialog';
import { Landing } from './Landing';
import { Restore } from './Restore';
import { CharacterGen } from './CharacterGen';
import { AtlasBackground, AtlasFooter } from './AtlasBackgroundAndFooter';

// --- Constants ---
const MODEL_TEXT_NAME = "gemini-3.8-flash"; 
const MODEL_VIDEO_GEN_NAME = "veo-3.1-fast-generate-preview";
const PAGE_HEIGHT = 1000; 

// Interface for Prompt Lab Data
interface PromptLabData {
    images: { b64: string, label: string, type: 'sheet' | 'prop' | 'context' }[]; // Ordered list of images with type
    promptText: string;
    targetResolution?: Resolution;
    targetAspectRatio?: AspectRatio;
    isRefine: boolean;
    faceId: string;
}

const DownloadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onDownload: (format: 'zip' | 'pdf', includeOverlays: boolean) => void;
    labels: any;
}> = ({ isOpen, onClose, onDownload, labels }) => {
    const [format, setFormat] = useState<'zip' | 'pdf'>('pdf');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] bg-[#0E070C]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#150711] border border-[#3D1629] p-6 max-w-md w-full rounded-2xl shadow-2xl relative text-[#FAF5F0]">
                <button onClick={onClose} className="absolute top-4 right-4 text-[#8A6D7B] hover:text-[#FAF5F0] font-bold text-lg transition-colors">✕</button>
                <h3 className="text-xl font-bold text-[#FAF5F0] uppercase mb-6 border-b border-[#3D1629] pb-3 font-sans tracking-wide">{labels.multiDownloadTitle}</h3>
                
                <div className="mb-6">
                    <label className="block text-[#8A6D7B] font-bold text-xs uppercase mb-2 font-sans">{labels.formatOptions}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setFormat('pdf')} className={`flex-1 py-3 font-bold border transition-all rounded-xl font-sans uppercase text-xs ${format === 'pdf' ? 'bg-[#2A0E20] text-[#DF9E65] border-[#C68B59]' : 'bg-[#1B0A16] text-[#8A6D7B] border-[#3D1629] hover:border-[#8A6D7B]'}`}>PDF Document</button>
                        <button onClick={() => setFormat('zip')} className={`flex-1 py-3 font-bold border transition-all rounded-xl font-sans uppercase text-xs ${format === 'zip' ? 'bg-[#2A0E20] text-[#DF9E65] border-[#C68B59]' : 'bg-[#1B0A16] text-[#8A6D7B] border-[#3D1629] hover:border-[#8A6D7B]'}`}>ZIP Archive</button>
                    </div>
                </div>

                <div className="mb-6 opacity-60 pointer-events-none">
                     <label className="block text-[#8A6D7B] font-bold text-xs uppercase mb-2 font-sans">{labels.overlayOptions}</label>
                     <label className="flex items-start gap-3 p-3 bg-[#1B0A16] border border-[#3D1629] rounded-xl">
                         <input type="checkbox" checked={false} disabled className="mt-1 w-4 h-4 accent-[#C68B59]" />
                         <div>
                             <span className="block text-[#FAF5F0] font-bold text-xs font-sans">Dynamic Overlays Disabled</span>
                             <span className="block text-[#8A6D7B] text-[11px] mt-0.5 font-sans">Overlays are disabled in this studio edition.</span>
                         </div>
                     </label>
                </div>

                <button onClick={() => onDownload(format, false)} className="w-full bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold py-3.5 text-sm rounded-full uppercase hover:brightness-110 shadow-[0_0_20px_rgba(198,139,89,0.3)] active:scale-95 transition-all font-sans tracking-widest">
                    {format === 'zip' ? labels.downloadZip : labels.downloadPdf}
                </button>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  // --- API Key Hook ---
  const { validateApiKey, setShowApiKeyDialog, showApiKeyDialog, handleApiKeyDialogContinue } = useApiKey();
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- View Mode State ---
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [displayMode, setDisplayMode] = useState<'single' | 'double'>('double');
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('en'); 

  // --- Error Handling State ---
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Persona State ---
  const [hero, setHeroState] = useState<Persona | null>(null);
  const [friend, setFriendState] = useState<Persona | null>(null);
  const [antagonist, setAntagonistState] = useState<Persona | null>(null);
  const [extraCast, setExtraCastState] = useState<Persona[]>([]);
  
  const heroRef = useRef<Persona | null>(null);
  const friendRef = useRef<Persona | null>(null);
  const antagonistRef = useRef<Persona | null>(null);
  const extraCastRef = useRef<Persona[]>([]);

  const setHero = (p: Persona | null) => { setHeroState(p); heroRef.current = p; };
  const setFriend = (p: Persona | null) => { setFriendState(p); friendRef.current = p; };
  const setAntagonist = (p: Persona | null) => { setAntagonistState(p); antagonistRef.current = p; };
  const setExtraCast = (p: Persona[]) => { setExtraCastState(p); extraCastRef.current = p; };

  const updateCastMember = (id: string, updates: Partial<Persona>) => {
      if (hero && hero.id === id) setHero({ ...hero, ...updates });
      else if (friend && friend.id === id) setFriend({ ...friend, ...updates });
      else if (antagonist && antagonist.id === id) setAntagonist({ ...antagonist, ...updates });
      else {
          setExtraCast(extraCast.map(p => p.id === id ? { ...p, ...updates } : p));
      }
  };

  const addCastMember = (person: Persona) => {
      setExtraCast([...extraCast, person]);
  };

  const removeCastMember = (id: string) => {
      if (hero?.id === id) { }
      else if (friend?.id === id) setFriend(null);
      else if (antagonist?.id === id) setAntagonist(null);
      else setExtraCast(extraCast.filter(p => p.id !== id));
  };

  // --- Story Config State ---
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [selectedPlot, setSelectedPlot] = useState(PLOT_OPTIONS[GENRES[0]][0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0].code);
  const [customPremise, setCustomPremise] = useState("");
  const [coverPrompt, setCoverPrompt] = useState("Hero dynamic pose, action movie poster style.");
  const [richMode, setRichMode] = useState(true);
  const [comicTitle, setComicTitle] = useState("INFINITE HEROES");
  const [comicSubtitle, setComicSubtitle] = useState(""); 
  const [issueNumber, setIssueNumber] = useState("#1");
  const [publisher, setPublisher] = useState<PublisherConfig>({ name: "GEMINI COMICS", logoDescription: "A stylized rocket ship", mode: 'text' });
  const [previousIssueRefs, setPreviousIssueRefs] = useState<string[]>([]); 
  const [selectedResolution, setSelectedResolution] = useState<Resolution>('1K');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('3:4');
  const [borderColor, setBorderColor] = useState<BorderColor>('white'); 
  const [showOverlays, setShowOverlays] = useState(false); // Default to false per request
  const [imageModel, setImageModel] = useState<ImageModel>('gemini-nano-banana-2.1'); 
  const [isMatureMode, setIsMatureMode] = useState(false); 

  // --- Location & Prop State ---
  const [savedLocations, setSavedLocations] = useState<LocationRef[]>([]);
  const [propsList, setPropsList] = useState<Prop[]>([]); 
  
  const [locMode, setLocMode] = useState<'image' | 'text'>('image');
  const [newLocName, setNewLocName] = useState("");
  const [newLocDesc, setNewLocDesc] = useState("");
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null); 
  
  // --- App Logic State ---
  const [comicFaces, setComicFaces] = useState<ComicFace[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0); 
  const [isStarted, setIsStarted] = useState(false);
  
  // --- Veo Video State ---
  const [veoPrompt, setVeoPrompt] = useState("");
  const [movieModeUrlList, setMovieModeUrlList] = useState<string[] | null>(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  // --- Viewport State ---
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.8); 
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // --- Editor / Studio State ---
  const [sidebarWidth, setSidebarWidth] = useState(450);
  const isResizingSidebarRef = useRef(false);
  
  const [castListHeight, setCastListHeight] = useState(240);
  const isResizingCastListRef = useRef(false);

  const [activeEditSide, setActiveEditSide] = useState<'left' | 'right'>('right');
  const [studioMode, setStudioMode] = useState<'editor' | 'veo' | 'refiner' | 'prompt-lab'>('editor');
  
  const [panelCount, setPanelCount] = useState(1);
  const [layoutStyle, setLayoutStyle] = useState(LAYOUT_STYLES[0]);
  const [editorPanels, setEditorPanels] = useState<PanelData[]>([{ text: "", castIds: [] }]);
  
  const [panelEnhancingIdx, setPanelEnhancingIdx] = useState<number | null>(null);
  const [activePanelTab, setActivePanelTab] = useState(0); 
  
  // REFINER STATE
  const [refineInstruction, setRefineInstruction] = useState("");
  const [lastRefinePrompt, setLastRefinePrompt] = useState(""); // HISTORY
  const [isRefining, setIsRefining] = useState(false);
  
  const [refineCastIds, setRefineCastIds] = useState<string[]>([]);
  const [refineUseCharRefs, setRefineUseCharRefs] = useState(false);
  const [refineUsePropRefs, setRefineUsePropRefs] = useState(false);
  const [refineUseLocRefs, setRefineUseLocRefs] = useState(false);

  const [compositionImage, setCompositionImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Cover State
  const [isTextlessCover, setIsTextlessCover] = useState(false);

  // Download State
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // --- PROMPT LAB STATE ---
  const [promptLabData, setPromptLabData] = useState<PromptLabData | null>(null);

  const historyRef = useRef<ComicFace[]>([]);
  
  // Define allCast in component scope
  const allCast = [heroRef.current, friendRef.current, antagonistRef.current, ...extraCastRef.current].filter(Boolean) as Persona[];

  const labels = UI_LABELS[appLanguage];

  // --- SYNC EDITOR STATE TO GLOBAL STATE ---
  useEffect(() => {
      if (viewMode === 'studio' && activeFace) {
          setComicFaces(prev => prev.map(f => {
              if (f.id === activeFace.id) {
                  if (JSON.stringify(f.panelsData) !== JSON.stringify(editorPanels) || 
                      f.panelCount !== panelCount || 
                      f.layoutStyle !== layoutStyle ||
                      f.isTextless !== isTextlessCover) {
                      return { 
                          ...f, 
                          panelsData: editorPanels, 
                          panelCount, 
                          layoutStyle,
                          isTextless: isTextlessCover
                      };
                  }
              }
              return f;
          }));
      }
  }, [editorPanels, panelCount, layoutStyle, isTextlessCover, viewMode]);

  useEffect(() => {
      setEditorPanels(prev => {
          const currentLen = prev.length;
          const requiredCount = Math.max(1, Math.min(9, panelCount));
          
          if (currentLen === requiredCount) return prev;
          if (requiredCount > currentLen) {
              const newPanels = Array(requiredCount - currentLen).fill(null).map(() => ({ text: "", castIds: [] }));
              return [...prev, ...newPanels];
          } else {
              return prev.slice(0, requiredCount);
          }
      });
      if (activePanelTab >= panelCount) setActivePanelTab(0);
  }, [panelCount]);

  const leftPageIndex = currentSheetIndex === 0 ? -1 : (currentSheetIndex * 2) - 1;
  const rightPageIndex = currentSheetIndex === 0 ? 0 : (currentSheetIndex * 2);
  
  const activePageIndex = activeEditSide === 'left' ? leftPageIndex : rightPageIndex;
  const activeFace = comicFaces.find(f => f.pageIndex === activePageIndex);
  const lastActivePageIndexRef = useRef<number | null>(null);

  useEffect(() => {
      if (lastActivePageIndexRef.current !== activePageIndex) {
          lastActivePageIndexRef.current = activePageIndex;
          
          if (activeFace) {
              const count = activeFace.panelCount || (activeFace.panelsData ? activeFace.panelsData.length : 1);
              let style = activeFace.layoutStyle || (activeFace.layout?.includes("Splash") ? "Uniform Grid" : "Asymmetric / Dynamic");
              
              if (activeFace.type === 'cover' && !COVER_LAYOUT_STYLES.includes(style)) style = COVER_LAYOUT_STYLES[0];
              if (activeFace.type !== 'cover' && !LAYOUT_STYLES.includes(style)) style = LAYOUT_STYLES[0];

              setPanelCount(count);
              setLayoutStyle(style);
              setIsTextlessCover(!!activeFace.isTextless);

              if (activeFace.type === 'cover' || activeFace.type === 'back_cover') {
                  setEditorPanels(activeFace.panelsData && activeFace.panelsData.length > 0 
                      ? activeFace.panelsData 
                      : [{ text: activeFace.narrative?.scene || coverPrompt, castIds: [] }]);
              } else {
                  if (activeFace.panelsData && activeFace.panelsData.length > 0) {
                       setEditorPanels(activeFace.panelsData);
                  } else {
                      const initialPanels: PanelData[] = Array(count).fill(null).map(() => ({
                          text: activeFace.narrative?.scene || "",
                          castIds: [] 
                      }));
                      setEditorPanels(initialPanels);
                  }
              }
              const suggestion = activeFace.videoPrompt || activeFace.panelsData?.[0]?.text || activeFace.narrative?.scene || "";
              setVeoPrompt(suggestion);
          } else {
              setEditorPanels(Array(panelCount).fill(null).map(() => ({ text: "", castIds: [] })));
              setCompositionImage(null);
              setVeoPrompt("");
              setIsTextlessCover(false);
          }
          
          setRefineInstruction(""); 
          setIsRefining(false);
          setRefineCastIds([]);
          setRefineUseCharRefs(false);
          setRefineUsePropRefs(false);
          setRefineUseLocRefs(false);
          setActivePanelTab(0); 
      }
  }, [activePageIndex, activeFace, coverPrompt]);




  const handleAPIError = (e: any) => {
    if (e && (e.name === 'AbortError' || e.message === 'Cancelled')) {
        console.log("Generation cancelled by user.");
        return; 
    }

    let msg = "Unknown Error";
    
    if (e instanceof Error) {
        msg = e.message;
    } else if (typeof e === 'string') {
        msg = e;
    } else if (e && typeof e === 'object') {
        msg = JSON.stringify(e, null, 2);
        if (msg === '{}' || msg.includes('[object Object]')) {
             msg = "An unexpected error occurred. Please check console.";
        }
    }

    console.error("API Error:", e);
    const lowerMsg = msg.toLowerCase();

    if (lowerMsg.includes('403') || lowerMsg.includes('permission_denied') || lowerMsg.includes('caller does not have permission') || msg.includes('API_KEY_INVALID')) {
      setShowApiKeyDialog(true);
      return;
    }
    
    if (lowerMsg.includes('429') || lowerMsg.includes('quota') || lowerMsg.includes('resourceexhausted')) {
        setErrorMessage("⚠️ DAILY API QUOTA REACHED (RPD). You have hit the limit for free/tier requests today.");
        return;
    }
    
    if (lowerMsg.includes('503') || lowerMsg.includes('overloaded') || lowerMsg.includes('unavailable')) {
        setErrorMessage("⚠️ GOOGLE SERVERS BUSY (503). The AI model is currently overloaded. Please wait 10-30 seconds and try again.");
        return;
    }

    if (msg.includes('blockReason') && (msg.includes('OTHER') || msg.includes('SAFETY'))) {
        setErrorMessage("⚠️ CONTENT POLICY BLOCKED. The AI refused the prompt (Reason: SAFETY/OTHER). This often happens with:\n• Wheelchairs/Mobility Aids (AI misinterprets as 'Body Horror').\n• Realistic Weapons.\n• Real-world groups (Police/Military).\nTry softening image details or using 'Mature Mode'.");
        return;
    }
    
    setErrorMessage(msg.length > 250 ? msg.substring(0, 250) + "..." : msg);
  };
  
  const handleCancelGeneration = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
          if (activeFace) updateFaceState(activeFace.id, { isLoading: false, isVideoLoading: false });
          setIsRefining(false);
      }
  };

  const callWithRetry = async <T,>(fn: () => Promise<T>, retries = 5, delay = 3000, signal?: AbortSignal): Promise<T> => {
    if (signal?.aborted) throw new Error("Cancelled");
    try {
      return await fn();
    } catch (e: any) {
      if (signal?.aborted) throw new Error("Cancelled");
      const msg = String(e).toLowerCase();
      if (msg.includes('resourceexhausted') || msg.includes('quota') || msg.includes('429') || msg.includes('403') || msg.includes('permission_denied') || msg.includes('blockreason')) {
          throw e; 
      }
      
      if (retries > 0 && (msg.includes('503') || msg.includes('overloaded') || msg.includes('unavailable') || msg.includes('500') || msg.includes('internal'))) {
        console.warn(`API Error (Retrying in ${delay}ms):`, msg);
        await new Promise((resolve, reject) => {
             const timeout = setTimeout(resolve, delay);
             if (signal) {
                 signal.addEventListener('abort', () => {
                     clearTimeout(timeout);
                     reject(new Error("Cancelled"));
                 });
             }
        });
        return callWithRetry(fn, retries - 1, delay * 1.5, signal);
      }
      throw e;
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processImageForApi = (base64Str: string, maxWidth = 512): Promise<string> => {
      return new Promise((resolve, reject) => {
          if (!base64Str || base64Str.length < 100) return reject(new Error("Invalid image string length"));
          
          let src = base64Str;
          if (base64Str.startsWith('data:')) {
              src = base64Str;
          } else {
              const firstChar = base64Str.charAt(0);
              if (firstChar === '/') {
                  src = `data:image/jpeg;base64,${base64Str}`;
              } else if (firstChar === 'i') {
                  src = `data:image/png;base64,${base64Str}`;
              } else if (firstChar === 'U') {
                  src = `data:image/webp;base64,${base64Str}`;
              } else {
                  src = `data:image/jpeg;base64,${base64Str}`;
              }
          }
          
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = src;
          
          img.onload = () => {
              const scale = maxWidth / Math.max(img.width, img.height);
              const width = scale < 1 ? img.width * scale : img.width;
              const height = scale < 1 ? img.height * scale : img.height;
              
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error("Canvas context failed"));
              
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              
              const newDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              if (!newDataUrl.includes(',')) return reject(new Error("Canvas export failed"));
              resolve(newDataUrl.split(',')[1]); 
          };
          
          img.onerror = (e) => {
              console.error("Image processing failed. Source header:", src.substring(0, 30));
              reject(new Error("Failed to load/process reference image. Format may be unsupported."));
          };
      });
  };

  const pushImageToHistory = (faceId: string, newImageUrl: string) => {
      const face = comicFaces.find(f => f.id === faceId);
      if (!face) return;
      const currentHistory = face.imageHistory || (face.imageUrl ? [face.imageUrl] : []);
      const newHistory = [...currentHistory, newImageUrl].slice(-10);
      updateFaceState(faceId, {
          imageUrl: newImageUrl,
          imageHistory: newHistory,
          historyIndex: newHistory.length - 1,
          isLoading: false
      });
  };

  const navigateImageHistory = (direction: -1 | 1) => {
      if (!activeFace || !activeFace.imageHistory) return;
      const len = activeFace.imageHistory.length;
      if (len <= 1) return;
      const currentIdx = activeFace.historyIndex !== undefined ? activeFace.historyIndex : len - 1;
      let newIdx = currentIdx + direction;
      if (newIdx < 0) newIdx = 0;
      if (newIdx >= len) newIdx = len - 1;
      updateFaceState(activeFace.id, {
          imageUrl: activeFace.imageHistory[newIdx],
          historyIndex: newIdx
      });
  };

  const deleteImageFromHistory = () => {
      if (!activeFace || !activeFace.imageHistory || activeFace.imageHistory.length <= 1) return;
      const currentIdx = activeFace.historyIndex !== undefined ? activeFace.historyIndex : activeFace.imageHistory.length - 1;
      const newHistory = activeFace.imageHistory.filter((_, i) => i !== currentIdx);
      let newIdx = currentIdx;
      if (newIdx >= newHistory.length) { newIdx = newHistory.length - 1; }
      updateFaceState(activeFace.id, { imageHistory: newHistory, historyIndex: newIdx, imageUrl: newHistory[newIdx] });
  };

  const handleReplacePageImage = async (file: File) => {
      try {
          const b64 = await fileToBase64(file);
          const fullData = `data:image/jpeg;base64,${b64}`;
          if (activeFace) {
              pushImageToHistory(activeFace.id, fullData);
          } else {
               const pageNum = activePageIndex;
               if (pageNum < 0) return; 
               const newFace: ComicFace = {
                    id: `page-${pageNum}`,
                    type: pageNum === 0 ? 'cover' : 'story',
                    pageIndex: pageNum,
                    choices: [],
                    isLoading: false,
                    layout: 'Single Panel',
                    narrative: { scene: "", choices: [], focus_char: 'hero' },
                    panelsData: editorPanels, 
                    imageUrl: fullData,
                    imageHistory: [fullData],
                    historyIndex: 0
               };
               setComicFaces(prev => [...prev, newFace]);
               historyRef.current.push(newFace);
               if (pageNum > totalPages) setTotalPages(pageNum);
          }
      } catch (e) {
          console.error("Upload failed", e);
          setErrorMessage("Failed to load image.");
      }
  };

  const handleRecenter = () => { setPanPos({ x: 0, y: 0 }); setScale(0.8); };
  const handlePrevSheet = () => { if (currentSheetIndex > 0) setCurrentSheetIndex(currentSheetIndex - 1); };
  const handleNextSheet = () => { const maxSheet = Math.ceil(totalPages / 2); if (currentSheetIndex < maxSheet) setCurrentSheetIndex(currentSheetIndex + 1); };

  const handleEnhanceText = async (input: string, context: string): Promise<string> => {
      if (!input.trim()) return "";
      try {
          const prompt = `You are a professional comic book editor. TASK: Rewrite input to be more vivid. CONTEXT: ${context}. INPUT: "${input}". INSTRUCTIONS: Concise. Visuals only. No markdown.`;
          const res = await fetch("/api/gemini/generate-text", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt, model: MODEL_TEXT_NAME })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          return data.text?.trim() || input;
      } catch (e) {
          handleAPIError(e);
          return input;
      }
  };
  
  const handleCharacterSheetGen = async (id: string): Promise<string> => {
      abortControllerRef.current = new AbortController();
      
      const person = [heroRef.current, friendRef.current, antagonistRef.current, ...extraCastRef.current].find(p => p?.id === id);
      if (!person) throw new Error("Character not found");
      
      let basePrompt = `CONCEPT ART: CHARACTER DESIGN SHEET. Comic Book Style.\nSUBJECT: ${person.name} (${person.role}).\nDESCRIPTION: ${person.desc || 'N/A'}.\nCOSTUME: ${person.clothing}.\n\nLAYOUT: Front view, Side view, Back view, Close-up expressions. Neutral background. High fidelity.`;
      
      const parts: any[] = [];
      if (person.base64) {
          try {
              const cleanB64 = await processImageForApi(person.base64, 1536);
              parts.push({ inlineData: { mimeType: 'image/jpeg', data: cleanB64 } });
              basePrompt += `\n\nVISUAL REF [0]: Use Image 1 as concept source for character design.`;
          } catch(e) { console.warn("Failed to process face ref for sheet", e); }
      }
      
      parts.push({ text: basePrompt });
      
      try {
          const config: any = { 
              imageConfig: { aspectRatio: '4:3', imageSize: '2K' }
          };

          const res = await fetch("/api/gemini/generate-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ model: imageModel, parts, config })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          return data.imageData || '';
      } catch (e) { throw e; }
  };

  // --- PREPARATION PHASE (Consolidates Data for Prompt Lab) ---
  const prepareGeneration = async (
      type: ComicFace['type'], panelCountVal: number, styleVal: string, panelsData: PanelData[], 
      refineInstruction?: string, currentImageForRefine?: string, 
      compositionRef?: string | null, targetResolution?: Resolution, pageIndex?: number,
      isTextless: boolean = false
  ) => {
    
    if (activeFace?.isLoading) return;

    const allProjectCast = [heroRef.current, friendRef.current, antagonistRef.current, ...extraCastRef.current].filter(Boolean) as Persona[];
    const pageCastIds = new Set<string>();
    
    if (refineInstruction) {
        if (refineUseCharRefs) refineCastIds.forEach(id => pageCastIds.add(id));
    } else {
        panelsData.forEach(p => p.castIds?.forEach(id => pageCastIds.add(id)));
    }

    const images: { b64: string, label: string, type: 'sheet'|'prop'|'context' }[] = [];
    
    // 1. SOURCE (Refine)
    if (refineInstruction && currentImageForRefine) {
        try {
            const processed = await processImageForApi(currentImageForRefine, 1024);
            images.push({ b64: processed, label: "Original Image (Source)", type: 'context' });
        } catch (e) { console.warn("Failed to process source image", e); }
    }

    // 2. CHARACTER REFERENCES (Priority: Sheet Only)
    let humanCount = 0;
    for (const p of allProjectCast) {
        if (pageCastIds.has(p.id) && humanCount < 5) {
            if (p.characterSheet) {
                console.log(`Processing sheet for ${p.name}. Size: ${p.characterSheet.length}`);
                try {
                    const processed = await processImageForApi(p.characterSheet, 1536);
                    images.push({ b64: processed, label: `Reference: ${p.name}`, type: 'sheet' }); 
                    humanCount++;
                } catch(e) { console.warn("Failed to process sheet", e); }
            }
        }
    }

    // 3. PROPS & LOCATION REFS
    let objectCount = 0;
    const addedPropIds = new Set<string>();

    if (!refineInstruction || refineUsePropRefs || refineUseLocRefs) {
        // Iterate over panels to find used props AND locations
        for (const panel of panelsData) {
            
            // PROPS INJECTION
            if (!refineInstruction || refineUsePropRefs) {
                for (const castId of panel.castIds || []) {
                    const person = allProjectCast.find(p => p.id === castId);
                    if (!person) continue;

                    const override = panel.overrides?.[castId];
                    let propIdToUse: string | null = null;

                    if (override?.selectedPropId && override.weaponMode === 'specific') {
                        propIdToUse = override.selectedPropId;
                    } else if ((!override || override.weaponMode === 'default') && person.weapon) {
                        const match = propsList.find(pr => pr.name === person.weapon || pr.id === person.weapon);
                        if (match) propIdToUse = match.id;
                    }

                    if (propIdToUse && !addedPropIds.has(propIdToUse) && objectCount < 6) {
                        const prop = propsList.find(pr => pr.id === propIdToUse);
                        if (prop && prop.base64) {
                            try {
                                const processed = await processImageForApi(prop.base64, 512);
                                images.push({ b64: processed, label: `Prop: ${prop.name}`, type: 'prop' });
                                objectCount++;
                                addedPropIds.add(propIdToUse);
                            } catch(e) { console.warn("Failed prop", e); }
                        }
                    }
                }
            }

            // LOCATION INJECTION (If panel uses a location with a reference image)
            if (panel.locationId && panel.locationId !== 'NA' && (!refineInstruction || refineUseLocRefs)) {
                const loc = savedLocations.find(l => l.id === panel.locationId);
                if (loc && loc.base64) {
                     try {
                         const processed = await processImageForApi(loc.base64, 512);
                         // Check if already added to avoid duplicates
                         if (!images.find(img => img.label === `Location Ref: ${loc.name}`)) {
                             images.push({ b64: processed, label: `Location Ref: ${loc.name}`, type: 'context' });
                         }
                     } catch(e) { console.warn("Failed loc ref", e); }
                }
            }
        }
    }

    // 4. CONTEXT (Max 3)
    if (!refineInstruction || refineUseLocRefs) {
        if (compositionRef) {
             try {
                 const processed = await processImageForApi(compositionRef, 512);
                 images.push({ b64: processed, label: "Pose Reference", type: 'context' });
             } catch(e) {}
        }
        
        // Previous Page Injection logic
        if ((type as string) !== 'cover' && (type as string) !== 'back_cover' && pageIndex && pageIndex > 0) {
             const prevPageIdx = pageIndex - 1;
             const prevPage = comicFaces.find(f => f.pageIndex === prevPageIdx);
             if (prevPage && prevPage.imageUrl) {
                 try {
                     const processed = await processImageForApi(prevPage.imageUrl, 512);
                     images.push({ b64: processed, label: "Context: Previous Page", type: 'context' });
                 } catch(e) {}
             }
        }

        // --- COVER INJECTIONS (Title & Publisher Logos) ---
        if ((type as string) === 'cover' && !isTextless && !refineInstruction) {
             if (publisher.logoImage) {
                 try { 
                     const p = await processImageForApi(publisher.logoImage, 512); 
                     images.push({ b64: p, label: "Publisher Logo Reference", type: 'context' }); 
                 } catch(e) {}
             }
             if (publisher.titleLogo) {
                 try { 
                     const p = await processImageForApi(publisher.titleLogo, 512); 
                     images.push({ b64: p, label: "Title Logo Reference", type: 'context' }); 
                 } catch(e) {}
             }
        }
    }

    // 5. BUILD TEXT PROMPT
    let promptText = "";
    if (isMatureMode) promptText += "CONTEXT: FICTIONAL GRAPHIC NOVEL. ARTISTIC ILLUSTRATION ONLY. \n";
    
    if (images.length > 0) {
        promptText += "VISUAL REFERENCES:\n";
        let hasPrevPageContext = false;
        images.forEach((img, idx) => {
            promptText += `Image [${idx}]: ${img.label}\n`;
            if (img.label.includes("Context: Previous Page")) hasPrevPageContext = true;
        });
        promptText += "\n";
        
        if (hasPrevPageContext) {
            promptText += "STYLE TARGET: Match the art style, color palette, and lighting of the Previous Page context image.\n";
        }
    }

    if (refineInstruction) {
        promptText += `TASK: Edit Image [0]. INSTRUCTION: "${refineInstruction}".\nMaintain scene lighting and style.`;
    } else {
        promptText += `STYLE: High Quality ${selectedGenre} Graphic Novel. BORDERS: ${borderColor} gutters.\n`;
        if ((type as string) === 'cover') {
            const desc = panelsData[0]?.text || coverPrompt;
            promptText += `TYPE: Cover Art. VISUALS: ${desc}. LAYOUT: ${styleVal}.`;
        } else if ((type as string) === 'back_cover') {
            const desc = panelsData[0]?.text || "Credits page";
            promptText += `TYPE: Back Cover / Credits Page. VISUALS: ${desc}. LAYOUT: Minimalist text layout.`;
        } else {
            promptText += `TYPE: Comic Page. LAYOUT: ${panelCountVal} Panels (${styleVal}).\n`;
            panelsData.forEach((p, i) => {
                promptText += `\n[PANEL ${i+1}]: ${p.text}`;
                if (p.locationId && p.locationId !== 'NA') {
                    const loc = savedLocations.find(l => l.id === p.locationId);
                    if (loc) {
                        promptText += ` (SETTING: ${loc.name} - ${loc.description || ''})`;
                    }
                }
                
                // Inject Prop Instructions per panel
                p.castIds.forEach(cid => {
                    const override = p.overrides?.[cid];
                    let propName = "";
                    if (override?.selectedPropId && override.weaponMode === 'specific') {
                        const prop = propsList.find(pr => pr.id === override.selectedPropId);
                        if (prop) propName = prop.name;
                    } else if (override?.weaponMode === 'custom' && override.weaponCustom) {
                        propName = override.weaponCustom;
                    } else if ((!override || override.weaponMode === 'default') && objectCount < 99) {
                         const person = allProjectCast.find(c => c.id === cid);
                         if (person?.weapon) propName = person.weapon;
                    }

                    if (propName) {
                        const person = allProjectCast.find(c => c.id === cid);
                        if (person) promptText += ` (${person.name} HOLDING: ${propName})`;
                    }
                });
            });
        }
    }

    // SET PROMPT LAB DATA
    const activeId = `page-${pageIndex}`;
    setPromptLabData({
        images: images,
        promptText: promptText,
        targetResolution: targetResolution || selectedResolution,
        targetAspectRatio: selectedAspectRatio,
        isRefine: !!refineInstruction,
        faceId: activeId
    });
    setStudioMode('prompt-lab');
  };

  // --- EXECUTION PHASE (Runs from Prompt Lab) ---
  const executePromptLab = async (overrideImages?: { b64: string, label: string, type: 'sheet'|'prop'|'context' }[]) => {
      if (!promptLabData) return;
      
      const imagesToSend = overrideImages || promptLabData.images;
      
      abortControllerRef.current = new AbortController();
      
      updateFaceState(promptLabData.faceId, { isLoading: true });

      try {
          let finalPromptText = promptLabData.promptText;
          if (overrideImages) {
              let newPromptPrefix = "";
              if (isMatureMode) newPromptPrefix += "CONTEXT: FICTIONAL GRAPHIC NOVEL. ARTISTIC ILLUSTRATION ONLY. \n";
              if (imagesToSend.length > 0) {
                  newPromptPrefix += "VISUAL REFERENCES:\n";
                  let hasPrevPageContext = false;
                  imagesToSend.forEach((img, idx) => {
                      newPromptPrefix += `Image [${idx}]: ${img.label}\n`;
                      if (img.label.includes("Context: Previous Page")) hasPrevPageContext = true;
                  });
                  newPromptPrefix += "\n";
                  if (hasPrevPageContext) {
                      newPromptPrefix += "STYLE TARGET: Match the art style, color palette, and lighting of the Previous Page context image.\n";
                  }
              }
              const instructionPart = promptLabData.promptText.includes("TYPE:") 
                  ? promptLabData.promptText.substring(promptLabData.promptText.indexOf("TYPE:"))
                  : promptLabData.promptText.includes("TASK:") 
                      ? promptLabData.promptText.substring(promptLabData.promptText.indexOf("TASK:"))
                      : promptLabData.promptText;
              
              finalPromptText = newPromptPrefix + instructionPart;
          }

          const parts = [
              ...imagesToSend.map(img => ({ inlineData: { mimeType: 'image/jpeg', data: img.b64 } })),
              { text: finalPromptText }
          ];

          console.log(`EXECUTING PROMPT LAB... Images: ${imagesToSend.length}, Text Len: ${finalPromptText.length}`);

          const config: any = { 
            imageConfig: {
              aspectRatio: promptLabData.targetAspectRatio || selectedAspectRatio,
              imageSize: promptLabData.targetResolution || selectedResolution
            }
          };

          const res = await fetch("/api/gemini/generate-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ model: imageModel, parts, config })
          });

          const data = await res.json();
          if (data.error) throw new Error(data.error);

          if (data.finishReason === 'OTHER' || data.finishReason === 'SAFETY' || data.blockReason) {
               throw new Error("Content Policy Violation (Safety Block). The AI refused your prompt. Try enabling Mature Mode or removing trigger words/sheets.");
          }
          
          let imageData = data.imageData || '';
          let textData = data.textData || '';

          if (!imageData && textData) {
               throw new Error(`Model Response (No Image): ${textData}`);
          }

          if (!imageData) throw new Error("Empty image data returned. The AI might have failed to generate the visual.");

          const fullUrl = `data:image/png;base64,${imageData}`;
          
          pushImageToHistory(promptLabData.faceId, fullUrl);
          
          if (promptLabData.isRefine) {
              setIsRefining(false);
          } else {
              updateFaceState(promptLabData.faceId, { panelsData: editorPanels, panelCount, layoutStyle, isTextless: isTextlessCover, aspectRatio: promptLabData.targetAspectRatio || selectedAspectRatio });
          }
          
          setStudioMode(promptLabData.isRefine ? 'refiner' : 'editor');
          setPromptLabData(null); 

      } catch (e: any) {
          handleAPIError(e);
          
          if (e.message && (e.message.includes("Empty image data") || e.message.includes("Policy")) && imagesToSend.some(img => img.type === 'sheet')) {
              if (window.confirm("Generation Failed (Safety Block). This is usually caused by a Character Sheet triggering safety filters. Retry without Character Sheets?")) {
                  const safeImages = imagesToSend.filter(img => img.type !== 'sheet');
                  executePromptLab(safeImages);
              }
          }
      } finally {
          updateFaceState(promptLabData.faceId, { isLoading: false });
      }
  };
  
  const updateFaceState = (id: string, updates: Partial<ComicFace>) => {
      setComicFaces(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
      const idx = historyRef.current.findIndex(f => f.id === id);
      if (idx !== -1) historyRef.current[idx] = { ...historyRef.current[idx], ...updates };
  };

  const handlePointerDown = (e: React.PointerEvent) => { if (viewMode !== 'studio' && viewMode !== 'setup') return; isDraggingRef.current = true; dragStartRef.current = { x: e.clientX - panPos.x, y: e.clientY - panPos.y }; };
  const handlePointerMove = (e: React.PointerEvent) => { if (!isDraggingRef.current) return; setPanPos({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y }); };
  const handlePointerUp = () => { isDraggingRef.current = false; };
  const handleWheel = (e: React.WheelEvent) => { if (viewMode !== 'studio' && viewMode !== 'setup') return; const zoomIntensity = 0.001; const newScale = Math.min(Math.max(0.1, scale + e.deltaY * -zoomIntensity), 5); setScale(newScale); };
  const handleSidebarResizeStart = (e: React.PointerEvent) => { e.stopPropagation(); e.preventDefault(); isResizingSidebarRef.current = true; const startX = e.clientX; const startWidth = sidebarWidth; const onMove = (moveEvent: PointerEvent) => { const newWidth = startWidth + (startX - moveEvent.clientX); setSidebarWidth(Math.max(300, Math.min(800, newWidth))); }; const onUp = () => { isResizingSidebarRef.current = false; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); }; window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp); };
  const handleCastListResizeStart = (e: React.PointerEvent) => { e.stopPropagation(); e.preventDefault(); isResizingCastListRef.current = true; const startY = e.clientY; const startHeight = castListHeight; const onMove = (moveEvent: PointerEvent) => { const newHeight = startHeight + (moveEvent.clientY - startY); setCastListHeight(Math.max(150, Math.min(600, newHeight))); }; const onUp = () => { isResizingCastListRef.current = false; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); }; window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp); };

  const handleFullReset = () => {
      if (!window.confirm("NUCLEAR RESET: Are you sure? This will wipe the entire project and return to the start screen. This cannot be undone.")) return;

      // 1. Reset Global State
      setHero(null);
      setFriend(null);
      setAntagonist(null);
      setExtraCast([]);
      
      setComicFaces([]);
      historyRef.current = [];
      
      setComicTitle("INFINITE HEROES");
      setComicSubtitle("");
      setIssueNumber("#1");
      setSelectedGenre(GENRES[0]);
      setSelectedPlot(PLOT_OPTIONS[GENRES[0]][0]);
      setPublisher({ name: "GEMINI COMICS", logoDescription: "A stylized rocket ship", mode: 'text' });
      setSavedLocations([]);
      setPropsList([]);
      
      setTotalPages(0);
      setCurrentSheetIndex(0);
      setIsStarted(false);
      setViewMode('landing');
      setAppLanguage('en');
      setImageModel('gemini-3-pro-image-preview');
      setBorderColor('white');
      setShowOverlays(false);
      setIsMatureMode(false);
      setSelectedAspectRatio('3:4');
  };

  const restoreSession = (hero: Persona, friend: Persona | null, antagonist: Persona | null, comicFaces: ComicFace[], totalPages: number, config: any) => { setHero(hero); setFriend(friend); setAntagonist(antagonist); if (config.extraCast) setExtraCast(config.extraCast); setComicFaces(comicFaces); historyRef.current = comicFaces; setTotalPages(totalPages); setComicTitle(config.comicTitle || "Restored Comic"); setComicSubtitle(config.comicSubtitle || ""); setSelectedGenre(config.selectedGenre || GENRES[0]); setIssueNumber(config.issueNumber || "#1"); setPublisher(config.publisher || { name: "GEMINI COMICS", logoDescription: "", mode: 'text' }); setCustomPremise(config.customPremise || ""); setCoverPrompt(config.coverPrompt || ""); setSavedLocations(config.savedLocations || []); setPropsList(config.propsList || []); setSelectedResolution(config.selectedResolution || '1K'); if (config.imageModel) setImageModel(config.imageModel); if (config.appLanguage) setAppLanguage(config.appLanguage); if (config.showOverlays !== undefined) setShowOverlays(config.showOverlays); if (config.selectedLanguage) setSelectedLanguage(config.selectedLanguage); if (config.borderColor) setBorderColor(config.borderColor); if (config.isMatureMode !== undefined) setIsMatureMode(config.isMatureMode); if (config.selectedAspectRatio) setSelectedAspectRatio(config.selectedAspectRatio); setIsStarted(true); setViewMode('studio'); setCurrentSheetIndex(0); };
  
  const handleSaveConfig = async (mode: 'lite' | 'full' | 'cbs') => { 
      try {
          // Prepare Clean State Object
          const saveData: any = {
              comicTitle, comicSubtitle, selectedGenre, selectedPlot, selectedLanguage, 
              customPremise, coverPrompt, issueNumber, publisher: {...publisher},
              selectedResolution, selectedAspectRatio, totalPages, borderColor, imageModel, appLanguage, showOverlays, isMatureMode,
              hero: hero ? { ...hero } : null,
              friend: friend ? { ...friend } : null,
              antagonist: antagonist ? { ...antagonist } : null,
              extraCast: extraCast.map(p => ({ ...p })),
              savedLocations: savedLocations.map(l => ({ ...l })),
              propsList: propsList.map(p => ({ ...p })),
              comicFaces: comicFaces.map(f => ({ ...f, imageHistory: [] })), // Strip history for save to reduce size
              previousIssueRefs: [...previousIssueRefs]
          };

          const sanitizeFilename = (name: string) => name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const baseFilename = `${sanitizeFilename(comicTitle)}_${sanitizeFilename(issueNumber)}`;

          if (mode === 'lite') {
              // LITE MODE (JSON ONLY - NO IMAGES)
              if (saveData.hero) { saveData.hero.base64 = ""; saveData.hero.characterSheet = undefined; saveData.hero.additionalImages = []; }
              if (saveData.friend) { saveData.friend.base64 = ""; saveData.friend.characterSheet = undefined; saveData.friend.additionalImages = []; }
              if (saveData.antagonist) { saveData.antagonist.base64 = ""; saveData.antagonist.characterSheet = undefined; saveData.antagonist.additionalImages = []; }
              
              saveData.extraCast.forEach((p: any) => { p.base64 = ""; p.characterSheet = undefined; p.additionalImages = []; });
              saveData.savedLocations.forEach((l: any) => { l.base64 = undefined; });
              saveData.propsList.forEach((p: any) => { p.base64 = undefined; });
              
              saveData.comicFaces = saveData.comicFaces.map((f: any) => ({
                 ...f,
                 imageUrl: undefined,
                 videoUrl: undefined
              }));
              if (saveData.publisher) { saveData.publisher.logoImage = undefined; saveData.publisher.titleLogo = undefined; }
              saveData.previousIssueRefs = [];

              const jsonString = JSON.stringify(saveData, null, 2);
              const blob = new Blob([jsonString], { type: 'application/json' });
              const url = URL.createObjectURL(blob); 
              const link = document.createElement('a'); 
              link.href = url; 
              link.download = `${baseFilename}_LITE.json`; 
              link.click();
              
          } else if (mode === 'full') {
              // FULL JSON (LEGACY)
              const jsonString = JSON.stringify(saveData);
              const sizeMB = new Blob([jsonString]).size / (1024 * 1024);
              
              if (sizeMB > 150) {
                  if (!window.confirm(`⚠️ WARNING: File size is ${sizeMB.toFixed(1)}MB. Large JSON files may crash the browser. Use CBS Archive instead?\n\nClick Cancel to abort, OK to try saving anyway.`)) {
                      return;
                  }
              }

              const blob = new Blob([jsonString], { type: 'application/json' });
              const url = URL.createObjectURL(blob); 
              const link = document.createElement('a'); 
              link.href = url; 
              link.download = `${baseFilename}_FULL.json`; 
              link.click();

          } else {
              // CBS / ZIP ARCHIVE (BEST)
              const zip = new JSZip();
              const assets = zip.folder("assets");
              const castFolder = assets?.folder("cast");
              const pagesFolder = assets?.folder("pages");
              const propsFolder = assets?.folder("props");
              const locationsFolder = assets?.folder("locations");
              const systemFolder = assets?.folder("system");

              const saveAndStrip = (data: any, folder: any, name: string) => {
                  if (data && typeof data === 'string' && data.length > 100) {
                      folder.file(name, data.includes(',') ? data.split(',')[1] : data, {base64: true});
                      return undefined; // Stripped from JSON
                  }
                  return data; // Keep in JSON if it's just a URL or empty string
              };

              const saveAndStripArray = (arr: string[] | undefined, folder: any, prefix: string) => {
                  if (!arr || arr.length === 0) return [];
                  arr.forEach((img, idx) => {
                      if (img && img.length > 100) {
                           folder.file(`${prefix}_${idx}.jpg`, img.includes(',') ? img.split(',')[1] : img, {base64: true});
                      }
                  });
                  return []; 
              };

              const processPersona = (p: any, id: string) => {
                  if (!p) return;
                  p.base64 = saveAndStrip(p.base64, castFolder, `${id}.jpg`);
                  p.characterSheet = saveAndStrip(p.characterSheet, castFolder, `${id}_sheet.jpg`);
                  p.additionalImages = saveAndStripArray(p.additionalImages, castFolder, `${id}_add`);
              };

              processPersona(saveData.hero, "hero");
              processPersona(saveData.friend, "friend");
              processPersona(saveData.antagonist, "antagonist");
              
              saveData.extraCast.forEach((p: any) => processPersona(p, p.id));

              saveData.comicFaces = saveData.comicFaces.map((f: any) => {
                  if (f.imageUrl) f.imageUrl = saveAndStrip(f.imageUrl, pagesFolder, `${f.id}.jpg`);
                  return f;
              });

              saveData.propsList.forEach((p: any) => {
                   if (p.base64) p.base64 = saveAndStrip(p.base64, propsFolder, `${p.id}.jpg`);
              });

              saveData.savedLocations.forEach((l: any) => {
                  if (l.base64) l.base64 = saveAndStrip(l.base64, locationsFolder, `${l.id}.jpg`);
              });

              if (saveData.publisher.logoImage) saveData.publisher.logoImage = saveAndStrip(saveData.publisher.logoImage, systemFolder, "pub_logo.png");
              if (saveData.publisher.titleLogo) saveData.publisher.titleLogo = saveAndStrip(saveData.publisher.titleLogo, systemFolder, "title_logo.png");
              
              saveData.previousIssueRefs = saveAndStripArray(saveData.previousIssueRefs, systemFolder, "prev_iss");

              zip.file("project.json", JSON.stringify(saveData, null, 2));

              const blob = await zip.generateAsync({type:"blob"});
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${baseFilename}_PROJECT.cbs`;
              link.click();
          }
      } catch (e: any) {
          console.error("Save failed:", e);
          alert(`Save Failed: ${e.message || "Unknown error"}. If using Full JSON, try CBS format.`);
      }
  };
  
  const handleLoadConfig = async (file: File) => { 
      try { 
          if (file.name.endsWith('.cbs') || file.type.includes('zip') || file.name.endsWith('.zip')) {
              const zip = await JSZip.loadAsync(file);
              const jsonFile = zip.file("project.json");
              if (!jsonFile) throw new Error("Invalid .CBS file: project.json missing from archive.");
              
              const jsonText = await jsonFile.async("string");
              const json = JSON.parse(jsonText);

              const hydrate = async (path: string) => {
                  const f = zip.file(`assets/${path}`);
                  if (f) {
                      const b64 = await f.async("base64");
                      return `data:image/jpeg;base64,${b64}`; 
                  }
                  return undefined;
              };
              
              const hydrateArray = async (pathPrefix: string) => {
                  const arr: string[] = [];
                  let idx = 0;
                  while(true) {
                      const f = zip.file(`assets/${pathPrefix}_${idx}.jpg`);
                      if (!f) break;
                      const b64 = await f.async("base64");
                      arr.push(`data:image/jpeg;base64,${b64}`);
                      idx++;
                  }
                  return arr;
              };

              const hydratePersona = async (p: any, id: string) => {
                  if (!p) return;
                  if (!p.base64) p.base64 = (await hydrate(`cast/${id}.jpg`)) || "";
                  if (!p.characterSheet) p.characterSheet = await hydrate(`cast/${id}_sheet.jpg`);
                  p.additionalImages = await hydrateArray(`cast/${id}_add`);
              };

              await hydratePersona(json.hero, "hero");
              await hydratePersona(json.friend, "friend");
              await hydratePersona(json.antagonist, "antagonist");

              if (json.extraCast) {
                  for (const p of json.extraCast) {
                      await hydratePersona(p, p.id);
                  }
              }

              if (json.comicFaces) {
                  for (const f of json.comicFaces) {
                      if (!f.imageUrl) {
                          const val = await hydrate(`pages/${f.id}.jpg`);
                          if (val) {
                              f.imageUrl = val;
                              f.imageHistory = [val];
                          }
                      }
                  }
              }

              if (json.propsList) {
                  for (const p of json.propsList) {
                      if (!p.base64) p.base64 = await hydrate(`props/${p.id}.jpg`);
                  }
              }

              if (json.savedLocations) {
                  for (const l of json.savedLocations) {
                      if (!l.base64) l.base64 = await hydrate(`locations/${l.id}.jpg`);
                  }
              }
              
              if (json.publisher) {
                  if (!json.publisher.logoImage) json.publisher.logoImage = await hydrate("system/pub_logo.png");
                  if (!json.publisher.titleLogo) json.publisher.titleLogo = await hydrate("system/title_logo.png");
              }
              json.previousIssueRefs = await hydrateArray("system/prev_iss");

              applyConfig(json);

          } else {
              const text = await file.text(); 
              const json = JSON.parse(text); 
              applyConfig(json);
          }
      } catch (e: any) { 
          console.error(e);
          alert(`Load Failed: ${e.message}`); 
      } 
  };

  const applyConfig = (json: any) => {
      setComicTitle(json.comicTitle || comicTitle); setComicSubtitle(json.comicSubtitle || comicSubtitle); setSelectedGenre(json.selectedGenre || selectedGenre); setSelectedPlot(json.selectedPlot || selectedPlot); setCustomPremise(json.customPremise || customPremise); setPublisher(json.publisher || publisher); setSavedLocations(json.savedLocations || []); setPropsList(json.propsList || []); if (json.imageModel) setImageModel(json.imageModel); if (json.appLanguage) setAppLanguage(json.appLanguage); if(json.showOverlays !== undefined) setShowOverlays(json.showOverlays); if(json.hero) setHero({...hero, ...json.hero}); if(json.friend) setFriend(json.friend); if(json.antagonist) setAntagonist(json.antagonist); if(json.extraCast) setExtraCast(json.extraCast); if(json.borderColor) setBorderColor(json.borderColor); if(json.selectedLanguage) setSelectedLanguage(json.selectedLanguage); if(json.isMatureMode) setIsMatureMode(json.isMatureMode); if(json.issueNumber) setIssueNumber(json.issueNumber); if(json.previousIssueRefs) setPreviousIssueRefs(json.previousIssueRefs); if(json.selectedAspectRatio) setSelectedAspectRatio(json.selectedAspectRatio);
      if (json.comicFaces) {
          setComicFaces(json.comicFaces);
          historyRef.current = json.comicFaces;
          setTotalPages(Math.max(...json.comicFaces.map((f:any) => f.pageIndex || 0)));
      }
      alert("Config loaded successfully!");
  };

  const handleAddLocation = (loc: LocationRef) => setSavedLocations(prev => [...prev, loc]);
  const handleUpdateLocation = (id: string, updates: Partial<LocationRef>) => setSavedLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  const handleDeleteLocation = (id: string) => setSavedLocations(prev => prev.filter(l => l.id !== id));
  const handleAddProp = (p: Prop) => setPropsList(prev => [...prev, p]);
  const handleUpdateProp = (id: string, updates: Partial<Prop>) => setPropsList(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const handleDeleteProp = (id: string) => setPropsList(prev => prev.filter(p => p.id !== id));
  const handleLoadLocationForEdit = (loc: LocationRef) => { setEditingLocationId(loc.id); setNewLocName(loc.name); if (loc.type === 'text') { setLocMode('text'); setNewLocDesc(loc.description || ""); } else { setLocMode('image'); } };
  const jumpToPage = (pageIdx: number) => { if (pageIdx === 0) setCurrentSheetIndex(0); else { setCurrentSheetIndex(Math.ceil(pageIdx / 2)); } if (pageIdx === 0) setActiveEditSide('right'); else { setActiveEditSide(pageIdx % 2 !== 0 ? 'left' : 'right'); } };
  const handleEditPage = (pageIndex: number) => { jumpToPage(pageIndex); };
  
  const downloadSinglePage = () => { if (activeFace && activeFace.imageUrl) { const link = document.createElement('a'); link.href = activeFace.imageUrl; link.download = `page-${activeFace.pageIndex}.jpg`; link.click(); } };

  const downloadComic = async (format: 'zip' | 'pdf', includeOverlays: boolean) => {
      setShowDownloadModal(false);
      const facesToDl = [...comicFaces].sort((a,b) => (a.pageIndex || 0) - (b.pageIndex || 0));
      if (facesToDl.length === 0) return;
      if (format === 'zip') {
          const zip = new JSZip();
          facesToDl.forEach(f => { if (f.imageUrl) { const name = f.pageIndex === 0 ? "Cover.jpg" : `Page-${f.pageIndex}.jpg`; const data = f.imageUrl.split(',')[1]; zip.file(name, data, {base64: true}); } });
          const blob = await zip.generateAsync({type:'blob'});
          const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${comicTitle.replace(/\s/g, '_')}_Comic.zip`; link.click();
      } else {
          const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [PAGE_HEIGHT * 0.75, PAGE_HEIGHT] });
          facesToDl.forEach((f, i) => { if (f.imageUrl) { if (i > 0) pdf.addPage(); pdf.addImage(f.imageUrl, 'JPEG', 0, 0, PAGE_HEIGHT * 0.75, PAGE_HEIGHT); } });
          pdf.save(`${comicTitle.replace(/\s/g, '_')}.pdf`);
      }
  };

  const getNextResolution = (current: Resolution): Resolution => { if (current === '1K') return '2K'; if (current === '2K') return '4K'; return '4K'; };

  const handleExecuteFromEditor = async (isRefine = false, targetResolution?: Resolution) => {
    const pageNum = activePageIndex;
    const isCover = pageNum === 0;
    if (!isCover && !hero) { alert("Please setup characters first."); return; }
    let currentFace = comicFaces.find(f => f.pageIndex === pageNum);
    if (pageNum > totalPages && !currentFace) { setTotalPages(pageNum); }

    if (!currentFace) {
        currentFace = { id: `page-${pageNum}`, type: isCover ? 'cover' : 'story', pageIndex: pageNum, choices: [], isLoading: false, layout: 'Single Panel', narrative: { scene: "", choices: [], focus_char: 'hero' } };
        setComicFaces(prev => [...prev, currentFace!]);
        historyRef.current.push(currentFace);
    }

    await prepareGeneration(
        currentFace.type, panelCount, layoutStyle, editorPanels, 
        isRefine ? refineInstruction : undefined, isRefine ? currentFace.imageUrl : undefined, 
        compositionImage, targetResolution, pageNum, isTextlessCover
    );
  };
  
  const generatePageVideo = async (pageIndex: number, prompt: string) => { 
      const face = comicFaces.find(f => f.pageIndex === pageIndex); 
      if (!face || !face.imageUrl) return; 
      updateFaceState(face.id, { isVideoLoading: true });
      abortControllerRef.current = new AbortController();
      try { 
          const imageBytes = face.imageUrl.split(',')[1]; 
          const res = await fetch("/api/gemini/generate-video", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt, imageBytes, mimeType: 'image/jpeg' })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          if (data.videoDataUrl) {
              updateFaceState(face.id, { videoUrl: data.videoDataUrl, isVideoLoading: false, videoPrompt: prompt });
          } else {
              throw new Error("No video returned");
          } 
      } catch (e) { 
          handleAPIError(e); 
          updateFaceState(face.id, { isVideoLoading: false }); 
      } 
  };
  
  const handleAddBackCover = () => {
      const nextIdx = totalPages + 1;
      setTotalPages(nextIdx);
      const newFace: ComicFace = {
          id: `page-${nextIdx}`,
          type: 'back_cover',
          pageIndex: nextIdx,
          choices: [],
          isLoading: false,
          layout: 'Cover Splash',
          panelsData: [{ 
              text: `Ending Credits Page. 
TEXT TO DISPLAY:
Written & Directed by User
Art by Gemini 3 Pro
Produced by ${publisher.name}
THANKS FOR READING!`, 
              castIds: [] 
          }],
          narrative: { scene: "Credits Page", choices: [], focus_char: 'hero' }
      };
      setComicFaces(prev => [...prev, newFace]);
      historyRef.current.push(newFace);
      jumpToPage(nextIdx);
  };

  const handleDeletePage = () => {
      if (!activeFace) return;
      const pageIdx = activeFace.pageIndex;
      if (pageIdx === undefined || pageIdx === 0) {
          alert("Cannot delete the Cover page. It is mandatory.");
          return;
      }
      
      if (!window.confirm(`Are you sure you want to delete Page ${pageIdx}? This will remove the image and settings, and renumber all subsequent pages.`)) return;

      const newFaces = comicFaces.filter(f => f.pageIndex !== pageIdx);
      
      const reindexedFaces = newFaces.map(f => {
          if ((f.pageIndex || 0) > pageIdx) {
              const newIdx = (f.pageIndex || 0) - 1;
              return { ...f, id: `page-${newIdx}`, pageIndex: newIdx };
          }
          return f;
      });
      
      const newTotal = reindexedFaces.reduce((max, f) => Math.max(max, f.pageIndex || 0), 0);
      
      setComicFaces(reindexedFaces);
      historyRef.current = reindexedFaces; 
      setTotalPages(newTotal);
      
      const prevIdx = pageIdx - 1;
      jumpToPage(prevIdx);
  };

  const startMovieMode = () => { const urls: string[] = []; const sorted = [...comicFaces].sort((a,b) => (a.pageIndex || 0) - (b.pageIndex || 0)); sorted.forEach(f => { if (f.videoUrl) urls.push(f.videoUrl); }); if (urls.length === 0) { alert("No animated pages found!"); return; } setMovieModeUrlList(urls); setCurrentMovieIndex(0); };
  const launchStory = async () => { const hasKey = await validateApiKey(); if (!hasKey) return; if (!heroRef.current || !comicTitle.trim()) return; setIsTransitioning(true); setTimeout(() => { setViewMode('character-gen'); setIsTransitioning(false); }, 1000); };
  const handleOpenCharacterLab = () => { if (viewMode === 'setup') { setViewMode('character-gen'); } };
  const finalizeCharacterGen = async () => { setIsTransitioning(true); if (!isStarted) { setComicFaces([]); historyRef.current = []; setTotalPages(0); const coverFace: ComicFace = { id: 'page-0', type: 'cover', pageIndex: 0, choices: [], isLoading: false, layout: 'Cover Splash', panelCount: 1, layoutStyle: 'Cover Splash', panelsData: [{ text: coverPrompt, castIds: [] }], narrative: { scene: coverPrompt, choices: [], focus_char: 'hero' } }; setComicFaces([coverFace]); historyRef.current = [coverFace]; setTimeout(async () => { setIsStarted(true); setViewMode('studio'); setIsTransitioning(false); setCurrentSheetIndex(0); setActiveEditSide('right'); }, 1100); } else { setTimeout(async () => { setViewMode('studio'); setIsTransitioning(false); }, 500); } };

  const activePageIsNew = !activeFace && activePageIndex > 0; 
  const activeFaceLoading = activeFace?.isLoading;
  const activePanelData = editorPanels[activePanelTab];
  const activePanelIdx = activePanelTab;
  const isCoverPage = activePageIndex === 0;
  const selectedCastCount = activePanelData?.castIds?.length || 0;

  return (
    <div className="comic-scene" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onWheel={handleWheel}>
      {showApiKeyDialog && <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />}
      {showDownloadModal && <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} onDownload={downloadComic} labels={labels} />}
      {errorMessage && <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] animate-in slide-in-from-top-4"><div className="bg-red-600 text-white border-4 border-black p-4 max-w-lg flex items-center gap-4"><div className="text-3xl">⚠️</div><div className="flex-1"><p className="font-sans text-sm font-bold">{errorMessage}</p></div><button onClick={() => setErrorMessage(null)} className="bg-black text-white font-bold px-3 py-1 border border-white font-sans">Dismiss</button></div></div>}
      
      {viewMode === 'landing' && <Landing onNew={() => setViewMode('setup')} onContinue={() => setViewMode('restore')} onChangeApiKey={handleApiKeyDialogContinue} imageModel={imageModel} onImageModelChange={setImageModel} onAppLanguageChange={setAppLanguage} appLanguage={appLanguage} />}
      {viewMode === 'restore' && <Restore onBack={() => setViewMode('landing')} onRestore={restoreSession} appLanguage={appLanguage} />}
      {viewMode === 'character-gen' && <CharacterGen cast={allCast} onGenerateSheet={handleCharacterSheetGen} onUpdateCast={updateCastMember} onFinish={finalizeCharacterGen} onError={handleAPIError} onCancel={handleCancelGeneration} />}
      
      <Setup 
          show={viewMode === 'setup'} 
          isTransitioning={isTransitioning} 
          isStarted={isStarted} 
          hero={hero} 
          friend={friend} 
          antagonist={antagonist} 
          extraCast={extraCast} 
          selectedGenre={selectedGenre} 
          selectedPlot={selectedPlot} 
          selectedLanguage={selectedLanguage} 
          customPremise={customPremise} 
          coverPrompt={coverPrompt} 
          issueNumber={issueNumber} 
          richMode={richMode} 
          comicTitle={comicTitle} 
          comicSubtitle={comicSubtitle} 
          publisher={publisher} 
          previousIssueRefs={previousIssueRefs} 
          selectedResolution={selectedResolution} 
          selectedAspectRatio={selectedAspectRatio}
          savedLocations={savedLocations} 
          propsList={propsList} 
          onUpdateCastMember={updateCastMember} 
          onAddCastMember={addCastMember} 
          onRemoveCastMember={removeCastMember} 
          onGenreChange={setSelectedGenre} 
          onPlotChange={setSelectedPlot} 
          onLanguageChange={setSelectedLanguage} 
          onPremiseChange={setCustomPremise} 
          onCoverPromptChange={setCoverPrompt} 
          onIssueNumberChange={setIssueNumber} 
          onRichModeChange={setRichMode} 
          onComicTitleChange={setComicTitle} 
          onComicSubtitleChange={setComicSubtitle} 
          onPublisherChange={setPublisher} 
          onPreviousIssueRefsChange={setPreviousIssueRefs} 
          onResolutionChange={setSelectedResolution} 
          onAspectRatioChange={setSelectedAspectRatio}
          onLaunch={launchStory} 
          onClose={() => isStarted ? setViewMode('studio') : setViewMode('landing')} 
          onSaveConfig={handleSaveConfig} 
          onLoadConfig={handleLoadConfig} 
          fileToBase64={fileToBase64} 
          onEnhanceText={handleEnhanceText} 
          onAddLocation={handleAddLocation} 
          onUpdateLocation={handleUpdateLocation} 
          onDeleteLocation={handleDeleteLocation} 
          borderColor={borderColor} 
          onBorderColorChange={setBorderColor} 
          onAddProp={handleAddProp} 
          onUpdateProp={handleUpdateProp} 
          onDeleteProp={handleDeleteProp} 
          onReset={handleFullReset} 
          onChangeApiKey={handleApiKeyDialogContinue} 
          onOpenCharacterLab={handleOpenCharacterLab} 
          imageModel={imageModel} 
          onImageModelChange={setImageModel} 
          appLanguage={appLanguage} 
          onAppLanguageChange={setAppLanguage}
          showOverlays={showOverlays} 
          onShowOverlaysChange={setShowOverlays} 
          isMatureMode={isMatureMode} 
          onMatureModeChange={setIsMatureMode} 
          onHeroUpload={()=>{}} 
          onFriendUpload={()=>{}} 
          onAntagonistUpload={()=>{}} 
          onHeroUpdate={()=>{}} 
          onFriendUpdate={()=>{}} 
          onAntagonistUpdate={()=>{}} 
          onAddExtraCast={()=>{}} 
          onRemoveExtraCast={()=>{}} 
          onExtraCastUpdate={()=>{}} 
      />
      
      {(viewMode === 'studio' || viewMode === 'setup') && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${scale})`, transformOrigin: 'center center' }}>
            <div className="flex items-center justify-center min-h-full min-w-full p-20">
                  <Book comicFaces={comicFaces} currentSheetIndex={currentSheetIndex} totalPages={totalPages} isStarted={isStarted} isSetupVisible={viewMode === 'setup' && !isTransitioning} publisher={publisher} onSheetClick={handleEditPage} displayMode={displayMode} activeEditSide={activeEditSide} borderColor={borderColor} issueNumber={issueNumber} showOverlays={showOverlays} defaultAspectRatio={selectedAspectRatio} />
            </div>
        </div>
      )}

      {viewMode === 'studio' && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] bg-[#150711]/90 backdrop-blur-xl border border-[#3D1629] rounded-full p-1.5 flex gap-1 shadow-2xl">
              <button onClick={handlePrevSheet} disabled={currentSheetIndex <= 0} className="px-3.5 py-1 text-xs font-bold uppercase transition-colors font-sans text-[#8A6D7B] hover:text-[#FAF5F0] disabled:opacity-30 border-r border-[#3D1629] hover:bg-[#1B0A16] rounded-l-full">&lt;</button>
              <button onClick={() => setDisplayMode('single')} className={`px-4 py-1 text-xs font-bold uppercase transition-all font-sans rounded-full ${displayMode === 'single' ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>{labels.singleSpread}</button>
              <button onClick={() => setDisplayMode('double')} className={`px-4 py-1 text-xs font-bold uppercase transition-all font-sans rounded-full ${displayMode === 'double' ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>{labels.doubleSpread}</button>
              <button onClick={handleNextSheet} disabled={currentSheetIndex >= Math.ceil(totalPages/2)} className="px-3.5 py-1 text-xs font-bold uppercase transition-colors font-sans text-[#8A6D7B] hover:text-[#FAF5F0] disabled:opacity-30 border-l border-[#3D1629] hover:bg-[#1B0A16]">&gt;</button>
              <button onClick={handleRecenter} className={`ml-1 px-4 py-1 rounded-full text-xs font-bold uppercase transition-colors font-sans text-[#8A6D7B] hover:text-[#FAF5F0] border border-[#3D1629] hover:border-[#C68B59]`}>⌖ {labels.recenter}</button>
          </div>
      )}
      
      {viewMode === 'studio' && !movieModeUrlList && (
        <div onPointerDown={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()} style={{ width: sidebarWidth }} className="fixed right-0 top-0 bottom-0 bg-[#150711]/95 backdrop-blur-2xl text-[#FAF5F0] border-l border-[#3D1629] z-[60] shadow-2xl flex flex-col font-sans cursor-auto select-none">
            <div onPointerDown={handleSidebarResizeStart} className="absolute left-0 top-0 bottom-0 w-4 -ml-2 cursor-col-resize z-50 hover:bg-[#C68B59]/30 flex items-center justify-center group"><div className="h-12 w-1 bg-[#3D1629] group-hover:bg-[#C68B59] rounded"></div></div>
            <div className="flex bg-[#13060E] border-b border-[#3D1629] p-1.5 gap-1">
                <button onClick={() => setStudioMode('editor')} className={`flex-1 py-2 text-xs uppercase font-bold transition-all font-sans rounded-xl ${studioMode === 'editor' ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>📝 {labels.studioEditor}</button>
                <button onClick={() => setStudioMode('refiner')} className={`flex-1 py-2 text-xs uppercase font-bold transition-all font-sans rounded-xl ${studioMode === 'refiner' ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>🎨 {labels.imageRefiner}</button>
                <button onClick={() => setStudioMode('veo')} className={`flex-1 py-2 text-xs uppercase font-bold transition-all font-sans rounded-xl ${studioMode === 'veo' ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>🎥 {labels.veoAnimator}</button>
                <button onClick={() => setStudioMode('prompt-lab')} className={`flex-1 py-2 text-xs uppercase font-bold transition-all font-sans rounded-xl ${studioMode === 'prompt-lab' ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>🔬 {labels.promptLab}</button>
            </div>

            <div className="bg-[#150711] p-3 border-b border-[#3D1629]">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm tracking-widest text-[#C68B59] font-bold uppercase font-sans">
                        {studioMode === 'editor' ? (isCoverPage ? 'COVER CONFIG' : labels.pageConfig) : 
                         studioMode === 'refiner' ? labels.refineStation : 
                         studioMode === 'veo' ? labels.animationStation : 
                         labels.promptDebugger}
                    </h2>
                    <button onClick={() => setViewMode('setup')} className="text-xs bg-[#1B0A16] hover:bg-[#2A0E20] px-3 py-1.5 rounded-full border border-[#3D1629] hover:border-[#C68B59] font-sans font-bold text-[#FAF5F0] transition-colors">⚙ {labels.settings}</button>
                </div>
                <div className="flex gap-2 items-center bg-[#1B0A16] p-2 rounded-xl border border-[#3D1629]"><span className="text-xs text-[#8A6D7B] font-sans font-bold">{labels.jumpTo}</span><select value={activePageIndex} onChange={(e) => jumpToPage(parseInt(e.target.value))} className="bg-[#150711] text-[#FAF5F0] border border-[#3D1629] text-xs flex-1 cursor-pointer font-sans font-bold p-1.5 rounded-lg focus:outline-none"><option value={0}>{labels.cover}</option>{Array.from({length: totalPages}).map((_, i) => <option key={i+1} value={i+1}>{labels.page} {i+1}</option>)}<option value={totalPages + 1} className="text-[#DF9E65] font-bold">+ {labels.newPage} {totalPages + 1}</option></select></div>
            </div>
            
            {(studioMode === 'editor' || studioMode === 'refiner') && (
                <div className="flex items-center gap-2 p-2.5 bg-[#13060E] border-b border-[#3D1629]">
                     <span className="text-[10px] font-bold text-[#8A6D7B] uppercase font-sans">{labels.model}</span>
                     <button onClick={() => setImageModel('gemini-nano-banana-2.1')} className={`text-[10px] px-3 py-1 rounded-full font-sans font-bold transition-all ${imageModel === 'gemini-nano-banana-2.1' ? 'bg-[#2A0E20] text-[#DF9E65] border border-[#C68B59]' : 'bg-[#150711] text-[#8A6D7B] border border-[#3D1629]'}`}>NANO BANANA 2.1 (HQ)</button>
                     <button onClick={() => setImageModel('gemini-3.1-flash-lite-image')} className={`text-[10px] px-3 py-1 rounded-full font-sans font-bold transition-all ${imageModel === 'gemini-3.1-flash-lite-image' ? 'bg-[#2A0E20] text-[#DF9E65] border border-[#C68B59]' : 'bg-[#150711] text-[#8A6D7B] border border-[#3D1629]'}`}>FLASH LITE (FAST)</button>
                </div>
            )}
            
            <div className="flex border-b border-[#3D1629] bg-[#13060E] p-1 gap-1">
                {currentSheetIndex > 0 && (<button onClick={() => setActiveEditSide('left')} className={`flex-1 py-2 text-xs uppercase font-bold transition-all font-sans rounded-lg ${activeEditSide === 'left' ? 'bg-[#3D1629] text-[#FAF5F0]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>{labels.page} {leftPageIndex}</button>)}
                <button onClick={() => setActiveEditSide('right')} className={`flex-1 py-2 text-xs uppercase font-bold transition-all font-sans rounded-lg ${activeEditSide === 'right' ? 'bg-[#3D1629] text-[#FAF5F0]' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>{rightPageIndex === 0 ? labels.cover : `${labels.page} ${rightPageIndex}`}</button>
            </div>

            {studioMode === 'prompt-lab' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#150711] custom-scrollbar">
                    {!promptLabData ? (
                        <div className="border border-dashed border-[#3D1629] p-8 text-center text-[#8A6D7B] font-sans font-bold rounded-2xl bg-[#1B0A16]">NO PROMPT PREPARED. CLICK GENERATE IN EDITOR FIRST.</div>
                    ) : (
                        <>
                            <div className="bg-[#1B0A16] border border-[#3D1629] p-3 rounded-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[#C68B59] font-bold text-xs uppercase font-sans">{labels.payloadViewer} ({promptLabData.images.length} Images)</label>
                                    <label className="bg-[#2A0E20] border border-[#3D1629] px-2.5 py-1 text-[10px] text-[#FAF5F0] font-sans cursor-pointer hover:border-[#C68B59] rounded-full transition-colors">
                                        + {labels.addImage}
                                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                            if(e.target.files?.[0]) {
                                                const b64 = await processImageForApi(await fileToBase64(e.target.files[0]), 512);
                                                setPromptLabData({...promptLabData, images: [...promptLabData.images, { b64, label: "Manual Upload", type: 'context' }]});
                                            }
                                        }}/>
                                    </label>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {promptLabData.images.map((img, idx) => (
                                        <div key={idx} className="relative border border-[#3D1629] rounded-xl overflow-hidden group">
                                            <img src={`data:image/jpeg;base64,${img.b64}`} className="w-full h-24 object-cover" />
                                            <div className="absolute bottom-0 inset-x-0 bg-[#0E070C]/90 text-[9px] text-[#EADDE2] p-1 truncate font-sans">{idx}: {img.label}</div>
                                            <button onClick={() => {
                                                const newImages = promptLabData.images.filter((_, i) => i !== idx);
                                                setPromptLabData({...promptLabData, images: newImages});
                                            }} className="absolute top-1 right-1 bg-red-900/80 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs opacity-0 group-hover:opacity-100 hover:scale-110 transition-all">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="text-[#C68B59] font-bold text-xs uppercase mb-1 font-sans">{labels.textPrompt}</label>
                                <textarea 
                                    value={promptLabData.promptText} 
                                    onChange={(e) => setPromptLabData({...promptLabData, promptText: e.target.value})} 
                                    className="w-full h-64 bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-3 font-mono text-xs rounded-xl resize-none focus:outline-none focus:border-[#C68B59]"
                                />
                            </div>

                            <button onClick={() => executePromptLab()} className="w-full py-3.5 bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold text-base uppercase rounded-full shadow-[0_0_20px_rgba(198,139,89,0.3)] hover:brightness-110 active:scale-95 transition-all font-sans tracking-widest">
                                {activeFaceLoading ? "EXECUTING..." : labels.executePrompt}
                            </button>
                        </>
                    )}
                </div>
            )}

            {studioMode === 'editor' && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#150711] custom-scrollbar">
                        <div className="flex justify-between items-center">
                            <div className={`text-xs font-bold px-3 py-1 rounded-full font-sans border border-[#3D1629] uppercase tracking-wider ${activeFace ? 'bg-[#2A0E20] text-[#DF9E65]' : 'bg-[#1B0A16] text-[#8A6D7B]'}`}>{labels.status}: {activeFaceLoading ? labels.inking : activeFace ? labels.complete : labels.drafting}</div>
                             <div className="flex gap-1.5 items-center">
                                <span className="text-[10px] text-[#8A6D7B] font-bold uppercase font-sans">{labels.borders}</span>
                                <button onClick={() => setBorderColor('black')} className={`w-4 h-4 rounded-full border border-[#3D1629] bg-black ${borderColor === 'black' ? 'ring-2 ring-[#C68B59]' : ''}`}></button>
                                <button onClick={() => setBorderColor('white')} className={`w-4 h-4 rounded-full border border-[#3D1629] bg-white ${borderColor === 'white' ? 'ring-2 ring-[#C68B59]' : ''}`}></button>
                            </div>
                        </div>

                        {activeFace && activeFace.imageHistory && activeFace.imageHistory.length > 1 && (
                            <div className="flex items-center justify-between bg-[#1B0A16] border border-[#3D1629] p-2 rounded-xl gap-2">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => navigateImageHistory(-1)} disabled={(activeFace.historyIndex || 0) <= 0} className="text-[#8A6D7B] hover:text-[#FAF5F0] disabled:opacity-30 font-bold px-2">&lt;</button>
                                    <span className="text-[10px] font-bold text-[#EADDE2] font-sans">{labels.version} {(activeFace.historyIndex || 0) + 1} / {activeFace.imageHistory.length}</span>
                                    <button onClick={() => navigateImageHistory(1)} disabled={(activeFace.historyIndex || 0) >= activeFace.imageHistory.length - 1} className="text-[#8A6D7B] hover:text-[#FAF5F0] disabled:opacity-30 font-bold px-2">&gt;</button>
                                </div>
                                <button onClick={deleteImageFromHistory} className="text-red-400 hover:text-red-300 text-[10px] uppercase font-bold border border-red-900/50 px-2 py-0.5 rounded-lg hover:bg-red-900/20 font-sans" title="Delete this version">🗑️ DEL</button>
                            </div>
                        )}
                        
                        <div className="bg-[#1B0A16] border border-[#3D1629] p-3 rounded-2xl">
                            <div className="text-[#C68B59] text-[10px] font-bold uppercase mb-1 flex justify-between font-sans"><span>{labels.poseRef}</span><span className="text-[#8A6D7B]">Optional</span></div>
                            <div className="flex items-center gap-3"><div className="w-14 h-14 border border-[#3D1629] bg-[#0E070C] rounded-xl flex items-center justify-center overflow-hidden shrink-0">{compositionImage ? (<img src={`data:image/jpeg;base64,${compositionImage}`} className="w-full h-full object-cover" />) : (<span className="text-[9px] text-[#8A6D7B] text-center font-sans">No Ref</span>)}</div><div className="flex-1"><p className="text-[9px] text-[#8A6D7B] mb-1 font-sans">Influences structure/pose only.</p><div className="flex gap-2"><label className="bg-[#2A0E20] border border-[#3D1629] text-[#FAF5F0] text-[10px] px-2.5 py-1 rounded-full cursor-pointer hover:border-[#C68B59] font-bold uppercase font-sans transition-colors">{labels.uploadRef}<input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && setCompositionImage(await fileToBase64(e.target.files[0]))} /></label>{compositionImage && (<button onClick={() => setCompositionImage(null)} className="text-[10px] text-red-400 hover:text-red-300 underline font-sans">{labels.clear}</button>)}</div></div></div>
                        </div>

                        <div className="space-y-2 bg-zinc-800 p-3 border border-gray-700">
                             <div className="text-sm font-bold text-black uppercase bg-red-500 px-2 py-1 border border-black font-sans inline-block transform -skew-x-6">{labels.layoutConfig}</div>
                             <div className="grid grid-cols-2 gap-3">
                                 {!isCoverPage && (
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 font-sans">{labels.panelCount}</label>
                                        <input type="number" min="1" max="9" value={panelCount} onChange={(e) => setPanelCount(Math.max(1, Math.min(9, parseInt(e.target.value) || 1)))} className="w-full bg-black border border-gray-600 text-white text-center font-bold p-1 font-sans" />
                                    </div>
                                 )}
                                 <div className={isCoverPage ? 'col-span-2' : ''}>
                                     <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 font-sans">{isCoverPage ? 'Cover Layout Style' : labels.visualStyle}</label>
                                     <select value={layoutStyle} onChange={(e) => setLayoutStyle(e.target.value)} className="w-full border border-gray-600 p-1 bg-black text-white font-sans font-bold text-xs">
                                         {isCoverPage ? COVER_LAYOUT_STYLES.map(s => <option key={s} value={s}>{s}</option>) : LAYOUT_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                     </select>
                                 </div>
                             </div>
                             
                             {isCoverPage && (
                                 <div className="mt-2 border-t border-gray-700 pt-2">
                                    <div className="mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 font-sans">Title Placement</label>
                                        <div className="flex gap-2">
                                            <button onClick={() => setPublisher({...publisher, titlePlacement: 'top'})} className={`flex-1 py-1 text-[9px] font-bold uppercase border ${publisher.titlePlacement !== 'bottom' ? 'bg-white text-black' : 'bg-zinc-900 text-gray-500'}`}>Top</button>
                                            <button onClick={() => setPublisher({...publisher, titlePlacement: 'bottom'})} className={`flex-1 py-1 text-[9px] font-bold uppercase border ${publisher.titlePlacement === 'bottom' ? 'bg-white text-black' : 'bg-zinc-900 text-gray-500'}`}>Bottom</button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mb-2">
                                        <div className="flex-1">
                                             <span className="text-[10px] text-gray-500 block mb-1">Publisher Logo (Upload)</span>
                                             <div className="border border-gray-600 bg-black p-1 flex items-center justify-center relative group h-12 cursor-pointer hover:border-white">
                                                 {publisher.logoImage ? (
                                                     <>
                                                        <img src={`data:image/jpeg;base64,${publisher.logoImage}`} className="h-full object-contain" />
                                                        <button onClick={() => setPublisher({...publisher, logoImage: undefined})} className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-1 font-bold">X</button>
                                                     </>
                                                 ) : <span className="text-[9px] text-gray-500">+ Logo</span>}
                                                 <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { if(e.target.files?.[0]) { const b64 = await fileToBase64(e.target.files[0]); setPublisher({...publisher, logoImage: b64}); } }} />
                                             </div>
                                        </div>
                                        <div className="flex-1">
                                             <span className="text-[10px] text-gray-500 block mb-1">Title Art (Upload)</span>
                                             <div className="border border-gray-600 bg-black p-1 flex items-center justify-center relative group h-12 cursor-pointer hover:border-white">
                                                 {publisher.titleLogo ? (
                                                     <>
                                                        <img src={`data:image/jpeg;base64,${publisher.titleLogo}`} className="h-full object-contain" />
                                                        <button onClick={() => setPublisher({...publisher, titleLogo: undefined})} className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-1 font-bold">X</button>
                                                     </>
                                                 ) : <span className="text-[9px] text-gray-500">+ Title</span>}
                                                 <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { if(e.target.files?.[0]) { const b64 = await fileToBase64(e.target.files[0]); setPublisher({...publisher, titleLogo: b64}); } }} />
                                             </div>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 p-2 bg-black border border-gray-700 cursor-pointer mt-2">
                                        <input type="checkbox" checked={isTextlessCover} onChange={(e) => setIsTextlessCover(e.target.checked)} className="accent-red-500" />
                                        <span className="text-xs text-white font-bold font-sans">Generate Textless / Clean Art</span>
                                    </label>
                                 </div>
                             )}
                        </div>
                        
                        {!isCoverPage && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {editorPanels.map((_, idx) => (
                                    <button key={idx} onClick={() => setActivePanelTab(idx)} className={`flex-1 min-w-[80px] py-1 text-[10px] font-bold uppercase border-2 border-black transition-all font-sans ${activePanelTab === idx ? 'bg-yellow-500 text-black transform -translate-y-1' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}>Panel {idx + 1}</button>
                                ))}
                            </div>
                        )}

                        {activePanelData && (
                            <div className="border-2 border-gray-700 p-3 bg-zinc-800 rounded shadow-lg mt-1">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold bg-yellow-500 text-black px-2 py-0.5 border border-black font-sans">{isCoverPage ? 'COVER VISUALS' : `PANEL ${activePanelIdx + 1}`}</label>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase font-sans">{isCoverPage ? 'Art Instructions' : 'Action & Visuals'}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={async () => { setPanelEnhancingIdx(activePanelIdx); const enhanced = await handleEnhanceText(activePanelData.text, "comic book panel description"); const newArr = [...editorPanels]; newArr[activePanelIdx].previousText = newArr[activePanelIdx].text; newArr[activePanelIdx].text = enhanced; setEditorPanels(newArr); setPanelEnhancingIdx(null); }} disabled={panelEnhancingIdx === activePanelIdx || !activePanelData.text} className="text-[9px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-0.5 border border-purple-400 font-bold uppercase font-sans">{panelEnhancingIdx === activePanelIdx ? "..." : "✨ Enhance"}</button>
                                        {activePanelData.previousText && (<button onClick={() => { const newArr = [...editorPanels]; newArr[activePanelIdx].text = newArr[activePanelIdx].previousText!; newArr[activePanelIdx].previousText = undefined; setEditorPanels(newArr); }} className="text-[9px] bg-gray-600 hover:bg-gray-500 text-white px-2 py-0.5 border border-gray-400 font-bold uppercase font-sans">↩ Undo</button>)}
                                    </div>
                                </div>
                                <textarea value={activePanelData.text} onChange={(e) => { const newArr = [...editorPanels]; newArr[activePanelIdx].text = e.target.value; setEditorPanels(newArr); }} placeholder={isCoverPage ? "Describe the cover art..." : `Describe action for Panel ${activePanelIdx+1}...`} className="w-full h-32 border border-gray-600 p-3 text-sm font-sans mb-3 bg-black text-white placeholder-gray-600 focus:border-yellow-500 focus:outline-none" />
                                
                                <div className="mb-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 border-b border-gray-700 pb-1 font-sans">{labels.castInScene} {selectedCastCount > 5 && <span className="text-yellow-500 ml-2">{labels.charLimitWarn}</span>}</p>
                                    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 relative border border-zinc-700 bg-black/50" style={{ height: castListHeight }}>
                                        {allCast.map(p => { 
                                            const isChecked = activePanelData.castIds.includes(p.id); 
                                            const overrides = activePanelData.overrides?.[p.id] || { clothingMode: 'default', weaponMode: 'default' }; 
                                            return (
                                                <div key={p.id} className={`border px-3 py-3 transition-colors flex flex-col gap-2 font-sans ${isChecked ? 'bg-zinc-800 border-green-500' : 'bg-zinc-900 border-gray-800'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <input type="checkbox" className="w-5 h-5 accent-green-500 cursor-pointer" checked={isChecked} onChange={(e) => { const newArr = [...editorPanels]; if(e.target.checked) newArr[activePanelIdx].castIds = [...newArr[activePanelIdx].castIds, p.id]; else newArr[activePanelIdx].castIds = newArr[activePanelIdx].castIds.filter(cid => cid !== p.id); setEditorPanels(newArr); }} />
                                                        <div className="w-14 h-14 shrink-0 rounded bg-gray-800 overflow-hidden border border-gray-500">{p.base64 ? <img src={`data:image/jpeg;base64,${p.base64}`} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-700"/>}</div>
                                                        <div className="flex flex-col leading-tight"><span className="text-base font-bold text-white font-sans">{p.name}</span><span className="text-xs text-gray-400 uppercase font-sans">{p.role}</span></div>
                                                    </div>
                                                    {isChecked && (
                                                        <div className="pl-9 grid gap-2 pt-1 animate-in fade-in">
                                                            <div className="flex flex-col">
                                                                <select className="text-xs border border-gray-600 bg-black text-gray-300 p-1 font-sans" value={overrides.clothingMode} onChange={(e) => { const newArr = [...editorPanels]; if (!newArr[activePanelIdx].overrides) newArr[activePanelIdx].overrides = {}; newArr[activePanelIdx].overrides![p.id] = { ...overrides, clothingMode: e.target.value as any }; setEditorPanels(newArr); }}>
                                                                    <option value="default">Look: {p.clothing.substring(0, 20)}...</option>
                                                                    <option value="custom">Specific Look...</option>
                                                                </select>
                                                                {overrides.clothingMode === 'custom' && (<input type="text" className="mt-1 text-xs border border-yellow-600 p-1 w-full bg-zinc-800 text-yellow-200 placeholder-yellow-700 font-sans" placeholder="E.g. Torn battle armor..." value={overrides.clothingCustom || ""} onChange={(e) => { const newArr = [...editorPanels]; newArr[activePanelIdx].overrides![p.id].clothingCustom = e.target.value; setEditorPanels(newArr); }} />)}
                                                            </div>

                                                            <div className="flex flex-col mt-1">
                                                                <label className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">Weapon / Item</label>
                                                                <select 
                                                                    className="w-full text-xs border border-gray-600 bg-black text-gray-300 p-1 font-sans"
                                                                    value={overrides.selectedPropId || (overrides.weaponMode === 'none' ? 'none' : (overrides.weaponMode === 'custom' ? 'custom' : 'default'))}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        const newArr = [...editorPanels];
                                                                        if (!newArr[activePanelIdx].overrides) newArr[activePanelIdx].overrides = {};
                                                                        
                                                                        const current = newArr[activePanelIdx].overrides![p.id];
                                                                        let newOverride = { ...current };

                                                                        if (val === 'default') {
                                                                            newOverride = { ...current, weaponMode: 'default', selectedPropId: undefined };
                                                                        } else if (val === 'none') {
                                                                            newOverride = { ...current, weaponMode: 'none', selectedPropId: undefined };
                                                                        } else if (val === 'custom') {
                                                                            newOverride = { ...current, weaponMode: 'custom', selectedPropId: undefined };
                                                                        } else {
                                                                            newOverride = { ...current, weaponMode: 'specific', selectedPropId: val };
                                                                        }
                                                                        newArr[activePanelIdx].overrides![p.id] = newOverride;
                                                                        setEditorPanels(newArr);
                                                                    }}
                                                                >
                                                                    <option value="default">Default ({p.weapon || 'None'})</option>
                                                                    <option value="none">Empty Hands</option>
                                                                    <option value="custom">Custom Description...</option>
                                                                    {propsList.length > 0 && (
                                                                        <optgroup label="Armory & Props">
                                                                            {propsList.map(item => (
                                                                                <option key={item.id} value={item.id}>{item.name}</option>
                                                                            ))}
                                                                        </optgroup>
                                                                    )}
                                                                </select>
                                                                {overrides.weaponMode === 'custom' && (
                                                                     <input type="text" className="mt-1 text-xs border border-orange-600 p-1 w-full bg-zinc-800 text-orange-200 placeholder-orange-700 font-sans" placeholder="E.g. Holding a golden key..." value={overrides.weaponCustom || ""} onChange={(e) => { const newArr = [...editorPanels]; newArr[activePanelIdx].overrides![p.id].weaponCustom = e.target.value; setEditorPanels(newArr); }} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div onPointerDown={handleCastListResizeStart} className="h-4 bg-zinc-800 cursor-row-resize flex justify-center items-center border-t border-gray-600 hover:bg-zinc-700 transition-colors"><div className="w-10 h-1 bg-gray-500 rounded"></div></div>
                                </div>
                                {!isCoverPage && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 font-sans">{labels.locationOverride}</p>
                                        <select value={activePanelData.locationId || ""} onChange={(e) => { const newArr = [...editorPanels]; newArr[activePanelIdx].locationId = e.target.value || undefined; setEditorPanels(newArr); }} className="w-full text-xs p-2 border border-gray-600 bg-black text-white font-sans"><option value="">Same as Page / Continuity</option><option value="NA">N/A (Use Script Description)</option>{savedLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="space-y-2 mt-4 border-t border-gray-700 pt-4">
                            <label className="text-sm font-bold text-black uppercase bg-green-500 px-2 py-1 border border-black font-sans inline-block">Location Library (Quick Add)</label>
                            <div className="flex gap-2 items-center overflow-x-auto pb-2 custom-scrollbar mb-2">
                                {savedLocations.map(l => (
                                    <div key={l.id} onClick={() => handleLoadLocationForEdit(l)} className="shrink-0 w-16 h-16 border border-gray-600 relative group cursor-pointer">
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[8px] text-center p-1 text-gray-300 font-sans">{l.description?.substring(0,20)}...</div>
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[8px] text-white text-center p-1 transition-opacity font-sans">{l.name}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="border border-gray-600 p-2 bg-zinc-800">
                                {editingLocationId && <div className="text-xs text-yellow-400 font-bold mb-1 uppercase font-sans">EDITING: {savedLocations.find(l => l.id === editingLocationId)?.name}</div>}
                                <input placeholder="Location Name (e.g. Batcave)" value={newLocName} onChange={e => setNewLocName(e.target.value)} className="w-full text-xs p-1 mb-2 bg-black border border-gray-600 text-white font-sans" />
                                <div className="flex gap-2">
                                    <input placeholder="Description..." value={newLocDesc} onChange={e => setNewLocDesc(e.target.value)} className="flex-1 text-xs p-1 bg-black border border-gray-600 text-white font-sans" />
                                    <button onClick={() => { if(newLocName && newLocDesc) { const newLoc: LocationRef = { id: editingLocationId || Date.now().toString(), name: newLocName, type: 'text', description: newLocDesc }; if(editingLocationId) handleUpdateLocation(editingLocationId, newLoc); else handleAddLocation(newLoc); setNewLocName(""); setNewLocDesc(""); setEditingLocationId(null); } }} className="bg-green-600 text-white text-xs px-2 font-bold uppercase font-sans">{editingLocationId ? 'UPDATE' : 'ADD'}</button>
                                </div>
                                {editingLocationId && <button onClick={() => { setEditingLocationId(null); setNewLocName(""); setNewLocDesc(""); }} className="text-[9px] text-gray-400 hover:text-white mt-1 underline font-sans">CANCEL EDIT</button>}
                            </div>
                        </div>
                        
                        {activePageIsNew && (
                            <div className="flex flex-col gap-2 mt-4">
                                <button onClick={() => { setEditorPanels([{ text: "END_STORY", castIds: [] }]); handleExecuteFromEditor(); }} className="w-full border-2 border-dashed border-red-800 text-red-500 py-2 text-sm hover:bg-red-900/20 font-bold font-sans">⚠ END STORY HERE</button>
                                <button onClick={handleAddBackCover} className="w-full border-2 border-black bg-zinc-800 text-gray-400 py-2 text-sm hover:text-white font-bold font-sans hover:bg-zinc-700">📜 ADD CREDITS PAGE (BACK COVER)</button>
                            </div>
                        )}

                        {activePageIndex > 0 && (
                            <div className="mt-4 border-t border-gray-700 pt-4 pb-4">
                                <button onClick={handleDeletePage} className="w-full bg-red-900/20 border border-red-800 text-red-500 hover:bg-red-900/50 hover:text-white py-2 text-xs font-bold uppercase font-sans transition-colors">
                                    🗑️ Delete This Page ({activePageIndex})
                                </button>
                                <p className="text-[9px] text-gray-500 text-center mt-1 font-sans">Removes current page & renumbers subsequent pages.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 bg-[#13060E] border-t border-[#3D1629]">
                        {activeFaceLoading ? (
                             <button onClick={handleCancelGeneration} className="w-full text-base py-3 rounded-full border border-red-800 bg-red-950/60 text-red-200 animate-pulse uppercase tracking-widest font-sans font-bold hover:bg-red-900/50 transition-colors">⛔ STOP GENERATION</button>
                        ) : (
                            <button onClick={() => handleExecuteFromEditor(false)} className="w-full text-base py-3.5 rounded-full font-sans font-bold uppercase tracking-widest bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(198,139,89,0.3)]">{activeFace ? labels.regenerate : labels.generatePage}</button>
                        )}
                        <div className="flex gap-2 mt-3">
                            <label className="flex-1 block group"><div className="w-full bg-[#1B0A16] text-[#C68B59] text-[11px] py-2 border border-[#3D1629] rounded-full group-hover:border-[#C68B59] group-hover:text-[#FAF5F0] font-sans font-bold uppercase tracking-wider transition-colors text-center cursor-pointer">♻ {labels.replaceImg}</div><input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleReplacePageImage(e.target.files[0])} /></label>
                            <button onClick={downloadSinglePage} disabled={!activeFace?.imageUrl} className="flex-1 bg-[#1B0A16] text-[#FAF5F0] text-[11px] py-2 border border-[#3D1629] rounded-full hover:border-[#C68B59] font-sans font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed">{labels.dlPage}</button>
                            <button onClick={() => setShowDownloadModal(true)} className="flex-1 bg-[#1B0A16] text-[#DF9E65] text-[11px] py-2 border border-[#3D1629] rounded-full hover:border-[#C68B59] font-sans font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed">{labels.dlMulti}</button>
                        </div>
                    </div>
                </>
            )}

            {studioMode === 'refiner' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#150711] custom-scrollbar">
                    <div className="bg-[#1B0A16] p-4 border border-[#3D1629] rounded-2xl">
                        <h3 className="text-sm font-bold text-[#C68B59] uppercase mb-4 tracking-wider border-b border-[#3D1629] pb-2 font-sans">Image Refiner</h3>
                        {activeFace?.imageUrl ? (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-[#EADDE2] uppercase font-sans">{labels.instruction}</label>
                                        <div className="flex gap-1">
                                            {lastRefinePrompt && (
                                                <button onClick={() => setRefineInstruction(lastRefinePrompt)} className="text-[10px] bg-[#2A0E20] hover:bg-[#3D1629] text-[#FAF5F0] px-2 py-0.5 border border-[#3D1629] rounded-full font-bold uppercase font-sans">↺ Previous</button>
                                            )}
                                            <button onClick={() => setRefineInstruction("")} className="text-[10px] bg-red-950/40 hover:bg-red-900/40 text-red-300 px-2 py-0.5 border border-red-900/50 rounded-full font-bold uppercase font-sans">Clear</button>
                                        </div>
                                    </div>
                                    <textarea value={refineInstruction} onChange={(e) => setRefineInstruction(e.target.value)} placeholder="Describe the change..." className="w-full h-28 border border-[#3D1629] bg-[#0E070C] text-[#FAF5F0] rounded-xl text-xs p-3 font-sans focus:outline-none focus:border-[#C68B59]" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#8A6D7B] uppercase block mb-2 font-sans">Relevant Cast</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-[#3D1629] bg-[#0E070C] p-2 rounded-xl custom-scrollbar">{allCast.map(p => (<label key={p.id} className="flex items-center gap-2 text-[10px] text-[#EADDE2] cursor-pointer font-sans"><input type="checkbox" checked={refineCastIds.includes(p.id)} onChange={e => { 
                                        if(e.target.checked) {
                                            setRefineCastIds(prev => [...prev, p.id]);
                                            setRefineUseCharRefs(true); 
                                        } else {
                                            setRefineCastIds(prev => prev.filter(id => id !== p.id));
                                        }
                                    }} className="accent-[#C68B59]" />{p.name}</label>))}</div>
                                </div>
                                <div className="bg-[#150711] p-3 border border-[#3D1629] rounded-xl">
                                    <label className="text-[10px] font-bold text-[#C68B59] uppercase block mb-2 font-sans">Reference Injection</label>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 text-xs text-[#EADDE2] font-sans font-bold"><input type="checkbox" checked={refineUseCharRefs} onChange={e => setRefineUseCharRefs(e.target.checked)} className="accent-[#C68B59]" disabled={refineCastIds.length === 0} /> Inject Character Sheets/Faces (Selected Cast)</label>
                                        <label className="flex items-center gap-2 text-xs text-[#EADDE2] font-sans font-bold"><input type="checkbox" checked={refineUsePropRefs} onChange={e => setRefineUsePropRefs(e.target.checked)} className="accent-[#C68B59]" disabled={refineCastIds.length === 0} /> Inject Weapons/Props (Selected Cast)</label>
                                        <label className="flex items-center gap-2 text-xs text-[#EADDE2] font-sans font-bold"><input type="checkbox" checked={refineUseLocRefs} onChange={e => setRefineUseLocRefs(e.target.checked)} className="accent-[#C68B59]" /> Inject Location Description</label>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-3 border-t border-[#3D1629]">
                                    {activeFaceLoading ? (<button onClick={handleCancelGeneration} className="w-full py-3 bg-red-950/50 text-red-200 border border-red-800 rounded-full animate-pulse font-bold font-sans uppercase">⛔ STOP REFINE</button>) : (<button onClick={() => handleExecuteFromEditor(true)} disabled={!refineInstruction} className="w-full bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] text-xs py-3 font-bold font-sans uppercase tracking-wider rounded-full hover:brightness-110 active:scale-95 transition-all disabled:opacity-40">{labels.applyEdit}</button>)}
                                </div>
                            </div>
                        ) : (<div className="text-center py-10 text-[#8A6D7B] font-bold border border-dashed border-[#3D1629] rounded-2xl font-sans">GENERATE AN IMAGE FIRST TO EDIT.</div>)}
                    </div>
                </div>
            )}

            {studioMode === 'veo' && (
                <div className="flex-1 flex flex-col bg-[#150711] p-5 overflow-y-auto custom-scrollbar">
                    <button onClick={startMovieMode} className="w-full mb-4 bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] text-xs py-3 font-bold rounded-full hover:brightness-110 font-sans uppercase tracking-widest shadow-[0_0_20px_rgba(198,139,89,0.25)] transition-all active:scale-95">🍿 {labels.playMovie}</button>
                    <div className="bg-[#1B0A16] border border-[#3D1629] p-4 rounded-2xl mb-4">
                        <h3 className="text-[#C68B59] font-bold text-sm mb-1 uppercase font-sans">Motion Director</h3>
                        <p className="text-[#8A6D7B] text-xs font-sans mb-3">Instruct Veo on how to animate this page.</p>
                        {activeFace?.imageUrl ? (
                             <div className="flex flex-col gap-3">
                                 <textarea value={veoPrompt} onChange={e => setVeoPrompt(e.target.value)} placeholder="Describe movement..." className="w-full h-28 bg-[#0E070C] border border-[#3D1629] rounded-xl p-3 text-xs text-[#FAF5F0] font-sans focus:outline-none focus:border-[#C68B59]"/>
                                 {activeFace.videoUrl ? (
                                     <div className="space-y-3"><div className="bg-[#0E070C] border border-[#3D1629] p-2 rounded-xl"><div className="text-[#DF9E65] text-xs font-bold mb-1 uppercase font-sans">PREVIEW:</div><video src={activeFace.videoUrl} controls autoPlay loop className="w-full h-auto border border-[#3D1629] rounded-lg" /></div><button onClick={() => updateFaceState(activeFace.id, { videoUrl: undefined })} className="w-full py-2 bg-[#2A0E20] text-red-300 border border-red-900/50 hover:bg-red-900/30 text-xs font-bold uppercase font-sans rounded-full">{labels.discardVideo}</button></div>
                                 ) : (
                                     <button onClick={() => generatePageVideo(activePageIndex, veoPrompt)} disabled={activeFace.isVideoLoading} className={`w-full py-3 text-xs font-bold uppercase rounded-full transition-all font-sans tracking-wider ${activeFace.isVideoLoading ? 'bg-[#2A0E20] text-[#8A6D7B]' : 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] hover:brightness-110 active:scale-95'}`}>{activeFace.isVideoLoading ? 'GENERATING...' : labels.generateAnim}</button>
                                 )}
                             </div>
                        ) : (<div className="text-center py-10 text-[#8A6D7B] font-bold border border-dashed border-[#3D1629] rounded-2xl font-sans">GENERATE A STATIC PAGE IMAGE FIRST.</div>)}
                    </div>
                </div>
            )}
        </div>
      )}

      {movieModeUrlList && (
          <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-4">
               <video src={movieModeUrlList[currentMovieIndex]} autoPlay controls className="max-h-[80vh] border-4 border-yellow-400" onEnded={() => currentMovieIndex < movieModeUrlList.length - 1 && setCurrentMovieIndex(prev => prev+1)} />
               <button onClick={() => setMovieModeUrlList(null)} className="mt-4 text-red-500 border border-red-500 px-4 py-2 hover:bg-red-900 font-sans font-bold">EXIT</button>
          </div>
      )}

      <AtlasFooter compact={viewMode === 'studio'} />
    </div>
  );
};

export default App;
