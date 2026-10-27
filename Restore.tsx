import React, { useState } from 'react';
import { Persona, ComicFace, GENRES, AppLanguage, UI_LABELS } from './types';
import { AtlasBackground, AtlasFooter } from './AtlasBackgroundAndFooter';

interface RestoreProps {
    onBack: () => void;
    onRestore: (
        hero: Persona, 
        friend: Persona | null, 
        antagonist: Persona | null, 
        comicFaces: ComicFace[],
        totalPages: number,
        config: any
    ) => void;
    appLanguage: AppLanguage;
}

export const Restore: React.FC<RestoreProps> = ({ onBack, onRestore, appLanguage }) => {
    const labels = UI_LABELS[appLanguage];

    // Config State (Editable)
    const [loadedConfig, setLoadedConfig] = useState<any>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editSubtitle, setEditSubtitle] = useState(""); 
    const [editGenre, setEditGenre] = useState("");
    const [editIssue, setEditIssue] = useState("");
    const [editPublisher, setEditPublisher] = useState("");
    const [editPlot, setEditPlot] = useState("");
    const [editResolution, setEditResolution] = useState("");

    // Restored Data State
    const [restoredHeroB64, setRestoredHeroB64] = useState<string | null>(null);
    const [restoredFriendB64, setRestoredFriendB64] = useState<string | null>(null);
    const [restoredAntagonistB64, setRestoredAntagonistB64] = useState<string | null>(null);
    const [restoredExtraCast, setRestoredExtraCast] = useState<Record<string, string | null>>({}); 
    
    const [restoredHeroSheetB64, setRestoredHeroSheetB64] = useState<string | null>(null);
    const [restoredFriendSheetB64, setRestoredFriendSheetB64] = useState<string | null>(null);
    const [restoredAntagonistSheetB64, setRestoredAntagonistSheetB64] = useState<string | null>(null);
    const [restoredExtraCastSheets, setRestoredExtraCastSheets] = useState<Record<string, string | null>>({});

    const [restoredPages, setRestoredPages] = useState<ComicFace[]>([]);
    const [restoredPageOverrides, setRestoredPageOverrides] = useState<Record<string, File | null>>({});

    // Cast State (Manual Overrides)
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [friendFile, setFriendFile] = useState<File | null>(null);
    const [antagonistFile, setAntagonistFile] = useState<File | null>(null);
    const [extraCastFiles, setExtraCastFiles] = useState<Record<string, File | null>>({});
    
    const [heroSheetFile, setHeroSheetFile] = useState<File | null>(null);
    const [friendSheetFile, setFriendSheetFile] = useState<File | null>(null);
    const [antagonistSheetFile, setAntagonistSheetFile] = useState<File | null>(null);
    const [extraCastSheetFiles, setExtraCastSheetFiles] = useState<Record<string, File | null>>({});
    
    // Pages State
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pages, setPages] = useState<{idx: number, file: File | null}[]>([{idx: 1, file: null}]);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
    };

    const cleanSavedBase64 = (data: string | undefined): string | null => {
        if (!data || typeof data !== 'string' || data.length < 10) return null;
        if (data.includes(',')) {
            return data.split(',')[1];
        }
        return data;
    };

    const handleConfigLoad = async (file: File) => {
        const text = await file.text();
        try {
            const json = JSON.parse(text);
            setLoadedConfig(json);
            
            setEditTitle(json.comicTitle || "");
            setEditSubtitle(json.comicSubtitle || ""); 
            setEditGenre(json.selectedGenre || "");
            setEditIssue(json.issueNumber || "");
            setEditPublisher(json.publisher?.name || "");
            setEditPlot(json.customPremise || json.selectedPlot || "");
            setEditResolution(json.selectedResolution || "1K");

            if (json.hero?.base64) setRestoredHeroB64(cleanSavedBase64(json.hero.base64));
            if (json.hero?.characterSheet) setRestoredHeroSheetB64(cleanSavedBase64(json.hero.characterSheet));
            
            if (json.friend?.base64) setRestoredFriendB64(cleanSavedBase64(json.friend.base64));
            if (json.friend?.characterSheet) setRestoredFriendSheetB64(cleanSavedBase64(json.friend.characterSheet));
            
            if (json.antagonist?.base64) setRestoredAntagonistB64(cleanSavedBase64(json.antagonist.base64));
            if (json.antagonist?.characterSheet) setRestoredAntagonistSheetB64(cleanSavedBase64(json.antagonist.characterSheet));

            if (json.extraCast && Array.isArray(json.extraCast)) {
                const initialExtras: Record<string, File | null> = {};
                const initialExtraSheets: Record<string, File | null> = {};
                const restoredExtrasMap: Record<string, string | null> = {};
                const restoredExtraSheetsMap: Record<string, string | null> = {};
                
                json.extraCast.forEach((p: any) => {
                    if (p.id) {
                        initialExtras[p.id] = null;
                        initialExtraSheets[p.id] = null;
                        if (p.base64) restoredExtrasMap[p.id] = cleanSavedBase64(p.base64);
                        if (p.characterSheet) restoredExtraSheetsMap[p.id] = cleanSavedBase64(p.characterSheet);
                    }
                });
                setExtraCastFiles(initialExtras);
                setExtraCastSheetFiles(initialExtraSheets);
                setRestoredExtraCast(restoredExtrasMap);
                setRestoredExtraCastSheets(restoredExtraSheetsMap);
            }

            if (json.comicFaces && Array.isArray(json.comicFaces) && json.comicFaces.length > 0) {
                 setRestoredPages(json.comicFaces);
                 const maxIdx = Math.max(...json.comicFaces.map((f:any) => f.pageIndex || 0));
                 setPages([{idx: maxIdx + 1, file: null}]); 
            } else {
                 setPages([{idx: 1, file: null}]);
            }

        } catch (e) {
            alert("Invalid config file");
        }
    };

    const handleAddPageSlot = () => {
        const maxRestoredIdx = restoredPages.length > 0 
             ? Math.max(...restoredPages.map(p => p.pageIndex || 0)) 
             : 0;
        
        const lastManualIdx = pages.length > 0 ? pages[pages.length - 1].idx : 0;
        const nextIdx = Math.max(maxRestoredIdx, lastManualIdx) + 1;
        
        setPages([...pages, {idx: nextIdx, file: null}]);
    };

    const handleFinish = async () => {
        const hasHero = !!heroFile || !!restoredHeroB64;
        const restoredCover = restoredPages.find(p => p.type === 'cover');
        const hasCover = !!coverFile || !!restoredCover;

        if (!hasHero || !loadedConfig || !hasCover) {
            alert("Missing required fields (Config, Hero Image, or Cover Image).");
            return;
        }

        const finalConfig = {
            ...loadedConfig,
            comicTitle: editTitle,
            comicSubtitle: editSubtitle,
            selectedGenre: editGenre,
            issueNumber: editIssue,
            publisher: { ...loadedConfig.publisher, name: editPublisher },
            customPremise: editPlot,
            selectedResolution: editResolution
        };

        let heroB64 = restoredHeroB64 || "";
        if (heroFile) heroB64 = await fileToBase64(heroFile);
        let heroSheet = restoredHeroSheetB64 || undefined;
        if (heroSheetFile) heroSheet = await fileToBase64(heroSheetFile);
        const hero: Persona = { ...finalConfig.hero, base64: heroB64, characterSheet: heroSheet, id: 'hero' };

        let friend: Persona | null = null;
        if (friendFile || restoredFriendB64) {
             let fb64 = restoredFriendB64 || "";
             if (friendFile) fb64 = await fileToBase64(friendFile);
             let fSheet = restoredFriendSheetB64 || undefined;
             if (friendSheetFile) fSheet = await fileToBase64(friendSheetFile);
             friend = { ...finalConfig.friend, base64: fb64, characterSheet: fSheet, id: 'friend' };
        }

        let antagonist: Persona | null = null;
        if (antagonistFile || restoredAntagonistB64) {
             let ab64 = restoredAntagonistB64 || "";
             if (antagonistFile) ab64 = await fileToBase64(antagonistFile);
             let aSheet = restoredAntagonistSheetB64 || undefined;
             if (antagonistSheetFile) aSheet = await fileToBase64(antagonistSheetFile);
             antagonist = { ...finalConfig.antagonist, base64: ab64, characterSheet: aSheet, id: 'antagonist' };
        }

        const restoredExtraCastList: Persona[] = [];
        if (finalConfig.extraCast && Array.isArray(finalConfig.extraCast)) {
            for (const p of finalConfig.extraCast) {
                const file = extraCastFiles[p.id];
                const restoredB64 = restoredExtraCast[p.id];
                let b64 = restoredB64 || "";
                if (file) b64 = await fileToBase64(file);
                
                const sheetFile = extraCastSheetFiles[p.id];
                const restoredSheet = restoredExtraCastSheets[p.id];
                let sheetB64 = restoredSheet || undefined;
                if (sheetFile) sheetB64 = await fileToBase64(sheetFile);

                restoredExtraCastList.push({ ...p, base64: b64, characterSheet: sheetB64 });
            }
        }
        finalConfig.extraCast = restoredExtraCastList;

        const faces: ComicFace[] = [];
        
        if (coverFile) {
            const coverB64 = await fileToBase64(coverFile);
            faces.push({
                id: 'page-0',
                type: 'cover',
                pageIndex: 0,
                imageUrl: `data:image/jpeg;base64,${coverB64}`,
                isLoading: false,
                choices: [],
                narrative: restoredCover ? restoredCover.narrative : { scene: finalConfig.coverPrompt || "Restored Cover", choices: [], focus_char: 'hero' },
                panelsData: restoredCover ? restoredCover.panelsData : undefined,
                layoutStyle: restoredCover ? restoredCover.layoutStyle : undefined,
                isTextless: restoredCover?.isTextless
            });
        } else if (restoredCover) {
            faces.push(restoredCover);
        }

        for (const p of restoredPages) {
            if (p.type === 'cover') continue;

            let finalUrl = p.imageUrl;
            
            if (restoredPageOverrides[p.id]) {
                const b64 = await fileToBase64(restoredPageOverrides[p.id]!);
                finalUrl = `data:image/jpeg;base64,${b64}`;
            }

            faces.push({
                ...p,
                imageUrl: finalUrl,
                panelsData: p.panelsData || [],
                panelCount: p.panelCount,
                layoutStyle: p.layoutStyle
            });
        }

        for (const p of pages) {
            if (p.file) {
                const b64 = await fileToBase64(p.file);
                const existingIdx = faces.findIndex(f => f.pageIndex === p.idx);
                if (existingIdx !== -1) faces.splice(existingIdx, 1);
                
                faces.push({
                    id: `page-${p.idx}`,
                    type: 'story',
                    pageIndex: p.idx,
                    imageUrl: `data:image/jpeg;base64,${b64}`,
                    isLoading: false,
                    choices: [],
                    narrative: { scene: `Restored Page ${p.idx}`, choices: [], focus_char: 'hero' },
                    panelsData: [{ text: `Restored Page ${p.idx}`, castIds: [] }]
                });
            }
        }

        faces.sort((a,b) => (a.pageIndex || 0) - (b.pageIndex || 0));
        const totalPagesCount = faces.length > 0 ? Math.max(...faces.map(f => f.pageIndex || 0)) : 0;

        onRestore(hero, friend, antagonist, faces, totalPagesCount, finalConfig);
    };

    const RenderCharacterSlots = (
        title: string, 
        name: string,
        mainFile: File | null, 
        restoredMain: string | null, 
        setMainFile: (f: File) => void,
        sheetFile: File | null,
        restoredSheet: string | null,
        setSheetFile: (f: File) => void
    ) => (
        <div className="bg-[#150711] border border-[#3D1629] rounded-2xl p-4 transition-all">
            <div className="flex justify-between items-center border-b border-[#3D1629] pb-2 mb-3">
                <span className="font-bold text-sm text-[#FAF5F0] uppercase tracking-wider">{title}</span>
                <span className="bg-[#2A0E20] text-[#DF9E65] text-xs px-2.5 py-1 rounded-full font-bold">{name || "Unknown"}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <div className="text-[10px] text-[#8A6D7B] font-bold uppercase mb-1 font-sans">Face Ref</div>
                    <label className="cursor-pointer block">
                        <div className="w-full h-28 border border-[#3D1629] bg-[#1B0A16] rounded-xl flex items-center justify-center overflow-hidden relative hover:border-[#C68B59]/40 transition-colors">
                            {mainFile ? (
                                <span className="text-[#C68B59] font-bold text-xs font-sans text-center">✓ {labels.uploadReady}</span>
                            ) : restoredMain ? (
                                <img src={`data:image/jpeg;base64,${restoredMain}`} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[#8A6D7B] font-bold uppercase text-[10px] font-sans text-center">{labels.clickReplace}</span>
                            )}
                            {restoredMain && !mainFile && (
                                <div className="absolute bottom-0 inset-x-0 bg-[#2A0E20] text-[#DF9E65] text-[9px] font-bold text-center py-0.5">✓ LOADED</div>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setMainFile(e.target.files[0])} className="hidden" />
                    </label>
                </div>

                <div>
                    <div className="text-[10px] text-[#8A6D7B] font-bold uppercase mb-1 font-sans">Sheet (Optional)</div>
                    <label className="cursor-pointer block">
                        <div className="w-full h-28 border border-[#3D1629] bg-[#1B0A16] rounded-xl flex items-center justify-center overflow-hidden relative hover:border-[#C68B59]/40 transition-colors">
                            {sheetFile ? (
                                <span className="text-[#DF9E65] font-bold text-xs font-sans text-center">✓ {labels.uploadReady}</span>
                            ) : restoredSheet ? (
                                <img src={`data:image/jpeg;base64,${restoredSheet}`} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[#8A6D7B] font-bold uppercase text-[10px] font-sans text-center">{labels.uploadRef}</span>
                            )}
                            {restoredSheet && !sheetFile && (
                                <div className="absolute bottom-0 inset-x-0 bg-[#2A0E20] text-[#DF9E65] text-[9px] font-bold text-center py-0.5">✓ LOADED</div>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setSheetFile(e.target.files[0])} className="hidden" />
                    </label>
                </div>
            </div>
        </div>
    );

    const hasRestoredCover = restoredPages.some(p => p.type === 'cover');
    const isReady = !!heroFile || !!restoredHeroB64;
    const isCoverReady = !!coverFile || hasRestoredCover;

    return (
        <div className="fixed inset-0 bg-[#0E070C] text-[#FAF5F0] z-[250] overflow-y-auto select-none font-sans">
            <AtlasBackground />

            <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10 pb-32">
                <div className="flex justify-between items-center mb-8 border-b border-[#3D1629] pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-[#FAF5F0] tracking-wide mb-1">
                            {labels.restoreSession}
                        </h1>
                        <p className="text-xs text-[#8A6D7B] uppercase tracking-wider">Atlas XXIII Blueprint & Asset Restoration</p>
                    </div>
                    <button 
                        onClick={onBack} 
                        className="bg-[#150711] border border-[#3D1629] text-[#FAF5F0] hover:border-[#C68B59]/50 px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-all"
                    >
                        {labels.cancelMission}
                    </button>
                </div>

                <div className="grid gap-8">
                    {/* STEP 1: CONFIG */}
                    <div className="bg-[#150711]/95 border border-[#3D1629] rounded-[24px] p-6 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#DF9E65]" />
                            <h2 className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">{labels.step1Title}</h2>
                        </div>
                        
                        {!loadedConfig ? (
                            <label className="block w-full border border-dashed border-[#3D1629] hover:border-[#C68B59]/50 bg-[#1B0A16] rounded-2xl p-8 text-center cursor-pointer transition-colors group">
                                <span className="text-sm font-bold text-[#EADDE2] group-hover:text-[#DF9E65] inline-block transition-colors uppercase font-sans">📂 {labels.clickToSelect}</span>
                                <input 
                                    type="file" 
                                    accept=".json,.cbs" 
                                    onChange={(e) => e.target.files?.[0] && handleConfigLoad(e.target.files[0])} 
                                    className="hidden" 
                                />
                            </label>
                        ) : (
                            <div className="bg-[#1B0A16] border border-[#3D1629] rounded-2xl p-5">
                                <div className="flex justify-between items-center mb-4 border-b border-[#3D1629] pb-3">
                                    <h3 className="text-xs font-bold text-[#DF9E65] uppercase tracking-wider">{labels.editSpecs}</h3>
                                    <button onClick={() => setLoadedConfig(null)} className="text-[10px] bg-[#2A0E20] text-[#EADDE2] px-3 py-1 rounded-full font-bold border border-[#3D1629] hover:border-[#C68B59] uppercase">Change File</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-[#8A6D7B] uppercase">Title</label>
                                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="bg-[#150711] border border-[#3D1629] text-[#FAF5F0] rounded-xl p-2.5" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-[#8A6D7B] uppercase">Subtitle</label>
                                        <input value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} className="bg-[#150711] border border-[#3D1629] text-[#FAF5F0] rounded-xl p-2.5" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-[#8A6D7B] uppercase">Genre</label>
                                        <select value={editGenre} onChange={e => setEditGenre(e.target.value)} className="bg-[#150711] border border-[#3D1629] text-[#FAF5F0] rounded-xl p-2.5">
                                            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-[#8A6D7B] uppercase">Issue #</label>
                                        <input value={editIssue} onChange={e => setEditIssue(e.target.value)} className="bg-[#150711] border border-[#3D1629] text-[#FAF5F0] rounded-xl p-2.5" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 2: CAST */}
                    {loadedConfig && (
                        <div className="bg-[#150711]/95 border border-[#3D1629] rounded-[24px] p-6 shadow-2xl">
                             <div className="flex items-center gap-2 mb-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#DF9E65]" />
                                <h2 className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">{labels.step2Title}</h2>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {RenderCharacterSlots("HERO", loadedConfig.hero?.name, heroFile, restoredHeroB64, setHeroFile, heroSheetFile, restoredHeroSheetB64, setHeroSheetFile)}
                                 {loadedConfig.friend && RenderCharacterSlots("CO-STAR", loadedConfig.friend.name, friendFile, restoredFriendB64, setFriendFile, friendSheetFile, restoredFriendSheetB64, setFriendSheetFile)}
                                 {loadedConfig.antagonist && RenderCharacterSlots("VILLAIN", loadedConfig.antagonist.name, antagonistFile, restoredAntagonistB64, setAntagonistFile, antagonistSheetFile, restoredAntagonistSheetB64, setAntagonistSheetFile)}
                             </div>
                        </div>
                    )}

                    {/* STEP 3: PAGES */}
                    {loadedConfig && (
                        <div className="bg-[#150711]/95 border border-[#3D1629] rounded-[24px] p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#DF9E65]" />
                                <h2 className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">{labels.step3Title}</h2>
                            </div>
                            
                            <div className="space-y-3">
                                {restoredPages.filter(p => p.type === 'story').map((p) => (
                                    <div key={p.id} className="flex items-center justify-between p-3 bg-[#1B0A16] border border-[#3D1629] rounded-2xl text-xs">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-[#2A0E20] text-[#DF9E65] font-bold px-3 py-1 rounded-full">{labels.page} {p.pageIndex}</span>
                                            <span className="text-[#EADDE2] font-semibold">✓ {labels.restoredData}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#3D1629]">
                                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                ))}

                                <button onClick={handleAddPageSlot} className="w-full bg-[#13060E] border border-[#3D1629] hover:border-[#C68B59]/50 text-[#EADDE2] py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors">
                                    + {labels.addPageSlot}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleFinish}
                    disabled={!isReady || !loadedConfig || !isCoverReady}
                    className="w-full mt-10 bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] text-lg font-bold py-5 rounded-full shadow-[0_0_30px_rgba(198,139,89,0.35)] hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed font-sans"
                >
                    {!isReady || !loadedConfig ? labels.waitingData : labels.resumeProduction}
                </button>
            </div>

            <AtlasFooter />
        </div>
    );
};