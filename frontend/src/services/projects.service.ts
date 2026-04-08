import api from './api';

export const projectsService = {
  getProjects: (params?: { status?: string; category?: string; featured?: boolean; page?: number; limit?: number }) =>
    api.get('/projects', { params }).then(r => r.data),
  getProjectById: (id: number) =>
    api.get(`/projects/${id}`).then(r => r.data),
};
