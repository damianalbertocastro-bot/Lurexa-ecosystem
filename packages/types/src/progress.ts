export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export interface QuizAttempt {
  quizId: string;
  activityId?: string;
  courseId?: string;
  lessonId?: string;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: string;
  activityType?: string;
  attemptNumber?: number;
  firstAttempt?: boolean;
  hintUsed?: boolean;
  competencyIds?: string[];
  answer?: string | string[];
}

export interface StudentProgress {
  id: string;
  studentId: string;
  lessonId: string;
  moduleId: string;
  courseId: string;
  completed: boolean;
  status?: LessonProgressStatus;
  startedAt?: string;
  completedAt?: string;
  timeSpentSeconds: number;
  attempts: QuizAttempt[];
  bestScore?: number;
  lastAccessedAt: string;
  updatedAt?: string;
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
