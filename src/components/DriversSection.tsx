const TEAM_COLORS: Record<string, { from: string; to: string; accent: string }> = {
  McLaren:           { from: '#FF8000', to: '#e65c00', accent: '#FF8000' },
  Mercedes:          { from: '#00D2BE', to: '#006b63', accent: '#00D2BE' },
  Ferrari:           { from: '#DC0000', to: '#7a0000', accent: '#DC0000' },
  'Red Bull Racing': { from: '#3671C6', to: '#0D1B2A', accent: '#3671C6' },
  Alpine:            { from: '#FF69B4', to: '#002f6c', accent: '#FF69B4' },
  Aston_Martin:      { from: '#358C75', to: '#162b22', accent: '#358C75' },
};

const drivers = [
  { first: 'LANDO',   last: 'NORRIS',    team: 'McLaren',         num: '4',  img: 'https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png' },
  { first: 'OSCAR',   last: 'PIASTRI',   team: 'McLaren',         num: '81', img: 'https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png' },
  { first: 'MAX',     last: 'VERSTAPPEN',team: 'Red Bull Racing',  num: '1',  img: 'https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png' },
  { first: 'GEORGE',  last: 'RUSSELL',   team: 'Mercedes',        num: '63', img: 'https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png' },
  { first: 'LEWIS',   last: 'HAMILTON',  team: 'Ferrari',         num: '44', img: 'https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png' },
  { first: 'CHARLES', last: 'LECLERC',   team: 'Ferrari',         num: '16', img: 'https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png' },
  { first: 'CARLOS',  last: 'SAINZ',     team: 'McLaren',         num: '55', img: 'https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png' },
];

const standings = [
  { pos: 1, driver: 'Lando Norris',    nat: '🇬🇧', team: 'McLaren',         pts: 390, teamColor: '#FF8000' },
  { pos: 2, driver: 'Oscar Piastri',   nat: '🇦🇺', team: 'McLaren',         pts: 366, teamColor: '#FF8000' },
  { pos: 3, driver: 'Max Verstappen',  nat: '🇳🇱', team: 'Red Bull Racing', pts: 341, teamColor: '#3671C6' },
  { pos: 4, driver: 'George Russell',  nat: '🇬🇧', team: 'Mercedes',        pts: 285, teamColor: '#00D2BE' },
  { pos: 5, driver: 'Charles Leclerc', nat: '🇲🇨', team: 'Ferrari',         pts: 241, teamColor: '#DC0000' },
  { pos: 6, driver: 'Lewis Hamilton',  nat: '🇬🇧', team: 'Ferrari',         pts: 229, teamColor: '#DC0000' },
];

const news = [
  { tag: 'Feature',     tagColor: 'text-red-400 bg-red-500/10',    title: 'How Lando Norris secured the 2025 Drivers Championship in Singapore',   img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800' },
  { tag: 'Race Report', tagColor: 'text-orange-400 bg-orange-500/10', title: 'Singapore Grand Prix 2025 – Full race review and reaction',            img: 'https://images.unsplash.com/photo-1614026480209-cd9934144671?auto=format&fit=crop&q=80&w=800' },
  { tag: 'Analysis',    tagColor: 'text-blue-400 bg-blue-500/10',   title: "Lewis Hamilton's debut 2025 season at Ferrari – A data breakdown",      img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800' },
  { tag: 'Preview',     tagColor: 'text-green-400 bg-green-500/10', title: 'Las Vegas Grand Prix 2025 – Strategy and everything you need to know',  img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' },
];

export default function DriversSection() {
  return (
    <div className="w-full text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ─── KNOW YOUR DRIVERS ─── */}
      <section id="drivers" className="max-w-screen-2xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-14 md:pb-20">
        <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6">
          <span className="bg-[#E10600] text-white text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-2.5 md:px-3 py-1 rounded-sm">Drivers</span>
          <span className="bg-[#1a1a1a] text-gray-400 text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-2.5 md:px-3 py-1 rounded-sm border border-white/5">Teams</span>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-f1)' }}>
          KNOW YOUR DRIVERS
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mb-8 md:mb-10 leading-relaxed max-w-lg">
          2025 Formula 1 World Championship — Meet the grid's finest pushing the limits of speed and engineering.
        </p>

        {/* Horizontal scroll on all sizes, 2 visible on mobile, more on larger */}
        <div className="flex gap-2.5 md:gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 md:mx-0 px-4 md:px-0">
          {drivers.map((d) => {
            const colors = TEAM_COLORS[d.team] || { from: '#333', to: '#111', accent: '#E10600' };
            return (
              <div
                key={d.last}
                className="group flex-shrink-0 w-[155px] sm:w-[180px] md:w-[200px] rounded-lg overflow-hidden relative cursor-pointer"
                style={{
                  height: 'clamp(220px, 30vw, 300px)',
                  background: `linear-gradient(160deg, ${colors.from}30 0%, ${colors.to}95 100%)`,
                  border: `1px solid ${colors.accent}30`,
                }}
              >
                {/* Number watermark */}
                <div
                  className="absolute -bottom-3 -right-1 font-black italic leading-none pointer-events-none select-none"
                  style={{ fontSize: 'clamp(70px, 12vw, 120px)', color: `${colors.accent}18`, fontFamily: 'var(--font-f1)' }}
                >
                  {d.num}
                </div>

                {/* Team accent top bar */}
                <div className="h-[3px] w-full absolute top-0 left-0" style={{ backgroundColor: colors.accent }} />

                {/* Driver image */}
                <img
                  src={d.img}
                  alt={`${d.first} ${d.last}`}
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[85%] w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-105 drop-shadow-xl"
                />

                {/* Name block */}
                <div className="absolute top-3 left-3 z-10">
                  <p className="text-[9px] text-white/55 uppercase tracking-[0.15em] font-medium mb-0.5">{d.team}</p>
                  <p className="text-[11px] md:text-xs font-black italic text-white leading-tight uppercase" style={{ fontFamily: 'var(--font-f1)' }}>{d.first}</p>
                  <p className="text-base md:text-lg font-black italic text-white leading-tight uppercase" style={{ fontFamily: 'var(--font-f1)' }}>{d.last}</p>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to top, ${colors.accent}20, transparent)` }}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SEASON / STANDINGS ─── */}
      <section id="season" className="bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6">
            <span className="bg-[#E10600] text-white text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-2.5 md:px-3 py-1 rounded-sm">Season</span>
            <span className="bg-[#1a1a1a] text-gray-400 text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-2.5 md:px-3 py-1 rounded-sm border border-white/5">Archive</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-f1)' }}>
            2025 SEASON
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mb-10 md:mb-12 max-w-lg">
            McLaren clinched a historic Constructors' Championship — Norris sealing the Drivers' title in Singapore.
          </p>

          {/* PODIUM — stacks vertically on mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-10 md:mb-16">
            {/* 2nd */}
            <div className="flex-1 bg-gradient-to-t from-[#e65c00] to-[#ffae1a] rounded-xl relative overflow-hidden flex flex-col justify-end p-5 md:p-6 shadow-xl min-h-[160px] sm:min-h-[220px]">
              <div className="absolute -top-6 -left-3 font-black italic text-white/15 leading-none select-none" style={{ fontSize: 'clamp(100px, 18vw, 160px)', fontFamily: 'var(--font-f1)' }}>2</div>
              <p className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">2nd Place</p>
              <p className="text-xl md:text-2xl font-black italic">366 PTS</p>
              <p className="text-xs md:text-sm font-semibold text-white/80">OSCAR PIASTRI</p>
            </div>
            {/* 1st */}
            <div className="flex-1 bg-gradient-to-t from-[#e65c00] to-[#ffc200] rounded-xl relative overflow-hidden flex flex-col justify-end p-5 md:p-6 shadow-[0_0_40px_rgba(255,140,0,0.35)] sm:scale-[1.04] sm:z-10 min-h-[180px] sm:min-h-[280px]">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/20 text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                🏆 Champion
              </div>
              <div className="absolute -top-8 -left-3 font-black italic text-white/15 leading-none select-none" style={{ fontSize: 'clamp(120px, 22vw, 200px)', fontFamily: 'var(--font-f1)' }}>1</div>
              <p className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">World Champion</p>
              <p className="text-2xl md:text-3xl font-black italic">390 PTS</p>
              <p className="text-xs md:text-sm font-semibold text-white/80">LANDO NORRIS</p>
            </div>
            {/* 3rd */}
            <div className="flex-1 bg-gradient-to-t from-[#0D1B2A] to-[#3671C6] rounded-xl relative overflow-hidden flex flex-col justify-end p-5 md:p-6 shadow-xl min-h-[150px] sm:min-h-[200px]">
              <div className="absolute -top-6 -left-3 font-black italic text-white/15 leading-none select-none" style={{ fontSize: 'clamp(100px, 18vw, 160px)', fontFamily: 'var(--font-f1)' }}>3</div>
              <p className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">3rd Place</p>
              <p className="text-xl md:text-2xl font-black italic">341 PTS</p>
              <p className="text-xs md:text-sm font-semibold text-white/80">MAX VERSTAPPEN</p>
            </div>
          </div>

          {/* STANDINGS TABLE — horizontally scrollable on mobile */}
          <div className="rounded-xl overflow-hidden border border-white/5 overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="bg-[#111] border-b border-white/5 text-[10px] md:text-[11px] text-gray-500 uppercase tracking-widest font-semibold">
                  <th className="px-4 md:px-6 py-3 text-left w-10">POS</th>
                  <th className="px-4 md:px-6 py-3 text-left">DRIVER</th>
                  <th className="px-3 py-3 text-center w-12">FLAG</th>
                  <th className="px-4 md:px-6 py-3 text-left">TEAM</th>
                  <th className="px-4 md:px-6 py-3 text-right w-20">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s, i) => (
                  <tr key={i} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === 0 ? 'bg-[#1a1200]' : 'bg-[#0d0d0d]'}`}>
                    <td className="px-4 md:px-6 py-4 font-black text-base" style={{ color: i === 0 ? '#FFB300' : '#555' }}>{s.pos}</td>
                    <td className="px-4 md:px-6 py-4 font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-[3px] h-5 rounded-full flex-shrink-0" style={{ backgroundColor: s.teamColor }} />
                        {s.driver}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center text-lg">{s.nat}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-400">{s.team}</td>
                    <td className="px-4 md:px-6 py-4 text-right font-black text-base" style={{ color: s.teamColor }}>{s.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-[#0f0f0f] text-center text-xs text-gray-500 cursor-pointer hover:text-white transition-colors uppercase tracking-widest font-medium flex items-center justify-center gap-2">
              See full standings
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EDITOR'S PICKS ─── */}
      <section id="news" className="max-w-screen-2xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <span className="bg-[#E10600] text-white text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-2.5 md:px-3 py-1 rounded-sm">Latest</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tight" style={{ fontFamily: 'var(--font-f1)' }}>EDITOR'S PICKS</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:border-white/30 flex-shrink-0">
            View all <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* 1 col on mobile → 2 on md → 4 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {news.map((n, i) => (
            <div key={i} className="group rounded-xl overflow-hidden border border-white/5 bg-[#0d0d0d] cursor-pointer hover:border-white/15 transition-all duration-300 flex flex-col">
              <div className="relative overflow-hidden" style={{ height: 'clamp(160px, 25vw, 210px)' }}>
                <img
                  src={n.img}
                  alt={n.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547389679-2c493cc3f97b?auto=format&fit=crop&q=80&w=800'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
              </div>
              <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
                <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-sm inline-block w-fit ${n.tagColor}`}>{n.tag}</span>
                <p className="font-bold text-sm leading-snug text-gray-100 group-hover:text-white transition-colors line-clamp-3">{n.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile "view all" */}
        <button className="md:hidden mt-6 w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-3 rounded-full hover:border-white/30">
          View all stories <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="footer-section" className="border-t border-white/5 bg-[#060606]">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="Formula 1" className="h-7 object-contain" />
            <p className="text-[10px] text-gray-600 tracking-widest uppercase text-center md:text-left">© 2025 Formula One Group. Portfolio Concept.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
            {['Drivers', 'Teams', 'Schedule', 'News'].map((l) => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <div className="flex gap-3">
            {['T', 'I', 'Y'].map((s) => (
              <div key={s} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#E10600] hover:bg-[#E10600]/10 cursor-pointer transition-all">
                <span className="text-[11px] text-gray-400 font-bold">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
