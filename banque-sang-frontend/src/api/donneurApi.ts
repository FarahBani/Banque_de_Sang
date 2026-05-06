import apiClient from '../config/axios';
import type { Donneur, DonneurCreatePayload } from '../types/Donneur';

export const donneurApi = {
  getAll: async (): Promise<Donneur[]> => {
    const response = await apiClient.get<Donneur[]>('/donneurs');
    return response.data;
  },
  getById: async (id: number): Promise<Donneur> => {
    const response = await apiClient.get<Donneur>(`/donneurs/${id}`);
    return response.data;
  },
  create: async (data: DonneurCreatePayload): Promise<Donneur> => {
    const response = await apiClient.post<Donneur>('/donneurs', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Donneur>): Promise<Donneur> => {
    const response = await apiClient.put<Donneur>(`/donneurs/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/donneurs/${id}`);
  },
};