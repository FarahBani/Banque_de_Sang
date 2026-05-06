import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import { useAuth } from '../../context/AuthContext';
import { donneurApi } from '../../api/donneurApi';
import { donApi } from '../../api/donApi';
import { stockApi } from '../../api/stockApi';
import { rdvApi } from '../../api/rdvApi';
import { formatGroupe } from '../../utils/groupeSanguin';
import type { Donneur } from '../../types/Donneur';
import type { Don } from '../../types/Don';
import type { Stock } from '../../types/Stock';
import type { RendezVous } from '../../types/RendezVous';
import { calculerNiveau } from '../../types/Stock';
import apiClient from '../../config/axios';

type TabKey = 'overview' | 'users' | 'stats' | 'logs';

// Une "ligne utilisateur" unifiée pour le tableau de la section Utilisateurs.
// On agrège donneurs (et plus tard agents/médecins/admins) dans une même structure.
interface UserRow {
  id: number;
  source: 'donneur' | 'agent' | 'medecin' | 'admin';
  name: string;
  email: string;
  role: string;
  status: 'Actif' | 'Inactif';
  joinDate: string | null;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabKey>('overview');

  const [donneurs, setDonneurs] = useState<Donneur[]>([]);
  const [dons, setDons] = useState<Don[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [medecins, setMedecins] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // On charge tout en parallèle. Si /agents et /medecins échouent
      // (anciens backends), on continue quand même avec ce qu'on a.
      const safe = async <T,>(p: Promise<T>, fallback: T): Promise<T> => {
        try {
          return await p;
        } catch {
          return fallback;
        }
      };

      const [donneursData, donsData, stocksData, rdvsData, agentsData, medecinsData, adminsData] =
        await Promise.all([
          donneurApi.getAll(),
          donApi.getAll(),
          stockApi.getAll(),
          rdvApi.getAll(),
          safe<any[]>(apiClient.get('/agents').then((r) => r.data), []),
          safe<any[]>(apiClient.get('/medecins').then((r) => r.data), []),
          safe<any[]>(apiClient.get('/admins').then((r) => r.data), []),
        ]);

      setDonneurs(donneursData);
      setDons(donsData);
      setStocks(stocksData);
      setRdvs(rdvsData);
      setAgents(agentsData);
      setMedecins(medecinsData);
      setAdmins(adminsData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  // ============ STATS DÉRIVÉES ============
  const totalDons = dons.length;
  const donneursActifs = useMemo(() => donneurs.filter((d) => d.actif).length, [donneurs]);
  const demandesEnAttente = useMemo(
    () => rdvs.filter((r) => r.statut === 'EN_ATTENTE').length,
    [rdvs]
  );
  const stocksCritiques = useMemo(
    () => stocks.filter((s) => calculerNiveau(s) === 'CRITIQUE').length,
    [stocks]
  );

  const tauxEffectivite = useMemo(() => {
    if (dons.length === 0) return 100;
    const valides = dons.filter((d) => d.statut === 'VALIDE' || d.statut === 'EFFECTUE').length;
    return Math.round((valides / dons.length) * 100);
  }, [dons]);

  const rdvConfirmes = useMemo(
    () => rdvs.filter((r) => r.statut === 'CONFIRME' || r.statut === 'EFFECTUE').length,
    [rdvs]
  );

  const stockGlobalPct = useMemo(() => {
    if (stocks.length === 0) return 0;
    const ok = stocks.filter((s) => calculerNiveau(s) === 'OK').length;
    return Math.round((ok / stocks.length) * 100);
  }, [stocks]);

  // Liste unifiée des utilisateurs
  const userRows: UserRow[] = useMemo(() => {
    const rows: UserRow[] = [];

    donneurs.forEach((d) => {
      rows.push({
        id: d.id,
        source: 'donneur',
        name: `${d.prenom} ${d.nom}`,
        email: d.email,
        role: 'Donneur',
        status: d.actif ? 'Actif' : 'Inactif',
        joinDate: d.dateInscription,
      });
    });

    agents.forEach((a) => {
      rows.push({
        id: a.id,
        source: 'agent',
        name: `${a.prenom} ${a.nom}`,
        email: a.email,
        role: 'Agent',
        status: a.actif ? 'Actif' : 'Inactif',
        joinDate: a.dateInscription ?? null,
      });
    });

    medecins.forEach((m) => {
      rows.push({
        id: m.id,
        source: 'medecin',
        name: `${m.prenom} ${m.nom}`,
        email: m.email,
        role: 'Médecin',
        status: m.actif ? 'Actif' : 'Inactif',
        joinDate: m.dateInscription ?? null,
      });
    });

    admins.forEach((ad) => {
      rows.push({
        id: ad.id,
        source: 'admin',
        name: `${ad.prenom} ${ad.nom}`,
        email: ad.email,
        role: 'Administrateur',
        status: ad.actif ? 'Actif' : 'Inactif',
        joinDate: ad.dateInscription ?? null,
      });
    });

    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }, [donneurs, agents, medecins, admins]);

  // Toggle Actif/Inactif (uniquement pour donneurs pour l'instant — endpoint disponible)
  const toggleUserStatus = async (row: UserRow) => {
    if (row.source !== 'donneur') {
      alert('Toggle non encore implémenté pour ce rôle.');
      return;
    }
    const target = donneurs.find((d) => d.id === row.id);
    if (!target) return;
    try {
      await donneurApi.update(row.id, { actif: !target.actif });
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // ============ ÉTATS ============
  if (!user) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>👑 Dashboard Administrateur</h1>
        </header>
        <div className={styles.content}>
          <p>
            Vous devez être connecté.{' '}
            <Link to="/auth/login">Se connecter</Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>👑 Dashboard Administrateur</h1>
        </header>
        <div className={styles.content}>
          <p>Chargement…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>👑 Dashboard Administrateur</h1>
        </header>
        <div className={styles.content}>
          <p>❌ {error}</p>
          <button onClick={fetchData}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>👑 Dashboard Administrateur</h1>
        <p className={styles.subtitle}>Supervision générale du système — {user.fullName}</p>
        <button onClick={handleLogout} style={{ position: 'absolute', top: 16, right: 16 }}>
          Déconnexion
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'overview' ? styles.active : ''}`}
            onClick={() => setTab('overview')}
          >
            📊 Vue d'ensemble
          </button>
          <button
            className={`${styles.tab} ${tab === 'users' ? styles.active : ''}`}
            onClick={() => setTab('users')}
          >
            👥 Utilisateurs ({userRows.length})
          </button>
          <button
            className={`${styles.tab} ${tab === 'stats' ? styles.active : ''}`}
            onClick={() => setTab('stats')}
          >
            📈 Statistiques
          </button>
          <button
            className={`${styles.tab} ${tab === 'logs' ? styles.active : ''}`}
            onClick={() => setTab('logs')}
          >
            📋 Logs
          </button>
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className={styles.gridCards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>💉</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Total Dons</div>
                <div className={styles.cardValue}>{totalDons.toLocaleString('fr-FR')}</div>
                <div className={styles.cardChange}>{tauxEffectivite}% effectifs</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>👥</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Donneurs Actifs</div>
                <div className={styles.cardValue}>
                  {donneursActifs.toLocaleString('fr-FR')}
                </div>
                <div className={styles.cardChange}>sur {donneurs.length} inscrits</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>🏥</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>RDV en Attente</div>
                <div className={styles.cardValue}>{demandesEnAttente}</div>
                <div className={styles.cardChange}>à confirmer</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>📦</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Stock Critique</div>
                <div
                  className={styles.cardValue}
                  style={{ color: stocksCritiques > 0 ? '#dc2626' : undefined }}
                >
                  {stocksCritiques}
                </div>
                <div className={styles.cardChange}>groupes sanguins</div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Gestion des Utilisateurs</h2>
            {userRows.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Date d'adhésion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userRows.map((row) => (
                    <tr key={`${row.source}-${row.id}`}>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.role}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[row.status.toLowerCase()] ?? ''
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td>
                        {row.joinDate
                          ? new Date(row.joinDate).toLocaleDateString('fr-FR')
                          : '—'}
                      </td>
                      <td>
                        <button
                          className={styles.btnToggle}
                          onClick={() => toggleUserStatus(row)}
                        >
                          {row.status === 'Actif' ? '🔒 Désactiver' : '🔓 Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun utilisateur enregistré.</p>
            )}
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Statistiques Détaillées</h2>
            <div className={styles.statsContent}>
              <div className={styles.statItem}>
                <span>Total Dons</span>
                <span className={styles.statValue}>📊 {totalDons}</span>
              </div>
              <div className={styles.statItem}>
                <span>Taux d'Effectivité</span>
                <span className={styles.statValue}>✅ {tauxEffectivite}%</span>
              </div>
              <div className={styles.statItem}>
                <span>Rendez-vous Confirmés / Effectués</span>
                <span className={styles.statValue}>📅 {rdvConfirmes}</span>
              </div>
              <div className={styles.statItem}>
                <span>Stock Global (groupes OK)</span>
                <span className={styles.statValue}>📦 {stockGlobalPct}%</span>
              </div>
            </div>

            <h3 style={{ marginTop: '1.5rem' }}>Répartition par groupe sanguin</h3>
            <div className={styles.statsContent}>
              {stocks.map((s) => (
                <div key={s.id} className={styles.statItem}>
                  <span>{formatGroupe(s.groupeSanguin)}</span>
                  <span className={styles.statValue}>{s.quantiteDisponible} unités</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOGS — résumé d'événements récents (dérivés des données) */}
        {tab === 'logs' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Activité Récente</h2>
            <div className={styles.logsList}>
              {/* Derniers dons */}
              {dons.slice(-5).reverse().map((d) => (
                <div key={`don-${d.id}`} className={styles.logItem}>
                  <div className={styles.logTime}>
                    {new Date(d.dateDon).toLocaleString('fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </div>
                  <div className={styles.logContent}>
                    Don #{d.id} — {d.quantite} ml — statut {d.statut}
                  </div>
                  <span className={styles.logBadge}>
                    {d.statut === 'VALIDE' || d.statut === 'EFFECTUE' ? 'success' : 'info'}
                  </span>
                </div>
              ))}

              {/* Stocks critiques */}
              {stocks
                .filter((s) => calculerNiveau(s) === 'CRITIQUE')
                .map((s) => (
                  <div key={`stk-${s.id}`} className={styles.logItem}>
                    <div className={styles.logTime}>—</div>
                    <div className={styles.logContent}>
                      Stock critique : {formatGroupe(s.groupeSanguin)} (
                      {s.quantiteDisponible} unités)
                    </div>
                    <span className={styles.logBadge}>warning</span>
                  </div>
                ))}

              {/* Derniers donneurs inscrits */}
              {donneurs
                .slice()
                .sort((a, b) => {
                  const da = a.dateInscription ? new Date(a.dateInscription).getTime() : 0;
                  const db = b.dateInscription ? new Date(b.dateInscription).getTime() : 0;
                  return db - da;
                })
                .slice(0, 5)
                .map((d) => (
                  <div key={`donneur-${d.id}`} className={styles.logItem}>
                    <div className={styles.logTime}>
                      {d.dateInscription
                        ? new Date(d.dateInscription).toLocaleDateString('fr-FR')
                        : '—'}
                    </div>
                    <div className={styles.logContent}>
                      Donneur inscrit : {d.prenom} {d.nom}
                    </div>
                    <span className={styles.logBadge}>info</span>
                  </div>
                ))}

              {dons.length === 0 && donneurs.length === 0 && stocks.length === 0 && (
                <p>Aucune activité enregistrée.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

