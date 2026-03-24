import { useEffect, useRef } from 'react';

export default function SoundEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        
        oscRef.current = audioCtxRef.current.createOscillator();
        gainRef.current = audioCtxRef.current.createGain();
        
        // Deep sub-bass F1 humming
        oscRef.current.type = 'sawtooth';
        oscRef.current.frequency.value = 45; 
        
        // Filter down the sawtooth to make it sound muffled/bass-heavy
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        
        gainRef.current.gain.value = 0.05; // Idle ambient hum
        
        oscRef.current.connect(filter);
        filter.connect(gainRef.current);
        gainRef.current.connect(audioCtxRef.current.destination);
        
        oscRef.current.start();
      }
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    
    let ticker: number;
    const handleScroll = () => {
      if (!gainRef.current || !oscRef.current) return;
      
      const currentScrollY = window.scrollY;
      const velocity = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;
      
      // Map scroll velocity to pitch and volume
      const targetFreq = 45 + Math.min(velocity * 2, 80);
      const targetVolume = 0.05 + Math.min(velocity * 0.005, 0.2);
      
      // Smooth transition
      oscRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current!.currentTime, 0.1);
      gainRef.current.gain.setTargetAtTime(targetVolume, audioCtxRef.current!.currentTime, 0.1);
    };

    const loop = () => {
      handleScroll();
      ticker = requestAnimationFrame(loop);
    };

    window.addEventListener('click', initAudio, { once: true });
    ticker = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(ticker);
      window.removeEventListener('click', initAudio);
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch(e) {}
      }
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return null;
}
