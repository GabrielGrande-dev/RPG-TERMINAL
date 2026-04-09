interface TabSelectorProps {
  view: 'mestre' | 'jogador';
  setView: (view: 'mestre' | 'jogador') => void;
}

export function TabSelector({ view, setView }: TabSelectorProps) {
  return (
    <div className="flex bg-stone-900 border border-amber-900/20 rounded p-1">
      <button 
        onClick={() => setView('mestre')}
        className={`px-6 py-2 font-cinzel text-xs transition-all ${view === 'mestre' ? 'bg-amber-900/40 text-amber-200' : 'text-stone-600 hover:text-stone-400'}`}
      >
        CENTRAL DO MESTRE
      </button>
      <button 
        onClick={() => setView('jogador')}
        className={`px-6 py-2 font-cinzel text-xs transition-all ${view === 'jogador' ? 'bg-amber-900/40 text-amber-200' : 'text-stone-600 hover:text-stone-400'}`}
      >
        CENTRAL DO JOGADOR
      </button>
    </div>
  );
}