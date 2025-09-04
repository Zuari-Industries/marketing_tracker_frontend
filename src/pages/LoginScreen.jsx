import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

const LoginScreen = () => {
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #f0f4f8, #d9e2ec, #f0f4f8)' }}>
            
            <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <ArrowRight className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">Sign In to Marketing Hub</h2>
                    <p className="text-gray-500">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label className="text-sm font-medium text-gray-600" htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="mt-1 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600" htmlFor="password">Password</label>
                        <div className="relative">
                            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="mt-1 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <div>
                        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;