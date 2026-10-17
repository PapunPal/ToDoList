import type { User, TodoList } from '../types';

const API_BASE_URL = 'http://localhost:3000';
const TOKEN_KEY = 'todo_app_jwt_token';
const USER_KEY = 'todo_app_user';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (includeAuth) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = token;
    }
  }

  return headers;
};

export const api = {
  async signup(email: string, password: string, password_confirmation: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        user: { email, password, password_confirmation }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data?.status?.errors?.join(', ') || data?.status?.message || 'Signup failed';
      throw new Error(errorMsg);
    }

    const token = res.headers.get('Authorization') || '';
    if (token) {
      setStoredToken(token);
    }
    if (data?.data) {
      setStoredUser(data.data);
    }

    return { user: data.data, token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        user: { email, password }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data?.status?.message || data?.error || 'Invalid email or password';
      throw new Error(errorMsg);
    }

    const token = res.headers.get('Authorization') || '';
    if (token) {
      setStoredToken(token);
    }
    if (data?.data) {
      setStoredUser(data.data);
    }

    return { user: data.data, token };
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
    } finally {
      clearStoredAuth();
    }
  },

  async getTodos(): Promise<TodoList[]> {
    const res = await fetch(`${API_BASE_URL}/api/v1/todo_lists`, {
      method: 'GET',
      headers: getHeaders(true)
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearStoredAuth();
        throw new Error('Session expired, please login again');
      }
      throw new Error('Failed to fetch todos');
    }

    return res.json();
  },

  async createTodo(title: string, description?: string): Promise<TodoList> {
    const res = await fetch(`${API_BASE_URL}/api/v1/todo_lists`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        todo_list: { title, description: description || null, completed: false }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data?.errors?.join(', ') || 'Failed to create todo';
      throw new Error(errorMsg);
    }

    return data;
  },

  async updateTodo(id: number, updates: Partial<{ title: string; description: string | null; completed: boolean }>): Promise<TodoList> {
    const res = await fetch(`${API_BASE_URL}/api/v1/todo_lists/${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({
        todo_list: updates
      })
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data?.errors?.join(', ') || 'Failed to update todo';
      throw new Error(errorMsg);
    }

    return data;
  },

  async deleteTodo(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/v1/todo_lists/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });

    if (!res.ok) {
      throw new Error('Failed to delete todo');
    }
  }
};
