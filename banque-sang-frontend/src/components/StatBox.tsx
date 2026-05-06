import styles from './StatBox.module.css';

interface StatBoxProps {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatBox({ label, value, change, changeType, icon, iconBg }: StatBoxProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
        </div>
        <div className={styles.icon} style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.change} ${styles[changeType]}`}>{change}</div>
    </div>
  );
}