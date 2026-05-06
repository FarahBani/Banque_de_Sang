export interface Demande {
  id: number;
  patient: string;
  bloodType: string;
  quantity: number;
  hospital: string;
  status: 'EN_ATTENTE' | 'VALIDEE' | 'URGENTE' | 'LIVREE';
  date: string;
}
