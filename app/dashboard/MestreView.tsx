import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface MestreViewProps {
  campaigns: any[]
  refreshData: () => void // Adicionamos essa prop para atualizar a lista automaticamente
}

export function MestreView({ campaigns, refreshData }: MestreViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Estados do Formulário
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase
        .from('campaigns')
        .insert([
          { 
            name, 
            description, 
            master_id: user.id,
            status: 'ativa' // Status padrão inicial
          }
        ])

      if (!error) {
        setIsModalOpen(false)
        setName('')
        setDescription('')
        refreshData() // Chama a função para recarregar as mesas na tela
      } else {
        alert('Erro ao selar crônica: ' + error.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* GRADE DE CAMPANHAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* BOTÃO ADICIONAR */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group border-2 border-dashed border-amber-900/30 p-8 rounded-lg hover:border-amber-600/50 flex flex-col items-center justify-center space-y-4 transition-all bg-stone-900/20"
        >
          <div className="w-12 h-12 rounded-full border border-amber-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-3xl text-amber-700">+</span>
          </div>
          <span className="font-cinzel text-stone-500 group-hover:text-amber-600 uppercase text-[10px] tracking-widest">
            Selar Nova Crônica
          </span>
        </button>

        {/* LISTAGEM EXISTENTE */}
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-stone-900/60 border border-amber-900/20 p-6 rounded-lg hover:bg-stone-900 transition-all border-l-4 border-l-amber-700 shadow-xl relative group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-cinzel text-xl text-amber-200">{camp.name}</h3>
              <span className="text-[9px] px-2 py-1 bg-amber-900/30 text-amber-500 border border-amber-900/50 rounded uppercase">Ativa</span>
            </div>
            <p className="text-xs text-stone-500 italic mb-6 line-clamp-2">{camp.description}</p>
            <div className="grid grid-cols-2 gap-4 border-t border-stone-800 pt-4">
                <div className="flex flex-col">
                    <span className="text-[8px] text-stone-600 uppercase tracking-widest">Aventureiros</span>
                    <span className="text-xs font-mono text-amber-900">00 / 06</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL COM FORMULÁRIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateCampaign}
            className="bg-stone-900 border-2 border-amber-900/50 p-8 rounded-lg w-full max-w-md shadow-2xl space-y-6"
          >
            <h2 className="font-cinzel text-xl text-amber-500 text-center uppercase tracking-widest">Registrar Crônica</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-amber-900 mb-1 font-bold">Título da Mesa</label>
                <input 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-amber-900/30 p-3 rounded text-amber-100 focus:outline-none focus:border-amber-600 transition-colors font-serif"
                  placeholder="Ex: A Queda de Arathos"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-amber-900 mb-1 font-bold">Sinopse/Descrição</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-amber-900/30 p-3 rounded text-amber-100 focus:outline-none focus:border-amber-600 transition-colors font-serif h-32 resize-none"
                  placeholder="Uma breve lenda sobre o que aguarda os heróis..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 hover:bg-amber-600 text-stone-950 font-cinzel font-bold py-3 rounded transition-colors uppercase text-xs"
              >
                {loading ? "Invocando..." : "[ Selar Destino ]"}
              </button>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full text-stone-600 hover:text-stone-400 font-cinzel text-[10px] uppercase tracking-widest py-2"
              >
                Cancelar Ritual
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}