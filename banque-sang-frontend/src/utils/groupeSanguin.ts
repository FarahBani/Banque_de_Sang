import type { GroupeSanguin } from '../types/Donneur';

export const formatGroupe = (g: GroupeSanguin | null | undefined): string => {
  if (!g) return '—';
  const map: Record<GroupeSanguin, string> = {
    A_PLUS: 'A+', A_MOINS: 'A-',
    B_PLUS: 'B+', B_MOINS: 'B-',
    AB_PLUS: 'AB+', AB_MOINS: 'AB-',
    O_PLUS: 'O+', O_MOINS: 'O-',
  };
  return map[g];
};

export const parseGroupe = (s: string): GroupeSanguin | null => {
  const map: Record<string, GroupeSanguin> = {
    'A+': 'A_PLUS', 'A-': 'A_MOINS',
    'B+': 'B_PLUS', 'B-': 'B_MOINS',
    'AB+': 'AB_PLUS', 'AB-': 'AB_MOINS',
    'O+': 'O_PLUS', 'O-': 'O_MOINS',
  };
  return map[s.trim().toUpperCase()] ?? null;
};