import apiClient from '../config/axios';
import type { Don, DonCreatePayload } from '../types/Don';

export const donApi = {
  getAll: async (): Promise<Don[]> => {
    const response = await apiClient.get<Don[]>('/dons');
    return response.data;
  },
  getById: async (id: number): Promise<Don> => {
    const response = await apiClient.get<Don>(`/dons/${id}`);
    return response.data;
  },
  create: async (data: DonCreatePayload): Promise<Don> => {
    const response = await apiClient.post<Don>('/dons', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Don>): Promise<Don> => {
    const response = await apiClient.put<Don>(`/dons/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/dons/${id}`);
  },
  valider: async (id: number): Promise<void> => {
    await apiClient.patch(`/dons/${id}/valider`);
  },
  exclure: async (id: number, motif: string): Promise<void> => {
    await apiClient.patch(`/dons/${id}/exclure`, null, { params: { motif } });
  },
};