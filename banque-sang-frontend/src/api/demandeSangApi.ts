import axios from '../config/axios'; // Tu as déjà axios configuré

export interface DemandeSang {
  id: number;
  groupeSanguin: string;
  quantiteDemandee: number;
  priorite: 'haute' | 'normale' | 'basse';
  dateDemande: string;
  dateRequise: string;
  statut: 'urgent' | 'pending' | 'approved' | 'delivered';
  description: string;
  medecinHopital?: {
    id: number;
    nom: string;
    hopital?: {
      id: number;
      nom: string;
    };
  };
}

export interface Hopital {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  conventionActive: boolean;
}

// Récupérer les demandes d'un hôpital
export const getDemandesByHopital = async (hopitalId: number): Promise<DemandeSang[]> => {
  const response = await axios.get(`/demandes/hopital/${hopitalId}`);
  return response.data;
};

// Mettre à jour le statut
export const updateDemandeStatut = async (id: number, statut: string): Promise<DemandeSang> => {
  const response = await axios.put(`/demandes/${id}/statut?statut=${statut}`);
  return response.data;
};

// Supprimer une demande
export const deleteDemande = async (id: number): Promise<void> => {
  await axios.delete(`/demandes/${id}`);
};

// Récupérer les infos de l'hôpital
export const getHopital = async (id: number): Promise<Hopital> => {
  const response = await axios.get(`/hopitaux/${id}`);
  return response.data;
};