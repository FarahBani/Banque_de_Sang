import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AgentDashboardNew.module.css';
import { useAuth } from '../../context/AuthContext';
import { rdvApi } from '../../api/rdvApi';
import { donApi } from '../../api/donApi';
import { stockApi } from '../../api/stockApi';
import { donneurApi } from '../../api/donneurApi';
import { formatGroupe } from '../../utils/groupeSanguin';
import type { RendezVous, StatutRDV } from '../../types/RendezVous';
import type { Don } from '../../types/Don';
import type { Stock } from '../../types/Stock';
import type { Donneur } from '../../types/Donneur';
import { calculerNiveau } from '../../types/Stock';

type TabKey = 'overview' | 'appointments' | 'collections' | 'stocks';

export default function AgentDashboardNew() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [appointmentFilter, setAppointmentFilter] = useState<string>('');
  const [donationFilter, setDonationFilter] = useState<string>('');

  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [dons, setDons] = useState<Don[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [donneursById, setDonneursById] = useState<Record<number, Donneur>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [rdvsData, donsData, stocksData, donneursData] = await Promise.all([
        rdvApi.getAll(),
        donApi.getAll(),
        stockApi.getAll(),
        donneurApi.getAll(),
      ]);

      const map: Record<number, Donneur> = {};
      donneursData.forEach((d) => {
        map[d.id] = d;
      });

      setRdvs(rdvsData);
      setDons(donsData);
      setStocks(stocksData);
      setDonneursById(map);
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

  // ============ DÉRIVÉS ============
  const getDonneur = (rdvOrDon: { donneur?: { id: number } | null }): Donneur | null => {
    const id = rdvOrDon.donneur?.id;
    if (!id) return null;
    return donneursById[id] ?? null;
  };

  const filteredRdvs = useMemo(() => {
    if (!appointmentFilter) return rdvs;
    return rdvs.filter((r) => r.statut === appointmentFilter);
  }, [rdvs, appointmentFilter]);

  const filteredDons = useMemo(() => {
    if (!donationFilter) return dons;
    return dons.filter((d) => d.statut === donationFilter);
  }, [dons, donationFilter]);

  const isToday = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const todayRdvs = useMemo(() => rdvs.filter((r) => isToday(r.dateHeure)), [rdvs]);

  const completedToday = useMemo(
    () => todayRdvs.filter((r) => r.statut === 'EFFECTUE').length,
    [todayRdvs]
  );

  const validDonsCount = useMemo(
    () => dons.filter((d) => d.statut === 'VALIDE' || d.statut === 'EFFECTUE').length,
    [dons]
  );

  const successRate = useMemo(() => {
    if (dons.length === 0) return 100;
    return Math.round((validDonsCount / dons.length) * 100);
  }, [dons.length, validDonsCount]);

  const stocksCritiques = useMemo(
    () => stocks.filter((s) => calculerNiveau(s) === 'CRITIQUE').length,
    [stocks]
  );

  // Actions
  const handleConfirmRdv = async (id: number) => {
    try {
      await rdvApi.confirmer(id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleCancelRdv = async (id: number) => {
    if (!confirm('Annuler ce rendez-vous ?')) return;
    try {
      await rdvApi.annuler(id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleValidateDon = async (id: number) => {
    try {
      await donApi.valider(id);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleAdjustStock = async (id: number, delta: number) => {
    try {
      await stockApi.ajusterQuantite(id, delta);
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
        <div className={styles.noData}>
          <p>Vous devez être connecté pour accéder à votre espace agent.</p>
          <Link to="/auth/login" className={styles.ctaLink}>
            Se connecter
          </Link>
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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>❌ {error}</p>
          <button onClick={fetchData} className={styles.ctaLink}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Helpers d'affichage RDV
  const labelStatutRdv = (s: StatutRDV) => {
    switch (s) {
      case 'CONFIRME': return '✓ Confirmé';
      case 'EFFECTUE': return '✓ Complété';
      case 'ANNULE': return '✕ Annulé';
      case 'EN_ATTENTE': return '⏳ En attente';
      case 'MANQUE': return '⚠ Manqué';
      default: return s;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>🩸 Interface Agent Collecte</h1>
          <p className={styles.subtitle}>Bienvenue, {user.fullName}</p>
        </div>
        <div className={styles.headerRight}>
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
          📊 Vue d'ensemble
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'appointments' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Rendez-vous ({rdvs.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'collections' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          💉 Collectes
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'stocks' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('stocks')}
        >
          📦 Stocks
        </button>
      </nav>

      <main className={styles.main}>
        {/* ============ OVERVIEW ============ */}
        {activeTab === 'overview' && (
          <div className={styles.tabContent}>
            {stocksCritiques > 0 && (
              <div className={styles.alertBox}>
                <h3>⚠️ Stocks Critiques</h3>
                <p>
                  {stocksCritiques} groupe{stocksCritiques > 1 ? 's' : ''} sanguin
                  {stocksCritiques > 1 ? 's' : ''} en stock critique
                </p>
              </div>
            )}

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>RDV Aujourd'hui</p>
                  <p className={styles.statValue}>{todayRdvs.length}</p>
                  <p className={styles.statDetail}>
                    {completedToday} complété{completedToday > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>💉</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Collectes Valides</p>
                  <p className={styles.statValue}>{validDonsCount}</p>
                  <p className={styles.statDetail}>au total</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📦</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Stocks Critiques</p>
                  <p
                    className={styles.statValue}
                    style={{ color: stocksCritiques > 0 ? '#dc2626' : 'var(--primary)' }}
                  >
                    {stocksCritiques}
                  </p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>✓</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Taux Succès</p>
                  <p className={styles.statValue}>{successRate}%</p>
                  <p className={styles.statDetail}>collectes réussies</p>
                </div>
              </div>
            </div>

            <section className={styles.scheduleSection}>
              <h2 className={styles.sectionTitle}>Rendez-vous d'Aujourd'hui</h2>
              {todayRdvs.length > 0 ? (
                <div className={styles.scheduleList}>
                  {todayRdvs.map((rdv) => {
                    const donneur = getDonneur(rdv);
                    return (
                      <div key={rdv.id} className={styles.scheduleItem}>
                        <div className={styles.scheduleTime}>
                          {new Date(rdv.dateHeure).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className={styles.scheduleInfo}>
                          <h4>
                            {donneur ? `${donneur.prenom} ${donneur.nom}` : 'Donneur inconnu'}
                          </h4>
                          <p className={styles.scheduleDetail}>
                            Groupe : {donneur ? formatGroupe(donneur.groupeSanguin) : '—'} | Tél :{' '}
                            {donneur?.telephone ?? '—'}
                          </p>
                        </div>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[rdv.statut.toLowerCase()] ?? ''
                          }`}
                        >
                          {labelStatutRdv(rdv.statut)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.noData}>Aucun rendez-vous prévu pour aujourd'hui</p>
              )}
            </section>
          </div>
        )}

        {/* ============ APPOINTMENTS ============ */}
        {activeTab === 'appointments' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Gestion des Rendez-vous</h2>

            <div className={styles.filtersBox}>
              <div className={styles.filterGroup}>
                <label>Statut :</label>
                <select
                  value={appointmentFilter}
                  onChange={(e) => setAppointmentFilter(e.target.value)}
                >
                  <option value="">Tous</option>
                  <option value="CONFIRME">Confirmés</option>
                  <option value="EFFECTUE">Complétés</option>
                  <option value="ANNULE">Annulés</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="MANQUE">Manqués</option>
                </select>
              </div>
              <button
                className={styles.resetBtn}
                onClick={() => setAppointmentFilter('')}
              >
                Réinitialiser
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Donneur</th>
                    <th>Téléphone</th>
                    <th>Groupe</th>
                    <th>Date & Heure</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRdvs.length > 0 ? (
                    filteredRdvs.map((rdv) => {
                      const donneur = getDonneur(rdv);
                      return (
                        <tr key={rdv.id}>
                          <td>
                            <strong>
                              {donneur ? `${donneur.prenom} ${donneur.nom}` : '—'}
                            </strong>
                          </td>
                          <td>{donneur?.telephone ?? '—'}</td>
                          <td>
                            <span className={styles.bloodType}>
                              {donneur ? formatGroupe(donneur.groupeSanguin) : '—'}
                            </span>
                          </td>
                          <td>
                            {new Date(rdv.dateHeure).toLocaleString('fr-FR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${
                                styles[rdv.statut.toLowerCase()] ?? ''
                              }`}
                            >
                              {labelStatutRdv(rdv.statut)}
                            </span>
                          </td>
                          <td>
                            {rdv.statut !== 'CONFIRME' && rdv.statut !== 'EFFECTUE' && (
                              <button
                                className={styles.actionIconBtn}
                                onClick={() => handleConfirmRdv(rdv.id)}
                                title="Confirmer"
                              >
                                ✓
                              </button>
                            )}
                            {rdv.statut !== 'ANNULE' && (
                              <button
                                className={styles.actionIconBtn}
                                onClick={() => handleCancelRdv(rdv.id)}
                                title="Annuler"
                              >
                                ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className={styles.noData}>
                        Aucun rendez-vous
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============ COLLECTIONS ============ */}
        {activeTab === 'collections' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Enregistrement des Collectes</h2>

            <div className={styles.filtersBox}>
              <div className={styles.filterGroup}>
                <label>Statut :</label>
                <select
                  value={donationFilter}
                  onChange={(e) => setDonationFilter(e.target.value)}
                >
                  <option value="">Tous</option>
                  <option value="VALIDE">Valides</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="REJETE">Rejetés</option>
                  <option value="EFFECTUE">Effectués</option>
                </select>
              </div>
              <button className={styles.resetBtn} onClick={() => setDonationFilter('')}>
                Réinitialiser
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Donneur</th>
                    <th>Type Sanguin</th>
                    <th>Quantité (ml)</th>
                    <th>Date Collecte</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDons.length > 0 ? (
                    filteredDons.map((don) => {
                      const donneur = getDonneur(don);
                      return (
                        <tr key={don.id}>
                          <td>
                            <strong>
                              {donneur ? `${donneur.prenom} ${donneur.nom}` : '—'}
                            </strong>
                          </td>
                          <td>
                            <span className={styles.bloodType}>
                              {donneur ? formatGroupe(donneur.groupeSanguin) : '—'}
                            </span>
                          </td>
                          <td>{don.quantite}</td>
                          <td>
                            {new Date(don.dateDon).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <span
                              className={`${styles.collectionStatus} ${
                                styles[don.statut.toLowerCase()] ?? ''
                              }`}
                            >
                              {don.statut}
                            </span>
                          </td>
                          <td>
                            {don.statut === 'EN_ATTENTE' && (
                              <button
                                className={styles.actionIconBtn}
                                onClick={() => handleValidateDon(don.id)}
                                title="Valider"
                              >
                                ✓
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className={styles.noData}>
                        Aucune collecte
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============ STOCKS ============ */}
        {activeTab === 'stocks' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Gestion des Stocks</h2>

            {stocks.length > 0 ? (
              <>
                <div className={styles.stocksGrid}>
                  {stocks.map((stock) => {
                    const niveau = calculerNiveau(stock);
                    return (
                      <div
                        key={stock.id}
                        className={`${styles.stockCard} ${styles[niveau.toLowerCase()] ?? ''}`}
                      >
                        <div className={styles.stockHeader}>
                          <h4>{formatGroupe(stock.groupeSanguin)}</h4>
                          <span className={styles.statusIndicator}>
                            {niveau === 'OK' && '🟢 Bon'}
                            {niveau === 'FAIBLE' && '🟡 Attention'}
                            {niveau === 'CRITIQUE' && '🔴 Critique'}
                          </span>
                        </div>
                        <div className={styles.stockInfo}>
                          <p className={styles.quantity}>
                            {stock.quantiteDisponible} unités
                          </p>
                          <p className={styles.lastUpdate}>
                            Seuil min : {stock.seuilMinimum ?? '—'}
                          </p>
                          {stock.localisation && (
                            <p className={styles.lastUpdate}>📍 {stock.localisation}</p>
                          )}
                        </div>
                        <div className={styles.stockActions}>
                          <button
                            className={styles.updateStockBtn}
                            onClick={() => handleAdjustStock(stock.id, 1)}
                          >
                            + 1
                          </button>
                          <button
                            className={styles.updateStockBtn}
                            onClick={() => handleAdjustStock(stock.id, -1)}
                            disabled={stock.quantiteDisponible <= 0}
                          >
                            − 1
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <section className={styles.stockSummary}>
                  <h3>Résumé des Stocks</h3>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span>🟢 Stocks Bons :</span>
                      <strong>
                        {stocks.filter((s) => calculerNiveau(s) === 'OK').length}
                      </strong>
                    </div>
                    <div className={styles.summaryItem}>
                      <span>🟡 À Surveiller :</span>
                      <strong>
                        {stocks.filter((s) => calculerNiveau(s) === 'FAIBLE').length}
                      </strong>
                    </div>
                    <div className={styles.summaryItem}>
                      <span>🔴 Stocks Critiques :</span>
                      <strong>{stocksCritiques}</strong>
                    </div>
                    <div className={styles.summaryItem}>
                      <span>📦 Total Unités :</span>
                      <strong>
                        {stocks.reduce((sum, s) => sum + s.quantiteDisponible, 0)}
                      </strong>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <p className={styles.noData}>Aucun stock enregistré.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
