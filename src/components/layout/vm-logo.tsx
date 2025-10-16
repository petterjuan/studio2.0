import * as React from "react";

export const VmLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 70"
    width="200"
    height="70"
    {...props}
  >
    <style>
      {`
        .db-fill { fill: hsl(var(--primary)); }
        .text-fill { fill: hsl(var(--foreground)); }
        @media (prefers-color-scheme: dark) {
          .text-fill { fill: hsl(var(--foreground)); }
        }
      `}
    </style>
    
    <g transform="translate(0, 10)">
      {/* Icon */}
      <g className="db-fill" transform="scale(0.9) translate(10, 0)">
        <path d="M19.3,7.5h-2.5c-1.1,0-2,0.9-2,2v22c0,1.1,0.9,2,2,2h2.5c1.1,0,2-0.9,2-2V9.5C21.3,8.4,20.4,7.5,19.3,7.5z"/>
        <path d="M43.3,7.5h-2.5c-1.1,0-2,0.9-2,2v22c0,1.1,0.9,2,2,2h2.5c1.1,0,2-0.9,2-2V9.5C45.3,8.4,44.4,7.5,43.3,7.5z"/>
        <rect x="14.8" y="15.5" width="32" height="8" rx="2" />
        <path d="M9.8,20.5h-4c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h4c0.6,0,1,0.4,1,1s-0.4,1-1,1h-4c-0.6,0-1,0.4-1,1v8c0,0.6,0.4,1,1,1h4c0.6,0,1,0.4,1,1S10.4,20.5,9.8,20.5z"/>
        <path d="M53.8,20.5h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1-0.4,1-1v-8c0-0.6-0.4-1-1-1h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c1.1,0,2,0.9,2,2v8C55.8,19.6,54.9,20.5,53.8,20.5z"/>
      </g>
      
      {/* Text */}
      <g transform="translate(65, 0)">
        <text y="15" className="text-fill" style={{ fontFamily: 'Belleza, sans-serif', fontSize: '18px', fontWeight: '400' }}>
          VALENTINA
        </text>
        <text y="37" className="text-fill" style={{ fontFamily: 'Belleza, sans-serif', fontSize: '18px', fontWeight: '400' }}>
          MONTERO
        </text>
        <text y="50" className="text-fill" style={{ fontFamily: 'Alegreya, serif', fontSize: '9px', letterSpacing: '1px' }}>
          FITNESS COACH
        </text>
      </g>
    </g>
  </svg>
);
