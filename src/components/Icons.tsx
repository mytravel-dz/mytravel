import React from 'react';

export const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width={size} 
    height={size} 
    className={className}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 3.1-.12 6.19-.13 9.29-.01 1.21-.29 2.45-.91 3.5-1.15 2.04-3.51 3.12-5.75 2.85-2.22-.21-4.22-1.7-5.04-3.8-.84-2.04-.36-4.57 1.22-6.13.9-.92 2.1-1.52 3.36-1.74.01 1.46.02 2.91.01 4.37-.8-.11-1.65.06-2.3.57-.75.54-1.1 1.54-.85 2.44.22.95 1.1 1.7 2.08 1.76 1.05.08 2.1-.5 2.53-1.47.28-.6.27-1.28.27-1.94-.01-4.74 0-9.48-.01-14.22z"/>
  </svg>
);

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`aspect-square rounded-full flex items-center justify-center overflow-hidden bg-brand relative group ${className}`}>
    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-white fill-current relative z-10 drop-shadow-lg">
      {/* Stylized Script M */}
      <path 
        d="M20 65 C 20 65, 25 30, 45 30 C 55 30, 50 60, 60 60 C 70 60, 75 35, 85 35" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        className="animate-draw"
      />
      {/* Plane at the end of the stroke */}
      <path d="M84 31 L94 35 L84 39 L87 35 Z" className="animate-float" />
      {/* Small trail connecting M to plane */}
      <path d="M85 35 C 86 34, 86.5 33, 87 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);
