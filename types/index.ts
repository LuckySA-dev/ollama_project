import { Role, BehaviorType, ReportType } from "@prisma/client";

export type { Role, BehaviorType, ReportType };

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  gradeLevel: number;
  teacherId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  behaviorTags?: string[];
}

export interface BehaviorLog {
  id: string;
  behaviorType: BehaviorType;
  intensity: number;
  context?: string;
  loggedAt: Date;
}

export interface WeeklyScore {
  weekStartDate: Date;
  focusScore: number;
  consistencyScore: number;
  motivationScore: number;
  stressLevel: number;
}

export interface Report {
  id: string;
  reportType: ReportType;
  generatedAt: Date;
  content: ReportContent;
  aiRecommendations: string;
}

export interface ReportContent {
  summary: string;
  metrics: {
    totalChatSessions: number;
    averageSessionDuration: number;
    behaviorTrends: BehaviorTrend[];
  };
  highlights: string[];
  concerns: string[];
}

export interface BehaviorTrend {
  behaviorType: BehaviorType;
  averageIntensity: number;
  change: number; // percentage change from previous period
}

export interface DashboardStats {
  totalSessions: number;
  weeklySessions: number;
  weeklyScore: WeeklyScore | null;
  recentBehaviors: BehaviorLog[];
  streakDays: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  studentId?: string;
  teacherId?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}
