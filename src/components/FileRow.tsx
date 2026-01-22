import { useState } from 'react';
import { 
  FileText, Image, MoreVertical, File, 
  Trash2, Download, Edit2, Share2, Star 
} from 'lucide-react';
import { formatBytes } from '../utils/format';
import { api } from '../api';
import toast from 'react-hot-toast';

const getIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image size={20} className="text-purple-500" />;
  if (mimeType.includes('pdf')) return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-gray-400" />;
};

interface FileRowProps {
  file: any;
  onRefresh: () => void;
}

export default function FileRow({ file, onRefresh }: FileRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  // 1. Handle Preview (Opens in New Tab) - Assigned to Name Click
  const handlePreview = async () => {
    try {
      const { data } = await api.get(`/files/${file.id}/link`);
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      toast.error('Failed to open file');
    }
  };

  // 2. Handle Download (Forces Save) - Assigned to Download Button
  const handleDownload = async () => {
    try {
      const { data } = await api.get(`/files/${file.id}/link`);
      
      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download file');
    }
    setShowMenu(false);
  };

  const handleShare = async () => {
    try {
      const { data } = await api.get(`/files/${file.id}/link`);
      await navigator.clipboard.writeText(data.signedUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to get link');
    }
    setShowMenu(false);
  };

  const handleFavorite = async () => {
    try {
      await api.patch(`/files/${file.id}/favorite`);
      toast.success(file.is_favorite ? 'Removed from favorites' : 'Added to favorites');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.delete(`/files/${file.id}`);
      toast.success('File moved to trash');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete file');
    }
    setShowMenu(false);
  };

  const handleRename = async () => {
    const newName = prompt('Enter new file name:', file.name);
    if (!newName || newName === file.name) return;
    try {
      await api.patch(`/files/${file.id}`, { name: newName });
      toast.success('File renamed');
      onRefresh();
    } catch (error) {
      toast.error('Failed to rename file');
    }
    setShowMenu(false);
  };

  return (
    <div className={`relative group ${showMenu ? 'z-50' : ''}`}>
      
      <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50 border-b border-gray-100 transition text-sm">
        
        {/* Name Column - NOW USES handlePreview */}
        <div 
          className="col-span-12 sm:col-span-6 flex items-center space-x-3 truncate cursor-pointer" 
          onClick={handlePreview} 
        >
          {getIcon(file.mime_type)}
          <span className="font-medium text-dark truncate hover:text-primary transition">{file.name}</span>
          {file.is_favorite && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
        </div>

        {/* Size */}
        <div className="hidden sm:block sm:col-span-2 text-gray-500">
          {formatBytes(file.size)}
        </div>

        {/* Date */}
        <div className="hidden sm:block sm:col-span-3 text-gray-500">
          {new Date(file.created_at).toLocaleDateString()}
        </div>

        {/* Action Button */}
        <div className="hidden sm:block sm:col-span-1 text-right relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-200 rounded-full transition text-gray-500"
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              ></div>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden">
                
                <button 
                  onClick={handleRename}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
                >
                  <Edit2 size={16} /> <span>Rename</span>
                </button>

                <button 
                  onClick={handleFavorite}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
                >
                  <Star size={16} className={file.is_favorite ? "fill-yellow-500 text-yellow-500" : ""} /> 
                  <span>{file.is_favorite ? 'Remove Favorite' : 'Add to Favorites'}</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
                >
                  <Share2 size={16} /> <span>Share Link</span>
                </button>

                 {/* Download Button - NOW USES handleDownload */}
                 <button 
                  onClick={handleDownload}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
                >
                  <Download size={16} /> <span>Download</span>
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button 
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 transition"
                >
                  <Trash2 size={16} /> <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}