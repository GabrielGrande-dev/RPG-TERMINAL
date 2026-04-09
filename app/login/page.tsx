'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  // Estado para controlar a notificação personalizada
  const [notification, setNotification] = useState<{msg: string, type: 'error' | 'success'} | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setNotification(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard',
      }
    })

    if (error) {
      // Em vez de alert(), definimos a mensagem na nossa caixa temática
      setNotification({ msg: `Erro: ${error.message}`, type: 'error' })
    } else {
      setNotification({ msg: 'Verifique seu e-mail para o link de acesso!', type: 'success' })
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- CAIXA DE NOTIFICAÇÃO PERSONALIZADA --- */}
      {notification && (
        <div className="fixed top-10 z-50 w-full max-w-sm animate-in fade-in slide-in-from-top-5 duration-300">
          <div className={`relative p-4 border-2 shadow-2xl rounded bg-stone-900 ${
            notification.type === 'error' ? 'border-red-900 text-red-200' : 'border-amber-700 text-amber-200'
          }`}>
            <p className="font-serif italic text-sm text-center">
              {notification.msg}
            </p>
            <button 
              onClick={() => setNotification(null)}
              className="absolute -top-2 -right-2 bg-stone-950 border border-current rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:scale-110 transition-transform"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* --- BACKGROUND (Sua imagem atual) --- */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/imagem_de_fundo_rpg.jpg" // Nome conforme seu arquivo no public
          alt="Fundo Medieval"
          fill 
          className="object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/80 to-stone-950" />
      </div>

      {/* --- CARD DE LOGIN --- */}
      <div className="relative z-20 w-full max-w-md border-2 border-amber-900/30 p-10 bg-stone-900/90 shadow-2xl rounded-lg">
        <div className="text-center mb-8">
          <h2 className="font-cinzel text-3xl font-bold text-amber-500 tracking-widest uppercase mb-2">
            Identifique-se
          </h2>
          <p className="font-serif italic text-stone-500 text-sm">
            "Apenas aqueles registrados nos canais podem prosseguir."
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-cinzel text-[10px] text-amber-700 tracking-[0.2em] uppercase mb-2">
              DIGITE SEU E-MAIL ABAIXO!
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-black border border-amber-900/50 p-3 text-stone-300 focus:outline-none focus:border-amber-500 transition-colors font-mono text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-900/20 border border-amber-600/50 py-3 font-cinzel text-amber-500 hover:bg-amber-600 hover:text-stone-950 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'Convocando...' : '[ REGISTRA / ACESSAR ]'}
          </button>
        </form>
      </div>
    </main>
  )
}