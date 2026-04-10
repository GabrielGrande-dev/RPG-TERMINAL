'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { TabSelector } from './TabSelector'
import { MestreView } from './MestreView'
import { BibliotecaView } from './BibliotecaView'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'santuario' | 'biblioteca' | 'config'>('santuario')
  const [user, setUser] = useState<any>(null)
  
  // Estados para as mesas
  const [mestreMesas, setMestreMesas] = useState<any[]>([])
  const [jogadorMesas, setJogadorMesas] = useState<any[]>([])
  
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'mestre' | 'jogador'>('mestre') 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Busca mesas onde eu sou o MESTRE (criador)
    const { data: mesasCriadas } = await supabase
      .from('mesa')
      .select('*')
      .eq('id_usuario_criador', user.id)

    // 2. Busca mesas onde eu sou JOGADOR (via tabela personagem)
    const { data: participacoes } = await supabase
      .from('personagem')
      .select(`
        mesa (
          id_mesa,
          nome_mesa,
          created_at,
          id_usuario_criador
        )
      `)
      .eq('id_usuario', user.id)

    if (mesasCriadas) setMestreMesas(mesasCriadas)
    
    if (participacoes) {
      // Mapeia para pegar apenas o objeto da mesa de dentro da relação
      const mesasComoJogador = participacoes.map((p: any) => p.mesa).filter(m => m !== null)
      setJogadorMesas(mesasComoJogador)
    }
  }

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)
      await fetchData()
      setLoading(false)
    }
    checkUserAndFetch()
  }, [router, view])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center font-cinzel text-amber-500 animate-pulse">
      Lendo os Oráculos...
    </div>
  )

  return (
    <div className="flex h-screen bg-stone-950 text-stone-300 font-serif relative overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none grayscale filter contrast-125">
        <Image src="/imagem_de_fundo_rpg.jpg" alt="" fill className="object-cover" />
      </div>

      {/* SIDEBAR */}
      <aside 
        className={`bg-stone-900 border-r-2 border-amber-900/30 flex flex-col items-center py-6 z-50 shadow-2xl transition-all duration-300
          ${isSidebarOpen ? 'w-64 px-6' : 'w-20 px-2'}`}
      >
        <div className={`mb-10 w-full text-center transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <h1 className="font-cinzel text-xl font-bold tracking-[0.2em] text-amber-500 uppercase italic">RPG TERMINAL</h1>
        </div>

        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="relative group mb-10">
          <div className={`rounded-full border-2 border-amber-900 shadow-xl overflow-hidden transition-all bg-stone-800 flex items-center justify-center
            ${isSidebarOpen ? 'w-24 h-24' : 'w-12 h-12'}`}
          >
            <span className="font-cinzel text-amber-500 text-xl">{user?.email?.charAt(0).toUpperCase()}</span>
          </div>
        </button>

        <nav className={`w-full space-y-4 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          <button 
            onClick={() => setActiveTab('santuario')}
            className={`w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest rounded transition border border-transparent
              ${activeTab === 'santuario' ? 'bg-amber-900/20 text-amber-400 border-amber-900/30' : 'text-amber-200/70 hover:text-amber-400'}`}
          >
              Minhas Crônicas
          </button>
          <button 
            onClick={() => setActiveTab('biblioteca')}
            className={`w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest rounded transition border border-transparent
              ${activeTab === 'biblioteca' ? 'bg-amber-900/20 text-amber-400 border-amber-900/30' : 'text-amber-200/70 hover:text-amber-400'}`}
          >
              Biblioteca Arcana
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest rounded transition border border-transparent
              ${activeTab === 'config' ? 'bg-amber-900/20 text-amber-400 border-amber-900/30' : 'text-amber-200/70 hover:text-amber-400'}`}
          >
              Configurações
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-auto text-stone-600 hover:text-red-500 transition-colors uppercase text-[10px] font-cinzel">
            {isSidebarOpen ? '[ Abandonar Reino ]' : '⏻'}
        </button>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        <header className="p-8 md:p-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="font-cinzel text-3xl font-bold text-amber-500 tracking-wider uppercase">
              {activeTab === 'santuario' ? (view === 'mestre' ? 'Santuário do Mestre' : 'Santuário do Jogador') : 
               activeTab === 'biblioteca' ? 'Biblioteca Arcana' : 'Configurações'}
            </h1>
            <p className="text-stone-500 italic text-sm mt-2">
              {activeTab === 'santuario' ? 'Seu destino está sendo escrito...' : 
               activeTab === 'biblioteca' ? 'Onde o conhecimento antigo é preservado.' : 'Ajustes do seu reino.'}
            </p>
          </div>

          {activeTab === 'santuario' && <TabSelector view={view} setView={setView} />}
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12 pt-0">
          {activeTab === 'santuario' ? (
            view === 'mestre' ? (
              /* Resolvendo o erro de props: Removemos 'campaigns' que não existe mais no MestreView */
              <MestreView onMesaCreated={fetchData} /> 
            ) : (
              <div className="space-y-6 animate-in fade-in duration-700">
                <h2 className="font-cinzel text-amber-600/50 text-xs tracking-[0.3em] uppercase border-b border-amber-900/10 pb-2">Mesas que você integra</h2>
                {jogadorMesas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jogadorMesas.map(mesa => (
                      <div key={mesa.id_mesa} className="p-6 bg-stone-900/40 border border-amber-900/20 rounded hover:border-amber-500 transition-all cursor-pointer group">
                        <h3 className="font-cinzel text-amber-100 group-hover:text-amber-500">{mesa.nome_mesa}</h3>
                        <p className="text-[10px] text-stone-500 mt-2 uppercase tracking-widest">Cargo: Aventureiro</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 italic opacity-30">Aguardando convocação para novas aventuras...</div>
                )}
              </div>
            )
          ) : activeTab === 'biblioteca' ? (
            <BibliotecaView /> 
          ) : (
            <div className="text-center py-20 font-cinzel uppercase text-stone-600">Área de Configurações</div>
          )}
        </main>
      </div>
    </div>
  )
}