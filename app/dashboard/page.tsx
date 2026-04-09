'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // ESTADO CHAVE: Define se estamos vendo a aba de Mestre ou Jogador
  const [view, setView] = useState<'mestre' | 'jogador'>('mestre') 
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      
      setUser(user)

      // Se for Mestre: Busca campanhas criadas por você
      if (view === 'mestre') {
        const { data } = await supabase
          .from('campaigns')
          .select('*')
          .eq('master_id', user.id)
          .order('created_at', { ascending: false })
        if (data) setCampaigns(data)
      } 
      // Se for Jogador: Aqui futuramente buscaremos as mesas via tabela pivot (ex: 'members')
      else {
        setCampaigns([]) // Por enquanto vazio até termos a lógica de convite
      }
      
      setLoading(false)
    }
    fetchData()
  }, [router, view])

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200 p-8 font-serif relative">
      
      {/* BACKGROUND IMERSIVO */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none grayscale filter contrast-125">
        <Image src="/imagem_de_fundo_rpg.jpg" alt="" fill className="object-cover" />
      </div>

      <div className="relative z-10">
        {/* HEADER COM SELEÇÃO DE ABA */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-amber-900/30 pb-6 mb-10 gap-6">
          <div>
            <h1 className="font-cinzel text-2xl text-amber-500 tracking-widest uppercase">
              {view === 'mestre' ? 'Santuário do Mestre' : 'Santuário do Jogador'}
            </h1>
            <p className="text-stone-500 italic text-sm">Bem-vindo, {user?.email?.split('@')[0]}</p>
          </div>

          {/* BOTÕES DE NAVEGAÇÃO ENTRE ABAS */}
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
        </header>

        {/* CONTEÚDO DINÂMICO */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {view === 'mestre' ? (
            <>
              {/* Opção de Criar (Só para Mestre) */}
              <button className="group border-2 border-dashed border-stone-800 p-8 rounded-lg hover:border-amber-900/50 flex flex-col items-center justify-center space-y-4 transition-all">
                <span className="text-4xl text-stone-700 group-hover:text-amber-700">+</span>
                <span className="font-cinzel text-stone-600 group-hover:text-amber-600 uppercase text-xs">Iniciar Nova Crônica</span>
              </button>

              {campaigns.map((camp) => (
                <div key={camp.id} className="bg-stone-900/80 border border-amber-900/30 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(120,53,15,0.2)] cursor-pointer group">
                  <h3 className="font-cinzel text-xl text-amber-200 mb-2">{camp.name}</h3>
                  <p className="text-xs text-stone-500 mb-4">{camp.description || "Sem descrição disponível."}</p>
                  <div className="flex justify-between text-[10px] font-mono text-amber-900 border-t border-stone-800 pt-4">
                    <span>PLAYERS: 0</span> {/* Futura contagem de membros */}
                    <span>MESTRE: VOCÊ</span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* VISUALIZAÇÃO DO JOGADOR */
            <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-900 rounded-xl">
              <p className="font-serif italic text-stone-600">
                "Nenhum pergaminho de convocação foi encontrado em sua mochila..."
              </p>
              <p className="text-[10px] font-cinzel text-amber-900 mt-4 uppercase tracking-widest">
                Aguardando convite de um mestre autorizado
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}