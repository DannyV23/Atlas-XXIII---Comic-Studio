
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { GENRES, PLOT_OPTIONS, LANGUAGES, Persona, PublisherConfig, CAST_ROLES, CLOTHING_PRESETS, Resolution, AspectRatio, ASPECT_RATIOS, LocationRef, BorderColor, Prop, ImageModel, AppLanguage, UI_LABELS, APP_VERSION, TITLE_STYLES } from './types';
import { QuotaInfo } from './QuotaInfo';
import { AboutModal } from './AboutModal';
import { AtlasBackground, AtlasFooter } from './AtlasBackgroundAndFooter';

interface SetupProps {
    show: boolean;
    isTransitioning: boolean;
    isStarted: boolean; 
    hero: Persona | null;
    friend: Persona | null;
    antagonist: Persona | null;
    extraCast: Persona[];
    selectedGenre: string;
    selectedPlot: string;
    selectedLanguage: string;
    customPremise: string;
    coverPrompt: string;
    issueNumber: string; 
    richMode: boolean;
    comicTitle: string;
    comicSubtitle: string; 
    publisher: PublisherConfig;
    previousIssueRefs: string[]; 
    selectedResolution: Resolution;
    selectedAspectRatio: AspectRatio;
    savedLocations: LocationRef[];
    propsList: Prop[]; 
    borderColor: BorderColor;
    showOverlays: boolean;
    imageModel: ImageModel; 
    appLanguage: AppLanguage;
    isMatureMode: boolean; 
    
    onUpdateCastMember: (id: string, updates: Partial<Persona>) => void;
    onAddCastMember: (person: Persona) => void;
    onRemoveCastMember: (id: string) => void;

    onAddLocation: (loc: LocationRef) => void;
    onUpdateLocation: (id: string, updates: Partial<LocationRef>) => void;
    onDeleteLocation: (id: string) => void;
    
    onAddProp: (prop: Prop) => void;
    onUpdateProp: (id: string, updates: Partial<Prop>) => void;
    onDeleteProp: (id: string) => void;
    
    onBorderColorChange: (val: BorderColor) => void;
    onShowOverlaysChange: (val: boolean) => void;
    onImageModelChange: (val: ImageModel) => void; 
    onAppLanguageChange: (val: AppLanguage) => void; 
    onMatureModeChange: (val: boolean) => void;

    onHeroUpload: (file: File) => void;
    onFriendUpload: (file: File) => void;
    onAntagonistUpload: (file: File) => void;
    onHeroUpdate: (p: Partial<Persona>) => void; 
    onFriendUpdate: (p: Partial<Persona>) => void;
    onAntagonistUpdate: (p: Partial<Persona>) => void;
    onAddExtraCast: (file: File, role: string, name: string, clothing: string, weapon: string, abilities: string, personality: string) => void;
    onRemoveExtraCast: (id: string) => void;
    onExtraCastUpdate: (id: string, updates: Partial<Persona>) => void;

    onGenreChange: (val: string) => void;
    onPlotChange: (val: string) => void;
    onLanguageChange: (val: string) => void;
    onPremiseChange: (val: string) => void;
    onCoverPromptChange: (val: string) => void;
    onIssueNumberChange: (val: string) => void; 
    onRichModeChange: (val: boolean) => void;
    onComicTitleChange: (val: string) => void;
    onComicSubtitleChange: (val: string) => void; 
    onPublisherChange: (val: PublisherConfig) => void;
    onPreviousIssueRefsChange: (val: string[]) => void;
    onResolutionChange: (val: Resolution) => void;
    onAspectRatioChange: (val: AspectRatio) => void;
    onLaunch: () => void;
    onClose: () => void;
    onSaveConfig: (mode: 'lite' | 'full' | 'cbs') => void;
    onLoadConfig: (file: File) => void;
    fileToBase64: (file: File) => Promise<string>;
    onEnhanceText: (text: string, context: string) => Promise<string>; 
    onReset: () => void; 
    onOpenCharacterLab: () => void; 
    onChangeApiKey: () => void; 
}

const UnifiedCastCard: React.FC<{
    person: Persona;
    clothingOptions: string[];
    availableWeapons: Prop[]; 
    onUpdate: (updates: Partial<Persona>) => void;
    onRemove: () => void;
    fileToBase64: (f: File) => Promise<string>;
}> = ({ person, clothingOptions, availableWeapons, onUpdate, onRemove, fileToBase64 }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    return (
        <div className="bg-zinc-800 border-l-4 border-yellow-500 p-4 shadow-lg flex flex-col gap-3 transition-all hover:bg-zinc-750">
            <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <label className="cursor-pointer group relative w-16 h-16 shrink-0 border-2 border-gray-500 bg-black overflow-hidden hover:border-white transition-colors">
                        {person.base64 ? (
                            <img src={`data:image/jpeg;base64,${person.base64}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-gray-500 font-sans font-bold group-hover:text-white">ADD FACE</div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate({base64: await fileToBase64(e.target.files[0])})} />
                    </label>
                    <div className="flex flex-col gap-1 w-full">
                        <input 
                            type="text" 
                            value={person.name} 
                            onChange={(e) => onUpdate({name: e.target.value})} 
                            className="bg-transparent text-white font-bold text-lg border-b border-transparent hover:border-gray-500 focus:border-yellow-400 focus:outline-none w-full font-comic tracking-wide"
                            placeholder="Character Name"
                        />
                        <select 
                            value={person.role} 
                            onChange={(e) => onUpdate({role: e.target.value})} 
                            className="bg-black text-xs text-green-400 border border-gray-700 p-1 font-sans font-bold w-fit"
                        >
                            {CAST_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <button onClick={onRemove} className="text-gray-500 hover:text-red-500 font-bold px-2">✕</button>
                    <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="text-xs text-blue-400 hover:text-white underline font-sans font-bold">{isDetailsOpen ? 'Hide' : 'Edit'}</button>
                </div>
            </div>

            {isDetailsOpen && (
                <div className="grid gap-2 pt-2 border-t border-gray-700 animate-in fade-in slide-in-from-top-1">
                    
                    <div className="bg-black/50 border border-yellow-600/50 p-3 mb-2">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] uppercase text-yellow-500 font-bold font-sans tracking-wider">Official Character Sheet (Master Ref)</label>
                            {person.characterSheet && (
                                <button onClick={() => onUpdate({ characterSheet: undefined })} className="text-[9px] text-red-400 hover:text-white uppercase font-bold font-sans">Delete Sheet</button>
                            )}
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="w-24 h-24 shrink-0 border-2 border-yellow-500 bg-black overflow-hidden relative group">
                                {person.characterSheet ? (
                                    <img src={`data:image/jpeg;base64,${person.characterSheet}`} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-600 text-center font-sans p-1">NO SHEET UPLOADED</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] text-gray-400 mb-2 font-sans leading-tight">
                                    This image is the <strong>Primary Visual Reference</strong> used by the AI to draw {person.name}. Generate one in the <strong>Lab</strong> or upload existing art.
                                </p>
                                <label className="bg-yellow-600 hover:bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 cursor-pointer border border-yellow-400 font-sans inline-block uppercase">
                                    Upload Sheet
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate({characterSheet: await fileToBase64(e.target.files[0])})} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold font-sans">Visual Description / Costume</label>
                        <textarea value={person.clothing} onChange={(e) => onUpdate({clothing: e.target.value})} className="w-full h-16 bg-black text-white text-xs p-2 border border-gray-600 font-sans" placeholder="Describe appearance..." />
                        <div className="flex flex-wrap gap-1">
                            {clothingOptions.slice(0, 3).map(opt => (
                                <button key={opt} onClick={() => onUpdate({clothing: opt})} className="text-[9px] bg-zinc-700 text-gray-300 px-2 py-1 hover:bg-zinc-600 font-sans">{opt}</button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                         <label className="text-[10px] uppercase text-gray-500 font-bold font-sans">Signature Weapon / Item</label>
                         <div className="flex gap-2">
                             <input 
                                list={`weapons-${person.id}`} 
                                value={person.weapon || ""} 
                                onChange={(e) => onUpdate({weapon: e.target.value})} 
                                className="flex-1 bg-black text-white text-xs p-2 border border-gray-600 font-sans" 
                                placeholder="None or Custom..." 
                            />
                            <datalist id={`weapons-${person.id}`}>
                                {availableWeapons.map(w => <option key={w.id} value={w.name} />)}
                            </datalist>
                         </div>
                    </div>

                    <div className="flex flex-col gap-1">
                         <label className="text-[10px] uppercase text-gray-500 font-bold font-sans">Abilities / Powers</label>
                         <input value={person.abilities || ""} onChange={(e) => onUpdate({abilities: e.target.value})} className="bg-black text-white text-xs p-2 border border-gray-600 font-sans" placeholder="None..." />
                    </div>

                    <div className="flex flex-col gap-1">
                         <label className="text-[10px] uppercase text-gray-500 font-bold font-sans">Personality / Vibe</label>
                         <input value={person.personality || ""} onChange={(e) => onUpdate({personality: e.target.value})} className="bg-black text-white text-xs p-2 border border-gray-600 font-sans" placeholder="Stoic, cheerful, etc..." />
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-2 border-t border-gray-700 pt-2">
                         <label className="text-[10px] uppercase text-gray-500 font-bold font-sans">Reference Gallery (Additional Angles)</label>
                         <div className="flex gap-2 overflow-x-auto pb-2">
                             {person.additionalImages?.map((img, i) => (
                                 <div key={i} className="relative shrink-0 w-16 h-16 border border-gray-600 bg-black group">
                                     <img src={`data:image/jpeg;base64,${img}`} className="w-full h-full object-cover" />
                                     <button onClick={() => { 
                                         const newImgs = person.additionalImages?.filter((_, idx) => idx !== i);
                                         onUpdate({ additionalImages: newImgs });
                                     }} className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100">x</button>
                                 </div>
                             ))}
                             <label className="shrink-0 w-16 h-16 border border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:bg-zinc-700">
                                 <span className="text-xl text-gray-400">+</span>
                                 <input type="file" multiple accept="image/*" className="hidden" onChange={async (e) => {
                                     if(e.target.files) {
                                         const promises = Array.from(e.target.files).map(f => fileToBase64(f));
                                         const b64s = await Promise.all(promises);
                                         onUpdate({ additionalImages: [...(person.additionalImages || []), ...b64s] });
                                     }
                                 }} />
                             </label>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LocationCard: React.FC<{
    loc: LocationRef;
    onUpdate: (id: string, updates: Partial<LocationRef>) => void;
    onDelete: (id: string) => void;
    fileToBase64: (f: File) => Promise<string>;
}> = ({ loc, onUpdate, onDelete, fileToBase64 }) => {
    return (
        <div className="bg-zinc-800 border p-3 flex flex-col gap-2 relative group hover:border-gray-500 transition-colors">
            <button onClick={() => onDelete(loc.id)} className="absolute top-1 right-1 text-gray-600 hover:text-red-500 font-bold px-1 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            
            {/* Image Uploader for Location */}
             <label className="shrink-0 w-full h-24 bg-black border border-gray-600 cursor-pointer overflow-hidden hover:border-white relative group">
                {loc.base64 ? (
                    <img src={`data:image/jpeg;base64,${loc.base64}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold text-center p-1">
                        {loc.base64 ? "CHANGE PHOTO" : "ADD REFERENCE PHOTO"}
                    </div>
                )}
                <div className="absolute bottom-1 left-1 bg-black/60 px-1 text-[8px] text-white">REF IMAGE</div>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate(loc.id, { base64: await fileToBase64(e.target.files[0]) })} />
                {loc.base64 && (
                    <button onClick={(e) => { e.preventDefault(); onUpdate(loc.id, { base64: undefined }); }} className="absolute top-1 left-1 text-[8px] bg-red-600 text-white px-1">REMOVE</button>
                )}
            </label>

            <input value={loc.name} onChange={(e) => onUpdate(loc.id, { name: e.target.value })} className="bg-transparent text-white font-bold font-sans text-sm border-b border-transparent focus:border-yellow-400 focus:outline-none" />
            <textarea value={loc.description} onChange={(e) => onUpdate(loc.id, { description: e.target.value })} className="bg-black text-gray-400 text-xs p-2 h-16 resize-none font-sans border border-gray-800 focus:border-yellow-400 focus:outline-none" placeholder="Description..." />
        </div>
    );
};

const PropCard: React.FC<{
    prop: Prop;
    allCast: Persona[];
    onUpdate: (id: string, updates: Partial<Prop>) => void;
    onDelete: (id: string) => void;
    fileToBase64: (f: File) => Promise<string>;
}> = ({ prop, allCast, onUpdate, onDelete, fileToBase64 }) => {
    return (
        <div className="bg-zinc-800 border-l-4 border-orange-500 p-3 shadow-lg flex gap-3 relative group hover:bg-zinc-750 transition-colors">
            <button onClick={() => onDelete(prop.id)} className="absolute top-1 right-1 text-gray-600 hover:text-red-500 font-bold px-1 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            
            <label className="shrink-0 w-20 h-20 bg-black border border-gray-600 cursor-pointer overflow-hidden hover:border-white">
                {prop.base64 ? (
                    <img src={`data:image/jpeg;base64,${prop.base64}`} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500 font-bold text-center p-1">UPLOAD IMAGE</div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate(prop.id, { base64: await fileToBase64(e.target.files[0]) })} />
            </label>
            
            <div className="flex-1 flex flex-col gap-1 min-w-0">
                <input value={prop.name} onChange={(e) => onUpdate(prop.id, { name: e.target.value })} className="bg-transparent text-white font-bold font-comic text-lg w-full border-b border-transparent focus:border-orange-500 focus:outline-none" placeholder="Item Name" />
                <textarea value={prop.description} onChange={(e) => onUpdate(prop.id, { description: e.target.value })} className="bg-black/50 text-gray-300 text-[10px] p-1 h-10 resize-none font-sans border border-transparent focus:border-orange-500 focus:outline-none" placeholder="What does it do?" />
                
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">OWNER:</span>
                    <select value={prop.ownerId || ""} onChange={(e) => onUpdate(prop.id, { ownerId: e.target.value })} className="bg-black text-xs text-orange-400 border border-gray-700 p-0.5 font-sans font-bold flex-1">
                        <option value="">No one / Public</option>
                        {allCast.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

const Footer: React.FC = () => (
    <div className="fixed bottom-0 inset-x-0 bg-black text-white p-2 text-center text-[10px] font-sans border-t border-gray-800 z-[250]">
        COMIC BOOK STUDIO • CREATED BY AMMAR AS "INFINITE HEROES" • EDITED BY DANNY VAIN • {APP_VERSION}
    </div>
);

// SAVE MODAL
const SaveChoiceModal: React.FC<{
    onClose: () => void;
    onSave: (mode: 'lite' | 'full' | 'cbs') => void;
    comicTitle: string;
}> = ({ onClose, onSave, comicTitle }) => {
    return (
        <div className="fixed inset-0 z-[1200] bg-[#0E070C]/80 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-[#150711] border border-[#3D1629] p-6 max-w-lg w-full relative shadow-2xl rounded-2xl text-[#FAF5F0]">
                <button onClick={onClose} className="absolute top-4 right-4 text-[#8A6D7B] hover:text-[#FAF5F0] font-bold text-lg transition-colors">✕</button>
                <h3 className="text-xl font-bold text-[#FAF5F0] uppercase mb-2 text-center font-sans tracking-wide">Save Project</h3>
                <p className="text-center text-[#8A6D7B] font-sans text-xs mb-6">Choose a format. ".cbs" is best for backups.</p>

                <div className="grid gap-3">
                    <button onClick={() => { onSave('cbs'); onClose(); }} className="bg-[#1B0A16] text-[#FAF5F0] p-4 border border-[#3D1629] hover:border-[#C68B59] transition-all text-left rounded-xl group">
                         <div className="font-bold text-sm mb-1 group-hover:text-[#DF9E65] font-sans uppercase">📦 Full Archive (.CBS)</div>
                         <div className="text-xs text-[#8A6D7B] group-hover:text-[#EADDE2] font-sans">
                             Saves <strong>EVERYTHING</strong> (Images, Refs, Galleries) in a ZIP format. Best for large projects.
                         </div>
                    </button>

                    <button onClick={() => { onSave('full'); onClose(); }} className="bg-[#1B0A16] text-[#FAF5F0] p-4 border border-[#3D1629] hover:border-[#C68B59] transition-all text-left rounded-xl group">
                         <div className="font-bold text-sm mb-1 group-hover:text-[#DF9E65] font-sans uppercase">📄 Legacy Full JSON</div>
                         <div className="text-xs text-[#8A6D7B] group-hover:text-[#EADDE2] font-sans">
                             Single text file with images embedded. 
                             <span className="text-red-400 block mt-1">⚠️ Risk of crash if over 150MB.</span>
                         </div>
                    </button>

                    <button onClick={() => { onSave('lite'); onClose(); }} className="bg-[#1B0A16] text-[#FAF5F0] p-4 border border-[#3D1629] hover:border-[#C68B59] transition-all text-left rounded-xl group">
                         <div className="font-bold text-sm mb-1 group-hover:text-[#DF9E65] font-sans uppercase">📝 Lite Config (.JSON)</div>
                         <div className="text-xs text-[#8A6D7B] group-hover:text-[#EADDE2] font-sans">
                             Settings & Text ONLY. No images. Very small file size.
                         </div>
                    </button>
                </div>
             </div>
        </div>
    );
};

export const Setup: React.FC<SetupProps> = (props) => {
    if (!props.show && !props.isTransitioning) return null;

    // Derived State
    const allCast = [props.hero, props.friend, props.antagonist, ...props.extraCast].filter(Boolean) as Persona[];
    const clothingOptions = CLOTHING_PRESETS[props.selectedGenre] || CLOTHING_PRESETS["Custom"];
    const currentPlots = PLOT_OPTIONS[props.selectedGenre] || PLOT_OPTIONS["Custom"];
    const weaponList = props.propsList.filter(p => p.type === 'weapon');
    const propList = props.propsList.filter(p => p.type === 'prop');

    // Local State
    const [activeTab, setActiveTab] = useState<'story'|'cast'|'world'|'identity'|'system'>('story');
    const [undoPremise, setUndoPremise] = useState<string | undefined>();
    const [isEnhancingPremise, setIsEnhancingPremise] = useState(false);
    const [undoLogo, setUndoLogo] = useState<string | undefined>();
    const [isEnhancingLogo, setIsEnhancingLogo] = useState(false);
    const [showQuota, setShowQuota] = useState(false); 
    const [showAbout, setShowAbout] = useState(false);
    const [showSaveChoice, setShowSaveChoice] = useState(false);
    
    const labels = UI_LABELS[props.appLanguage];

    const handleAddNewCast = () => {
        props.onAddCastMember({ id: `char-${Date.now()}`, name: "New Character", role: "Supporting Character", desc: "", clothing: clothingOptions[0], base64: "" });
    };
    const handleAddNewLocation = () => { props.onAddLocation({ id: `loc-${Date.now()}`, name: "New Location", type: 'text', description: "" }); };
    const handleAddNewItem = (type: 'weapon' | 'prop') => { props.onAddProp({ id: `prop-${Date.now()}`, name: type === 'weapon' ? "New Weapon" : "New Prop", type: type, description: "" }); };

    const randomizePublisher = async () => {
        const adjectives = ["Cosmic", "Dark", "Future", "Retro", "Infinite", "Mega", "Atomic", "Secret"];
        const nouns = ["Comics", "Press", "Studios", "Works", "Ink", "Tales", "Legends"];
        const name = `${adjectives[Math.floor(Math.random()*adjectives.length)]} ${nouns[Math.floor(Math.random()*nouns.length)]}`;
        const desc = await props.onEnhanceText(name, "Comic publisher logo description");
        props.onPublisherChange({ ...props.publisher, name, logoDescription: desc });
    };

    const isCustomGenreActive = !GENRES.includes(props.selectedGenre) || props.selectedGenre === "Custom";
    const dropdownValue = isCustomGenreActive ? "Custom" : props.selectedGenre;

    const handleGenreDropdownChange = (val: string) => {
        if (val === "Custom") {
            props.onGenreChange("Custom");
        } else {
            props.onGenreChange(val);
        }
    };

    return (
        <>
        {showQuota && <QuotaInfo onClose={() => setShowQuota(false)} />}
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        {showSaveChoice && <SaveChoiceModal onClose={() => setShowSaveChoice(false)} onSave={props.onSaveConfig} comicTitle={props.comicTitle} />}
        
        <style>{`
             @keyframes knockout-exit { 0% { transform: scale(1) rotate(1deg); } 15% { transform: scale(1.1) rotate(-5deg); } 100% { transform: translateY(-200vh) rotate(1080deg) scale(0.5); opacity: 1; } }
             @keyframes pow-enter { 0% { transform: translate(-50%, -50%) scale(0) rotate(-45deg); opacity: 0; } 30% { transform: translate(-50%, -50%) scale(1.5) rotate(10deg); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1.8) rotate(0deg); opacity: 0; } }
          `}</style>
        
        {props.isTransitioning && (
            <div className="fixed top-1/2 left-1/2 z-[210] pointer-events-none" style={{ animation: 'pow-enter 1s forwards ease-out' }}>
                <svg viewBox="0 0 200 150" className="w-[500px] h-[400px] drop-shadow-[0_10px_0_rgba(0,0,0,0.5)]"><path d="M95.7,12.8 L110.2,48.5 L148.5,45.2 L125.6,74.3 L156.8,96.8 L119.4,105.5 L122.7,143.8 L92.5,118.6 L60.3,139.7 L72.1,103.2 L34.5,108.8 L59.9,79.9 L24.7,57.3 L62.5,54.4 L61.2,16.5 z" fill="#FFD700" stroke="black" strokeWidth="4"/><text x="100" y="95" textAnchor="middle" fontFamily="'Bangers', cursive" fontSize="70" fill="#DC2626" stroke="black" strokeWidth="2" transform="rotate(-5 100 75)">POW!</text></svg>
            </div>
        )}
        
        <div className={`fixed inset-0 z-[200] overflow-y-auto bg-[#0E070C] text-[#FAF5F0] font-sans`} style={{ animation: props.isTransitioning ? 'knockout-exit 1s forwards cubic-bezier(.6,-0.28,.74,.05)' : 'none', pointerEvents: props.isTransitioning ? 'none' : 'auto' }}>
          <AtlasBackground />
          <div className={`min-h-full w-full p-6 md:p-10 ${props.isStarted ? 'pb-10' : 'pb-32'} relative text-center max-w-[1920px] mx-auto z-10`}>
                {props.isStarted && (<button onClick={props.onClose} className="fixed top-6 right-6 bg-[#150711] text-[#FAF5F0] rounded-full w-10 h-10 border border-[#3D1629] hover:border-[#C68B59] font-bold text-lg hover:scale-105 z-50 shadow-xl transition-all">✕</button>)}

                <div className="flex flex-col justify-center items-center gap-4 mb-6 border-b border-[#3D1629] pb-6 relative">
                    <h1 className="font-cinzel font-bold text-3xl md:text-5xl text-[#FAF5F0] leading-none tracking-wider uppercase">{props.isStarted ? labels.projectSettings : "ATLAS XXIII • COMIC STUDIO"}</h1>
                    
                    {props.isStarted ? (
                        <div className="flex gap-2 mt-4">
                            {(['story','cast','world','identity','system'] as const).map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 font-bold uppercase transition-all font-sans text-xs tracking-wider rounded-full ${activeTab === tab ? 'bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] shadow-[0_0_15px_rgba(198,139,89,0.3)]' : 'bg-[#150711] border border-[#3D1629] text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>
                                    {labels[`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof labels] || tab}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <label className="text-[#8A6D7B] font-bold uppercase text-xs font-sans">App Language:</label>
                            <div className="flex items-center gap-1.5 bg-[#13060E] border border-[#3D1629] p-1 rounded-full"><button onClick={() => props.onAppLanguageChange('en')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all font-sans ${props.appLanguage === 'en' ? 'bg-[#3D1629] text-[#FAF5F0] border border-[#C68B59]/40' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>ENGLISH</button><button onClick={() => props.onAppLanguageChange('esp')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all font-sans ${props.appLanguage === 'esp' ? 'bg-[#3D1629] text-[#DF9E65] border border-[#C68B59]/40' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>ESPAÑOL</button></div>
                        </div>
                    )}
                </div>
                
                <div className={`grid grid-cols-1 ${props.isStarted ? 'max-w-4xl mx-auto' : 'lg:grid-cols-2 xl:grid-cols-3 gap-8'}`}>
                    
                    {/* === STORY TAB === */}
                    {(!props.isStarted || activeTab === 'story') && (
                        <div className="flex flex-col gap-4">
                            <div className="font-cinzel text-sm font-bold text-[#DF9E65] bg-[#150711] px-4 py-2 border border-[#3D1629] rounded-2xl tracking-widest uppercase text-left flex items-center justify-between shadow-lg"><span>{labels.tabStory}</span><span className="text-xs text-[#8A6D7B] font-mono font-normal">STEP 01</span></div>
                            <div className="bg-[#150711]/90 border border-[#3D1629] p-6 shadow-2xl rounded-2xl font-sans text-left">
                                <div className="mb-4"><label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1">Title</label><input type="text" value={props.comicTitle} onChange={(e) => props.onComicTitleChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-sm font-bold uppercase focus:border-[#C68B59] focus:outline-none" /></div>
                                <div className="mb-4"><label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1">Subtitle</label><input type="text" value={props.comicSubtitle} onChange={(e) => props.onComicSubtitleChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-sm font-bold focus:border-[#C68B59] focus:outline-none" /></div>
                                <div className="mb-4 grid grid-cols-2 gap-4">
                                    <div><label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1">Issue #</label><input type="text" value={props.issueNumber} onChange={(e) => props.onIssueNumberChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#DF9E65] p-2.5 rounded-xl text-sm font-mono font-bold focus:border-[#C68B59] focus:outline-none" /></div>
                                    <div><label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1">Comic Language</label><select value={props.selectedLanguage} onChange={(e) => props.onLanguageChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-sm font-bold focus:border-[#C68B59] focus:outline-none cursor-pointer">{LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select></div>
                                </div>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-400 text-xs uppercase block mb-1">Genre</label>
                                    <select value={dropdownValue} onChange={(e) => handleGenreDropdownChange(e.target.value)} className="w-full bg-black border border-gray-600 text-white p-2 text-sm font-bold mb-1">{GENRES.map(g => <option key={g} value={g}>{g}</option>)}</select>
                                    {isCustomGenreActive && (
                                        <input type="text" value={props.selectedGenre === "Custom" ? "" : props.selectedGenre} onChange={(e) => props.onGenreChange(e.target.value)} className="w-full bg-zinc-900 border border-yellow-500 text-yellow-400 p-2 text-sm font-bold placeholder-yellow-700 animate-in fade-in" placeholder="Enter Custom Genre..." />
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="font-bold text-gray-400 text-xs uppercase block mb-1">Plot Summary</label>
                                    <select value={props.selectedPlot} onChange={(e) => props.onPlotChange(e.target.value)} className="w-full bg-black border border-gray-600 text-white p-2 text-sm font-bold mb-2">{currentPlots.map(p => <option key={p} value={p}>{p}</option>)}<option value="Write your own...">Write your own...</option></select>
                                    {(props.selectedPlot === "Write your own..." || props.selectedGenre === "Custom") && (
                                        <div className="relative">
                                            <div className="absolute top-1 right-1 flex gap-1 z-10">{undoPremise && (<button onClick={() => { props.onPremiseChange(undoPremise); setUndoPremise(undefined); }} className="bg-gray-600 text-white text-[9px] px-2 py-0.5 font-bold border font-sans">↩</button>)}<button onClick={async () => { if(!props.customPremise.trim()) return; setIsEnhancingPremise(true); const enhanced = await props.onEnhanceText(props.customPremise, "comic plot"); setUndoPremise(props.customPremise); props.onPremiseChange(enhanced); setIsEnhancingPremise(false); }} disabled={isEnhancingPremise || !props.customPremise.trim()} className="bg-purple-600 text-white text-[9px] px-2 py-0.5 font-bold border font-sans">✨</button></div>
                                            <textarea value={props.customPremise} onChange={(e) => props.onPremiseChange(e.target.value)} className="w-full h-24 bg-black border border-gray-600 text-white p-2 text-sm font-sans pt-6" placeholder="Custom plot..." />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === CAST TAB === */}
                    {(!props.isStarted || activeTab === 'cast') && (
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center"><div className="font-comic text-2xl text-black bg-yellow-400 px-4 py-2 transform -skew-x-6 inline-block w-fit border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">{labels.tabCast}</div><button onClick={handleAddNewCast} className="bg-green-600 text-white font-bold px-3 py-1 text-xs uppercase shadow-[3px_3px_0px_black] font-sans">+ Add Character</button></div>
                            
                            {props.isStarted && (<button onClick={props.onOpenCharacterLab} className="w-full py-3 bg-purple-600 text-white font-bold uppercase border-2 border-white shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:bg-purple-500 transition-colors font-sans mb-2">{labels.enterLab} 🧪</button>)}

                            <div className="bg-black border-4 border-gray-700 p-4 grid grid-cols-1 gap-4 max-h-[800px] overflow-y-auto custom-scrollbar text-left">
                                {allCast.map(person => (<UnifiedCastCard key={person.id} person={person} clothingOptions={clothingOptions} availableWeapons={weaponList} onUpdate={(updates) => props.onUpdateCastMember(person.id, updates)} onRemove={() => props.onRemoveCastMember(person.id)} fileToBase64={props.fileToBase64} />))}
                            </div>
                        </div>
                    )}

                    {/* === WORLD TAB === */}
                    {(!props.isStarted || activeTab === 'world') && (
                        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 text-left">
                             {props.isStarted && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center"><div className="font-comic text-xl text-blue-300 uppercase bg-black px-2 border-2 border-blue-500 inline-block">LOCATION LIBRARY</div><button onClick={handleAddNewLocation} className="bg-blue-600 text-white font-bold px-3 py-1 text-xs uppercase shadow-[3px_3px_0px_black] font-sans">+ NEW</button></div>
                                    <div className="bg-black border-4 border-gray-700 p-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">{props.savedLocations.map(loc => (<LocationCard key={loc.id} loc={loc} onUpdate={props.onUpdateLocation} onDelete={props.onDeleteLocation} fileToBase64={props.fileToBase64} />))}{props.savedLocations.length === 0 && <div className="text-gray-500 text-xs font-sans text-center py-4">No locations added.</div>}</div>
                                </div>
                             )}
                             <div className="flex flex-col gap-4">
                                 <div className="flex justify-between items-center"><div className="font-comic text-xl text-orange-400 uppercase bg-black px-2 border-2 border-orange-500 inline-block">THE ARMORY</div><button onClick={() => handleAddNewItem('weapon')} className="bg-orange-600 text-white font-bold px-3 py-1 text-xs uppercase shadow-[3px_3px_0px_black] font-sans">+ NEW WEAPON</button></div>
                                 <div className="bg-black border-4 border-gray-700 p-4 grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar">{weaponList.map(prop => (<PropCard key={prop.id} prop={prop} allCast={allCast} onUpdate={props.onUpdateProp} onDelete={props.onDeleteProp} fileToBase64={props.fileToBase64}/>))}{weaponList.length === 0 && <div className="text-gray-500 text-xs font-sans text-center py-4">No weapons added.</div>}</div>
                            </div>
                             <div className="flex flex-col gap-4">
                                 <div className="flex justify-between items-center"><div className="font-comic text-xl text-gray-400 uppercase bg-black px-2 border-2 border-gray-500 inline-block">PROP STORAGE</div><button onClick={() => handleAddNewItem('prop')} className="bg-gray-600 text-white font-bold px-3 py-1 text-xs uppercase shadow-[3px_3px_0px_black] font-sans">+ NEW PROP</button></div>
                                 <div className="bg-black border-4 border-gray-700 p-4 grid grid-cols-1 gap-4 max-h-[200px] overflow-y-auto custom-scrollbar">{propList.map(prop => (<PropCard key={prop.id} prop={prop} allCast={allCast} onUpdate={props.onUpdateProp} onDelete={props.onDeleteProp} fileToBase64={props.fileToBase64}/>))}{propList.length === 0 && <div className="text-gray-500 text-xs font-sans text-center py-4">No props added.</div>}</div>
                            </div>
                        </div>
                    )}

                    {/* === IDENTITY TAB === */}
                    {(!props.isStarted || activeTab === 'identity') && (
                        <div className="flex flex-col gap-4 text-left">
                             <div className="font-comic text-2xl text-black bg-pink-400 px-4 py-2 transform -skew-x-6 inline-block w-fit border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">{labels.tabIdentity}</div>
                             <div className="bg-zinc-800 border-4 border-gray-700 p-6 shadow-xl">
                                 <div className="mb-6 border-b border-gray-600 pb-4">
                                     <div className="flex justify-between mb-1"><label className="font-bold text-gray-400 text-xs uppercase block font-sans">Publisher Branding</label><button onClick={randomizePublisher} className="text-xs text-pink-400 hover:text-white font-bold uppercase font-sans">Dice Roll 🎲</button></div>
                                     <input type="text" value={props.publisher.name} onChange={(e) => props.onPublisherChange({...props.publisher, name: e.target.value})} className="w-full bg-black border border-gray-600 text-white p-2 font-comic text-lg uppercase mb-2" placeholder="Publisher Name" />
                                     <div className="flex gap-2 mb-2"><button onClick={() => props.onPublisherChange({...props.publisher, mode: 'text'})} className={`flex-1 py-1 text-[10px] font-bold uppercase border ${props.publisher.mode !== 'image' ? 'bg-white text-black' : 'bg-zinc-900 text-gray-500'}`}>Text Desc</button><button onClick={() => props.onPublisherChange({...props.publisher, mode: 'image'})} className={`flex-1 py-1 text-[10px] font-bold uppercase border ${props.publisher.mode === 'image' ? 'bg-white text-black' : 'bg-zinc-900 text-gray-500'}`}>Upload Logo</button></div>
                                     {props.publisher.mode === 'image' ? (
                                        <div className="border-2 border-dashed border-gray-500 bg-black p-4 flex flex-col items-center justify-center relative group min-h-[100px]">{props.publisher.logoImage ? (<div className="w-full h-24 relative"><img src={`data:image/jpeg;base64,${props.publisher.logoImage}`} className="w-full h-full object-contain" /><button onClick={() => props.onPublisherChange({...props.publisher, logoImage: undefined})} className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 font-bold">X</button></div>) : (<div className="text-gray-500 font-sans text-xs font-bold text-center">Click to upload logo</div>)}<input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { if(e.target.files?.[0]) { const b64 = await props.fileToBase64(e.target.files[0]); props.onPublisherChange({...props.publisher, logoImage: b64}); } }} /></div>
                                     ) : (
                                         <div className="relative"><div className="absolute top-1 right-1 flex gap-1 z-10">{undoLogo && (<button onClick={() => { props.onPublisherChange({...props.publisher, logoDescription: undoLogo}); setUndoLogo(undefined); }} className="bg-gray-600 text-white text-[9px] px-2 py-0.5 font-bold">↩</button>)}<button onClick={async () => { if(!props.publisher.logoDescription.trim()) return; setIsEnhancingLogo(true); const enhanced = await props.onEnhanceText(props.publisher.logoDescription, "logo desc"); setUndoLogo(props.publisher.logoDescription); props.onPublisherChange({...props.publisher, logoDescription: enhanced}); setIsEnhancingLogo(false); }} disabled={isEnhancingLogo || !props.publisher.logoDescription.trim()} className="bg-purple-600 text-white text-[9px] px-2 py-0.5 font-bold">✨</button></div><input type="text" value={props.publisher.logoDescription} onChange={(e) => props.onPublisherChange({...props.publisher, logoDescription: e.target.value})} className="w-full bg-black border border-gray-600 text-white p-2 text-xs font-sans pr-16" placeholder="Logo description..." /></div>
                                     )}
                                 </div>
                                 
                                 <div className="mb-4">
                                     <label className="font-bold text-gray-400 text-xs uppercase block mb-2 font-sans">Title Treatment (Cover)</label>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div>
                                             <span className="text-[10px] text-gray-500 block">Placement</span>
                                             <div className="flex gap-1 mt-1">
                                                 <button onClick={() => props.onPublisherChange({...props.publisher, titlePlacement: 'top'})} className={`flex-1 py-1 text-[10px] font-bold uppercase border ${props.publisher.titlePlacement !== 'bottom' ? 'bg-white text-black' : 'bg-zinc-900 text-gray-500'}`}>Top</button>
                                                 <button onClick={() => props.onPublisherChange({...props.publisher, titlePlacement: 'bottom'})} className={`flex-1 py-1 text-[10px] font-bold uppercase border ${props.publisher.titlePlacement === 'bottom' ? 'bg-white text-black' : 'bg-zinc-900 text-gray-500'}`}>Bottom</button>
                                             </div>
                                         </div>
                                         <div>
                                             <span className="text-[10px] text-gray-500 block">Style Preset</span>
                                             <select value={props.publisher.titleStyle || ""} onChange={(e) => props.onPublisherChange({...props.publisher, titleStyle: e.target.value})} className="w-full bg-black border border-gray-600 text-white p-1 text-xs font-bold font-sans mt-1">
                                                 <option value="">Default</option>
                                                 {TITLE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                             </select>
                                         </div>
                                     </div>
                                     <div className="mt-3">
                                         <span className="text-[10px] text-gray-500 block mb-1">Title Logo (Optional Upload)</span>
                                         <div className="border-2 border-dashed border-gray-600 bg-black p-2 flex items-center justify-center relative group h-16">
                                             {props.publisher.titleLogo ? (
                                                 <>
                                                    <img src={`data:image/jpeg;base64,${props.publisher.titleLogo}`} className="h-full object-contain" />
                                                    <button onClick={() => props.onPublisherChange({...props.publisher, titleLogo: undefined})} className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-1 font-bold">X</button>
                                                 </>
                                             ) : <span className="text-[10px] text-gray-500">Upload Title PNG</span>}
                                             <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { if(e.target.files?.[0]) { const b64 = await props.fileToBase64(e.target.files[0]); props.onPublisherChange({...props.publisher, titleLogo: b64}); } }} />
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* === SYSTEM TAB === */}
                    {(!props.isStarted || activeTab === 'system') && (
                        <div className="flex flex-col gap-4 text-left">
                            <div className="font-comic text-2xl text-black bg-white px-4 py-2 transform skew-x-6 inline-block w-fit border-2 border-black shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">{labels.tabSystem}</div>
                            <div className="bg-zinc-800 border-4 border-gray-700 p-6 shadow-xl font-sans">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div><span className="text-[10px] text-gray-500 block">Resolution</span><select value={props.selectedResolution} onChange={(e) => props.onResolutionChange(e.target.value as Resolution)} className="w-full bg-black border border-gray-600 text-white p-1 text-xs font-bold"><option value="1K">1K (Standard)</option><option value="2K">2K (High)</option><option value="4K">4K (Ultra)</option></select></div>
                                    <div><span className="text-[10px] text-gray-500 block">Aspect Ratio</span><select value={props.selectedAspectRatio} onChange={(e) => props.onAspectRatioChange(e.target.value as AspectRatio)} className="w-full bg-black border border-gray-600 text-white p-1 text-xs font-bold">{ASPECT_RATIOS.map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}</select></div>
                                    <div><span className="text-[10px] text-gray-500 block">Page Borders</span><select value={props.borderColor} onChange={(e) => props.onBorderColorChange(e.target.value as BorderColor)} className="w-full bg-black border border-gray-600 text-white p-1 text-xs font-bold"><option value="white">White</option><option value="black">Black</option></select></div>
                                    <div><span className="text-[10px] text-gray-500 block">Model</span><select value={props.imageModel} onChange={(e) => props.onImageModelChange(e.target.value as ImageModel)} className="w-full bg-black border border-gray-600 text-white p-1 text-xs font-bold"><option value="gemini-3-pro-image-preview">PRO (High Quality)</option><option value="gemini-2.5-flash-image">FLASH (Fast / Low Quota)</option></select></div>
                                    <div><span className="text-[10px] text-gray-500 block">{labels.overlays}</span><label className="flex items-center gap-2 cursor-pointer mt-1"><input type="checkbox" checked={props.showOverlays} onChange={(e) => props.onShowOverlaysChange(e.target.checked)} className="accent-yellow-400 w-4 h-4" /><span className="text-xs font-bold text-white">{props.showOverlays ? 'Visible' : 'Hidden'}</span></label></div>
                                </div>
                                
                                <div className="bg-red-900/20 border border-red-800 p-3 mb-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={props.isMatureMode} onChange={(e) => props.onMatureModeChange(e.target.checked)} className="accent-red-600 w-5 h-5" />
                                        <div>
                                            <span className="block text-red-400 font-bold text-xs uppercase">🔞 MATURE / 18+ MODE</span>
                                            <span className="block text-[9px] text-gray-400">Allows Gritty/Serious content. API hard limits (Violence/Illegal Acts) still apply.</span>
                                        </div>
                                    </label>
                                </div>
                                
                                {props.isStarted && (
                                     <div className="border-t border-gray-600 pt-4 mt-4">
                                         <label className="font-bold text-gray-400 text-xs uppercase block mb-2">Sequel / Lore Context (Optional)</label>
                                         <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                            {props.previousIssueRefs.map((img, i) => (
                                                <div key={i} className="relative shrink-0 w-16 h-20 border border-blue-500 bg-black group"><img src={`data:image/jpeg;base64,${img}`} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" /><button onClick={() => { const newRefs = props.previousIssueRefs.filter((_, idx) => idx !== i); props.onPreviousIssueRefsChange(newRefs); }} className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center font-bold text-[10px] opacity-0 group-hover:opacity-100">x</button></div>
                                            ))}
                                            <label className="shrink-0 w-16 h-20 border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:bg-zinc-800"><span className="text-xl text-gray-500">+</span><input type="file" multiple accept="image/*" className="hidden" onChange={async (e) => { if(e.target.files) { const promises = Array.from(e.target.files).map(f => props.fileToBase64(f)); const b64s = await Promise.all(promises); props.onPreviousIssueRefsChange([...props.previousIssueRefs, ...b64s]); } }} /></label>
                                         </div>
                                     </div>
                                 )}
                            </div>
                        </div>
                    )}
                </div>

                {!props.isStarted && (
                    <div className="flex flex-col items-center gap-6 mt-12 max-w-[800px] mx-auto border-t border-[#3D1629] pt-8">
                        <button onClick={props.onLaunch} className="bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] text-2xl md:text-3xl font-bold py-5 px-16 rounded-full shadow-[0_0_30px_rgba(198,139,89,0.35)] hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest font-comic">{labels.startAdventure}</button>
                        
                        <div className="flex gap-4">
                             <button onClick={() => setShowSaveChoice(true)} className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-5 py-2.5 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase">{labels.saveConfig}</button>
                             <label className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-5 py-2.5 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase cursor-pointer">{labels.loadConfig}<input type="file" accept=".json,.cbs" onChange={(e) => e.target.files?.[0] && props.onLoadConfig(e.target.files[0])} className="hidden" /></label>
                        </div>
                    </div>
                )}
                
                {props.isStarted && (
                    <div className="flex justify-center gap-3 mt-6 flex-wrap font-sans border-t border-[#3D1629] pt-6">
                         <button onClick={() => setShowSaveChoice(true)} className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase">{labels.saveConfig}</button>
                         <label className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase cursor-pointer">{labels.loadConfig}<input type="file" accept=".json,.cbs" onChange={(e) => e.target.files?.[0] && props.onLoadConfig(e.target.files[0])} className="hidden" /></label>
                         <button onClick={() => setShowQuota(true)} className="bg-[#150711] text-[#DF9E65] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase">⚡ {labels.apiQuota}</button>
                         <button onClick={() => setShowAbout(true)} className="bg-[#150711] text-[#EADDE2] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase">{labels.about}</button>
                         <button onClick={props.onReset} className="bg-[#2A0E20] text-red-400 text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-red-500 uppercase ml-auto">{labels.nuclearReset}</button>
                    </div>
                )}
          </div>
        </div>
        {!props.isStarted && <AtlasFooter />}
        </>
    );
}
