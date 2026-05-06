import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DonorDashboardNew.module.css';
import { useAuth } from '../../context/AuthContext';
import { donneurApi } from '../../api/donneurApi';
import { formatGroupe } from '../../utils/groupeSanguin';
import type { Donneur, DonLite, RendezVousLite } from '../../types/Donneur';

type TabKey = 'overview' | 'history' | 'profile';

interface BadgeDef {
  id: number;
  name: string;
  icon: string;
  criterion: string;
  threshold: number;
}

const BADGES: BadgeDef[] = [
  { id: 1, name: 'Premier Don', icon: '🎖️', criterion: 'Au moins 1 don', threshold: 1 },
  { id: 2, name: 'Donneur Régulier', icon: '⭐', criterion: '3 dons effectués', threshold: 3 },
  { id: 3, name: 'Héros du Sang', icon: '🏅', criterion: '5 dons effectués', threshold: 5 },
  { id: 4, name: 'Sauveur de Vies', icon: '🏆', criterion: '10 dons effectués', threshold: 10 },
];

const isDonComplet = (d: DonLite) =>
  d.statut === 'VALIDE' || d.statut === 'EFFECTUE';

const DAYS_BETWEEN_DONS = 56;

export default function DonorDashboardNew() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [donneur, setDonneur] = useState<Donneur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await donneurApi.getById(Number(user.id));
        if (!cancelled) setDonneur(data);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Impossible de charger les informations.';
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const donsCompletes = useMemo<DonLite[]>(() => {
    if (!donneur?.dons) return [];
    return [...donneur.dons]
      .filter(isDonComplet)
      .sort((a, b) => new Date(b.dateDon).getTime() - new Date(a.dateDon).getTime());
  }, [donneur]);

  const totalQuantity = useMemo(
    () => donsCompletes.reduce((sum, d) => sum + (d.quantite ?? 0), 0),
    [donsCompletes]
  );

  const livesHelped = donsCompletes.length * 3;
  const lastDonDate = donsCompletes[0]?.dateDon ?? null;

  const nextEligibleDate = useMemo(() => {
    if (!lastDonDate) return null;
    const d = new Date(lastDonDate);
    d.setDate(d.getDate() + DAYS_BETWEEN_DONS);
    return d;
  }, [lastDonDate]);

  const canDonate = useMemo(() => {
    if (donneur && donneur.eligible === false) return false;
    if (!nextEligibleDate) return true;
    return nextEligibleDate.getTime() <= Date.now();
  }, [donneur, nextEligibleDate]);

  const unlockedBadges = useMemo(
    () => BADGES.filter((b) => donsCompletes.length >= b.threshold),
    [donsCompletes.length]
  );

  const nextBadge = useMemo(
    () => BADGES.find((b) => donsCompletes.length < b.threshold) ?? null,
    [donsCompletes.length]
  );

  const upcomingRdv = useMemo<RendezVousLite[]>(() => {
    if (!donneur?.rendezVous) return [];
    const now = Date.now();
    return donneur.rendezVous
      .filter(
        (r) =>
          r.statut === 'CONFIRME' ||
          r.statut === 'EN_ATTENTE' ||
          new Date(r.dateHeure).getTime() > now
      )
      .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
  }, [donneur]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>Vous devez être connecté pour accéder à votre espace donneur.</p>
          <Link to="/auth/login" className={styles.ctaLink}>Se connecter</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>Chargement de votre tableau de bord…</p>
        </div>
      </div>
    );
  }

  if (error || !donneur) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>❌ {error ?? 'Donneur introuvable.'}</p>
          <button onClick={handleLogout} className={styles.ctaLink}>
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${donneur.prenom} ${donneur.nom}`;
  const initials = `${donneur.prenom?.charAt(0) ?? ''}${donneur.nom?.charAt(0) ?? ''}`;
  const bloodType = formatGroupe(donneur.groupeSanguin);
  const joinDate = donneur.dateInscription;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Bonjour, {donneur.prenom} 👋</h1>
          <p className={styles.subtitle}>Votre tableau de bord donneur</p>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.bloodType}>{bloodType}</span>
          <button onClick={handleLogout} className={styles.btnLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historique
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil
        </button>
      </nav>

      <main className={styles.main}>
        {activeTab === 'overview' && (
          <div className={styles.tabContent}>
            {!canDonate && nextEligibleDate && (
              <div className={styles.eligibilityBanner}>
                <h3>⏳ Vous pourrez redonner à partir du :</h3>
                <p>
                  {nextEligibleDate.toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            )}

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💉</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Dons Effectués</p>
                  <p className={styles.statValue}>{donsCompletes.length}</p>
                  <p className={styles.statDetail}>soit {totalQuantity} ml</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>❤️</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Vies Aidées</p>
                  <p className={styles.statValue}>{livesHelped}</p>
                  <p className={styles.statDetail}>personnes sauvées</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Dernier Don</p>
                  <p className={styles.statValue}>
                    {lastDonDate
                      ? new Date(lastDonDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
                      : 'Aucun'}
                  </p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎖️</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Badges</p>
                  <p className={styles.statValue}>{unlockedBadges.length}</p>
                </div>
              </div>
            </div>

            {upcomingRdv.length > 0 && (
              <section className={styles.actionsSection}>
                <h2 className={styles.sectionTitle}>Prochains Rendez-vous 📅</h2>
                <ul>
                  {upcomingRdv.slice(0, 3).map((rdv) => (
                    <li key={rdv.id}>
                      {new Date(rdv.dateHeure).toLocaleString('fr-FR', {
                        dateStyle: 'long', timeStyle: 'short',
                      })}{' '}
                      — <strong>{rdv.statut}</strong>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className={styles.badgesSection}>
              <h2 className={styles.sectionTitle}>Mes Badges 🏆</h2>
              {unlockedBadges.length > 0 ? (
                <div className={styles.badgesGrid}>
                  {unlockedBadges.map((badge) => (
                    <div key={badge.id} className={styles.badgeCard}>
                      <div className={styles.badgeIcon}>{badge.icon}</div>
                      <p className={styles.badgeName}>{badge.name}</p>
                      <p className={styles.badgeDetail}>{badge.criterion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun badge débloqué. Faites votre premier don !</p>
              )}
              {nextBadge && (
                <div className={styles.nextBadgeInfo}>
                  <p>🎯 Prochain badge : <strong>{nextBadge.name}</strong></p>
                  <p>Dons restants : <strong>{nextBadge.threshold - donsCompletes.length}</strong></p>
                </div>
              )}
            </section>

            <section className={styles.actionsSection}>
              <h2 className={styles.sectionTitle}>Actions Rapides</h2>
              <div className={styles.actionsGrid}>
                <Link
                  to="/appointment/new"
                  className={styles.actionBtn}
                  style={!canDonate ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                  📅 Prendre un Rendez-vous
                </Link>
                <Link to="/centers" className={styles.actionBtn}>
                  🏥 Trouver un Centre
                </Link>
                <Link to="/donate" className={styles.actionBtn}>
                  📋 Vérifier mon Éligibilité
                </Link>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Historique de vos Dons</h2>
            {donsCompletes.length > 0 ? (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Lieu</th>
                      <th>Type Sanguin</th>
                      <th>Quantité</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donsCompletes.map((don) => (
                      <tr key={don.id}>
                        <td><strong>{new Date(don.dateDon).toLocaleDateString('fr-FR')}</strong></td>
                        <td>{don.lieu ?? '—'}</td>
                        <td><span className={styles.bloodTypeMini}>{bloodType}</span></td>
                        <td>{don.quantite} ml</td>
                        <td>{don.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.noData}>
                <p>Aucun don enregistré.</p>
                <Link to="/appointment/new" className={styles.ctaLink}>
                  Prendre votre premier rendez-vous
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Mon Profil</h2>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>{initials.toUpperCase()}</div>
                <div className={styles.profileInfo}>
                  <h3>{fullName}</h3>
                  <p>{donneur.adresse ?? '—'}</p>
                </div>
              </div>

              <div className={styles.profileContent}>
                <div className={styles.profileGroup}>
                  <h4>Informations Personnelles</h4>
                  <div className={styles.profileField}>
                    <label>Email :</label><p>{donneur.email}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Téléphone :</label><p>{donneur.telephone ?? '—'}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Adresse :</label><p>{donneur.adresse ?? '—'}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Date de naissance :</label>
                    <p>{donneur.dateNaissance ? new Date(donneur.dateNaissance).toLocaleDateString('fr-FR') : '—'}</p>
                  </div>
                </div>

                <div className={styles.profileGroup}>
                  <h4>Informations Médicales</h4>
                  <div className={styles.profileField}>
                    <label>Groupe Sanguin :</label>
                    <p className={styles.bloodTypeProfile}>{bloodType}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Poids :</label><p>{donneur.poids ? `${donneur.poids} kg` : '—'}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Éligibilité :</label>
                    <p>{donneur.eligible ? '✅ Éligible' : '❌ Non éligible'}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Date d'Adhésion :</label>
                    <p>{joinDate ? new Date(joinDate).toLocaleDateString('fr-FR') : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
