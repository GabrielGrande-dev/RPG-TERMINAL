'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        // Busca as campanhas do banco de dados
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('master_id', user.id) // Filtra para mostrar só as SUAS campanhas
          .order('created_at', { ascending: false })

        if (data) setCampaigns(data)
        setLoading(false)
      }
    }

    checkUserAndFetchData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center font-cinzel text-amber-500 animate-pulse">
      Consultando os Anais...
    </div>
  )

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200 p-8 font-serif relative">
      
      {/* Header com Nome do Mestre */}
      <header className="relative z-10 flex justify-between items-center border-b border-amber-900/50 pb-6 mb-10">
        <div>
          <h1 className="font-cinzel text-2xl text-amber-500 tracking-widest uppercase">
            Santuário do Mestre
          </h1>
          <p className="text-stone-500 italic">Bem-vindo, {user?.email?.split('@')[0]}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 border border-red-900/50 text-red-500 hover:bg-red-950 transition-colors font-cinzel text-xs"
        >
          [ ABANDONAR REINO ]
        </button>
      </header>

      {/* Grid de Campanhas */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card para Criar Nova Campanha */}
        <button className="group border-2 border-dashed border-stone-800 p-8 rounded-lg hover:border-amber-900/50 transition-all flex flex-col items-center justify-center space-y-4">
          <span className="text-4xl text-stone-700 group-hover:text-amber-700 transition-colors">+</span>
          <span className="font-cinzel text-stone-600 group-hover:text-amber-600 uppercase tracking-tighter">Iniciar Nova Crônica</span>
        </button>

        {/* Listagem das Campanhas Existentes */}
        {campaigns.map((camp) => (
          <div 
            key={camp.id} 
            className="bg-stone-900 border border-amber-900/30 p-6 rounded-lg shadow-lg hover:shadow-amber-900/10 transition-all cursor-pointer group"
          >
            <h3 className="font-cinzel text-xl text-amber-200 group-hover:text-amber-400 transition-colors mb-2">
              {camp.name}
            </h3>
            <p className="text-sm text-stone-500 line-clamp-2">
              {camp.description || "Uma história que aguarda para ser escrita..."}
            </p>
            <div className="mt-4 pt-4 border-t border-stone-800 flex justify-between items-center text-[10px] font-mono text-stone-600 uppercase">
              <span>Criada em: {new Date(camp.created_at).toLocaleDateString()}</span>
              <span className="text-amber-900 tracking-widest">Ativa</span>
            </div>
          </div>
        ))}
      </section>

      {/* Background Sutil */}
      <div className="fixed inset-0 pointer-events-none opacity-60 grayscale filter mix-blend-overlay">
        <Image src="/imagem_de_fundo_rpg.jpg" alt="" fill className="object-cover" />
      </div>

    </main>
  )
}