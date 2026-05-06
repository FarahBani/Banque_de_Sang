import { useNavigate } from 'react-router-dom';
import styles from './HospitalDashboard.module.css';

const requestsData = [
  { id: 1, bloodType: 'O+', units: 5, status: 'EN_ATTENTE', date: '2026-04-16' },
  { id: 2, bloodType: 'A+', units: 3, status: 'VALIDEE', date: '2026-04-15' },
  { id: 3, bloodType: 'B-', units: 2, status: 'URGENTE', date: '2026-04-16' },
];

export default function HospitalDashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tableau de Bord Hôpital</h1>
          <p className={styles.subtitle}>Gestion des demandes de sang</p>
        </div>
        <button onClick={() => navigate('/')} className={styles.btnLogout}>Déconnexion</button>
      </header>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Demandes En Attente</div>
            <div className={styles.statValue}>3</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Demandes Validées</div>
            <div className={styles.statValue}>8</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Demandes Urgentes</div>
            <div className={styles.statValue}>2</div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Dernières Demandes</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Groupe</th>
                <th>Unités</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {requestsData.map(req => (
                <tr key={req.id}>
                  <td><span className={styles.bloodBadge}>{req.bloodType}</span></td>
                  <td>{req.units} unités</td>
                  <td>
                    <span className={`${styles.tag} ${styles[`tag${req.status}`.toLowerCase()]}`}>
                      {req.status === 'EN_ATTENTE' && 'En attente'}
                      {req.status === 'VALIDEE' && 'Validée'}
                      {req.status === 'URGENTE' && 'Urgente'}
                    </span>
                  </td>
                  <td>{req.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
