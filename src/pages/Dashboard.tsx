import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Search, LogOut, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../api';
import Sidebar from '../components/Sidebar';
import FileRow from '../components/FileRow';
import UploadModal from '../components/UploadModal';
import toast from 'react-hot-toast';

interface FileData {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
}

type SortKey = 'name' | 'size' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function Dashboard() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Sorting State
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const navigate = useNavigate();

  const fetchFiles = async (query = '') => {
    try {
      const endpoint = query ? `/files/search?q=${query}` : '/files';
      const { data } = await api.get(endpoint);
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch files');
      toast.error('Could not load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFiles(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      if (sortKey === 'name') {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [files, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => fetchFiles(searchQuery)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsUploadOpen(true)} 
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-sm"
            >
              <Plus size={18} />
              <span className="font-medium">New</span>
            </button>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-danger transition">
              <LogOut size={22} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-dark mb-6">
            {searchQuery ? `Search results for "${searchQuery}"` : 'My Cloud'}
          </h1>

          {loading ? (
            <div className="flex justify-center mt-20 text-gray-400">Loading files...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100"> 
              {/* FIX 1: Removed overflow-hidden above so menus can pop out */}
              
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 select-none rounded-t-xl">
                {/* FIX 2: Added rounded-t-xl above to fix corners */}
                
                <div 
                  onClick={() => handleSort('name')}
                  className="col-span-12 sm:col-span-6 flex items-center space-x-1 cursor-pointer hover:text-primary transition"
                >
                  <span>Name</span>
                  <SortIcon column="name" />
                </div>

                <div 
                  onClick={() => handleSort('size')}
                  className="hidden sm:flex sm:col-span-2 items-center space-x-1 cursor-pointer hover:text-primary transition"
                >
                  <span>Size</span>
                  <SortIcon column="size" />
                </div>

                <div 
                  onClick={() => handleSort('created_at')}
                  className="hidden sm:flex sm:col-span-3 items-center space-x-1 cursor-pointer hover:text-primary transition"
                >
                  <span>Date</span>
                  <SortIcon column="created_at" />
                </div>

                <div className="hidden sm:block sm:col-span-1"></div>
              </div>

              {files.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  <Folder className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>{searchQuery ? 'No files found.' : 'No files yet. Upload one!'}</p>
                </div>
              )}

              <div className="divide-y divide-gray-50">
                {sortedFiles.map((file) => (
                  <FileRow 
                    key={file.id} 
                    file={file} 
                    onRefresh={() => fetchFiles(searchQuery)} 
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