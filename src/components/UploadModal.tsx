import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud, File as FileIcon } from 'lucide-react';
import { api } from '../api';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void; // Function to refresh the list
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);

  // Function called when file is dropped
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // For MVP, we handle 1 file at a time
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('File uploaded successfully!');
      onUploadSuccess(); // Refresh the dashboard list
      onClose(); // Close modal
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onClose, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-dark">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-dark">Upload File</h2>

        {/* Drop Zone Area */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition
            ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
          `}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="text-center animate-pulse">
              <UploadCloud size={48} className="text-primary mx-auto mb-4" />
              <p className="text-dark font-medium">Uploading your file...</p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud size={32} className="text-primary" />
              </div>
              <p className="text-dark font-medium mb-1">
                {isDragActive ? 'Drop it here!' : 'Click or Drag file to upload'}
              </p>
              <p className="text-sm text-gray-400">Supports images, documents & more</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}