import React, { useState, useEffect } from 'react';
import { Persona } from './types';
import { AtlasBackground, AtlasFooter } from './AtlasBackgroundAndFooter';

interface CharacterGenProps {
    cast: Persona[];
    onGenerateSheet: (id: string) => Promise<string>;
    onUpdateCast: (id: string, updates: Partial<Persona>) => void;
    onFinish: () => void;
    onError: (e: any) => void;
    onCancel: () => void;
}

export const CharacterGen: React.FC<CharacterGenProps> = ({ cast, onGenerateSheet, onUpdateCast, onFinish, onError, onCancel }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [generatingIds, setGeneratingIds] = useState<Record<string, boolean>>({});
    const [generatedSheets, setGeneratedSheets] = useState<Record<string, string>>({});

    const activePerson = cast[currentIndex];
    const isLast = currentIndex === cast.length - 1;
    const isFirst = currentIndex === 0;

    useEffect(() => {
        if (activePerson && activePerson.characterSheet) {
            setGeneratedSheets(prev => ({ ...prev, [activePerson.id]: activePerson.characterSheet! }));
        }
    }, [activePerson]);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleUploadSheet = async (file: File) => {
        if (!activePerson) return;
        try {
            const b64 = await fileToBase64(file);
            setGeneratedSheets(prev => ({ ...prev, [activePerson.id]: b64 }));
            onUpdateCast(activePerson.id, { characterSheet: b64 });
        } catch (e) {
            console.error("Upload failed", e);
        }
    };

    const handleDownloadSheet = () => {
        if (!activePerson || !generatedSheets[activePerson.id]) return;
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${generatedSheets[activePerson.id]}`;
        link.download = `${activePerson.name}_RefSheet.jpg`;
        link.click();
    };

    const handleGenerate = async () => {
        if (!activePerson) return;
        const id = activePerson.id;
        setGeneratingIds(prev => ({ ...prev, [id]: true }));
        try {
            const b64 = await onGenerateSheet(id);
            setGeneratedSheets(prev => ({ ...prev, [id]: b64 }));
            onUpdateCast(id, { characterSheet: b64 });
        } catch (e) {
            if (e && (e === 'Cancelled' || (e instanceof Error && e.message === 'Cancelled'))) {
                return;
            }
            console.error("Character Gen Error:", e);
            onError(e);
        } finally {
            setGeneratingIds(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleNext = () => {
        if (isLast) {
            onFinish();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirst) setCurrentIndex(prev => prev - 1);
    };

    if (!activePerson) return null;

    return (
        <div className="fixed inset-0 bg-[#0E070C] text-[#FAF5F0] z-[250] overflow-hidden flex flex-col font-sans select-none">
            <AtlasBackground />

            {/* HEADER */}
            <div className="relative z-10 bg-[#150711]/90 backdrop-blur-xl border-b border-[#3D1629] p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DF9E65]" />
                        <h1 className="text-xl md:text-2xl font-cinzel font-bold text-[#FAF5F0] tracking-wide">
                            CHARACTER CONSISTENCY LAB
                        </h1>
                    </div>
                    <div className="hidden md:flex gap-1.5 ml-4">
                        {cast.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    idx === currentIndex 
                                        ? 'bg-[#DF9E65] w-6' 
                                        : 'bg-[#3D1629]'
                                }`} 
                            />
                        ))}
                    </div>
                </div>
                <button 
                    onClick={onFinish}
                    className="text-[#8A6D7B] hover:text-[#FAF5F0] font-bold text-xs border border-[#3D1629] hover:border-[#C68B59] px-4 py-2 rounded-full uppercase transition-all"
                >
                    Exit Lab &rarr;
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
                
                {/* LEFT: CONTROLS */}
                <div className="w-full md:w-[400px] bg-[#150711]/95 backdrop-blur-xl border-r border-[#3D1629] p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar shadow-2xl">
                    <div className="flex items-center gap-4 border-b border-[#3D1629] pb-4">
                        <div className="w-16 h-16 rounded-2xl border border-[#3D1629] bg-[#1B0A16] overflow-hidden shrink-0">
                            {activePerson.base64 ? (
                                <img src={`data:image/jpeg;base64,${activePerson.base64}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#1B0A16]" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl text-[#FAF5F0] font-bold font-comic leading-none">{activePerson.name}</h2>
                            <span className="text-[10px] text-[#DF9E65] font-sans font-bold uppercase bg-[#2A0E20] px-2.5 py-0.5 rounded-full border border-[#3D1629] mt-1.5 inline-block">
                                {activePerson.role}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 text-xs font-sans">
                        <div>
                            <label className="text-xs text-[#8A6D7B] font-bold uppercase mb-1.5 block">Costume & Appearance</label>
                            <textarea 
                                value={activePerson.clothing}
                                onChange={(e) => onUpdateCast(activePerson.id, { clothing: e.target.value })}
                                className="w-full h-32 bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-3 rounded-xl focus:border-[#C68B59] focus:outline-none resize-none transition-colors"
                                placeholder="Describe costume details..."
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#8A6D7B] font-bold uppercase mb-1.5 block">Weapon / Signature Item</label>
                            <input 
                                value={activePerson.weapon || ''}
                                onChange={(e) => onUpdateCast(activePerson.id, { weapon: e.target.value })}
                                className="w-full bg-[#1B0A16] border border-[#3D1629] text-[#FAF5F0] p-2.5 rounded-xl focus:border-[#C68B59] focus:outline-none transition-colors"
                                placeholder="Item name..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {generatingIds[activePerson.id] ? (
                             <button 
                                onClick={onCancel}
                                className="w-full py-3.5 text-xs rounded-full border border-red-500 font-bold uppercase bg-red-950/40 text-red-200 animate-pulse hover:bg-red-900 transition-colors"
                             >
                                ⛔ Cancel Generation
                             </button>
                        ) : (
                            <button 
                                onClick={handleGenerate}
                                className="w-full py-4 text-xs bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(198,139,89,0.3)] hover:brightness-110 active:scale-95 transition-all"
                            >
                                {generatedSheets[activePerson.id] ? 'Regenerate Reference Sheet' : 'Generate Reference Sheet'}
                            </button>
                        )}

                        <label className="w-full py-3 text-xs border border-[#3D1629] text-[#EADDE2] font-semibold uppercase tracking-wider rounded-full hover:bg-[#1B0A16] hover:border-[#C68B59]/50 transition-all text-center cursor-pointer">
                            Upload Existing Sheet
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadSheet(e.target.files[0])} />
                        </label>
                    </div>
                </div>

                {/* RIGHT: PREVIEW STAGE */}
                <div className="flex-1 bg-[#0E070C] relative flex items-center justify-center p-6 md:p-10">
                    {generatingIds[activePerson.id] ? (
                        <div className="flex flex-col items-center animate-pulse text-center">
                            <div className="w-16 h-16 rounded-full bg-[#2A0E20] border border-[#3D1629] flex items-center justify-center text-3xl mb-4">
                                🎨
                            </div>
                            <div className="text-lg text-[#DF9E65] font-bold uppercase tracking-wider font-comic">Constructing Sheet...</div>
                            <div className="text-xs text-[#8A6D7B] font-sans mt-2">Front • Profile • Expressions • Back View</div>
                        </div>
                    ) : generatedSheets[activePerson.id] ? (
                        <div className="relative w-full h-full flex items-center justify-center border border-[#3D1629] bg-[#150711] rounded-[24px] overflow-hidden shadow-2xl group">
                            <img 
                                src={`data:image/jpeg;base64,${generatedSheets[activePerson.id]}`} 
                                className="w-full h-full object-contain" 
                                alt="Reference Sheet"
                            />
                            <div className="absolute bottom-4 right-4 bg-[#2A0E20] text-[#DF9E65] px-4 py-1.5 rounded-full border border-[#3D1629] font-bold text-xs uppercase shadow-lg">
                                Saved to Profile
                            </div>
                            
                            <button 
                                onClick={handleDownloadSheet}
                                className="absolute top-4 right-4 bg-[#150711]/90 text-[#FAF5F0] border border-[#3D1629] hover:border-[#C68B59] px-4 py-2 rounded-full font-bold text-xs uppercase transition-colors shadow-lg flex items-center gap-2"
                            >
                                <span>⬇</span> Download Sheet
                            </button>
                        </div>
                    ) : (
                        <div className="border border-dashed border-[#3D1629] rounded-[28px] w-full h-full flex flex-col items-center justify-center text-[#8A6D7B]">
                            <div className="w-16 h-16 rounded-full bg-[#150711] border border-[#3D1629] flex items-center justify-center text-2xl mb-4">
                                👤
                            </div>
                            <h3 className="text-lg font-bold text-[#EADDE2] font-comic uppercase">No Sheet Generated</h3>
                            <p className="font-sans text-xs mt-2 max-w-sm text-center">Click 'Generate Reference Sheet' to synthesize a multi-angle visual profile for {activePerson.name}.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER NAV */}
            <div className="bg-[#150711]/90 backdrop-blur-xl border-t border-[#3D1629] p-4 px-8 flex justify-between items-center z-20 font-sans">
                <button 
                    onClick={handlePrev}
                    disabled={isFirst}
                    className="text-[#FAF5F0] border border-[#3D1629] hover:border-[#C68B59] px-6 py-2 rounded-full text-xs font-bold uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    &larr; Previous
                </button>

                <div className="text-[#8A6D7B] font-bold text-xs hidden md:block uppercase tracking-wider">
                    Character {currentIndex + 1} of {cast.length}
                </div>

                <button 
                    onClick={handleNext}
                    className="bg-gradient-to-r from-[#B97743] via-[#C98A55] to-[#DF9D64] text-[#12060C] font-bold text-xs px-8 py-2.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(198,139,89,0.3)] hover:brightness-110 active:scale-95 transition-all"
                >
                    {isLast ? 'Finish & Return' : 'Next Character'} &rarr;
                </button>
            </div>

            <AtlasFooter />
        </div>
    );
};
