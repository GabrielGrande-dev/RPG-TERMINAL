'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [campanhas, setCampanhas] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }
    checkUser()
  }, [router])

  // Lógica de criação de campanha (mantenha a mesma!)
  const criarCampanha = async () => {
    const nome = prompt("Digite o nome da sua nova crônica:")
    if (!nome) return

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{ name: nome, master_id: user.id }])
      .select()

    if (error) alert("Erro ao registrar crônica: " + error.message)
    else alert("A crônica '" + nome + "' foi iniciada nos registros!")
  }

  // Tela de carregamento temática
  if (!user) return <div className="min-h-screen bg-stone-950 text-amber-300 font-cinzel p-8 text-center text-3xl animate-pulse flex items-center justify-center">CONSULTANDO OS ARQUIVOS REAIS...</div>

  return (
    <main className="min-h-screen bg-stone-950 text-stone-300 p-8 font-serif">
      {/* Cabeçalho estilo 'Faixa Real' */}
      <div className="flex justify-between items-center mb-12 border-b-2 border-amber-900/50 pb-6 shadow-sm">
        <h1 className="font-cinzel text-3xl font-bold tracking-tight text-amber-300 uppercase">
          {'>'} BEM-VINDO, MESTRE {user.email?.split('@')[0].toUpperCase()}
        </h1>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} 
          className="font-cinzel text-sm border-2 border-red-900 px-4 py-2 text-red-300 rounded hover:bg-red-950 transition shadow-md"
        >
          [ FECHAR O TOMO ]
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card do Mestre estilo 'Pergaminho de Perguntas' */}
        <div className="border-2 border-amber-900/70 p-8 bg-stone-900 rounded-lg shadow-[0_0_20px_rgba(120,53,15,0.1)] transform hover:border-amber-700 transition-all">
          <h3 className="font-cinzel text-2xl mb-6 underline text-amber-100">CÂMARA DO MESTRE</h3>
          <button 
            onClick={criarCampanha}
            className="w-full font-cinzel font-bold text-lg border-2 border-amber-600 p-4 rounded bg-stone-950 text-amber-100 hover:bg-amber-900 transition-all mb-5 shadow-inner"
          >
            + INICIAR NOVA CRÔNICA
          </button>
          <p className="text-sm text-stone-500 uppercase tracking-widest leading-relaxed">
            Acesso irrestrito aos registros, mapas, NPCs e tomos dos aventureiros.
          </p>
        </div>

        {/* Card do Jogador estilo 'Área de Espera' (Desabilitado) */}
        <div className="border-2 border-stone-800 p-8 bg-stone-900 rounded-lg opacity-60">
          <h3 className="font-cinzel text-2xl mb-6 underline text-stone-500">SALÃO DOS AVENTUREIROS</h3>
          <button className="w-full font-cinzel font-medium text-lg border-2 border-stone-700 p-4 rounded text-stone-700 cursor-not-allowed mb-5">
            ENTRAR EM AVENTURA (EM BREVE)
          </button>
          <p className="text-sm text-stone-600 uppercase tracking-widest leading-relaxed">
            Aguardando o chamado de um mestre autorizado para iniciar a jornada.
          </p>
        </div>
      </div>
    </main>
  )
}