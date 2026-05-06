
import apiClient from '../config/axios';
import type { Stock } from '../types/Stock';
import type { GroupeSanguin } from '../types/Donneur';

export const stockApi = {
  getAll: async (): Promise<Stock[]> => {
    const response = await apiClient.get<Stock[]>('/stocks');
    return response.data;
  },
  getById: async (id: number): Promise<Stock> => {
    const response = await apiClient.get<Stock>(`/stocks/${id}`);
    return response.data;
  },
  getByGroupe: async (groupe: GroupeSanguin): Promise<Stock> => {
    const response = await apiClient.get<Stock>(`/stocks/groupe/${groupe}`);
    return response.data;
  },
  create: async (stock: Omit<Stock, 'id'>): Promise<Stock> => {
    const response = await apiClient.post<Stock>('/stocks', stock);
    return response.data;
  },
  update: async (id: number, stock: Partial<Stock>): Promise<Stock> => {
    const response = await apiClient.put<Stock>(`/stocks/${id}`, stock);
    return response.data;
  },
  ajusterQuantite: async (id: number, delta: number): Promise<Stock> => {
    const response = await apiClient.patch<Stock>(`/stocks/${id}/ajuster`, null, {
      params: { delta },
    });
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/stocks/${id}`);
  },
};