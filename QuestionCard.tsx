
import React, { useState } from 'react';
import { Question, Submission } from '../../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (qId: string, answerIdx: number, isCorrect: boolean) => void;
  submission?: Submission;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, submission }) => {
  const [selected, setSelected] = useState<number | null>(submission?.answer ?? null);

  const handleSelect = (idx: number) => {
    if (submission) return; // Prevent re-answering
    setSelected(idx);
    const isCorrect = idx === question.correctAnswer;
    onAnswer(question.id, idx, isCorrect);
  };

  return (
    <div className={`bg-white border-2 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 transition-all shadow-xl shadow-slate-100/50 ${submission ? (submission.isCorrect ? 'border-green-100 bg-green-50/10' : 'border-red-100 bg-red-50/10') : 'hover:border-indigo-100'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{question.category}</span>
        </div>
        <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-wider ${
          question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
          question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty}
        </span>
      </div>
      
      <p className="text-xl sm:text-2xl font-black text-slate-900 mb-8 leading-tight sm:leading-snug">{question.text}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((opt, i) => {
          let styles = "border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-300";
          if (selected === i) {
            if (i === question.correctAnswer) styles = "border-green-500 bg-green-50 text-green-700 font-black shadow-lg shadow-green-100";
            else styles = "border-red-500 bg-red-50 text-red-700 font-black shadow-lg shadow-red-100";
          } else if (submission && i === question.correctAnswer) {
            styles = "border-green-500 bg-green-50/50 text-green-700 font-black";
          }

          return (
            <button
              key={i}
              disabled={!!submission}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 sm:p-6 rounded-[1.5rem] border-2 transition-all active:scale-[0.97] group ${styles}`}
            >
              <div className="flex items-center gap-4">
                <span className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm sm:text-base border-2 transition-all ${selected === i ? 'bg-white border-transparent' : 'bg-white border-slate-100 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm sm:text-base font-bold leading-tight">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {submission && (
        <div className={`mt-8 p-6 sm:p-8 rounded-[1.8rem] border-2 animate-in slide-in-from-top duration-500 ${submission.isCorrect ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${submission.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="font-black uppercase tracking-widest text-[10px] mb-2 opacity-60">Strategic Explanation</h4>
              <p className="text-sm sm:text-base font-bold leading-relaxed">{question.explanation || "Detailed logic is under review."}</p>
              <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                <div className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-lg text-slate-500">
                  Ref: <span className="text-slate-900 font-mono">{submission.noteId}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-lg text-slate-500">
                  Status: <span className={submission.isCorrect ? 'text-green-600' : 'text-red-600'}>{submission.isCorrect ? 'VERIFIED' : 'FAILED'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
