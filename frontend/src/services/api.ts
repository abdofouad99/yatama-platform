import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// إنشاء instance محوري من axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ========================================
// Interceptor: إضافة التوكن تلقائياً
// ========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('yatama_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================================
// Interceptor: معالجة انتهاء الجلسة
// ========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('yatama_token');
      localStorage.removeItem('yatama_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ========================================
// خدمة المصادقة
// ========================================
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data),

  getMe: () =>
    api.get('/auth/me').then(r => r.data),

  logout: () =>
    api.post('/auth/logout').then(r => r.data),
};

// ========================================
// خدمة المشاريع
// ========================================
export const projectsService = {
  getProjects: (params?: {
    status?: string; category?: string;
    featured?: boolean; page?: number; limit?: number;
  }) => api.get('/projects', { params }).then(r => r.data),

  getProjectById: (id: number) =>
    api.get(`/projects/${id}`).then(r => r.data),

  createProject: (data: any) =>
    api.post('/projects', data).then(r => r.data),

  updateProject: (id: number, data: any) =>
    api.put(`/projects/${id}`, data).then(r => r.data),
};

// ========================================
// خدمة التبرعات
// ========================================
export const donationsService = {
  createDonation: (data: any) =>
    api.post('/donations', data).then(r => r.data),

  getDonations: (params?: any) =>
    api.get('/donations', { params }).then(r => r.data),

  getDonationById: (id: number) =>
    api.get(`/donations/${id}`).then(r => r.data),
};

// ========================================
// خدمة الطلبات الإلكترونية
// ========================================
export const applicationsService = {
  submitApplication: (data: any) =>
    api.post('/applications', data).then(r => r.data),

  getApplications: (params?: any) =>
    api.get('/applications', { params }).then(r => r.data),

  reviewApplication: (id: number, data: { status: string; reviewNotes?: string }) =>
    api.patch(`/applications/${id}/review`, data).then(r => r.data),
};

// ========================================
// خدمة الأيتام والأسر
// ========================================
export const beneficiariesService = {
  getOrphans: (params?: any) =>
    api.get('/orphans', { params }).then(r => r.data),

  getOrphanById: (id: number) =>
    api.get(`/orphans/${id}`).then(r => r.data),

  getFamilies: (params?: any) =>
    api.get('/families', { params }).then(r => r.data),
};
