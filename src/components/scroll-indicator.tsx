export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      {/* Desktop - Mouse Scroll Animation */}
      <div className="hidden md:flex flex-col items-center gap-2 animate-fade-in">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2 hover:border-white/80 transition-all">
          <div className="w-1 h-2 bg-white/80 rounded-full animate-mouse-scroll" />
        </div>
        <span className="text-white/70 text-sm">Scroll Down</span>
      </div>

      {/* Mobile - Finger Scroll Animation */}
      <div className="md:hidden flex flex-col items-center gap-3 animate-fade-in">
        <div className="relative w-10 h-14 flex items-center justify-center">
          {/* Hand/Finger SVG with swipe animation */}
          <svg 
            className="w-10 h-14 animate-finger-scroll drop-shadow-lg" 
            viewBox="0 0 40 56" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Palm base */}
            <ellipse cx="20" cy="44" rx="8" ry="6" fill="white" fillOpacity="0.9" />
            
            {/* Index finger - main pointing finger */}
            <path
              d="M20 10 C18 10, 17 12, 17 14 L17 32 C17 34, 18 35, 20 35 C22 35, 23 34, 23 32 L23 14 C23 12, 22 10, 20 10 Z"
              fill="white"
              fillOpacity="0.95"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            
            {/* Fingertip rounded */}
            <circle cx="20" cy="10" r="3.5" fill="white" fillOpacity="0.95" />
            
            {/* Finger nail highlight */}
            <ellipse cx="20" cy="9" rx="1.5" ry="1" fill="white" fillOpacity="0.6" />
            
            {/* Middle finger (shorter) */}
            <path
              d="M27 16 C25.5 16, 25 17, 25 19 L25 34 C25 35.5, 25.5 36, 27 36 C28.5 36, 29 35.5, 29 34 L29 19 C29 17, 28.5 16, 27 16 Z"
              fill="white"
              fillOpacity="0.85"
            />
            <circle cx="27" cy="16" r="2.5" fill="white" fillOpacity="0.85" />
            
            {/* Ring finger (shortest) */}
            <path
              d="M13 16 C11.5 16, 11 17, 11 19 L11 34 C11 35.5, 11.5 36, 13 36 C14.5 36, 15 35.5, 15 34 L15 19 C15 17, 14.5 16, 13 16 Z"
              fill="white"
              fillOpacity="0.85"
            />
            <circle cx="13" cy="16" r="2.5" fill="white" fillOpacity="0.85" />
            
            {/* Motion lines for swipe effect */}
            <g className="animate-finger-tip">
              <line x1="20" y1="5" x2="20" y2="0" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
              <line x1="17" y1="7" x2="15" y2="3" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
              <line x1="23" y1="7" x2="25" y2="3" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        <span className="text-white/80 text-xs font-medium tracking-wide">Swipe Up</span>
      </div>
    </div>
  );
}
