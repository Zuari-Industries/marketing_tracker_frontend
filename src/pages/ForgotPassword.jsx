import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle, AlertTriangle } from 'lucide-react';


const API_BASE = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Reset link sent to your email! Please check your inbox and spam folder.");
        setMessageType('success');
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
        setMessageType('error');
      }
    } catch (err) {
      setMessage("Server error: Could not connect to the server.");
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const Message = () => {
    if (!message) return null;

    const isSuccess = messageType === 'success';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;
    const colorClass = isSuccess ? 'text-green-400' : 'text-red-400';

    return (
        <div className={`flex items-center gap-2 p-3 mt-4 rounded-md text-sm ${isSuccess ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <Icon size={18} className={colorClass} />
            <p className={colorClass}>{message}</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-600/20 rounded-full mb-4">
                <Mail className="text-blue-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Forgot Your Password?</h2>
            <p className="text-gray-400 mt-2">No worries! Enter your email and we'll send you a reset link.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <Message />
        </div>

        <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                &larr; Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
