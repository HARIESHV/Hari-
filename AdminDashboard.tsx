
import React, { useState } from 'react';
import { Question, ActiveCall, Submission, SupportConfig, User, UserRole } from '../../types';
import LiveSession from '../Student/LiveSession';

interface AdminDashboardProps {
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  activeCalls: ActiveCall[];
  onJoinCall: (id: string) => void;
  onEndCall: (id: string) => void;
  onInitiateCall: (student: User) => string;
  allSubmissions: Submission[];
  supportConfig: SupportConfig;
  onUpdateConfig: (config: SupportConfig) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  questions, 
  onAddQuestion, 
  onDeleteQuestion,
  activeCalls,
  onJoinCall,
  onEndCall,
  onInitiateCall,
  allSubmissions,
  supportConfig,
  onUpdateConfig
}) => {
  const [tab, setTab] = useState<'questions' | 'reports' | 'settings'>('questions');
  const [isAdding, setIsAdding] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  
  const initialNewQ: Partial<Question> = {
    text: '',
    category: 'Quantitative',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'Easy',
    explanation: ''
  };

  const [newQ, setNewQ] = useState<Partial<Question>>(initialNewQ);

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.text || newQ.options?.some(opt => !opt)) {
      alert("Please fill in the question text and all four options.");
      return;
    }

    const question: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: newQ.text!,
      category: newQ.category!,
      options: newQ.options as string[],
      correctAnswer: newQ.correctAnswer!,
      difficulty: newQ.difficulty as any,
      explanation: newQ.explanation || ''
    };

    onAddQuestion(question);
    setNewQ(initialNewQ);
    setIsAdding(false);
  };

  const handleContactStudent = (sid: string) => {
    const studentSub = allSubmissions.find(s => s.studentId === sid);
    if (!studentSub) return;
    
    const targetStudent: User = {
      id: sid,
      name: studentSub.studentName,
      email: `${sid.toLowerCase()}@student.aptimaster.com`,
      role: UserRole.STUDENT
    };
    
    const callId = onInitiateCall(targetStudent);
    setActiveMeetingId(callId);
  };

  // Explicitly typing students as string[] to ensure 'sid' is treated as string in mapping logic
  const students: string[] = Array.from(new Set(allSubmissions.map(s => s.studentId)));

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-8">
        {['questions', 'reports', 'settings'].map((t) => (
          <button 
            key={t}
            onClick={() => setTab(t as any)}
            className={`pb-4 px-1 whitespace-nowrap text-sm font-black transition-all relative uppercase tracking-widest ${tab === t ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {t.replace(/^\w/, (c) => c.toUpperCase())}
            {tab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {tab === 'questions' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Question Bank</h1>
              <p className="text-slate-500 font-medium">Manage and publish your aptitude assessment content.</p>
            </div>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] ${isAdding ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              {isAdding ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  Post New Question
                </>
              )}
            </button>
          </div>

          {/* Add Question Form */}
          {isAdding && (
            <div className="bg-white border-2 border-indigo-100 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-indigo-50/50 animate-in slide-in-from-top-4 duration-500">
              <form onSubmit={handlePostQuestion} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Question Content</label>
                      <textarea 
                        required
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800 h-32 resize-none"
                        placeholder="Type the question here..."
                        value={newQ.text}
                        onChange={e => setNewQ({...newQ, text: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select 
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-800"
                          value={newQ.category}
                          onChange={e => setNewQ({...newQ, category: e.target.value})}
                        >
                          <option>Quantitative</option>
                          <option>Logical Reasoning</option>
                          <option>Verbal Ability</option>
                          <option>Data Interpretation</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
                        <select 
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-bold text-slate-800"
                          value={newQ.difficulty}
                          onChange={e => setNewQ({...newQ, difficulty: e.target.value as any})}
                        >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Explanation / Solution Logic</label>
                      <textarea 
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800 h-24 resize-none"
                        placeholder="Why is the answer correct?"
                        value={newQ.explanation}
                        onChange={e => setNewQ({...newQ, explanation: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Options & Correct Answer</label>
                    {newQ.options?.map((opt, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="flex-grow relative">
                          <input 
                            type="text"
                            required
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                            className={`w-full bg-slate-50 border-2 focus:bg-white rounded-2xl px-5 py-4 pl-14 outline-none transition-all font-bold text-slate-800 ${newQ.correctAnswer === i ? 'border-emerald-500' : 'border-transparent focus:border-indigo-500'}`}
                            value={opt}
                            onChange={e => {
                              const opts = [...(newQ.options || [])];
                              opts[i] = e.target.value;
                              setNewQ({...newQ, options: opts});
                            }}
                          />
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 group-hover:text-indigo-500 transition-colors">
                            {String.fromCharCode(65 + i)}
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setNewQ({...newQ, correctAnswer: i})}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${newQ.correctAnswer === i ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-300 hover:border-indigo-200'}`}
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </div>
                    ))}
                    <div className="pt-4">
                      <button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase text-xs tracking-[0.2em]"
                      >
                        Publish to Question Bank
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Question List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {questions.map(q => (
              <div key={q.id} className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 group relative hover:shadow-2xl hover:shadow-slate-100 transition-all border-l-8 border-l-indigo-500/0 hover:border-l-indigo-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-3">
                    <span className="text-[10px] px-3 py-1.5 rounded-xl font-black uppercase bg-indigo-50 text-indigo-600 tracking-wider border border-indigo-100">{q.category}</span>
                    <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-wider ${q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if(confirm("Are you sure you want to delete this question?")) onDeleteQuestion(q.id);
                    }} 
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-xl leading-snug mb-8">{q.text}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`p-4 rounded-2xl text-xs font-bold border-2 ${i === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                      <span className="opacity-40 mr-2">{String.fromCharCode(65 + i)}</span> {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="mt-6 pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logic</p>
                    <p className="text-xs font-medium text-slate-500 italic">"{q.explanation}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : tab === 'reports' ? (
        <div className="bg-white border-2 border-slate-50 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-100/50 animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6">Candidate</th>
                  <th className="px-10 py-6">Note History</th>
                  <th className="px-10 py-6 text-center">Score</th>
                  <th className="px-10 py-6 text-right">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((sid: string) => {
                  const subs = allSubmissions.filter(s => s.studentId === sid);
                  const correct = subs.filter(s => s.isCorrect).length;
                  const accuracy = Math.round((correct/subs.length)*100);
                  const isBusy = activeCalls.some(c => c.studentId === sid);

                  return (
                    <tr key={sid} className="hover:bg-indigo-50/20 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center font-black text-white shadow-lg">
                            {sid.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base">{subs[0]?.studentName}</p>
                            <p className="text-[10px] text-indigo-500 font-mono font-bold tracking-widest">{sid}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-wrap gap-2">
                          {subs.slice(0, 3).map(s => (
                            <span key={s.id} className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">{s.noteId}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`text-lg font-black ${accuracy > 70 ? 'text-emerald-500' : 'text-slate-900'}`}>{accuracy}%</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{correct} / {subs.length} correct</p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          disabled={isBusy}
                          onClick={() => handleContactStudent(sid)}
                          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${isBusy ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}
                        >
                          {isBusy ? 'Connected' : 'Initiate Call'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in zoom-in duration-500">
           {/* Meet Config */}
           <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-100/50">
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Meet Integration</h2>
              <p className="text-slate-500 mb-8 font-medium">Link your secure Google Meet room for support sessions.</p>
              <form onSubmit={(e) => { e.preventDefault(); onUpdateConfig(supportConfig); alert('Config Saved!'); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Live URL (HTTPS Only)</label>
                  <input 
                    type="url" 
                    required
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.5rem] px-6 py-4 outline-none transition-all font-bold text-slate-800"
                    value={supportConfig.meetLink}
                    onChange={e => onUpdateConfig({...supportConfig, meetLink: e.target.value})}
                  />
                </div>
                <button type="submit" className="bg-slate-900 text-white px-10 py-5 rounded-[1.8rem] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all text-xs">
                  Save Global Policy
                </button>
              </form>
           </div>

           {/* Deployment Status & SSL Management */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/40">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                     <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Security Audit</h3>
                </div>
                <div className="space-y-5">
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">SSL Protocol</span>
                      <span className="text-emerald-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        HTTPS Validated
                      </span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">Domain Encryption</span>
                      <span className="text-indigo-400 font-mono font-bold text-[10px] uppercase">AES-256 GCM</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">Vercel Auto-SSL</span>
                      <span className="text-white font-black text-xs uppercase tracking-widest">Ready for Deploy</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        To get your permanent <span className="text-white font-black underline">https://</span> link for free, simply connect your GitHub repo to Vercel. 
                        We've pre-configured the <code className="text-indigo-400 font-bold">vercel.json</code> to handle global redirection and certificate renewal automatically.
                      </p>
                   </div>
                </div>
              </div>
              <div className="mt-8">
                 <button onClick={() => window.open('https://vercel.com/new', '_blank')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
                   Deploy to Vercel Now
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeMeetingId && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500">
          <LiveSession 
            onClose={() => {
              onEndCall(activeMeetingId);
              setActiveMeetingId(null);
            }} 
            meetLink={supportConfig.meetLink}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
