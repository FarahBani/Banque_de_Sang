import StatBox from '../../components/StatBox';
import styles from './DashboardPage.module.css';

const bloodTypes = [
  { type: 'A+', pct: 85, status: 'DISPONIBLE', color: '#16a34a' },
  { type: 'O+', pct: 92, status: 'DISPONIBLE', color: '#16a34a' },
  { type: 'B+', pct: 45, status: 'MOYEN', color: '#d97706' },
  { type: 'AB+', pct: 78, status: 'DISPONIBLE', color: '#16a34a' },
  { type: 'A-', pct: 18, status: 'CRITIQUE', color: '#dc2626' },
  { type: 'O-', pct: 12, status: 'CRITIQUE', color: '#dc2626' },
  { type: 'B-', pct: 55, status: 'MOYEN', color: '#d97706' },
  { type: 'AB-', pct: 88, status: 'DISPONIBLE', color: '#16a34a' },
];

const statusColor: Record<string, string> = {
  DISPONIBLE: '#16a34a',
  MOYEN: '#d97706',
  CRITIQUE: '#dc2626',
};

const statusBg: Record<string, string> = {
  DISPONIBLE: '#f0fdf4',
  MOYEN: '#fffbeb',
  CRITIQUE: '#fef2f2',
};

export default function DashboardPage() {
  const totalPct = 72;
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (totalPct / 100) * circumference;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vue d'ensemble</h1>
        <p className={styles.subtitle}>Tableau de bord de gestion de la banque de sang</p>
      </div>

      <div className={styles.statsGrid}>
        <StatBox
          label="Total des dons"
          value="1,254"
          change="+12% ce mois"
          changeType="up"
          iconBg="#fff0f0"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
          }
        />
        <StatBox
          label="Donneurs actifs"
          value="8,432"
          change="+8% ce mois"
          changeType="up"
          iconBg="#eff6ff"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          }
        />
        <StatBox
          label="Demandes en attente"
          value="23"
          change="-5% ce mois"
          changeType="down"
          iconBg="#fff7ed"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ea580c">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          }
        />
        <StatBox
          label="Taux de croissance"
          value="94%"
          change="+2% ce mois"
          changeType="up"
          iconBg="#f0fdf4"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#16a34a">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
          }
        />
      </div>

      <div className={styles.row2}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Niveau Global des Stocks</h2>
          <div className={styles.donutWrap}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" strokeWidth="20" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#8B0000"
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
              <text x="100" y="94" textAnchor="middle" fontSize="28" fontWeight="700" fill="#1a1a1a">
                {totalPct}%
              </text>
              <text x="100" y="114" textAnchor="middle" fontSize="12" fill="#6b7280">
                Niveau total
              </text>
            </svg>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Aperçu Rapide des Stocks</h2>
          <div className={styles.bloodGrid}>
            {bloodTypes.map((bt) => (
              <div key={bt.type} className={styles.bloodItem}>
                <div className={styles.bloodType}>{bt.type}</div>
                <div className={styles.bloodPct}>{bt.pct}%</div>
                <div className={styles.barWrap}>
                  <div
                    className={styles.bar}
                    style={{ width: `${bt.pct}%`, background: bt.color }}
                  />
                </div>
                <div
                  className={styles.statusLabel}
                  style={{ color: statusColor[bt.status], background: statusBg[bt.status] }}
                >
                  {bt.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
