'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function BibliotecaView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // NOVOS ESTADOS PARA O FORMULÁRIO DE UPLOAD
  const [tempFile, setTempFile] = useState<File | null>(null)
  const [customName, setCustomName] = useState('')

  const fetchBiblioteca = async () => {
    let query = supabase.from('biblioteca').select('*')
    if (searchTerm) query = query.ilike('titulo', `%${searchTerm}%`)
    const { data } = await query.order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  useEffect(() => {
    fetchBiblioteca()
  }, [searchTerm])

  // 1. CAPTURA O ARQUIVO MAS NÃO SOBE AINDA
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setTempFile(file)
      // Sugere o nome original (sem a extensão) para facilitar
      setCustomName(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  // 2. EFETIVA O UPLOAD COM O NOVO NOME
  async function handleFinalUpload() {
    if (!tempFile || !customName.trim()) return

    setLoading(true)
    try {
      const fileExt = tempFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}` // Nome único no Storage
      
      const { error: uploadError } = await supabase.storage.from('biblioteca').upload(fileName, tempFile)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('biblioteca').getPublicUrl(fileName)
      
      const { error: dbError } = await supabase.from('biblioteca').insert([{
        titulo: customName.trim(), // USANDO O NOME QUE VOCÊ DIGITOU
        url_arquivo: publicUrl,
        tipo_arquivo: 'pdf',
        caminho_storage: fileName,
        criado_por: (await supabase.auth.getUser()).data.user?.id
      }])

      if (dbError) throw dbError
      
      // Limpa tudo e atualiza
      setTempFile(null)
      setCustomName('')
      fetchBiblioteca()
      alert('Manuscrito batizado e guardado!')
    } catch (error: any) {
      alert('Erro no ritual: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, filePath: string) {
    if (!confirm("Banir este manuscrito?")) return
    setLoading(true)
    try {
      await supabase.storage.from('biblioteca').remove([filePath])
      await supabase.from('biblioteca').delete().eq('id', id)
      fetchBiblioteca()
    } catch (error: any) {
      alert('Erro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER DE INVOCAÇÃO EVOLUÍDO */}
      <div className="border-2 border-dashed border-amber-900/20 bg-stone-900/30 p-8 rounded-xl flex flex-col items-center justify-center space-y-4 shadow-inner transition-all">
        {!tempFile ? (
          <>
            <p className="font-cinzel text-[10px] text-amber-700 uppercase tracking-[0.3em]">Adicionar Novo Manuscrito</p>
            <label className="cursor-pointer bg-amber-900/40 hover:bg-amber-700 text-amber-100 px-8 py-3 rounded font-cinzel text-xs uppercase tracking-widest transition-all shadow-lg border border-amber-900/50">
              [ Selecionar PDF ]
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
            </label>
          </>
        ) : (
          <div className="w-full max-w-md space-y-4 animate-in zoom-in-95 duration-300">
            <p className="font-cinzel text-[10px] text-amber-500 text-center uppercase tracking-widest">Como este tomo será chamado?</p>
            <input 
              type="text" 
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-stone-950 border border-amber-900/40 p-3 rounded text-amber-100 font-serif italic focus:border-amber-500 outline-none"
              placeholder="Ex: Guia de Hacking Cyberpunk"
            />
            <div className="flex gap-2">
              <button 
                onClick={handleFinalUpload} 
                disabled={loading}
                className="flex-1 bg-amber-900/60 hover:bg-amber-700 text-amber-100 py-2 rounded font-cinzel text-[10px] uppercase tracking-widest transition-all"
              >
                {loading ? 'Selando...' : 'Confirmar Registro'}
              </button>
              <button 
                onClick={() => setTempFile(null)} 
                className="px-4 py-2 border border-stone-700 text-stone-500 hover:text-red-500 rounded font-cinzel text-[10px] uppercase transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BUSCA */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Pesquisar nos registros antigos..." 
          className="w-full bg-stone-900/50 border border-amber-900/20 p-4 pl-12 rounded-lg text-amber-100 font-serif italic text-sm focus:outline-none focus:border-amber-600 transition-all shadow-inner"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-4 top-4 opacity-30">🔍</span>
      </div>

      {/* GRID DE TOMOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {items.map(item => (
          <div key={item.id} className="bg-stone-900 border border-amber-900/20 p-5 rounded-lg border-l-4 border-l-amber-700 group relative hover:bg-stone-800 transition-all shadow-xl">
            <button 
              onClick={() => handleDelete(item.id, item.caminho_storage)}
              className="absolute top-2 right-2 text-stone-700 hover:text-red-600 transition-colors p-2 z-20"
            >✕</button>
            <div className="flex justify-between items-start mb-6 pr-4">
               <div>
                 <h3 className="font-cinzel text-amber-500 uppercase text-xs tracking-widest leading-relaxed">{item.titulo}</h3>
                 <p className="text-[9px] text-stone-600 font-mono mt-1 uppercase">Ref: {item.id.slice(0,8)}</p>
               </div>
               <span className="text-xl opacity-40 group-hover:opacity-100 transition-opacity">📜</span>
            </div>
            <a href={item.url_arquivo} target="_blank" className="block text-center border border-amber-900/30 py-2.5 rounded font-cinzel text-[10px] uppercase text-stone-400 hover:text-amber-400 hover:border-amber-600 transition-all bg-stone-950/50 shadow-inner">
              Consultar Registro
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}