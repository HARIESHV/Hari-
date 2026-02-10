
import React, { useState, useEffect } from 'react';
import { Question, User, Submission, ActiveCall, SupportConfig } from '../../types';
import QuestionCard from './QuestionCard';
import LiveSession from './LiveSession';

interface StudentPortalProps {
  questions: Question[];
  user: User;
  onInitiateCall: () => string;
  onEndCall: (id: string) => void;
  onJoinCall: (id: string) => void;
  activeCalls: ActiveCall[];
  studentSubmissions: Submission[];
  onAddSubmission: (sub: Submission) => void;
  supportConfig: SupportConfig;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ 
  questions, 
  user, 
  onInitiateCall, 
  onEndCall,
  onJoinCall,
  activeCalls,
  studentSubmissions,
  onAddSubmission,
  supportConfig
}) => {
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [lastNoteId, setLastNoteId] = useState<string | null>(null);

  const incomingAdminCall = activeCalls.find(c => c.studentId === user.id && c.initiator === 'admin' && c.status === 'waiting');

  const handleAnswer = (qId: string, answerIdx: number, isCorrect: boolean) => {
    const noteId = `NOTE-${Math.floor(100000 + Math.random() * 900000)}`;
    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      questionId: qId,
      answer: answerIdx,
      isCorrect,
      timestamp: new Date(),
      noteId: noteId
    };
    onAddSubmission(newSubmission);
    setLastNoteId(noteId);
    
    // Clear toast after 5 seconds
    setTimeout(() => setLastNoteId(null), 5000);
  };

  const handleStartCall = () => {
    const callId = onInitiateCall();
    setActiveMeetingId(callId);
  };

  const handleAcceptCall = () => {
    if (incomingAdminCall) {
      onJoinCall(incomingAdminCall.id);
      setActiveMeetingId(incomingAdminCall.id);
    }
  };

  const currentCall = activeCalls.find(c => c.id === activeMeetingId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Incoming Call Notification (Sticky Modal) */}
      {incomingAdminCall && !activeMeetingId && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-md animate-in slide-in-from-top duration-500">
          <div className="bg-indigo-600 text-white p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-500/40 border border-white/20 backdrop-blur-xl flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm relative z-10">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Priority Connection</p>
              <h3 className="text-xl font-black">Admin is calling you</h3>
              <p className="text-sm text-indigo-100 font-medium opacity-80 mt-2">The administrator wants to discuss your progress.</p>
            </div>
            <div className="flex gap-4 w-full pt-2">
              <button 
                onClick={() => onEndCall(incomingAdminCall.id)}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Decline
              </button>
              <button 
                onClick={handleAcceptCall}
                className="flex-1 py-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl"
              >
                Accept Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Note ID */}
      {lastNoteId && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-slate-900 text-white px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Submission Logged</p>
               <p className="text-sm font-bold">Reference ID: <span className="font-mono text-indigo-400">{lastNoteId}</span></p>
             </div>
           </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-indigo-600 rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
          <span className="text-[14rem] font-black leading-none">{user.id.slice(-2)}</span>
        </div>
        
        <div className="space-y-6 text-center md:text-left z-10 w-full md:w-auto">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">Hello, {user.name.split(' ')[0]}</h1>
            <div className="bg-white/20 px-5 py-2 rounded-2xl text-[11px] font-black uppercase border border-white/20 tracking-[0.2em] backdrop-blur-md">
              Access ID: {user.id}
            </div>
          </div>
          <p className="text-indigo-100 text-base sm:text-xl font-medium opacity-90 max-w-xl">AptiMaster is processing your cognitive profile. Keep track of your unique Note IDs for administrative review.</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-8 pt-2">
             <div className="bg-black/10 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 shadow-lg min-w-[120px]">
               <span className="block text-[10px] uppercase font-black text-indigo-300 tracking-[0.2em] mb-1">Assessments</span>
               <span className="text-2xl sm:text-4xl font-black leading-none">{studentSubmissions.length}</span>
             </div>
             <div className="bg-black/10 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 shadow-lg min-w-[120px]">
               <span className="block text-[10px] uppercase font-black text-indigo-300 tracking-[0.2em] mb-1">Efficiency</span>
               <span className="text-2xl sm:text-4xl font-black leading-none text-emerald-400">
                 {studentSubmissions.length > 0 ? `${Math.round((studentSubmissions.filter(s => s.isCorrect).length / studentSubmissions.length) * 100)}%` : '-%'}
               </span>
             </div>
          </div>
        </div>

        <button 
          onClick={handleStartCall}
          className="w-full md:w-auto bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-6 rounded-[2.2rem] font-black text-lg shadow-2xl shadow-indigo-900/30 transition-all hover:scale-[1.04] active:scale-95 flex items-center justify-center gap-4 z-10"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          Live Tutoring
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10 order-2 lg:order-1">
          <div className="flex items-center gap-5 px-4">
            <div className="w-3 h-10 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Active Assessments</h2>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {questions.map(q => {
              const prevSub = studentSubmissions.find(s => s.questionId === q.id);
              return (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  onAnswer={handleAnswer} 
                  submission={prevSub}
                />
              );
            })}
          </div>
        </div>

        {/* Sidebar History */}
        <div className="lg:col-span-4 space-y-10 order-1 lg:order-2 sticky top-28">
          <div className="flex items-center gap-5 px-4">
            <div className="w-3 h-10 bg-emerald-500 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Strategy Log</h2>
          </div>
          <div className="bg-white border-2 border-slate-50 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-100/50">
            {studentSubmissions.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <p className="text-slate-400 font-bold text-sm">No activity recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y-2 divide-slate-50 max-h-[600px] overflow-y-auto no-scrollbar">
                {studentSubmissions.map(sub => {
                  const q = questions.find(q => q.id === sub.questionId);
                  return (
                    <div key={sub.id} className="p-8 hover:bg-slate-50 transition-all group border-l-4 border-transparent hover:border-indigo-500">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-indigo-500 font-mono tracking-widest bg-indigo-50 px-2 py-1 rounded-md">{sub.noteId}</span>
                        <div className={`w-3 h-3 rounded-full ${sub.isCorrect ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-red-500 shadow-lg shadow-red-500/30'}`}></div>
                      </div>
                      <p className="text-base font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">{q?.text}</p>
                      <div className="mt-5 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           {sub.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                         <span className={`text-[9px] font-black uppercase tracking-tighter ${sub.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                           {sub.isCorrect ? 'Accurate' : 'Adjustment Needed'}
                         </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeMeetingId && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-0 sm:p-8 animate-in fade-in zoom-in duration-500">
           <LiveSession 
              onClose={() => {
                onEndCall(activeMeetingId);
                setActiveMeetingId(null);
              }}
              status={currentCall?.status}
              meetLink={supportConfig.meetLink}
           />
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
