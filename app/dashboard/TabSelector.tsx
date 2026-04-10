'use client'

interface TabSelectorProps {
  view: 'mestre' | 'jogador';
  setView: (view: 'mestre' | 'jogador') => void;
}

export function TabSelector({ view, setView }: TabSelectorProps) {
  return (
    <div className="flex bg-stone-950/80 border border-amber-900/30 rounded-lg p-1 shadow-2xl backdrop-blur-sm">
      <button 
        onClick={() => setView('mestre')}
        className={`px-6 py-2 font-cinzel text-[10px] tracking-[0.2em] transition-all duration-500 rounded-md ${
          view === 'mestre' 
            ? 'bg-amber-900/30 text-amber-400 shadow-[0_0_15px_rgba(120,53,15,0.3)] border border-amber-900/50' 
            : 'text-stone-600 hover:text-amber-700'
        }`}
      >
        CENTRAL DO MESTRE
      </button>
      
      <div className="w-[1px] bg-amber-900/10 mx-1 my-2" /> {/* Divisor sutil */}

      <button 
        onClick={() => setView('jogador')}
        className={`px-6 py-2 font-cinzel text-[10px] tracking-[0.2em] transition-all duration-500 rounded-md ${
          view === 'jogador' 
            ? 'bg-amber-900/30 text-amber-400 shadow-[0_0_15px_rgba(120,53,15,0.3)] border border-amber-900/50' 
            : 'text-stone-600 hover:text-amber-700'
        }`}
      >
        CENTRAL DO JOGADOR
      </button>
    </div>
  );
}