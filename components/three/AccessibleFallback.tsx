'use client';

import React from 'react';

export const AccessibleFallback: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75"
      aria-hidden="true"
    >
      {/* 2D Vector Lightway SVG Path */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 2000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lightway-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00C2D1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#006B7B" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Continuous S-Curve Pathway */}
        <path
          d="M 250,150 Q 750,450 500,850 T 500,1600"
          stroke="url(#lightway-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Pulsing Step 01 Node Circle */}
        <circle cx="500" cy="1250" r="16" fill="#00E5FF" filter="url(#glow)" />
        <circle cx="500" cy="1250" r="32" stroke="#00E5FF" strokeWidth="2" opacity="0.4" />
      </svg>
    </div>
  );
};
