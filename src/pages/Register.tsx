import { useState } from 'react';
import { api } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Lock, Mail } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Account created! Please login.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-accent">
        <h2 className="text-3xl font-bold mb-6 text-dark text-center">Join CloudBox</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-500 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}