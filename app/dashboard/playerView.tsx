'use client'
import { useState, useEffect } from 'react'
import { BibliotecaView } from './BibliotecaView'
import { FolderManager } from './FolderManager' // Reaproveitando o componente de pastas

export default function PlayerView() {
  const [mesaId, setMesaId] = useState<string | null>(null)
  const [inputMesaId, setInputMesaId] = useState('')

  // Carrega a mesa anterior se houver
  useEffect(() => {
    const savedMesa = localStorage.getItem('active_mesa_id')
    if (savedMesa) {
      setMesaId(savedMesa)
      setInputMesaId(savedMesa)
    }
  }, [])

  const conectarMesa = () => {
    if (inputMesaId.trim().length > 5) {
      setMesaId(inputMesaId)
      localStorage.setItem('active_mesa_id', inputMesaId)
    }
  }

  const sairDaMesa = () => {
    setMesaId(null)
    localStorage.removeItem('active_mesa_id')
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-6 space-y-12 animate-in fade-in duration-500">
      
      {/* SEÇÃO 1: BIBLIOTECA GLOBAL (Livre para todos) */}
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="font-cinzel text-3xl text-amber-600 tracking-[0.3em] uppercase">Biblioteca Arcana</h2>
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-amber-900/50 to-transparent mt-3"></div>
          <p className="text-stone-500 font-serif italic mt-3 text-sm">Manuais e tomos compartilhados por todos os reinos.</p>
        </div>
        
        {/* BibliotecaView sem filtro de mesa e com isMestre=false */}
        <BibliotecaView isMestre={false} />
      </section>

      <div className="relative py-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-amber-900/20"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-stone-950 px-4 text-amber-900/40 text-2xl rotate-45">✨</span>
        </div>
      </div>

      {/* SEÇÃO 2: DOCUMENTOS DA MESA (Privado/Controlado pelo Mestre) */}
      <section className="max-w-6xl mx-auto pb-20">
        {!mesaId ? (
          <div className="bg-stone-900/40 border border-amber-900/10 p-12 rounded-3xl text-center space-y-6 backdrop-blur-sm shadow-2xl">
            <div className="space-y-2">
              <h3 className="font-cinzel text-amber-700 uppercase tracking-[0.2em] text-lg">Acessar Crônica Específica</h3>
              <p className="text-stone-500 font-serif italic text-xs">Insira o selo da mesa para invocar os mapas e registros da sua jornada.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Ex: 1f4cb17d..." 
                className="flex-1 bg-black border border-amber-900/30 p-4 rounded-xl text-sm text-amber-100 font-mono outline-none focus:border-amber-500 transition-all text-center"
                value={inputMesaId}
                onChange={(e) => setInputMesaId(e.target.value)}
              />
              <button 
                onClick={conectarMesa}
                className="bg-amber-900/30 hover:bg-amber-800 text-amber-200 px-8 py-4 rounded-xl font-cinzel text-xs tracking-widest transition-all border border-amber-900/50"
              >
                CONECTAR
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-amber-900/20 pb-6">
              <div>
                <h3 className="font-cinzel text-amber-600 uppercase tracking-widest text-xl">Registros da Jornada</h3>
                <p className="text-[10px] text-stone-600 font-mono uppercase mt-1 tracking-tighter">Conectado ao ID: {mesaId}</p>
              </div>
              <button 
                onClick={sairDaMesa}
                className="text-[10px] text-stone-700 hover:text-red-500 uppercase font-cinzel transition-colors border border-stone-800 px-4 py-2 rounded-lg hover:border-red-900/30"
              >
                Abandonar Mesa
              </button>
            </div>
            
            {/* O FolderManager agora recebe o mesaId e isMestre=false */}
            {/* Ele filtrará as pastas pela visibilidade=true que você definiu no Supabase */}
            <FolderManager mesaId={mesaId} isMestre={false} />
          </div>
        )}
      </section>
    </div>
  )
}