'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { TabSelector } from './TabSelector'
import { MestreView } from './MestreView'

export default function DashboardPage() {
  // 1. ESTADOS
  const [activeTab, setActiveTab] = useState<'santuario' | 'conjunto' | 'config'>('santuario')
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'mestre' | 'jogador'>('mestre') 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  // 2. BUSCA DE DADOS (REFRESH)
  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user && view === 'mestre') {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('master_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setCampaigns(data)
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
      Invocando Pergaminhos...
    </div>
  )

  return (
    <div className="flex h-screen bg-stone-950 text-stone-300 font-serif relative overflow-hidden">
      
      {/* BACKGROUND IMERSIVO */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none grayscale filter contrast-125">
        <Image src="/imagem_de_fundo_rpg.jpg" alt="" fill className="object-cover" />
      </div>

      {/* SIDEBAR RETRÁTIL */}
      <aside 
        className={`bg-stone-900 border-r-2 border-amber-900/30 flex flex-col items-center py-6 z-50 shadow-2xl transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64 px-6' : 'w-20 px-2'}`}
      >
        <div className={`mb-10 w-full text-center transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <h1 className="font-cinzel text-xl font-bold tracking-[0.2em] text-amber-500 uppercase italic">RPG TERMINAL</h1>
        </div>

        {/* ÍCONE DE PERFIL / GATILHO */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="relative group focus:outline-none mb-10">
          <div className={`rounded-full border-2 border-amber-900 shadow-xl overflow-hidden transition-all duration-300 bg-stone-800 flex items-center justify-center
            ${isSidebarOpen ? 'w-24 h-24 mb-4' : 'w-12 h-12 hover:border-amber-500'}`}
          >
            <span className="font-cinzel text-amber-500 text-xl">{user?.email?.charAt(0).toUpperCase()}</span>
          </div>
          {!isSidebarOpen && (
            <div className="absolute -bottom-1 -right-1 bg-amber-900 text-[8px] px-1 rounded-full text-amber-200 border border-stone-900">
              {view === 'mestre' ? 'DM' : 'PL'}
            </div>
          )}
        </button>

        {/* MENU DE NAVEGAÇÃO POR ABAS */}
        <nav className={`w-full space-y-4 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          <button 
            onClick={() => setActiveTab('santuario')}
            className={`w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest rounded transition border border-transparent
              ${activeTab === 'santuario' ? 'bg-amber-900/20 text-amber-400 border-amber-900/30' : 'text-amber-200/70 hover:text-amber-400'}`}
          >
             Minhas Crônicas
          </button>
          <button 
            onClick={() => setActiveTab('conjunto')}
            className={`w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest rounded transition border border-transparent
              ${activeTab === 'conjunto' ? 'bg-amber-900/20 text-amber-400 border-amber-900/30' : 'text-amber-200/70 hover:text-amber-400'}`}
          >
             conjunto de Regras
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest rounded transition border border-transparent
              ${activeTab === 'config' ? 'bg-amber-900/20 text-amber-400 border-amber-900/30' : 'text-amber-200/70 hover:text-amber-400'}`}
          >
             Configurações
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className={`mt-auto w-full font-cinzel text-[10px] transition-all duration-300 uppercase
            ${isSidebarOpen ? 'border border-red-900/50 p-3 text-red-500 hover:bg-red-950/30' : 'text-stone-600 hover:text-red-500 text-lg'}`}
        >
          {isSidebarOpen ? 'ABANDONAR REINO' : '⏻'}
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL DINÂMICO */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* HEADER ÚNICO */}
        <header className="p-8 md:p-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="font-cinzel text-3xl font-bold text-amber-500 tracking-wider uppercase">
              {activeTab === 'santuario' ? (view === 'mestre' ? 'Santuário do Mestre' : 'Santuário do Jogador') : 
               activeTab === 'conjunto' ? 'Grande Compêndio' : 'Configurações'}
            </h1>
            <p className="text-stone-500 italic text-sm mt-2">
              {activeTab === 'santuario' ? 'Seu destino está sendo escrito...' : 'O conhecimento é sua melhor arma.'}
            </p>
          </div>

          {/* Só mostra o seletor de Mestre/Jogador se estiver na aba do Santuário */}
          {activeTab === 'santuario' && <TabSelector view={view} setView={setView} />}
        </header>

        {/* ÁREA DE RENDERIZAÇÃO DAS ABAS */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 pt-0">
          {activeTab === 'santuario' ? (
            view === 'mestre' ? (
              <MestreView campaigns={campaigns} refreshData={fetchData} />
            ) : (
              <div className="text-center opacity-40 py-20 italic">Aguardando convocação de um mestre...</div>
            )
          ) : activeTab === 'conjunto' ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-amber-900/20 rounded-xl bg-stone-900/10">
               <h2 className="font-cinzel text-2xl text-amber-600 uppercase tracking-widest mb-2">Conjunto de Regras</h2>
               <p className="text-stone-500 font-serif italic">Pronto para buscar as leis de D&D ou Tormenta 20?</p>
            </div>
          ) : (
            <div className="p-10 text-stone-400 font-cinzel uppercase tracking-widest text-center">Configurações do Reino</div>
          )}
        </main>
      </div>
    </div>
  )
}