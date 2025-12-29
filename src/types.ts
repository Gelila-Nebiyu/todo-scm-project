export type Priority = 'High' | 'Medium' | 'Low';

export interface Board {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate: string; // ISO string YYYY-MM-DD
  dueTime?: string; // HH:mm format
  priority: Priority;
  boardId: string;
  description?: string;
}

export enum ViewType {
  INBOX = 'inbox',
  TODAY = 'today',
  UPCOMING = 'upcoming',
  BOARD = 'board',
  SEARCH = 'search'
}

export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated'
}