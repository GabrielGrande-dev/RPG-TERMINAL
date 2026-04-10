//
'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isRegistering, setIsRegistering] = useState(false) // Alterna entre Login e Cadastro
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isRegistering) {
      // --- FLUXO DE CADASTRO ---
      // O 'full_name' vai para o raw_user_meta_data e aciona o seu Trigger SQL
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            full_name: nome,
          },
        },
      })

      if (error) {
        alert("Erro ao forjar conta: " + error.message)
      } else {
        alert("Sua alma foi registrada no livro dos tempos! Agora, realize o login.")
        setIsRegistering(false) // Muda para a tela de login após sucesso
      }
    } else {
      // --- FLUXO DE LOGIN ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) {
        alert("Acesso negado: " + error.message)
      } else {
        // Se o login der certo, manda para a Dashboard
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-amber-500 font-cinzel tracking-widest uppercase relative">
      {/* Container Principal */}
      <div className="w-full max-w-md bg-stone-900/90 border-2 border-amber-900/30 p-10 rounded-lg shadow-2xl relative z-10">
        <h2 className="text-2xl text-center mb-8 border-b border-amber-900/20 pb-4">
          {isRegistering ? 'Registro de Alma' : 'Portal de Acesso'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-[10px] text-amber-700 mb-2">Como deseja ser chamado?</label>
              <input
                type="text"
                placeholder="Ex: Gabriel, o Mestre"
                className="w-full bg-black border border-amber-900/50 p-4 text-amber-100 focus:border-amber-500 outline-none transition-all font-mono normal-case"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] text-amber-700 mb-2">Seu canal de e-mail</label>
            <input
              type="email"
              placeholder="seu@reino.com"
              className="w-full bg-black border border-amber-900/50 p-4 text-amber-100 focus:border-amber-500 outline-none transition-all font-mono normal-case"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] text-amber-700 mb-2">Senha Sagrada</label>
            <input
              type="password"
              placeholder="********"
              className="w-full bg-black border border-amber-900/50 p-4 text-amber-100 focus:border-amber-500 outline-none transition-all font-mono"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-900/20 border border-amber-600/50 py-4 hover:bg-amber-600 hover:text-stone-950 transition-all font-bold disabled:opacity-50"
          >
            {loading ? 'Processando...' : isRegistering ? '[ REGISTRAR ]' : '[ ENTRAR ]'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] text-stone-500 hover:text-amber-500 transition-colors underline underline-offset-4"
          >
            {isRegistering ? "Já possuo registro nas crônicas" : "Não possuo registro (Criar Conta)"}
          </button>
        </div>
      </div>

      {/* Marca d'água de fundo opcional */}
      <div className="absolute bottom-4 text-[10px] text-stone-800 pointer-events-none">
        RPG TERMINAL - SISTEMA DE IDENTIDADE V1.0
      </div>
    </main>
  )
}