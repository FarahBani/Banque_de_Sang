import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './HospitalLogin.module.css';

export default function HospitalLogin() {
  const navigate = useNavigate();
  const { login, getDashboardPath } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await login({
        email: formData.email,
        password: formData.password,
        role: 'MEDECIN_HOPITAL',
      });

      navigate(getDashboardPath(session.user.role), { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Connexion impossible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
          </div>
          <span className={styles.logoText}>SaveLife - Hôpitaux</span>
        </div>

        <h1 className={styles.title}>Espace Hôpitaux</h1>
        <p className={styles.subtitle}>Connectez-vous pour consulter les stocks</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="hopital@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit" className={styles.btn} disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>

        <p className={styles.footer}>
          Pas de compte? <a href="/contact">Demander un accès</a>
        </p>
      </div>
    </div>
  );
}
