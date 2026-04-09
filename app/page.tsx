import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
      
      {/* 1. CAMADA DE IMAGEM DE FUNDO (A NOVIDADE) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/imagem_de_fundo_rpg.jpg" // <-- Mude aqui para o nome do seu arquivo na pasta public/
          alt="Fundo Medieval Clássico"
          fill // Estica a imagem para preencher o container pai
          quality={70} // Otimiza a qualidade (menos é mais rápido)
          className="object-cover opacity-75 filter grayscale" // Cobre a tela, deixa transparente e em tons de cinza para sutilizar
          priority // Carrega esta imagem primeiro
        />
        {/* Camada de sobreposição preta para garantir que o fundo fique escuro e o texto legível */}
        <div className="absolute inset-0 bg-black/70 z-10" />
      </div>

      {/* 2. CONTAINER PRINCIPAL (Ajustado para o Z-Index) */}
      {/* Adicionei 'relative' e 'z-20' para garantir que ele fique POR CIMA do fundo */}
      <div className="max-w-4xl border-4 border-double border-amber-900/50 p-12 bg-stone-950/90 rounded-lg shadow-[0_0_60px_rgba(120,53,15,0.3)] relative z-20">
        
        {/* Título com a fonte Cinzel e cor dourada */}
        <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-6 tracking-tight text-amber-300 uppercase italic">
          RPG TERMINAL
        </h1>
        
        {/* Subtítulo temático */}
        <p className="text-xl md:text-2xl mb-12 text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto">
          "O Tomo Digital onde lendas são escritas." <br />
          Organize suas campanhas, gerencie seus heróis e guarde seus segredos em um ambiente digno dos maiores mestres.
        </p>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* Botão de ação estilo 'Selo Real' */}
          <Link href="/login" className="font-cinzel font-bold text-xl px-10 py-5 bg-amber-900 text-amber-100 rounded border-2 border-amber-700 hover:bg-amber-800 transition-all shadow-lg transform hover:scale-105">
            [ABRIR TERMINAL] 
          </Link>
          
          <button className="font-cinzel font-medium text-lg px-8 py-4 text-stone-600 cursor-not-allowed opacity-50">
            EXPLORAR RECURSOS (EM BREVE)
          </button>
        </div>

        {/* Rodapé temático */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs uppercase tracking-[0.2em] text-amber-900/60 font-mono">
          <div>// SELO DE SEGURANÇA SUPABASE</div>
          <div>// ARQUITETURA NEXT.JS 15</div>
          <div>// POSTGRES DATABASE SERVIÇOS</div>
        </div>
      </div>
    </main>
  )
}