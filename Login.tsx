
import React, { useState } from 'react';
import { UserRole, User } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim()) {
      setError('Please provide both your name and unique ID.');
      return;
    }

    const user: User = {
      id: studentId.toUpperCase().trim(),
      name: studentName.trim(),
      email: `${studentId.toLowerCase()}@student.aptimaster.com`,
      role: UserRole.STUDENT
    };
    onLogin(user);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock passcode for demonstration of separate access
    if (adminKey === 'admin123') {
      const user: User = {
        id: 'ADMIN-ROOT',
        name: 'System Administrator',
        email: 'admin@aptimaster.com',
        role: UserRole.ADMIN
      };
      onLogin(user);
    } else {
      setError('Invalid administrative credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Branding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200 mb-6 rotate-3">
            <span className="text-white font-black text-4xl">A</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AptiMaster</h1>
          <p className="mt-3 text-slate-500 font-medium">Professional Aptitude Assessment Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100">
          {/* Toggle Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              onClick={() => { setMode('student'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Student Portal
            </button>
            <button 
              onClick={() => { setMode('admin'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admin Access
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              {mode === 'student' ? 'Student Entry' : 'Admin Authorization'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {mode === 'student' 
                ? 'Enter your unique credentials to access your test history.' 
                : 'Restricted area. Secure credentials required.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {mode === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Student ID / Roll No</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. STU-057"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800 uppercase"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] mt-4"
              >
                Access Student Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Administrator Passcode</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    placeholder="Enter admin code"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800"
                    value={adminKey}
                    onChange={e => setAdminKey(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] mt-4"
              >
                Unlock Admin Controls
              </button>
              <p className="text-center text-[10px] text-slate-400 font-medium">
                Tip: Default demo passcode is <span className="text-slate-600 font-bold">admin123</span>
              </p>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-slate-400 text-sm font-medium">
          <p>Secure connection established.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> 256-bit SSL
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Role-Based Access
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default Login;
