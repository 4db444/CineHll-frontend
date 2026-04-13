import api from './api';

const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/users'),
  banUser: (id) => api.put(`/users/ban/${id}`),
  unbanUser: (id) => api.put(`/users/unban/${id}`),
};

export default adminService;
