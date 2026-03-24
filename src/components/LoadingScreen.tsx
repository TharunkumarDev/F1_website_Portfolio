import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// SVG Arc helper
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

// RPM tick marks
const RPM_MARKS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const START_DEG = 150; // bottom-left
const END_DEG = 30;    // bottom-right (going clockwise via 390)
const TOTAL_RANGE = 360 - START_DEG + END_DEG; // 240 degrees sweep

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGLineElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const rpmTextRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLDivElement>(null);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState(1);

  const CX = 200, CY = 200, R_OUTER = 160, R_INNER = 130;

  useEffect(() => {
    const el = {
      rpm: 0,
      deg: START_DEG,
    };

    const getTotalEnd = START_DEG + TOTAL_RANGE;

    const tl = gsap.timeline({ delay: 0.2 });

    // Rev up: needle sweeps from START to max over 2.5s
    tl.to(el, {
      rpm: 20000,
      deg: getTotalEnd,
      duration: 2.5,
      ease: 'power2.in',
      onUpdate: () => {
        setRpm(Math.round(el.rpm));

        // Move needle
        const needle = needleRef.current;
        if (needle) {
          const angle = el.deg;
          const rad = (angle * Math.PI) / 180;
          const nx = CX + R_INNER * 0.9 * Math.cos(rad);
          const ny = CY + R_INNER * 0.9 * Math.sin(rad);
          needle.setAttribute('x2', nx.toString());
          needle.setAttribute('y2', ny.toString());
        }

        // Arc fill
        const arc = arcRef.current;
        if (arc) {
          // Use red once > 16000
          const isRedline = el.rpm > 16000;
          arc.setAttribute('stroke', isRedline ? '#E10600' : '#ff8c00');
          arc.setAttribute('d', describeArc(CX, CY, (R_OUTER + R_INNER) / 2, START_DEG, Math.min(el.deg, getTotalEnd)));
        }

        // Gear changes
        if (el.rpm < 5000) setGear(1);
        else if (el.rpm < 8000) setGear(2);
        else if (el.rpm < 11000) setGear(3);
        else if (el.rpm < 14000) setGear(4);
        else if (el.rpm < 17000) setGear(5);
        else setGear(6);
      }
    });

    // Rev limiter flash at max
    tl.to(containerRef.current, {
      backgroundColor: '#E10600',
      duration: 0.06,
      repeat: 5,
      yoyo: true,
      ease: 'none',
    }, '+=0.1');

    // Fade out
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete,
    }, '+=0.1');

    return () => { tl.kill(); };
  }, [onComplete]);

  // Build tick marks
  const ticks = RPM_MARKS.map((val, i) => {
    const fraction = i / (RPM_MARKS.length - 1);
    const angle = START_DEG + fraction * TOTAL_RANGE;
    const rad = (angle * Math.PI) / 180;
    const isRed = val >= 16;
    const isMajor = true;
    const r1 = R_OUTER;
    const r2 = R_OUTER - (isMajor ? 18 : 10);
    const tx = CX + (R_OUTER - 26) * Math.cos(rad);
    const ty = CY + (R_OUTER - 26) * Math.sin(rad);
    return { val, angle, rad, r1, r2, tx, ty, isRed };
  });

  const needleAngle = START_DEG;
  const needleRad = (needleAngle * Math.PI) / 180;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#030303' }}
    >
      {/* Background vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-[#1a0000]/40 via-transparent to-transparent pointer-events-none" />

      {/* F1 Logo top */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg"
        alt="F1"
        className="absolute top-10 left-1/2 -translate-x-1/2 h-5 opacity-60 object-contain"
      />

      {/* Speedometer SVG */}
      <div className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400" className="w-[min(90vw,400px)] h-[min(90vw,400px)]">

          {/* Outer bezel */}
          <circle cx={CX} cy={CY} r={R_OUTER + 8} fill="none" stroke="#1a1a1a" strokeWidth="2" />

          {/* Background track */}
          <path
            d={describeArc(CX, CY, (R_OUTER + R_INNER) / 2, START_DEG, START_DEG + TOTAL_RANGE)}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={R_OUTER - R_INNER}
            strokeLinecap="round"
          />

          {/* Red zone indicator background (16k–20k range) */}
          <path
            d={describeArc(CX, CY, (R_OUTER + R_INNER) / 2, START_DEG + TOTAL_RANGE * 0.8, START_DEG + TOTAL_RANGE)}
            fill="none"
            stroke="#3a0000"
            strokeWidth={R_OUTER - R_INNER}
          />

          {/* Active arc (animated) */}
          <path
            ref={arcRef}
            d={describeArc(CX, CY, (R_OUTER + R_INNER) / 2, START_DEG, START_DEG)}
            fill="none"
            stroke="#ff8c00"
            strokeWidth={R_OUTER - R_INNER}
            strokeLinecap="round"
          />

          {/* Tick marks + labels */}
          {ticks.map(({ val, rad, r1, r2, tx, ty, isRed }) => {
            const x1 = CX + r1 * Math.cos(rad);
            const y1 = CY + r1 * Math.sin(rad);
            const x2 = CX + r2 * Math.cos(rad);
            const y2 = CY + r2 * Math.sin(rad);
            return (
              <g key={val}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isRed ? '#E10600' : '#555'} strokeWidth="2" strokeLinecap="round" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill={isRed ? '#E10600' : '#888'} fontFamily="Inter, sans-serif" fontWeight="600">
                  {val}
                </text>
              </g>
            );
          })}

          {/* RPM label */}
          <text x={CX} y={CY - 50} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#555" fontFamily="Inter, sans-serif" letterSpacing="3">
            ×1000 RPM
          </text>

          {/* Center hub */}
          <circle cx={CX} cy={CY} r="12" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
          <circle cx={CX} cy={CY} r="4" fill="#E10600" />

          {/* Needle */}
          <line
            ref={needleRef}
            x1={CX}
            y1={CY}
            x2={CX + R_INNER * 0.9 * Math.cos(needleRad)}
            y2={CY + R_INNER * 0.9 * Math.sin(needleRad)}
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Digital RPM readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 pointer-events-none">
          <div
            ref={rpmTextRef}
            className="font-black tabular-nums text-center leading-none"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 7vw, 44px)', color: rpm > 16000 ? '#E10600' : 'white' }}
          >
            {rpm.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-600 uppercase tracking-[0.3em] mt-1">RPM</div>
        </div>

        {/* Gear indicator */}
        <div
          ref={gearRef}
          className="absolute top-1/2 -translate-y-1/2 right-12 text-center"
        >
          <div className="text-5xl font-black text-white/80" style={{ fontFamily: 'var(--font-f1)' }}>{gear}</div>
          <div className="text-[9px] text-gray-600 uppercase tracking-widest">GEAR</div>
        </div>
      </div>

      {/* Status line */}
      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 uppercase tracking-[0.4em] whitespace-nowrap">
        INITIALISING SYSTEMS...
      </p>
    </div>
  );
}
