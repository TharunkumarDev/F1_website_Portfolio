import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CanvasScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We have 240 frames: ezgif-frame-001.jpg to ezgif-frame-240.jpg
    const frameCount = 240;
    const currentFrame = (index: number) => {
      // frames are 1-indexed and padded to 3 digits
      const paddedIndex = index.toString().padStart(3, '0');
      return `/assets/sequence/ezgif-frame-${paddedIndex}.jpg`;
    };

    const images: HTMLImageElement[] = [];
    const airframes = {
      frame: 1
    };

    // Preload all images
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    // Set canvas dimensions to match viewport or fixed wide aspect ratio
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    images[0].onload = () => {
      render();
    };

    function render() {
      if (!canvas || !ctx) return;
      // Clear canvas and draw current frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = images[airframes.frame - 1];
      if (img && img.complete) {
        // Calculate "cover" scale
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    }

    // Bind Canvas rendering to ScrollTrigger
    const st = gsap.to(airframes, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: ".cinematic-container", 
        start: "top top",
        end: "bottom bottom",
        scrub: 1, 
      },
      onUpdate: render
    });

    // Resize handler
    const onResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      st.kill();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
    />
  );
}
