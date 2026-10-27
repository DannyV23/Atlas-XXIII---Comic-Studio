import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'symbol';
  variant?: 'full' | 'symbol';
  subtitle?: string;
}

export const AtlasLogo: React.FC<Props> = ({ 
  className = '', 
  size = 'md', 
  variant, 
  subtitle = 'COMIC STUDIO' 
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
        src="/assets/logos_v3/AtlasXXIII_main_prevector_lightversion_v3.png" 
        alt="Atlas XXIII" 
        className="h-16 sm:h-20 md:h-24 object-contain filter drop-shadow-[0_4px_25px_rgba(212,154,90,0.3)] transition-transform duration-300 hover:scale-[1.01]"
      />
      {subtitle && (
        <div className="mt-2 flex items-center gap-2 tracking-[0.35em] text-xs font-mono font-bold text-[#DF9D64] uppercase drop-shadow-[0_0_15px_rgba(223,157,100,0.4)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DF9D64] animate-pulse" />
          <span>{subtitle}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DF9D64] animate-pulse" />
        </div>
      )}
    </div>
  );
};
