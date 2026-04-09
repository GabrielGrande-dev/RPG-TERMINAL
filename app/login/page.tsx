'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard',
      }
    })

    if (error) alert('Erro: ' + error.message)
    else alert('Uma mensagem de corvo (e-mail) foi enviada com seu selo de acesso!')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Imagem de Fundo Consistente com a Landing Page */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/imagem_de_fundo_rpg.jpg" 
          alt="Fundo Medieval"
          fill 
          className="object-cover opacity-75 filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/80 to-stone-950 z-10" />
      </div>

      {/* Card de Login Estilo Pergaminho/Tomo */}
      <div className="relative z-20 w-full max-w-md border-2 border-amber-900/50 p-10 bg-stone-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg">
        
        <div className="text-center mb-8">
          <h2 className="font-cinzel text-3xl font-bold text-amber-300 tracking-widest uppercase mb-2">
            Identifique-se
          </h2>
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-900 to-transparent" />
          <p className="font-serif text-stone-500 mt-4 italic">
            "Apenas aqueles registrados nos canais podem prosseguir."
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-cinzel text-xs text-amber-900 uppercase tracking-[0.2em] mb-2">
              Endereço de Correio (E-mail)
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-stone-950 border border-amber-900/30 p-4 text-stone-200 font-serif focus:outline-none focus:border-amber-500 transition-colors rounded shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-cinzel font-bold text-lg bg-amber-900 text-amber-100 p-4 rounded border border-amber-700 hover:bg-amber-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CONVOCANDO...' : '[ RECLAMAR ACESSO ]'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-amber-900/40 uppercase tracking-widest">
            // Criptografia de Selo Real Ativa
          </p>
        </div>
      </div>
    </main>
  )
}