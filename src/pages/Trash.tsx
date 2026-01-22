import { useEffect, useState } from 'react';
import { api } from '../api';
import Sidebar from '../components/Sidebar';
import { Trash2, RotateCcw, XCircle, File } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatBytes } from '../utils/format';

interface FileData {
  id: string;
  name: string;
  size: number;
  mime_type: string;
}

export default function Trash() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    try {
      const { data } = await api.get('/files/trash');
      setFiles(data);
    } catch (error) {
      console.error('Failed to load trash');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    // 1. Optimistic Update: Remove from list immediately
    setFiles((prev) => prev.filter((f) => f.id !== id));
    
    try {
      await api.post(`/files/${id}/restore`);
      toast.success('File restored');
    } catch (error) {
      toast.error('Failed to restore');
      fetchTrash(); // Revert if failed
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('This action cannot be undone. Delete forever?')) return;

    // 1. Optimistic Update: Remove from list immediately
    setFiles((prev) => prev.filter((f) => f.id !== id));

    try {
      await api.delete(`/files/${id}/permanent`);
      toast.success('File deleted forever');
    } catch (error) {
      toast.error('Failed to delete');
      fetchTrash(); // Revert if failed
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <h1 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
          <Trash2 className="text-danger" /> Trash
        </h1>

        {loading ? (
          <div className="text-center mt-20 text-gray-400">Loading trash...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-y-auto">
            {files.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Trash2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Trash is empty. Good job!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <File className="text-gray-400" size={20} />
                      <div>
                        <p className="font-medium text-dark">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => handleRestore(file.id)}
                        className="p-2 text-primary hover:bg-blue-50 rounded-lg flex items-center gap-1 text-sm font-medium"
                      >
                        <RotateCcw size={16} /> Restore
                      </button>
                      <button 
                        onClick={() => handlePermanentDelete(file.id)}
                        className="p-2 text-danger hover:bg-red-50 rounded-lg flex items-center gap-1 text-sm font-medium"
                      >
                        <XCircle size={16} /> Delete Forever
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}