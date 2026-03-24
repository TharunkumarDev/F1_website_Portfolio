import { useEffect, useState } from 'react';

const links: { label: string; target: string }[] = [
  { label: 'Home',     target: 'hero' },
  { label: 'Drivers',  target: 'drivers' },
  { label: 'Season',   target: 'season' },
  { label: 'News',     target: 'news' },
  { label: 'Contact',  target: 'footer-section' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string, label: string) => {
    setActive(label);
    setMenuOpen(false);
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handle = () => setMenuOpen(false);
    document.addEventListener('click', handle, { once: true });
    return () => document.removeEventListener('click', handle);
  }, [menuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        style={{
          background: scrolled || menuOpen ? 'rgba(3,3,3,0.95)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.7)' : 'none',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">

          {/* LEFT: F1 Logo */}
          <a href="#" className="flex-shrink-0 z-10">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg"
              alt="Formula 1"
              className="h-5 md:h-6 object-contain"
            />
          </a>

          {/* CENTER: pill nav — desktop only */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/8 p-1 rounded-full backdrop-blur-sm">
            {links.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => scrollTo(target, label)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 ${
                  active === label
                    ? 'bg-[#E10600] text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Subscribe — desktop */}
            <button className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide bg-[#E10600] text-white hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:shadow-none flex-shrink-0">
              Subscribe
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? 'max-h-80 pb-4' : 'max-h-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col px-4 pt-2 gap-1">
            {links.map(({ label, target }) => (
              <button
                key={label}
                onClick={() => scrollTo(target, label)}
                className={`w-full text-left px-5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                  active === label
                    ? 'bg-[#E10600] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/8'
                }`}
              >
                {label}
              </button>
            ))}
            <button className="mt-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-[#E10600] hover:text-white transition-all duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
