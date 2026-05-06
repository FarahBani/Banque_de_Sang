import apiClient from '../config/axios';
import type { RendezVous, RendezVousCreatePayload } from '../types/RendezVous';

export const rdvApi = {
  getAll: async (): Promise<RendezVous[]> => {
    const response = await apiClient.get<RendezVous[]>('/rendez-vous');
    return response.data;
  },

  getById: async (id: number): Promise<RendezVous> => {
    const response = await apiClient.get<RendezVous>(`/rendez-vous/${id}`);
    return response.data;
  },

  create: async (data: RendezVousCreatePayload): Promise<RendezVous> => {
    const response = await apiClient.post<RendezVous>('/rendez-vous', data);
    return response.data;
  },

  update: async (id: number, data: Partial<RendezVous>): Promise<RendezVous> => {
    const response = await apiClient.put<RendezVous>(`/rendez-vous/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/rendez-vous/${id}`);
  },

  confirmer: async (id: number): Promise<void> => {
    await apiClient.patch(`/rendez-vous/${id}/confirmer`);
  },

  annuler: async (id: number): Promise<void> => {
    await apiClient.patch(`/rendez-vous/${id}/annuler`);
  },
};
