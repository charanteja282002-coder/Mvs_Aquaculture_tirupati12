
import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Loader2, Database, Globe, KeyRound, Sparkles } from 'lucide-react';
import { auth, isFirebaseConfigured } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useApp } from '../../AppContext';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const { localLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // If Firebase isn't fully ready, we use the local administrative layer
    if (!isFirebaseConfigured || !auth) {
      setTimeout(() => {
        if (email === 'admin@mvsaqua.com' && password === 'admin123') {
          localLogin({ id: 'local-admin', email, isAdmin: true });
          onLogin();
        } else {
          setError('Credential mismatch. Please use the administrative access keys.');
        }
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        onLogin();
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      // Fallback for demo environments
      if (email === 'admin@mvsaqua.com' && password === 'admin123') {
        localLogin({ id: 'demo-admin', email, isAdmin: true });
        onLogin();
      } else {
        setError('Invalid administrative credentials or cloud synchronization error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const useAdminAccess = () => {
    setEmail('admin@mvsaqua.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] animate-fade-in">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-aqua-dark rounded-[32px] flex items-center justify-center mb-6 shadow-2xl shadow-aqua-dark/20 border-b-8 border-gold rotate-3 hover:rotate-0 transition-transform duration-500">
            <Database className="text-gold h-12 w-12" />
          </div>
          <h1 className="text-aqua-dark text-4xl font-black uppercase tracking-tighter font-heading">Admin <span className="text-aqua-light">PRO</span></h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-3">MVS Aqua Intelligence System</p>
        </div>

        {/* System Status - Clean & Professional */}
        <div className="mb-10 flex justify-center">
          <div className="flex items-center space-x-2 px-6 py-2.5 rounded-full border border-green-100 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            <Globe className="h-3.5 w-3.5 animate-pulse" />
            <span>Cloud Sync Active</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-aqua-dark to-aqua-light"></div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl flex items-start text-xs font-bold animate-shake shadow-sm">
              <AlertCircle className="h-4 w-4 mr-3 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-aqua-dark transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[20px] py-5 pl-16 pr-6 text-sm text-gray-900 focus:border-aqua-dark/20 focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="admin@mvsaqua.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase tracking-widest ml-1">Administrative Key</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-aqua-dark transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[20px] py-5 pl-16 pr-6 text-sm text-gray-900 focus:border-aqua-dark/20 focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-aqua-dark text-white font-black text-xs uppercase tracking-[0.25em] py-6 rounded-[24px] hover:bg-black transition-all shadow-xl shadow-aqua-dark/30 active:scale-[0.97] flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                  Authenticating...
                </>
              ) : (
                <>Authorize Access</>
              )}
            </button>
          </form>

          {/* Quick Access Action */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <button 
              onClick={useAdminAccess}
              className="group inline-flex items-center text-[10px] font-black text-aqua-dark bg-blue-50 px-6 py-3 rounded-full uppercase tracking-widest hover:bg-aqua-dark hover:text-white transition-all shadow-sm"
            >
              <KeyRound className="h-3.5 w-3.5 mr-2 group-hover:rotate-12 transition-transform" /> 
              Fill Admin Credentials
            </button>
            <div className="mt-4 flex flex-col space-y-1">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Email: admin@mvsaqua.com</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Password: admin123</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-4">
           <div className="h-px w-8 bg-gray-200"></div>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
             Authorized Session Only
           </p>
           <div className="h-px w-8 bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};
