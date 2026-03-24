import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

function LedBar({ filled, red }: { filled: boolean; red: boolean }) {
  return (
    <div
      className="rounded-sm"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: filled ? (red ? '#E10600' : '#ff8c00') : 'rgba(255,255,255,0.06)',
        boxShadow: filled ? (red ? '0 0 6px #E10600' : '0 0 5px #ff8c00') : 'none',
        transition: 'background-color 60ms, box-shadow 60ms',
      }}
    />
  );
}

const TOTAL_SEGMENTS = 24;
const REDLINE_FROM = 19;
const FONT = "'Orbitron', monospace";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rpm, setRpm]         = useState(0);
  const [speed, setSpeed]     = useState(0);
  const [gear, setGear]       = useState(0);
  const [drs, setDrs]         = useState(false);
  const [segments, setSegments] = useState(0);
  const [phase, setPhase]     = useState<'boot' | 'rev' | 'flash'>('boot');

  useEffect(() => {
    const state = { rpm: 0, seg: 0, speed: 0 };
    const tl = gsap.timeline();

    tl.to({}, { duration: 0.7, onComplete: () => setPhase('rev') });

    tl.to(state, {
      rpm: 20000, speed: 340, seg: TOTAL_SEGMENTS,
      duration: 2.6,
      ease: 'power2.in',
      onUpdate: () => {
        const r = Math.round(state.rpm);
        setRpm(r);
        setSpeed(Math.round(state.speed));
        setSegments(Math.round(state.seg));
        if      (r < 5000)  { setGear(1); setDrs(false); }
        else if (r < 8500)  { setGear(2); setDrs(false); }
        else if (r < 11500) { setGear(3); setDrs(false); }
        else if (r < 14000) { setGear(4); setDrs(false); }
        else if (r < 17000) { setGear(5); setDrs(true);  }
        else                 { setGear(6); setDrs(true);  }
      },
    });

    tl.to({}, {
      duration: 0.05, repeat: 7, yoyo: true,
      onRepeat:   () => setPhase(p => p === 'flash' ? 'rev' : 'flash'),
      onComplete: () => setPhase('flash'),
    }, '+=0.05');

    tl.to(containerRef.current, {
      opacity: 0, duration: 0.55, ease: 'power2.inOut', onComplete,
    }, '+=0.1');

    return () => { tl.kill(); };
  }, [onComplete]);

  const rpmPct   = Math.min(1, rpm / 20000);
  const isRedline = rpm >= 16000;
  const accentColor = isRedline ? '#E10600' : '#ff8c00';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none px-4"
      style={{ background: phase === 'flash' ? '#1a0000' : '#030303' }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)', backgroundSize: '36px 36px' }}
      />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accentColor, boxShadow: `0 0 14px ${accentColor}` }} />

      {/* F1 Logo */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg"
        alt="F1"
        className="absolute top-4 left-1/2 -translate-x-1/2 object-contain opacity-60"
        style={{ height: 'clamp(14px, 3vw, 20px)' }}
      />

      {/* === MAIN CARD === */}
      <div
        className="relative w-full flex flex-col gap-4"
        style={{ maxWidth: 'min(680px, 94vw)' }}
      >

        {/* TOP TELEMETRY ROW */}
        <div
          className="w-full grid grid-cols-3 border-b border-white/6 pb-3"
          style={{ gap: 'clamp(8px, 3vw, 20px)' }}
        >
          {[
            { label: 'LAP TIME', value: phase === 'boot' ? '--:--.---' : '1:23.456', color: '#fff' },
            { label: 'SECTOR',   value: phase === 'boot' ? '-'          : 'S3',       color: '#ff8c00' },
            { label: 'GAP',      value: phase === 'boot' ? '---'        : '+0.342',   color: '#00d2be' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p
                className="uppercase text-gray-600 tracking-widest mb-0.5"
                style={{ fontFamily: FONT, fontSize: 'clamp(7px, 1.5vw, 10px)' }}
              >{label}</p>
              <p
                className="font-bold tabular-nums"
                style={{ fontFamily: FONT, fontSize: 'clamp(10px, 2.5vw, 15px)', color }}
              >{value}</p>
            </div>
          ))}
        </div>

        {/* MAIN STATS ROW — gear | speed+rpm | drs */}
        <div className="flex items-center justify-center w-full" style={{ gap: 'clamp(12px, 5vw, 48px)' }}>

          {/* GEAR */}
          <div className="flex flex-col items-center flex-shrink-0">
            <p className="uppercase text-gray-600 tracking-widest mb-1" style={{ fontFamily: FONT, fontSize: 'clamp(7px, 1.5vw, 10px)' }}>GEAR</p>
            <div
              className="font-black leading-none tabular-nums"
              style={{
                fontFamily: FONT,
                fontSize: 'clamp(52px, 14vw, 96px)',
                color: isRedline ? '#E10600' : 'white',
                textShadow: isRedline ? '0 0 30px #E10600' : '0 0 16px rgba(255,255,255,.2)',
              }}
            >
              {phase === 'boot' ? '—' : gear}
            </div>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 bg-white/8 rounded-full" style={{ width: 1, height: 'clamp(60px, 15vw, 100px)' }} />

          {/* SPEED + RPM */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-center">
              <p className="uppercase text-gray-600 tracking-widest mb-0.5" style={{ fontFamily: FONT, fontSize: 'clamp(7px, 1.5vw, 10px)' }}>KM/H</p>
              <div
                className="font-black leading-none tabular-nums"
                style={{ fontFamily: FONT, fontSize: 'clamp(34px, 9vw, 60px)', color: isRedline ? '#ff8c00' : 'white' }}
              >
                {phase === 'boot' ? '---' : speed.toString().padStart(3, '0')}
              </div>
            </div>
            <div className="text-center">
              <p className="uppercase text-gray-600 tracking-widest mb-0.5" style={{ fontFamily: FONT, fontSize: 'clamp(7px, 1.5vw, 10px)' }}>RPM</p>
              <div
                className="font-bold leading-none tabular-nums"
                style={{ fontFamily: FONT, fontSize: 'clamp(14px, 4vw, 22px)', color: isRedline ? '#E10600' : '#ff8c00' }}
              >
                {phase === 'boot' ? '00000' : rpm.toString().padStart(5, '0')}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 bg-white/8 rounded-full" style={{ width: 1, height: 'clamp(60px, 15vw, 100px)' }} />

          {/* DRS */}
          <div className="flex flex-col items-center flex-shrink-0">
            <p className="uppercase text-gray-600 tracking-widest mb-1" style={{ fontFamily: FONT, fontSize: 'clamp(7px, 1.5vw, 10px)' }}>DRS</p>
            <div
              className="font-black"
              style={{
                fontFamily: FONT,
                fontSize: 'clamp(18px, 5vw, 28px)',
                color: drs ? '#00d2be' : '#2a2a2a',
                textShadow: drs ? '0 0 20px #00d2be' : 'none',
              }}
            >{drs ? 'ON' : 'OFF'}</div>
            <div
              className="rounded-full mt-2"
              style={{ width: 'clamp(6px, 1.5vw, 9px)', height: 'clamp(6px, 1.5vw, 9px)', background: drs ? '#00d2be' : '#222', boxShadow: drs ? '0 0 8px #00d2be' : 'none' }}
            />
          </div>
        </div>

        {/* LED BARS */}
        <div className="w-full flex flex-col" style={{ gap: 'clamp(4px, 1vw, 8px)' }}>
          <div
            className="w-full grid"
            style={{ gridTemplateColumns: `repeat(${TOTAL_SEGMENTS}, 1fr)`, gap: 'clamp(2px, 0.5vw, 4px)', height: 'clamp(8px, 2vw, 14px)' }}
          >
            {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
              <LedBar key={i} filled={i < segments} red={i >= REDLINE_FROM} />
            ))}
          </div>
          <div className="flex justify-between" style={{ fontFamily: FONT, fontSize: 'clamp(6px, 1.2vw, 9px)', color: '#444' }}>
            <span>0</span>
            <span style={{ color: '#ff8c00' }}>16K</span>
            <span style={{ color: '#E10600' }}>20K</span>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div
          className="w-full grid grid-cols-4 border-t border-white/6 pt-3"
          style={{ gap: 'clamp(6px, 2vw, 12px)' }}
        >
          {[
            { label: 'TYRE',   value: phase === 'boot' ? '--'      : 'SOFT',                                    color: '#E10600' },
            { label: 'FUEL',   value: phase === 'boot' ? '--'      : `${Math.round(rpmPct * 100)}%`,            color: '#00d2be' },
            { label: 'ERS',    value: phase === 'boot' ? '--'      : `${Math.round(rpmPct * 100)}%`,            color: '#ff8c00' },
            { label: 'STATUS', value: phase === 'boot' ? 'BOOT'    : isRedline ? 'REDZN' : 'LIVE',              color: isRedline ? '#E10600' : '#00e676' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="uppercase text-gray-600 tracking-widest mb-0.5" style={{ fontFamily: FONT, fontSize: 'clamp(6px, 1.2vw, 9px)' }}>{label}</p>
              <p className="font-bold" style={{ fontFamily: FONT, fontSize: 'clamp(9px, 2.2vw, 13px)', color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom progress line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-100"
        style={{ width: `${rpmPct * 100}%`, background: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
      />

      {/* Status text */}
      <p
        className="absolute bottom-5 left-1/2 -translate-x-1/2 uppercase text-gray-700 tracking-widest whitespace-nowrap"
        style={{ fontFamily: FONT, fontSize: 'clamp(7px, 1.5vw, 9px)' }}
      >
        {phase === 'boot' ? 'INITIALISING SYSTEMS...' : 'ENGINE ONLINE'}
      </p>
    </div>
  );
}
