'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

interface DocumentManagerProps {
  folderId: string;
  mesaId: string;
  onBack: () => void;
  folderName: string;
}

export function DocumentManager({ folderId, mesaId, onBack, folderName }: DocumentManagerProps) {
  const [docs, setDocs] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  // 1. Busca documentos vinculados a esta pasta
  const fetchDocs = async () => {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id_folder', folderId)
    
    if (error) {
      console.error("Erro ao buscar:", error.message)
      return
    }
    if (data) setDocs(data)
  }

  useEffect(() => {
    if (folderId) fetchDocs()
  }, [folderId])

  // 2. Lógica de Upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${mesaId}/${folderId}/${fileName}`

      // Sobe para o Storage
      const { error: storageError } = await supabase.storage
        .from('documentos')
        .upload(filePath, file)

      if (storageError) throw storageError

      // Pega a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('documentos')
        .getPublicUrl(filePath)

      // Salva no Banco de Dados
      const { error: dbError } = await supabase
        .from('documentos')
        .insert([{
          id_folder: folderId,
          titulo: file.name,
          url_arquivo: publicUrl,
          caminho_storage: filePath
        }])

      if (dbError) throw dbError
      
      fetchDocs()
    } catch (err: any) {
      alert("Falha na invocação: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  // 3. Lógica de Deleção (Banco + Storage)
  const handleDelete = async (docId: string, storagePath: string) => {
    if (!confirm("Tem certeza que deseja banir este item?")) return

    try {
      // Remove o arquivo físico
      await supabase.storage.from('documentos').remove([storagePath])
      
      // Remove o registro no banco
      const { error } = await supabase
        .from('documentos')
        .delete()
        .eq('id_documentos', docId)

      if (error) throw error

      setDocs(prev => prev.filter(d => d.id_documentos !== docId))
    } catch (err: any) {
      alert("Erro ao deletar: " + err.message)
    }
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between border-b border-amber-900/30 pb-4">
        <button onClick={onBack} className="text-amber-700 hover:text-amber-500 text-[10px] font-cinzel uppercase tracking-widest transition-colors">
          ← Voltar para Pastas
        </button>
        <h3 className="font-cinzel text-amber-500 text-lg uppercase tracking-widest">{folderName}</h3>
      </div>

      {/* ÁREA DE UPLOAD */}
      <div className="relative group">
        <input 
          type="file" 
          onChange={handleUpload} 
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="border-2 border-dashed border-stone-800 p-8 rounded-xl text-center group-hover:border-amber-900/50 transition-all bg-stone-900/20">
          <p className="font-serif italic text-stone-500 group-hover:text-amber-700 transition-colors">
            {uploading ? "Invocando arquivo no plano astral..." : "Arraste um item ou clique para imortalizar um documento"}
          </p>
        </div>
      </div>

      {/* LISTA DE DOCUMENTOS COM PREVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {docs.map((doc) => (
          <div key={doc.id_documentos} className="group relative bg-stone-950 border border-amber-900/10 rounded-lg overflow-hidden hover:border-amber-600 transition-all shadow-2xl">
            
            {/* Botão de Excluir (Corrigido) */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleDelete(doc.id_documentos, doc.caminho_storage);
              }}
              className="absolute top-2 right-2 bg-red-950/80 text-red-500 border border-red-900/50 w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white z-20"
            >
              ×
            </button>

            <div className="block">
              <div className="aspect-square bg-stone-900 flex items-center justify-center overflow-hidden">
                <img 
                  src={doc.url_arquivo} 
                  alt={doc.titulo}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-3 bg-stone-950/90 border-t border-amber-900/20 text-center">
                <p className="text-[9px] text-amber-600 font-cinzel truncate uppercase tracking-tighter">
                  {doc.titulo}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {docs.length === 0 && !uploading && (
        <div className="py-20 text-center text-stone-800 font-cinzel text-xs uppercase tracking-widest border border-stone-900/50 rounded-lg">
          Este tomo está vazio.
        </div>
      )}
    </div>
  )
}