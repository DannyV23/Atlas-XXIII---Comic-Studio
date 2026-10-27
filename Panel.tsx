/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ComicFace, PublisherConfig, BorderColor } from './types';
import { LoadingFX } from './LoadingFX';

interface PanelProps {
    face?: ComicFace;
    publisher?: PublisherConfig;
    borderColor?: BorderColor;
    showOverlays?: boolean; 
    issueNumber?: string; 
}

export const Panel: React.FC<PanelProps> = ({ 
    face, 
    borderColor = 'white' 
}) => {
    const bgClass = borderColor === 'white' ? 'bg-white' : 'bg-black';
    const borderClass = borderColor === 'white' ? 'border-gray-200' : 'border-[#3D1629]';
    const textClass = borderColor === 'white' ? 'text-gray-400' : 'text-[#8A6D7B]';

    if (!face) {
        return (
            <div className={`w-full h-full ${bgClass} border ${borderClass} flex items-center justify-center ${textClass} font-mono font-bold text-sm tracking-wider uppercase`}>
                EMPTY PAGE
            </div>
        );
    }

    if (face.isLoading && !face.imageUrl) {
        return <LoadingFX />;
    }
    
    const isFullBleed = face.type === 'cover' || face.type === 'back_cover';

    // Dynamic padding for panel container based on border color selection
    const containerStyle = borderColor === 'black' ? { backgroundColor: '#000', padding: '12px' } : { backgroundColor: '#fff', padding: '12px' };
    
    return (
        <div 
            className={`panel-container relative group ${isFullBleed ? 'full-bleed' : ''}`}
            style={isFullBleed ? {} : containerStyle}
        >
            <div className="gloss"></div>
            
            {/* Static Image Layer */}
            {face.imageUrl ? (
                <img 
                    src={face.imageUrl} 
                    alt="Comic panel" 
                    className="panel-image relative z-10" 
                    style={{ backgroundColor: borderColor === 'black' ? '#000' : '#fff' }} 
                />
            ) : !face.isLoading && (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-[#150711] border border-[#3D1629] z-10 p-6 text-center">
                     <span className="text-3xl mb-2">⚠️</span>
                     <span className="text-[#DF9E65] font-mono text-xs font-bold tracking-wider uppercase mb-1">
                         Awaiting Synthesis
                     </span>
                     <span className="text-[#8A6D7B] font-sans text-xs max-w-xs leading-relaxed">
                         Click Generate Page in the studio sidebar to render this panel with the active Gemini model.
                     </span>
                 </div>
            )}
        </div>
    );
};
