import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const navigationNodes = [
  { id: 'performance', label: 'Performance' },
  { id: 'aerodynamics', label: 'Aerodynamics' },
  { id: 'hamilton', label: 'Lewis Hamilton' },
  { id: 'senna', label: 'Ayrton Senna' },
  { id: 'schumacher', label: 'Michael Schumacher' },
  { id: 'verstappen', label: 'Max Verstappen' },
  { id: 'future', label: 'Future Is Now' }
];

export default function SpatialNavigation() {
  
  const scrollTo = (id: string) => {
    // Lenis is exposed globally or we can just scroll window
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Reveal nodes sequentially with delayed inertia
    gsap.fromTo('.nav-node', 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out', delay: 1 }
    );

    // Dynamic active state based on scroll
    navigationNodes.forEach((node) => {
      ScrollTrigger.create({
        trigger: `#${node.id}`,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => activateNode(node.id),
        onEnterBack: () => activateNode(node.id),
      });
    });

  }, []);

  const activateNode = (id: string) => {
    document.querySelectorAll('.nav-node-dot').forEach(el => {
      el.classList.remove('bg-white', 'scale-150', 'shadow-[0_0_15px_var(--color-f1-red)]');
      el.classList.add('bg-gray-700');
    });
    document.querySelectorAll('.nav-node-label').forEach(el => {
      el.classList.remove('text-white', 'opacity-100');
      el.classList.add('text-gray-500', 'opacity-0');
    });

    const activeDot = document.getElementById(`nav-dot-${id}`);
    const activeLabel = document.getElementById(`nav-label-${id}`);
    if (activeDot) {
      activeDot.classList.remove('bg-gray-700');
      activeDot.classList.add('bg-white', 'scale-150', 'shadow-[0_0_15px_var(--color-f1-red)]');
    }
    if (activeLabel) {
      activeLabel.classList.remove('text-gray-500', 'opacity-0');
      activeLabel.classList.add('text-white', 'opacity-100');
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-end gap-8 pointer-events-auto">
      {/* Animated Red Data Line connecting nodes */}
      <div className="absolute right-[5px] top-6 bottom-6 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-f1-red)] to-transparent opacity-50 shadow-[0_0_10px_var(--color-f1-red)]" />

      {navigationNodes.map((node) => (
        <div 
          key={node.id} 
          className="nav-node group flex items-center gap-4 cursor-pointer relative"
          onClick={() => scrollTo(node.id)}
        >
          <span 
            id={`nav-label-${node.id}`}
            className="nav-node-label text-sm uppercase tracking-widest font-bold text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
            style={{ fontFamily: 'var(--font-f1)' }}
          >
            {node.label}
          </span>
          <div 
            id={`nav-dot-${node.id}`}
            className="nav-node-dot w-3 h-3 rounded-full bg-gray-700 border border-[var(--color-f1-red)] transition-all duration-300 relative z-10 group-hover:bg-[var(--color-f1-red)] group-hover:scale-125"
          />
        </div>
      ))}
    </div>
  );
}
