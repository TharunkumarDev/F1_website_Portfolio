import { useState, useRef, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainExperience from './components/MainExperience';
import Navbar from './components/Navbar';
import Lenis from 'lenis';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    if (loadingComplete) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [loadingComplete]);

  return (
    <>
      {!loadingComplete && <LoadingScreen onComplete={() => setLoadingComplete(true)} />}
      {loadingComplete && (
        <>
          <Navbar />
          <MainExperience />
        </>
      )}
    </>
  );
}

export default App;
