'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { FolderManager } from './FolderManager' // Importando o novo gerenciador

interface MestreViewProps {
  onMesaCreated: () => void;
}

export function MestreView({ onMesaCreated }: MestreViewProps) {
  const [nomeMesa, setNomeMesa] = useState('')
  const [loading, setLoading] = useState(false)
  const [minhasMesas, setMinhasMesas] = useState<any[]>([])
  const [mesaAtiva, setMesaAtiva] = useState<any>(null)

  async function carregarMinhasMesas() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('mesa')
      .select('*')
      .eq('id_usuario_criador', user.id)
      .order('created_at', { ascending: false })

    if (data) setMinhasMesas(data)
  }

  useEffect(() => {
    carregarMinhasMesas()
  }, [])

  async function handleCreateMesa(e: React.FormEvent) {
    e.preventDefault()
    if (!nomeMesa.trim()) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não identificado.")
      const { error } = await supabase
        .from('mesa')
        .insert([{ nome_mesa: nomeMesa, id_usuario_criador: user.id }])
      if (error) throw error
      setNomeMesa('')
      onMesaCreated()
      carregarMinhasMesas()
    } catch (error: any) {
      alert('Erro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // INTERFACE DE DENTRO DA MESA
  if (mesaAtiva) {
    return (
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
        <button 
          onClick={() => setMesaAtiva(null)}
          className="text-amber-600 hover:text-amber-400 font-cinzel text-[10px] mb-6 flex items-center gap-2 uppercase tracking-[0.2em]"
        >
          ← Retornar ao Salão
        </button>
        
        <header className="mb-10 border-b border-amber-900/20 pb-6 flex justify-between items-end">
          <div>
            <h2 className="font-cinzel text-4xl text-amber-500 uppercase tracking-tighter">
              {mesaAtiva.nome_mesa}
            </h2>
            <p className="text-stone-500 text-xs mt-2 font-serif italic">Soberano da Trama • ID: {mesaAtiva.id_mesa.split('-')[0]}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* COLUNA PRINCIPAL: GESTÃO DE PASTAS */}
           <div className="col-span-2">
              <FolderManager mesaId={mesaAtiva.id_mesa} />
           </div>

           {/* COLUNA LATERAL: AÇÕES DO MESTRE */}
           <aside className="space-y-6">
              <div className="bg-stone-950/40 p-6 rounded-lg border border-amber-900/10 shadow-xl">
                <h3 className="font-cinzel text-amber-700 text-xs mb-6 tracking-widest uppercase border-b border-amber-900/10 pb-2">
                   Painel de Controle
                </h3>
                <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-stone-500 font-cinzel">
                  <li className="flex items-center gap-3 hover:text-amber-400 cursor-pointer transition-colors group">
                    <span className="opacity-40 group-hover:opacity-100">⚔️</span> Convocar Jogadores
                  </li>
                  <li className="flex items-center gap-3 hover:text-amber-400 cursor-pointer transition-colors group">
                    <span className="opacity-40 group-hover:opacity-100">📜</span> Ver Personagens
                  </li>
                  <li className="flex items-center gap-3 hover:text-amber-400 cursor-pointer transition-colors group">
                    <span className="opacity-40 group-hover:opacity-100">⚙️</span> Ajustes da Mesa
                  </li>
                  <li className="pt-4 mt-4 border-t border-amber-900/10 flex items-center gap-3 text-red-900 hover:text-red-500 cursor-pointer transition-colors group">
                    <span className="opacity-40 group-hover:opacity-100">🔥</span> Dissolver Crônica
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-stone-800 rounded italic text-[10px] text-stone-600 text-center font-serif">
                "O destino dos aventureiros está em suas mãos."
              </div>
           </aside>
        </div>
      </div>
    )
  }

  // LISTA DE SELEÇÃO/CRIAÇÃO DE MESAS
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-cinzel text-2xl text-amber-600 tracking-widest uppercase">Salão dos Mestres</h2>
          <p className="text-stone-500 font-serif italic text-sm mt-2">Projete uma nova realidade para seus jogadores.</p>
        </div>
        
        <form onSubmit={handleCreateMesa} className="bg-stone-900/50 border border-amber-900/20 p-8 rounded-xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="font-cinzel text-[10px] text-amber-700 uppercase tracking-widest">Nome da Crônica</label>
            <input 
              type="text" 
              value={nomeMesa}
              onChange={(e) => setNomeMesa(e.target.value)}
              placeholder="Ex: O Despertar do Dragão..."
              className="w-full bg-stone-950 border border-amber-900/30 p-4 rounded text-amber-100 font-serif focus:border-amber-500 outline-none transition-all shadow-inner"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !nomeMesa}
            className="w-full bg-amber-900/40 hover:bg-amber-700 text-amber-100 py-4 rounded font-cinzel text-xs uppercase tracking-[0.3em] transition-all border border-amber-900/50 disabled:opacity-30"
          >
            {loading ? 'Tecendo o Destino...' : '[ Fundar Mesa ]'}
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <h3 className="font-cinzel text-amber-600/50 text-xs tracking-[0.3em] uppercase border-b border-amber-900/10 pb-2">Suas Crônicas Ativas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {minhasMesas.map((mesa) => (
            <div 
              key={mesa.id_mesa}
              onClick={() => setMesaAtiva(mesa)}
              className="group p-6 bg-stone-900/60 border border-amber-900/20 rounded-lg hover:border-amber-500 transition-all cursor-pointer flex justify-between items-center"
            >
              <div>
                <h4 className="font-cinzel text-amber-100 group-hover:text-amber-500 transition-colors">{mesa.nome_mesa}</h4>
                <p className="text-[10px] text-stone-600 mt-1 uppercase">Soberano da Trama</p>
              </div>
              <span className="text-amber-700 font-cinzel text-[10px] border border-amber-900/30 px-3 py-1 rounded group-hover:bg-amber-900/20 transition-all">ABRIR</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}