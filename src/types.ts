
export type Priority = 'High' | 'Medium' | 'Low';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate: string; // ISO string YYYY-MM-DD
  dueTime?: string; // HH:mm format
  priority: Priority;
  description?: string;
}

export enum ViewType {
  INBOX = 'inbox',
  TODAY = 'today',
  UPCOMING = 'upcoming'
}

export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated'
}