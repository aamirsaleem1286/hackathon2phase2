import axios from 'axios';
import { Task, TaskCreate, TaskUpdate } from '../types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication functions with enhanced error handling
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  } catch (error: any) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Helper function to get error message from response
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.statusText) {
    return `Server Error: ${error.response.statusText}`;
  }
  return error.message || 'An unexpected error occurred';
};

// Task functions with enhanced error handling
export const getTasks = async (): Promise<{ tasks: Task[] }> => {
  try {
    const response = await api.get('/api/tasks');
    return response.data;
  } catch (error: any) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const createTask = async (taskData: TaskCreate): Promise<{ task: Task }> => {
  try {
    const response = await api.post('/api/tasks', taskData);
    return response.data;
  } catch (error: any) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const updateTask = async (id: number, taskData: TaskUpdate): Promise<{ task: Task }> => {
  try {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    return response.data;
  } catch (error: any) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const deleteTask = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error: any) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const toggleTaskComplete = async (id: number): Promise<{ task: Task }> => {
  try {
    const response = await api.patch(`/api/tasks/${id}/toggle-complete`);
    return response.data;
  } catch (error: any) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};