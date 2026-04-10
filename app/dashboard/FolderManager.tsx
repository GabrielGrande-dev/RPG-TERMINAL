'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DocumentManager } from './DocumentManager'

interface FolderManagerProps {
  mesaId: string;
  isMestre?: boolean;
}

export function FolderManager({ mesaId, isMestre = false }: FolderManagerProps) {
  const [folders, setFolders] = useState<any[]>([])
  const [selectedFolder, setSelectedFolder] = useState<{id: string, nome: string} | null>(null)

  const fetchFolders = async () => {
    let query = supabase.from('pastas').select('*').eq('id_mesa', mesaId)
    
    // Filtro de visibilidade para jogadores
    if (!isMestre) {
      query = query.eq('visibilidade', true)
    }

    const { data, error } = await query.order('created_at', { ascending: true })
    
    if (error) {
      console.error("Erro ao carregar pastas:", error.message)
      return
    }
    if (data) setFolders(data)
  }

  useEffect(() => { 
    if (mesaId) fetchFolders() 
  }, [mesaId, isMestre])

  if (selectedFolder) {
    return (
      <DocumentManager 
        folderId={selectedFolder.id} 
        folderName={selectedFolder.nome}
        mesaId={mesaId}
        isMestre={isMestre} 
        onBack={() => setSelectedFolder(null)} 
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {folders.map(folder => (
        <button 
          key={folder.id}
          onClick={() => setSelectedFolder({ id: folder.id, nome: folder.nome })}
          className="group flex flex-col items-center p-6 bg-stone-900/40 border border-amber-900/10 rounded-2xl hover:border-amber-600/40 transition-all hover:bg-stone-900/60 shadow-lg relative"
        >
          <span className="text-4xl mb-3 opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all">📁</span>
          <span className="font-cinzel text-[10px] text-amber-500 uppercase tracking-widest text-center">
            {folder.nome}
          </span>
          {isMestre && !folder.visibilidade && (
            <span className="absolute top-2 right-2 text-[7px] text-red-500/50 font-mono">OCULTO</span>
          )}
        </button>
      ))}
    </div>
  )
}