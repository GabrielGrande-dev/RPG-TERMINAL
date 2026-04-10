'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DocumentManager } from './DocumentManager' // Certifique-se de que o nome do arquivo bate

interface FolderManagerProps {
  mesaId: string;
}

export function FolderManager({ mesaId }: FolderManagerProps) {
  const [folders, setFolders] = useState<any[]>([])
  const [newFolderName, setNewFolderName] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Estado para controlar qual pasta o mestre "abriu"
  const [folderSelecionada, setFolderSelecionada] = useState<any>(null)

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id_mesa', mesaId)
      .order('nome_folder', { ascending: true })

    if (data) setFolders(data)
  }

  useEffect(() => {
    fetchFolders()
  }, [mesaId])

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('folders')
      .insert([{ 
        nome_folder: newFolderName, 
        id_mesa: mesaId,
        visibilidade: false // Começa oculto por padrão
      }])

    if (!error) {
      setNewFolderName('')
      fetchFolders()
    }
    setLoading(false)
  }

  const toggleVisibility = async (e: React.MouseEvent, folderId: string, currentStatus: boolean) => {
    e.stopPropagation() // Impede que o clique no botão abra a pasta
    await supabase
      .from('folders')
      .update({ visibilidade: !currentStatus })
      .eq('id_folders', folderId)
    
    fetchFolders()
  }

  // LOGICA DE NAVEGAÇÃO: Se houver uma pasta selecionada, renderiza os documentos dela
  if (folderSelecionada) {
    return (
      <DocumentManager 
        folderId={folderSelecionada.id_folders} 
        mesaId={mesaId}
        folderName={folderSelecionada.nome_folder}
        onBack={() => setFolderSelecionada(null)} 
      />
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-amber-900/10 pb-2">
        <h3 className="font-cinzel text-amber-700 text-sm uppercase tracking-widest">Grimórios da Campanha</h3>
        <form onSubmit={handleCreateFolder} className="flex gap-2">
          <input 
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nova Pasta..."
            className="bg-stone-950 border border-amber-900/30 px-3 py-1 rounded text-xs text-amber-100 outline-none focus:border-amber-500"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-amber-900/20 hover:bg-amber-900/40 border border-amber-900/50 px-3 py-1 rounded text-[10px] text-amber-500 transition-all uppercase"
          >
            + FORJAR
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {folders.map((folder) => (
          <div 
            key={folder.id_folders}
            onClick={() => setFolderSelecionada(folder)} // "Entra" na pasta ao clicar
            className="p-4 bg-stone-900/40 border border-amber-900/10 rounded group hover:border-amber-500/50 transition-all cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📁</span>
              <div>
                <p className="font-cinzel text-sm text-stone-300 group-hover:text-amber-100 transition-colors">
                  {folder.nome_folder}
                </p>
                <p className="text-[9px] text-stone-600 uppercase tracking-tighter">
                  Clique para gerenciar itens
                </p>
              </div>
            </div>
            
            <button 
              onClick={(e) => toggleVisibility(e, folder.id_folders, folder.visibilidade)}
              className={`text-[8px] px-2 py-1 rounded border transition-all z-10 ${
                folder.visibilidade 
                ? 'border-green-900/50 text-green-500 bg-green-900/10' 
                : 'border-red-900/50 text-red-500 bg-red-900/10'
              }`}
            >
              {folder.visibilidade ? 'VISÍVEL' : 'OCULTO'}
            </button>
          </div>
        ))}
      </div>
      
      {folders.length === 0 && (
        <div className="py-10 text-center italic text-stone-700 text-sm border-2 border-dashed border-stone-900 rounded-xl">
          Nenhuma pasta forjada nesta mesa ainda.
        </div>
      )}
    </div>
  )
}