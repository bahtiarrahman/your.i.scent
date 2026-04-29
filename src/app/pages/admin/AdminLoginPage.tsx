import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLogin(password);
    if (ok) {
      navigate('/admin');
    } else {
      setError('Password salah. Coba lagi.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#2C2520] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 text-center">
        <div style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-semibold tracking-[0.15em] text-white">
          your.i scent
        </div>
        <div className="text-[9px] tracking-[0.3em] text-[#C9A96E] uppercase mt-0.5">Admin Panel</div>
      </div>

      <div className="bg-[#3C3327] rounded-2xl p-8 w-full max-w-sm border border-[#5C5247]/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#C9A96E]/15 rounded-xl flex items-center justify-center">
            <Lock size={18} className="text-[#C9A96E]" />
          </div>
          <div>
            <h1 className="text-white text-sm font-medium">Masuk ke Admin</h1>
            <p className="text-xs text-[#8B7D72]">Masukkan password admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#8B7D72] uppercase tracking-wide mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5247]" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Masukkan password"
                className="w-full pl-9 pr-10 py-2.5 bg-[#2C2520] border border-[#5C5247]/40 rounded-lg text-sm text-white placeholder-[#5C5247] outline-none focus:border-[#C9A96E] transition-colors"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5247]">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#C9A96E] text-white rounded-full text-sm hover:bg-[#B8966A] transition-colors"
          >
            Masuk
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-[#5C5247]">
          Hint: password = <span className="font-mono text-[#8B7D72]">admin123</span>
        </div>
      </div>

      <Link to="/" className="mt-6 text-xs text-[#5C5247] hover:text-[#8B7D72] transition-colors">
        ← Kembali ke Toko
      </Link>
    </div>
  );
}
