import React from 'react';

interface SunglassesSVGProps {
  variant: string;
  className?: string;
  animated?: boolean;
}

export const SunglassesSVG: React.FC<SunglassesSVGProps> = ({
  variant,
  className = "w-full h-48",
  animated = false,
}) => {
  const normVariant = (variant || "visor").toLowerCase();

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-black/60 p-4 border border-red-900/40 ${className}`}>
      <svg
        viewBox="0 0 500 220"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full max-h-52 drop-shadow-[0_10px_20px_rgba(255,0,40,0.3)] transition-transform duration-300 ${
          animated ? "hover:scale-105" : ""
        }`}
      >
        <defs>
          {/* Blood Arterial Gradient */}
          <linearGradient id="bloodGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0033" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#800010" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1a0003" stopOpacity="1" />
          </linearGradient>

          {/* Mirrored Ruby Crimson */}
          <linearGradient id="rubyMirror" x1="0%" y1="0%" x2="100%" y2="40%">
            <stop offset="0%" stopColor="#ff1a40" />
            <stop offset="35%" stopColor="#ff8599" />
            <stop offset="45%" stopColor="#e6002b" />
            <stop offset="100%" stopColor="#3d000b" />
          </linearGradient>

          {/* Smoked Coagulated Charcoal */}
          <linearGradient id="darkCoagulated" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#252528" />
            <stop offset="70%" stopColor="#0e0d10" />
            <stop offset="100%" stopColor="#200508" />
          </linearGradient>

          {/* Toxic Ember Flare */}
          <linearGradient id="emberFlare" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#ff3700" />
            <stop offset="50%" stopColor="#ff0040" />
            <stop offset="100%" stopColor="#4a000e" />
          </linearGradient>

          {/* Bone White Gradient */}
          <linearGradient id="boneMatte" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3ede6" />
            <stop offset="60%" stopColor="#ded1c3" />
            <stop offset="100%" stopColor="#ad9c88" />
          </linearGradient>

          {/* Steel Texture */}
          <linearGradient id="surgicalSteel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4b4d52" />
            <stop offset="50%" stopColor="#8c9099" />
            <stop offset="100%" stopColor="#2c2d30" />
          </linearGradient>
        </defs>

        {/* Background Grid Accent */}
        <g opacity="0.15">
          <line x1="0" y1="110" x2="500" y2="110" stroke="#ff0033" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="250" y1="0" x2="250" y2="220" stroke="#ff0033" strokeWidth="1" strokeDasharray="4 4" />
        </g>

        {/* VARIANT 1: CYBER-VISOR / EXSANGUINATOR */}
        {normVariant.includes("visor") && (
          <g>
            {/* Upper Frame Bar */}
            <path
              d="M 50 65 L 250 50 L 450 65 L 430 80 L 250 68 L 70 80 Z"
              fill="url(#surgicalSteel)"
              stroke="#0a0a0c"
              strokeWidth="3"
            />
            {/* Single Monolithic Shield Lens */}
            <path
              d="M 60 75 Q 250 60 440 75 L 420 155 Q 250 175 80 155 Z"
              fill="url(#rubyMirror)"
              stroke="#ff0033"
              strokeWidth="3"
            />
            {/* Mirror Reflection Sheen */}
            <path
              d="M 120 80 L 190 75 L 140 150 L 80 148 Z"
              fill="#ffffff"
              opacity="0.35"
            />
            <path
              d="M 210 75 L 240 73 L 195 152 L 170 151 Z"
              fill="#ffffff"
              opacity="0.2"
            />
            {/* Ventilation slits */}
            <rect x="220" y="58" width="12" height="4" fill="#000" />
            <rect x="244" y="58" width="12" height="4" fill="#000" />
            <rect x="268" y="58" width="12" height="4" fill="#000" />
            {/* Titanium Temples */}
            <path d="M 50 65 L 10 90 L 3 130" stroke="#8c9099" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 450 65 L 490 90 L 497 130" stroke="#8c9099" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Blood drips */}
            <path d="M 90 155 Q 92 185 88 190 Q 86 185 87 155" fill="#ff0033" />
            <path d="M 380 155 Q 383 175 379 180 Q 377 175 378 155" fill="#ff0033" />
          </g>
        )}

        {/* VARIANT 2: CORONER'S SCALPEL / POLYGONAL */}
        {normVariant.includes("polygonal") && (
          <g>
            {/* Brow wire */}
            <line x1="80" y1="70" x2="420" y2="70" stroke="#ff0033" strokeWidth="4" />
            <line x1="210" y1="85" x2="290" y2="85" stroke="#555" strokeWidth="3" />
            {/* Left Polygonal Lens */}
            <polygon
              points="90,75 220,75 205,155 125,165 75,120"
              fill="url(#darkCoagulated)"
              stroke="#e60026"
              strokeWidth="5"
            />
            {/* Right Polygonal Lens */}
            <polygon
              points="410,75 280,75 295,155 375,165 425,120"
              fill="url(#darkCoagulated)"
              stroke="#e60026"
              strokeWidth="5"
            />
            {/* Glare Sheens */}
            <polygon points="100,85 140,85 110,145 85,125" fill="#ffffff" opacity="0.25" />
            <polygon points="310,85 340,85 315,145 298,125" fill="#ffffff" opacity="0.2" />
            {/* Bridge */}
            <path d="M 220 75 Q 250 68 280 75" stroke="#ff0033" strokeWidth="6" fill="none" />
            {/* Temples with razor tips */}
            <line x1="90" y1="75" x2="25" y2="90" stroke="#ff0033" strokeWidth="5" />
            <line x1="410" y1="75" x2="475" y2="90" stroke="#ff0033" strokeWidth="5" />
          </g>
        )}

        {/* VARIANT 3: NECROTIC AVIATOR */}
        {normVariant.includes("aviator") && (
          <g>
            {/* Barbed wire top sweat bar */}
            <line x1="100" y1="62" x2="400" y2="62" stroke="#888" strokeWidth="4" />
            <path d="M 230 62 L 235 52 L 240 68 L 245 62" stroke="#ff0033" strokeWidth="2.5" fill="none" />
            <path d="M 255 62 L 260 52 L 265 68 L 270 62" stroke="#ff0033" strokeWidth="2.5" fill="none" />
            {/* Left Teardrop Lens */}
            <path
              d="M 110 70 Q 220 65 220 95 C 220 155 180 175 130 170 C 80 165 80 110 110 70 Z"
              fill="url(#emberFlare)"
              stroke="#111"
              strokeWidth="6"
            />
            {/* Right Teardrop Lens */}
            <path
              d="M 390 70 Q 280 65 280 95 C 280 155 320 175 370 170 C 420 165 420 110 390 70 Z"
              fill="url(#emberFlare)"
              stroke="#111"
              strokeWidth="6"
            />
            {/* Bridge */}
            <path d="M 220 95 Q 250 85 280 95" stroke="#ff0033" strokeWidth="4" fill="none" />
            {/* Aviator Glare */}
            <path d="M 125 80 Q 155 75 145 145 Q 120 145 115 105 Z" fill="#fff" opacity="0.25" />
            <path d="M 320 80 Q 345 75 340 145 Q 320 145 315 105 Z" fill="#fff" opacity="0.2" />
            {/* Temples */}
            <path d="M 100 70 L 30 85 L 15 125" stroke="#666" strokeWidth="4" fill="none" />
            <path d="M 400 70 L 470 85 L 485 125" stroke="#666" strokeWidth="4" fill="none" />
          </g>
        )}

        {/* VARIANT 4: VISCERA CHUNKY RECTANGLE */}
        {normVariant.includes("chunky") && (
          <g>
            {/* Thick Brutal Frame Outer Shell */}
            <rect
              x="60"
              y="60"
              width="380"
              height="105"
              rx="6"
              fill="#180205"
              stroke="#ff0033"
              strokeWidth="7"
            />
            {/* Left Lens cutout */}
            <rect
              x="85"
              y="75"
              width="140"
              height="75"
              rx="4"
              fill="url(#darkCoagulated)"
              stroke="#330006"
              strokeWidth="4"
            />
            {/* Right Lens cutout */}
            <rect
              x="275"
              y="75"
              width="140"
              height="75"
              rx="4"
              fill="url(#darkCoagulated)"
              stroke="#330006"
              strokeWidth="4"
            />
            {/* Bevel Highlights */}
            <line x1="60" y1="60" x2="440" y2="60" stroke="#ff3355" strokeWidth="3" />
            <line x1="85" y1="75" x2="225" y2="75" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
            <line x1="275" y1="75" x2="415" y2="75" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
            {/* Massive side lugs */}
            <rect x="35" y="70" width="25" height="40" fill="#180205" stroke="#ff0033" strokeWidth="5" />
            <rect x="440" y="70" width="25" height="40" fill="#180205" stroke="#ff0033" strokeWidth="5" />
            {/* Blood stain veins */}
            <path d="M 120 60 Q 130 90 125 120" stroke="#ff0033" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 360 60 Q 370 100 365 140" stroke="#ff0033" strokeWidth="2" fill="none" opacity="0.6" />
          </g>
        )}

        {/* VARIANT 5: AUTOPSY CAT-EYE V2 */}
        {normVariant.includes("cateye") && (
          <g>
            {/* Left Wing / Lens */}
            <path
              d="M 50 65 L 180 85 L 220 120 C 220 160 170 175 110 165 C 60 155 45 115 50 65 Z"
              fill="url(#rubyMirror)"
              stroke="#0a0a0c"
              strokeWidth="8"
            />
            {/* Right Wing / Lens */}
            <path
              d="M 450 65 L 320 85 L 280 120 C 280 160 330 175 390 165 C 440 155 455 115 450 65 Z"
              fill="url(#rubyMirror)"
              stroke="#0a0a0c"
              strokeWidth="8"
            />
            {/* Spiked Fang Tips */}
            <polygon points="50,65 30,45 65,60" fill="#ff0033" stroke="#000" strokeWidth="2" />
            <polygon points="450,65 470,45 435,60" fill="#ff0033" stroke="#000" strokeWidth="2" />
            {/* Sharp Bridge */}
            <path d="M 220 120 Q 250 110 280 120" stroke="#ff0033" strokeWidth="5" fill="none" />
            {/* High gloss highlights */}
            <path d="M 65 75 L 150 90 L 130 145" stroke="#fff" strokeWidth="2" opacity="0.4" fill="none" />
            <path d="M 435 75 L 350 90 L 370 145" stroke="#fff" strokeWidth="2" opacity="0.4" fill="none" />
          </g>
        )}

        {/* VARIANT 6: HELLHOUND SPEED SHIELD */}
        {normVariant.includes("shield") && (
          <g>
            {/* Sleek wrap frame */}
            <path
              d="M 40 100 Q 250 45 460 100 L 440 160 Q 250 140 60 160 Z"
              fill="url(#emberFlare)"
              stroke="#09090b"
              strokeWidth="8"
            />
            {/* Mirrored iridescent streak */}
            <path
              d="M 120 75 Q 250 65 380 75 L 340 145 Q 250 135 160 145 Z"
              fill="url(#rubyMirror)"
              opacity="0.8"
            />
            {/* Speed vents */}
            <line x1="80" y1="120" x2="110" y2="120" stroke="#000" strokeWidth="3" />
            <line x1="85" y1="130" x2="115" y2="130" stroke="#000" strokeWidth="3" />
            <line x1="420" y1="120" x2="390" y2="120" stroke="#000" strokeWidth="3" />
            <line x1="415" y1="130" x2="385" y2="130" stroke="#000" strokeWidth="3" />
            {/* Frame Brow Rim */}
            <path d="M 35 100 Q 250 40 465 100" stroke="#ff0033" strokeWidth="5" fill="none" />
          </g>
        )}

        {/* VARIANT 7: MORTUARY HEX */}
        {normVariant.includes("hex") && (
          <g>
            {/* Left Mesh Side Shield */}
            <polygon points="50,90 90,75 90,155 50,140" fill="#2a1014" stroke="#ff0033" strokeWidth="2" />
            <line x1="60" y1="95" x2="60" y2="135" stroke="#ff0033" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="75" y1="90" x2="75" y2="145" stroke="#ff0033" strokeWidth="1" strokeDasharray="2 2" />
            {/* Right Mesh Side Shield */}
            <polygon points="450,90 410,75 410,155 450,140" fill="#2a1014" stroke="#ff0033" strokeWidth="2" />
            <line x1="440" y1="95" x2="440" y2="135" stroke="#ff0033" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="425" y1="90" x2="425" y2="145" stroke="#ff0033" strokeWidth="1" strokeDasharray="2 2" />
            {/* Left Hex Lens */}
            <polygon
              points="100,80 160,65 210,95 200,155 140,170 95,140"
              fill="url(#darkCoagulated)"
              stroke="#8c9099"
              strokeWidth="5"
            />
            {/* Right Hex Lens */}
            <polygon
              points="400,80 340,65 290,95 300,155 360,170 405,140"
              fill="url(#darkCoagulated)"
              stroke="#8c9099"
              strokeWidth="5"
            />
            {/* Industrial Bridge */}
            <line x1="210" y1="95" x2="290" y2="95" stroke="#ff0033" strokeWidth="6" />
            <circle cx="215" cy="95" r="3" fill="#fff" />
            <circle cx="285" cy="95" r="3" fill="#fff" />
          </g>
        )}

        {/* VARIANT 8: BEHEADED MONOLITH */}
        {normVariant.includes("monolith") && (
          <g>
            {/* Massive Bone Frame */}
            <rect
              x="50"
              y="55"
              width="400"
              height="115"
              rx="8"
              fill="url(#boneMatte)"
              stroke="#111"
              strokeWidth="8"
            />
            {/* Left Obsidian Lens */}
            <rect x="75" y="75" width="155" height="75" rx="3" fill="#050507" stroke="#333" strokeWidth="4" />
            {/* Right Obsidian Lens */}
            <rect x="270" y="75" width="155" height="75" rx="3" fill="#050507" stroke="#333" strokeWidth="4" />
            {/* Blood Splatter Drips on Bone */}
            <circle cx="80" cy="65" r="6" fill="#ff0033" />
            <path d="M 80 65 Q 85 95 82 105" stroke="#ff0033" strokeWidth="3" fill="none" />
            <circle cx="250" cy="60" r="8" fill="#b3001e" />
            <path d="M 250 60 Q 252 85 248 95" stroke="#b3001e" strokeWidth="4" fill="none" />
            <circle cx="390" cy="155" r="5" fill="#ff0033" />
            <path d="M 390 155 Q 393 180 391 190" stroke="#ff0033" strokeWidth="3" fill="none" />
            <circle cx="430" cy="70" r="7" fill="#ff0033" />
            <circle cx="435" cy="88" r="4" fill="#ff0033" />
          </g>
        )}

        {/* FALLBACK IF NONE MATCH */}
        {!["visor", "polygonal", "aviator", "chunky", "cateye", "shield", "hex", "monolith"].some(v => normVariant.includes(v)) && (
          <g>
            <rect x="60" y="65" width="380" height="95" rx="6" fill="url(#rubyMirror)" stroke="#ff0033" strokeWidth="6" />
            <line x1="60" y1="65" x2="440" y2="65" stroke="#fff" strokeWidth="2" opacity="0.4" />
          </g>
        )}
      </svg>
    </div>
  );
};

