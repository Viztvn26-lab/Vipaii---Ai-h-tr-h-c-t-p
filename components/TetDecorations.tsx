import React from 'react';

export const Lantern: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg viewBox="0 0 100 120" className={`w-12 h-16 drop-shadow-md ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 0V10" stroke="#FCD34D" strokeWidth="2"/>
    <rect x="20" y="10" width="60" height="80" rx="20" fill="#DC2626" />
    <path d="M20 20H80" stroke="#FCA5A5" strokeWidth="1" strokeOpacity="0.5"/>
    <path d="M20 80H80" stroke="#FCA5A5" strokeWidth="1" strokeOpacity="0.5"/>
    <path d="M50 10V90" stroke="#FCA5A5" strokeWidth="1" strokeOpacity="0.5"/>
    <path d="M50 90V120" stroke="#FCD34D" strokeWidth="2"/>
    <circle cx="50" cy="90" r="4" fill="#FCD34D"/>
    <rect x="30" y="30" width="40" height="40" rx="5" fill="#B91C1C"/>
    <text x="50" y="58" fontSize="24" textAnchor="middle" fill="#FCD34D" className="font-hand">Phúc</text>
  </svg>
);

export const ApricotBlossom: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg viewBox="0 0 100 100" className={`w-10 h-10 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 50L50 10M50 50L85 30M50 50L85 70M50 50L50 90M50 50L15 70M50 50L15 30" stroke="#78350F" strokeWidth="2"/>
    <circle cx="50" cy="10" r="8" fill="#FCD34D"/>
    <circle cx="85" cy="30" r="8" fill="#FCD34D"/>
    <circle cx="85" cy="70" r="8" fill="#FCD34D"/>
    <circle cx="50" cy="90" r="8" fill="#FCD34D"/>
    <circle cx="15" cy="70" r="8" fill="#FCD34D"/>
    <circle cx="15" cy="30" r="8" fill="#FCD34D"/>
    <circle cx="50" cy="50" r="6" fill="#F59E0B"/>
  </svg>
);

export const PeachBlossom: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg viewBox="0 0 100 100" className={`w-10 h-10 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 50L50 10M50 50L85 30M50 50L85 70M50 50L50 90M50 50L15 70M50 50L15 30" stroke="#5D4037" strokeWidth="2"/>
    <circle cx="50" cy="10" r="8" fill="#F48FB1"/>
    <circle cx="85" cy="30" r="8" fill="#F48FB1"/>
    <circle cx="85" cy="70" r="8" fill="#F48FB1"/>
    <circle cx="50" cy="90" r="8" fill="#F48FB1"/>
    <circle cx="15" cy="70" r="8" fill="#F48FB1"/>
    <circle cx="15" cy="30" r="8" fill="#F48FB1"/>
    <circle cx="50" cy="50" r="6" fill="#D81B60"/>
  </svg>
);

export const Couplet: React.FC<{ text: string, side: 'left' | 'right' }> = ({ text, side }) => (
  <div className={`hidden lg:flex fixed top-1/4 ${side === 'left' ? 'left-4' : 'right-4'} z-10 flex-col items-center p-2 bg-red-700 border-2 border-yellow-400 rounded-lg shadow-xl`}>
    <div className="w-4 h-4 rounded-full bg-yellow-400 mb-2 border-2 border-red-800"></div>
    <div className="flex flex-col space-y-4 py-4 px-2 bg-red-600 border border-red-500 shadow-inner">
      {text.split('').map((char, index) => (
        <span key={index} className="font-hand text-3xl text-yellow-300 font-bold drop-shadow-md transform hover:scale-110 transition-transform cursor-default">
          {char}
        </span>
      ))}
    </div>
    <div className="w-12 h-12 mt-2">
      <ApricotBlossom className="w-full h-full animate-spin-slow" />
    </div>
  </div>
);

export const TetBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/oriental-tiles.png')]"></div>
  </div>
);