/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ComicFace, PublisherConfig, BorderColor, AspectRatio } from './types';
import { Panel } from './Panel';

interface BookProps {
    comicFaces: ComicFace[];
    currentSheetIndex: number;
    totalPages: number;
    isStarted: boolean;
    isSetupVisible: boolean;
    publisher: PublisherConfig;
    onSheetClick: (pageIndex: number) => void;
    displayMode: 'single' | 'double';
    activeEditSide: 'left' | 'right';
    borderColor: BorderColor;
    issueNumber: string;
    showOverlays: boolean; 
    defaultAspectRatio?: AspectRatio;
}

export const Book: React.FC<BookProps> = (props) => {
    // Spread calculation
    const leftIdx = (props.currentSheetIndex * 2) - 1;
    const rightIdx = props.currentSheetIndex * 2;

    const leftFace = props.comicFaces.find(f => f.pageIndex === leftIdx);
    const rightFace = props.comicFaces.find(f => f.pageIndex === rightIdx);

    const showLeft = leftIdx > 0;
    const showRight = true;

    let renderLeft = false;
    let renderRight = false;

    if (props.currentSheetIndex === 0) {
        renderRight = true;
    } else {
        if (props.displayMode === 'double') {
            renderLeft = true;
            renderRight = true;
        } else {
            if (props.activeEditSide === 'left') renderLeft = true;
            else renderRight = true;
        }
    }

    const getAspectRatioStyles = (face?: ComicFace) => {
        const ratio = face?.aspectRatio || props.defaultAspectRatio || '3:4';
        const [w, h] = ratio.split(':').map(Number);
        const ratioMultiplier = w / h;
        
        return {
            height: 'var(--page-height)',
            width: `calc(var(--page-height) * ${ratioMultiplier})`
        };
    };

    if (!props.isStarted && props.isSetupVisible) return null;

    return (
        <div className="flex gap-4 items-center justify-center w-full h-full transition-all duration-300">
            
            {/* LEFT PAGE CONTAINER */}
            {renderLeft && showLeft && (
                <div 
                    className="relative shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-transform hover:scale-[1.01] cursor-pointer"
                    style={getAspectRatioStyles(leftFace)}
                    onClick={(e) => { e.stopPropagation(); props.onSheetClick(leftIdx); }}
                >
                     {/* Page Number Label */}
                     {props.showOverlays && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2A0E20] text-[#DF9D64] text-[10px] px-3 py-0.5 rounded-full font-mono font-bold border border-[#3D1629] whitespace-nowrap z-[40] shadow-md">
                            PAGE {leftIdx}
                        </div>
                     )}
                     
                     {/* Content */}
                     <Panel face={leftFace} publisher={props.publisher} borderColor={props.borderColor} issueNumber={props.issueNumber} showOverlays={props.showOverlays} />
                </div>
            )}

            {/* RIGHT PAGE CONTAINER */}
            {renderRight && (
                 <div 
                    className="relative shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-transform hover:scale-[1.01] cursor-pointer"
                    style={getAspectRatioStyles(rightFace)}
                    onClick={(e) => { e.stopPropagation(); props.onSheetClick(rightIdx); }}
                >
                     {/* Page Number Label */}
                     {props.showOverlays && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2A0E20] text-[#DF9D64] text-[10px] px-3 py-0.5 rounded-full font-mono font-bold border border-[#3D1629] whitespace-nowrap z-[40] shadow-md">
                            {rightIdx === 0 ? 'COVER' : `PAGE ${rightIdx}`}
                        </div>
                     )}

                     {/* Content */}
                     <Panel face={rightFace} publisher={props.publisher} borderColor={props.borderColor} issueNumber={props.issueNumber} showOverlays={props.showOverlays} />
                </div>
            )}
        </div>
    );
};
