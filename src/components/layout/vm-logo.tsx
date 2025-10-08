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
    
    <g transform="translate(0, 5)">
      {/* Dumbbell Icon */}
      <g className="db-fill" transform="scale(0.8) translate(10, 0)">
        <path d="M12.9,19.2c-0.3,0-0.6-0.1-0.8-0.2c-0.6-0.3-1-0.9-1-1.6V7.6c0-0.7,0.4-1.3,1-1.6c0.6-0.3,1.3-0.2,1.8,0.2l4.3,3.6c0.4,0.4,0.7,0.9,0.7,1.4s-0.2,1-0.7,1.4l-4.3,3.6C13.4,19.1,13.1,19.2,12.9,19.2z" />
        <path d="M42.2,15.6c-0.6-0.3-1.3-0.2-1.8,0.2l-4.3,3.6c-0.5,0.4-0.8,1-0.8,1.6c0,0.3,0.1,0.6,0.2,0.8c0.3,0.6,0.9,1,1.6,1h0.2c0.2,0,0.5-0.1,0.7-0.2l4.3-3.6c0.4-0.4,0.7-0.9,0.7-1.4S42.6,16,42.2,15.6z" />
        <path d="M27.5,26c-1.4,0-2.5-1.1-2.5-2.5V1.5C25,0.7,26.1,0,27.5,0S30,0.7,30,1.5v22C30,24.9,28.9,26,27.5,26z" />
        <path d="M8.2,21.8H5.7c-2.3,0-4.2-1.9-4.2-4.2V7.4c0-2.3,1.9-4.2,4.2-4.2h2.5c0.8,0,1.5,0.7,1.5,1.5s-0.7,1.5-1.5,1.5H5.7C4.6,6.2,3.7,7,3.7,8.2v10.5c0,1.1,0.9,2.1,2.1,2.1h2.5c0.8,0,1.5,0.7,1.5,1.5S9,21.8,8.2,21.8z" />
        <path d="M49.3,21.8h-2.5c-1.1,0-2.1-0.9-2.1-2.1V8.2c0-1.1,0.9-2.1,2.1-2.1h2.5c0.8,0,1.5-0.7,1.5-1.5S50.1,3.2,49.3,3.2h-2.5c-2.3,0-4.2,1.9-4.2,4.2v10.2c0,2.3,1.9,4.2,4.2,4.2h2.5c0.8,0,1.5-0.7,1.5-1.5S50.1,21.8,49.3,21.8z" />
        <path d="M2.2,16.2H0.8c-0.4,0-0.8-0.3-0.8-0.8V9.6c0-0.4,0.3-0.8,0.8-0.8h1.5c0.4,0,0.8,0.3,0.8,0.8v5.9C3,15.9,2.7,16.2,2.2,16.2z" />
        <path d="M54.2,16.2h-1.5c-0.4,0-0.8-0.3-0.8-0.8V9.6c0-0.4,0.3-0.8,0.8-0.8h1.5c0.4,0,0.8,0.3,0.8,0.8v5.9C55,15.9,54.7,16.2,54.2,16.2z" />
      </g>
      
      {/* Text */}
      <g transform="translate(65, 0)">
        <text y="20" className="text-fill" style={{ fontFamily: 'Belleza, sans-serif', fontSize: '20px', fontWeight: '400' }}>
          VALENTINA
        </text>
        <text y="42" className="text-fill" style={{ fontFamily: 'Belleza, sans-serif', fontSize: '20px', fontWeight: '400' }}>
          MONTERO
        </text>
        <text y="58" className="text-fill" style={{ fontFamily: 'Alegreya, serif', fontSize: '9px', letterSpacing: '1px' }}>
          FITNESS COACH
        </text>
      </g>
    </g>
  </svg>
);
