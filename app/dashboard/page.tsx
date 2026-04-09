'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { TabSelector } from './TabSelector'
import { MestreView } from './MestreView'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'mestre' | 'jogador'>('mestre') 
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
  // ESTADO PARA CONTROLAR A SIDEBAR
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      if (view === 'mestre') {
        const { data } = await supabase
          .from('campaigns')
          .select('*')
          .eq('master_id', user.id)
          .order('created_at', { ascending: false })
        if (data) setCampaigns(data)
      }
      setLoading(false)
    }
    checkUserAndFetch()
  }, [router, view])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center font-cinzel text-amber-500 animate-pulse">Carregando...</div>

  return (
    <div className="flex h-screen bg-stone-950 text-stone-300 font-serif relative overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none grayscale contrast-125">
        <Image src="/imagem_de_fundo_rpg.jpg" alt="" fill className="object-cover" />
      </div>

      {/* SIDEBAR DINÂMICA */}
      <aside 
        className={`bg-stone-900 border-r-2 border-amber-900/30 flex flex-col items-center py-6 z-50 shadow-2xl transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64 px-6' : 'w-20 px-2'}`}
      >
        {/* TÍTULO / LOGO (Só aparece se aberto) */}
        <div className={`mb-10 w-full text-center transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <h1 className="font-cinzel text-xl font-bold tracking-[0.2em] text-amber-500 uppercase italic">Chronicles</h1>
        </div>

        {/* ÍCONE DE PERFIL (O Gatilho) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="relative group focus:outline-none"
        >
          <div className={`rounded-full border-2 border-amber-900 shadow-xl overflow-hidden transition-all duration-300 bg-stone-800 flex items-center justify-center
            ${isSidebarOpen ? 'w-24 h-24 mb-4' : 'w-12 h-12 hover:border-amber-500'}`}
          >
            <span className="font-cinzel text-amber-500 text-xl">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Badge DM/PL minimalista */}
          {!isSidebarOpen && (
            <div className="absolute -bottom-1 -right-1 bg-amber-900 text-[8px] px-1 rounded-full text-amber-200 border border-stone-900">
              {view === 'mestre' ? 'DM' : 'PL'}
            </div>
          )}
        </button>

        {/* INFORMAÇÕES DO USUÁRIO (Só se aberto) */}
        <div className={`mt-4 text-center transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <p className="font-cinzel text-md font-bold text-stone-100 uppercase truncate w-48">
            {user?.email?.split('@')[0]}
          </p>
          <p className="text-[9px] font-mono text-amber-900/60 uppercase tracking-widest">
            ID: {user?.id.slice(0, 8)}
          </p>
        </div>

        {/* LINKS DO MENU (Só se aberto) */}
        <nav className={`mt-10 w-full space-y-2 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <button className="w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest text-amber-200/70 hover:bg-amber-900/20 hover:text-amber-400 rounded transition">
             Configurações
          </button>
          <button className="w-full text-left p-3 font-cinzel text-[10px] uppercase tracking-widest text-amber-200/70 hover:bg-amber-900/20 hover:text-amber-400 rounded transition">
             Compêndio
          </button>
        </nav>

        {/* BOTÃO LOGOUT (Só se aberto) */}
        <div className="mt-auto w-full">
           <button 
            onClick={isSidebarOpen ? handleLogout : () => setIsSidebarOpen(true)}
            className={`w-full font-cinzel text-[10px] transition-all duration-300 uppercase
              ${isSidebarOpen ? 'border border-red-900/50 p-3 text-red-500 hover:bg-red-950/30' : 'text-stone-600 hover:text-red-500 text-lg'}`}
          >
            {isSidebarOpen ? '[ Abandonar Reino ]' : '⏻'}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="p-8 md:p-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="font-cinzel text-3xl font-bold text-amber-500 tracking-wider uppercase">
              {view === 'mestre' ? 'Santuário do Mestre' : 'Santuário do Jogador'}
            </h1>
          </div>
          <TabSelector view={view} setView={setView} />
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12 pt-0">
          {view === 'mestre' ? <MestreView campaigns={campaigns} refreshData={fetchData} /> : <div className="text-center opacity-40 py-20 italic">Aguardando convocação...</div>}
        </main>
      </div>
    </div>
  )
}