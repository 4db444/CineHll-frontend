import api from './api';

const reservationService = {
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.put(`/reservations/${id}`),
  delete: (id) => api.delete(`/reservations/${id}`),
};

export default reservationService;
