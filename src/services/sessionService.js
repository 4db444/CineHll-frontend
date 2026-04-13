import api from './api';

const sessionService = {
  getAll: () => api.get('/sessions'),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  getAvailableSeats: (id) => api.get(`/sessions/${id}/available-seats`),
};

export default sessionService;
