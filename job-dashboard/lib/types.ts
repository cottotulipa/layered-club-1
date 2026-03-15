export type Stage =
  | 'wishlist'
  | 'applied'
  | 'document_screening'
  | 'interview_1'
  | 'interview_2'
  | 'final'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export const STAGE_LABELS: Record<Stage, string> = {
  wishlist: '관심',
  applied: '지원 완료',
  document_screening: '서류 심사',
  interview_1: '1차 면접',
  interview_2: '2차 면접',
  final: '최종 면접',
  offer: '합격',
  rejected: '불합격',
  withdrawn: '포기',
};

export const STAGE_COLORS: Record<Stage, string> = {
  wishlist: '#6b7280',
  applied: '#3b82f6',
  document_screening: '#8b5cf6',
  interview_1: '#f59e0b',
  interview_2: '#f97316',
  final: '#ec4899',
  offer: '#10b981',
  rejected: '#ef4444',
  withdrawn: '#9ca3af',
};

export interface Job {
  id: string;
  company: string;
  position: string;
  department?: string;
  stage: Stage;
  appliedDate?: string;
  deadline?: string;
  nextEventDate?: string;
  nextEventNote?: string;
  salary?: string;
  location?: string;
  jobUrl?: string;
  coverLetter?: string;
  notes?: string;
  tags?: string[];
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  jobId: string;
  company: string;
  position: string;
  date: string;
  type: 'deadline' | 'interview' | 'result' | 'other';
  note?: string;
}
