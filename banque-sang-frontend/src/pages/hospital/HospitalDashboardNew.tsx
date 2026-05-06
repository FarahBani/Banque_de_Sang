import { useState, useEffect } from 'react';
import {
  getDemandesByHopital,
  updateDemandeStatut,
  deleteDemande,
  getHopital,
  type DemandeSang,
  type Hopital
} from '../../api/demandeSangApi';
import styles from './HospitalDashboardNew.module.css';

export default function HospitalDashboardNew() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'inventory' | 'info'>('overview');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [bloodRequests, setBloodRequests] = useState<DemandeSang[]>([]);
  const [hospitalInfo, setHospitalInfo] = useState<Hopital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const HOPITAL_ID = 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [demandes, hopital] = await Promise.all([
        getDemandesByHopital(HOPITAL_ID),
        getHopital(HOPITAL_ID)
      ]);
      setBloodRequests(demandes);
      setHospitalInfo(hopital);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Impossible de charger les données. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (id: number, nouveauStatut: string) => {
    setUpdatingId(id);
    try {
      await updateDemandeStatut(id, nouveauStatut);
      await fetchData();
    } catch (err) {
      console.error('Erreur mise à jour:', err);
      setError('Erreur lors de la mise à jour');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteDemande = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
    try {
      await deleteDemande(id);
      await fetchData();
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError('Erreur lors de la suppression');
    }
  };

  const getStatusLabel = (statut: string) => {
    const labels: Record<string, string> = {
      'urgent': '⚡ Urgent',
      'pending': '⏳ En Attente',
      'approved': '✓ Approuvée',
      'delivered': '📦 Livrée'
    };
    return labels[statut] || statut;
  };

  const getPriorityLabel = (priorite: string) => {
    const labels: Record<string, string> = {
      'haute': '🔴 Haute',
      'normale': '🟡 Normale',
      'basse': '🟢 Basse'
    };
    return labels[priorite] || priorite;
  };

  const filteredRequests = bloodRequests.filter(req => {
    const statusMatch = selectedStatus === '' || req.statut === selectedStatus;
    const priorityMatch = selectedPriority === '' || req.priorite === selectedPriority;
    return statusMatch && priorityMatch;
  });

  const urgentCount = bloodRequests.filter(r => r.statut === 'urgent').length;
  const totalUnits = bloodRequests.reduce((sum, r) => sum + (r.quantiteDemandee || 0), 0);
  const deliveredCount = bloodRequests.filter(r => r.statut === 'delivered').length;

  const bloodTypeStats = [
    { type: 'O+', total: 45, available: 28 },
    { type: 'O-', total: 25, available: 8 },
    { type: 'A+', total: 40, available: 32 },
    { type: 'A-', total: 20, available: 15 },
    { type: 'B+', total: 35, available: 22 },
    { type: 'B-', total: 15, available: 10 },
    { type: 'AB+', total: 18, available: 12 },
    { type: 'AB-', total: 10, available: 5 },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>❌ {error}</p>
        <button onClick={fetchData} className={styles.retryBtn}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>🏥 Gestion Demandes de Sang</h1>
            <p className={styles.subtitle}>{hospitalInfo?.nom || 'Hôpital'}</p>
          </div>
          <button className={styles.logoutBtn}>🚪 Déconnexion</button>
        </div>
      </header>

      <nav className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>📊 Vue d'ensemble</button>
        <button className={`${styles.tab} ${activeTab === 'requests' ? styles.active : ''}`} onClick={() => setActiveTab('requests')}>📋 Demandes</button>
        <button className={`${styles.tab} ${activeTab === 'inventory' ? styles.active : ''}`} onClick={() => setActiveTab('inventory')}>📦 Stocks</button>
        <button className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`} onClick={() => setActiveTab('info')}>ℹ️ Informations</button>
      </nav>

      <div className={styles.container}>
        {activeTab === 'overview' && (
          <div className={styles.tabContent}>
            {urgentCount > 0 && (
              <div className={styles.alertBox}>
                <h3>⚠️ Demandes Urgentes</h3>
                <p>{urgentCount} demande{urgentCount > 1 ? 's' : ''} urgente{urgentCount > 1 ? 's' : ''} en attente de traitement</p>
              </div>
            )}

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📋</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Demandes Totales</p>
                  <p className={styles.statValue}>{bloodRequests.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⚡</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Demandes Urgentes</p>
                  <p className={styles.statValue}>{urgentCount}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📦</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Unités Demandées</p>
                  <p className={styles.statValue}>{totalUnits}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✓</div>
                <div className={styles.statContent}>
                  <p className={styles.statLabel}>Demandes Livrées</p>
                  <p className={styles.statValue}>{deliveredCount}</p>
                </div>
              </div>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Demandes Urgentes</h2>
              {bloodRequests.filter(r => r.statut === 'urgent').length > 0 ? (
                <div className={styles.urgentList}>
                  {bloodRequests.filter(r => r.statut === 'urgent').map(req => (
                    <div key={req.id} className={styles.urgentItem}>
                      <div className={styles.urgentHeader}>
                        <span className={styles.bloodTypeBadge}>{req.groupeSanguin}</span>
                        <span className={styles.unitsInfo}>{req.quantiteDemandee} unités</span>
                        <span className={styles.urgentBadge}>URGENT</span>
                      </div>
                      <p className={styles.reason}>{req.description}</p>
                      <p className={styles.dueDate}>À livrer avant: {new Date(req.dateRequise).toLocaleDateString('fr-FR')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>Aucune demande urgente</p>
              )}
            </section>

            <section className={styles.actionsSection}>
              <button className={styles.actionBtn}>🆕 Nouvelle Demande</button>
              <button className={styles.actionBtn}>📞 Contacter la Banque</button>
              <button className={styles.actionBtn}>📥 Importer Demandes</button>
            </section>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Gestion des Demandes</h2>

            <div className={styles.filtersBox}>
              <div className={styles.filterGroup}>
                <label>Statut:</label>
                <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                  <option value="">Tous</option>
                  <option value="urgent">Urgentes</option>
                  <option value="pending">En Attente</option>
                  <option value="approved">Approuvées</option>
                  <option value="delivered">Livrées</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Priorité:</label>
                <select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)}>
                  <option value="">Tous</option>
                  <option value="haute">Haute</option>
                  <option value="normale">Normale</option>
                  <option value="basse">Basse</option>
                </select>
              </div>
              <button className={styles.resetBtn} onClick={() => { setSelectedStatus(''); setSelectedPriority(''); }}>Réinitialiser</button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Type Sanguin</th>
                    <th>Unités</th>
                    <th>Statut</th>
                    <th>Priorité</th>
                    <th>Description</th>
                    <th>Date Demande</th>
                    <th>Date Requise</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(req => (
                    <tr key={req.id}>
                      <td>{req.groupeSanguin}</td>
                      <td>{req.quantiteDemandee}</td>
                      <td>
                        <select
                          value={req.statut}
                          onChange={(e) => handleUpdateStatut(req.id, e.target.value)}
                          disabled={updatingId === req.id}
                          className={styles.statusSelect}
                        >
                          <option value="pending">⏳ En Attente</option>
                          <option value="approved">✓ Approuvée</option>
                          <option value="delivered">📦 Livrée</option>
                          <option value="urgent">⚡ Urgent</option>
                        </select>
                      </td>
                      <td>
                        <span className={`${styles.priorityBadge} ${styles[req.priorite]}`}>
                          {getPriorityLabel(req.priorite)}
                        </span>
                      </td>
                      <td>{req.description || '-'}</td>
                      <td>{new Date(req.dateDemande).toLocaleDateString('fr-FR')}</td>
                      <td>{new Date(req.dateRequise).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteDemande(req.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.resultCount}>{filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''} affichée{filteredRequests.length !== 1 ? 's' : ''}</p>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Stocks de Sang par Type</h2>
            <div className={styles.inventoryGrid}>
              {bloodTypeStats.map(stat => (
                <div key={stat.type} className={styles.inventoryCard}>
                  <div className={styles.inventoryHeader}><h4>{stat.type}</h4></div>
                  <div className={styles.inventoryInfo}>
                    <div className={styles.inventoryRow}><span>Total:</span><strong>{stat.total} ml</strong></div>
                    <div className={styles.inventoryRow}><span>Disponible:</span><strong>{stat.available} ml</strong></div>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${(stat.available / stat.total) * 100}%` }}></div>
                  </div>
                  <p className={styles.percentage}>{Math.round((stat.available / stat.total) * 100)}% disponible</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'info' && hospitalInfo && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Informations Hôpital</h2>
            <div className={styles.infoCard}>
              <div className={styles.infoGroup}>
                <h4>🏥 Établissement</h4>
                <div className={styles.infoField}><label>Nom:</label><p>{hospitalInfo.nom}</p></div>
                <div className={styles.infoField}><label>Adresse:</label><p>{hospitalInfo.adresse || 'Non renseignée'}</p></div>
                <div className={styles.infoField}><label>Téléphone:</label><p>{hospitalInfo.telephone || 'Non renseigné'}</p></div>
                <div className={styles.infoField}><label>Email:</label><p>{hospitalInfo.email || 'Non renseigné'}</p></div>
              </div>
              <div className={styles.infoGroup}>
                <h4>👥 Contacts Principaux</h4>
                <div className={styles.infoField}><label>Directeur:</label><p>À renseigner</p></div>
                <div className={styles.infoField}><label>Responsable Banque Sanguin:</label><p>À renseigner</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}