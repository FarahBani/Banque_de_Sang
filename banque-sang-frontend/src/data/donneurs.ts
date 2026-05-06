export interface DonneurType {
  id: string;
  nom: string;
  groupeSanguin: string;
  donsTotaux: number;
  badge: 'Bronze' | 'Argent' | 'Or' | 'Platine';
  dernierDon: string;
  eligible: boolean;
  telephone: string;
  email: string;
  poids: number;
  derniereTension: string;
}

export const donneursData: DonneurType[] = [
  { id: "DON-001", nom: "Jean Dupont", groupeSanguin: "O+", donsTotaux: 28, badge: "Or", dernierDon: "12 Mars 2026", eligible: true, telephone: "+33 6 12 34 56 78", email: "jean.dupont@email.com", poids: 75, derniereTension: "12/8" },
  { id: "DON-002", nom: "Marie Bernard", groupeSanguin: "A-", donsTotaux: 15, badge: "Argent", dernierDon: "05 Avril 2026", eligible: true, telephone: "+33 6 23 45 67 89", email: "marie.bernard@email.com", poids: 62, derniereTension: "11/7" },
  { id: "DON-003", nom: "Pierre Moreau", groupeSanguin: "B+", donsTotaux: 6, badge: "Bronze", dernierDon: "20 Janvier 2026", eligible: false, telephone: "+33 6 34 56 78 90", email: "pierre.moreau@email.com", poids: 80, derniereTension: "14/9" }
];