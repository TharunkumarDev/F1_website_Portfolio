import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A synthetic F1 anti-gravity circuit path (viewBox 0 0 1440 900)
// The path curves up and over like a banked cosmic circuit
const TRACK_PATH =
  'M -20,600 C 100,580 160,420 260,380 C 360,340 400,460 500,440 ' +
  'C 600,420 580,280 680,220 C 780,160 840,260 920,240 ' +
  'C 1000,220 1020,100 1120,80 C 1220,60 1300,160 1380,200 ' +
  'C 1460,240 1500,340 1540,380';

// Shorter racing-line path (the ideal line inside the track)
const RACING_LINE =
  'M -20,610 C 110,590 155,435 255,398 C 355,362 405,472 498,454 ' +
  'C 591,436 577,298 670,240 C 763,182 835,272 910,254 ' +
  'C 985,236 1015,118 1110,100 C 1205,82 1295,172 1370,210 ' +
  'C 1445,248 1495,348 1540,390';

export default function NeonRacetrack({ scrollProgress }: { scrollProgress: number }) {
  const trackRef  = useRef<SVGPathElement>(null);
  const lineRef   = useRef<SVGPathElement>(null);
  const dotRef    = useRef<SVGCircleElement>(null);

  // Animate dash-offset on mount (track reveals on scroll)
  useEffect(() => {
    const track = trackRef.current;
    const line  = lineRef.current;
    if (!track || !line) return;

    const trackLen = track.getTotalLength();
    const lineLen  = line.getTotalLength();

    // Set up dash arrays from the full length
    gsap.set(track, { strokeDasharray: trackLen, strokeDashoffset: trackLen });
    gsap.set(line,  { strokeDasharray: lineLen,  strokeDashoffset: lineLen  });

    // Reveal track as scroll progresses
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.cinematic-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    tl.to(track, { strokeDashoffset: 0, ease: 'none' }, 0);
    tl.to(line,  { strokeDashoffset: 0, ease: 'none', delay: 0.1 }, 0);

    // Pulse glow animation
    gsap.to('.neon-glow', {
      filter: 'blur(12px)',
      opacity: 0.4,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: 'sine.inOut',
    });

    return () => { tl.kill(); };
  }, []);

  // Move the dot along the racing line based on scroll progress
  useEffect(() => {
    const line = lineRef.current;
    const dot  = dotRef.current;
    if (!line || !dot) return;
    const len = line.getTotalLength();
    const pt  = line.getPointAtLength(scrollProgress * len);
    dot.setAttribute('cx', pt.x.toString());
    dot.setAttribute('cy', pt.y.toString());
  }, [scrollProgress]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Red neon glow filter */}
        <filter id="neon-red" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Teal/white glow for the racing line */}
        <filter id="neon-white" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dot glow */}
        <filter id="neon-dot" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient along track */}
        <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#E10600" stopOpacity="0" />
          <stop offset="30%"  stopColor="#E10600" stopOpacity="0.8" />
          <stop offset="70%"  stopColor="#ff4400" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#E10600" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* ── OUTER TRACK EDGES ── faint border rails */}
      <path
        d={TRACK_PATH}
        fill="none"
        stroke="rgba(225,6,0,0.12)"
        strokeWidth="32"
        strokeLinecap="round"
      />

      {/* ── TRACK SURFACE ── semi-transparent tarmac feel */}
      <path
        d={TRACK_PATH}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* ── NEON GLOW TRACK (wide soft) ── */}
      <path
        className="neon-glow"
        d={TRACK_PATH}
        fill="none"
        stroke="#E10600"
        strokeWidth="18"
        strokeLinecap="round"
        style={{ filter: 'blur(10px)', opacity: 0.5 }}
      />

      {/* ── MAIN NEON TRACK LINE ── */}
      <path
        ref={trackRef}
        d={TRACK_PATH}
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#neon-red)"
        style={{ opacity: 0.9 }}
      />

      {/* ── KERB TICK MARKS ── little cross lines suggesting track edges */}
      {[0.08, 0.18, 0.30, 0.42, 0.55, 0.66, 0.78, 0.88].map((t, i) => {
        // approximate positions along path
        const x = 60 + t * 1400;
        const y = 600 - Math.sin(t * Math.PI * 2) * 200;
        return (
          <g key={i} transform={`translate(${x},${y})`} opacity="0.3">
            <line x1="-10" y1="-6" x2="10" y2="6" stroke="#E10600" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-10" y1="6"  x2="10" y2="-6" stroke="#ff8c00" strokeWidth="1" strokeLinecap="round" />
          </g>
        );
      })}

      {/* ── RACING LINE (ideal line) ── */}
      <path
        ref={lineRef}
        d={RACING_LINE}
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="6 10"
        filter="url(#neon-white)"
        style={{ opacity: 0.6 }}
      />

      {/* ── MOVING DOT (car position) ── */}
      <circle
        ref={dotRef}
        cx="0"
        cy="600"
        r="6"
        fill="#E10600"
        filter="url(#neon-dot)"
      >
        <animate attributeName="r" values="5;7;5" dur="0.8s" repeatCount="indefinite" />
      </circle>

      {/* ── SPEED LINES ── motion blur streaks from the dot */}
      <line
        x1="-60"
        y1="600"
        x2="0"
        y2="600"
        stroke="#E10600"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* ── CORNER APEX MARKERS ── glowing dots at turn entry points */}
      {[
        { cx: 260, cy: 380 },
        { cx: 500, cy: 440 },
        { cx: 680, cy: 220 },
        { cx: 920, cy: 240 },
        { cx: 1120, cy: 80  },
      ].map(({ cx, cy }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="none" stroke="#E10600" strokeWidth="1.5" opacity="0.6" />
          <circle cx={cx} cy={cy} r="2" fill="#E10600" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* ── TRACK LABEL ── subtle "SECTOR 1" label at start */}
      <text x="60" y="580" fill="rgba(225,6,0,0.4)" fontSize="10" fontFamily="'Orbitron', monospace" letterSpacing="3" textAnchor="start">
        SECTOR 1
      </text>
      <text x="680" y="200" fill="rgba(225,6,0,0.4)" fontSize="10" fontFamily="'Orbitron', monospace" letterSpacing="3" textAnchor="middle">
        SECTOR 2
      </text>
      <text x="1240" y="65" fill="rgba(225,6,0,0.4)" fontSize="10" fontFamily="'Orbitron', monospace" letterSpacing="3" textAnchor="middle">
        SECTOR 3
      </text>
    </svg>
  );
}
