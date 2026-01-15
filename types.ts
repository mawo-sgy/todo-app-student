export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  STUDY = 'Study',
  REVISION = 'Revision',
  GYM = 'Gym',
  PRAYER = 'Prayer',
  PERSONAL = 'Personal'
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueDate: string; // ISO Date string YYYY-MM-DD
  isCompleted: boolean;
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type ViewFilter = 'today' | 'upcoming' | 'completed';