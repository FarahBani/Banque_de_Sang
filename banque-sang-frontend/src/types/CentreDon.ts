export interface CentreDon {
  id: number;
  nom: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  telephone: string | null;
  horaires: string | null;
  actif: boolean;
}
