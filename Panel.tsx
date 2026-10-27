/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState } from 'react';
import { ComicFace, PublisherConfig, BorderColor } from './types';
import { LoadingFX } from './LoadingFX';

interface PanelProps {
    face?: ComicFace;
    publisher?: PublisherConfig;
    borderColor?: BorderColor;
    showOverlays?: boolean; 
    issueNumber?: string; 
}

export const Panel: React.FC<PanelProps> = ({ face, publisher, borderColor = 'white', showOverlays = false, issueNumber }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    
    const bgClass = borderColor === 'white' ? 'bg-white' : 'bg-black';
    const borderClass = borderColor === 'white' ? 'border-gray-200' : 'border-zinc-800';
    const textClass = borderColor === 'white' ? 'text-gray-300' : 'text-gray-600';

    if (!face) return <div className={`w-full h-full ${bgClass} border ${borderClass} flex items-center justify-center ${textClass} font-comic text-2xl`}>EMPTY PAGE</div>;
    if (face.isLoading && !face.imageUrl) return <LoadingFX />;
    
    const isFullBleed = face.type === 'cover' || face.type === 'back_cover';

    const handleMouseEnter = () => {
        if (face.videoUrl && videoRef.current) {
            setIsHovering(true);
            videoRef.current.play().catch(e => console.log("Autoplay blocked or interrupted", e));
        }
    };

    const handleMouseLeave = () => {
        if (face.videoUrl && videoRef.current) {
            setIsHovering(false);
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Reset to start
        }
    };

    // Dynamic padding for panel container based on border color selection
    const containerStyle = borderColor === 'black' ? { backgroundColor: '#000', padding: '12px' } : { backgroundColor: '#fff', padding: '12px' };
    
    return (
        <div 
            className={`panel-container relative group ${isFullBleed ? 'full-bleed' : ''}`}
            style={isFullBleed ? {} : containerStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="gloss"></div>
            
            {/* Static Image Layer */}
            {face.imageUrl ? (
                <img src={face.imageUrl} alt="Comic panel" className="panel-image relative z-10" style={{ backgroundColor: borderColor === 'black' ? '#000' : '#fff' }} />
            ) : !face.isLoading && (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border-2 border-dashed border-red-500 z-10 p-4">
                     <span className="text-4xl mb-2">⚠️</span>
                     <span className="text-red-500 font-comic text-xl text-center uppercase">NO IMAGE GENERATED</span>
                     <span className="text-gray-500 font-sans text-xs text-center mt-2">Check prompt or try regenerating. API might have blocked content or failed.</span>
                 </div>
            )}

            {/* Video Layer (Overlay) */}
            {face.videoUrl && (
                <video
                    ref={videoRef}
                    src={face.videoUrl}
                    muted
                    loop
                    className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                    style={{ pointerEvents: 'none' }} // Let clicks pass through to book handler
                />
            )}
            
            {/* Video Indicator (HIDE IF OVERLAYS DISABLED) */}
            {face.videoUrl && showOverlays && (
                <div className={`absolute bottom-2 left-2 z-30 bg-black/80 text-white p-1 rounded border border-white transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-xl">🎬</span>
                </div>
            )}
        </div>
    );
}