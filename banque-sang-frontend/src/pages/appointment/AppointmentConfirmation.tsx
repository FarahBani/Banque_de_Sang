import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AppointmentConfirmation.module.css';

export default function AppointmentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className={styles.title}>Rendez-vous Confirmé!</h1>
        <p className={styles.subtitle}>Votre rendez-vous a été enregistré avec succès</p>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Nom</span>
            <span className={styles.value}>{formData.name}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{formData.email}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Téléphone</span>
            <span className={styles.value}>{formData.phone}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Groupe Sanguin</span>
            <span className={styles.value}>{formData.bloodType}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Date & Heure</span>
            <span className={styles.value}>{formData.date} à {formData.time}</span>
          </div>
        </div>

        <p className={styles.message}>
          Un email de confirmation a été envoyé à votre adresse email. Présentez-vous 15 minutes avant l'heure prévue.
        </p>

        <button onClick={() => navigate('/')} className={styles.btn}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
