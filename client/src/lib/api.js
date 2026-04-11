import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public endpoints
export const getAgents = (params) => api.get('/api/agents', { params });
export const getAgent = (slug) => api.get(`/api/agents/${slug}`);
export const likeAgent = (slug) => api.post(`/api/agents/${slug}/like`);
export const submitReview = (slug, data) => api.post(`/api/agents/${slug}/reviews`, data);

// Auth endpoints
export const login = (data) => api.post('/api/auth/login', data);
export const getMe = () => api.get('/api/auth/me');

// Admin endpoints
export const adminGetAgents = () => api.get('/api/admin/agents');
export const adminCreateAgent = (formData) =>
  api.post('/api/admin/agents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateAgent = (id, formData) =>
  api.put(`/api/admin/agents/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteAgent = (id) => api.delete(`/api/admin/agents/${id}`);
export const adminUpdateStatus = (id, status) => api.patch(`/api/admin/agents/${id}/status`, { status });

export const adminGetReviews = (params) => api.get('/api/admin/reviews', { params });
export const adminDeleteReview = (id) => api.delete(`/api/admin/reviews/${id}`);

export default api;
