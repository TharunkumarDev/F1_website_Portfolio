import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CanvasScrollSequence from './CanvasScrollSequence';
import SoundEngine from './SoundEngine';
import DriversSection from './DriversSection';

gsap.registerPlugin(ScrollTrigger);

export default function MainExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full text-white bg-black">
      <SoundEngine />

      {/* ── CINEMATIC SCROLL SECTION ── */}
      <div className="cinematic-container relative h-[300vh] z-0">
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <CanvasScrollSequence />

          {/* Gradient fade-to-black at bottom so content section blends cleanly */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />

          {/* Hero text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none">
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl text-center" style={{ fontFamily: 'var(--font-f1)' }}>
              FUTURE IS NOW
            </h1>
            <p className="text-base md:text-lg mt-3 tracking-[0.3em] text-[#E10600] font-semibold uppercase">
              Experience Zero Gravity Motorsport
            </p>
          </div>
        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="relative z-10 w-full bg-[#030303]">
        <DriversSection />
      </div>
    </div>
  );
}

