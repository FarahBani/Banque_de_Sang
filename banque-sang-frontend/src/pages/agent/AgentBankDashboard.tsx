import { useState } from 'react';
import styles from './AgentBankDashboard.module.css';

const appointmentsData = [
  { id: 1, donneur: 'Ali Mohamed', date: '2026-04-20', heure: '10:00', status: 'EN_ATTENTE' },
  { id: 2, donneur: 'Fatima Zahra', date: '2026-04-21', heure: '14:30', status: 'CONFIRMÉ' },
];

const stocksData = [
  { group: 'O+', units: 45, status: 'BON' },
  { group: 'O-', units: 8, status: 'CRITIQUE' },
  { group: 'A+', units: 32, status: 'BON' },
  { group: 'B+', units: 18, status: 'MOYEN' },
];

export default function AgentBankDashboard() {
  const [tab, setTab] = useState<'rendez-vous' | 'dons' | 'stocks'>('rendez-vous');
  const [appointments, setAppointments] = useState(appointmentsData);

  const validateAppointment = (id: number) => {
    setAppointments(appointments.map(a =>
      a.id === id ? { ...a, status: 'CONFIRMÉ' } : a
    ));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Agent de Banque de Sang</h1>
        <p className={styles.subtitle}>Gérez les rendez-vous, dons et stocks</p>
      </header>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'rendez-vous' ? styles.active : ''}`}
            onClick={() => setTab('rendez-vous')}
          >
            📅 Rendez-vous ({appointments.length})
          </button>
          <button
            className={`${styles.tab} ${tab === 'dons' ? styles.active : ''}`}
            onClick={() => setTab('dons')}
          >
            💉 Dons
          </button>
          <button
            className={`${styles.tab} ${tab === 'stocks' ? styles.active : ''}`}
            onClick={() => setTab('stocks')}
          >
            📦 Stocks
          </button>
        </div>

        {/* Rendez-vous */}
        {tab === 'rendez-vous' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Rendez-vous à Valider</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Donneur</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td>{appt.donneur}</td>
                    <td>{appt.date}</td>
                    <td>{appt.heure}</td>
                    <td>
                      <span className={`${styles.tag} ${styles[`tag${appt.status.toLowerCase()}`]}`}>
                        {appt.status === 'EN_ATTENTE' ? 'En attente' : 'Confirmé'}
                      </span>
                    </td>
                    <td>
                      {appt.status === 'EN_ATTENTE' && (
                        <button
                          className={styles.btnValidate}
                          onClick={() => validateAppointment(appt.id)}
                        >
                          ✓ Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dons */}
        {tab === 'dons' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Nouveau Don</h2>
            <div className={styles.formCard}>
              <div className={styles.formGroup}>
                <label>Scanner QR ou ID Donneur</label>
                <input type="text" placeholder="Ex: QR12345" />
              </div>
              <button className={styles.btnPrimary}>🩸 Enregistrer Don</button>
            </div>
          </div>
        )}

        {/* Stocks */}
        {tab === 'stocks' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Stocks Actuels</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Groupe</th>
                  <th>Unités</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stocksData.map(stock => (
                  <tr key={stock.group}>
                    <td>{stock.group}</td>
                    <td>{stock.units}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status${stock.status}`]}`}>
                        {stock.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.btnSmall}>Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
