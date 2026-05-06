import apiClient from '../config/axios';
import type { Hopital } from '../types/Hopital';

export const hopitalApi = {
  getAll: async (): Promise<Hopital[]> => {
    const response = await apiClient.get('/hopitaux');
    return response.data;
  },
};
