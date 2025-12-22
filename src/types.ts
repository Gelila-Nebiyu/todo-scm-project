
export type Priority = 1 | 2 | 3 | 4;

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate: string; // ISO string YYYY-MM-DD
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
