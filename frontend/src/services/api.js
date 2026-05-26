import axios from 'axios';

// Create axios instance with base URL from env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 responses globally (token expired, etc.)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== Auth API ==========
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ========== Workouts API ==========
export const getWorkouts = () => API.get('/workouts');
export const addWorkout = (data) => API.post('/workouts', data);
export const updateWorkout = (id, data) => API.put(`/workouts/${id}`, data);
export const deleteWorkout = (id) => API.delete(`/workouts/${id}`);
export const getWorkoutStats = () => API.get('/workouts/stats');

// ========== Goals API ==========
export const getGoals = () => API.get('/goals');
export const addGoal = (data) => API.post('/goals', data);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

export default API;
