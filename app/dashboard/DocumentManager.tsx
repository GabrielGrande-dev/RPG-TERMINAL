'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

interface DocumentManagerProps {
  folderId: string;
  mesaId: string;
  folderName: string;
  isMestre: boolean;
  onBack: () => void;
}

export function DocumentManager({ folderId, mesaId, folderName, isMestre, onBack }: DocumentManagerProps) {
  const [docs, setDocs] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  const fetchDocs = async () => {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id_folder', folderId)
    
    if (error) {
      console.error("Erro ao buscar documentos:", error.message)
      return
    }
    if (data) setDocs(data)
  }

  useEffect(() => { 
    if (folderId) fetchDocs() 
  }, [folderId])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isMestre) return 
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileName = `${mesaId}/${folderId}/${Math.random()}-${file.name}`
      const { error: storageError } = await supabase.storage
        .from('documentos')
        .upload(fileName, file)

      if (storageError) throw storageError

      const { data: { publicUrl } } = supabase.storage
        .from('documentos')
        .getPublicUrl(fileName)

      await supabase.from('documentos').insert([{
        id_folder: folderId,
        id_mesa: mesaId,
        nome: file.name,
        url: publicUrl,
        caminho_storage: fileName
      }])

      fetchDocs()
    } catch (err: any) {
      alert("Erro: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between border-b border-amber-900/30 pb-4">
        <button onClick={onBack} className="text-amber-700 hover:text-amber-500 text-[10px] font-cinzel uppercase tracking-widest transition-colors">
          ← Voltar para Pastas
        </button>
        <h3 className="font-cinzel text-amber-500 text-lg uppercase tracking-widest">{folderName}</h3>
      </div>

      {/* ÁREA DE UPLOAD: Só aparece se for Mestre */}
      {isMestre && (
        <div className="relative group">
          <input type="file" onChange={handleUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="border-2 border-dashed border-stone-800 p-8 rounded-xl text-center group-hover:border-amber-900/50 transition-all bg-stone-900/20">
            <p className="font-serif italic text-stone-500 text-sm">
              {uploading ? "Conectando ao plano astral..." : "Clique para imortalizar um novo registro"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="group bg-stone-900 border border-amber-900/10 rounded-lg overflow-hidden hover:border-amber-600/40 transition-all">
            <div className="aspect-square bg-black flex items-center justify-center">
               <img src={doc.url} alt={doc.nome} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-3">
              <p className="text-[9px] text-amber-100 truncate font-mono uppercase">{doc.nome}</p>
              <a href={doc.url} target="_blank" rel="noreferrer" className="text-[8px] text-amber-700 hover:text-amber-400 mt-2 block uppercase tracking-widest">Visualizar</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}