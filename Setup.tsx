/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { 
    GENRES, 
    PLOT_OPTIONS, 
    LANGUAGES, 
    Persona, 
    PublisherConfig, 
    CAST_ROLES, 
    CLOTHING_PRESETS, 
    Resolution, 
    AspectRatio, 
    ASPECT_RATIOS, 
    LocationRef, 
    BorderColor, 
    Prop, 
    ImageModel, 
    AppLanguage, 
    UI_LABELS, 
    TITLE_STYLES,
    IMAGE_MODEL_OPTIONS 
} from './types';
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
        <div className="bg-[#180B16] border border-[#3D1629] hover:border-[#C68B59]/40 rounded-2xl p-4 shadow-lg flex flex-col gap-3 transition-all">
            <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <label className="cursor-pointer group relative w-16 h-16 shrink-0 border border-[#3D1629] rounded-xl bg-[#120810] overflow-hidden hover:border-[#DF9E65] transition-colors">
                        {person.base64 ? (
                            <img src={`data:image/jpeg;base64,${person.base64}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8A6D7B] font-mono font-bold group-hover:text-[#FAF5F0] text-center p-1">
                                ADD FACE
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate({base64: await fileToBase64(e.target.files[0])})} />
                    </label>
                    <div className="flex flex-col gap-1.5 w-full">
                        <input 
                            type="text" 
                            value={person.name} 
                            onChange={(e) => onUpdate({name: e.target.value})} 
                            className="bg-transparent text-[#FAF5F0] font-bold text-base border-b border-transparent hover:border-[#3D1629] focus:border-[#C68B59] focus:outline-none w-full font-mono tracking-wide"
                            placeholder="Character Name"
                        />
                        <select 
                            value={person.role} 
                            onChange={(e) => onUpdate({role: e.target.value})} 
                            className="bg-[#12060E] text-xs text-[#DF9D64] border border-[#3D1629] rounded-lg px-2 py-1 font-mono font-bold w-fit outline-none"
                        >
                            {CAST_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <button onClick={onRemove} className="text-[#8A6D7B] hover:text-rose-400 font-bold px-2 py-0.5 transition-colors">✕</button>
                    <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="text-xs text-[#C68B59] hover:text-[#FAF5F0] underline font-mono font-bold">{isDetailsOpen ? 'Hide' : 'Edit'}</button>
                </div>
            </div>

            {isDetailsOpen && (
                <div className="grid gap-2.5 pt-3 border-t border-[#3D1629] animate-in fade-in slide-in-from-top-1 text-xs font-sans">
                    <div className="bg-[#12060E] border border-[#C68B59]/30 rounded-xl p-3 mb-1">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] uppercase text-[#DF9E65] font-bold font-mono tracking-wider">Official Reference Sheet</label>
                            {person.characterSheet && (
                                <button onClick={() => onUpdate({ characterSheet: undefined })} className="text-[9px] text-rose-400 hover:text-white uppercase font-bold font-mono">Delete Sheet</button>
                            )}
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="w-20 h-20 shrink-0 border border-[#3D1629] rounded-xl bg-[#1B0A16] overflow-hidden relative group">
                                {person.characterSheet ? (
                                    <img src={`data:image/jpeg;base64,${person.characterSheet}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[9px] text-[#8A6D7B] font-mono text-center p-1">NONE</div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="bg-[#1B0A16] border border-[#3D1629] hover:border-[#C68B59] text-[#FAF5F0] text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg text-center cursor-pointer transition-colors font-bold">
                                    Upload Sheet
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate({ characterSheet: await fileToBase64(e.target.files[0]) })} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                         <label className="text-[10px] uppercase text-[#8A6D7B] font-bold font-mono">Costume / Style</label>
                         <input value={person.clothing} onChange={(e) => onUpdate({clothing: e.target.value})} className="bg-[#12060E] text-[#FAF5F0] text-xs p-2.5 rounded-xl border border-[#3D1629] focus:border-[#C68B59] outline-none" placeholder="Cybernetic armor, Victorian suit..." />
                    </div>

                    <div className="flex flex-col gap-1">
                         <label className="text-[10px] uppercase text-[#8A6D7B] font-bold font-mono">Signature Weapon / Prop</label>
                         <input value={person.weapon || ""} onChange={(e) => onUpdate({weapon: e.target.value})} className="bg-[#12060E] text-[#FAF5F0] text-xs p-2.5 rounded-xl border border-[#3D1629] focus:border-[#C68B59] outline-none" placeholder="Laser rifle, katana..." />
                    </div>

                    <div className="flex flex-col gap-1">
                         <label className="text-[10px] uppercase text-[#8A6D7B] font-bold font-mono">Personality / Vibe</label>
                         <input value={person.personality || ""} onChange={(e) => onUpdate({personality: e.target.value})} className="bg-[#12060E] text-[#FAF5F0] text-xs p-2.5 rounded-xl border border-[#3D1629] focus:border-[#C68B59] outline-none" placeholder="Stoic, cynical detective..." />
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
        <div className="bg-[#180B16] border border-[#3D1629] hover:border-[#C68B59]/40 rounded-2xl p-3.5 flex flex-col gap-2.5 relative group transition-all">
            <button onClick={() => onDelete(loc.id)} className="absolute top-2 right-2 text-[#8A6D7B] hover:text-rose-400 font-bold px-1 transition-colors">✕</button>
            
            <label className="shrink-0 w-full h-24 bg-[#12060E] border border-[#3D1629] rounded-xl cursor-pointer overflow-hidden hover:border-[#DF9E65] relative group transition-colors">
                {loc.base64 ? (
                    <img src={`data:image/jpeg;base64,${loc.base64}`} className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8A6D7B] font-mono font-bold text-center p-1">
                        + ADD LOCATION PHOTO
                    </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate(loc.id, { base64: await fileToBase64(e.target.files[0]) })} />
            </label>

            <input value={loc.name} onChange={(e) => onUpdate(loc.id, { name: e.target.value })} className="bg-transparent text-[#FAF5F0] font-bold font-mono text-sm border-b border-transparent focus:border-[#C68B59] focus:outline-none" placeholder="Location Name" />
            <textarea value={loc.description} onChange={(e) => onUpdate(loc.id, { description: e.target.value })} className="bg-[#12060E] text-[#EADDE2] text-xs p-2 h-16 resize-none font-sans rounded-xl border border-[#3D1629] focus:border-[#C68B59] focus:outline-none" placeholder="Atmosphere, lighting, architecture..." />
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
        <div className="bg-[#180B16] border border-[#3D1629] hover:border-[#C68B59]/40 rounded-2xl p-3.5 shadow-lg flex gap-3 relative group transition-all">
            <button onClick={() => onDelete(prop.id)} className="absolute top-2 right-2 text-[#8A6D7B] hover:text-rose-400 font-bold px-1 transition-colors">✕</button>
            
            <label className="shrink-0 w-20 h-20 bg-[#12060E] border border-[#3D1629] rounded-xl cursor-pointer overflow-hidden hover:border-[#DF9E65] transition-colors">
                {prop.base64 ? (
                    <img src={`data:image/jpeg;base64,${prop.base64}`} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-[#8A6D7B] font-mono font-bold text-center p-1">PHOTO</div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => e.target.files?.[0] && onUpdate(prop.id, { base64: await fileToBase64(e.target.files[0]) })} />
            </label>
            
            <div className="flex-1 flex flex-col gap-1 min-w-0">
                <input value={prop.name} onChange={(e) => onUpdate(prop.id, { name: e.target.value })} className="bg-transparent text-[#FAF5F0] font-bold font-mono text-sm w-full border-b border-transparent focus:border-[#C68B59] focus:outline-none" placeholder="Item Name" />
                <textarea value={prop.description} onChange={(e) => onUpdate(prop.id, { description: e.target.value })} className="bg-[#12060E] text-[#8A6D7B] text-[11px] p-1.5 h-10 resize-none font-sans rounded-lg border border-[#3D1629] focus:border-[#C68B59] focus:outline-none" placeholder="Properties / Appearance..." />
                
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-[#8A6D7B] font-mono font-bold uppercase">OWNER:</span>
                    <select value={prop.ownerId || ""} onChange={(e) => onUpdate(prop.id, { ownerId: e.target.value })} className="bg-[#12060E] text-[11px] text-[#DF9E65] border border-[#3D1629] rounded-lg p-1 font-mono font-bold flex-1 outline-none">
                        <option value="">Public / World</option>
                        {allCast.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

// SAVE MODAL
const SaveChoiceModal: React.FC<{
    onClose: () => void;
    onSave: (mode: 'lite' | 'full' | 'cbs') => void;
    comicTitle: string;
}> = ({ onClose, onSave }) => {
    return (
        <div className="fixed inset-0 z-[1200] bg-[#0E070C]/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
             <div className="bg-[#150711] border border-[#3D1629] p-6 max-w-lg w-full relative shadow-2xl rounded-[28px] text-[#FAF5F0]">
                <button onClick={onClose} className="absolute top-4 right-4 text-[#8A6D7B] hover:text-[#FAF5F0] font-bold text-lg transition-colors">✕</button>
                <h3 className="text-xl font-bold text-[#FAF5F0] uppercase mb-1 text-center font-mono tracking-wide">Save Project Archive</h3>
                <p className="text-center text-[#8A6D7B] text-xs mb-6">Select an archive format for session backup and sharing.</p>

                <div className="grid gap-3">
                    <button onClick={() => { onSave('cbs'); onClose(); }} className="bg-[#1B0A16] text-[#FAF5F0] p-4 border border-[#3D1629] hover:border-[#C68B59] transition-all text-left rounded-2xl group">
                         <div className="font-bold text-xs mb-1 group-hover:text-[#DF9E65] font-mono uppercase">📦 Full Archive (.CBS)</div>
                         <div className="text-[11px] text-[#8A6D7B] group-hover:text-[#EADDE2] leading-relaxed">
                             Saves all pages, references, cast models, and visual layouts into a compressed ZIP package.
                         </div>
                    </button>

                    <button onClick={() => { onSave('full'); onClose(); }} className="bg-[#1B0A16] text-[#FAF5F0] p-4 border border-[#3D1629] hover:border-[#C68B59] transition-all text-left rounded-2xl group">
                         <div className="font-bold text-xs mb-1 group-hover:text-[#DF9E65] font-mono uppercase">📄 JSON Full Blueprint</div>
                         <div className="text-[11px] text-[#8A6D7B] group-hover:text-[#EADDE2] leading-relaxed">
                             Single structured document with embedded image data.
                         </div>
                    </button>

                    <button onClick={() => { onSave('lite'); onClose(); }} className="bg-[#1B0A16] text-[#FAF5F0] p-4 border border-[#3D1629] hover:border-[#C68B59] transition-all text-left rounded-2xl group">
                         <div className="font-bold text-xs mb-1 group-hover:text-[#DF9E65] font-mono uppercase">📝 Lite Config (.JSON)</div>
                         <div className="text-[11px] text-[#8A6D7B] group-hover:text-[#EADDE2] leading-relaxed">
                             Settings and story narrative scripts only (no heavy images).
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
        props.onAddCastMember({ 
            id: `char-${Date.now()}`, 
            name: "New Character", 
            role: "Supporting Character", 
            desc: "", 
            clothing: clothingOptions[0], 
            base64: "" 
        });
    };
    const handleAddNewLocation = () => { 
        props.onAddLocation({ id: `loc-${Date.now()}`, name: "New Location", type: 'text', description: "" }); 
    };
    const handleAddNewItem = (type: 'weapon' | 'prop') => { 
        props.onAddProp({ id: `prop-${Date.now()}`, name: type === 'weapon' ? "New Weapon" : "New Prop", type: type, description: "" }); 
    };

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
        
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#0E070C] text-[#FAF5F0] font-sans select-none">
          <AtlasBackground />
          <div className="min-h-full w-full p-6 md:p-10 pb-36 md:pb-44 relative text-center max-w-7xl mx-auto z-10">
                {props.isStarted && (
                    <button 
                        onClick={props.onClose} 
                        className="fixed top-6 right-6 bg-[#150711] text-[#FAF5F0] rounded-full w-10 h-10 border border-[#3D1629] hover:border-[#C68B59] font-bold text-lg hover:scale-105 z-50 shadow-xl transition-all flex items-center justify-center"
                    >
                        ✕
                    </button>
                )}

                {/* Header */}
                <div className="flex flex-col justify-center items-center gap-3 mb-8 border-b border-[#3D1629] pb-6 relative">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DF9D64] animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C68B59]">
                            Atlas XXIII Suite
                        </span>
                    </div>

                    <h1 className="font-mono font-bold text-2xl md:text-4xl text-[#FAF5F0] leading-none tracking-wider uppercase">
                        {props.isStarted ? labels.projectSettings : "COMIC STUDIO SETUP"}
                    </h1>
                    
                    {props.isStarted ? (
                        <div className="flex gap-2 mt-4 bg-[#13060E] border border-[#3D1629] p-1.5 rounded-full shadow-inner flex-wrap justify-center">
                            {(['story','cast','world','identity','system'] as const).map(tab => (
                                <button 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)} 
                                    className={`px-5 py-2 font-bold uppercase transition-all font-mono text-xs tracking-wider rounded-full ${
                                        activeTab === tab 
                                            ? 'btn-bronze-active shadow-[0_0_15px_rgba(198,139,89,0.3)]' 
                                            : 'text-[#8A6D7B] hover:text-[#FAF5F0]'
                                    }`}
                                >
                                    {labels[`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof typeof labels] || tab}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[#8A6D7B] font-mono text-xs uppercase">Language:</span>
                            <div className="flex items-center gap-1.5 bg-[#13060E] border border-[#3D1629] p-1 rounded-full">
                                <button onClick={() => props.onAppLanguageChange('en')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all font-mono ${props.appLanguage === 'en' ? 'bg-[#3D1629] text-[#FAF5F0] border border-[#C68B59]/40' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>ENGLISH</button>
                                <button onClick={() => props.onAppLanguageChange('esp')} className={`text-xs font-bold px-3 py-1 rounded-full transition-all font-mono ${props.appLanguage === 'esp' ? 'bg-[#3D1629] text-[#DF9E65] border border-[#C68B59]/40' : 'text-[#8A6D7B] hover:text-[#FAF5F0]'}`}>ESPAÑOL</button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={`grid grid-cols-1 ${props.isStarted ? 'max-w-4xl mx-auto' : 'lg:grid-cols-2 xl:grid-cols-3 gap-6'}`}>
                    
                    {/* === STORY TAB === */}
                    {(!props.isStarted || activeTab === 'story') && (
                        <div className="flex flex-col gap-4 text-left">
                            <div className="text-xs font-bold text-[#C68B59] uppercase tracking-widest border-b border-[#3D1629] pb-2 flex items-center justify-between font-mono">
                                <span>{labels.tabStory}</span>
                                <span className="text-[10px] text-[#8A6D7B]">NARRATIVE</span>
                            </div>
                            <div className="bg-[#150711]/90 border border-[#3D1629] p-5 shadow-2xl rounded-2xl font-sans text-left space-y-4">
                                <div>
                                    <label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1.5 font-mono">Title</label>
                                    <input type="text" value={props.comicTitle} onChange={(e) => props.onComicTitleChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-xs font-mono font-bold uppercase focus:border-[#C68B59] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1.5 font-mono">Subtitle</label>
                                    <input type="text" value={props.comicSubtitle} onChange={(e) => props.onComicSubtitleChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-xs font-bold focus:border-[#C68B59] focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1.5 font-mono">Issue #</label>
                                        <input type="text" value={props.issueNumber} onChange={(e) => props.onIssueNumberChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#DF9E65] p-2.5 rounded-xl text-xs font-mono font-bold focus:border-[#C68B59] focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1.5 font-mono">Comic Language</label>
                                        <select value={props.selectedLanguage} onChange={(e) => props.onLanguageChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-xs font-bold focus:border-[#C68B59] focus:outline-none cursor-pointer">
                                            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1.5 font-mono">Genre</label>
                                    <select value={dropdownValue} onChange={(e) => handleGenreDropdownChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-xs font-bold mb-1 focus:border-[#C68B59] focus:outline-none">
                                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    {isCustomGenreActive && (
                                        <input type="text" value={props.selectedGenre === "Custom" ? "" : props.selectedGenre} onChange={(e) => props.onGenreChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#DF9E65] text-[#DF9E65] p-2.5 rounded-xl text-xs font-bold mt-1.5 focus:outline-none" placeholder="Enter Custom Genre..." />
                                    )}
                                </div>
                                <div>
                                    <label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-1.5 font-mono">Plot Summary</label>
                                    <select value={props.selectedPlot} onChange={(e) => props.onPlotChange(e.target.value)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-xs font-bold mb-2 focus:border-[#C68B59] focus:outline-none">
                                        {currentPlots.map(p => <option key={p} value={p}>{p}</option>)}
                                        <option value="Write your own...">Write your own...</option>
                                    </select>
                                    {(props.selectedPlot === "Write your own..." || props.selectedGenre === "Custom") && (
                                        <div className="relative">
                                            <div className="absolute top-2 right-2 flex gap-1 z-10">
                                                {undoPremise && (
                                                    <button onClick={() => { props.onPremiseChange(undoPremise); setUndoPremise(undefined); }} className="bg-[#180813] text-[#FAF5F0] text-[10px] px-2 py-0.5 font-bold border border-[#3D1629] rounded">↩</button>
                                                )}
                                                <button onClick={async () => { if(!props.customPremise.trim()) return; setIsEnhancingPremise(true); const enhanced = await props.onEnhanceText(props.customPremise, "comic plot"); setUndoPremise(props.customPremise); props.onPremiseChange(enhanced); setIsEnhancingPremise(false); }} disabled={isEnhancingPremise || !props.customPremise.trim()} className="bg-[#2A0E20] text-[#DF9E65] text-[10px] px-2.5 py-0.5 font-bold border border-[#3D1629] rounded hover:border-[#DF9E65]">✨ Polish</button>
                                            </div>
                                            <textarea value={props.customPremise} onChange={(e) => props.onPremiseChange(e.target.value)} className="w-full h-24 bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-xs font-sans pt-7 focus:border-[#C68B59] focus:outline-none resize-none" placeholder="Describe the comic story arc..." />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === CAST TAB === */}
                    {(!props.isStarted || activeTab === 'cast') && (
                        <div className="flex flex-col gap-4 text-left">
                            <div className="text-xs font-bold text-[#C68B59] uppercase tracking-widest border-b border-[#3D1629] pb-2 flex items-center justify-between font-mono">
                                <span>{labels.tabCast}</span>
                                <button onClick={handleAddNewCast} className="text-[10px] bg-[#180813] hover:bg-[#230F20] text-[#DF9D64] border border-[#3D1629] hover:border-[#DF9D64] px-3 py-1 rounded-full font-bold uppercase transition-all">
                                    + Add Character
                                </button>
                            </div>
                            
                            {props.isStarted && (
                                <button onClick={props.onOpenCharacterLab} className="w-full py-3.5 btn-studio-bronze font-mono font-bold text-xs uppercase rounded-full shadow-lg">
                                    {labels.enterLab} 🧪
                                </button>
                            )}

                            <div className="bg-[#150711]/90 border border-[#3D1629] rounded-2xl p-4 grid grid-cols-1 gap-3 max-h-[700px] overflow-y-auto custom-scrollbar">
                                {allCast.map(person => (
                                    <UnifiedCastCard 
                                        key={person.id} 
                                        person={person} 
                                        clothingOptions={clothingOptions} 
                                        availableWeapons={weaponList} 
                                        onUpdate={(updates) => props.onUpdateCastMember(person.id, updates)} 
                                        onRemove={() => props.onRemoveCastMember(person.id)} 
                                        fileToBase64={props.fileToBase64} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === WORLD TAB === */}
                    {(!props.isStarted || activeTab === 'world') && (
                        <div className="flex flex-col gap-6 text-left">
                             {props.isStarted && (
                                <div className="flex flex-col gap-3">
                                    <div className="text-xs font-bold text-[#C68B59] uppercase tracking-widest border-b border-[#3D1629] pb-2 flex items-center justify-between font-mono">
                                        <span>LOCATION LIBRARY</span>
                                        <button onClick={handleAddNewLocation} className="text-[10px] bg-[#180813] text-[#DF9D64] border border-[#3D1629] hover:border-[#DF9D64] px-3 py-1 rounded-full font-bold uppercase transition-all">+ NEW</button>
                                    </div>
                                    <div className="bg-[#150711]/90 border border-[#3D1629] rounded-2xl p-4 grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto custom-scrollbar">
                                        {props.savedLocations.map(loc => (
                                            <LocationCard key={loc.id} loc={loc} onUpdate={props.onUpdateLocation} onDelete={props.onDeleteLocation} fileToBase64={props.fileToBase64} />
                                        ))}
                                        {props.savedLocations.length === 0 && <div className="text-[#8A6D7B] text-xs font-mono text-center py-4">No locations added.</div>}
                                    </div>
                                </div>
                             )}

                             <div className="flex flex-col gap-3">
                                 <div className="text-xs font-bold text-[#C68B59] uppercase tracking-widest border-b border-[#3D1629] pb-2 flex items-center justify-between font-mono">
                                     <span>THE ARMORY (WEAPONS)</span>
                                     <button onClick={() => handleAddNewItem('weapon')} className="text-[10px] bg-[#180813] text-[#DF9D64] border border-[#3D1629] hover:border-[#DF9D64] px-3 py-1 rounded-full font-bold uppercase transition-all">+ NEW WEAPON</button>
                                 </div>
                                 <div className="bg-[#150711]/90 border border-[#3D1629] rounded-2xl p-4 grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto custom-scrollbar">
                                     {weaponList.map(prop => (
                                         <PropCard key={prop.id} prop={prop} allCast={allCast} onUpdate={props.onUpdateProp} onDelete={props.onDeleteProp} fileToBase64={props.fileToBase64}/>
                                     ))}
                                     {weaponList.length === 0 && <div className="text-[#8A6D7B] text-xs font-mono text-center py-4">No weapons added.</div>}
                                 </div>
                            </div>

                             <div className="flex flex-col gap-3">
                                 <div className="text-xs font-bold text-[#C68B59] uppercase tracking-widest border-b border-[#3D1629] pb-2 flex items-center justify-between font-mono">
                                     <span>PROP STORAGE</span>
                                     <button onClick={() => handleAddNewItem('prop')} className="text-[10px] bg-[#180813] text-[#DF9D64] border border-[#3D1629] hover:border-[#DF9D64] px-3 py-1 rounded-full font-bold uppercase transition-all">+ NEW PROP</button>
                                 </div>
                                 <div className="bg-[#150711]/90 border border-[#3D1629] rounded-2xl p-4 grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar">
                                     {propList.map(prop => (
                                         <PropCard key={prop.id} prop={prop} allCast={allCast} onUpdate={props.onUpdateProp} onDelete={props.onDeleteProp} fileToBase64={props.fileToBase64}/>
                                     ))}
                                     {propList.length === 0 && <div className="text-[#8A6D7B] text-xs font-mono text-center py-4">No props added.</div>}
                                 </div>
                            </div>
                        </div>
                    )}

                    {/* === IDENTITY TAB === */}
                    {(!props.isStarted || activeTab === 'identity') && (
                        <div className="flex flex-col gap-4 text-left">
                             <div className="text-xs font-bold text-[#C68B59] uppercase tracking-widest border-b border-[#3D1629] pb-2 flex items-center justify-between font-mono">
                                 <span>{labels.tabIdentity}</span>
                                 <span className="text-[10px] text-[#8A6D7B]">BRANDING</span>
                             </div>
                             <div className="bg-[#150711]/90 border border-[#3D1629] p-5 rounded-2xl shadow-xl space-y-4">
                                 <div className="border-b border-[#3D1629] pb-4">
                                     <div className="flex justify-between items-center mb-1.5">
                                         <label className="font-bold text-[#8A6D7B] text-xs uppercase font-mono">Publisher Branding</label>
                                         <button onClick={randomizePublisher} className="text-xs text-[#DF9E65] hover:text-white font-bold uppercase font-mono">Randomize 🎲</button>
                                     </div>
                                     <input type="text" value={props.publisher.name} onChange={(e) => props.onPublisherChange({...props.publisher, name: e.target.value})} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl font-mono text-xs uppercase mb-2 focus:border-[#C68B59] focus:outline-none" placeholder="Publisher Name" />
                                     
                                     <div className="flex gap-2 mb-2">
                                         <button onClick={() => props.onPublisherChange({...props.publisher, mode: 'text'})} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg border font-mono transition-all ${props.publisher.mode !== 'image' ? 'bg-[#2A0E20] text-[#DF9D64] border-[#C68B59]' : 'bg-[#12060E] text-[#8A6D7B] border-[#3D1629]'}`}>Text Description</button>
                                         <button onClick={() => props.onPublisherChange({...props.publisher, mode: 'image'})} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg border font-mono transition-all ${props.publisher.mode === 'image' ? 'bg-[#2A0E20] text-[#DF9D64] border-[#C68B59]' : 'bg-[#12060E] text-[#8A6D7B] border-[#3D1629]'}`}>Upload Logo</button>
                                     </div>

                                     {props.publisher.mode === 'image' ? (
                                        <div className="border border-dashed border-[#3D1629] hover:border-[#C68B59] bg-[#12060E] rounded-xl p-3 flex flex-col items-center justify-center relative group min-h-[90px] transition-colors">
                                            {props.publisher.logoImage ? (
                                                <div className="w-full h-20 relative">
                                                    <img src={`data:image/jpeg;base64,${props.publisher.logoImage}`} className="w-full h-full object-contain" />
                                                    <button onClick={() => props.onPublisherChange({...props.publisher, logoImage: undefined})} className="absolute top-0 right-0 bg-rose-600 text-white text-xs px-2 py-0.5 rounded font-bold">✕</button>
                                                </div>
                                            ) : (
                                                <div className="text-[#8A6D7B] font-mono text-xs font-bold text-center">Click to upload publisher logo</div>
                                            )}
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { if(e.target.files?.[0]) { const b64 = await props.fileToBase64(e.target.files[0]); props.onPublisherChange({...props.publisher, logoImage: b64}); } }} />
                                        </div>
                                     ) : (
                                         <div className="relative">
                                             <div className="absolute top-2 right-2 flex gap-1 z-10">
                                                 {undoLogo && (
                                                     <button onClick={() => { props.onPublisherChange({...props.publisher, logoDescription: undoLogo}); setUndoLogo(undefined); }} className="bg-[#180813] text-white text-[10px] px-2 py-0.5 font-bold border border-[#3D1629] rounded">↩</button>
                                                 )}
                                                 <button onClick={async () => { if(!props.publisher.logoDescription.trim()) return; setIsEnhancingLogo(true); const enhanced = await props.onEnhanceText(props.publisher.logoDescription, "logo desc"); setUndoLogo(props.publisher.logoDescription); props.onPublisherChange({...props.publisher, logoDescription: enhanced}); setIsEnhancingLogo(false); }} disabled={isEnhancingLogo || !props.publisher.logoDescription.trim()} className="bg-[#2A0E20] text-[#DF9E65] text-[10px] px-2 py-0.5 font-bold border border-[#3D1629] rounded hover:border-[#DF9E65]">✨ Polish</button>
                                             </div>
                                             <input type="text" value={props.publisher.logoDescription} onChange={(e) => props.onPublisherChange({...props.publisher, logoDescription: e.target.value})} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl text-xs font-sans pr-16 focus:border-[#C68B59] focus:outline-none" placeholder="Shield crest, lightning bolt, retro badge..." />
                                         </div>
                                     )}
                                 </div>
                                 
                                 <div>
                                     <label className="font-bold text-[#8A6D7B] text-xs uppercase block mb-2 font-mono">Title Art & Font (Cover)</label>
                                     <div className="grid grid-cols-2 gap-3">
                                         <div>
                                             <span className="text-[10px] text-[#8A6D7B] font-mono block mb-1">Placement</span>
                                             <div className="flex gap-1">
                                                 <button onClick={() => props.onPublisherChange({...props.publisher, titlePlacement: 'top'})} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg border font-mono transition-all ${props.publisher.titlePlacement !== 'bottom' ? 'bg-[#2A0E20] text-[#DF9D64] border-[#C68B59]' : 'bg-[#12060E] text-[#8A6D7B] border-[#3D1629]'}`}>Top</button>
                                                 <button onClick={() => props.onPublisherChange({...props.publisher, titlePlacement: 'bottom'})} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg border font-mono transition-all ${props.publisher.titlePlacement === 'bottom' ? 'bg-[#2A0E20] text-[#DF9D64] border-[#C68B59]' : 'bg-[#12060E] text-[#8A6D7B] border-[#3D1629]'}`}>Bottom</button>
                                             </div>
                                         </div>
                                         <div>
                                             <span className="text-[10px] text-[#8A6D7B] font-mono block mb-1">Style Preset</span>
                                             <select value={props.publisher.titleStyle || ""} onChange={(e) => props.onPublisherChange({...props.publisher, titleStyle: e.target.value})} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2 rounded-xl text-xs font-bold font-mono outline-none">
                                                 <option value="">Default Classic</option>
                                                 {TITLE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                             </select>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* === SYSTEM TAB === */}
                    {(!props.isStarted || activeTab === 'system') && (
                        <div className="flex flex-col gap-4 text-left">
                            <div className="text-xs font-bold text-[#C68B59] uppercase tracking-widest border-b border-[#3D1629] pb-2 flex items-center justify-between font-mono">
                                <span>{labels.tabSystem}</span>
                                <span className="text-[10px] text-[#8A6D7B]">ENGINE</span>
                            </div>
                            <div className="bg-[#150711]/90 border border-[#3D1629] p-5 rounded-2xl shadow-xl font-sans space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] text-[#8A6D7B] font-mono uppercase block mb-1">Resolution</span>
                                        <select value={props.selectedResolution} onChange={(e) => props.onResolutionChange(e.target.value as Resolution)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2 rounded-xl text-xs font-bold font-mono outline-none">
                                            <option value="1K">1K (Standard)</option>
                                            <option value="2K">2K (High)</option>
                                            <option value="4K">4K (Ultra)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-[#8A6D7B] font-mono uppercase block mb-1">Aspect Ratio</span>
                                        <select value={props.selectedAspectRatio} onChange={(e) => props.onAspectRatioChange(e.target.value as AspectRatio)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2 rounded-xl text-xs font-bold font-mono outline-none">
                                            {ASPECT_RATIOS.map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-[#8A6D7B] font-mono uppercase block mb-1">Page Borders</span>
                                        <select value={props.borderColor} onChange={(e) => props.onBorderColorChange(e.target.value as BorderColor)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2 rounded-xl text-xs font-bold font-mono outline-none">
                                            <option value="white">White Border</option>
                                            <option value="black">Black Border</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-[#8A6D7B] font-mono uppercase block mb-1">Model Engine</span>
                                        <select value={props.imageModel} onChange={(e) => props.onImageModelChange(e.target.value as ImageModel)} className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2 rounded-xl text-xs font-bold font-mono outline-none">
                                            {IMAGE_MODEL_OPTIONS.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 bg-[#1B0A16] border border-[#3D1629] rounded-xl">
                                    <div>
                                        <span className="text-xs font-bold text-[#FAF5F0] font-mono block">Show Page Overlays</span>
                                        <span className="text-[10px] text-[#8A6D7B]">Display page markers and badges</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={props.showOverlays} onChange={(e) => props.onShowOverlaysChange(e.target.checked)} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-[#12060E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#DF9D64] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2A0E20]"></div>
                                    </label>
                                </div>

                                <div className="bg-[#2A0E20]/60 border border-[#3D1629] p-3 rounded-xl">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={props.isMatureMode} onChange={(e) => props.onMatureModeChange(e.target.checked)} className="accent-[#DF9E65] w-4 h-4 rounded" />
                                        <div>
                                            <span className="block text-[#DF9E65] font-bold text-xs uppercase font-mono">Mature Mode (Gritty Themes)</span>
                                            <span className="block text-[10px] text-[#8A6D7B]">Enables darker noir / horror narrative tone.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!props.isStarted && (
                    <div className="flex flex-col items-center gap-5 mt-10 max-w-xl mx-auto border-t border-[#3D1629] pt-8">
                        <button 
                            onClick={props.onLaunch} 
                            className="btn-studio-bronze text-sm md:text-base px-12 py-4 rounded-full shadow-[0_0_30px_rgba(212,154,90,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] font-mono uppercase tracking-widest"
                        >
                            {labels.startAdventure}
                        </button>
                        
                        <div className="flex gap-3">
                             <button onClick={() => setShowSaveChoice(true)} className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-5 py-2.5 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase font-mono">{labels.saveConfig}</button>
                             <label className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-5 py-2.5 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase cursor-pointer font-mono">{labels.loadConfig}<input type="file" accept=".json,.cbs" onChange={(e) => e.target.files?.[0] && props.onLoadConfig(e.target.files[0])} className="hidden" /></label>
                        </div>
                    </div>
                )}
                
                {props.isStarted && (
                    <div className="flex justify-center gap-3 mt-6 flex-wrap font-sans border-t border-[#3D1629] pt-6">
                         <button onClick={() => setShowSaveChoice(true)} className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase font-mono">{labels.saveConfig}</button>
                         <label className="bg-[#150711] text-[#FAF5F0] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase cursor-pointer font-mono">{labels.loadConfig}<input type="file" accept=".json,.cbs" onChange={(e) => e.target.files?.[0] && props.onLoadConfig(e.target.files[0])} className="hidden" /></label>
                         <button onClick={() => setShowQuota(true)} className="bg-[#150711] text-[#DF9E65] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase font-mono">⚡ {labels.apiQuota}</button>
                         <button onClick={() => setShowAbout(true)} className="bg-[#150711] text-[#EADDE2] text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-[#C68B59]/50 uppercase font-mono">{labels.about}</button>
                         <button onClick={props.onReset} className="bg-[#2A0E20] text-rose-300 text-xs font-bold px-4 py-2 rounded-full border border-[#3D1629] hover:border-rose-500 uppercase ml-auto font-mono">{labels.nuclearReset}</button>
                    </div>
                )}
          </div>
        </div>
        </>
    );
};
