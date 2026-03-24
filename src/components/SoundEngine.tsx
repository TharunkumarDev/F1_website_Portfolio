import { useEffect, useRef, useState } from 'react';

export default function SoundEngine() {
  const [muted, setMuted] = useState(false);
  const ctxRef    = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const oscRefs   = useRef<OscillatorNode[]>([]);
  const rpmRef    = useRef(3000);
  const lastYRef  = useRef(0);
  const rafRef    = useRef(0);
  const startedRef = useRef(false);

  const buildEngine = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    ctx.resume(); // ensure not suspended
    ctxRef.current = ctx;

    // Master volume
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Shared distortion
    const dist = ctx.createWaveShaper();
    const n = 512, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + 200) * x) / (Math.PI + 200 * Math.abs(x));
    }
    dist.curve = curve;
    dist.oversample = '4x';
    dist.connect(master);

    const makeOsc = (type: OscillatorType, freq: number, gainVal: number): OscillatorNode => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = gainVal;
      osc.connect(g);
      g.connect(dist);
      osc.start();
      return osc;
    };

    // V6: firing freq = RPM/60 * 3
    // at 3000 RPM = 150 Hz fundamental
    oscRefs.current = [
      makeOsc('sawtooth', 150, 0.6),   // fundamental
      makeOsc('sawtooth', 300, 0.25),  // 2nd harmonic
      makeOsc('square',   450, 0.12),  // 3rd harmonic
      makeOsc('sine',    5000, 0.04),  // turbo whine
    ];

    // Ramp up volume
    master.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.0);
  };

  // Scroll → RPM → frequency update
  useEffect(() => {
    const loop = () => {
      const y = window.scrollY;
      const vel = Math.abs(y - lastYRef.current);
      lastYRef.current = y;

      // Smooth RPM
      const target = 3000 + Math.min(vel * 60, 12000);
      rpmRef.current += (target - rpmRef.current) * 0.1;
      const rpm = rpmRef.current;

      if (ctxRef.current && !muted) {
        const t   = ctxRef.current.currentTime;
        const tau = 0.08;
        const f   = (rpm / 60) * 3; // firing freq

        oscRefs.current[0]?.frequency.setTargetAtTime(f,     t, tau);
        oscRefs.current[1]?.frequency.setTargetAtTime(f * 2, t, tau);
        oscRefs.current[2]?.frequency.setTargetAtTime(f * 3, t, tau);
        // Turbo sweep
        oscRefs.current[3]?.frequency.setTargetAtTime(
          4000 + ((rpm - 3000) / 12000) * 10000, t, tau
        );
        // Volume rises with RPM
        const vol = 0.2 + ((rpm - 3000) / 12000) * 0.2;
        masterRef.current?.gain.setTargetAtTime(vol, t, tau);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [muted]);

  // Mute toggle
  useEffect(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    master.gain.setTargetAtTime(muted ? 0 : 0.25, ctx.currentTime, 0.1);
  }, [muted]);

  // Auto-start on very first scroll or click anywhere
  useEffect(() => {
    const start = () => buildEngine();
    window.addEventListener('scroll', start, { once: true });
    window.addEventListener('click',  start, { once: true });
    return () => {
      window.removeEventListener('scroll', start);
      window.removeEventListener('click',  start);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup
  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    oscRefs.current.forEach(o => { try { o.stop(); } catch {} });
    ctxRef.current?.close();
  }, []);

  const handleClick = () => {
    buildEngine(); // start on first button click too
    setMuted(v => !v);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={buildEngine} // warm up on hover
      aria-label="Toggle engine sound"
      style={{
        position:       'fixed',
        bottom:         '24px',
        left:           '24px',
        zIndex:         9999,
        display:        'flex',
        alignItems:     'center',
        gap:            '7px',
        padding:        '9px 16px',
        borderRadius:   '999px',
        border:         `1px solid ${muted ? 'rgba(255,255,255,0.14)' : 'rgba(225,6,0,0.6)'}`,
        background:     muted ? 'rgba(10,10,10,0.92)' : 'rgba(225,6,0,0.15)',
        color:          muted ? '#555' : '#E10600',
        boxShadow:      muted ? 'none' : '0 0 18px rgba(225,6,0,0.35)',
        backdropFilter: 'blur(16px)',
        cursor:         'pointer',
        fontFamily:     "'Orbitron', monospace",
        fontSize:       '10px',
        fontWeight:     700,
        letterSpacing:  '0.2em',
        textTransform:  'uppercase',
        transition:     'all 0.25s',
        userSelect:     'none',
      }}
    >
      {/* Speaker icon */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {muted ? (
          <>
            <line x1="23" y1="9"  x2="17" y2="15" />
            <line x1="17" y1="9"  x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
      {muted ? 'SOUND OFF' : 'SOUND ON'}
    </button>
  );
}
