export interface QuizAttempt {
  quizId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: string;
  activityType?: string;
  attemptNumber?: number;
  firstAttempt?: boolean;
  hintUsed?: boolean;
  competencyIds?: string[];
}

export interface StudentProgress {
  id: string;
  studentId: string;
  lessonId: string;
  moduleId: string;
  courseId: string;
  completed: boolean;
  timeSpentSeconds: number;
  attempts: QuizAttempt[];
  bestScore?: number;
  lastAccessedAt: string;
}

export interface GamificationRecord {
  studentId: string;
  orgId: string;
  streakDays: number;
  totalPoints: number;
  badges: Array<{
    id: string;
    earnedAt: string;
  }>;
  lastActivityAt: string;
}
