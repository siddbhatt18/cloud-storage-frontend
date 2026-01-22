import { useEffect, useState } from 'react';
import { api } from '../api';
import Sidebar from '../components/Sidebar';
import FileRow from '../components/FileRow';
import { Star, Folder } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper type for file data
interface FileData {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
  is_favorite: boolean;
}

export default function Favorites() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all files and filter for favorites
  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/files');
      // Filter the list to show only favorites
      const favoriteFiles = data.filter((file: FileData) => file.is_favorite);
      setFiles(favoriteFiles);
    } catch (error) {
      console.error('Failed to load favorites');
      toast.error('Could not load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" /> Favorites
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center mt-20 text-gray-400">Loading favorites...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 select-none rounded-t-xl">
                <div className="col-span-12 sm:col-span-6">Name</div>
                <div className="hidden sm:block sm:col-span-2">Size</div>
                <div className="hidden sm:block sm:col-span-3">Date</div>
                <div className="hidden sm:block sm:col-span-1"></div>
              </div>

              {/* Empty State */}
              {files.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No favorites yet.</p>
                  <p className="text-sm mt-1">Star items in "My Cloud" to see them here.</p>
                </div>
              )}

              {/* File List */}
              <div className="divide-y divide-gray-50">
                {files.map((file) => (
                  <FileRow 
                    key={file.id} 
                    file={file} 
                    onRefresh={fetchFavorites} // Refresh list if you remove a favorite here
                  />
                ))}
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}