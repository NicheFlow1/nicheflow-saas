import React from 'react';

export function NicheFlowLogoFull({ size = 40 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nfg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#nfg1)"/>
      <rect width="40" height="40" rx="12" fill="url(#nfg1)" opacity="0.8"/>
      <path d="M20 7 L14.5 20 L20.5 20 L17 33 L27.5 17 L21.5 17 L25 7 Z" fill="white" filter="url(#glow)" opacity="0.97"/>
      <circle cx="9" cy="13" r="2.5" fill="white" opacity="0.35"/>
      <circle cx="31" cy="28" r="2" fill="white" opacity="0.25"/>
      <path d="M8 28 Q12 24 16 26" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" fill="none"/>
    </svg>
  );
}

export function NicheFlowIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nfi1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="7" fill="url(#nfi1)"/>
      <path d="M12 4 L9 12 L13 12 L11 20 L18 10 L14 10 L16 4 Z" fill="white" opacity="0.95"/>
    </svg>
  );
}

export default NicheFlowLogoFull;
