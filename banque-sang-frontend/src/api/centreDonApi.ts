import apiClient from '../config/axios';
import type { CentreDon } from '../types/CentreDon';

export const centreDonApi = {
  getAll: async (): Promise<CentreDon[]> => {
    const response = await apiClient.get('/centres-don');
    return response.data;
  },
};
