import api from './api';

const paymentService = {
  pay: (reservationId) => api.post(`/reservations/${reservationId}/pay`),
  downloadTicket: (reservationId) =>
    api.get(`/reservations/${reservationId}/ticket`, { responseType: 'blob' }),
};

export default paymentService;
