
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export interface Question {
  id: string;
  text: string;
  category: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  questionId: string;
  answer: number;
  isCorrect: boolean;
  timestamp: Date;
  noteId: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface ActiveCall {
  id: string;
  studentId: string;
  studentName: string;
  startTime: Date;
  status: 'waiting' | 'active';
  initiator: 'student' | 'admin';
}

export interface SupportConfig {
  meetLink: string;
}
