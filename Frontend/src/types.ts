export interface User {
  id: number;
  email: string;
}

export interface TodoList {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: {
    code: number;
    message: string;
    errors?: string[];
  };
  data?: User;
}
