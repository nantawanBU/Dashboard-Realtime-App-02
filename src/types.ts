export interface SurveyQuestion {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  category: string;
  description: string;
  gradientColors: [string, string];
  accentColor: string;
}

export interface SurveyResponse {
  id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  feedback?: string;
  timestamp: string;
  deviceFingerprint?: string;
}

export interface QuestionStats {
  questionId: string;
  title: string;
  category: string;
  average: number;
  interpretation: string;
  distribution: { [score: number]: number };
}

export interface DashboardStats {
  totalCount: number;
  overallAverage: number;
  overallInterpretation: string;
  satisfactionRate: number; // % of ratings >= 4
  questionStats: QuestionStats[];
  scoreBreakdown: { [score: number]: number };
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
