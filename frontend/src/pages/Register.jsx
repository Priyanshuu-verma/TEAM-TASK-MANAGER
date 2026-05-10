import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user account
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      // Auto login after success
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      
      {/* Visual background elements */}
      <div className="absolute -top-20 -left-20 w-[30rem] h-[30rem] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 animate-pulse" style={{ animationDelay: '3s' }}></div>

      {/* Main registration card */}
      <div className="relative z-10 w-full max-w-md p-10 space-y-6 bg-white/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 my-8">
        
        <div className="flex flex-col items-center justify-center text-center mb-4">
            <div className="relative w-16 h-16 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl mb-4 hover:rotate-180 transition-transform duration-700">
                <span className="text-2xl font-black text-white">TM</span>
            </div>
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">Create Account</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Please fill in your details to get started.</p>
        </div>

        {error && (
            <div className="p-4 text-sm font-bold text-pink-600 bg-pink-50/80 backdrop-blur-sm border border-pink-200 rounded-2xl text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Full Name</label>
            <input
              type="text" 
              placeholder="Enter your name" 
              required
              className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold placeholder-slate-400"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
            <input
              type="email" 
              placeholder="example@mail.com" 
              required
              className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold placeholder-slate-400"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Password</label>
            <input
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold placeholder-slate-400"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Role</label>
            <select 
              className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold cursor-pointer"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Member">User / Member</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          <div className="relative group mt-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
            <button 
                type="submit" 
                className="relative w-full py-4 text-white font-black text-lg tracking-wide bg-slate-900 rounded-3xl hover:bg-slate-800 transition-all duration-300 transform group-hover:-translate-y-1"
            >
                Register Now
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-pink-500 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;