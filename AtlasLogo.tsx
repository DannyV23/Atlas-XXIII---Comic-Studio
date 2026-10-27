import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'symbol';
  variant?: 'full' | 'symbol' | 'comicstudio';
  subtitle?: string;
}

export const AtlasLogo: React.FC<Props> = ({ 
  className = '', 
  size = 'md', 
  variant, 
}) => {
  if (variant === 'symbol' || size === 'symbol') {
    return (
      <div className={`flex items-center justify-start select-none ${className}`}>
        <img 
          src="/assets/logos_v3/AtlasXXIII_symbol_lightversion.png" 
          alt="Atlas XXIII Symbol" 
          className="h-8 md:h-9 object-contain filter drop-shadow-[0_2px_12px_rgba(212,154,90,0.4)] transition-all hover:scale-110"
        />
      </div>
    );
  }

  const isSmall = size === 'sm';

  if (isSmall) {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img 
          src="/assets/logos_v3/AtlasXXIII_main_prevector_lightversion_v3.png" 
          alt="Atlas XXIII" 
          className="h-7 md:h-8 object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <img 
        src="/assets/logos_v3/AtlasXXIII_comicstudio_prevector_lightversion_v3.png" 
        alt="Atlas XXIII Comic Studio" 
        className="h-20 sm:h-28 md:h-36 object-contain filter drop-shadow-[0_4px_30px_rgba(212,154,90,0.25)] transition-transform duration-300 hover:scale-[1.01]"
      />
    </div>
  );
};
