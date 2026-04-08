import api from './api';

export const donationsService = {
  createDonation: (data: any) =>
    api.post('/donations', data).then(r => r.data),
  getDonations: (params?: any) =>
    api.get('/donations', { params }).then(r => r.data),
};
