
import React, { useState, useEffect } from 'react';
import { UserRole, User, Question, ActiveCall, Submission, SupportConfig } from './types';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import StudentPortal from './components/Student/StudentPortal';
import Navbar from './components/Layout/Navbar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [supportConfig, setSupportConfig] = useState<SupportConfig>({
    meetLink: 'https://meet.google.com/new'
  });

  // Load persistent data
  useEffect(() => {
    const savedQuestions = localStorage.getItem('aptimaster_questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      const initialQuestions: Question[] = [
        {
          id: '1',
          text: 'If 5 workers can build a wall in 12 days, how many workers are needed to build the same wall in 4 days?',
          category: 'Quantitative',
          options: ['10', '15', '20', '25'],
          correctAnswer: 1,
          explanation: 'Work = Workers x Days. 5 * 12 = 60. To do it in 4 days: 60 / 4 = 15.',
          difficulty: 'Easy'
        },
        {
          id: '2',
          text: 'Find the odd one out: 27, 64, 125, 144, 216',
          category: 'Logical Reasoning',
          options: ['27', '64', '144', '216'],
          correctAnswer: 2,
          explanation: 'All others are perfect cubes (3^3, 4^3, 5^3, 6^3). 144 is 12^2.',
          difficulty: 'Medium'
        }
      ];
      setQuestions(initialQuestions);
    }

    const savedSubmissions = localStorage.getItem('aptimaster_submissions');
    if (savedSubmissions) {
      const parsed = JSON.parse(savedSubmissions).map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp)
      }));
      setAllSubmissions(parsed);
    }

    const savedConfig = localStorage.getItem('aptimaster_config');
    if (savedConfig) {
      setSupportConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aptimaster_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('aptimaster_submissions', JSON.stringify(allSubmissions));
  }, [allSubmissions]);

  useEffect(() => {
    localStorage.setItem('aptimaster_config', JSON.stringify(supportConfig));
  }, [supportConfig]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addQuestion = (q: Question) => {
    setQuestions([...questions, q]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAddSubmission = (sub: Submission) => {
    setAllSubmissions(prev => [sub, ...prev]);
  };

  const initiateCall = (user: User, initiator: 'student' | 'admin' = 'student') => {
    // Prevent duplicate calls for the same student
    if (activeCalls.some(c => c.studentId === user.id)) return activeCalls.find(c => c.studentId === user.id)!.id;

    const newCall: ActiveCall = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      startTime: new Date(),
      status: 'waiting',
      initiator: initiator
    };
    setActiveCalls(prev => [...prev, newCall]);
    return newCall.id;
  };

  const endCall = (callId: string) => {
    setActiveCalls(prev => prev.filter(c => c.id !== callId));
  };

  const joinCall = (callId: string) => {
    setActiveCalls(prev => prev.map(c => c.id === callId ? { ...c, status: 'active' as const } : c));
  };

  const updateSupportConfig = (config: SupportConfig) => {
    setSupportConfig(config);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentUser.role === UserRole.ADMIN ? (
          <AdminDashboard 
            questions={questions} 
            onAddQuestion={addQuestion} 
            onDeleteQuestion={deleteQuestion}
            activeCalls={activeCalls}
            onJoinCall={joinCall}
            onEndCall={endCall}
            onInitiateCall={(target) => initiateCall(target, 'admin')}
            allSubmissions={allSubmissions}
            supportConfig={supportConfig}
            onUpdateConfig={updateSupportConfig}
          />
        ) : (
          <StudentPortal 
            questions={questions} 
            user={currentUser} 
            onInitiateCall={() => initiateCall(currentUser, 'student')}
            onEndCall={endCall}
            onJoinCall={joinCall}
            activeCalls={activeCalls}
            studentSubmissions={allSubmissions.filter(s => s.studentId === currentUser.id)}
            onAddSubmission={handleAddSubmission}
            supportConfig={supportConfig}
          />
        )}
      </main>
      <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
        &copy; 2024 AptiMaster Platform. Bidirectional Admin Support Active.
      </footer>
    </div>
  );
};

export default App;
