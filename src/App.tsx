import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trash from './pages/Trash';
import Favorites from './pages/Favorites'; // <--- Import the new page

function App() {
  return (
    <BrowserRouter>
      {/* Global Notification Toaster */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/favorites" element={<Favorites />} /> {/* <--- The Fix: Add this route */}
        
        {/* Catch-all: Redirect unknown URLs to Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;