
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated'
}
