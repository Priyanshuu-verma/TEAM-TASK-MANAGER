import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
            
            {/* Background animated gradients */}
            <div className="absolute top-10 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>

            {/* Glassmorphism login container */}
            <div className="relative z-10 w-full max-w-md p-10 space-y-8 bg-white/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60">
                
                {/* Logo and Header */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative group cursor-pointer mb-6">
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
                        <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">TM</span>
                        </div>
                    </div>
                    <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">Welcome Back</h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Enter your credentials to access your account.</p>
                </div>

                {/* Error message display */}
                {error && (
                    <div className="p-4 text-sm font-bold text-pink-600 bg-pink-50/80 backdrop-blur-sm border border-pink-200 rounded-2xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
                        <input
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-purple-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold placeholder-slate-400"
                            placeholder="hello@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Password</label>
                        <input
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-purple-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold placeholder-slate-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="relative group mt-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
                        <button
                            type="submit"
                            className="relative w-full py-4 text-white font-black text-lg tracking-wide bg-slate-900 rounded-3xl hover:bg-slate-800 transition-all duration-300 transform group-hover:-translate-y-1"
                        >
                            Log In
                        </button>
                    </div>
                    
                    <p className="mt-8 text-center text-sm font-bold text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-600 hover:text-pink-500 transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;