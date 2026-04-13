import api from './api';

const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/profile', data),
};

export default authService;
